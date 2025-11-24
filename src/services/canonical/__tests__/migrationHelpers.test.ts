/**
 * 🧪 MIGRATION HELPERS TESTS
 * 
 * Tests for Phase 2 migration helper utilities that facilitate
 * gradual migration to canonical services with feature flags.
 * 
 * @version 1.0.0
 * @phase Phase 2 - Progressive Migration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getTemplateService,
  loadTemplate,
  saveTemplate,
  listTemplates,
  shouldUseReactQuery,
  shouldUseCanonicalServices,
  isSuccess,
  isError,
  unwrapResult,
} from '../migrationHelpers';
import { featureFlags } from '@/config/flags';
import type { ServiceResult } from '../types';

// Mock the feature flags module
vi.mock('@/config/flags', () => ({
  featureFlags: {
    USE_CANONICAL_TEMPLATE_SERVICE: false,
    USE_REACT_QUERY_TEMPLATES: false,
    USE_CANONICAL_FUNNEL_SERVICE: false,
    USE_REACT_QUERY_FUNNELS: false,
  },
}));

describe('Migration Helpers', () => {
  describe('getTemplateService', () => {
    it('should return a service object', () => {
      const service = getTemplateService();
      expect(service).toBeDefined();
      expect(typeof service.getTemplate).toBe('function');
    });

    it('should always return the same service instance', () => {
      const service1 = getTemplateService();
      const service2 = getTemplateService();
      expect(service1).toBe(service2);
    });
  });

  describe('shouldUseReactQuery', () => {
    it('should return false when flag is disabled', () => {
      (featureFlags as any).USE_REACT_QUERY_TEMPLATES = false;
      expect(shouldUseReactQuery()).toBe(false);
    });

    it('should return true when flag is enabled', () => {
      (featureFlags as any).USE_REACT_QUERY_TEMPLATES = true;
      expect(shouldUseReactQuery()).toBe(true);
    });
  });

  describe('shouldUseCanonicalServices', () => {
    it('should return false when flag is disabled', () => {
      (featureFlags as any).USE_CANONICAL_TEMPLATE_SERVICE = false;
      expect(shouldUseCanonicalServices()).toBe(false);
    });

    it('should return true when flag is enabled', () => {
      (featureFlags as any).USE_CANONICAL_TEMPLATE_SERVICE = true;
      expect(shouldUseCanonicalServices()).toBe(true);
    });
  });

  describe('isSuccess', () => {
    it('should return true for successful result', () => {
      const result: ServiceResult<string> = {
        success: true,
        data: 'test',
      };
      expect(isSuccess(result)).toBe(true);
    });

    it('should return false for error result', () => {
      const result: ServiceResult<string> = {
        success: false,
        error: new Error('test error'),
      };
      expect(isSuccess(result)).toBe(false);
    });

    it('should narrow type correctly', () => {
      const result: ServiceResult<string> = {
        success: true,
        data: 'test',
      };
      
      if (isSuccess(result)) {
        // TypeScript should know result.data exists here
        expect(result.data).toBe('test');
      }
    });
  });

  describe('isError', () => {
    it('should return false for successful result', () => {
      const result: ServiceResult<string> = {
        success: true,
        data: 'test',
      };
      expect(isError(result)).toBe(false);
    });

    it('should return true for error result', () => {
      const result: ServiceResult<string> = {
        success: false,
        error: new Error('test error'),
      };
      expect(isError(result)).toBe(true);
    });

    it('should narrow type correctly', () => {
      const result: ServiceResult<string> = {
        success: false,
        error: new Error('test error'),
      };
      
      if (isError(result)) {
        // TypeScript should know result.error exists here
        expect(result.error.message).toBe('test error');
      }
    });
  });

  describe('unwrapResult', () => {
    it('should return data for successful result', () => {
      const result: ServiceResult<string> = {
        success: true,
        data: 'test data',
      };
      
      const data = unwrapResult(result);
      expect(data).toBe('test data');
    });

    it('should throw error for failed result', () => {
      const error = new Error('test error');
      const result: ServiceResult<string> = {
        success: false,
        error,
      };
      
      expect(() => unwrapResult(result)).toThrow('test error');
    });

    it('should throw generic error if no error in failed result', () => {
      const result: ServiceResult<string> = {
        success: false,
      } as any; // Force invalid state for testing
      
      expect(() => unwrapResult(result)).toThrow('Unknown error');
    });
  });

  describe('Type Safety', () => {
    it('should work with different data types', () => {
      const stringResult: ServiceResult<string> = {
        success: true,
        data: 'test',
      };
      
      const numberResult: ServiceResult<number> = {
        success: true,
        data: 42,
      };
      
      const objectResult: ServiceResult<{ id: string }> = {
        success: true,
        data: { id: 'test-id' },
      };
      
      expect(isSuccess(stringResult)).toBe(true);
      expect(isSuccess(numberResult)).toBe(true);
      expect(isSuccess(objectResult)).toBe(true);
      
      if (isSuccess(stringResult)) {
        expect(typeof stringResult.data).toBe('string');
      }
      
      if (isSuccess(numberResult)) {
        expect(typeof numberResult.data).toBe('number');
      }
      
      if (isSuccess(objectResult)) {
        expect(typeof objectResult.data).toBe('object');
        expect(objectResult.data.id).toBe('test-id');
      }
    });
  });

  describe('Integration with Feature Flags', () => {
    it('should respect feature flag changes', () => {
      // Initially disabled
      (featureFlags as any).USE_CANONICAL_TEMPLATE_SERVICE = false;
      expect(shouldUseCanonicalServices()).toBe(false);
      
      // Enable flag
      (featureFlags as any).USE_CANONICAL_TEMPLATE_SERVICE = true;
      expect(shouldUseCanonicalServices()).toBe(true);
      
      // Disable again
      (featureFlags as any).USE_CANONICAL_TEMPLATE_SERVICE = false;
      expect(shouldUseCanonicalServices()).toBe(false);
    });

    it('should handle multiple flags independently', () => {
      (featureFlags as any).USE_CANONICAL_TEMPLATE_SERVICE = true;
      (featureFlags as any).USE_REACT_QUERY_TEMPLATES = false;
      
      expect(shouldUseCanonicalServices()).toBe(true);
      expect(shouldUseReactQuery()).toBe(false);
      
      (featureFlags as any).USE_CANONICAL_TEMPLATE_SERVICE = false;
      (featureFlags as any).USE_REACT_QUERY_TEMPLATES = true;
      
      expect(shouldUseCanonicalServices()).toBe(false);
      expect(shouldUseReactQuery()).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing data gracefully', () => {
      const result: ServiceResult<string> = {
        success: true,
        data: undefined as any,
      };
      
      expect(isSuccess(result)).toBe(true);
      // Data can be undefined, that's valid
      expect(result.data).toBeUndefined();
    });

    it('should handle missing error gracefully', () => {
      const result: ServiceResult<string> = {
        success: false,
        error: undefined as any,
      };
      
      expect(isError(result)).toBe(true);
      // Error can be undefined in edge cases
      expect(() => unwrapResult(result)).toThrow();
    });
  });
});

describe('Migration Helpers - Real World Scenarios', () => {
  describe('Component Migration Pattern', () => {
    it('should support gradual component migration', () => {
      // Simulate component using migration helpers
      const useNewApproach = shouldUseReactQuery();
      
      // Component can check flag and use appropriate implementation
      expect(typeof useNewApproach).toBe('boolean');
    });

    it('should support service selection based on flags', () => {
      const service = getTemplateService();
      
      // Service should be available regardless of flag state
      expect(service).toBeDefined();
      expect(service.getTemplate).toBeDefined();
    });
  });

  describe('Error Recovery Pattern', () => {
    it('should allow try-catch pattern with unwrapResult', () => {
      const successResult: ServiceResult<string> = {
        success: true,
        data: 'success',
      };
      
      const errorResult: ServiceResult<string> = {
        success: false,
        error: new Error('failure'),
      };
      
      // Success case
      try {
        const data = unwrapResult(successResult);
        expect(data).toBe('success');
      } catch (error) {
        throw new Error('Should not throw');
      }
      
      // Error case
      try {
        unwrapResult(errorResult);
        throw new Error('Should have thrown');
      } catch (error) {
        expect((error as Error).message).toBe('failure');
      }
    });

    it('should allow conditional pattern with isSuccess/isError', () => {
      const result: ServiceResult<string> = {
        success: true,
        data: 'test',
      };
      
      let handledData: string | null = null;
      let handledError: Error | null = null;
      
      if (isSuccess(result)) {
        handledData = result.data;
      } else if (isError(result)) {
        handledError = result.error;
      }
      
      expect(handledData).toBe('test');
      expect(handledError).toBeNull();
    });
  });
});
