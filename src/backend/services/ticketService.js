const AppError = require('../utils/AppError');
const ticketRepository = require('../repositories/ticketRepository');
const commentRepository = require('../repositories/commentRepository');
const validationService = require('./validationService');
const statusService = require('./statusService');

function notFound(entity) {
  throw new AppError(`${entity} not found`, { statusCode: 404, code: 'NOT_FOUND' });
}

function normalizeKeyword(q) {
  if (q === undefined || q === null) {
    return null;
  }

  const trimmed = String(q).trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.toLowerCase();
}

async function listTickets({ q, status } = {}) {
  if (status !== undefined && status !== null && String(status).trim() !== '') {
    validationService.validateStatus(status);
  } else {
    status = null;
  }

  const keyword = normalizeKeyword(q);

  return ticketRepository.findAll({ keyword, status });
}

async function getTicketById(id) {
  const ticket = await ticketRepository.findById(id);
  if (!ticket) {
    notFound('Ticket');
  }

  const comments = await commentRepository.findByTicketId(id);
  return { ticket, comments };
}

async function createTicket(body) {
  validationService.rejectForbiddenFields(body, ['status']);

  const { title, description, priority, createdBy, assignedTo } = body;

  validationService.validateRequiredNonEmptyString(title, 'title');
  validationService.validateRequiredNonEmptyString(description, 'description');
  validationService.validatePriority(priority);
  await validationService.validateUserExists(createdBy, 'createdBy');
  await validationService.validateOptionalAssignee(assignedTo);

  return ticketRepository.create({
    title: title.trim(),
    description: description.trim(),
    priority,
    createdBy,
    assignedTo: assignedTo ?? null,
  });
}

async function updateTicket(id, body) {
  validationService.rejectForbiddenFields(body, ['status']);
  validationService.rejectImmutableFields(body, ['createdBy', 'createdAt']);

  const updates = {};
  const { title, description, priority, assignedTo } = body;

  if (title !== undefined) {
    validationService.validateOptionalNonEmptyString(title, 'title');
    updates.title = title.trim();
  }
  if (description !== undefined) {
    validationService.validateOptionalNonEmptyString(description, 'description');
    updates.description = description.trim();
  }
  if (priority !== undefined) {
    validationService.validatePriority(priority);
    updates.priority = priority;
  }
  if (assignedTo !== undefined) {
    if (assignedTo === null) {
      updates.assignedTo = null;
    } else {
      await validationService.validateUserExists(assignedTo, 'assignedTo');
      updates.assignedTo = assignedTo;
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new AppError('At least one updatable field is required', {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
    });
  }

  const updated = await ticketRepository.updateFields(id, updates);
  if (!updated) {
    notFound('Ticket');
  }

  return updated;
}

async function transitionTicketStatus(id, targetStatus) {
  return statusService.transition(id, targetStatus);
}

module.exports = {
  listTickets,
  getTicketById,
  createTicket,
  updateTicket,
  transitionTicketStatus,
};
