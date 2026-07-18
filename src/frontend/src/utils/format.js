export function formatDate(isoString) {
  if (!isoString) {
    return '—';
  }

  return new Date(isoString).toLocaleString();
}

export function statusClass(status) {
  return status.toLowerCase().replace(/\s+/g, '-');
}
