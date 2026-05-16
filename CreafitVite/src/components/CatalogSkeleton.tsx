import styles from './CatalogSkeleton.module.css';

export default function CatalogSkeleton() {
  return (
    <div className={styles.wrap} aria-hidden>
      <div className={styles.toolbar}>
        <div className={styles.shim} style={{ width: '40%' }} />
        <div className={styles.shim} style={{ width: '220px', marginLeft: 'auto' }} />
      </div>
      <div className={styles.tabs}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={styles.tabShim} />
        ))}
      </div>
      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.card} />
        ))}
      </div>
    </div>
  );
}
