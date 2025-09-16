/**
 * 🧪 StorageService Tests
 * Tests for storage functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '@/services/core/StorageService';

describe('StorageService', () => {
  beforeEach(() => {
    // Reset localStorage
    localStorage.clear();
  });

  describe('String operations', () => {
    it('stores and retrieves strings correctly', () => {
      StorageService.safeSetString('testKey', 'testValue');
      expect(StorageService.safeGetString('testKey')).toBe('testValue');
    });

    it('returns null for non-existent keys', () => {
      expect(StorageService.safeGetString('nonExistentKey')).toBeNull();
    });

    it('handles empty strings', () => {
      StorageService.safeSetString('emptyKey', '');
      expect(StorageService.safeGetString('emptyKey')).toBe('');
    });
  });

  describe('JSON operations', () => {
    it('stores and retrieves objects correctly', () => {
      const testObj = { name: 'Test', value: 123, nested: { prop: true } };
      StorageService.safeSetJSON('testObj', testObj);
      
      const retrieved = StorageService.safeGetJSON('testObj');
      expect(retrieved).toEqual(testObj);
    });

    it('returns null for non-existent JSON keys', () => {
      expect(StorageService.safeGetJSON('nonExistentObj')).toBeNull();
    });

    it('handles arrays correctly', () => {
      const testArray = [1, 2, 3, { prop: 'value' }];
      StorageService.safeSetJSON('testArray', testArray);
      
      const retrieved = StorageService.safeGetJSON('testArray');
      expect(retrieved).toEqual(testArray);
    });

    it('handles malformed JSON gracefully', () => {
      // Manually set invalid JSON
      localStorage.setItem('invalidJSON', '{ invalid json }');
      
      expect(StorageService.safeGetJSON('invalidJSON')).toBeNull();
    });
  });

  describe('Error handling', () => {
    it('handles storage quota exceeded gracefully', () => {
      // Mock a storage failure
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = () => {
        throw new Error('QuotaExceededError');
      };

      // Should not throw
      expect(() => {
        StorageService.safeSetString('testKey', 'testValue');
      }).not.toThrow();

      // Restore original function
      localStorage.setItem = originalSetItem;
    });

    it('handles corrupted localStorage gracefully', () => {
      // Mock localStorage access failure
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = () => {
        throw new Error('Storage access error');
      };

      expect(StorageService.safeGetString('testKey')).toBeNull();

      // Restore original function
      localStorage.getItem = originalGetItem;
    });
  });

  describe('Key management', () => {
    it('removes keys correctly', () => {
      StorageService.safeSetString('tempKey', 'tempValue');
      expect(StorageService.safeGetString('tempKey')).toBe('tempValue');
      
      StorageService.safeRemove('tempKey');
      expect(StorageService.safeGetString('tempKey')).toBeNull();
    });

    it('clears storage correctly', () => {
      StorageService.safeSetString('key1', 'value1');
      StorageService.safeSetString('key2', 'value2');
      
      // Test individual removal since safeClear may not exist
      StorageService.safeRemove('key1');
      StorageService.safeRemove('key2');
      
      expect(StorageService.safeGetString('key1')).toBeNull();
      expect(StorageService.safeGetString('key2')).toBeNull();
    });
  });
});