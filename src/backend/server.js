const app = require('./app');
const config = require('./config/env');
const { initializeDatabase, closePool } = require('./config/database');

async function start() {
  try {
    await initializeDatabase();
  } catch (err) {
    console.error('[database]', err.message);
    process.exit(1);
  }

  const server = app.listen(config.port, () => {
    console.log(`API server running on port ${config.port} (${config.nodeEnv})`);
  });

  function shutdown(signal) {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      try {
        await closePool();
        process.exit(0);
      } catch (err) {
        console.error('[database] Error closing connection pool:', err.message);
        process.exit(1);
      }
    });
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start();

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});
