// frontend/src/pages/BooksPage.jsx
//
// This page demonstrates:
//   GET /api/books           — fetch all books
//   GET /api/books?search=   — search via query param
//   POST /api/books          — add a book via request body
//
// All data comes from the Express backend. Nothing is hardcoded here.

import { useState, useEffect } from "react";
import BookCard from "../components/BookCard";

const API = "http://localhost:4000";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state for adding a new book
  const [form, setForm] = useState({ title: "", author: "", category: "" });
  const [formStatus, setFormStatus] = useState(null); // { type: "success"|"error", message }

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null); // null means "not searched yet"

  // ── Fetch all books on page load ──────────────────
  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/books`);
      const json = await res.json();
      setBooks(json.data);
    } catch (err) {
      setError("Could not connect to the backend. Is the server running on port 4000?");
    } finally {
      setLoading(false);
    }
  }

  // ── Search via GET /api/books?search=... ──────────
  async function handleSearch(e) {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults(null); // clear search, show all books
      return;
    }
    try {
      const res = await fetch(`${API}/api/books?search=${encodeURIComponent(searchTerm)}`);
      const json = await res.json();
      setSearchResults(json.data);
    } catch {
      setError("Search failed. Is the server running?");
    }
  }

  function clearSearch() {
    setSearchTerm("");
    setSearchResults(null);
  }

  // ── POST /api/books ───────────────────────────────
  async function handleAddBook(e) {
    e.preventDefault();
    setFormStatus(null);

    try {
      const res = await fetch(`${API}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();

      if (res.ok) {
        setFormStatus({ type: "success", message: json.message });
        setForm({ title: "", author: "", category: "" });
        fetchBooks(); // refresh the list
      } else {
        setFormStatus({ type: "error", message: json.message });
      }
    } catch {
      setFormStatus({ type: "error", message: "Failed to add book. Is the server running?" });
    }
  }

  const displayedBooks = searchResults !== null ? searchResults : books;

  function getCategoryBadge(category) {
    const map = {
      programming: "badge-blue",
      javascript: "badge-orange",
      design: "badge-purple",
    };
    return map[category?.toLowerCase()] || "badge-green";
  }

  return (
    <div>
      <div className="page-header">
        <h1>📚 Books</h1>
        <p>Manage the library book collection. All data is fetched from the Express backend.</p>
      </div>

      <div className="concept-box">
        <strong>Express Concepts Used on This Page</strong>
        Fetching books → <code>GET /api/books</code> — uses <strong>req.query.search</strong> for filtering.<br />
        Getting one book → <code>GET /api/books/:id</code> — uses <strong>req.params.id</strong>.<br />
        Adding a book → <code>POST /api/books</code> — server reads <strong>req.body</strong>.
      </div>

      <div className="two-col">
        {/* ── Add Book Form ── */}
        <div>
          <div className="card">
            <div className="section-title">Add a New Book</div>

            {formStatus && (
              <div className={`status-message status-${formStatus.type}`}>
                {formStatus.message}
              </div>
            )}

            <form onSubmit={handleAddBook}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Clean Code"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Author *</label>
                <input
                  type="text"
                  placeholder="e.g. Robert C. Martin"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  placeholder="e.g. Programming"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-success">
                + Add Book
              </button>
            </form>
          </div>
        </div>

        {/* ── Book List ── */}
        <div>
          <div className="card">
            <div className="section-title">
              All Books
              <span className="count-chip">{displayedBooks.length}</span>
            </div>

            {/* Search Bar */}
            <form className="search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">Search</button>
              {searchResults !== null && (
                <button type="button" className="btn btn-sm" style={{ background: "var(--bg-card-hover)", color: "var(--text-secondary)" }} onClick={clearSearch}>
                  Clear
                </button>
              )}
            </form>

            {loading && (
              <div className="status-message status-loading">Loading books from backend...</div>
            )}
            {error && (
              <div className="status-message status-error">{error}</div>
            )}

            {!loading && !error && displayedBooks.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📖</div>
                <p>No books found.</p>
              </div>
            )}

            {!loading && (
              <div className="items-grid">
                {displayedBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    getCategoryBadge={getCategoryBadge}
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
