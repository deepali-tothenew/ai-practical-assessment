const express = require('express');
const userRoutes = require('./userRoutes');
const ticketRoutes = require('./ticketRoutes');
const commentRoutes = require('./commentRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/tickets', ticketRoutes);
router.use('/tickets/:id/comments', commentRoutes);

module.exports = router;
