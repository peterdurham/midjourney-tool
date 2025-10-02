import QuotesTool from "../components/QuotesTool";
import Navigation from "../components/Navigation";
import styles from "../page.module.css";

export default function QuotesToolPage() {
  return (
    <div className={styles.page}>
      <Navigation />
      <main className={styles.main}>
        <QuotesTool />
      </main>
    </div>
  );
}
