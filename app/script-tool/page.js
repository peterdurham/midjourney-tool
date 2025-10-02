import ScriptTool from "../components/ScriptTool";
import Navigation from "../components/Navigation";
import styles from "../page.module.css";

export default function ScriptToolPage() {
  return (
    <div className={styles.page}>
      <Navigation />
      <main className={styles.main}>
        <ScriptTool />
      </main>
    </div>
  );
}
