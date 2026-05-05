import { useState } from 'react';
import { ConveniosConfig } from './Convenios/ConveniosConfig';
import { ExamesBaseConfig } from './ExamesBase/ExamesBaseConfig';
import { UsuariosConfig } from './Usuarios/UsuariosConfig';
import styles from './ConfigPage.module.scss';

type Tab = 'convenios' | 'exames' | 'usuarios';

export function ConfigPage() {
  const [tab, setTab] = useState<Tab>('convenios');

  return (
    <div>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'convenios' ? styles.active : ''}`}
          onClick={() => setTab('convenios')}
        >
          Convênios
        </button>
        <button
          className={`${styles.tab} ${tab === 'exames' ? styles.active : ''}`}
          onClick={() => setTab('exames')}
        >
          Exames Base
        </button>
        <button
          className={`${styles.tab} ${tab === 'usuarios' ? styles.active : ''}`}
          onClick={() => setTab('usuarios')}
        >
          Usuários
        </button>
      </div>

      {tab === 'convenios' && <ConveniosConfig />}
      {tab === 'exames' && <ExamesBaseConfig />}
      {tab === 'usuarios' && <UsuariosConfig />}
    </div>
  );
}
