const AppError = require('../utils/AppError');
const ticketRepository = require('../repositories/ticketRepository');
const validationService = require('./validationService');

const ALLOWED_TRANSITIONS = {
  Open: ['In Progress', 'Cancelled'],
  'In Progress': ['Resolved', 'Cancelled'],
  Resolved: ['Closed'],
  Closed: [],
  Cancelled: [],
};

function canTransition(fromStatus, toStatus) {
  const allowed = ALLOWED_TRANSITIONS[fromStatus] || [];
  return allowed.includes(toStatus);
}

async function transition(ticketId, targetStatus) {
  validationService.validateStatus(targetStatus);

  const ticket = await ticketRepository.findById(ticketId);
  if (!ticket) {
    throw new AppError('Ticket not found', { statusCode: 404, code: 'NOT_FOUND' });
  }

  if (!canTransition(ticket.status, targetStatus)) {
    throw new AppError(
      `Cannot transition from ${ticket.status} to ${targetStatus}`,
      { statusCode: 400, code: 'INVALID_TRANSITION' },
    );
  }

  const updated = await ticketRepository.updateStatus(ticketId, targetStatus);
  if (!updated) {
    throw new AppError('Ticket not found', { statusCode: 404, code: 'NOT_FOUND' });
  }

  return updated;
}

module.exports = {
  ALLOWED_TRANSITIONS,
  canTransition,
  transition,
};
