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

// Temporary episode history
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

// FREE BACKUP STORY GENERATOR
function createFreeStory(name, genre, length, language, format) {
  const plots = [
    {
      problem: "gaon ke purane ghadi-ghar se har raat neeli roshni nikalti hai",
      clue: "ek purana naqsha aur chamakta hua compass",
      goal: "ghadi-ghar ka raaz jaan kar gaon ko bachana",
      twist: "ghadi-ghar ke neeche ek bhooli hui library milti hai",
      lesson: "himmat aur dosti se mushkil hal hoti hai"
    },
    {
      problem: "jungle ke paas ek chhota robot madad ke liye signal bhejta hai",
      clue: "ped par bana ajeeb nishaan aur teen rang ke patthar",
      goal: "robot ke dost ko dhoondhna",
      twist: "robot jungle ke janwaron ki raksha kar raha hota hai",
      lesson: "technology ka sahi istemal sabki madad kar sakta hai"
    },
    {
      problem: "nadi ke kinare se gaon ka paani achanak gayab hone lagta hai",
      clue: "mitti mein chhote pairon ke nishaan aur ek toota pipe",
      goal: "paani ka raasta dobara kholna",
      twist: "paani ek bade pathar ke peeche atak gaya hota hai",
      lesson: "milkar kaam karne se har samasya ka hal milta hai"
    },
    {
      problem: "school ke science fair mein ek jadui dibba apne aap khul jata hai",
      clue: "dibbe par chaar symbols aur ek purani paheli",
      goal: "paheli suljha kar dibbe ko surakshit band karna",
      twist: "dibba ek purani learning machine hoti hai",
      lesson: "jigyasa ke saath zimmedari bhi zaroori hai"
    },
    {
      problem: "pahadon ke beech ek rahasyamayi awaaz sunai deti hai",
      clue: "ek chamakta hua patthar aur purani diary",
      goal: "awaaz ka raaz samajhna aur musibat door karna",
      twist: "awaaz ek phanse hue dost ki hoti hai",
      lesson: "dusron ki madad karna sabse badi bahaduri hai"
    }
  ];

  const index = Math.abs(
    (Date.now() + episodes.length * 7919) % plots.length
  );

  const p = plots[index];

  const beats = [
    {
      title: "Nayi subah",
      text: "Arif, Zoya, Rohan aur Sameer milkar ek naye adventure ki planning karte hain."
    },
    {
      title: "Ajeeb ghatna",
      text: "Tabhi unhe pata chalta hai ki " + p.problem + "."
    },
    {
      title: "Jaanch shuru",
      text: "Rohan kehta hai: Pehle humein saboot dhundhna chahiye. Arif sabko saath chalne ke liye kehta hai."
    },
    {
      title: "Pehla suraag",
      text: "Zoya ko " + p.clue + " milta hai. Sab dost hairan reh jaate hain."
    },
    {
      title: "Mushkil raasta",
      text: "Raaste mein ek badi rukawat aati hai, lekin Arif sabko himmat deta hai."
    },
    {
      title: "Sameer ka idea",
      text: "Sameer apne mazedaar andaaz mein ek naya idea deta hai. Sab hans padte hain aur uski baat maan lete hain."
    },
    {
      title: "Teamwork",
      text: "Chaaron dost apni alag-alag skills ka istemal karke aage badhte hain."
    },
    {
      title: "Raaz khulta hai",
      text: "Aakhir unhe samajh aata hai ki " + p.twist + "."
    },
    {
      title: "Adventure ka hal",
      text: "Dost milkar " + p.goal + " mein kamyab ho jaate hain."
    },
    {
      title: "Seekh",
      text: "Arif kehta hai: " + p.lesson + ". Chaaron dost khushi se ghar lautte hain."
    }
  ];

  const scenes = beats.map((beat, i) => ({
    number: i + 1,
    description: beat.title + ": " + beat.text,

    visual:
      "3D family-friendly cartoon scene. Arif, Zoya, Rohan and Sameer. " +
      "Keep exactly the same faces, hairstyles, clothes and character designs " +
      "in every scene. " + beat.text +
      " Cinematic lighting, colorful background, " + format + ".",

    narration: beat.text,

    dialogue:
      i === 2
        ? "Rohan: Pehle humein saboot dhundhna chahiye.\nArif: Bilkul, hum sab saath chalenge."
        : i === 5
        ? "Sameer: Mere paas ek zabardast idea hai!\nZoya: Jaldi batao, Sameer!"
        : i === 9
        ? "Arif: " + p.lesson + "\nSab: Haan, bilkul!"
        : "Arif: Chalo dosto, milkar iska hal nikaalte hain!",

    sound:
      i === 1 || i === 7
        ? "Mysterious magical chime and soft suspense music"
        : i === 5
        ? "Funny pop sound and cheerful music"
        : "Gentle adventure background music",

    subtitle: beat.text
  }));

  return {
    synopsis:
      "Arif, Zoya, Rohan aur Sameer ke adventure mein " +
      p.problem + ". " + p.clue +
      " ki madad se woh " + p.goal +
      ". Is kahani ki seekh hai: " + p.lesson + ".",

    fullStory: beats
      .map((beat, i) => (i + 1) + ". " + beat.title + "\n" + beat.text)
      .join("\n\n"),

    characters: CHARACTERS,

    characterConsistency:
      "Same face, hairstyle and clothes in every scene",

    scenes
  };
}

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Magic Cartoon Studio server running"
  });
});

