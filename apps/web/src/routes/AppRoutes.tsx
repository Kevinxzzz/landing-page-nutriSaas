import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout/DashboardLayout';
import { LoginPage } from '@/pages/Login/LoginPage';
import { DashboardPage } from '@/pages/Dashboard/DashboardPage';
import { AgendaPage } from '@/pages/Agenda/AgendaPage';
import { PacientesPage } from '@/pages/Pacientes/Listagem/PacientesPage';
import { PacienteFormPage } from '@/pages/Pacientes/Cadastro/PacienteFormPage';
import { ProntuarioPage } from '@/pages/Pacientes/Prontuario/ProntuarioPage';
import { ConfigPage } from '@/pages/Configuracoes/ConfigPage';
import { RelatoriosPage } from '@/pages/Relatorios/RelatoriosPage';
import { ExamesPage } from '@/pages/Exames/ExamesPage';
import { OnboardingPage } from '@/pages/Onboarding/OnboardingPage';
import { EsqueciSenhaPage } from '@/pages/RedefinirSenha/EsqueciSenhaPage';
import { RedefinirSenhaPage } from '@/pages/RedefinirSenha/RedefinirSenhaPage';
import { ResponderQuestionarioPage } from '@/pages/Questionario/Responder/ResponderQuestionarioPage';
import { AvaliacaoDetalhesPage } from '@/pages/Pacientes/AvaliacaoDetalhes/AvaliacaoDetalhesPage';
import { ComparativoPage } from '@/pages/Pacientes/Comparativo/ComparativoPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<OnboardingPage />} />
        <Route path="/esqueci-senha" element={<EsqueciSenhaPage />} />
        <Route
          path="/questionarios/:questionarioId/pacientes/:pacienteId/responder"
          element={<ResponderQuestionarioPage />}
        />
        <Route
          path="/redefinir-senha"
          element={<Navigate to="/esqueci-senha" replace />}
        />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/pacientes" element={<PacientesPage />} />
            <Route path="/pacientes/novo" element={<PacienteFormPage />} />
            <Route path="/pacientes/:id" element={<ProntuarioPage />} />
            <Route path="/pacientes/:id/editar" element={<PacienteFormPage />} />
            <Route path="/pacientes/:pacienteId/comparativo" element={<ComparativoPage />} />
            <Route path="/exames" element={<ExamesPage />} />
            <Route path="/relatorios" element={<RelatoriosPage />} />
            <Route path="/configuracoes" element={<ConfigPage />} />
            <Route
              path="/avaliacoes/:avaliacaoId/:pacienteId"
              element={<AvaliacaoDetalhesPage />}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
