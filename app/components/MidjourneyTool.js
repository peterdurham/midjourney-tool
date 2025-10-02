"use client";

import { useState } from "react";
import styles from "../page.module.css";

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
    // extraDetails: "composition weighted toward the bottom, open and uncluttered space above",
    extraDetails: "",
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
      lighting: "chiaroscuro, glowing embers, misty backlight",
      palette:
        "deep crimsons, burnished golds, obsidian black, moss greens, muted grays",
      mood: ["solemn", "mythic", "ominous"],
      references: ["Jean-Léon Gérôme", "Frank Frazetta", "John Martin"],
    },
    "1970s_fantasy_poster": {
      name: "1970s Fantasy Poster",
      artStyle: "1970s pulp fantasy illustration",
      lighting: "dramatic spotlight, airbrushed glow, backlit figures",
      palette:
        "sapphire blues, fiery oranges, emerald greens, metallic highlights, warm skin tones",
      mood: ["heroic", "vivid", "pulp action"],
      references: ["Boris Vallejo", "Greg Hildebrandt", "Ken Kelly"],
    },
    ancient_fairy_biopunk: {
      name: "Ancient Fairy Biopunk",
      artStyle:
        "photorealistic mythic realism fused with fairy tale woodcut and biopunk fantasy mural",
      lighting: "crepuscular rays, cinematic IMAX glow, bioluminescent accents",
      palette:
        "verdant greens, amber light, bronze patinas, soft violets, twilight blues",
      mood: ["majestic", "wondrous", "mythic"],
      references: [
        "religious mural painting",
        "biopunk concept art",
        "IMAX cinematography",
      ],
    },
    romantic_sublime_landscape: {
      name: "Romantic Sublime Landscape",
      artStyle:
        "romantic landscape painting emphasizing awe and natural grandeur",
      lighting: "stormlit skies, glowing horizons, divine shafts of light",
      palette:
        "stormcloud grays, silver whites, oceanic blues, earthy browns, radiant gold edges",
      mood: ["sublime", "ominous", "majestic"],
      references: ["Caspar David Friedrich", "John Martin"],
    },
    symbolist_dreamscape: {
      name: "Symbolist Dreamscape",
      artStyle: "mythic symbolist and surrealist painting",
      lighting:
        "moody twilight glow, diffused lunar light, otherworldly atmosphere",
      palette:
        "emerald greens, soft violets, pale gold, misty grays, nocturnal blues",
      mood: ["dreamlike", "mystical", "enigmatic"],
      references: ["Odilon Redon", "Gustave Moreau"],
    },
    heroic_bronze_age: {
      name: "Heroic Bronze Age",
      artStyle: "neo-classical heroic realism with mythic warriors",
      lighting: "dappled daylight, metallic glint, battlefield haze",
      palette:
        "bronze armor tones, crimson cloaks, dusty earth, sea blue skies, golden light",
      mood: ["heroic", "stoic", "mythic"],
      references: ["Jacques-Louis David", "Angus McBride"],
    },
    mystic_cosmic_realism: {
      name: "Mystic Cosmic Realism",
      artStyle: "cosmic fantasy realism with astral and mythological motifs",
      lighting: "celestial glow, starlit shimmer, radiant cosmic backlight",
      palette:
        "nebula purples, starlight silver, midnight blue, aurora greens, deep blacks",
      mood: ["cosmic", "transcendent", "awe-inspiring"],
      references: ["John Harris", "Alex Ross (cosmic works)"],
    },
    luminous_mythic_modern: {
      name: "Luminous Mythic Modern",
      artStyle:
        "mythic fantasy realism with painterly brushwork and modern cinematic polish",
      lighting: "radiant skylight, glowing edge-light, atmospheric haze",
      palette:
        "opal whites, radiant gold, jade green, storm blues, ember orange highlights",
      mood: ["uplifting", "mythic", "cinematic"],
      references: ["John William Waterhouse", "modern fantasy concept art"],
    },
    twilight_arcane: {
      name: "Twilight Arcane",
      artStyle:
        "mystical twilight fantasy painting with surreal magical energy",
      lighting: "dusky horizon glow, moonlit shimmer, glowing runic light",
      palette:
        "twilight purples, indigo blues, silver mist, ember sparks, mossy greens",
      mood: ["mystical", "arcane", "wondrous"],
      references: [
        "symbolist painting",
        "dark fantasy illustration",
        "cosmic surrealism",
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
        // extraDetails:
        //   "composition weighted toward the bottom, open uncluttered space above, clear focus on the central figure",
        extraDetails: "",
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
          <label htmlFor="extraDetails">Extra Details</label>
          <input
            type="text"
            id="extraDetails"
            value={formData.extraDetails}
            onChange={(e) => handleInputChange("extraDetails", e.target.value)}
            placeholder="Details added to the prompt"
            className={styles.input}
          />
        </div>

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
