import { apiFetch } from './client';

/**
 * @returns {Promise<{ users: Array<{ id: number, name: string, email: string, role: string }> }>}
 */
export function listUsers() {
  return apiFetch('/api/users');
}
