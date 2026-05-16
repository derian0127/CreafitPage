import styles from './Marquee.module.css';

const WORDS = [
  'Ciencia Aplicada','Rendimiento Real','Sin Rellenos',
  'Grado Clínico','Certificado GMP','Informed Sport',
  'Transparencia Total','Atletas de Élite',
];

export default function Marquee() {
  const items = [...WORDS, ...WORDS]; // duplicate for seamless loop
  return (
    <div className={styles.wrap}>
      <div className={styles.track}>
        {items.map((w, i) => (
          <span key={i} className={styles.item}>
            {w}<span className={styles.dot} />
          </span>
        ))}
      </div>
    </div>
  );
}
