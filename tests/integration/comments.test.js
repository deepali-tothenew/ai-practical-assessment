const request = require('supertest');
const app = require('../../src/backend/app');
const { setupIntegrationTests, teardownIntegrationTests } = require('./helpers/lifecycle');
const {
  resetTickets,
  seedTicket,
  insertComment,
} = require('./helpers/database');

describe('Comments', () => {
  beforeAll(async () => {
    await setupIntegrationTests();
  });

  beforeEach(async () => {
    await resetTickets();
  });

  afterAll(async () => {
    await teardownIntegrationTests();
  });

  test('CM-01: valid comment returns 201 with comment object', async () => {
    const ticketId = await seedTicket('Open');

    const response = await request(app)
      .post(`/api/tickets/${ticketId}/comments`)
      .send({ message: 'Investigating the issue.', createdBy: 1 })
      .expect(201);

    expect(response.body.comment).toMatchObject({
      ticketId,
      message: 'Investigating the issue.',
      createdBy: 1,
    });
    expect(response.body.comment.id).toBeDefined();
    expect(response.body.comment.createdAt).toBeDefined();
    expect(response.body.comment.createdByUser).toMatchObject({
      id: 1,
      name: expect.any(String),
    });
  });

  test('CM-02: missing message returns 400 VALIDATION_ERROR', async () => {
    const ticketId = await seedTicket('Open');

    const response = await request(app)
      .post(`/api/tickets/${ticketId}/comments`)
      .send({ createdBy: 1 })
      .expect(400);

    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('CM-03: non-existent ticket returns 404 NOT_FOUND', async () => {
    const response = await request(app)
      .post('/api/tickets/99999/comments')
      .send({ message: 'This should fail.', createdBy: 1 })
      .expect(404);

    expect(response.body.error.code).toBe('NOT_FOUND');
  });

  test('CM-04: two comments are returned in createdAt ascending order', async () => {
    const ticketId = await seedTicket('Open');

    await insertComment({
      ticketId,
      message: 'Second chronologically',
      createdBy: 1,
      createdAt: '2026-01-02 10:00:00',
    });
    await insertComment({
      ticketId,
      message: 'First chronologically',
      createdBy: 1,
      createdAt: '2026-01-01 10:00:00',
    });

    const response = await request(app)
      .get(`/api/tickets/${ticketId}`)
      .expect(200);

    expect(response.body.comments).toHaveLength(2);
    expect(response.body.comments[0].message).toBe('First chronologically');
    expect(response.body.comments[1].message).toBe('Second chronologically');
    expect(
      new Date(response.body.comments[0].createdAt).getTime(),
    ).toBeLessThanOrEqual(new Date(response.body.comments[1].createdAt).getTime());
  });

  test('EC-07: non-existent createdBy returns 400 VALIDATION_ERROR', async () => {
    const ticketId = await seedTicket('Open');

    const response = await request(app)
      .post(`/api/tickets/${ticketId}/comments`)
      .send({ message: 'Comment with invalid author.', createdBy: 99999 })
      .expect(400);

    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
