-- Support Ticket Management System — seed data (users only)
-- Source of truth: data-model.md
-- Run after database/schema.sql

SET NAMES utf8mb4;

INSERT INTO users (id, name, email, role) VALUES
  (1, 'Jane Agent',  'jane.agent@example.com',  'Agent'),
  (2, 'Bob Support', 'bob.support@example.com', 'Agent'),
  (3, 'Alice Admin', 'alice.admin@example.com', 'Admin')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  role = VALUES(role);
