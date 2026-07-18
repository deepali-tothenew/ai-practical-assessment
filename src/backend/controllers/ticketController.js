const { ticketService } = require('../services');
const { parseId } = require('../utils/parseParams');

async function listTickets(req, res) {
  const tickets = await ticketService.listTickets({
    q: req.query.q,
    status: req.query.status,
  });
  res.status(200).json({ tickets });
}

async function getTicketById(req, res) {
  const id = parseId(req.params.id);
  const result = await ticketService.getTicketById(id);
  res.status(200).json(result);
}

async function createTicket(req, res) {
  const ticket = await ticketService.createTicket(req.body);
  res.status(201).json(ticket);
}

async function updateTicket(req, res) {
  const id = parseId(req.params.id);
  const ticket = await ticketService.updateTicket(id, req.body);
  res.status(200).json(ticket);
}

async function transitionTicketStatus(req, res) {
  const id = parseId(req.params.id);
  const { status } = req.body;
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
