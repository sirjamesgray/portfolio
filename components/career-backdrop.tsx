import styles from "./career-backdrop.module.css";

/**
 * Flat generative backdrop for the career pages.
 * Pure CSS. A faint grid, a slow green and blue pool of brighter grid lines, and static scanlines.
 * Only transform animates, so it stays on the compositor. Reduced motion stops it.
 */
export function CareerBackdrop() {
  return (
    <div className={styles.root} aria-hidden>
      <div className={styles.grid} />
      <div className={`${styles.glow} ${styles.glowGreen}`} />
      <div className={`${styles.glow} ${styles.glowBlue}`} />
      <div className={styles.scan} />
    </div>
  );
}
