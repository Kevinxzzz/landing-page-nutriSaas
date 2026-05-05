import { useState, useRef, useEffect } from 'react';
import { StatusAgendamento } from '@nutricao/shared';
import styles from './StatusBadge.module.scss';

const statusLabels: Record<string, string> = {
  AGENDADO: 'Agendado',
  CONFIRMOU: 'Confirmou',
  PRESENTE: 'Presente',
  ENCAIXE: 'Encaixe',
  CANCELADO: 'Cancelado',
  NAO_COMPARECEU: 'Não Compareceu',
  REALIZADO: 'Realizado',
  DESISTIU: 'Desistiu',
  REMARCOU: 'Remarcou',
};

interface StatusBadgeProps {
  status: string;
  onChangeStatus?: (status: string) => void;
}

export function StatusBadge({ status, onChangeStatus }: StatusBadgeProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <span
        className={`${styles.badge} ${styles[status] || ''}`}
        onClick={() => onChangeStatus && setOpen(!open)}
      >
        {statusLabels[status] || status}
      </span>

      {open && onChangeStatus && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 4,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 50,
            minWidth: 160,
            padding: '0.25rem 0',
          }}
        >
          {Object.values(StatusAgendamento).map((s) => (
            <button
              key={s}
              onClick={() => {
                onChangeStatus(s);
                setOpen(false);
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.5rem 1rem',
                textAlign: 'left',
                fontSize: '0.8125rem',
                border: 'none',
                background: s === status ? '#f3f4f6' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <span className={`${styles.badge} ${styles[s]}`}>
                {statusLabels[s]}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
