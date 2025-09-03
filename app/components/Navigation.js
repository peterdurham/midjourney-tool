"use client";

import styles from "./Navigation.module.css";

export default function Navigation({ activeTab, onTabChange }) {
  const navItems = [
    { name: "Midjourney", id: "midjourney" },
    { name: "Scene/Setting", id: "scene-tool" },
    { name: "Quotes", id: "quotes-tool" },
    { name: "Script", id: "script-tool" },
  ];

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <div className={styles.tabs}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`${styles.tab} ${
                activeTab === item.id ? styles.active : ""
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
