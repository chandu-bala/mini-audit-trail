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

// ---------------------------
// RAILWAY STORAGE CONFIG
// ---------------------------

// Railway persistent volume is mounted at /data
const DATA_DIR = process.env.DATA_DIR || "/data";
const VERSION_FILE = "/data/versions.json";


// Ensure folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure versions.json exists
if (!fs.existsSync(VERSION_FILE)) {
  fs.writeFileSync(VERSION_FILE, JSON.stringify([]));
}

// Safe loader
function loadVersions() {
  try {
    if (!fs.existsSync("/data")) {
      fs.mkdirSync("/data");
    }

    if (!fs.existsSync(VERSION_FILE)) {
      fs.writeFileSync(VERSION_FILE, JSON.stringify([]));
    }

    return JSON.parse(fs.readFileSync(VERSION_FILE));
  } catch (err) {
    console.error("Error reading versions.json → resetting:", err);
    fs.writeFileSync(VERSION_FILE, JSON.stringify([]));
    return [];
  }
}


// Safe writer
function saveVersions(versions) {
  fs.writeFileSync(VERSION_FILE, JSON.stringify(versions, null, 2));
}

// ---------------------------
// API ROUTES
// ---------------------------

// GET /versions → newest first
app.get("/versions", (req, res) => {
  const versions = loadVersions();
  res.json([...versions].reverse()); 
});

// POST /save-version → compute diff + save
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
    _rawContent: content // Internal use only
  };

  versions.push(newEntry);
  saveVersions(versions);

  // Remove _rawContent before sending
  const clientCopy = { ...newEntry };
  delete clientCopy._rawContent;

  res.json(clientCopy);
});

// ---------------------------
// START SERVER (Railway must use PORT)
// ---------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
