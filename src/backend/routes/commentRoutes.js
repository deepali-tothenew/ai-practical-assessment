const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const commentController = require('../controllers/commentController');

const router = express.Router({ mergeParams: true });

router.post('/', asyncHandler(commentController.createComment));

module.exports = router;
