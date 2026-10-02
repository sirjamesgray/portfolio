import styles from "./career-system.module.css";

/** One section header: a mono index and a title. */
export function SectionHead({
  index,
  title,
  as = "h2",
}: {
  index: string;
  title: string;
  as?: "h1" | "h2";
}) {
  const Title = as;
  return (
    <div className={styles.head}>
      <span className={styles.index}>{index}</span>
      <Title className={styles.title}>{title}</Title>
    </div>
  );
}
