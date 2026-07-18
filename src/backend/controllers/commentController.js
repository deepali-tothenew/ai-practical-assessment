const { commentService } = require('../services');
const { parseId } = require('../utils/parseParams');

async function createComment(req, res) {
  const ticketId = parseId(req.params.id, 'ticketId');
  const comment = await commentService.createComment(ticketId, req.body);
  res.status(201).json({ comment });
}

module.exports = {
  createComment,
};
