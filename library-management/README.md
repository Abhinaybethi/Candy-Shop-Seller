# 📚 Library Management System

A production-structured, beginner-friendly Library Management System built as a foundational learning project for Node.js and Express.js.

This project is built strictly following fundamental Express concepts without external database dependencies, authentication, or unnecessary abstractions, while maintaining a clean, modular folder structure ready for future evolution (adding databases, JWT, Docker, etc.).

---

## 🚀 Technologies Used

### Backend
- **Node.js** — JavaScript runtime environment
- **Express.js** — Fast, unopinionated minimalist web framework
- **CORS** — Cross-Origin Resource Sharing middleware
- **Nodemon** — Development tool that automatically restarts the node application on file changes
- **CommonJS** (`require` / `module.exports`)

### Frontend
- **React 19** — Frontend UI library
- **Vite** — Next-generation frontend build tool and dev server
- **Vanilla CSS** — Custom clean styling with dark-mode palette and glassmorphism accents

---

## 📁 Project Structure

```text
library-management/
├── backend/
│   ├── src/
│   │   ├── server.js            # Express app setup, global middleware, router mounting
│   │   ├── routes/
│   │   │   ├── bookRoutes.js    # /api/books routes (GET, POST, query filtering, params)
│   │   │   └── userRoutes.js    # /api/users routes (GET, POST, role filtering, params)
│   │   ├── middleware/
│   │   │   └── logger.js        # Custom logging middleware (req.method & req.url)
│   │   └── data/
│   │       └── store.js         # In-memory arrays for books and users
│   ├── package.json             # Backend dependencies and scripts
│   └── .gitignore
├── frontend/
│   ├── index.html               # Main HTML entry
│   ├── vite.config.js           # Vite configuration
│   ├── package.json             # Frontend dependencies and scripts
│   └── src/
│       ├── main.jsx             # React DOM root entry
│       ├── App.jsx              # Main app layout with navigation
│       ├── App.css              # App styling
│       ├── index.css            # Global styling and CSS variables
│       ├── components/          # Reusable UI components
│       │   ├── Sidebar.jsx      # Navigation sidebar
│       │   ├── BookCard.jsx     # Card rendering single book details
│       │   └── UserCard.jsx     # Card rendering single user details
│       └── pages/               # Interactive views connected to backend APIs
│           ├── BooksPage.jsx    # Book list, search, and add book form
│           ├── UsersPage.jsx    # User list, role filter, and add user form
│           └── WelcomePage.jsx  # Live interactive test for route & query params
└── README.md                    # Comprehensive documentation
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

### 1. Install Backend Dependencies
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
Open a separate terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

---

## ▶️ Running the Application

### Start the Backend Server (Port 4000)
Inside the `backend/` directory:
```bash
# Using nodemon for hot-reloading during development
npm run dev

# Or using standard node
npm start
```
You should see:
```text
Server is running on http://localhost:4000
```

### Start the Frontend Dev Server (Port 5173)
Inside the `frontend/` directory in a new terminal:
```bash
npm run dev
```
Open your browser and visit: `http://localhost:5173`

---

## 🌐 API Endpoints Reference

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/books` | Get all books | `200 OK` |
| **GET** | `/api/books/:id` | Get book by ID (route param) | `200 OK` or `404 Not Found` |
| **GET** | `/api/books?search=val` | Search books by title or author | `200 OK` |
| **POST**| `/api/books` | Add a new book (JSON body) | `201 Created` or `400 Bad Request` |
| **GET** | `/api/users` | Get all users | `200 OK` |
| **GET** | `/api/users/:id` | Get user by ID (route param) | `200 OK` or `404 Not Found` |
| **GET** | `/api/users?role=val` | Filter users by role | `200 OK` |
| **POST**| `/api/users` | Add a new user (JSON body) | `201 Created` or `400 Bad Request` |
| **GET** | `/api/welcome/:username?role=val` | Dynamic route param + query demonstration | `200 OK` |

---

## 🧪 Example API Requests

### 1. Example GET Requests

#### Fetch All Books
```http
GET http://localhost:4000/api/books
```
**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "category": "Programming"
    },
    {
      "id": 2,
      "title": "The Pragmatic Programmer",
      "author": "Andrew Hunt",
      "category": "Programming"
    },
    {
      "id": 3,
      "title": "You Don't Know JS",
      "author": "Kyle Simpson",
      "category": "JavaScript"
    }
  ]
}
```

