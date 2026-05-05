import { APIRequestContext } from '@playwright/test';

export async function loginAndGetToken(request: APIRequestContext): Promise<string> {
  const response = await request.post('/api/auth/login', {
    data: {
      email: 'admin@nutricao.com',
      senha: '123456',
    }
  });
  if (!response.ok()) {
    const errorBody = await response.text();
    throw new Error(`Failed to login in E2E setup. Status: ${response.status()}, Body: ${errorBody}`);
  }
  const body = await response.json();
  return body.data.accessToken;
}

export async function getPrimeiroQuestionario(request: APIRequestContext, token: string) {
  const response = await request.get('/api/questionarios', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok()) {
    throw new Error(`Failed to fetch questionarios: ${response.status()}`);
  }
  const res = await response.json();
  const questionarios = res.data?.data;
  if (!questionarios || questionarios.length === 0) {
    throw new Error('Nenhum questionário encontrado no banco de dados para o E2E');
  }
  return questionarios[0];
}

export async function getPrimeiroPaciente(request: APIRequestContext, token: string) {
  const response = await request.get('/api/pacientes', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok()) {
    throw new Error(`Failed to fetch pacientes: ${response.status()}`);
  }
  const res = await response.json();
  const pacientes = res.data?.data;
  if (!pacientes || pacientes.length === 0) {
    // Autocriar paciente caso a base tenha sido resetada mas não populada
    const createRes = await request.post('/api/pacientes', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        nome: `Paciente Mock E2E ${Date.now()}`,
        email: `mock-${Date.now()}@teste.com`,
      }
    });
    if (!createRes.ok()) throw new Error('Falha ao autocriar paciente para DB vazio');
    const created = await createRes.json();
    return created.data;
  }
  return pacientes[0];
}

export async function setupE2EMockData(request: APIRequestContext) {
  const token = await loginAndGetToken(request);
  const questionario = await getPrimeiroQuestionario(request, token);
  const paciente = await getPrimeiroPaciente(request, token);
  
  return {
    token,
    questionario,
    paciente
  };
}
