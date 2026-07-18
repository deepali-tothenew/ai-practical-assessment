const { applySchemaAndSeed } = require('./database');
const { initializeDatabase, closePool } = require('../../../src/backend/config/database');

let ready = false;

async function setupIntegrationTests() {
  if (ready) {
    return;
  }

  await applySchemaAndSeed();
  await initializeDatabase();
  ready = true;
}

async function teardownIntegrationTests() {
  if (!ready) {
    return;
  }

  await closePool();
  ready = false;
}

module.exports = {
  setupIntegrationTests,
  teardownIntegrationTests,
};
