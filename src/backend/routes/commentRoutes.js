const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const commentController = require('../controllers/commentController');
const { validateTicketIdParam } = require('../validators/paramValidators');
const { validateCreateCommentBody } = require('../validators/commentValidators');

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  validateTicketIdParam,
  validateCreateCommentBody,
  asyncHandler(commentController.createComment),
);

module.exports = router;
