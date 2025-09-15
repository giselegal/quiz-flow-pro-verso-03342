/**
 * 🎯 INFRASTRUCTURE LAYER - Public API
 * 
 * Exporta todas as implementações de infraestrutura.
 * Esta é a camada que conecta o domínio com serviços externos.
 */

// Supabase Repositories
export { SupabaseQuizRepository } from './supabase/repositories/SupabaseQuizRepository';
export { SupabaseFunnelRepository } from './supabase/repositories/SupabaseFunnelRepository';
export type { FunnelRepository } from './supabase/repositories/SupabaseFunnelRepository';

// Storage Adapters
export { 
  LocalStorageAdapter,
  EditorStorageAdapter,
  QuizStorageAdapter,
  FunnelStorageAdapter
} from './storage/LocalStorageAdapter';
export type { 
  StorageAdapter,
  CacheOptions
} from './storage/LocalStorageAdapter';

// API Clients
export { 
  SupabaseApiClient,
  supabaseApi
} from './api/SupabaseApiClient';
export type {
  ApiResponse,
  PaginatedApiResponse,
  QueryOptions
} from './api/SupabaseApiClient';

// Utility Functions
export const createStorageKey = (prefix: string, id: string, suffix?: string): string => {
  return suffix ? `${prefix}_${id}_${suffix}` : `${prefix}_${id}`;
};

export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const infrastructureLayer = {
  repositories: {
    quiz: new SupabaseQuizRepository(),
    funnel: new SupabaseFunnelRepository()
  },
  storage: new LocalStorageAdapter(),
  api: supabaseApi
};

export const validateEnvironment = (): {
  hasSupabase: boolean;
  hasLocalStorage: boolean;
  environment: 'development' | 'production' | 'test';
  warnings: string[];
} => {
  const warnings: string[] = [];
  
  // Check Supabase
  const hasSupabase = !!(
    typeof window !== 'undefined' &&
    process.env.NODE_ENV !== 'test'
  );
  
  if (!hasSupabase) {
    warnings.push('Supabase client not available - using fallback mode');
  }
  
  // Check localStorage
  const hasLocalStorage = typeof window !== 'undefined' && 'localStorage' in window;
  
  if (!hasLocalStorage) {
    warnings.push('localStorage not available - data persistence disabled');
  }
  
  // Determine environment
  let environment: 'development' | 'production' | 'test' = 'production';
  if (process.env.NODE_ENV === 'development') environment = 'development';
  if (process.env.NODE_ENV === 'test') environment = 'test';
  
  return {
    hasSupabase,
    hasLocalStorage,
    environment,
    warnings
  };
};

// Error Classes for Infrastructure
export class InfrastructureError extends Error {
  constructor(
    message: string,
    public readonly service: string,
    public readonly operation: string,
    public readonly originalError?: any
  ) {
    super(message);
    this.name = 'InfrastructureError';
  }
}

export class StorageError extends InfrastructureError {
  constructor(message: string, operation: string, originalError?: any) {
    super(message, 'storage', operation, originalError);
    this.name = 'StorageError';
  }
}

export class ApiError extends InfrastructureError {
  constructor(
    message: string, 
    operation: string, 
    originalError?: any,
    public readonly statusCode?: number
  ) {
    super(message, 'api', operation, originalError);
    this.name = 'ApiError';
  }
}

export class DatabaseError extends InfrastructureError {
  constructor(message: string, operation: string, originalError?: any) {
    super(message, 'database', operation, originalError);
    this.name = 'DatabaseError';
  }
}

// Retry and Circuit Breaker Utilities
export class RetryPolicy {
  constructor(
    public readonly maxAttempts: number = 3,
    public readonly delayMs: number = 1000,
    public readonly backoffMultiplier: number = 2
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === this.maxAttempts) {
          throw new InfrastructureError(
            `Operation failed after ${this.maxAttempts} attempts`,
            'retry-policy',
            'execute',
            error
          );
        }
        
        // Wait before retry
        const delay = this.delayMs * Math.pow(this.backoffMultiplier, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
}

export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private readonly threshold: number = 5,
    private readonly timeoutMs: number = 60000
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.timeoutMs) {
        this.state = 'half-open';
      } else {
        throw new InfrastructureError(
          'Circuit breaker is open',
          'circuit-breaker',
          'execute'
        );
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }

  getState(): { state: string; failures: number; lastFailureTime: number } {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime
    };
  }
}

// Performance Monitoring
export class PerformanceMonitor {
  private metrics: Record<string, { count: number; totalTime: number; errors: number }> = {};

  async monitor<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    
    if (!this.metrics[operation]) {
      this.metrics[operation] = { count: 0, totalTime: 0, errors: 0 };
    }

    try {
      const result = await fn();
      const endTime = performance.now();
      
      this.metrics[operation].count++;
      this.metrics[operation].totalTime += endTime - startTime;
      
      return result;
    } catch (error) {
      this.metrics[operation].errors++;
      throw error;
    }
  }

  getMetrics(): Record<string, { 
    count: number; 
    averageTime: number; 
    totalTime: number; 
    errors: number;
    errorRate: number;
  }> {
    const result: any = {};
    
    Object.entries(this.metrics).forEach(([operation, data]) => {
      result[operation] = {
        count: data.count,
        averageTime: data.count > 0 ? data.totalTime / data.count : 0,
        totalTime: data.totalTime,
        errors: data.errors,
        errorRate: data.count > 0 ? data.errors / data.count : 0
      };
    });
    
    return result;
  }

  reset(): void {
    this.metrics = {};
  }
}

// Global instances
export const globalRetryPolicy = new RetryPolicy();
export const globalCircuitBreaker = new CircuitBreaker();
export const globalPerformanceMonitor = new PerformanceMonitor();