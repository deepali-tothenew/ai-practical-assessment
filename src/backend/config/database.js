const mysql = require('mysql2/promise');
const config = require('./env');

let pool = null;

function validateDatabaseConfig() {
  const missing = [];

  if (!config.db.host) {
    missing.push('DB_HOST');
  }
  if (!config.db.user) {
    missing.push('DB_USER');
  }
  if (!config.db.database) {
    missing.push('DB_NAME');
  }

  if (missing.length > 0) {
    throw new Error(`Database configuration error: missing ${missing.join(', ')}`);
  }
}

function createPool() {
  return mysql.createPool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

/**
 * Creates the connection pool and verifies connectivity before the server accepts requests.
 */
async function initializeDatabase() {
  if (pool) {
    return pool;
  }

  validateDatabaseConfig();

  const newPool = createPool();

  try {
    const connection = await newPool.getConnection();
    await connection.ping();
    connection.release();
    pool = newPool;
    console.log(
      `[database] Connected to ${config.db.host}:${config.db.port}/${config.db.database}`,
    );
    return pool;
  } catch (err) {
    await newPool.end();
    throw new Error(`Database connection failed: ${err.message}`);
  }
}

/**
 * Returns the shared MySQL connection pool.
 * Must call initializeDatabase() during application startup first.
 */
function getPool() {
  if (!pool) {
    throw new Error('Database pool is not initialized. Call initializeDatabase() first.');
  }
  return pool;
}

/**
 * Gracefully closes all pool connections.
 */
async function closePool() {
  if (!pool) {
    return;
  }

  await pool.end();
  pool = null;
  console.log('[database] Connection pool closed');
}

module.exports = {
  initializeDatabase,
  getPool,
  closePool,
};
