const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../../../src/backend/config/env');

const schemaPath = path.join(__dirname, '../../../database/schema.sql');
const seedPath = path.join(__dirname, '../../../database/seed.sql');

function getConnectionOptions(overrides = {}) {
  return {
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    multipleStatements: true,
    ...overrides,
  };
}

async function withConnection(fn) {
  const connection = await mysql.createConnection(getConnectionOptions());
  try {
    return await fn(connection);
  } finally {
    await connection.end();
  }
}

async function executeSqlFile(connection, filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  await connection.query(sql);
}

async function applySchemaAndSeed() {
  await withConnection(async (connection) => {
    await executeSqlFile(connection, schemaPath);
    await executeSqlFile(connection, seedPath);
  });
}

async function resetTickets() {
  await withConnection(async (connection) => {
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE comments');
    await connection.query('TRUNCATE TABLE tickets');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
  });
}

async function getTicketCount() {
  return withConnection(async (connection) => {
    const [rows] = await connection.execute('SELECT COUNT(*) AS count FROM tickets');
    return rows[0].count;
  });
}

async function seedTicket(status = 'Open', overrides = {}) {
  const {
    title = 'Integration test ticket',
    description = 'Ticket for integration tests',
    priority = 'Medium',
    createdBy = 1,
    assignedTo = null,
  } = overrides;

  return withConnection(async (connection) => {
    const [result] = await connection.execute(
      `INSERT INTO tickets (title, description, priority, status, created_by, assigned_to)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, priority, status, createdBy, assignedTo],
    );
    return result.insertId;
  });
}

async function getTicketStatus(ticketId) {
  return withConnection(async (connection) => {
    const [rows] = await connection.execute(
      'SELECT status FROM tickets WHERE id = ?',
      [ticketId],
    );
    return rows.length ? rows[0].status : null;
  });
}

async function getTicketFields(ticketId) {
  return withConnection(async (connection) => {
    const [rows] = await connection.execute(
      `SELECT title, description, priority, status, created_by, assigned_to
       FROM tickets WHERE id = ?`,
      [ticketId],
    );
    return rows.length ? rows[0] : null;
  });
}

async function insertComment({ ticketId, message, createdBy = 1, createdAt = null }) {
  return withConnection(async (connection) => {
    if (createdAt) {
      const [result] = await connection.execute(
        `INSERT INTO comments (ticket_id, message, created_by, created_at)
         VALUES (?, ?, ?, ?)`,
        [ticketId, message, createdBy, createdAt],
      );
      return result.insertId;
    }

    const [result] = await connection.execute(
      `INSERT INTO comments (ticket_id, message, created_by)
       VALUES (?, ?, ?)`,
      [ticketId, message, createdBy],
    );
    return result.insertId;
  });
}

module.exports = {
  applySchemaAndSeed,
  resetTickets,
  getTicketCount,
  seedTicket,
  getTicketStatus,
  getTicketFields,
  insertComment,
};
