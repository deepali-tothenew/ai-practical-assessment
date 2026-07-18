const request = require('supertest');
const app = require('../../src/backend/app');
const { setupIntegrationTests, teardownIntegrationTests } = require('./helpers/lifecycle');
const { resetTickets } = require('./helpers/database');

describe('GET /api/users', () => {
  beforeAll(async () => {
    await setupIntegrationTests();
  });

  beforeEach(async () => {
    await resetTickets();
  });

  afterAll(async () => {
    await teardownIntegrationTests();
  });

  test('US-01: returns seeded users array with 200', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect(200);

    expect(Array.isArray(response.body.users)).toBe(true);
    expect(response.body.users.length).toBeGreaterThanOrEqual(1);
    expect(response.body.users[0]).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      email: expect.any(String),
      role: expect.any(String),
    });
  });
});
