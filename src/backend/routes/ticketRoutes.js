const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const ticketController = require('../controllers/ticketController');
const { validateTicketIdParam } = require('../validators/paramValidators');
const {
  validateListTicketsQuery,
  validateCreateTicketBody,
  validateUpdateTicketBody,
  validateTransitionStatusBody,
} = require('../validators/ticketValidators');

const router = express.Router();

router.get('/', validateListTicketsQuery, asyncHandler(ticketController.listTickets));
router.post('/', validateCreateTicketBody, asyncHandler(ticketController.createTicket));
router.get('/:id', validateTicketIdParam, asyncHandler(ticketController.getTicketById));
router.patch(
  '/:id/status',
  validateTicketIdParam,
  validateTransitionStatusBody,
  asyncHandler(ticketController.transitionTicketStatus),
);
router.patch(
  '/:id',
  validateTicketIdParam,
  validateUpdateTicketBody,
  asyncHandler(ticketController.updateTicket),
);

module.exports = router;
