const {
  parsePositiveIntegerParam,
} = require('../middleware/validateRequest');

function validateTicketIdParam(req, res, next) {
  try {
    const id = parsePositiveIntegerParam(req.params.id, 'id');
    req.validated = { ...req.validated, params: { id } };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateTicketIdParam,
};
