import MidjourneyTool from "../components/MidjourneyTool";
import Navigation from "../components/Navigation";
import styles from "../page.module.css";

export default function MidjourneyPage() {
  return (
    <div className={styles.page}>
      <Navigation />
      <main className={styles.main}>
        <MidjourneyTool />
      </main>
    </div>
  );
}
