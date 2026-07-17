const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const healthRoutes = require('./routes/healthRoutes');
const apiRoutes = require('./routes/index');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

if (config.isDevelopment) {
  app.use(cors());
}

app.use(healthRoutes);
app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
