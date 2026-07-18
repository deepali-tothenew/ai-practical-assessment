const AppError = require('../utils/AppError');
const commentRepository = require('../repositories/commentRepository');
const ticketRepository = require('../repositories/ticketRepository');
const validationService = require('./validationService');

function notFound() {
  throw new AppError('Ticket not found', { statusCode: 404, code: 'NOT_FOUND' });
}

async function createComment(ticketId, body) {
  const { message, createdBy } = body;

  const ticketExists = await ticketRepository.existsById(ticketId);
  if (!ticketExists) {
    notFound();
  }

  validationService.validateRequiredNonEmptyString(message, 'message');
  await validationService.validateUserExists(createdBy, 'createdBy');

  return commentRepository.create({
    ticketId,
    message: message.trim(),
    createdBy,
  });
}

module.exports = {
  createComment,
};
