import styles from './Benefits.module.css';

const ITEMS = [
  { n: '01', title: 'Fórmulas Clínicas',   text: 'Dosis efectivas respaldadas por estudios peer-reviewed. Sin ingredientes de relleno ni polvo de arroz.' },
  { n: '02', title: 'Transparencia Total', text: 'Etiquetado 100% abierto. Sabes exactamente qué entra en tu cuerpo, en qué cantidad y por qué.' },
  { n: '03', title: 'Testado Antidoping',  text: 'Certificaciones Informed-Sport y NSF. Apto para atletas profesionales y competidores naturales.' },
  { n: '04', title: 'Soporte Nutricional', text: 'Acceso a nuestro equipo de nutricionistas deportivos para guiar tu protocolo personalizado.' },
];

export default function Benefits() {
  return (
    <section id="beneficios" className={styles.section}>
      <p className="sec-lbl">Por qué CREAFIT</p>
      <h2 className="sec-t" style={{ color: 'var(--ink)' }}>La Diferencia<br/>que <em>Se Siente</em></h2>
      <div className={styles.layout}>
        <div className={styles.list}>
          {ITEMS.map(item => (
            <div key={item.n} className={styles.row}>
              <div className={styles.num}>{item.n}</div>
              <div>
                <p className={styles.title}>{item.title}</p>
                <p className={styles.text}>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.visual}>
          {/* Coloca tu imagen: <img src="/benefits.jpg" alt="Atleta" /> */}
          <div className={styles.ph}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=".8">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p>Imagen de sección</p>
          </div>
          <div className={styles.deco}>CF</div>
        </div>
      </div>
    </section>
  );
}
