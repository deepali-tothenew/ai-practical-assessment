export function formatDate(isoString) {
  if (!isoString) {
    return '—';
  }

  return new Date(isoString).toLocaleString();
}

export function statusClass(status) {
  return status.toLowerCase().replace(/\s+/g, '-');
}

export function sortCommentsByCreatedAt(comments) {
  return [...comments].sort(
    (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
  );
}
