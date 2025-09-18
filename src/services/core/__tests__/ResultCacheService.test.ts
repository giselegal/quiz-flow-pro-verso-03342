import { describe, it, expect, beforeEach, vi } from 'vitest';
import { resultCacheService } from '../ResultCacheService';

// Mock StorageService
vi.mock('../StorageService', () => ({
  StorageService: {
    safeGetJSON: vi.fn(),
    safeSetJSON: vi.fn(() => true),
    safeRemove: vi.fn(() => true)
  }
}));

describe('ResultCacheService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('cache functionality', () => {
    it('should return null for cache miss', () => {
      const selections = { 'step-3': ['option1'], 'step-4': ['option2'] };
      const result = resultCacheService.get(selections, 'testUser');
      expect(result).toBeNull();
    });

    it('should store and retrieve cached results', async () => {
      const selections = { 'step-3': ['option1'], 'step-4': ['option2'] };
      const testResult = { primaryStyle: { style: 'Classic' } };

      // Mock cache retrieval
      const { StorageService } = await import('../StorageService');
      StorageService.safeGetJSON.mockReturnValue({
        'mockHash_testuser': {
          result: testResult,
          timestamp: Date.now(),
          selectionsHash: 'mockHash',
          userName: 'testUser'
        }
      });

      const result = resultCacheService.get(selections, 'testUser');
      expect(result).toEqual(testResult);
    });

    it('should return null for expired cache entries', () => {
      const selections = { 'step-3': ['option1'] };

      // Mock expired cache
      const { StorageService } = require('../StorageService');
      StorageService.safeGetJSON.mockReturnValue({
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

      const { StorageService } = require('../StorageService');
      expect(StorageService.safeSetJSON).toHaveBeenCalled();
    });
  });

  describe('cache statistics', () => {
    it('should return correct cache statistics', () => {
      const { StorageService } = require('../StorageService');
      StorageService.safeGetJSON.mockReturnValue({
        'hash1_user1': {
          result: { primaryStyle: { style: 'Classic' } },
          timestamp: Date.now(),
          selectionsHash: 'hash1',
          userName: 'user1'
        },
        'hash2_user2': {
          result: { primaryStyle: { style: 'Romantic' } },
          timestamp: Date.now() - (10 * 60 * 1000), // Expired
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

      const { StorageService } = require('../StorageService');
      expect(StorageService.safeRemove).toHaveBeenCalled();
    });
  });
});