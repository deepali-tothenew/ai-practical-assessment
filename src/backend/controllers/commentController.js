const { commentService } = require('../services');

async function createComment(req, res) {
  const ticketId = req.validated.params.id;
  const comment = await commentService.createComment(ticketId, req.validated.body);
  res.status(201).json({ comment });
}

module.exports = {
  createComment,
};
