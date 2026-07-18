-- Support Ticket Management System — MySQL schema
-- Source of truth: data-model.md, design-notes.md

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------------
-- users (seeded reference data)
-- ---------------------------------------------------------------------------
CREATE TABLE users (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role  VARCHAR(50)  NOT NULL,
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- tickets
-- ---------------------------------------------------------------------------
CREATE TABLE tickets (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  description  TEXT         NOT NULL,
  priority     ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL,
  status       ENUM('Open', 'In Progress', 'Resolved', 'Closed', 'Cancelled') NOT NULL DEFAULT 'Open',
  assigned_to  INT NULL,
  created_by   INT NOT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tickets_assigned_to FOREIGN KEY (assigned_to) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT fk_tickets_created_by  FOREIGN KEY (created_by)  REFERENCES users (id) ON DELETE RESTRICT,
  INDEX idx_tickets_status (status),
  INDEX idx_tickets_created_by (created_by),
  INDEX idx_tickets_assigned_to (assigned_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- comments
-- ---------------------------------------------------------------------------
CREATE TABLE comments (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id  INT  NOT NULL,
  message    TEXT NOT NULL,
  created_by INT  NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comments_ticket_id  FOREIGN KEY (ticket_id)  REFERENCES tickets (id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_created_by FOREIGN KEY (created_by) REFERENCES users (id)  ON DELETE RESTRICT,
  INDEX idx_comments_ticket_id (ticket_id),
  INDEX idx_comments_created_at (ticket_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
