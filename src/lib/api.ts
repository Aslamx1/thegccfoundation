// client/src/lib/api.ts (or src/lib/api.ts)

export class ApiError<T = unknown> extends Error {
  status: number;
  data?: T;

  constructor(status: number, message: string, data?: T) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined | null>;
}

const getBaseUrl = (): string => {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  return '';
};

async function request<T>(endpoint: string, options: RequestOptions = {}, body?: unknown): Promise<T> {
  const baseUrl = getBaseUrl();
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let url = `${baseUrl}${normalizedEndpoint}`;

  // Attach search query parameters if provided
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Automatically passes & receives HttpOnly cookies
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (networkError: any) {
    throw new ApiError(0, networkError?.message || 'Network connection failed: unable to reach API service.');
  }

  // Handle Unauthorized Session Expiration (401)
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/sign-in') && !currentPath.startsWith('/login')) {
        const redirectParam = encodeURIComponent(currentPath + window.location.search);
        // Supports both /sign-in and /login routes
        window.location.href = `/sign-in?redirect=${redirectParam}`;
      }
    }
    throw new ApiError(401, 'Unauthorized: session expired or authentication required.');
  }

  // Parse response body (JSON or text)
  let responseData: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }
  } else {
    try {
      responseData = await response.text();
    } catch {
      responseData = null;
    }
  }

  // Check for HTTP failure
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;

    if (responseData && typeof responseData === 'object') {
      errorMessage = responseData.message || responseData.error || errorMessage;
    } else if (typeof responseData === 'string' && responseData.trim()) {
      errorMessage = responseData;
    }

    throw new ApiError(response.status, errorMessage, responseData);
  }

  return responseData as T;
}

// -----------------------------------------------------------------------------
// Type-Safe API Client Interface
// -----------------------------------------------------------------------------
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, { ...options, method: 'POST' }, body),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, { ...options, method: 'PUT' }, body),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, { ...options, method: 'PATCH' }, body),

  delete: <T>(endpoint: string, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
