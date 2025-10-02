"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";

export default function Navigation({ activeTab }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Midjourney", id: "midjourney", href: "/midjourney" },
    { name: "Multi Scene", id: "multi-scene", href: "/multi-scene" },
    { name: "Scene/Setting", id: "scene-tool", href: "/scene-tool" },
    { name: "Quotes", id: "quotes-tool", href: "/quotes-tool" },
    { name: "Script", id: "script-tool", href: "/script-tool" },
  ];

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <div className={styles.tabs}>
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`${styles.tab} ${
                pathname === item.href ? styles.active : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
