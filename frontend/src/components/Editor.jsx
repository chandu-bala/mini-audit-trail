import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

/**
 * Editor.jsx
 * - Uses the robot image located at: /9784c699-114b-4d14-be1a-cee6d3c9eeb7.png
 * - Make sure that file is placed in frontend/public with the exact filename.
 */

export default function Editor() {
  const [content, setContent] = useState("");
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVersions();
  }, []);

  async function fetchVersions() {
    try {
      const res = await fetch(`${API_BASE_URL}/versions`);
      if (!res.ok) throw new Error("Failed to load versions");
      const data = await res.json();
      setVersions(data);
    } catch (err) {
      console.error("Error fetching versions:", err);
    }
  }

  async function saveVersion() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/save-version`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
      if (!res.ok) throw new Error("Save failed");
      const saved = await res.json();
      setVersions(prev => [saved, ...prev]);
      setLoading(false);
    } catch (err) {
      console.error("Error saving version:", err);
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <h2 className="main-title">Mini Audit Trail Generator</h2>

      <div className="top-block">
        <div className="editor-card">

  <div className="image-and-editor-row">

    {/* LEFT: IMAGE */}
    <div className="editor-image-box">
      <img
        src="./robo_image.png"
        alt="robot"
        className="editor-image"
      />
    </div>

    {/* RIGHT: ALL EDITOR UI */}
    <div className="editor-content-area">

      <div className="editor-header">
        <h3>Content Editor</h3>
        <div className="editor-subtitle">
          Edit text and click <strong>Save Version</strong>
        </div>
      </div>

      <textarea
        className="editor-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write something..."
      />

      <div className="save-row">
        <button
          className="save-btn"
          onClick={saveVersion}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Version"}
        </button>

        <div className="char-count">
          {content.length} chars
        </div>
      </div>

    </div>

  </div>

</div>

        

        
      </div>

      {/* History panel below */}
      <div className="history-panel">
        <h3>Version History</h3>

        {versions.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No versions saved yet.</p>
        ) : (
          versions.map((v) => (
            <div key={v.id} className="history-entry">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <strong>{v.timestamp}</strong>
                </div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  OldWords: {v.oldWordCount} • NewWords: {v.newWordCount}
                </div>
              </div>

              <div style={{ marginTop: 8 }}>
                <strong>Added:</strong>{" "}
                {v.addedWords && v.addedWords.length > 0 ? v.addedWords.join(", ") : "None"}
              </div>

              <div style={{ marginTop: 6 }}>
                <strong>Removed:</strong>{" "}
                {v.removedWords && v.removedWords.length > 0 ? v.removedWords.join(", ") : "None"}
              </div>

              <div className="meta-info">OldLen: {v.oldLength} | NewLen: {v.newLength}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
