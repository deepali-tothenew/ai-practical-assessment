const mysql = require('mysql2/promise');
const config = require('./env');

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Returns the shared MySQL connection pool.
 * Connections are created lazily on first query.
 */
function getPool() {
  return pool;
}

/**
 * Gracefully closes all pool connections.
 */
async function closePool() {
  await pool.end();
}

module.exports = {
  getPool,
  closePool,
};
