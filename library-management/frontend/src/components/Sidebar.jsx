// frontend/src/components/Sidebar.jsx

export default function Sidebar({ pages, activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>📖</span>
        Library MS
      </div>

      {pages.map((page) => (
        <button
          key={page.id}
          className={`nav-btn ${activePage === page.id ? "active" : ""}`}
          onClick={() => setActivePage(page.id)}
        >
          <span className="icon">{page.icon}</span>
          {page.label}
        </button>
      ))}

      {/* Info footer */}
      <div style={{ marginTop: "auto", fontSize: "0.72rem", color: "var(--text-muted)", padding: "12px", lineHeight: 1.7 }}>
        Backend: <span style={{ color: "var(--accent-green)" }}>localhost:4000</span><br />
        Stack: Node.js + Express<br />
        Frontend: React + Vite
      </div>
    </aside>
  );
}
