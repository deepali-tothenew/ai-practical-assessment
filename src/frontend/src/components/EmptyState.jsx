export default function EmptyState({ message }) {
  return (
    <p className="empty-state" role="status">
      {message}
    </p>
  );
}
