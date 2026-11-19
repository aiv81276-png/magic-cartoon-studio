
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const PORT = process.env.PORT || 3000;

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

const characters = [
  { name: "Arif", role: "Hero aur team leader" },
  { name: "Zoya", role: "Arif ki girlfriend" },
  { name: "Rohan", role: "Hoshiyaar dost" },
  { name: "Sameer", role: "Mazaakiya dost" }
];

const episodes = [];

function makeStory(name, genre, count) {
  const beats = [
    "Chaaron dost ek anokhi jagah par pahunchte hain.",
    "Arif ko ek rahasyamayi nishaan milta hai.",
    "Zoya ko ek chhupa hua raasta dikhta hai.",
    "Rohan ek mushkil paheli samajhne ki koshish karta hai.",
    "Sameer ko ek ajeeb awaaz sunai deti hai.",
    "Chaaron milkar pehli mushkil paar karte hain.",
    "Arif ek gupt darwaza kholta hai.",
    "Zoya ko ek zaroori suraag milta hai.",
    "Rohan paheli ka hal nikalta hai.",
    "Sameer apne doston ko khatre se bachata hai.",
    "Chaaron ko asli rahasya pata chalta hai.",
    "Dost milkar apna mission poora karte hain."
  ];

  return {
    name,
    genre,
    synopsis:
      "Arif, Zoya, Rohan aur Sameer ki ek nayi " +
      genre.toLowerCase() +
      " kahani. Chaaron dost milkar ek mushkil safar par nikalte hain aur milkar rahasya suljhate hain.",
    characters,
    characterConsistency:
      "Har scene mein same face, hairstyle, kapde aur character design.",
    scenes: Array.from({ length: count }, (_, i) => ({
      number: i + 1,
      prompt: beats[i % beats.length],
      visual:
        "Original 3D cartoon scene. Arif, Zoya, Rohan aur Sameer. " +
        "Same character appearance in every scene. Cinematic 3D animation.",
      narration: beats[i % beats.length],
      subtitle: beats[i % beats.length]
    }))
  };
}

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "online" });
});

app.get("/api/production-status", (req, res) => {
  res.json({
    storyGenerator: "Ready",
    characterProfiles: "Ready",
    imageGeneration: process.env.IMAGE_API_KEY
      ? "Configured"
      : "Not connected",
    videoGeneration: process.env.VIDEO_API_KEY
      ? "Configured"
      : "Not connected",
    hindiVoice: process.env.TTS_API_KEY
      ? "Configured"
      : "Not connected",
    database: process.env.DATABASE_URL
      ? "Configured"
      : "Not connected",
    youtube: process.env.YOUTUBE_CLIENT_ID &&
      process.env.YOUTUBE_CLIENT_SECRET
      ? "Configured"
      : "Not connected",
    automaticDailySchedule: "Not configured",
    uploadApproval: "Required before publishing"
  });
});

app.get("/api/characters", (req, res) => {
  res.json({ success: true, characters });
});

app.get("/api/episodes", (req, res) => {
  res.json({
    success: true,
    episodes: episodes.map(e => ({
      id: e.id,
      name: e.name,
      length: e.length,
      status: e.status
    }))
  });
});

