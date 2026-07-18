const {
  assertObject,
  assertString,
  assertInteger,
  finalize,
} = require('../middleware/validateRequest');

function validateListTicketsQuery(req, res, next) {
  try {
    const details = [];

    if (req.query.q !== undefined) {
      assertString(req.query.q, 'q', {}, details);
    }

    if (req.query.status !== undefined) {
      assertString(req.query.status, 'status', {}, details);
    }

    finalize(details);

    req.validated = {
      ...req.validated,
      query: {
        q: req.query.q,
        status: req.query.status,
      },
    };
    next();
  } catch (err) {
    next(err);
  }
}

function validateCreateTicketBody(req, res, next) {
  try {
    assertObject(req.body);
    const details = [];

    assertString(req.body.title, 'title', { required: true }, details);
    assertString(req.body.description, 'description', { required: true }, details);
    assertString(req.body.priority, 'priority', { required: true }, details);
    assertInteger(req.body.createdBy, 'createdBy', { required: true }, details);

    if (req.body.assignedTo !== undefined) {
      assertInteger(req.body.assignedTo, 'assignedTo', { nullable: true }, details);
    }

    finalize(details);

    req.validated = {
      ...req.validated,
      body: {
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        createdBy: req.body.createdBy,
        assignedTo: req.body.assignedTo,
        status: req.body.status,
      },
    };
    next();
  } catch (err) {
    next(err);
  }
}

function validateUpdateTicketBody(req, res, next) {
  try {
    assertObject(req.body);
    const details = [];
    const { title, description, priority, assignedTo } = req.body;

    if (title !== undefined) {
      assertString(title, 'title', {}, details);
    }
    if (description !== undefined) {
      assertString(description, 'description', {}, details);
    }
    if (priority !== undefined) {
      assertString(priority, 'priority', {}, details);
    }
    if (assignedTo !== undefined) {
      assertInteger(assignedTo, 'assignedTo', { nullable: true }, details);
    }

    finalize(details);

    req.validated = {
      ...req.validated,
      body: {
        title,
        description,
        priority,
        assignedTo,
        status: req.body.status,
        createdBy: req.body.createdBy,
        createdAt: req.body.createdAt,
      },
    };
    next();
  } catch (err) {
    next(err);
  }
}

function validateTransitionStatusBody(req, res, next) {
  try {
    assertObject(req.body);
    const details = [];

    assertString(req.body.status, 'status', { required: true }, details);
    finalize(details);

    req.validated = {
      ...req.validated,
      body: { status: req.body.status },
    };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateListTicketsQuery,
  validateCreateTicketBody,
  validateUpdateTicketBody,
  validateTransitionStatusBody,
};
