import { test, expect, type Page } from '@playwright/test';

// Utilizando execução em série garantimos ordem lógica do fluxo sem interrupções
// de concorrência que quebram acessos a dados no banco.
test.describe.serial('Jornada Completa do Usuário (Macro E2E)', () => {
  const timestamp = Date.now();
  const clincaNome = `Clinica E2E ${timestamp}`;
  const adminEmail = `admin-${timestamp}@e2etest.com`;
  const pacienteNome = `Paciente Teste ${timestamp}`;
  const pacienteEmail = `paciente-${timestamp}@teste.com`;

  let pacienteId: string;
  let questionarioId: string;
  let authToken: string;

  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Etapa 1: Cadastro da Clínica e Nutricionista', async () => {
    await page.goto('/cadastro');
    
    // Formulário Clinica
    await page.getByPlaceholder('Ex: Clínica Nutri Vida').fill(clincaNome);
    
    // Formulário Administrador
    await page.getByPlaceholder('Seu nome').fill('Nutricionista E2E Admin');
    await page.getByPlaceholder('seu@email.com').fill(adminEmail);
    await page.getByPlaceholder('Mínimo 6 caracteres').fill('123456');

    // Submeter
    await page.getByRole('button', { name: 'Cadastrar Clínica' }).click();

    // Deve ser redirecionado para a o Dashboard após token armazenado
    await page.waitForURL(/.*\/$/, { timeout: 15000 });
    
    // Certificar que logou (botão sair, ou layout presente)
    await expect(page.locator('h2', { hasText: /Resumo|Dashboard|Pacientes|Agenda/i }).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Sair').first()).toBeVisible();

    // Fazer logout no fim desta etapa para provar que a rota de Login pura funciona depois
    await page.getByText('Sair').click();
    await page.waitForURL('**/login');
  });

  test('Etapa 2: Login com credenciais criadas', async () => {
    test.setTimeout(30000); // Mais tempo pro step
    await page.goto('/login');
    await page.getByPlaceholder('seu@email.com').fill(adminEmail);
    await page.getByPlaceholder('Sua senha').fill('123456');
    await page.getByRole('button', { name: 'Acessar' }).click();

    await page.waitForURL(/.*\/(agenda|pacientes)?$/);
    await expect(page.getByText('Sair').first()).toBeVisible();

    // Capturar token direto do localStorage pra uso futuro dinâmico
    const authStoreStr = await page.evaluate(() => window.localStorage.getItem('nutricao-auth'));
    if (authStoreStr) {
      const authStore = JSON.parse(authStoreStr);
      authToken = authStore.state.accessToken;
    }
  });

  test('Etapa 3: Cadastro de Paciente via Dashboard', async () => {
    // A partir do Dashboard, clica no menu Pacientes
    await page.getByRole('link', { name: /Pacientes/i }).first().click();
    await page.waitForURL('**/pacientes');

    // Clica no botão Novo Paciente
    await page.getByRole('button', { name: /Novo Paciente/i }).click();

    await expect(page.locator('h2', { hasText: 'Novo Paciente' })).toBeVisible();

    // Preencher apenas obrigatórios / importantes
    await page.getByPlaceholder('Nome completo').fill(pacienteNome);
    await page.getByPlaceholder('email@exemplo.com').fill(pacienteEmail);
    await page.locator('select[name="sexo"]').selectOption('MASCULINO');

    await page.getByRole('button', { name: 'Cadastrar' }).click();

    // Aguarda o grid de pacientes listando o novo paciente (dispensando waitForURL por causa dos SPAs events)
    await expect(page.locator(`text=${pacienteNome}`).first()).toBeVisible({ timeout: 15000 });
  });

  test('Etapa Intermediária: Extrair IDs via API local do E2E', async ({ request }) => {
    expect(authToken).toBeTruthy();

    // Buscar Paciente
    const pResponse = await request.get('/api/pacientes', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const pData = await pResponse.json();
    expect(pData.data.data.length).toBeGreaterThan(0);
    pacienteId = pData.data.data[0].id;

    // Buscar Questionario da clinica
    const qResponse = await request.get('/api/questionarios', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const qData = await qResponse.json();
    expect(qData.data.data.length).toBeGreaterThan(0);
    questionarioId = qData.data.data[0].id;
  });

  test('Etapa 4: Agendamento de uma consulta', async () => {
    // Clica link da Agenda
    await page.getByRole('link', { name: /Agenda/i }).first().click();
    
    // Confirma que a página de agenda abriu
    await expect(page.getByRole('button', { name: /Agendar/i })).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: /Agendar/i }).click();

    // Aparece modal (select de paciente)
    // O select do react-hook-form pode ser um <select> html padrão se não usou lib complexa
    // É mais fácil usar texto se houver label "Paciente"
    await page.locator('select[name="pacienteId"]').selectOption(pacienteId);
    
    await page.locator('select[name="tipo"]').selectOption('CONSULTA');
    
    // Data/hora para datetime-local (YYYY-MM-DDTHH:mm)
    // Lê a data que a UI considera "hoje" para evitar descompasso de fuso horário Teste vs Chromium
    const currentViewDate = await page.locator('input[type="date"]').inputValue();
    await page.locator('input[type="datetime-local"]').fill(`${currentViewDate}T14:30`);

    await page.locator('form').getByRole('button', { name: 'Agendar' }).click();

    // Modal fecha e consulta deve renderizar na tabela (ex: 14:30 e Nome do paciente)
    await expect(page.locator('td', { hasText: pacienteNome }).first()).toBeVisible({ timeout: 5000 });
  });

  test('Etapa 5: Preenchimento de Questionário Público', async () => {
    test.setTimeout(45000); // Dar tempo extra para o fluxo E2E complexo

    // Abre URL publica (deslogada virtualmente)
    await page.goto(`/questionarios/${questionarioId}/pacientes/${pacienteId}/responder`);
    
    await expect(page.locator('h1').first()).toBeVisible();

    // [Testes Negativos Iniciais] Tentar enviar vazio para confirmar bloqueio
    await page.getByRole('button', { name: 'Finalizar Questionário' }).click();

    // A UI do react deve explodir algum estilo de erro e a URL se manter.
    // Vamos apenas assegurar que ele NÃO exibiu sucesso
    await expect(page.locator('text=Questionário preenchido com sucesso')).not.toBeVisible();

    // Agora, interceptar e simular formulário inativo temporariamente
    await page.route('**/api/pacientes/*/questionarios/*/avaliacoes', async route => {
      // Mockamos um error 400
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Questionário inativo ou não existe.' })
      });
    });

    // Submetter "inativo interceptado" ignorando se a validação JS deixou passar.
    // Pra contornar o required, vamos preencher as opções (vamos submeter validamente, mas o backend fake vai rejeitar)
    const gruposParaRejeitar = await page.locator('article[id^="pergunta-"]').all();
    for (const grupo of gruposParaRejeitar) {
      const options = await grupo.locator('label').all();
      if (options.length > 0) {
        await options[0].click();
      }
    }

    await page.getByRole('button', { name: 'Finalizar Questionário' }).click();
    
    // A UI exibirá o erro Mock
    await expect(page.locator('text=Questionário inativo ou não existe.')).toBeVisible();

    // Remover a interceptação de falha para testar o sucesso total
    await page.unroute('**/api/pacientes/*/questionarios/*/avaliacoes');

    // Mudar as escolhas para a prova real do Prontuario (marcaremos a última alternativa disponível de todos)
    let scoreEsperado = 0;
    const gruposParaAcertar = await page.locator('article[id^="pergunta-"]').all();
    for (const grupo of gruposParaAcertar) {
      const options = await grupo.locator('label').all();
      if (options.length > 0) {
        const lastOption = options[options.length - 1];
        await lastOption.click();
        
        const inputVal = await lastOption.locator('input').inputValue();
        scoreEsperado += parseInt(inputVal || '0', 10);
      }
    }

    // Submeter com sucesso total
    await page.getByRole('button', { name: 'Finalizar Questionário' }).click();
    await expect(page.locator('text=Questionário preenchido com sucesso')).toBeVisible({ timeout: 10000 });

    // Salva o score de forma global pra usar na proxima etapa (anexa no teste ou state)
    process.env._SCORE_E2E_ = String(scoreEsperado);
  });

  test('Etapa 6: Validar o Score no Prontuário do Login da Clínica', async () => {
    // Fazer Login Novamente
    await page.goto('/login');
    await page.getByPlaceholder('seu@email.com').fill(adminEmail);
    await page.getByPlaceholder('Sua senha').fill('123456');
    await page.getByRole('button', { name: 'Acessar' }).click();

    // Aguardar entrada
    await page.waitForURL(/.*\/(agenda|pacientes)?$/);

    // Ir pro Prontuario
    await page.goto(`/pacientes/${pacienteId}`);
    
    // Validar visualmente o aside
    await expect(page.locator('aside', { hasText: 'Resultados de Questionários' })).toBeVisible({ timeout: 10000 });

    const expectedScore = process.env._SCORE_E2E_ || "0";
    const scoreLocator = page.locator('span', { hasText: `Score: ${expectedScore}` }).first();
    await expect(scoreLocator).toBeVisible();
  });
});
