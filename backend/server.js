// server.js

const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");
const diffTexts = require("./utils/diff");

const app = express();
app.use(express.json());
app.use(cors());

// JSON file path
const VERSION_FILE = path.join(__dirname, "data/versions.json");

// Load existing versions or create empty file
function loadVersions() {
  if (!fs.existsSync(VERSION_FILE)) {
    fs.writeFileSync(VERSION_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(VERSION_FILE));
}

function saveVersions(versions) {
  fs.writeFileSync(VERSION_FILE, JSON.stringify(versions, null, 2));
}

// GET /versions  → return history list
app.get("/versions", (req, res) => {
  const versions = loadVersions();
  res.json(versions.reverse()); // newest first
});

// POST /save-version  → save new version & compute diff
app.post("/save-version", (req, res) => {
  const { content } = req.body;

  if (typeof content !== "string") {
    return res.status(400).json({ error: "Invalid content" });
  }

  const versions = loadVersions();
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
    _rawContent: content // stored internally for next diff
  };

  versions.push(newEntry);
  saveVersions(versions);

  // send clean version (no raw text)
  const responseCopy = { ...newEntry };
  delete responseCopy._rawContent;

  res.json(responseCopy);
});

// Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
