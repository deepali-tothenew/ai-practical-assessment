import { apiFetch, buildQuery } from './client';

/**
 * @param {{ q?: string, status?: string }} [params]
 * @returns {Promise<{ tickets: object[] }>}
 */
export function listTickets(params = {}) {
  const query = buildQuery({
    q: params.q,
    status: params.status,
  });

  return apiFetch(`/api/tickets${query}`);
}

/**
 * @param {number} id
 * @returns {Promise<{ ticket: object, comments: object[] }>}
 */
export function getTicket(id) {
  return apiFetch(`/api/tickets/${id}`);
}

/**
 * @param {{
 *   title: string,
 *   description: string,
 *   priority: string,
 *   createdBy: number,
 *   assignedTo?: number | null,
 * }} payload
 * @returns {Promise<object>}
 */
export function createTicket(payload) {
  return apiFetch('/api/tickets', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * @param {number} id
 * @param {{
 *   title?: string,
 *   description?: string,
 *   priority?: string,
 *   assignedTo?: number | null,
 * }} payload
 * @returns {Promise<object>}
 */
export function updateTicket(id, payload) {
  return apiFetch(`/api/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

/**
 * @param {number} id
 * @param {string} status
 * @returns {Promise<object>}
 */
export function transitionTicketStatus(id, status) {
  return apiFetch(`/api/tickets/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