#### Fetch Single Book by ID (Route Parameter)
```http
GET http://localhost:4000/api/books/1
```
**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "category": "Programming"
  }
}
```

#### Search Books (Query Parameter)
```http
GET http://localhost:4000/api/books?search=clean
```
**Response (200 OK):**
```json
{
  "success": true,
  "query": "clean",
  "count": 1,
  "data": [
    {
      "id": 1,
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "category": "Programming"
    }
  ]
}
```

#### Welcome Endpoint (Route Param + Optional Query Param)
```http
GET http://localhost:4000/api/welcome/Abhinay?role=Admin
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Welcome Abhinay, your role is Admin"
}
```
*(If `?role=` is omitted, it defaults to: `"Welcome Abhinay, your role is user"`)*

---

### 2. Example POST Requests

#### Add a New Book
```http
POST http://localhost:4000/api/books
Content-Type: application/json

{
  "title": "Refactoring",
  "author": "Martin Fowler",
  "category": "Programming"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "Book has been added!",
  "data": {
    "id": 4,
    "title": "Refactoring",
    "author": "Martin Fowler",
    "category": "Programming"
  }
}
```

#### Add a New User
```http
POST http://localhost:4000/api/users
Content-Type: application/json

{
  "name": "Abhinay",
  "email": "abhinay@example.com",
  "role": "student"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "User has been added!",
  "data": {
    "id": 3,
    "name": "Abhinay",
    "email": "abhinay@example.com",
    "role": "student"
  }
}
```

---

## 📖 Core Express Concepts Explained

### 1. `req.params` (Route Parameters)
- Route parameters are dynamic segments in the URL path defined with a leading colon `:` (e.g., `/api/books/:id` or `/api/welcome/:username`).
- Express captures whatever string is placed in that segment and makes it accessible on `req.params`.
- **Note:** `req.params` values are always strings. If you need a number (e.g. finding an item by numeric ID), convert it using `Number(req.params.id)`.

### 2. `req.query` (Query Parameters)
- Query parameters appear after the `?` in the URL (e.g., `/api/books?search=clean` or `/api/users?role=student`).
- Express parses query key-value pairs automatically into `req.query`.
- Multiple parameters are separated by `&` (e.g. `?search=node&limit=5`).
- Query parameters are optional by nature; your code should check if `req.query.param` exists before using it.

### 3. `req.body` (Request Body)
- Used with HTTP methods like `POST` or `PUT` to submit data to the server (e.g., creating a new book).
- By default, Express does not parse incoming request bodies. You must use middleware (`app.use(express.json())`) to parse incoming JSON payloads into JavaScript objects accessible via `req.body`.
- If `express.json()` is not registered before your routes, `req.body` will be `undefined`.

### 4. `middleware`
- A middleware function is any function that executes between the moment the server receives an incoming HTTP request and the moment the final response is sent back to the client.
- Middleware has access to `req`, `res`, and the `next` function.
- Middleware can:
  - Execute code (e.g., logging every request)
  - Modify `req` or `res` objects (e.g., parsing JSON bodies or adding timestamps)
  - End the request-response cycle (e.g., rejecting unauthorized requests)
  - Pass control to the next middleware in line by invoking `next()`

### 5. `next()`
- In middleware functions, `next()` is a callback passed by Express.
- Calling `next()` tells Express to pass execution to the next middleware or route handler in the pipeline.
- **Important:** If your middleware does not send a response (`res.send()`, `res.json()`) and forgets to call `next()`, the client request will hang indefinitely until timeout.

### 6. `express.Router()`
- `express.Router()` creates a modular, mountable route handler.
- Rather than putting dozens of routes into one giant `server.js` file, routers allow you to isolate routes into dedicated domain files (e.g., `routes/bookRoutes.js` and `routes/userRoutes.js`).
- Inside the router file, routes are defined relative to the mount point (e.g., `router.get("/")` or `router.get("/:id")`).

### 7. `app.use()`
- `app.use()` registers middleware or mounts routers in your Express application.
- When called with just a function (`app.use(logger)` or `app.use(express.json())`), the middleware runs for **every** request.
- When called with a path prefix (`app.use("/api/books", bookRouter)`), the mounted router or middleware will only execute for requests matching that prefix.
- Order matters in Express: middleware and routers are executed in the exact order they are registered with `app.use()`.
