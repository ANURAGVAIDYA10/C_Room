// CacheManager.ts
// Centralized cache manager for API responses with request deduplication

class CacheManager {
  private cache: Map<string, { data: any; timestamp: number }>;
  private pendingRequests: Map<string, Promise<any>>;
  private defaultCacheDuration: number;

  constructor(defaultCacheDuration: number = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.pendingRequests = new Map();
    this.defaultCacheDuration = defaultCacheDuration;
  }

  // Generate a unique key for a request
  private generateKey(url: string, options: RequestInit = {}): string {
    return `${url}-${JSON.stringify(options)}`;
  }

  // Check if data is cached and still valid
  private isCached(key: string, cacheDuration: number = this.defaultCacheDuration): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < cacheDuration;
  }

  // Get cached data
  private getCachedData(key: string): any {
    const cached = this.cache.get(key);
    return cached ? cached.data : null;
  }

  // Cache data
  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Check if there's a pending request
  private hasPendingRequest(key: string): boolean {
    return this.pendingRequests.has(key);
  }

  // Get pending request
  private getPendingRequest(key: string): Promise<any> | undefined {
    return this.pendingRequests.get(key);
  }

  // Set pending request
  private setPendingRequest(key: string, promise: Promise<any>): void {
    this.pendingRequests.set(key, promise);
  }

  // Remove pending request
  private removePendingRequest(key: string): void {
    this.pendingRequests.delete(key);
  }

  // Fetch data with caching and deduplication
  async fetchWithCache(
    url: string, 
    options: RequestInit = {}, 
    cacheDuration: number = this.defaultCacheDuration
  ): Promise<any> {
    // Ensure credentials are included in all requests
    const updatedOptions: RequestInit = {
      ...options,
      credentials: 'include', // This ensures JWT cookies are sent
    };

    const key = this.generateKey(url, updatedOptions);

    // Check if there's a pending request
    if (this.hasPendingRequest(key)) {
      console.log(`Deduplicating request for: ${url}`);
      return this.getPendingRequest(key);
    }

    // Check cache
    if (this.isCached(key, cacheDuration)) {
      console.log(`Returning cached response for: ${url}`);
      return this.getCachedData(key);
    }

    // Create new request
    const requestPromise = fetch(url, updatedOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json().catch(() => response.text());
      })
      .then(data => {
        // Cache the response
        this.setCachedData(key, data);
        return data;
      })
      .finally(() => {
        // Clean up pending request
        this.removePendingRequest(key);
      });

    // Store pending request
    this.setPendingRequest(key, requestPromise);

    return requestPromise;
  }

  // Clear cache for a specific key
  clearCache(key: string): void {
    this.cache.delete(key);
  }

  // Clear all cache
  clearAllCache(): void {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats(): { cacheSize: number; pendingRequests: number } {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size
    };
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();

export default CacheManager;