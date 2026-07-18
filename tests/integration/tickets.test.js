const request = require('supertest');
const app = require('../../src/backend/app');
const { setupIntegrationTests, teardownIntegrationTests } = require('./helpers/lifecycle');
const {
  resetTickets,
  seedTicket,
  getTicketCount,
  getTicketFields,
} = require('./helpers/database');

const validTicket = {
  title: 'Cannot log in',
  description: 'User reports login failure.',
  priority: 'High',
  createdBy: 1,
};

describe('Ticket CRUD', () => {
  beforeAll(async () => {
    await setupIntegrationTests();
  });

  beforeEach(async () => {
    await resetTickets();
  });

  afterAll(async () => {
    await teardownIntegrationTests();
  });

  describe('POST /api/tickets', () => {
    test('CR-01: valid payload with assignee returns 201 with status Open', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .send({ ...validTicket, assignedTo: 2 })
        .expect(201);

      expect(response.body.status).toBe('Open');
      expect(response.body.assignedTo).toBe(2);
      expect(response.body.title).toBe(validTicket.title);
    });

    test('CR-02: valid payload without assignee returns 201 with assignedTo null', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .send(validTicket)
        .expect(201);

      expect(response.body.assignedTo).toBeNull();
      expect(response.body.status).toBe('Open');
    });

    test('EC-03: optional assignee — create without assignee sets assignedTo null', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .send(validTicket)
        .expect(201);

      expect(response.body.assignedTo).toBeNull();
    });

    test('CR-03: missing title returns 400 and does not create a row', async () => {
      const beforeCount = await getTicketCount();

      const response = await request(app)
        .post('/api/tickets')
        .send({
          description: validTicket.description,
          priority: validTicket.priority,
          createdBy: validTicket.createdBy,
        })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(await getTicketCount()).toBe(beforeCount);
    });

    test('CR-04: invalid priority returns 400', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .send({ ...validTicket, priority: 'Urgent' })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    test('CR-05: non-existent createdBy returns 400', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .send({ ...validTicket, createdBy: 99999 })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    test('CR-06: non-existent assignedTo returns 400', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .send({ ...validTicket, assignedTo: 99999 })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    test('CR-07: body includes status Closed returns 400 and creates Open ticket only if rejected before insert', async () => {
      const beforeCount = await getTicketCount();

      const response = await request(app)
        .post('/api/tickets')
        .send({ ...validTicket, status: 'Closed' })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(await getTicketCount()).toBe(beforeCount);
    });
  });

  describe('GET /api/tickets/:id', () => {
    test('CR-08: existing ticket returns 200 with ticket and comments array', async () => {
      const ticketId = await seedTicket('Open');

      const response = await request(app)
        .get(`/api/tickets/${ticketId}`)
        .expect(200);

      expect(response.body.ticket.id).toBe(ticketId);
      expect(response.body.ticket.title).toBe('Integration test ticket');
      expect(Array.isArray(response.body.comments)).toBe(true);
    });

    test('CR-09: missing ticket returns 404 NOT_FOUND', async () => {
      const response = await request(app)
        .get('/api/tickets/99999')
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PATCH /api/tickets/:id', () => {
    test('CR-10: update title and priority returns 200 with updated fields', async () => {
      const ticketId = await seedTicket('Open');

      const response = await request(app)
        .patch(`/api/tickets/${ticketId}`)
        .send({ title: 'Updated title', priority: 'Critical' })
        .expect(200);

      expect(response.body.title).toBe('Updated title');
      expect(response.body.priority).toBe('Critical');

      const row = await getTicketFields(ticketId);
      expect(row.title).toBe('Updated title');
      expect(row.priority).toBe('Critical');
    });

    test('CR-11: PATCH with createdBy returns 400 and leaves createdBy unchanged in DB', async () => {
      const ticketId = await seedTicket('Open', { createdBy: 1 });

      const response = await request(app)
        .patch(`/api/tickets/${ticketId}`)
        .send({ createdBy: 2 })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');

      const row = await getTicketFields(ticketId);
      expect(row.created_by).toBe(1);
    });

    test('CR-12: missing ticket returns 404 NOT_FOUND', async () => {
      const response = await request(app)
        .patch('/api/tickets/99999')
        .send({ title: 'Updated title' })
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    test('CR-13: assignedTo null unassigns ticket', async () => {
      const ticketId = await seedTicket('Open', { assignedTo: 2 });

      const response = await request(app)
        .patch(`/api/tickets/${ticketId}`)
        .send({ assignedTo: null })
        .expect(200);

      expect(response.body.assignedTo).toBeNull();

      const row = await getTicketFields(ticketId);
      expect(row.assigned_to).toBeNull();
    });

    test('EC-06: empty PATCH body returns 400', async () => {
      const ticketId = await seedTicket('Open');

      const response = await request(app)
        .patch(`/api/tickets/${ticketId}`)
        .send({})
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
