
<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Magic Cartoon Studio</title>
<style>
*{box-sizing:border-box}
body{margin:0;padding:16px;background:#101426;color:white;font-family:Arial,sans-serif;max-width:800px;margin:auto}
h1{color:#ffcf5a;text-align:center}
p{color:#ccd2e5;line-height:1.5}
.card{background:#202944;padding:18px;border-radius:16px;margin:16px 0}
label{display:block;margin:14px 0 7px}
input,select,button{width:100%;padding:13px;border:0;border-radius:9px;font-size:16px}
input,select{background:white;color:#171717}
button{background:#ffbd45;color:#171717;font-weight:bold;margin-top:12px}
button:disabled{opacity:.6}
.secondary{background:#344363;color:white}
.people{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.person{background:#18223b;padding:13px;border-radius:10px}
.person b{color:#ffcf5a}
.status{background:#18223b;padding:12px;border-radius:9px;margin-top:12px}
#result{white-space:pre-wrap;line-height:1.6;margin-top:16px;overflow-wrap:anywhere}
.small{font-size:13px;color:#b9c3dc}
#player{display:none;background:#18223b;padding:14px;border-radius:12px;margin-top:14px}
#subtitle{font-size:18px;line-height:1.5;color:#ffdf91;margin:12px 0}
</style>
</head>
<body>

<h1>🎬 Magic Cartoon Studio</h1>
<p style="text-align:center">Your Hindi Cartoon Story Studio</p>

<div class="card">
<h3>⭐ Permanent Characters</h3>
<div class="people">
<div class="person"><b>Arif</b><br>Hero and team leader</div>
<div class="person"><b>Zoya</b><br>Arif's girlfriend</div>
<div class="person"><b>Rohan</b><br>Smart friend</div>
<div class="person"><b>Sameer</b><br>Funny friend</div>
</div>
<p class="small">All four characters are included in every story.</p>
</div>

<div class="card">
<h3>🎥 Create a New Cartoon Story</h3>

<label>Story name</label>
<input id="name" value="Arif aur Jadui Kitaab">

<label>Video duration</label>
<select id="length">
<option>30 second</option>
<option>1 minute</option>
<option>3 minute</option>
<option selected>5 minute</option>
<option>10 minute</option>
<option>15 minute</option>
<option>30 minute</option>
<option>45 minute</option>
<option>60 minute (1 ghanta)</option>
</select>

<label>Video format</label>
<select id="format">
<option>YouTube Shorts (9:16)</option>
<option selected>Long Video (16:9)</option>
</select>

<label>Story type</label>
<select id="genre">
<option>Adventure</option>
<option>Comedy</option>
<option>Moral Story</option>
<option>Fantasy</option>
<option>Friendship</option>
<option>Animal Story</option>
</select>

<label>Language</label>
<select id="language">
<option>Hindi</option>
<option>Hinglish</option>
</select>

<button id="make" onclick="createStory()">✨ Generate Story and Scenes</button>
<div id="status" class="status">Ready to create your story.</div>
<div id="result"></div>

<div id="player">
<h3>🔊 Story Narration Preview</h3>
<div id="sceneTitle">Scene preview</div>
<div id="subtitle">Yahan scene ka subtitle dikhega.</div>
<div class="small" id="sceneCount"></div>

<button onclick="playAll()">▶ Play all scenes</button>
<button class="secondary" onclick="stopNarration()">⏹ Stop narration</button>
<button class="secondary" onclick="previousScene()">⏮ Previous scene</button>
<button class="secondary" onclick="nextScene()">Next scene ⏭</button>

<p class="small">Hindi voice mobile/browser mein available voice par depend karti hai.</p>
</div>
</div>

<div class="card">
<h3>📺 YouTube Upload</h3>
<p>Upload approval will always be required before publishing.</p>
<p class="small">Actual cartoon images, animation, music, MP4 rendering and YouTube upload abhi connect nahi hain.</p>
</div>

<script>
let currentScenes = [];
let currentIndex = 0;
let isPlayingAll = false;

async function createStory(){
 const name=document.getElementById("name").value.trim();
 const length=document.getElementById("length").value;
 const genre=document.getElementById("genre").value;
 const language=document.getElementById("language").value;
 const format=document.getElementById("format").value;
 const button=document.getElementById("make");
 const status=document.getElementById("status");
 const result=document.getElementById("result");

 stopNarration();

 if(!name){
  status.textContent="Please enter a story name.";
  return;
 }

 button.disabled=true;
 button.textContent="⏳ Creating story...";
 status.textContent="Connecting to story generator...";
 result.textContent="";
 document.getElementById("player").style.display="none";

 try{
  const response=await fetch("/api/story",{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify({name,length,genre,language,format})
  });

  const data=await response.json();

  if(!response.ok){
   throw new Error(data.error || "Story generation failed.");
  }

  const episode=data.episode;
  const story=episode && episode.story;

  if(!story || !Array.isArray(story.scenes)){
   throw new Error("Invalid story response.");
  }

  let output="🎬 "+episode.name+"\n";
  output+="Duration: "+episode.length+"\n";
  output+="Format: "+episode.format+"\n";
  output+="Genre: "+episode.genre+"\n\n";

  output+="📖 STORY SUMMARY\n";
  output+=(story.synopsis||"")+"\n\n";

  output+="📚 FULL STORY\n";
  output+=(story.fullStory||"")+"\n\n";

  output+="🎭 CHARACTERS\n";

  (story.characters||[]).forEach(c=>{
   output+=c.name+" - "+c.role+"\n";
  });

  output+="\n🎞️ SCENE BY SCENE STORYBOARD\n";

  story.scenes.forEach(scene=>{
   output+="\n--------------------\n";
   output+="SCENE "+scene.number+"\n";
   output+="Description: "+(scene.description||"")+"\n";
   output+="Visual: "+(scene.visual||"")+"\n";
   output+="Hindi Narration: "+(scene.narration||"")+"\n";
   output+="Dialogue: "+(scene.dialogue||"")+"\n";
   output+="Sound Effects: "+(scene.sound||"")+"\n";
   output+="Subtitle: "+(scene.subtitle||"")+"\n";
  });

  output+="\n\n⚠️ "+(data.notice||"Storyboard ready.");

  result.textContent=output;

  currentScenes=story.scenes;
  currentIndex=0;

  document.getElementById("player").style.display="block";
  showCurrentScene();

  status.textContent="✅ Story and storyboard generated successfully!";

 }catch(error){
  status.textContent="❌ Error: "+error.message;
 }finally{
  button.disabled=false;
  button.textContent="✨ Generate Story and Scenes";
 }
}

function showCurrentScene(){
 if(!currentScenes.length)return;

 const scene=currentScenes[currentIndex];

 document.getElementById("sceneTitle").textContent=
  "🎬 Scene "+scene.number;

 document.getElementById("subtitle").textContent=
  scene.subtitle||scene.narration||"";

 document.getElementById("sceneCount").textContent=
  "Scene "+(currentIndex+1)+" of "+currentScenes.length;
}

function speakCurrent(onEnd){
 if(!currentScenes.length)return;

 window.speechSynthesis.cancel();

 const scene=currentScenes[currentIndex];
 const text=(scene.narration||"")+" "+(scene.dialogue||"");

 const utterance=new SpeechSynthesisUtterance(text);
 utterance.lang="hi-IN";
 utterance.rate=0.92;

 utterance.onend=()=>{
  if(onEnd)onEnd();
 };

 utterance.onerror=()=>{
  isPlayingAll=false;
 };

 window.speechSynthesis.speak(utterance);
}

function playAll(){
 if(!currentScenes.length)return;

 isPlayingAll=true;
 playSequence();
}

function playSequence(){
 if(!isPlayingAll||currentIndex>=currentScenes.length){
  isPlayingAll=false;
  return;
 }

 showCurrentScene();

 speakCurrent(()=>{
  if(!isPlayingAll)return;

  currentIndex++;

  if(currentIndex<currentScenes.length){
   playSequence();
  }else{
   isPlayingAll=false;
   currentIndex=currentScenes.length-1;
   showCurrentScene();
  }
 });
}

function stopNarration(){
 isPlayingAll=false;

 if("speechSynthesis" in window){
  window.speechSynthesis.cancel();
 }
}

function nextScene(){
 stopNarration();

 if(currentIndex<currentScenes.length-1){
  currentIndex++;
 }

 showCurrentScene();
}

function previousScene(){
 stopNarration();

 if(currentIndex>0){
  currentIndex--;
 }

 showCurrentScene();
}
</script>

</body>
</html>
