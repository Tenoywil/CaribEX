/**
 * L1 In-Memory Cache Client
 * Simple TTL-based caching for client-side data
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class CacheClient {
  private cache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Get value from cache
   * @param key Cache key
   * @returns Cached value or null if expired/not found
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (entry === undefined) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set value in cache with TTL
   * @param key Cache key
   * @param data Data to cache
   * @param ttl Time to live in seconds
   */
  set<T>(key: string, data: T, ttl: number = 300): void {
    const expiresAt = Date.now() + ttl * 1000;
    this.cache.set(key, { data, expiresAt });
  }

  /**
   * Delete a specific key from cache
   * @param key Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear cache entries matching a pattern
   * @param pattern Pattern to match (e.g., 'products:')
   */
  clear(pattern?: string): void {
    if (pattern === undefined) {
      this.cache.clear();
      return;
    }

    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (key.startsWith(pattern)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  /**
   * Check if key exists and is not expired
   * @param key Cache key
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry === undefined) return false;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

export const cacheClient = new CacheClient();
