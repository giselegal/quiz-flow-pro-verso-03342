import { describe, it, expect, beforeEach, vi } from 'vitest';
import { resultCacheService } from '../ResultCacheService';
import { StorageService } from '../StorageService';

// Mock StorageService
vi.mock('../StorageService', () => ({
  StorageService: {
    safeGetJSON: vi.fn(),
    safeSetJSON: vi.fn(() => true),
    safeRemove: vi.fn(() => true)
  }
}));

// Crie um mock tipado para melhor IntelliSense
const mockStorageService = StorageService as any;

describe('ResultCacheService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset para comportamento padrão
    mockStorageService.safeGetJSON.mockReturnValue(null);
  });

  describe('cache functionality', () => {
    it('should return null for cache miss', () => {
      const selections = { 'step-3': ['option1'], 'step-4': ['option2'] };
      const result = resultCacheService.get(selections, 'testUser');
      expect(result).toBeNull();
    });

    it('should store and retrieve cached results', () => {
      const selections = { 'step-3': ['option1'], 'step-4': ['option2'] };
      const testResult = { primaryStyle: { style: 'Classic' } };
      
      // Calcular hash real baseado na lógica do serviço
      const generateTestHash = (data: Record<string, string[]>): string => {
        const sortedKeys = Object.keys(data).sort();
        const combined = sortedKeys.map(key => {
          const values = data[key] || [];
          return `${key}:${values.sort().join(',')}`;
        }).join('|');
        
        let hash = 0;
        for (let i = 0; i < combined.length; i++) {
          const char = combined.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
      };
      
      const realHash = generateTestHash(selections);
      const cacheKey = `${realHash}_testuser`;
      
      // Mock cache retrieval
      mockStorageService.safeGetJSON.mockReturnValue({
        [cacheKey]: {
          result: testResult,
          timestamp: Date.now(),
          selectionsHash: realHash,
          userName: 'testUser'
        }
      });

      const result = resultCacheService.get(selections, 'testUser');
      expect(result).toEqual(testResult);
    });

    it('should return null for expired cache entries', () => {
      const selections = { 'step-3': ['option1'] };
      
      // Mock expired cache
      mockStorageService.safeGetJSON.mockReturnValue({
        'mockHash_testuser': {
          result: { primaryStyle: { style: 'Classic' } },
          timestamp: Date.now() - (10 * 60 * 1000), // 10 minutes ago (expired)
          selectionsHash: 'mockHash',
          userName: 'testUser'
        }
      });

      const result = resultCacheService.get(selections, 'testUser');
      expect(result).toBeNull();
    });

    it('should store cache entries successfully', () => {
      const selections = { 'step-3': ['option1'] };
      const testResult = { primaryStyle: { style: 'Classic' } };
      
      const success = resultCacheService.set(selections, testResult, 'testUser');
      expect(success).toBe(true);
      
      expect(mockStorageService.safeSetJSON).toHaveBeenCalled();
    });
  });

  describe('cache statistics', () => {
    it('should return correct cache statistics', () => {
      mockStorageService.safeGetJSON.mockReturnValue({
        'hash1_user1': {
          result: {},
          timestamp: Date.now(),
          selectionsHash: 'hash1',
          userName: 'user1'
        },
        'hash2_user2': {
          result: {},
          timestamp: Date.now() - (10 * 60 * 1000), // expired
          selectionsHash: 'hash2',
          userName: 'user2'
        }
      });

      const stats = resultCacheService.getStats();
      expect(stats.totalEntries).toBe(2);
      expect(stats.validEntries).toBe(1);
      expect(stats.expiredEntries).toBe(1);
    });
  });

  describe('cache cleanup', () => {
    it('should clear all cache entries', () => {
      const success = resultCacheService.clear();
      expect(success).toBe(true);
      
      expect(mockStorageService.safeRemove).toHaveBeenCalled();
    });
  });
});