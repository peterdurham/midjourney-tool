"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [formData, setFormData] = useState({
    scene: "",
    artStyle: "",
    lighting: "",
    palette: "",
    mood: [],
    aspectRatio: "9:16",
    references: [],
    extraDetails:
      "composition weighted toward the bottom, open and uncluttered space above",
  });

  const [generatedPrompt, setGeneratedPrompt] = useState("");

  const [copyButtonText, setCopyButtonText] = useState("Copy to Clipboard");

  const [allPresetsMode, setAllPresetsMode] = useState(true);

  const [copyButtonStates, setCopyButtonStates] = useState({});

  const aspectRatioOptions = ["1:1", "4:3", "3:2", "16:9", "9:16", "21:9"];

  const presets = {
    dark_fantasy_oil: {
      name: "Dark Fantasy Oil",
      artStyle: "dark fantasy oil painting",
      lighting: "chiaroscuro",
      palette: "deep reds, golds, blacks",
      mood: ["solemn", "mythic"],
      aspectRatio: "9:16",
      references: ["Jean-Léon Gérôme", "Frank Frazetta"],
    },
    "1970s_fantasy_poster": {
      name: "1970s Fantasy Poster",
      artStyle: "1970s fantasy illustration",
      lighting: "dramatic spotlight",
      palette: "blue/orange complementary",
      mood: ["heroic", "pulp action"],
      aspectRatio: "9:16",
      references: ["Boris Vallejo", "Greg Hildebrandt"],
    },
    ancient_fairy_biopunk: {
      name: "Ancient Fairy Biopunk",
      artStyle:
        "photorealistic hyper-realism blended with woodcut fairy tale and Romanesque fantasy mural",
      lighting: "crepuscular rays, cinematic IMAX glow, deep focus",
      palette: "verdant greens, golden light, shadowed contours",
      mood: ["majestic", "wondrous", "mythic", "exquisite"],
      aspectRatio: "9:16",
      references: [
        "high fantasy religious mural painting",
        "biopunk oil painting",
        "IMAX cinematography",
      ],
    },
  };

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
        extraDetails:
          "composition weighted toward the bottom, open uncluttered space above, clear focus on the central figure",
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
        aspectRatio: preset.aspectRatio,
        references: [...preset.references],
        extraDetails: formData.extraDetails, // Keep the extra details
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

        if (formData.extraDetails.trim()) {
          prompt += `, ${formData.extraDetails}`;
        }

        prompt += ` --ar ${preset.aspectRatio}`;

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

    if (formData.extraDetails.trim()) {
      prompt += `, ${formData.extraDetails}`;
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
            [buttonId]: "Copy to Clipboard",
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
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Midjourney Prompt Generator</h1>
        <p className={styles.description}>
          Fill in the fields below to generate a custom Midjourney prompt
        </p>

        <div className={styles.formContainer}>
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
            <small className={styles.helpText}>
              Choose a preset to quickly populate the form, then customize as
              needed
            </small>
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
            <label htmlFor="artStyle">Art Style *</label>
            <input
              type="text"
              id="artStyle"
              value={formData.artStyle}
              onChange={(e) => handleInputChange("artStyle", e.target.value)}
              placeholder="e.g., digital art, oil painting, watercolor"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lighting">Lighting *</label>
            <input
              type="text"
              id="lighting"
              value={formData.lighting}
              onChange={(e) => handleInputChange("lighting", e.target.value)}
              placeholder="e.g., warm golden hour, dramatic shadows"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="palette">Color Palette *</label>
            <input
              type="text"
              id="palette"
              value={formData.palette}
              onChange={(e) => handleInputChange("palette", e.target.value)}
              placeholder="e.g., earth tones, vibrant neon, monochrome"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="mood">Mood (Optional)</label>
            <div className={styles.arrayInput}>
              <input
                type="text"
                id="mood"
                placeholder="e.g., peaceful, mysterious, energetic"
                className={styles.input}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleArrayChange("mood", e.target.value, "add");
                    e.target.value = "";
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById("mood");
                  if (input.value.trim()) {
                    handleArrayChange("mood", input.value, "add");
                    input.value = "";
                  }
                }}
                className={styles.addButton}
              >
                Add
              </button>
            </div>
            {formData.mood.length > 0 && (
              <div className={styles.tags}>
                {formData.mood.map((mood, index) => (
                  <span key={index} className={styles.tag}>
                    {mood}
                    <button
                      onClick={() => handleArrayChange("mood", index, "remove")}
                      className={styles.removeButton}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
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
            <label htmlFor="references">Reference Styles (Optional)</label>
            <div className={styles.arrayInput}>
              <input
                type="text"
                id="references"
                placeholder="e.g., Studio Ghibli, Van Gogh, cyberpunk"
                className={styles.input}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleArrayChange("references", e.target.value, "add");
                    e.target.value = "";
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById("references");
                  if (input.value.trim()) {
                    handleArrayChange("references", input.value, "add");
                    input.value = "";
                  }
                }}
                className={styles.addButton}
              >
                Add
              </button>
            </div>
            {formData.references.length > 0 && (
              <div className={styles.tags}>
                {formData.references.map((ref, index) => (
                  <span key={index} className={styles.tag}>
                    {ref}
                    <button
                      onClick={() =>
                        handleArrayChange("references", index, "remove")
                      }
                      className={styles.removeButton}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="extraDetails">Extra Details</label>
            <input
              type="text"
              id="extraDetails"
              value={formData.extraDetails}
              onChange={(e) =>
                handleInputChange("extraDetails", e.target.value)
              }
              placeholder="composition weighted toward the bottom, open and uncluttered space above"
              className={styles.input}
            />
            <small className={styles.helpText}>
              Additional composition or style details to include in every prompt
            </small>
          </div>

          <button
            onClick={generatePrompt}
            className={styles.generateButton}
            disabled={
              !formData.scene ||
              (!allPresetsMode &&
                (!formData.artStyle || !formData.lighting || !formData.palette))
            }
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
                      onClick={() =>
                        copyToClipboard(prompt.prompt, prompt.name)
                      }
                      className={styles.copyButton}
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
                >
                  {copyButtonText}
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
