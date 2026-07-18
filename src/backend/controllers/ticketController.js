const { ticketService } = require('../services');

async function listTickets(req, res) {
  const { q, status } = req.validated.query;
  const tickets = await ticketService.listTickets({ q, status });
  res.status(200).json({ tickets });
}

async function getTicketById(req, res) {
  const { id } = req.validated.params;
  const result = await ticketService.getTicketById(id);
  res.status(200).json(result);
}

async function createTicket(req, res) {
  const ticket = await ticketService.createTicket(req.validated.body);
  res.status(201).json(ticket);
}

async function updateTicket(req, res) {
  const { id } = req.validated.params;
  const ticket = await ticketService.updateTicket(id, req.validated.body);
  res.status(200).json(ticket);
}

async function transitionTicketStatus(req, res) {
  const { id } = req.validated.params;
  const { status } = req.validated.body;
  const ticket = await ticketService.transitionTicketStatus(id, status);
  res.status(200).json(ticket);
}

module.exports = {
  listTickets,
  getTicketById,
  createTicket,
  updateTicket,
  transitionTicketStatus,
};
