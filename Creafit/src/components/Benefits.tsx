import Image from 'next/image';
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
          <Image 
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80" 
            alt="Entrenamiento CREAFIT" 
            fill 
            sizes="(max-width: 760px) 100vw, 40vw"
            style={{ objectFit: 'cover' }}
          />
          <div className={styles.deco}>CF</div>
        </div>
      </div>
    </section>
  );
}
