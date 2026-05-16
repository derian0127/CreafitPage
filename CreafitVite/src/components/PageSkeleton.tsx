import styles from './PageSkeleton.module.css';

export default function PageSkeleton() {
  return (
    <div className={styles.wrap} aria-hidden>
      <div className={`${styles.bar} ${styles.w60}`} />
      <div className={`${styles.bar} ${styles.w40}`} />
      <div className={styles.grid}>
        <div className={styles.card} />
        <div className={styles.card} />
        <div className={styles.card} />
      </div>
    </div>
  );
}
