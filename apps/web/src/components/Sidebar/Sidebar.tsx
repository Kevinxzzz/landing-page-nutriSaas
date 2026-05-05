import { NavLink } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  DashboardSquareIcon,
  CalendarIcon,
  UserGroupIcon,
  TestTubeIcon,
  BarChartIcon,
  SettingsIcon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons';
import { useAuthStore } from '@/stores/authStore';
import styles from './Sidebar.module.scss';

const navItems = [
  { to: '/', label: 'Início', icon: DashboardSquareIcon },
  { to: '/agenda', label: 'Agenda', icon: CalendarIcon },
  { to: '/pacientes', label: 'Pacientes', icon: UserGroupIcon },
  { to: '/exames', label: 'Exames', icon: TestTubeIcon },
  { to: '/relatorios', label: 'Relatórios', icon: BarChartIcon },
  { to: '/configuracoes', label: 'Configurações', icon: SettingsIcon },
];

function getInitials(str: string): string {
  return str
    .split(/[@.\s]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join('')
    .toUpperCase();
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      {/* Logo + botão fechar (mobile) */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>N</div>
        <span className={styles.logoText}>NutriSaaS</span>

        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2} />
        </button>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <p className={styles.navLabel}>Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <HugeiconsIcon icon={item.icon} size={18} strokeWidth={2} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      {user && (
        <div className={styles.userSection}>
          <div className={styles.userAvatar}>
            {getInitials(user.email)}
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user.email.split('@')[0]}</p>
            <p className={styles.userRole}>{user.perfil}</p>
          </div>
        </div>
      )}
    </aside>
  );
}
