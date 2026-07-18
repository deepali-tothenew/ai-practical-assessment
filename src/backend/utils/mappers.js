/**
 * Maps database rows (snake_case) to application objects (camelCase).
 */

function toIsoString(value) {
  if (!value) {
    return value;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
}

function mapUserFromAlias(row, prefix) {
  const id = row[`${prefix}_id`];
  if (id === null || id === undefined) {
    return null;
  }

  return {
    id,
    name: row[`${prefix}_name`],
    email: row[`${prefix}_email`],
    role: row[`${prefix}_role`],
  };
}

function mapUserRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
  };
}

function mapTicketRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    priority: row.priority,
    status: row.status,
    assignedTo: row.assigned_to,
    createdBy: row.created_by,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
    assignedToUser: mapUserFromAlias(row, 'assigned_to_user'),
    createdByUser: mapUserFromAlias(row, 'created_by_user'),
  };
}

function mapCommentRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    ticketId: row.ticket_id,
    message: row.message,
    createdBy: row.created_by,
    createdAt: toIsoString(row.created_at),
    createdByUser: mapUserFromAlias(row, 'created_by_user'),
  };
}

module.exports = {
  mapUserRow,
  mapTicketRow,
  mapCommentRow,
};
