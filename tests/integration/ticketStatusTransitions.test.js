const request = require('supertest');
const app = require('../../src/backend/app');
const { setupIntegrationTests, teardownIntegrationTests } = require('./helpers/lifecycle');
const {
  resetTickets,
  seedTicket,
  getTicketStatus,
} = require('./helpers/database');

describe('PATCH /api/tickets/:id/status — status state machine', () => {
  beforeAll(async () => {
    await setupIntegrationTests();
  });

  beforeEach(async () => {
    await resetTickets();
  });

  afterAll(async () => {
    await teardownIntegrationTests();
  });

  describe('valid transitions', () => {
    test.each([
      ['SM-V01', 'Open', 'In Progress'],
      ['SM-V02', 'In Progress', 'Resolved'],
      ['SM-V03', 'Resolved', 'Closed'],
      ['SM-V04', 'Open', 'Cancelled'],
      ['SM-V05', 'In Progress', 'Cancelled'],
    ])('%s: %s → %s', async (_caseId, fromStatus, toStatus) => {
      const ticketId = await seedTicket(fromStatus);

      const response = await request(app)
        .patch(`/api/tickets/${ticketId}/status`)
        .send({ status: toStatus })
        .expect(200);

      expect(response.body.status).toBe(toStatus);
      expect(await getTicketStatus(ticketId)).toBe(toStatus);
    });
  });

  describe('invalid transitions', () => {
    test.each([
      ['SM-I01', 'Open', 'Closed'],
      ['SM-I02', 'Open', 'Resolved'],
      ['SM-I03', 'In Progress', 'Open'],
      ['SM-I04', 'In Progress', 'Closed'],
      ['SM-I05', 'Resolved', 'Cancelled'],
      ['SM-I06', 'Resolved', 'In Progress'],
      ['SM-I07', 'Closed', 'In Progress'],
      ['SM-I08', 'Closed', 'Cancelled'],
      ['SM-I09', 'Cancelled', 'Open'],
      ['SM-I10', 'Cancelled', 'In Progress'],
    ])('%s: %s → %s', async (_caseId, fromStatus, toStatus) => {
      const ticketId = await seedTicket(fromStatus);

      const response = await request(app)
        .patch(`/api/tickets/${ticketId}/status`)
        .send({ status: toStatus })
        .expect(400);

      expect(response.body.error.code).toBe('INVALID_TRANSITION');
      expect(await getTicketStatus(ticketId)).toBe(fromStatus);
    });
  });

  describe('status endpoint — additional cases', () => {
    test('SM-E01: missing status in body returns 400 VALIDATION_ERROR', async () => {
      const ticketId = await seedTicket('Open');

      const response = await request(app)
        .patch(`/api/tickets/${ticketId}/status`)
        .send({})
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(await getTicketStatus(ticketId)).toBe('Open');
    });

    test('SM-E02: invalid status string returns 400 VALIDATION_ERROR', async () => {
      const ticketId = await seedTicket('Open');

      const response = await request(app)
        .patch(`/api/tickets/${ticketId}/status`)
        .send({ status: 'Done' })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(await getTicketStatus(ticketId)).toBe('Open');
    });

    test('SM-E03: non-existent ticket id returns 404 NOT_FOUND', async () => {
      const response = await request(app)
        .patch('/api/tickets/99999/status')
        .send({ status: 'In Progress' })
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    test('SM-E04: full happy path Open → In Progress → Resolved → Closed', async () => {
      const ticketId = await seedTicket('Open');
      const chain = ['In Progress', 'Resolved', 'Closed'];

      for (const status of chain) {
        const response = await request(app)
          .patch(`/api/tickets/${ticketId}/status`)
          .send({ status })
          .expect(200);

        expect(response.body.status).toBe(status);
        expect(await getTicketStatus(ticketId)).toBe(status);
      }
    });

    test('EC-04: transition on terminal Closed ticket returns 400 INVALID_TRANSITION', async () => {
      const ticketId = await seedTicket('Closed');

      const response = await request(app)
        .patch(`/api/tickets/${ticketId}/status`)
        .send({ status: 'In Progress' })
        .expect(400);

      expect(response.body.error.code).toBe('INVALID_TRANSITION');
      expect(await getTicketStatus(ticketId)).toBe('Closed');
    });

    test('EC-05: transition on terminal Cancelled ticket returns 400 INVALID_TRANSITION', async () => {
      const ticketId = await seedTicket('Cancelled');

      const response = await request(app)
        .patch(`/api/tickets/${ticketId}/status`)
        .send({ status: 'Open' })
        .expect(400);

      expect(response.body.error.code).toBe('INVALID_TRANSITION');
      expect(await getTicketStatus(ticketId)).toBe('Cancelled');
    });
  });

  describe('status isolation', () => {
    test('SU-01: PATCH with status on Open ticket returns 400 and leaves status unchanged', async () => {
      const ticketId = await seedTicket('Open');

      const response = await request(app)
        .patch(`/api/tickets/${ticketId}`)
        .send({ status: 'Closed' })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(await getTicketStatus(ticketId)).toBe('Open');
    });

    test('SU-02: PATCH with valid field updates only returns 200 and leaves status unchanged', async () => {
      const ticketId = await seedTicket('Open', { title: 'Original title' });

      const response = await request(app)
        .patch(`/api/tickets/${ticketId}`)
        .send({ title: 'Updated title' })
        .expect(200);

      expect(response.body.title).toBe('Updated title');
      expect(response.body.status).toBe('Open');
      expect(await getTicketStatus(ticketId)).toBe('Open');
    });
  });
});
