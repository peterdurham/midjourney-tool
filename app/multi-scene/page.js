import MultiSceneTool from "../components/MultiSceneTool";
import Navigation from "../components/Navigation";
import styles from "../page.module.css";

export default function MultiScenePage() {
  return (
    <div className={styles.page}>
      <Navigation />
      <main className={styles.main}>
        <MultiSceneTool />
      </main>
    </div>
  );
}
