// frontend/src/pages/UsersPage.jsx
//
// Demonstrates:
//   GET /api/users           — fetch all users
//   GET /api/users?role=...  — filter by role via query param
//   POST /api/users          — add user via request body

import { useState, useEffect } from "react";
import UserCard from "../components/UserCard";

const API = "http://localhost:4000";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({ name: "", email: "", role: "student" });
  const [formStatus, setFormStatus] = useState(null);

  const [roleFilter, setRoleFilter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/users`);
      const json = await res.json();
      setUsers(json.data);
    } catch {
      setError("Could not reach backend on port 4000.");
    } finally {
      setLoading(false);
    }
  }

  // GET /api/users?role=...
  async function handleRoleFilter(e) {
    e.preventDefault();
    if (!roleFilter.trim()) {
      setFilteredUsers(null);
      return;
    }
    try {
      const res = await fetch(`${API}/api/users?role=${encodeURIComponent(roleFilter)}`);
      const json = await res.json();
      setFilteredUsers(json.data);
    } catch {
      setError("Filter request failed.");
    }
  }

  function clearFilter() {
    setRoleFilter("");
    setFilteredUsers(null);
  }

  // POST /api/users
  async function handleAddUser(e) {
    e.preventDefault();
    setFormStatus(null);
    try {
      const res = await fetch(`${API}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (res.ok) {
        setFormStatus({ type: "success", message: json.message });
        setForm({ name: "", email: "", role: "student" });
        fetchUsers();
      } else {
        setFormStatus({ type: "error", message: json.message });
      }
    } catch {
      setFormStatus({ type: "error", message: "Failed to add user. Is the server running?" });
    }
  }

  const displayedUsers = filteredUsers !== null ? filteredUsers : users;

  function getRoleBadge(role) {
    const map = { admin: "badge-purple", student: "badge-blue", librarian: "badge-orange" };
    return map[role?.toLowerCase()] || "badge-green";
  }

  return (
    <div>
      <div className="page-header">
        <h1>👤 Users</h1>
        <p>View and manage library users. Filter by role using query parameters.</p>
      </div>

      <div className="concept-box">
        <strong>Express Concepts Used on This Page</strong>
        Filter by role → <code>GET /api/users?role=student</code> — uses <strong>req.query.role</strong>.<br />
        Fetch one user → <code>GET /api/users/:id</code> — uses <strong>req.params.id</strong>.<br />
        Add user → <code>POST /api/users</code> — server reads <strong>req.body</strong>.
      </div>

      <div className="two-col">
        {/* ── Add User Form ── */}
        <div>
          <div className="card">
            <div className="section-title">Add a New User</div>

            {formStatus && (
              <div className={`status-message status-${formStatus.type}`}>
                {formStatus.message}
              </div>
            )}

            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Abhinay"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  placeholder="e.g. abhinay@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                  <option value="librarian">Librarian</option>
                </select>
              </div>
              <button type="submit" className="btn btn-success">
                + Add User
              </button>
            </form>
          </div>
        </div>

        {/* ── User List ── */}
        <div>
          <div className="card">
            <div className="section-title">
              All Users
              <span className="count-chip">{displayedUsers.length}</span>
            </div>

            {/* Role Filter */}
            <form className="search-bar" onSubmit={handleRoleFilter}>
              <input
                type="text"
                placeholder="Filter by role: student, admin, librarian..."
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">Filter</button>
              {filteredUsers !== null && (
                <button type="button" className="btn btn-sm" style={{ background: "var(--bg-card-hover)", color: "var(--text-secondary)" }} onClick={clearFilter}>
                  Clear
                </button>
              )}
            </form>

            {loading && <div className="status-message status-loading">Loading users...</div>}
            {error && <div className="status-message status-error">{error}</div>}

            {!loading && displayedUsers.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">👤</div>
                <p>No users found.</p>
              </div>
            )}

            {!loading && (
              <div className="items-grid">
                {displayedUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    getRoleBadge={getRoleBadge}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
