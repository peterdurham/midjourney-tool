import SceneTool from "../components/SceneTool";
import Navigation from "../components/Navigation";
import styles from "../page.module.css";

export default function SceneToolPage() {
  return (
    <div className={styles.page}>
      <Navigation />
      <main className={styles.main}>
        <SceneTool />
      </main>
    </div>
  );
}
