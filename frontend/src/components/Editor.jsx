import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

export default function Editor() {
  const [content, setContent] = useState("");
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);


  async function fetchVersions() {
    try {
      const res = await fetch(`${API_BASE_URL}/versions`);
      const data = await res.json();
      setVersions(data);
    } catch (err) {
      console.error("Error fetching versions:", err);
    }
  }
  
useEffect(() => {
  async function loadVersions() {
    await fetchVersions();
  }
  loadVersions();
}, []);

  async function saveVersion() {
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/save-version`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });

      const saved = await res.json();
      setVersions([saved, ...versions]);
      setLoading(false);

    } catch (err) {
      console.error("Error saving version:", err);
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <h2 className="main-title">Mini Audit Trail Generator</h2>

      <div className="editor-layout">

        {/* Editor */}
        <div className="editor-box">
          <h3>Content Editor</h3>

          <textarea
            rows={12}
            placeholder="Type or edit content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>

          <button
            className="save-btn"
            onClick={saveVersion}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Version"}
          </button>
        </div>

        {/* Version History */}
        <div className="history-box">
          <h3>Version History</h3>

          {versions.length === 0 ? (
            <p>No versions saved yet.</p>
          ) : (
            versions.map((v) => (
              <div key={v.id} className="history-entry">
                <strong>{v.timestamp}</strong>
                <br />

                <strong>Added:</strong>{" "}
                {v.addedWords?.length > 0 ? v.addedWords.join(", ") : "None"}
                <br />

                <strong>Removed:</strong>{" "}
                {v.removedWords?.length > 0 ? v.removedWords.join(", ") : "None"}

                <div className="meta-info">
                  Old Length: {v.oldLength} | New Length: {v.newLength}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}















