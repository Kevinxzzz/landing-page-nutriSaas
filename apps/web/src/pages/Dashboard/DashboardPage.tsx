import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  UserGroupIcon,
  CalendarIcon,
  TickIcon,
  CancelCircleIcon,
  PlusSignIcon,
  ArrowRightIcon,
  PlayCircleIcon,
  ClockIcon,
} from '@hugeicons/core-free-icons';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import styles from './DashboardPage.module.scss';

const statusLabels: Record<string, string> = {
  AGENDADO: 'Agendado', CONFIRMOU: 'Confirmou', PRESENTE: 'Presente',
  ENCAIXE: 'Encaixe', CANCELADO: 'Cancelado', NAO_COMPARECEU: 'Faltou',
  REALIZADO: 'Realizado', DESISTIU: 'Desistiu', REMARCOU: 'Remarcou',
};

const statusColors: Record<string, string> = {
  AGENDADO: 'blue', CONFIRMOU: 'green', PRESENTE: 'green',
  ENCAIXE: 'orange', CANCELADO: 'red', NAO_COMPARECEU: 'red',
  REALIZADO: 'teal', DESISTIU: 'red', REMARCOU: 'orange',
};

const tipoLabels: Record<string, string> = {
  CONSULTA: 'Consulta',
  RETORNO: 'Retorno',
};

// Gera slots de horário das 7h às 20h
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 7; h <= 20; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
  }
  return slots;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard');
      return data.data;
    },
  });

  if (isLoading || !data) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner} />
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  const {
    totalPacientes, pacientesMes, agendaHoje,
    realizadosMes, canceladosMes,
    proximosAgendamentos,
  } = data;

  const timeSlots = generateTimeSlots();
  const isNutricionista = user?.perfil === 'NUTRICIONISTA';

  // Agrupar agendamentos por hora
  const agendamentosPorHora: Record<string, any[]> = {};
  proximosAgendamentos.forEach((ag: any) => {
    const hora = formatTime(ag.dataHora);
    const horaCheia = hora.split(':')[0] + ':00';
    if (!agendamentosPorHora[horaCheia]) agendamentosPorHora[horaCheia] = [];
    agendamentosPorHora[horaCheia].push(ag);
  });

  return (
    <div className={styles.page}>
      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIcon} ${styles.kpiGreen}`}>
            <HugeiconsIcon icon={UserGroupIcon} size={20} strokeWidth={1.8} />
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{totalPacientes}</span>
            <span className={styles.kpiLabel}>Pacientes</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIcon} ${styles.kpiBlue}`}>
            <HugeiconsIcon icon={CalendarIcon} size={20} strokeWidth={1.8} />
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{agendaHoje}</span>
            <span className={styles.kpiLabel}>Hoje</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIcon} ${styles.kpiTeal}`}>
            <HugeiconsIcon icon={TickIcon} size={20} strokeWidth={1.8} />
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{realizadosMes}</span>
            <span className={styles.kpiLabel}>Realizados</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIcon} ${styles.kpiRed}`}>
            <HugeiconsIcon icon={CancelCircleIcon} size={20} strokeWidth={1.8} />
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{canceladosMes}</span>
            <span className={styles.kpiLabel}>Cancelados</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIcon} ${styles.kpiPurple}`}>
            <HugeiconsIcon icon={PlusSignIcon} size={20} strokeWidth={1.8} />
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{pacientesMes}</span>
            <span className={styles.kpiLabel}>Novos (mês)</span>
          </div>
        </div>
      </div>

      {/* Agenda do Dia */}
      <div className={styles.agendaSection}>
        <div className={styles.agendaHeader}>
          <div>
            <h2 className={styles.agendaTitle}>Agenda do Dia</h2>
            <p className={styles.agendaSubtitle}>
              {new Date().toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <Link to="/agenda" className={styles.agendaLink}>
            Ver agenda completa
            <HugeiconsIcon icon={ArrowRightIcon} size={14} strokeWidth={2} />
          </Link>
        </div>

        <div className={styles.timeline}>
          {timeSlots.map((slot) => {
            const agendamentos = agendamentosPorHora[slot] || [];
            const hasContent = agendamentos.length > 0;

            return (
              <div
                key={slot}
                className={`${styles.timeRow} ${hasContent ? styles.timeRowActive : ''}`}
              >
                <div className={styles.timeLabel}>
                  <span>{slot}</span>
                </div>
                <div className={styles.timeLine}>
                  <div className={`${styles.timeDot} ${hasContent ? styles.timeDotActive : ''}`} />
                </div>
                <div className={styles.timeContent}>
                  {agendamentos.map((ag: any) => (
                    <div key={ag.id} className={styles.appointmentCard}>
                      <div className={styles.appointmentTop}>
                        <div className={styles.appointmentInfo}>
                          <span className={styles.appointmentTime}>
                            <HugeiconsIcon icon={ClockIcon} size={12} strokeWidth={2} />
                            {formatTime(ag.dataHora)}
                          </span>
                          <h4 className={styles.appointmentName}>
                            {ag.paciente.nome}
                          </h4>
                          <div className={styles.appointmentMeta}>
                            <span className={`${styles.badge} ${styles[`badge_${statusColors[ag.status] || 'blue'}`]}`}>
                              {statusLabels[ag.status] || ag.status}
                            </span>
                            <span className={styles.badgeType}>
                              {tipoLabels[ag.tipo] || ag.tipo}
                            </span>
                            {ag.encaixe && (
                              <span className={styles.badgeEncaixe}>Encaixe</span>
                            )}
                          </div>
                        </div>
                        <div className={styles.appointmentActions}>
                          {isNutricionista && (
                            <button
                              className={styles.startBtn}
                              onClick={() => navigate(`/pacientes/${ag.paciente.id}`)}
                              title="Iniciar atendimento"
                            >
                              <HugeiconsIcon icon={PlayCircleIcon} size={16} strokeWidth={1.8} />
                              <span>Atender</span>
                            </button>
                          )}
                        </div>
                      </div>
                      {ag.paciente.telefone && (
                        <span className={styles.appointmentPhone}>
                          {ag.paciente.telefone}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
