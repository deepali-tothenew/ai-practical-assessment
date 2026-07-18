const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const ticketController = require('../controllers/ticketController');

const router = express.Router();

router.get('/', asyncHandler(ticketController.listTickets));
router.post('/', asyncHandler(ticketController.createTicket));
router.get('/:id', asyncHandler(ticketController.getTicketById));
router.patch('/:id/status', asyncHandler(ticketController.transitionTicketStatus));
router.patch('/:id', asyncHandler(ticketController.updateTicket));

module.exports = router;
