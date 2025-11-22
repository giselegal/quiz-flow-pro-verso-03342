/**
 * API Client
 * Centralized API client with error handling and type safety
 */

export class APIError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number,
    public details?: any,
    public requestId?: string
  ) {
    super(message);
    this.name = 'APIError';
  }

  static fromResponse(response: Response, body: any): APIError {
    return new APIError(
      body.code || 'UNKNOWN_ERROR',
      body.error || body.message || 'Erro desconhecido',
      response.status,
      body.details,
      body.requestId
    );
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
}

export async function apiRequest<T>(
  url: string,
  options?: RequestOptions
): Promise<T> {
  try {
    // Add query params
    let finalUrl = url;
    if (options?.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        finalUrl += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    const response = await fetch(finalUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    // Handle no content responses
    if (response.status === 204) {
      return undefined as T;
    }

    const body = await response.json();

    if (!response.ok) {
      throw APIError.fromResponse(response, body);
    }

    return body as T;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    // Network error
    throw new APIError(
      'NETWORK_ERROR',
      'Erro de conexão com o servidor',
      0,
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
}

// Convenience methods
export const api = {
  get: <T>(url: string, options?: RequestOptions) =>
    apiRequest<T>(url, { ...options, method: 'GET' }),

  post: <T>(url: string, data?: any, options?: RequestOptions) =>
    apiRequest<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(url: string, data?: any, options?: RequestOptions) =>
    apiRequest<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(url: string, data?: any, options?: RequestOptions) =>
    apiRequest<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(url: string, options?: RequestOptions) =>
    apiRequest<T>(url, { ...options, method: 'DELETE' }),
};
