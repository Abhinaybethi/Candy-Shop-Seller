// backend/src/server.js
//
// This is the entry point of our Express application.
// Its only job is:
//  1. Create the Express app
//  2. Register global middleware
//  3. Mount routers
//  4. Start the server
//
// Business logic and route handlers live in their own files — not here.

const express = require("express");
const cors = require("cors");

// Import our custom logger middleware
const logger = require("./middleware/logger");

// Import the routers we built
const bookRouter = require("./routes/bookRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
const PORT = 4000;

// ─────────────────────────────────────────────
// GLOBAL MIDDLEWARE
// app.use() registers middleware that runs for EVERY request.
// Order matters: middleware registered first runs first.
// ─────────────────────────────────────────────

// CORS — allows the React frontend (running on a different port) to call this API.
// Without this, the browser blocks cross-origin requests for security.
app.use(
  cors({
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"],
  })
);

// express.json() — parses incoming JSON request bodies.
// After this middleware runs, req.body contains the parsed JavaScript object.
// Without it, req.body would be undefined for POST requests.
app.use(express.json());

// Our custom logger — logs every request's method and URL to the terminal.
// Registered BEFORE the routes so it runs on every request.
app.use(logger);

// ─────────────────────────────────────────────
// ROUTES
// app.use("/api/books", bookRouter) means:
//   any request to a path starting with /api/books
//   is handed off to bookRouter.
//
// Inside bookRouter, routes are defined as "/" and "/:id".
// Express combines them: server's prefix + router's path.
//   /api/books  +  /     =  /api/books
//   /api/books  +  /:id  =  /api/books/:id
// ─────────────────────────────────────────────

app.use("/api/books", bookRouter);
app.use("/api/users", userRouter);

// ─────────────────────────────────────────────
// WELCOME / DYNAMIC ROUTE DEMONSTRATION
//
// CONCEPT: req.params + req.query used together
// This route shows how a single endpoint can use BOTH:
//   req.params.username — from the URL path  (required)
//   req.query.role      — from the query string (optional)
// ─────────────────────────────────────────────
app.get("/api/welcome/:username", (req, res) => {
  const username = req.params.username;

  // req.query.role will be undefined if no ?role= was provided,
  // so we fall back to the string "user".
  const role = req.query.role || "user";

  res.status(200).json({
    success: true,
    message: `Welcome ${username}, your role is ${role}`,
  });
});

// ─────────────────────────────────────────────
// 404 HANDLER
// Any request that didn't match a route above ends up here.
// This must be registered AFTER all routes.
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// ─────────────────────────────────────────────
// START THE SERVER
// app.listen() binds the server to the given port.
// The callback runs once the server is ready to accept requests.
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
