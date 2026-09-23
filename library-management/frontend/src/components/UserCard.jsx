// frontend/src/components/UserCard.jsx

export default function UserCard({ user, getRoleBadge }) {
  return (
    <div className="item-card">
      <div className="item-id">ID: {user.id}</div>
      <div className="item-title">{user.name}</div>
      <div className="item-sub">{user.email}</div>
      <span className={`badge ${getRoleBadge(user.role)}`}>
        {user.role}
      </span>
    </div>
  );
}
