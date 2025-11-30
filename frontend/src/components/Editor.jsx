import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

export default function Editor() {
  const [content, setContent] = useState("");
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch version history on load
  

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

      // Update UI immediately
      setVersions([saved, ...versions]);
      setLoading(false);
    } catch (err) {
      console.error("Error saving version:", err);
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto" }}>
      <h2>Mini Audit Trail Generator</h2>

      {/* CONTENT EDITOR */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Content Editor</h3>
        <textarea
          rows={10}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
          placeholder="Type or edit content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        <button
          onClick={saveVersion}
          disabled={loading}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "6px",
            background: "#007bff",
            color: "white",
            border: "none"
          }}
        >
          {loading ? "Saving..." : "Save Version"}
        </button>
      </div>

      {/* VERSION HISTORY */}
      <div>
        <h3>Version History</h3>

        {versions.length === 0 ? (
          <p>No versions saved yet.</p>
        ) : (
          <div style={{ marginTop: "10px" }}>
            {versions.map((version) => (
              <div
                key={version.id}
                style={{
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  marginBottom: "12px"
                }}
              >
                <strong>Timestamp:</strong> {version.timestamp} <br />
                <strong>Added Words:</strong>{" "}
                {version.addedWords?.length > 0
                  ? version.addedWords.join(", ")
                  : "None"}
                <br />
                <strong>Removed Words:</strong>{" "}
                {version.removedWords?.length > 0
                  ? version.removedWords.join(", ")
                  : "None"}
                <br />
                <small>
                  Old Length: {version.oldLength} | New Length:{" "}
                  {version.newLength}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