// PRODUCTION STATUS
app.get("/api/production-status", (req, res) => {
  res.json({
    storyGenerator: "Free backup available",
    paidAI: process.env.OPENAI_API_KEY ? "Configured" : "Not configured",
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

// EPISODE HISTORY
app.get("/api/episodes", (req, res) => {
  res.json({
    success: true,
    episodes
  });
});

// GET SINGLE EPISODE
app.get("/api/episode/:id", (req, res) => {
  const episode = episodes.find(e => e.id === req.params.id);

  if (!episode) {
    return res.status(404).json({
      success: false,
      error: "Episode nahi mila."
    });
  }

  res.json({ success: true, episode });
});

// CREATE STORY
app.post("/api/story", async (req, res) => {
  try {
    const {
      name,
      length = "5 minute",
      genre = "Adventure",
      language = "Hindi",
      format = "Long Video (16:9)"
    } = req.body || {};

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

    // Save a free story if paid API key is missing
    if (!process.env.OPENAI_API_KEY) {
      return sendFreeStory(res, name, length, genre, language, format);
    }

    const previousTitles = episodes
      .slice(0, 20)
      .map(e => e.name);

    const sceneCount = durations[length];

    const prompt = `
Tum Magic Cartoon Studio ke professional Hindi cartoon writer ho.

Ek original cartoon adventure banao.
Permanent characters:
Arif - hero aur team leader
Zoya - Arif ki girlfriend
Rohan - hoshiyar dost
Sameer - mazaakiya dost

Chaaron characters har scene mein rahenge.
Unke face, hairstyle aur kapde consistent rahenge.

Kahani ka naam: ${name}
Genre: ${genre}
Language: ${language}
Duration: ${length}
Format: ${format}
Scenes: ${sceneCount}

Pichhli kahaniyan:
${previousTitles.join(", ") || "Koi nahi"}

Kahani mein shuruaat, problem, adventure, suspense aur ending ho.

Har scene mein number, description, visual, Hindi narration,
dialogue, sound effects aur subtitle do.

Sirf valid JSON return karo, markdown nahi.

Format:
{
 "synopsis":"Kahani ka saar",
 "fullStory":"Poori kahani",
 "characters":[
  {"name":"Arif","role":"Hero"},
  {"name":"Zoya","role":"Friend"},
  {"name":"Rohan","role":"Smart friend"},
  {"name":"Sameer","role":"Funny friend"}
 ],
 "scenes":[
  {
   "number":1,
   "description":"Scene",
   "visual":"Visual prompt",
   "narration":"Hindi narration",
   "dialogue":"Hindi dialogue",
   "sound":"Sound effects",
   "subtitle":"Hindi subtitle"
  }
 ]
}
`;

    let response;

    try {
      response = await fetch(
        "https://api.openai.com/v1/responses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + process.env.OPENAI_API_KEY
          },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
            input: prompt,
            max_output_tokens: 12000
          })
        }
      );
    } catch (apiError) {
      console.error("AI connection error:", apiError.message);
      return sendFreeStory(res, name, length, genre, language, format);
    }

    const result = await response.json();

    if (!response.ok) {
      console.error("AI API error:", result);
      return sendFreeStory(res, name, length, genre, language, format);
    }

    const outputText = (result.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n");

    if (!outputText) {
      return sendFreeStory(res, name, length, genre, language, format);
    }

    const cleaned = outputText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    let story;

    try {
      story = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("AI JSON error:", parseError.message);
      return sendFreeStory(res, name, length, genre, language, format);
    }

    if (!story.synopsis || !Array.isArray(story.scenes)) {
      return sendFreeStory(res, name, length, genre, language, format);
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
        "AI storyboard ready. Images, animation, voice, MP4 and YouTube upload are not connected yet."
    });

  } catch (error) {
    console.error("Story error:", error);
    return sendFreeStory(
      res,
      req.body?.name || "Nayi Cartoon Kahani",
      req.body?.length || "5 minute",
      req.body?.genre || "Adventure",
      req.body?.language || "Hindi",
      req.body?.format || "Long Video (16:9)"
    );
  }
});

// FREE STORY RESPONSE
function sendFreeStory(res, name, length, genre, language, format) {
  try {
    const story = createFreeStory(name, genre, length, language, format);

    const episode = {
      id: Date.now().toString(),
      name: name.trim(),
      length,
      genre,
      language,
      format,
      status: "Free backup storyboard ready",
      createdAt: new Date().toISOString(),
      story
    };

    episodes.unshift(episode);

    return res.json({
      success: true,
      episode,
      notice:
        "Free backup mode: Hindi story and storyboard generated without paid API. Cartoon images, animation, voice, MP4 rendering and YouTube upload are not connected yet."
    });

  } catch (error) {
    console.error("Free story error:", error);

    return res.status(500).json({
      success: false,
      error: "Free story generator mein dikkat hui: " + error.message
    });
  }
}

// START SERVER
app.listen(PORT, () => {
  console.log("Magic Cartoon Studio running on port " + PORT);
});
 
