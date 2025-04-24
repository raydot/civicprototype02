import { APIError, ExternalAPIError } from './api-error';
import { authMiddleware } from '../middleware/auth';

export interface APIClientConfig {
  baseURL: string;
  apiKey?: string;
  timeout?: number;
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

export class APIClient {
  private config: APIClientConfig;

  constructor(config: APIClientConfig) {
    this.config = {
      timeout: 10000, // 10 seconds default timeout
      requireAuth: false, // Auth not required by default
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    };
  }

  protected async request<T>(
    method: string,
    path: string,
    options: {
      body?: unknown;
      query?: Record<string, string>;
      headers?: Record<string, string>;
    } = {}
  ): Promise<T> {
    const url = new URL(path, this.config.baseURL);
    if (options.query) {
      Object.entries(options.query).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      // Get authentication token if required
      let authHeader = {};
      if (this.config.requireAuth) {
        const token = await authMiddleware.getAccessToken();
        authHeader = { Authorization: `Bearer ${token}` };
      }

      const response = await fetch(url.toString(), {
        method,
        headers: {
          ...this.config.headers,
          ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
          ...authHeader,
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: response.statusText,
        }));

        throw new APIError(
          error.message || 'Request failed',
          response.status,
          error.code || 'REQUEST_FAILED',
          error
        );
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof APIError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new APIError(
          'Request timed out',
          408,
          'REQUEST_TIMEOUT'
        );
      }

      throw new ExternalAPIError(
        'External API request failed',
        this.config.baseURL,
        error
      );
    }
  }

  protected get<T>(path: string, options?: Omit<Parameters<typeof this.request>[2], 'body'>) {
    return this.request<T>('GET', path, options);
  }

  protected post<T>(path: string, options?: Parameters<typeof this.request>[2]) {
    return this.request<T>('POST', path, options);
  }

  protected put<T>(path: string, options?: Parameters<typeof this.request>[2]) {
    return this.request<T>('PUT', path, options);
  }

  protected patch<T>(path: string, options?: Parameters<typeof this.request>[2]) {
    return this.request<T>('PATCH', path, options);
  }

  protected delete<T>(path: string, options?: Parameters<typeof this.request>[2]) {
    return this.request<T>('DELETE', path, options);
  }
}
