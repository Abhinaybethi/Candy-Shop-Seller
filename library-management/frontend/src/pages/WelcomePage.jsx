// frontend/src/pages/WelcomePage.jsx
//
// Demonstrates GET /api/welcome/:username?role=...
// This page makes the concept of req.params and req.query interactive.
// The user can type any username and role and see the live API response.

import { useState } from "react";

const API = "http://localhost:4000";

export default function WelcomePage() {
  const [username, setUsername] = useState("Abhinay");
  const [role, setRole] = useState("Admin");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // The URL we're calling — shown live so you can see it update
  const liveUrl = username
    ? `${API}/api/welcome/${encodeURIComponent(username)}${role ? `?role=${encodeURIComponent(role)}` : ""}`
    : null;

  async function handleSend(e) {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(liveUrl);
      const json = await res.json();
      setResponse(json);
    } catch {
      setError("Could not reach the backend. Is the server running on port 4000?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>👋 Welcome Route Demo</h1>
        <p>Interactively test how Express uses route params and query params together.</p>
      </div>

      <div className="concept-box">
        <strong>Express Concepts Demonstrated</strong>
        <strong style={{ color: "var(--accent-blue)", fontWeight: 600 }}>req.params.username</strong> — the <code>:username</code> segment in the URL path is always required.<br />
        <strong style={{ color: "var(--accent-orange)", fontWeight: 600 }}>req.query.role</strong> — the <code>?role=</code> query parameter is optional; the server defaults to "user" if omitted.<br /><br />
        Route defined as: <code>GET /api/welcome/:username</code>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        <div className="section-title">Try It Live</div>

        <form onSubmit={handleSend} className="welcome-demo">
          <div className="row">
            <div className="form-group">
              <label>Username (req.params.username)</label>
              <input
                type="text"
                placeholder="e.g. Abhinay"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Role (req.query.role — optional)</label>
              <input
                type="text"
                placeholder="e.g. Admin  (leave blank to omit)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>

          {/* Live URL preview */}
          {liveUrl && (
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "monospace", wordBreak: "break-all" }}>
              📡 <span style={{ color: "var(--accent-blue)" }}>GET</span> {liveUrl}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Sending..." : "Send Request →"}
          </button>
        </form>

        {error && <div className="status-message status-error" style={{ marginTop: 16 }}>{error}</div>}

        {response && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
              Response from server
            </div>
            <div className="response-box">
              {JSON.stringify(response, null, 2)}
            </div>
          </div>
        )}
      </div>

      {/* Explanation cards */}
      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 700 }}>
        <div className="card">
          <div style={{ color: "var(--accent-blue)", fontWeight: 700, fontSize: "0.85rem", marginBottom: 8 }}>req.params</div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Part of the URL <em>path</em>. Defined with a colon: <code>:username</code>. Always required — without it, the route won't match.
          </p>
          <div style={{ marginTop: 10, fontFamily: "monospace", fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", padding: "6px 10px", borderRadius: "4px", color: "var(--accent-green)" }}>
            /api/welcome/<span style={{ color: "var(--accent-orange)" }}>Abhinay</span>
          </div>
        </div>

        <div className="card">
          <div style={{ color: "var(--accent-orange)", fontWeight: 700, fontSize: "0.85rem", marginBottom: 8 }}>req.query</div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Part of the URL after <code>?</code>. Always optional. Express parses the query string automatically.
          </p>
          <div style={{ marginTop: 10, fontFamily: "monospace", fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", padding: "6px 10px", borderRadius: "4px", color: "var(--accent-green)" }}>
            /api/welcome/Abhinay?<span style={{ color: "var(--accent-orange)" }}>role=Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
