const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(message, { status, code, details, data } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.data = data;
  }
}

/**
 * Base fetch wrapper for API requests.
 * Throws ApiError with status, code, and optional details on failure.
 */
export async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const apiError = data?.error;
    throw new ApiError(apiError?.message || `Request failed with status ${response.status}`, {
      status: response.status,
      code: apiError?.code,
      details: apiError?.details,
      data,
    });
  }

  return data;
}

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    const trimmed = typeof value === 'string' ? value.trim() : value;
    if (trimmed === '') {
      return;
    }

    searchParams.set(key, String(trimmed));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export { API_BASE_URL, buildQuery };
