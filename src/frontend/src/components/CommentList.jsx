import EmptyState from './EmptyState';
import { formatDate, sortCommentsByCreatedAt } from '../utils/format';

export default function CommentList({ comments }) {
  const sortedComments = sortCommentsByCreatedAt(comments);

  if (sortedComments.length === 0) {
    return <EmptyState message="No comments yet" />;
  }

  return (
    <ul className="comment-list">
      {sortedComments.map((comment) => (
        <li key={comment.id} className="comment-card">
          <p className="comment-card__message">{comment.message}</p>
          <p className="comment-card__meta">
            <span>{comment.createdByUser?.name || 'Unknown user'}</span>
            <span aria-hidden="true"> · </span>
            <time dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time>
          </p>
        </li>
      ))}
    </ul>
  );
}
