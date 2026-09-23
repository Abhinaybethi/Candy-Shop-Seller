// backend/src/routes/bookRoutes.js
//
// CONCEPT: express.Router()
// A Router is a mini Express application that only handles routes.
// We create a router here, define all book-related routes on it,
// and then export it so server.js can mount it at /api/books.
// This keeps book logic in one place instead of cluttering server.js.

const express = require("express");
const router = express.Router();

// We pull the books array from our in-memory store.
// Because JavaScript exports objects by reference, any changes we make
// to this array (push, splice) will persist for the lifetime of the server.
const { books } = require("../data/store");

// ─────────────────────────────────────────────
// GET /api/books  — or  GET /api/books?search=...
//
// CONCEPT: req.query
// When someone visits /api/books?search=clean, Express automatically parses
// the query string and stores it in req.query.
// req.query.search will be the string "clean" in that example.
// ─────────────────────────────────────────────
router.get("/", (req, res) => {
  const searchTerm = req.query.search;

  // If a search query parameter was provided, filter the books.
  if (searchTerm) {
    const lowerSearch = searchTerm.toLowerCase();

    const filteredBooks = books.filter((book) => {
      return (
        book.title.toLowerCase().includes(lowerSearch) ||
        book.author.toLowerCase().includes(lowerSearch)
      );
    });

    return res.status(200).json({
      success: true,
      query: searchTerm,
      count: filteredBooks.length,
      data: filteredBooks,
    });
  }

  // No search term — return all books.
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
});

// ─────────────────────────────────────────────
// GET /api/books/:id
//
// CONCEPT: req.params
// The colon in ":id" tells Express this is a dynamic segment.
// Whatever the user puts there is captured and stored in req.params.
// e.g. GET /api/books/2  →  req.params.id === "2"
// Note: req.params.id is always a STRING, so we convert it with Number().
// ─────────────────────────────────────────────
router.get("/:id", (req, res) => {
  const bookId = Number(req.params.id);

  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  res.status(200).json({
    success: true,
    data: book,
  });
});

// ─────────────────────────────────────────────
// POST /api/books
//
// CONCEPT: req.body
// When a client sends a POST request with a JSON body, Express parses it
// and puts the result in req.body — but ONLY if app.use(express.json())
// is registered in server.js. Without that middleware, req.body is undefined.
// ─────────────────────────────────────────────
router.post("/", (req, res) => {
  const { title, author, category } = req.body;

  // Basic validation — title and author are required.
  if (!title || !author) {
    return res.status(400).json({
      success: false,
      message: "Title and author are required fields",
    });
  }

  // Generate a simple auto-incrementing id based on current array length.
  // When you add a database later, the DB will handle id generation.
  const newBook = {
    id: books.length + 1,
    title,
    author,
    category: category || "Uncategorized",
  };

  books.push(newBook);

  res.status(201).json({
    success: true,
    message: "Book has been added!",
    data: newBook,
  });
});

module.exports = router;
