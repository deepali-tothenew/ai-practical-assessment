/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/integration/**/*.test.js'],
  passWithNoTests: true,
  clearMocks: true,
  maxWorkers: 1,
};
