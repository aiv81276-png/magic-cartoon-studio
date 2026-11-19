
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

const CHARACTERS = [
  { name: "Arif", role: "Hero aur team leader" },
  { name: "Zoya", role: "Arif ki girlfriend" },
  { name: "Rohan", role: "Hoshiyar dost" },
  { name: "Sameer", role: "Mazaakiya dost" }
];

// Temporary history: server restart hone par reset hogi.
// Permanent history ke liye database baad mein connect hoga.
const episodes = [];

const durations = {
  "30 second": 3,
  "1 minute": 4,
  "3 minute": 6,
  "5 minute": 10,
  "10 minute": 20,
  "15 minute": 30,
  "30 minute": 60,
  "45 minute": 90,
  "60 minute (1 ghanta)": 120
};

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Magic Cartoon Studio server running"
  });
});

app.get("/api/production-status", (req, res) => {
  res.json({
    storyGenerator: process.env.OPENAI_API_KEY
      ? "Connected"
      : "API key required",
    characterProfiles: "Ready",
    imageGeneration: "Not connected",
    videoGeneration: "Not connected",
    hindiVoice: "Not connected",
    database: "Temporary memory only",
    youtube: "Not connected",
    automaticDailySchedule: "Not configured",
    uploadApproval: "Required before publishing"
  });
});

app.get("/api/episodes", (req, res) => {
  res.json({
    success: true,
    episodes
  });
});

app.post("/api/story", async (req, res) => {
  try {
    const {
      name,
      length = "5 minute",
      genre = "Adventure",
      language = "Hindi",
      format = "Long Video (16:9)"
    } = req.body || {};

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        success: false,
        error: "Render mein OPENAI_API_KEY set karna zaroori hai."
      });
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: "Kahani ka naam zaroori hai."
      });
    }

    if (!Object.prototype.hasOwnProperty.call(durations, length)) {
      return res.status(400).json({
        success: false,
        error: "Video length valid nahi hai."
      });
    }

    const previousTitles = episodes
      .slice(0, 20)
      .map(e => e.name);

    const sceneCount = durations[length];

    const prompt = `
Tum Magic Cartoon Studio ke professional Hindi cartoon
writer aur storyboard director ho.

Ek bilkul nayi, original aur poori kahani banao.
Pichhli kahaniyon ko repeat mat karo.

Permanent characters:
1. Arif - hero aur team leader
2. Zoya - Arif ki girlfriend
3. Rohan - hoshiyar dost
4. Sameer - mazaakiya dost

Chaaron characters har scene mein rahenge.
Unka face, hairstyle, kapde aur character design
har scene mein bilkul consistent rehna chahiye.

Kahani ka naam: ${name}
Genre: ${genre}
Language: ${language}
Video duration: ${length}
Format: ${format}
Total scenes: ${sceneCount}

Pichhle episode titles:
${previousTitles.join(", ") || "Abhi koi episode nahi"}

Kahani mein shuruaat, interesting problem, adventure,
dialogues, suspense aur satisfying ending honi chahiye.

Har scene ke liye:
- Scene number
- Scene description
- Visual generation prompt
- Hindi narration
- Character dialogues
- Sound effects
- Subtitle

Sirf valid JSON return karo. Markdown nahi.

JSON format:
{
  "synopsis": "Kahani ka saar",
  "fullStory": "Poori kahani",
  "characters": [
    {"name":"Arif","role":"Hero aur team leader"},
    {"name":"Zoya","role":"Arif ki girlfriend"},
    {"name":"Rohan","role":"Hoshiyar dost"},
    {"name":"Sameer","role":"Mazaakiya dost"}
  ],
  "characterConsistency": "Same face, hairstyle and clothes",
  "scenes": [
    {
      "number": 1,
      "description": "Scene description",
      "visual": "Detailed visual prompt",
      "narration": "Hindi narration",
      "dialogue": "Hindi dialogues",
      "sound": "Sound effects",
      "subtitle": "Hindi subtitle"
    }
  ]
}
`;

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
          input: prompt,
          max_output_tokens: 12000
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", result);
      return res.status(502).json({
        success: false,
        error: "AI kahani generate nahi kar paya. API settings check karo."
      });
    }

    const text = (result.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n");

    if (!text) {
      throw new Error("AI response mein kahani nahi mili.");
    }

    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    const story = JSON.parse(cleaned);

    if (!story.synopsis || !Array.isArray(story.scenes)) {
      throw new Error("AI ne valid storyboard nahi diya.");
    }

    const episode = {
      id: Date.now().toString(),
      name: name.trim(),
      length,
      genre,
      language,
      format,
      status: "Storyboard ready",
      createdAt: new Date().toISOString(),
      story
    };

    episodes.unshift(episode);

    return res.json({
      success: true,
      episode,
      notice:
        "Storyboard ready hai. Images, animation, Hindi voice, MP4 rendering aur YouTube upload abhi connect nahi hain."
    });

  } catch (error) {
    console.error("Story error:", error);

    return res.status(500).json({
      success: false,
      error: "Kahani banane mein dikkat hui: " + error.message
    });
  }
});

app.listen(PORT, () => {
  console.log("Magic Cartoon Studio running on port " + PORT);
});
 
