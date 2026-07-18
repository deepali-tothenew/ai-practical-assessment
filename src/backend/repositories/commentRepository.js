const { getPool } = require('../config/database');
const { mapCommentRow } = require('../utils/mappers');

const COMMENT_SELECT = `
  c.id,
  c.ticket_id,
  c.message,
  c.created_by,
  c.created_at,
  u.id AS created_by_user_id,
  u.name AS created_by_user_name,
  u.email AS created_by_user_email,
  u.role AS created_by_user_role
`;

const COMMENT_FROM = `
  FROM comments c
  INNER JOIN users u ON c.created_by = u.id
`;

async function findByTicketId(ticketId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT ${COMMENT_SELECT} ${COMMENT_FROM}
     WHERE c.ticket_id = ?
     ORDER BY c.created_at ASC`,
    [ticketId],
  );
  return rows.map(mapCommentRow);
}

async function create({ ticketId, message, createdBy }) {
  const pool = getPool();
  const [result] = await pool.execute(
    `INSERT INTO comments (ticket_id, message, created_by)
     VALUES (?, ?, ?)`,
    [ticketId, message, createdBy],
  );

  const [rows] = await pool.execute(
    `SELECT ${COMMENT_SELECT} ${COMMENT_FROM} WHERE c.id = ?`,
    [result.insertId],
  );
  return rows.length ? mapCommentRow(rows[0]) : null;
}

module.exports = {
  findByTicketId,
  create,
};
