# CandyHub — Candy Shop Seller & Inventory Dashboard

CandyHub is a clean, modern, and practical inventory management dashboard designed for candy shop sellers. Built using modern Vanilla JavaScript, HTML5, and CSS3, it provides full CRUD (Create, Read, Update, Delete) capability powered directly by the CRUD CRUD REST API persistence layer.

---

## Features

- **Dynamic Inventory Statistics**: Live calculation of total products, total stock quantity, low stock items count, and total inventory monetary value.
- **Full CRUD Operations**:
  - **Create**: Add new candy products with automatic validation and real-time image preview.
  - **Read**: Fetch and display products with dynamic status badges (`In Stock`, `Low Stock`, `Out of Stock`).
  - **Update**: Edit existing product details in a reusable modal dialog.
  - **Delete**: Custom prompt confirmation modal preventing accidental deletions without relying on browser native alerts.
- **Combined Search & Category Filter**: Instant client-side search by name and category filtering operating against loaded state.
- **Distinct Empty States**: Dedicated UI views for zero total products vs. no matching search results.
- **Live Image Preview & Fallbacks**: Image preview in product modal with graceful error handling and fallback placeholders for broken links.
- **Inline Validation & Toast Notifications**: Non-intrusive error notifications and success toasts.
- **Fully Responsive & Accessible**: Optimized layout from mobile (375px) to ultra-wide desktop displays (1440px+), keyboard friendly controls (Escape key modal dismiss, focus management), and semantic HTML.

---

## Tech Stack

- **HTML5**: Semantic elements, ARIA attributes, structured layout.
- **CSS3**: Custom properties (CSS variables), Flexbox, CSS Grid, custom utility classes, smooth micro-animations.
- **Vanilla JavaScript (ES6+)**: `async`/`await`, Fetch API, DOM event delegation, dynamic state management.
- **Persistence**: [CRUD CRUD REST API](https://crudcrud.com/).

---

## CRUD CRUD Setup

Because CRUD CRUD endpoints expire after 24 hours or 100 requests, you need to provide an active CRUD CRUD API endpoint:

1. Visit [https://crudcrud.com/](https://crudcrud.com/) to get your unique API endpoint.
2. Open [`script.js`](file:///c:/Users/abhin/Personal/Backend-learnings/Candy%20Shop%20Seller%20Dashboard/script.js).
3. Update the `API_BASE_URL` constant near the top of the file:

```javascript
const API_BASE_URL = "https://crudcrud.com/api/YOUR_UNIQUE_ENDPOINT_KEY";
```

4. Save the file.

---

## How to Run

1. Clone or download this repository.
2. Ensure you have updated the `API_BASE_URL` in `script.js` as described above.
3. Open `index.html` directly in any modern browser (or serve using VS Code Live Server / standard local HTTP server):

```bash
# Example using Python http.server
python -m http.server 8000
```

4. Navigate to `http://localhost:8000` in your web browser.

---

## CRUD Operations

The application interacts with the `/products` resource on CRUD CRUD:

| Action | HTTP Method | Endpoint | Payload / Behavior |
|---|---|---|---|
| Read | `GET` | `/products` | Retrieves all product items |
| Create | `POST` | `/products` | `{ name, price, stock, category, image }` |
| Update | `PUT` | `/products/:id` | `{ name, price, stock, category, image }` |
| Delete | `DELETE` | `/products/:id` | Removes item by ID (Returns 204 No Content) |

---

## Responsive Design

Tested and optimized for all standard viewport widths:
- **Desktop**: 1440px / 1200px (Full sidebar navigation, 4-column stats grid, comprehensive table view)
- **Tablet**: 900px / 768px (Icon sidebar layout, 2-column stats grid)
- **Mobile**: 480px / 375px (Stacked toolbar, full-width touch targets, scrollable responsive table container)

---

## Project Structure

```text
Candy Shop Seller Dashboard/
├── index.html       # Main HTML5 document & semantic application markup
├── style.css        # Clean custom design system, themes, CSS variables, & responsive breakpoints
├── script.js        # Vanilla JS logic: API layer, rendering, state, validation, modal handlers
├── README.md        # Documentation and setup instructions
└── .gitignore       # Git ignore rules
```

# Candy-Shop-Seller
