import { apiFetch } from './client';

/**
 * @param {number} ticketId
 * @param {{ message: string, createdBy: number }} payload
 * @returns {Promise<{ comment: object }>}
 */
export function createComment(ticketId, payload) {
  return apiFetch(`/api/tickets/${ticketId}/comments`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
