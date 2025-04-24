export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }

  static fromError(error: unknown): APIError {
    if (error instanceof APIError) {
      return error;
    }

    if (error instanceof Error) {
      return new APIError(
        error.message,
        500,
        'INTERNAL_SERVER_ERROR',
        { originalError: error }
      );
    }

    return new APIError(
      'An unexpected error occurred',
      500,
      'INTERNAL_SERVER_ERROR',
      { originalError: error }
    );
  }
}

export class RateLimitError extends APIError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

export class AuthenticationError extends APIError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_REQUIRED');
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends APIError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class ExternalAPIError extends APIError {
  constructor(
    message: string,
    public source: string,
    public originalError: unknown
  ) {
    super(message, 502, 'EXTERNAL_API_ERROR', {
      source,
      originalError
    });
    this.name = 'ExternalAPIError';
  }
}
