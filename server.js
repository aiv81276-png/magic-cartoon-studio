const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(process.cwd()));

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Magic Cartoon Studio server is running"
  });
});

app.get("/api/story", (req, res) => {
  res.json({
    message: "Story API ready"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
