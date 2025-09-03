"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Navigation from "./components/Navigation";
import MidjourneyTool from "./components/MidjourneyTool";
import SceneTool from "./components/SceneTool";
import QuotesTool from "./components/QuotesTool";
import ScriptTool from "./components/ScriptTool";

export default function Home() {
  const [activeTab, setActiveTab] = useState("midjourney");

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "midjourney":
        return <MidjourneyTool />;
      case "scene-tool":
        return <SceneTool />;
      case "quotes-tool":
        return <QuotesTool />;
      case "script-tool":
        return <ScriptTool />;
      default:
        return <MidjourneyTool />;
    }
  };

  return (
    <div className={styles.page}>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className={styles.main}>{renderActiveComponent()}</main>
    </div>
  );
}
