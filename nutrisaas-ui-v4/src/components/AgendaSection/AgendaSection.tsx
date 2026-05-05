import { useEffect, useRef } from 'react';
import './AgendaSection.scss';

export default function AgendaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rows = [
    {
      time: '08:00',
      cells: [
        { name: 'Maria O.', type: 'Retorno', color: 'green' },
        { name: 'Carlos S.', type: '1ª Consulta', color: 'blue' },
        null,
        { name: 'Lucia R.', type: 'Retorno', color: 'green' },
        null,
      ],
    },
    {
      time: '09:00',
      cells: [
        null,
        { name: 'Ana P.', type: 'Avaliação', color: 'purple' },
        { name: 'Pedro M.', type: 'Retorno', color: 'green' },
        null,
        { name: 'Julia F.', type: '1ª Consulta', color: 'blue' },
      ],
    },
    {
      time: '10:00',
      cells: [
        { name: 'Bruno L.', type: 'Avaliação', color: 'purple' },
        null,
        { name: 'Fernanda C.', type: 'Retorno', color: 'green' },
        { name: 'Rafael T.', type: '1ª Consulta', color: 'blue' },
        null,
      ],
    },
    {
      time: '11:00',
      cells: [
        null,
        { name: 'Camila D.', type: 'Retorno', color: 'green' },
        null,
        null,
        { name: 'Marcos V.', type: 'Avaliação', color: 'purple' },
      ],
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const appts = section.querySelectorAll('.agenda-appt');
    const notif = section.querySelector('.agenda-notif');
    if (!appts.length) return;

    let timeoutIds: ReturnType<typeof setTimeout>[] = [];
    let i = 0;

    function showNext() {
      if (i < appts.length) {
        appts[i].classList.add('agenda-appt--visible');
        i++;
        const id = setTimeout(showNext, 600);
        timeoutIds.push(id);
      } else if (notif) {
        const id1 = setTimeout(() => notif.classList.add('agenda-notif--visible'), 400);
        const id2 = setTimeout(() => {
          notif.classList.remove('agenda-notif--visible');
          appts.forEach((a) => a.classList.remove('agenda-appt--visible'));
          i = 0;
          const id3 = setTimeout(showNext, 1000);
          timeoutIds.push(id3);
        }, 4000);
        timeoutIds.push(id1, id2);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          showNext();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      timeoutIds.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="agenda-section" id="agenda" ref={sectionRef}>
      <div className="container">
        <div className="agenda__header">
          <div className="agenda-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span>Agenda Viva</span>
          </div>
          <h2 className="agenda-title">Sua agenda, sempre atualizada</h2>
          <p className="agenda-subtitle">Veja consultas sendo marcadas em tempo real. Sua secretária agenda, você vê instantaneamente.</p>
        </div>

        <div className="agenda__wrapper">
          <div className="agenda-cal">
            <div className="agenda-cal__header">
              <div className="agenda-cal__title">Semana — 28 Abr a 02 Mai</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="agenda-live">
                  <span className="agenda-live__dot"></span> 
                  Ao vivo
                </span>
                <div className="agenda-cal__nav">
                  <button className="agenda-cal__nav-btn" aria-label="Anterior">‹</button>
                  <button className="agenda-cal__nav-btn" aria-label="Próximo">›</button>
                </div>
              </div>
            </div>

            <div className="agenda-cal__scroll">
              <div className="agenda-cal__table">
                <div className="agenda-cal__days">
                  <div className="agenda-cal__day-header"></div>
                  <div className="agenda-cal__day-header">Seg 28</div>
                  <div className="agenda-cal__day-header agenda-cal__day-header--today">Ter 29</div>
                  <div className="agenda-cal__day-header">Qua 30</div>
                  <div className="agenda-cal__day-header">Qui 01</div>
                  <div className="agenda-cal__day-header">Sex 02</div>
                </div>

                {rows.map((row, ri) => (
                  <div className="agenda-cal__row" key={ri}>
                    <div className="agenda-cal__time">{row.time}</div>
                    {row.cells.map((cell, ci) => (
                      <div className="agenda-cal__cell" key={ci}>
                        {cell && (
                          <div className={`agenda-appt agenda-appt--${cell.color}`}>
                            <span className="agenda-appt__name">{cell.name}</span>
                            <span className="agenda-appt__type">{cell.type}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="agenda-notif">
            <div className="agenda-notif__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <path d="M22 4L12 14.01l-3-3" />
              </svg>
            </div>
            <div>
              <div className="agenda-notif__text">
                <strong>Nova consulta confirmada!</strong>
                Camila Dias — Ter 29, 11:00
              </div>
              <div className="agenda-notif__time">agora mesmo</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
