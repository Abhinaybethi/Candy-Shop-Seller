// frontend/src/components/BookCard.jsx

export default function BookCard({ book, getCategoryBadge }) {
  return (
    <div className="item-card">
      <div className="item-id">ID: {book.id}</div>
      <div className="item-title">{book.title}</div>
      <div className="item-sub">by {book.author}</div>
      <span className={`badge ${getCategoryBadge(book.category)}`}>
        {book.category}
      </span>
    </div>
  );
}
