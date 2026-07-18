const { getPool } = require('../config/database');
const { mapTicketRow } = require('../utils/mappers');

const TICKET_SELECT = `
  t.id,
  t.title,
  t.description,
  t.priority,
  t.status,
  t.assigned_to,
  t.created_by,
  t.created_at,
  t.updated_at,
  cu.id AS created_by_user_id,
  cu.name AS created_by_user_name,
  cu.email AS created_by_user_email,
  cu.role AS created_by_user_role,
  au.id AS assigned_to_user_id,
  au.name AS assigned_to_user_name,
  au.email AS assigned_to_user_email,
  au.role AS assigned_to_user_role
`;

const TICKET_FROM = `
  FROM tickets t
  INNER JOIN users cu ON t.created_by = cu.id
  LEFT JOIN users au ON t.assigned_to = au.id
`;

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT ${TICKET_SELECT} ${TICKET_FROM} WHERE t.id = ?`,
    [id],
  );
  return rows.length ? mapTicketRow(rows[0]) : null;
}

/**
 * @param {{ keyword?: string|null, status?: string|null }} filters
 * keyword — already trimmed; null/undefined/empty means no text filter
 * status — exact status match; null/undefined means no status filter
 */
async function findAll(filters = {}) {
  const pool = getPool();
  const { keyword, status } = filters;

  let sql = `SELECT ${TICKET_SELECT} ${TICKET_FROM} WHERE 1 = 1`;
  const params = [];

  if (keyword) {
    sql += ' AND (LOWER(t.title) LIKE ? OR LOWER(t.description) LIKE ?)';
    const pattern = `%${keyword}%`;
    params.push(pattern, pattern);
  }

  if (status) {
    sql += ' AND t.status = ?';
    params.push(status);
  }

  sql += ' ORDER BY t.id DESC';

  const [rows] = await pool.execute(sql, params);
  return rows.map(mapTicketRow);
}

async function create({ title, description, priority, createdBy, assignedTo }) {
  const pool = getPool();
  const [result] = await pool.execute(
    `INSERT INTO tickets (title, description, priority, created_by, assigned_to)
     VALUES (?, ?, ?, ?, ?)`,
    [title, description, priority, createdBy, assignedTo ?? null],
  );
  return findById(result.insertId);
}

/**
 * @param {number} id
 * @param {{ title?: string, description?: string, priority?: string, assignedTo?: number|null }} fields
 */
async function updateFields(id, fields) {
  const pool = getPool();
  const sets = [];
  const params = [];

  if (fields.title !== undefined) {
    sets.push('title = ?');
    params.push(fields.title);
  }
  if (fields.description !== undefined) {
    sets.push('description = ?');
    params.push(fields.description);
  }
  if (fields.priority !== undefined) {
    sets.push('priority = ?');
    params.push(fields.priority);
  }
  if (fields.assignedTo !== undefined) {
    sets.push('assigned_to = ?');
    params.push(fields.assignedTo);
  }

  if (sets.length === 0) {
    return findById(id);
  }

  params.push(id);
  const [result] = await pool.execute(
    `UPDATE tickets SET ${sets.join(', ')} WHERE id = ?`,
    params,
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return findById(id);
}

async function updateStatus(id, status) {
  const pool = getPool();
  const [result] = await pool.execute(
    'UPDATE tickets SET status = ? WHERE id = ?',
    [status, id],
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return findById(id);
}

async function existsById(id) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT 1 FROM tickets WHERE id = ? LIMIT 1',
    [id],
  );
  return rows.length > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  updateFields,
  updateStatus,
  existsById,
};
