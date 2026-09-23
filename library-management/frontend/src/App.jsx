// frontend/src/App.jsx
//
// Root application component.
// Handles navigation between the three pages using simple state.
// No React Router is used yet — just conditional rendering, keeping it simple.

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import BooksPage from "./pages/BooksPage";
import UsersPage from "./pages/UsersPage";
import WelcomePage from "./pages/WelcomePage";

export default function App() {
  const [activePage, setActivePage] = useState("books");

  const pages = [
    { id: "books",   label: "Books",         icon: "📚" },
    { id: "users",   label: "Users",         icon: "👤" },
    { id: "welcome", label: "Welcome Route", icon: "👋" },
  ];

  function renderPage() {
    if (activePage === "books")   return <BooksPage />;
    if (activePage === "users")   return <UsersPage />;
    if (activePage === "welcome") return <WelcomePage />;
    return null;
  }

  return (
    <div className="app-layout">
      {/* ── Sidebar ── */}
      <Sidebar pages={pages} activePage={activePage} setActivePage={setActivePage} />

      {/* ── Main Content ── */}
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

