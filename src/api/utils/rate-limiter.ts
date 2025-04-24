import { RateLimitError } from './api-error';

interface RateLimitConfig {
  windowMs: number;    // Time window in milliseconds
  maxRequests: number; // Maximum number of requests in the window
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export class RateLimiter {
  private limits: Map<string, RateLimitEntry>;

  constructor(private config: RateLimitConfig) {
    this.limits = new Map();
  }

  async checkLimit(key: string): Promise<void> {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now >= entry.resetAt) {
      // First request or window expired, create new entry
      this.limits.set(key, {
        count: 1,
        resetAt: now + this.config.windowMs,
      });
      return;
    }

    if (entry.count >= this.config.maxRequests) {
      const waitTime = entry.resetAt - now;
      throw new RateLimitError(
        `Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`
      );
    }

    // Increment counter
    entry.count++;
  }

  async resetLimit(key: string): Promise<void> {
    this.limits.delete(key);
  }
}

// Create rate limiters for different APIs
export const rateLimiters = {
  openai: new RateLimiter({ windowMs: 60000, maxRequests: 20 }),    // 20 requests per minute
  fec: new RateLimiter({ windowMs: 60000, maxRequests: 100 }),      // 100 requests per minute
  civic: new RateLimiter({ windowMs: 60000, maxRequests: 50 }),     // 50 requests per minute
  ballotpedia: new RateLimiter({ windowMs: 60000, maxRequests: 30 }) // 30 requests per minute
};
