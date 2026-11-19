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
  "30 minute": 20,
  "45 minute": 28,
  "60 minute (1 ghanta)": 36
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

  const characters = [
    "Arif - Hero aur team leader",
    "Zoya - Arif ki girlfriend",
    "Rohan - Hoshiyaar dost",
    "Sameer - Mazaakiya dost"
  ];

  const beats = [
    "Chaaron dost rahasyamayi qile ko dekhte hain.",
    "Arif qile ke darwaze par ek purana nishaan dekhta hai.",
    "Zoya ko ek chhupa hua raasta milta hai.",
    "Rohan deewar par likhi paheli padhta hai.",
    "Sameer ko ek ajeeb awaaz sunai deti hai.",
    "Chaaron dost milkar pehli mushkil paar karte hain.",
    "Arif ek gupt kamre ka darwaza kholta hai.",
    "Zoya ko qile ke raaz ka ek suraag milta hai.",
    "Rohan mushkil paheli ka hal nikalta hai.",
    "Sameer ek anjaane khatre se sabko bachata hai.",
    "Qile ka asli rahasya saamne aane lagta hai.",
    "Chaaron dost milkar aakhri challenge poora karte hain."
  ];

  const scenes = Array.from({ length: count }, (_, index) => ({
    number: index + 1,
    prompt: beats[index % beats.length],
    visual:
      "Original 3D cartoon animation. Arif, Zoya, Rohan aur Sameer ke same face, hairstyle aur clothes har scene mein consistent rahenge. Cinematic lighting."
  }));

  res.json({
    success: true,
    story: {
      name: name.trim(),
      length,
      genre,
      language,
      format,
      characters,
      characterConsistency:
        "Chaaron characters ka face, hairstyle aur kapde har scene mein same rahenge.",
      synopsis:
        "Arif, Zoya, Rohan aur Sameer ek rahasyamayi qile ka raaz suljhane nikalte hain. Chaaron dost milkar paheliyan aur mushkilein paar karte hain.",
      scenes,
      production: {
        voiceover: "Natural expressive Hindi narration",
        music: "Original cartoon background music",
        subtitles: "Hindi subtitles"
      }
    },
    notice:
      "Yeh storyboard API hai. AI animation, voice, MP4 rendering aur YouTube upload ke liye alag services configure karni hongi."
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Magic Cartoon Studio running on port ${PORT}`);
});
