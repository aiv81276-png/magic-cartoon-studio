
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.static(process.cwd()));

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Magic Cartoon Studio server is running"
  });
});

const sceneCounts = {
  "30 second": 3,
  "1 minute": 4,
  "3 minute": 6,
  "5 minute": 22,
  "10 minute": 12,
  "15 minute": 16,
  "30 minute": 20
};

app.post("/api/story", (req, res) => {
  const {
    name,
    length = "5 minute",
    genre = "Adventure",
    language = "Hindi",
    format = "Long Video (16:9)"
  } = req.body || {};

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      success: false,
      error: "Story ka naam zaroori hai."
    });
  }

  if (!Object.prototype.hasOwnProperty.call(sceneCounts, length)) {
    return res.status(400).json({
      success: false,
      error: "Video length valid nahi hai."
    });
  }

  const count = sceneCounts[length];

  const beats = [
    "Arif qile ko pehli baar dekhta hai.",
    "Arif qile ke bade darwaze par purana nishaan dekhta hai.",
    "Darwaza khulta hai aur andar purana hall nazar aata hai.",
    "Arif ko deewar par ek paheli milti hai.",
    "Ek ajeeb awaaz sunai deti hai.",
    "Arif chhupa hua raasta dhoondhta hai.",
    "Arif mushkil challenge ka hal nikalta hai.",
    "Qile ka raaz saamne aane lagta hai.",
    "Arif ko khazane ka asli maksad pata chalta hai.",
    "Arif aakhri paheli suljhata hai.",
    "Qile ka rahasya khul jata hai.",
    "Arif apne doston ke saath ghar laut ta hai."
  ];

  const scenes = Array.from({ length: count }, (_, index) => ({
    number: index + 1,
    prompt: beats[index % beats.length],
    visual: "Original 3D cartoon, Arif ka same face aur same clothes, expressive animation, cinematic lighting."
  }));

  res.json({
    success: true,
    story: {
      name: name.trim(),
      length,
      genre,
      language,
      format,
      character: "Arif — har scene mein same face, hairstyle aur clothes.",
      synopsis: "Arif ek rahasyamayi qile mein pahunchta hai. Paheliyan aur chhupe raaste paar karke woh qile ka raaz suljhata hai.",
      scenes,
      production: {
        voiceover: "Natural Hindi narration",
        music: "Original cartoon background music",
        subtitles: "Hindi subtitles"
      }
    },
    notice: "Yeh storyboard API hai. AI images, animation, voice aur MP4 generation abhi configured nahi hain."
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Magic Cartoon Studio running on port ${PORT}`);
});
