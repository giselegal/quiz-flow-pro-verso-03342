/**
 * Cache Middleware
 * Configures HTTP caching headers for different resources
 */

import { Request, Response, NextFunction } from 'express';

export interface CacheOptions {
  /**
   * Cache duration in seconds
   */
  maxAge?: number;

  /**
   * Whether the cache is public (CDN) or private (browser only)
   */
  scope?: 'public' | 'private';

  /**
   * Whether to allow stale content while revalidating
   */
  staleWhileRevalidate?: number;

  /**
   * Whether to require revalidation
   */
  mustRevalidate?: boolean;

  /**
   * Whether this is immutable content
   */
  immutable?: boolean;
}

export function cacheMiddleware(options: CacheOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const directives: string[] = [];

    // Scope
    if (options.scope) {
      directives.push(options.scope);
    }

    // Max age
    if (options.maxAge !== undefined) {
      directives.push(`max-age=${options.maxAge}`);
    }

    // Stale while revalidate
    if (options.staleWhileRevalidate !== undefined) {
      directives.push(`stale-while-revalidate=${options.staleWhileRevalidate}`);
    }

    // Must revalidate
    if (options.mustRevalidate) {
      directives.push('must-revalidate');
    }

    // Immutable
    if (options.immutable) {
      directives.push('immutable');
    }

    if (directives.length > 0) {
      res.setHeader('Cache-Control', directives.join(', '));
    }

    next();
  };
}

// Predefined cache strategies
export const cacheStrategies = {
  /**
   * No caching - always fetch fresh
   */
  noCache: () => cacheMiddleware({
    scope: 'private',
    maxAge: 0,
    mustRevalidate: true,
  }),

  /**
   * Short cache - 5 minutes
   * Good for frequently changing data
   */
  short: () => cacheMiddleware({
    scope: 'public',
    maxAge: 300, // 5 minutes
    staleWhileRevalidate: 60,
  }),

  /**
   * Medium cache - 1 hour
   * Good for semi-static content
   */
  medium: () => cacheMiddleware({
    scope: 'public',
    maxAge: 3600, // 1 hour
    staleWhileRevalidate: 300,
  }),

  /**
   * Long cache - 1 day
   * Good for static content
   */
  long: () => cacheMiddleware({
    scope: 'public',
    maxAge: 86400, // 1 day
    staleWhileRevalidate: 3600,
  }),

  /**
   * Immutable cache - 1 year
   * For versioned assets that never change
   */
  immutable: () => cacheMiddleware({
    scope: 'public',
    maxAge: 31536000, // 1 year
    immutable: true,
  }),

  /**
   * Private cache - browser only
   * For user-specific data
   */
  private: (maxAge: number = 300) => cacheMiddleware({
    scope: 'private',
    maxAge,
  }),
};
