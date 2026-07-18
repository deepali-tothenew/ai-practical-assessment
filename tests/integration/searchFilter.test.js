const request = require('supertest');
const app = require('../../src/backend/app');
const { setupIntegrationTests, teardownIntegrationTests } = require('./helpers/lifecycle');
const {
  resetTickets,
  seedTicket,
  insertComment,
} = require('./helpers/database');

describe('GET /api/tickets — search and filter', () => {
  beforeAll(async () => {
    await setupIntegrationTests();
  });

  beforeEach(async () => {
    await resetTickets();
  });

  afterAll(async () => {
    await teardownIntegrationTests();
  });

  test('SF-01: no q and no status returns all tickets', async () => {
    await seedTicket('Open', { title: 'First ticket' });
    await seedTicket('Resolved', { title: 'Second ticket' });

    const response = await request(app)
      .get('/api/tickets')
      .expect(200);

    expect(response.body.tickets).toHaveLength(2);
  });

  test('SF-02: empty or whitespace q returns all tickets', async () => {
    await seedTicket('Open', { title: 'Alpha ticket' });
    await seedTicket('Open', { title: 'Beta ticket' });

    const emptyResponse = await request(app)
      .get('/api/tickets')
      .query({ q: '' })
      .expect(200);

    const whitespaceResponse = await request(app)
      .get('/api/tickets')
      .query({ q: '   ' })
      .expect(200);

    expect(emptyResponse.body.tickets).toHaveLength(2);
    expect(whitespaceResponse.body.tickets).toHaveLength(2);
  });

  test('SF-03: q matches title case-insensitively', async () => {
    await seedTicket('Open', { title: 'login issue' });
    await seedTicket('Open', { title: 'Unrelated ticket' });

    const response = await request(app)
      .get('/api/tickets')
      .query({ q: 'LOGIN' })
      .expect(200);

    expect(response.body.tickets).toHaveLength(1);
    expect(response.body.tickets[0].title).toBe('login issue');
  });

  test('SF-04: q matches description only', async () => {
    await seedTicket('Open', {
      title: 'Generic title',
      description: 'password reset failure details',
    });
    await seedTicket('Open', {
      title: 'Other ticket',
      description: 'nothing relevant here',
    });

    const response = await request(app)
      .get('/api/tickets')
      .query({ q: 'password reset' })
      .expect(200);

    expect(response.body.tickets).toHaveLength(1);
    expect(response.body.tickets[0].description).toContain('password reset');
  });

  test('SF-05: q matching comment text only does not return ticket', async () => {
    const ticketId = await seedTicket('Open', {
      title: 'Visible ticket',
      description: 'Standard description',
    });
    await insertComment({
      ticketId,
      message: 'unique-comment-keyword-xyzzy',
      createdBy: 1,
    });

    const response = await request(app)
      .get('/api/tickets')
      .query({ q: 'unique-comment-keyword-xyzzy' })
      .expect(200);

    expect(response.body.tickets).toHaveLength(0);
  });

  test('SF-06: status=Open returns only Open tickets', async () => {
    await seedTicket('Open', { title: 'Open ticket' });
    await seedTicket('Resolved', { title: 'Resolved ticket' });

    const response = await request(app)
      .get('/api/tickets')
      .query({ status: 'Open' })
      .expect(200);

    expect(response.body.tickets).toHaveLength(1);
    expect(response.body.tickets[0].status).toBe('Open');
  });

  test('SF-07: q and status combined use AND logic', async () => {
    await seedTicket('Open', { title: 'login alpha' });
    await seedTicket('Open', { title: 'billing issue' });
    await seedTicket('Resolved', { title: 'login beta' });

    const response = await request(app)
      .get('/api/tickets')
      .query({ q: 'login', status: 'Open' })
      .expect(200);

    expect(response.body.tickets).toHaveLength(1);
    expect(response.body.tickets[0].title).toBe('login alpha');
    expect(response.body.tickets[0].status).toBe('Open');
  });

  test('SF-08: invalid status param returns 400 VALIDATION_ERROR', async () => {
    const response = await request(app)
      .get('/api/tickets')
      .query({ status: 'Done' })
      .expect(400);

    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('EC-01: special characters in q do not cause SQL errors', async () => {
    await seedTicket('Open', { title: '100% complete' });

    const response = await request(app)
      .get('/api/tickets')
      .query({ q: '%_' })
      .expect(200);

    expect(Array.isArray(response.body.tickets)).toBe(true);
  });

  test('EC-02: no matches returns 200 with empty tickets array', async () => {
    await seedTicket('Open', { title: 'Existing ticket' });

    const response = await request(app)
      .get('/api/tickets')
      .query({ q: 'no-match-keyword-zzzz' })
      .expect(200);

    expect(response.body.tickets).toHaveLength(0);
  });
});
