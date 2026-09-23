// backend/src/data/store.js
//
// This is our temporary in-memory data store.
// We use plain JavaScript arrays instead of a database for now.
// When you learn MongoDB or PostgreSQL later, this file will be replaced
// by a database connection and model files — but every route file will
// keep the same structure, so the refactor will be easy.

const books = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    category: "Programming",
  },
  {
    id: 3,
    title: "You Don't Know JS",
    author: "Kyle Simpson",
    category: "JavaScript",
  },
];

const users = [
  {
    id: 1,
    name: "Abhinay",
    email: "abhinay@example.com",
    role: "student",
  },
  {
    id: 2,
    name: "Priya",
    email: "priya@example.com",
    role: "admin",
  },
];

module.exports = { books, users };