app.post("/api/story", (req, res) => {
  const {
    name,
    length = "5 minute",
    genre = "Adventure",
    language = "Hindi",
    format = "Long Video (16:9)"
  } = req.body || {};

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      success: false,
      error: "Kahani ka naam likho."
    });
  }

  if (!Object.prototype.hasOwnProperty.call(durations, length)) {
    return res.status(400).json({
      success: false,
      error: "Video length valid nahi hai."
    });
  }

  const story = makeStory(
    name.trim(),
    genre,
    durations[length]
  );

  const episode = {
    id: Date.now().toString(),
    name: name.trim(),
    length,
    language,
    format,
    status: "Storyboard ready",
    story,
    createdAt: new Date().toISOString()
  };

  episodes.unshift(episode);

  res.json({
    success: true,
    episode,
    notice:
      "Storyboard ready hai. Actual images, animation, voice aur MP4 ke liye generation providers connect karne honge."
  });
});

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

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Magic Cartoon Studio</title>
<style>
*{box-sizing:border-box}
body{margin:0;padding:16px;background:#101426;color:white;font-family:Arial;max-width:850px;margin:auto}
h1{color:#ffcf5a;text-align:center}
.card{background:#202944;padding:18px;border-radius:15px;margin:15px 0}
label{display:block;margin:13px 0 7px}
input,select,button{width:100%;padding:13px;border:0;border-radius:9px;font-size:16px}
input,select{background:white;color:#111}
button{background:#ffbd45;color:#111;font-weight:bold;margin-top:15px}
.person{background:#18223b;padding:12px;border-radius:9px}
.people{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.gold{color:#ffcf5a}
#result{white-space:pre-wrap;line-height:1.6;overflow-wrap:anywhere}
.small{color:#bdc7df;font-size:13px;line-height:1.5}
.status{background:#18223b;padding:12px;border-radius:9px;margin-top:12px}
</style>
</head>
<body>
<h1>🎬 Magic Cartoon Studio</h1>
<p style="text-align:center">Hindi Cartoon Video Creation Studio</p>

<div class="card">
<h3>⭐ Permanent Characters</h3>
<div class="people">
<div class="person"><b class="gold">Arif</b><br>Hero</div>
<div class="person"><b class="gold">Zoya</b><br>Arif ki girlfriend</div>
<div class="person"><b class="gold">Rohan</b><br>Hoshiyaar dost</div>
<div class="person"><b class="gold">Sameer</b><br>Mazaakiya dost</div>
</div>
<p class="small">Sabhi characters ka design har episode mein consistent rakhne ka instruction diya jayega.</p>
</div>

<div class="card">
<h3>🎥 Naya Episode Banao</h3>
<label>Kahani ka naam</label>
<input id="name" value="Arif aur Rahasyamayi Qila">

<label>Video length</label>
<select id="length">
<option>30 second</option>
<option>1 minute</option>
<option>3 minute</option>
<option>5 minute</option>
<option>10 minute</option>
<option>15 minute</option>
<option>30 minute</option>
<option>45 minute</option>
<option>60 minute (1 ghanta)</option>
</select>

<label>Video format</label>
<select id="format">
<option>Long Video (16:9)</option>
<option>YouTube Shorts (9:16)</option>
</select>

<label>Kahani ka type</label>
<select id="genre">
<option>Adventure</option>
<option>Comedy</option>
<option>Fantasy</option>
<option>Friendship</option>
<option>Moral Story</option>
</select>

<label>Language</label>
<select id="language">
<option>Hindi</option>
<option>Hinglish</option>
</select>

<button onclick="createStory()">✨ Naya Episode Banao</button>
<div id="status" class="status">Ready</div>
<div id="result"></div>
</div>

<div class="card">
<h3>📚 Episode History</h3>
<button onclick="loadEpisodes()">Episode list dekho</button>
<div id="history"></div>
</div>

<div class="card">
<h3>⚙️ Production Status</h3>
<button onclick="loadStatus()">Connection check karo</button>
<div id="production"></div>
</div>

<div class="card">
<h3>📺 YouTube</h3>
<p class="small">YouTube upload tabhi hoga jab secure Google authorization aur video generation setup complete ho. Har public upload se pehle tumhari approval zaroori hogi.</p>
</div>

<script>
async function createStory(){
 const status=document.getElementById("status");
 const result=document.getElementById("result");
 status.textContent="Episode ban raha hai...";
 result.textContent="";
 try{
  const response=await fetch("/api/story",{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify({
    name:document.getElementById("name").value,
    length:document.getElementById("length").value,
    genre:document.getElementById("genre").value,
    language:document.getElementById("language").value,
    format:document.getElementById("format").value
   })
  });
  const data=await response.json();
  if(!response.ok)throw new Error(data.error);
  const e=data.episode;
  let out="🎬 "+e.name+"\\n";
  out+="Length: "+e.length+"\\n\\n";
  out+="KAHANI\\n"+e.story.synopsis+"\\n\\n";
  out+="CHARACTERS\\n";
  e.story.characters.forEach(c=>out+=c.name+" - "+c.role+"\\n");
  out+="\\nSCENES\\n";
  e.story.scenes.forEach(s=>{
   out+="\\nScene "+s.number+"\\n"+s.prompt+"\\n";
   out+="Visual: "+s.visual+"\\n";
  });
  result.textContent=out+"\\n"+data.notice;
  status.textContent="Storyboard ready!";
 }catch(err){
  status.textContent="Error: "+err.message;
 }
}
async function loadEpisodes(){
 const box=document.getElementById("history");
 try{
  const r=await fetch("/api/episodes");
  const d=await r.json();
  box.textContent=d.episodes.length
   ? d.episodes.map(e=>e.name+" — "+e.length+" — "+e.status).join("\\n")
   : "Abhi koi episode nahi hai.";
 }catch(e){box.textContent="History load nahi hui."}
}
async function loadStatus(){
 const box=document.getElementById("production");
 try{
  const r=await fetch("/api/production-status");
  const d=await r.json();
  box.textContent=Object.entries(d).map(x=>x[0]+": "+x[1]).join("\\n");
 }catch(e){box.textContent="Status load nahi hua."}
}
</script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log("Magic Cartoon Studio running on port " + PORT);
});
 
