export const TICKET_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export const TICKET_STATUSES = [
  'Open',
  'In Progress',
  'Resolved',
  'Closed',
  'Cancelled',
];

export const ALLOWED_TRANSITIONS = {
  Open: ['In Progress', 'Cancelled'],
  'In Progress': ['Resolved', 'Cancelled'],
  Resolved: ['Closed'],
  Closed: [],
  Cancelled: [],
};

export function getValidNextStatuses(currentStatus) {
  return ALLOWED_TRANSITIONS[currentStatus] || [];
}
