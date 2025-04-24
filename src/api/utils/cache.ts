interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

interface CacheConfig {
  defaultTTL: number; // Time-to-live in milliseconds
  maxEntries?: number; // Maximum number of entries to store
}

export class Cache {
  private store: Map<string, CacheEntry<unknown>>;
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.store = new Map();
    this.config = config;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    // Clean expired entries if we're at capacity
    if (this.config.maxEntries && this.store.size >= this.config.maxEntries) {
      this.cleanExpired();
    }

    const expiresAt = Date.now() + (ttl || this.config.defaultTTL);
    this.store.set(key, { data, expiresAt });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T>;
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  private cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }
}

// Create and export the cache instances
export const caches = {
  representatives: new Cache({ defaultTTL: 3600000, maxEntries: 1000 }), // 1 hour TTL
  candidates: new Cache({ defaultTTL: 3600000, maxEntries: 1000 }),      // 1 hour TTL
  ballotMeasures: new Cache({ defaultTTL: 86400000, maxEntries: 500 }),  // 24 hours TTL
  priorities: new Cache({ defaultTTL: 300000, maxEntries: 100 }),        // 5 minutes TTL
  auth: new Cache({ defaultTTL: 86400000, maxEntries: 10 })             // 24 hours TTL for auth tokens
};
