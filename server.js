
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

const plots = [
  {
    place: "purane ghadi ghar",
    problem: "har raat neeli roshni chamakti hai",
    clue: "ek purana naksha aur chamakta compass",
    twist: "ghadi ghar ke neeche ek bhooli hui library milti hai",
    lesson: "himmat aur dosti se mushkil hal hoti hai"
  },
  {
    place: "jadui jungle",
    problem: "ek chhota robot madad ke liye signal bhejta hai",
    clue: "ped par bana ajeeb nishaan",
    twist: "robot jungle ke janwaron ki raksha kar raha hota hai",
    lesson: "technology ka sahi istemal sabki madad karta hai"
  },
  {
    place: "nadi ka kinara",
    problem: "gaon ka paani achanak gayab hone lagta hai",
    clue: "mitti mein chhote pairon ke nishaan",
    twist: "paani ek bade pathar ke peeche atak gaya hota hai",
    lesson: "milkar kaam karne se har samasya hal hoti hai"
  },
  {
    place: "school ka science fair",
    problem: "ek jadui dibba apne aap khul jata hai",
    clue: "dibbe par chaar symbols aur ek paheli",
    twist: "dibba ek purani learning machine hoti hai",
    lesson: "jigyasa ke saath zimmedari bhi zaroori hai"
  },
  {
    place: "pahadon ka rahasyamayi gaon",
    problem: "ek anjaan awaaz madad ke liye bulati hai",
    clue: "chamakta patthar aur purani diary",
    twist: "awaaz ek phanse hue dost ki hoti hai",
    lesson: "dusron ki madad karna sabse badi bahaduri hai"
  },
  {
    place: "purana railway station",
    problem: "ek train bina driver ke chalne lagti hai",
    clue: "ek ticket aur purani ghadi",
    twist: "train mein phanse logon ko bachana zaroori hota hai",
    lesson: "samajhdari aur sahas se jaan bach sakti hai"
  },
  {
    place: "samundar ka kinara",
    problem: "samundar se ek ajeeb sandesh aata hai",
    clue: "ek sheeshe ki bottle aur chamakta patthar",
    twist: "ek chhota samudri jeev madad maang raha hota hai",
    lesson: "prakriti aur janwaron ki raksha karni chahiye"
  },
  {
    place: "rang-biranga mela",
    problem: "mele ke saare khilaune achanak gayab ho jaate hain",
    clue: "ek laal ribbon aur chhoti chaabi",
    twist: "khilaune ek purane jadui kamre mein chhupe hote hain",
    lesson: "sachchai aur teamwork ki hamesha jeet hoti hai"
  }
];

function createFreeStory(name, genre, length, language, format) {
  const sceneCount = durations[length];

  const plot = plots[
    Math.floor(Math.random() * plots.length)
  ];

  const beats = [
    {
      title: "Nayi subah",
      text: "Arif, Zoya, Rohan aur Sameer " +
        plot.place + " pahunchte hain."
    },
    {
      title: "Ajeeb ghatna",
      text: "Wahan unhe pata chalta hai ki " +
        plot.problem + "."
    },
    {
      title: "Jaanch shuru",
      text: "Rohan sabko samjhata hai ki pehle suraag dhoondhna hoga."
    },
    {
      title: "Pehla suraag",
      text: "Zoya ko " + plot.clue + " milta hai."
    },
    {
      title: "Mushkil raasta",
      text: "Raaste mein badi rukawat aati hai, lekin Arif sabka hausla badhata hai."
    },
    {
      title: "Sameer ka idea",
      text: "Sameer ek mazedaar idea deta hai aur sab hans padte hain."
    },
    {
      title: "Teamwork",
      text: "Chaaron dost apni alag-alag skills ka istemal karte hain."
    },
    {
      title: "Raaz khulta hai",
      text: "Aakhir unhe pata chalta hai ki " + plot.twist + "."
    },
    {
      title: "Adventure ka hal",
      text: "Dost milkar samasya ka hal nikaal lete hain."
    },
    {
      title: "Kahani ki seekh",
      text: "Arif kehta hai: " + plot.lesson + "."
    }
  ];

  const scenes = [];

  for (let i = 0; i < sceneCount; i++) {
    const beat = beats[i % beats.length];

    const narration = beat.text;

    scenes.push({
      number: i + 1,
      description: beat.title + ": " + narration,

      visual:
        "Family friendly 3D cartoon scene. " +
        "Arif, Zoya, Rohan and Sameer. " +
        "Keep same faces, hairstyles and clothes " +
        "in every scene. " + narration +
        " Cinematic lighting. " + format,

      narration: narration,

      dialogue:
        i === 2
          ? "Rohan: Pehle humein saboot dhoondhna chahiye. Arif: Hum sab saath chalenge."
          : i === 5
          ? "Sameer: Mere paas ek zabardast idea hai! Zoya: Jaldi batao!"
          : i === 9
          ? "Arif: " + plot.lesson
          : "Arif: Chalo dosto, milkar iska hal nikaalte hain!",

      sound: "Cartoon adventure music and scene sound effects",

      subtitle: narration
    });
  }

  return {
    synopsis:
      name + " ek " + genre + " kahani hai. " +
      "Arif, Zoya, Rohan aur Sameer " +
      plot.place + " mein ek adventure par nikalte hain. " +
      "Wahan " + plot.problem + ". " +
      "Suraag ki madad se woh " + plot.twist + ". " +
      "Kahani ki seekh: " + plot.lesson + ".",

    fullStory: scenes.map(scene =>
      "Scene " + scene.number + "\n" +
      scene.description + "\n" +
      scene.dialogue
    ).join("\n\n"),

    characters: CHARACTERS,

    characterConsistency:
      "Same face, hairstyle and clothes in every scene",

    scenes
  };
}

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Magic Cartoon Studio server running"
  });
});

app.get("/api/production-status", (req, res) => {
  res.json({
    storyGenerator: "Free backup available",
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
    episodes: episodes
  });
});

app.get("/api/episode/:id", (req, res) => {
  const episode = episodes.find(
    item => item.id === req.params.id
  );

  if (!episode) {
    return res.status(404).json({
      success: false,
      error: "Episode nahi mila."
    });
  }

  res.json({
    success: true,
    episode: episode
  });
});

app.post("/api/story", (req, res) => {
  try {
    const {
      name,
      length = "5 minute",
      genre = "Adventure",
      language = "Hindi",
      format = "Long Video (16:9)"
    } = req.body || {};

    if (
      !name ||
      typeof name !== "string" ||
      !name.trim()
    ) {
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

    const story = createFreeStory(
      name.trim(),
      genre,
      length,
      language,
      format
    );

    const episode = {
      id: Date.now().toString(),
      name: name.trim(),
      length: length,
      genre: genre,
      language: language,
      format: format,
      status: "Storyboard ready",
      createdAt: new Date().toISOString(),
      story: story
    };

    episodes.unshift(episode);

    if (episodes.length > 50) {
      episodes.length = 50;
    }

    return res.json({
      success: true,
      episode: episode,
      notice:
        "Free story and storyboard generated. " +
        "Cartoon images, animation, Hindi voice, " +
        "MP4 rendering and YouTube upload are not connected yet."
    });

  } catch (error) {
    console.error("Story error:", error);

    return res.status(500).json({
      success: false,
      error: "Story generate nahi ho paayi: " + error.message
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );
});

app.listen(PORT, () => {
  console.log(
    "Magic Cartoon Studio running on port " + PORT
  );
});
 
