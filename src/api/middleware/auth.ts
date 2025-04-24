import { APIError, AuthenticationError } from '../utils/api-error';
import { Cache, caches } from '../utils/cache';

interface JWTPayload {
  sub: string;
  exp: number;
  iat: number;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export class AuthMiddleware {
  private static instance: AuthMiddleware;
  private currentTokens: AuthTokens | null = null;
  private refreshPromise: Promise<AuthTokens> | null = null;
  private authCache: Cache;

  private constructor() {
    this.authCache = caches.auth;
  }

  static getInstance(): AuthMiddleware {
    if (!AuthMiddleware.instance) {
      AuthMiddleware.instance = new AuthMiddleware();
    }
    return AuthMiddleware.instance;
  }

  async getAccessToken(): Promise<string> {
    if (!this.currentTokens) {
      throw new AuthenticationError('No authentication tokens available');
    }

    // Check if token is expired or will expire in the next 5 minutes
    const now = Date.now();
    const expiresIn = this.currentTokens.expiresAt - now;
    const shouldRefresh = expiresIn < 5 * 60 * 1000; // 5 minutes

    if (shouldRefresh) {
      try {
        // Use existing refresh promise if one is in progress
        if (this.refreshPromise) {
          const tokens = await this.refreshPromise;
          return tokens.accessToken;
        }

        // Start new refresh
        this.refreshPromise = this.refreshTokens();
        const tokens = await this.refreshPromise;
        return tokens.accessToken;
      } catch (error) {
        throw new AuthenticationError('Failed to refresh authentication tokens');
      } finally {
        this.refreshPromise = null;
      }
    }

    return this.currentTokens.accessToken;
  }

  setTokens(tokens: AuthTokens): void {
    this.currentTokens = tokens;
    
    // Cache tokens for offline access
    this.authCache.set('tokens', tokens, tokens.expiresAt - Date.now());
  }

  clearTokens(): void {
    this.currentTokens = null;
    this.authCache.delete('tokens');
  }

  private async refreshTokens(): Promise<AuthTokens> {
    if (!this.currentTokens?.refreshToken) {
      throw new AuthenticationError('No refresh token available');
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: this.currentTokens.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new APIError(
          'Failed to refresh tokens',
          response.status,
          'REFRESH_FAILED'
        );
      }

      const tokens: AuthTokens = await response.json();
      this.setTokens(tokens);
      return tokens;
    } catch (error) {
      this.clearTokens(); // Clear invalid tokens
      throw error;
    }
  }

  // Verify JWT token without making a network request
  private verifyToken(token: string): boolean {
    try {
      const [, payload] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload)) as JWTPayload;
      return decodedPayload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const authMiddleware = AuthMiddleware.getInstance();
