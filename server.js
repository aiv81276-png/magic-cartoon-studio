
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

app.post("/api/story", (req, res) => {
  const { name, length, genre, language, format } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({
      error: "Story ka naam zaroori hai"
    });
  }

  res.json({
    success: true,
    message: "Story details received",
    story: {
      name: name.trim(),
      length,
      genre,
      language,
      format
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Magic Cartoon Studio running on port ${PORT}`);
});
