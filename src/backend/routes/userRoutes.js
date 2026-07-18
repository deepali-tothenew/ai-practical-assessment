const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', asyncHandler(userController.listUsers));

module.exports = router;
