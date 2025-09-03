"use client";

import { useState } from "react";
import styles from "../page.module.css";
import { scenePrompt } from "../prompts/ScenePrompt.js";
import { channelDescription } from "../prompts/ChannelDescription.js";

export default function SceneTool() {
  const [quote, setQuote] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copy to Clipboard");

  const promptTemplate = `${channelDescription}${scenePrompt}${quote}`;

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyButtonText("Copied ✓");
      setTimeout(() => {
        setCopyButtonText("Copy to Clipboard");
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      setCopyButtonText("Failed");
      setTimeout(() => {
        setCopyButtonText("Copy to Clipboard");
      }, 2000);
    }
  };

  return (
    <div>
      <div className={styles.formContainer}>
        <h3
          style={{
            margin: "0 0 8px 0",
            fontSize: "1.2rem",
            fontWeight: "600",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textAlign: "center",
          }}
        >
          Scene Generator
        </h3>
        <div className={styles.formGroup}>
          <label htmlFor="quote">Quote</label>
          <textarea
            id="quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Enter your quote here..."
            className={styles.textarea}
            rows={4}
            style={{ resize: "vertical" }}
          />
        </div>

        {quote.trim() && (
          <div className={styles.formGroup}>
            <label>Generated Prompt:</label>
            <div className={styles.promptBox}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "12px",
                }}
              >
                <button
                  onClick={() => copyToClipboard(promptTemplate)}
                  className={styles.copyButton}
                >
                  {copyButtonText}
                </button>
              </div>
              <p className={styles.promptText}>{promptTemplate}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
