"use client";

import { useState } from "react";
import styles from "../page.module.css";
import { presets } from "../data/presets";

// "1970s_fantasy_poster": {
//   name: "1970s Fantasy Poster",
//   artStyle: "1970s fantasy illustration",
//   lighting: "dramatic spotlight",
//   palette: "blue/orange complementary",
//   mood: ["heroic", "pulp action"],
//   aspectRatio: "9:16",
//   references: ["Boris Vallejo", "Greg Hildebrandt"],
// },

export default function MidjourneyTool() {
  const [formData, setFormData] = useState({
    scene: "",
    artStyle: "",
    lighting: "",
    palette: "",
    mood: [],
    aspectRatio: "9:16",
    references: [],
    type: "",
    customType: "",
  });

  const [generatedPrompt, setGeneratedPrompt] = useState("");

  const [copyButtonText, setCopyButtonText] = useState("Copy to Clipboard");

  const [allPresetsMode, setAllPresetsMode] = useState(true);

  const [copyButtonStates, setCopyButtonStates] = useState({});

  const aspectRatioOptions = ["1:1", "4:3", "2:3", "16:9", "9:16", "21:9"];

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

  const handleArrayChange = (field, value, action) => {
    if (action === "add" && value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
    } else if (action === "remove") {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, index) => index !== value),
      }));
    }
  };

  const handlePresetChange = (presetKey) => {
    if (presetKey === "custom") {
      // Reset to empty form
      setFormData({
        scene: "",
        artStyle: "",
        lighting: "",
        palette: "",
        mood: [],
        aspectRatio: "9:16",
        references: [],
        type: "",
        customType: "",
      });
      setAllPresetsMode(false);
      return;
    }

    if (presetKey === "all_presets") {
      setAllPresetsMode(true);
      return;
    }

    const preset = presets[presetKey];
    if (preset) {
      setFormData({
        scene: formData.scene, // Keep the scene as user might want to test different scenes
        artStyle: preset.artStyle,
        lighting: preset.lighting,
        palette: preset.palette,
        mood: [...preset.mood],
        aspectRatio: formData.aspectRatio, // Keep user's aspect ratio selection
        references: [...preset.references],
        type: formData.type, // Keep the type selection
        customType: formData.customType, // Keep the custom type text
      });
      setAllPresetsMode(false);
    }
  };

  const generatePrompt = () => {
    if (allPresetsMode) {
      // Generate prompts for all presets
      const allPrompts = Object.entries(presets).map(([key, preset]) => {
        const moodText = preset.mood.length > 0 ? preset.mood.join(", ") : "";
        const referencesText =
          preset.references.length > 0 ? preset.references.join(", ") : "";

        let prompt = `${formData.scene}, ${preset.artStyle}, ${preset.lighting}, ${preset.palette}`;

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

        return {
          name: preset.name,
          prompt: prompt,
        };
      });

      setGeneratedPrompt(allPrompts);
      return;
    }

    // Single preset generation (existing logic)
    const moodText = formData.mood.length > 0 ? formData.mood.join(", ") : "";
    const referencesText =
      formData.references.length > 0 ? formData.references.join(", ") : "";

    let prompt = `${formData.scene}, ${formData.artStyle}, ${formData.lighting}, ${formData.palette}`;

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

    setGeneratedPrompt(prompt);
  };

  const copyToClipboard = async (text, buttonId = null) => {
    try {
      await navigator.clipboard.writeText(text);

      if (buttonId) {
        // Update specific button state
        setCopyButtonStates((prev) => ({
          ...prev,
          [buttonId]: "Copied ✓",
        }));
        setTimeout(() => {
          setCopyButtonStates((prev) => ({
            ...prev,
            [buttonId]: "Copy to Clipboard",
          }));
        }, 2000);
      } else {
        // Update single button state (for single preset mode)
        setCopyButtonText("Copied ✓");
        setTimeout(() => {
          setCopyButtonText("Copy to Clipboard");
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to copy: ", err);

      if (buttonId) {
        // Update specific button state
        setCopyButtonStates((prev) => ({
          ...prev,
          [buttonId]: "Failed",
        }));
        setTimeout(() => {
          setCopyButtonStates((prev) => ({
            ...prev,
            [buttonId]: "Failed",
          }));
        }, 2000);
      } else {
        // Update single button state (for single preset mode)
        setCopyButtonText("Failed");
        setTimeout(() => {
          setCopyButtonText("Copy to Clipboard");
        }, 2000);
      }
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
          Midjourney Prompt Generator
        </h3>
        <div className={styles.formGroup}>
          <label htmlFor="preset">Quick Preset (Optional)</label>
          <select
            id="preset"
            onChange={(e) => handlePresetChange(e.target.value)}
            className={styles.select}
            defaultValue="all_presets"
          >
            <option value="">Select a preset...</option>
            <option value="custom">Custom (Clear Form)</option>
            <option value="all_presets">All Presets</option>
            {Object.entries(presets).map(([key, preset]) => (
              <option key={key} value={key}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="scene">Scene Description *</label>
          <input
            type="text"
            id="scene"
            value={formData.scene}
            onChange={(e) => handleInputChange("scene", e.target.value)}
            placeholder="e.g., A cozy coffee shop interior"
            className={styles.input}
          />
        </div>

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
          onClick={generatePrompt}
          className={styles.generateButton}
          disabled={!formData.scene}
        >
          Generate Prompt
        </button>
      </div>

      {generatedPrompt && (
        <div className={styles.resultContainer}>
          <h3>Generated Prompt{allPresetsMode ? "s" : ""}:</h3>
          {allPresetsMode ? (
            <div>
              {generatedPrompt.map((prompt, index) => (
                <div key={index} className={styles.promptBox}>
                  <h4 className={styles.presetName}>
                    {index + 1}. {prompt.name}
                  </h4>
                  <p className={styles.promptText}>{prompt.prompt}</p>
                  <button
                    onClick={() => copyToClipboard(prompt.prompt, prompt.name)}
                    className={styles.copyButton}
                    style={{ marginLeft: "auto" }}
                  >
                    {copyButtonStates[prompt.name] || "Copy to Clipboard"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.promptBox}>
              <p className={styles.promptText}>{generatedPrompt}</p>
              <button
                onClick={() => copyToClipboard(generatedPrompt)}
                className={styles.copyButton}
                style={{ marginLeft: "auto" }}
              >
                {copyButtonText}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
