const path = require('path');
const dotenv = require('dotenv');

const backendRoot = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(backendRoot, '.env') });

const nodeEnv = process.env.NODE_ENV || 'development';

const config = {
  nodeEnv,
  isDevelopment: nodeEnv === 'development',
  isTest: nodeEnv === 'test',
  isProduction: nodeEnv === 'production',
  port: Number(process.env.PORT) || 3001,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'support_tickets',
  },
};

module.exports = config;
