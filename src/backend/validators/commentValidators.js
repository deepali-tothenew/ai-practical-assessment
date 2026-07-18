const {
  assertObject,
  assertString,
  assertInteger,
  finalize,
} = require('../middleware/validateRequest');

function validateCreateCommentBody(req, res, next) {
  try {
    assertObject(req.body);
    const details = [];

    assertString(req.body.message, 'message', { required: true }, details);
    assertInteger(req.body.createdBy, 'createdBy', { required: true }, details);
    finalize(details);

    req.validated = {
      ...req.validated,
      body: {
        message: req.body.message,
        createdBy: req.body.createdBy,
      },
    };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateCreateCommentBody,
};
