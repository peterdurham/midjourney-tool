"use client";

import { useState } from "react";
import styles from "../page.module.css";
import { presets } from "../data/presets";

export default function MultiSceneTool() {
  const [formData, setFormData] = useState({
    scenes: [{ description: "" }],
    aspectRatio: "9:16",
    type: "",
    customType: "",
  });

  const [generatedPrompts, setGeneratedPrompts] = useState([]);
  const [copyButtonStates, setCopyButtonStates] = useState({});

  const aspectRatioOptions = ["1:1", "4:3", "2:3", "16:9", "9:16", "21:9"];
  const sceneCountOptions = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  const typeOptions = [
    { value: "", label: "None" },
    {
      value:
        "composition weighted toward the bottom, open uncluttered space above, clear focus on the central figure",
      label: "Social",
    },
    {
      value: "book cover for a mythic text, epic and centered",
      label: "Book Cover",
    },
    { value: "custom", label: "Custom" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSceneCountChange = (count) => {
    const newScenes = Array.from({ length: count }, (_, index) => ({
      description: formData.scenes[index]?.description || "",
    }));
    setFormData((prev) => ({
      ...prev,
      scenes: newScenes,
    }));
  };

  const handleSceneChange = (index, value) => {
    const newScenes = [...formData.scenes];
    newScenes[index].description = value;
    setFormData((prev) => ({
      ...prev,
      scenes: newScenes,
    }));
  };

  const generatePrompts = () => {
    const scenePrompts = [];

    formData.scenes.forEach((scene, sceneIndex) => {
      if (scene.description.trim()) {
        const scenePresets = [];

        Object.entries(presets).forEach(([key, preset]) => {
          const moodText = preset.mood.length > 0 ? preset.mood.join(", ") : "";
          const referencesText =
            preset.references.length > 0 ? preset.references.join(", ") : "";

          let prompt = `${scene.description}, ${preset.artStyle}, ${preset.lighting}, ${preset.palette}`;

          if (moodText) {
            prompt += `, mood: ${moodText}`;
          }

          if (referencesText) {
            prompt += `, reference style of ${referencesText}`;
          }

          const extraDetails =
            formData.type === "custom" ? formData.customType : formData.type;
          if (extraDetails.trim()) {
            prompt += `, ${extraDetails}`;
          }

          prompt += ` --ar ${formData.aspectRatio}`;

          scenePresets.push({
            presetName: preset.name,
            prompt: prompt,
            key: `${sceneIndex}-${key}`,
          });
        });

        scenePrompts.push({
          sceneNumber: sceneIndex + 1,
          sceneDescription: scene.description,
          presets: scenePresets,
        });
      }
    });

    setGeneratedPrompts(scenePrompts);
  };

  const copyToClipboard = async (text, buttonId, presetName) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopyButtonStates((prev) => ({
        ...prev,
        [buttonId]: "Copied ✓",
      }));
      setTimeout(() => {
        setCopyButtonStates((prev) => ({
          ...prev,
          [buttonId]: presetName,
        }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);

      setCopyButtonStates((prev) => ({
        ...prev,
        [buttonId]: "Failed",
      }));
      setTimeout(() => {
        setCopyButtonStates((prev) => ({
          ...prev,
          [buttonId]: presetName,
        }));
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
          Multi Scene Prompt Generator
        </h3>

        <div className={styles.formGroup}>
          <label htmlFor="sceneCount">Number of Scenes</label>
          <select
            id="sceneCount"
            value={formData.scenes.length}
            onChange={(e) => handleSceneCountChange(parseInt(e.target.value))}
            className={styles.select}
          >
            {sceneCountOptions.map((count) => (
              <option key={count} value={count}>
                {count} Scene{count > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        {formData.scenes.map((scene, index) => (
          <div key={index} className={styles.formGroup}>
            <label htmlFor={`scene-${index}`}>
              Scene {index + 1} Description *
            </label>
            <input
              type="text"
              id={`scene-${index}`}
              value={scene.description}
              onChange={(e) => handleSceneChange(index, e.target.value)}
              placeholder={`e.g., Scene ${
                index + 1
              }: A cozy coffee shop interior`}
              className={styles.input}
            />
          </div>
        ))}

        <div className={styles.formGroup}>
          <label htmlFor="aspectRatio">Aspect Ratio</label>
          <select
            id="aspectRatio"
            value={formData.aspectRatio}
            onChange={(e) => handleInputChange("aspectRatio", e.target.value)}
            className={styles.select}
          >
            {aspectRatioOptions.map((ratio) => (
              <option key={ratio} value={ratio}>
                {ratio}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="type">Type</label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => handleInputChange("type", e.target.value)}
            className={styles.select}
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {formData.type === "custom" && (
          <div className={styles.formGroup}>
            <label htmlFor="customType">Custom Type Details</label>
            <input
              type="text"
              id="customType"
              value={formData.customType}
              onChange={(e) => handleInputChange("customType", e.target.value)}
              placeholder="Enter custom type details"
              className={styles.input}
            />
          </div>
        )}

        <button
          onClick={generatePrompts}
          className={styles.generateButton}
          disabled={!formData.scenes.some((scene) => scene.description.trim())}
        >
          Generate Prompts
        </button>
      </div>

      {generatedPrompts.length > 0 && (
        <div className={styles.resultContainer}>
          <h3>Generated Prompts:</h3>
          <div>
            {generatedPrompts.map((scene) => (
              <div key={scene.sceneNumber} className={styles.promptBox}>
                <h4 className={styles.presetName}>
                  Scene {scene.sceneNumber}: {scene.sceneDescription}
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginTop: "12px",
                  }}
                >
                  {scene.presets.map((preset) => (
                    <button
                      key={preset.key}
                      onClick={() =>
                        copyToClipboard(
                          preset.prompt,
                          preset.key,
                          preset.presetName
                        )
                      }
                      className={styles.copyButton}
                    >
                      {copyButtonStates[preset.key] || preset.presetName}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
