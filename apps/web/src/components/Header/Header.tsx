import { useLocation } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  LogoutIcon,
  NotificationIcon,
  Menu01Icon,
} from '@hugeicons/core-free-icons';
import { useAuthStore } from '@/stores/authStore';
import { useLogout } from '@/hooks/useAuth';
import styles from './Header.module.scss';

const pageTitles: Record<string, string> = {
  '/': 'Início',
  '/agenda': 'Agenda',
  '/pacientes': 'Pacientes',
  '/exames': 'Exames',
  '/relatorios': 'Relatórios',
  '/configuracoes': 'Configurações',
};

const pageSubtitles: Record<string, string> = {
  '/': 'Visão geral da sua clínica',
  '/agenda': 'Gerencie seus agendamentos',
  '/pacientes': 'Cadastro e prontuários',
  '/exames': 'Exames base e personalizados da clinica',
  '/relatorios': 'Análises e métricas',
  '/configuracoes': 'Preferências do sistema',
};

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const { mutate: logout } = useLogout();

  const basePath = '/' + (location.pathname.split('/')[1] || '');
  const title = pageTitles[basePath] || 'NutriSaaS';
  const subtitle = pageSubtitles[basePath] || '';

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {/* Botão hambúrguer — visível apenas no mobile */}
        <button
          className={styles.menuBtn}
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <HugeiconsIcon icon={Menu01Icon} size={20} strokeWidth={2} />
        </button>

        <div>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.iconBtn} title="Notificações">
          <HugeiconsIcon icon={NotificationIcon} size={18} strokeWidth={1.8} />
        </button>

        <div className={styles.divider} />

        {user && (
          <div className={styles.userChip}>
            <div className={styles.userDot} />
            <span className={styles.userEmail}>{user.email}</span>
          </div>
        )}

        <button
          className={styles.logoutBtn}
          onClick={() => logout()}
          title="Sair"
        >
          <HugeiconsIcon icon={LogoutIcon} size={16} strokeWidth={1.8} />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
}
