const { getPool } = require('../config/database');
const { mapUserRow } = require('../utils/mappers');

async function findAll() {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, name, email, role FROM users ORDER BY name ASC',
  );
  return rows.map(mapUserRow);
}

async function findById(id) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, name, email, role FROM users WHERE id = ?',
    [id],
  );
  return rows.length ? mapUserRow(rows[0]) : null;
}

async function existsById(id) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT 1 FROM users WHERE id = ? LIMIT 1',
    [id],
  );
  return rows.length > 0;
}

module.exports = {
  findAll,
  findById,
  existsById,
};
