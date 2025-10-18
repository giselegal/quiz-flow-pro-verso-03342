/**
 * UnifiedTemplateCache - cache único e simples para templates/steps/blocos
 * Objetivo: reduzir fragmentação de caches e facilitar invalidação.
 */

export class UnifiedTemplateCache {
  private cache = new Map<string, any>();

  get<T = any>(key: string): T | undefined {
    return this.cache.get(key);
  }

  set<T = any>(key: string, value: T): void {
    this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

export const unifiedCache = new UnifiedTemplateCache();
