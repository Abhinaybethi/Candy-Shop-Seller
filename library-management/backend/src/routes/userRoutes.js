// backend/src/routes/userRoutes.js
//
// CONCEPT: express.Router()
// Same pattern as bookRoutes.js — a dedicated router for user-related endpoints.
// Mounted at /api/users in server.js via app.use("/api/users", userRouter).

const express = require("express");
const router = express.Router();

const { users } = require("../data/store");

// ─────────────────────────────────────────────
// GET /api/users  — or  GET /api/users?role=...
//
// CONCEPT: req.query
// req.query.role captures the value of the "role" query parameter.
// Example: GET /api/users?role=student  →  req.query.role === "student"
// ─────────────────────────────────────────────
router.get("/", (req, res) => {
  const roleFilter = req.query.role;

  if (roleFilter) {
    const filteredUsers = users.filter(
      (user) => user.role.toLowerCase() === roleFilter.toLowerCase()
    );

    return res.status(200).json({
      success: true,
      filter: roleFilter,
      count: filteredUsers.length,
      data: filteredUsers,
    });
  }

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// ─────────────────────────────────────────────
// GET /api/users/:id
//
// CONCEPT: req.params
// req.params.id captures the dynamic :id segment from the URL.
// Example: GET /api/users/1  →  req.params.id === "1"
// ─────────────────────────────────────────────
router.get("/:id", (req, res) => {
  const userId = Number(req.params.id);

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// ─────────────────────────────────────────────
// POST /api/users
//
// CONCEPT: req.body
// The JSON body sent by the client is parsed by express.json() middleware
// and made available as req.body.
// We destructure the fields we need from it.
// ─────────────────────────────────────────────
router.post("/", (req, res) => {
  const { name, email, role } = req.body;

  // Validate required fields.
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required fields",
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    role: role || "student", // Default role if not provided
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: "User has been added!",
    data: newUser,
  });
});

module.exports = router;
