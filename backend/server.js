const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");
const diffTexts = require("./utils/diff");

const app = express();
app.use(express.json());
app.use(cors());

// In-memory storage (Railway Free Tier compatible)
let versions = [];

// GET /versions
app.get("/versions", (req, res) => {
  res.json([...versions].reverse());
});

// POST /save-version
app.post("/save-version", (req, res) => {
  const { content } = req.body;

  if (typeof content !== "string") {
    return res.status(400).json({ error: "Invalid content" });
  }

  const lastVersion = versions.length > 0 ? versions[versions.length - 1] : null;
  const oldContent = lastVersion ? lastVersion._rawContent : "";

  const diff = diffTexts(oldContent, content);

  const newEntry = {
    id: uuidv4(),
    timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    addedWords: diff.addedWords,
    removedWords: diff.removedWords,
    addedCounts: diff.addedCounts,
    removedCounts: diff.removedCounts,
    oldLength: oldContent.length,
    newLength: content.length,
    oldWordCount: diff.oldWordCount,
    newWordCount: diff.newWordCount,
    _rawContent: content
  };

  versions.push(newEntry);

  const responseCopy = { ...newEntry };
  delete responseCopy._rawContent;

  res.json(responseCopy);
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
