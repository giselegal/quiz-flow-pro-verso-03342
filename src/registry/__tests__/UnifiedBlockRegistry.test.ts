/**
 * 🧪 UNIFIED BLOCK REGISTRY - UNIT TESTS
 * 
 * Comprehensive test suite for UnifiedBlockRegistry
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { blockRegistry, UnifiedBlockRegistry } from '../UnifiedBlockRegistry';

describe('UnifiedBlockRegistry', () => {
  describe('Initialization', () => {
    it('should be a singleton', () => {
      const instance1 = UnifiedBlockRegistry.getInstance();
      const instance2 = UnifiedBlockRegistry.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should initialize with critical components', () => {
      const criticalTypes = blockRegistry.getCriticalTypes();
      expect(criticalTypes.length).toBeGreaterThan(0);
      expect(criticalTypes).toContain('text-inline');
      expect(criticalTypes).toContain('button-inline');
      expect(criticalTypes).toContain('image-inline');
    });

    it('should have both critical and lazy components', () => {
      const stats = blockRegistry.getStats();
      expect(stats.registry.criticalTypes).toBeGreaterThan(0);
      expect(stats.registry.lazyTypes).toBeGreaterThan(0);
      expect(stats.registry.totalTypes).toBe(
        stats.registry.criticalTypes + stats.registry.lazyTypes
      );
    });
  });

  describe('getComponent (sync)', () => {
    it('should return critical component immediately', () => {
      const component = blockRegistry.getComponent('text-inline');
      expect(component).toBeDefined();
      expect(typeof component).toBe('function');
    });

    it('should return lazy component wrapper', () => {
      const component = blockRegistry.getComponent('quiz-logo');
      expect(component).toBeDefined();
    });

    it('should return fallback for unknown types with patterns', () => {
      const component = blockRegistry.getComponent('custom-text-block');
      expect(component).toBeDefined();
      // Should fallback to TextInlineBlock
    });

    it('should handle aliases correctly', () => {
      const buttonComponent = blockRegistry.getComponent('button-inline');
      const ctaComponent = blockRegistry.getComponent('cta-inline');
      expect(buttonComponent).toBe(ctaComponent);
    });
  });

  describe('getComponentAsync', () => {
    it('should load critical component async', async () => {
      const component = await blockRegistry.getComponentAsync('text-inline');
      expect(component).toBeDefined();
      expect(typeof component).toBe('function');
    });

    it('should load lazy component', async () => {
      const component = await blockRegistry.getComponentAsync('quiz-logo');
      expect(component).toBeDefined();
    });

    it('should return fallback on error', async () => {
      const component = await blockRegistry.getComponentAsync('non-existent-block-xyz');
      expect(component).toBeDefined();
      // Should fallback to TextInlineBlock
    });

    it('should cache loaded components', async () => {
      await blockRegistry.getComponentAsync('quiz-logo');
      const stats1 = blockRegistry.getStats();
      
      await blockRegistry.getComponentAsync('quiz-logo');
      const stats2 = blockRegistry.getStats();
      
      expect(stats2.performance.cacheHitRate).toBeGreaterThan(stats1.performance.cacheHitRate);
    });
  });

  describe('has', () => {
    it('should return true for critical components', () => {
      expect(blockRegistry.has('text-inline')).toBe(true);
      expect(blockRegistry.has('button-inline')).toBe(true);
    });

    it('should return true for lazy components', () => {
      expect(blockRegistry.has('quiz-logo')).toBe(true);
    });

    it('should return false for non-existent components', () => {
      expect(blockRegistry.has('non-existent-xyz')).toBe(false);
    });
  });

  describe('prefetch', () => {
    it('should prefetch lazy component', async () => {
      await blockRegistry.prefetch('quiz-logo');
      const stats = blockRegistry.getStats();
      expect(stats.registry.cachedTypes).toBeGreaterThan(0);
    });

    it('should not throw for already loaded components', async () => {
      await expect(blockRegistry.prefetch('text-inline')).resolves.not.toThrow();
    });

    it('should handle prefetch errors gracefully', async () => {
      await expect(blockRegistry.prefetch('non-existent-xyz')).resolves.not.toThrow();
    });
  });

  describe('prefetchBatch', () => {
    it('should prefetch multiple components', async () => {
      const types = ['quiz-logo', 'quiz-progress-bar', 'quiz-back-button'];
      await blockRegistry.prefetchBatch(types);
      
      const stats = blockRegistry.getStats();
      expect(stats.registry.cachedTypes).toBeGreaterThanOrEqual(types.length);
    });

    it('should handle mixed valid/invalid types', async () => {
      const types = ['text-inline', 'non-existent-1', 'button-inline', 'non-existent-2'];
      await expect(blockRegistry.prefetchBatch(types)).resolves.not.toThrow();
    });
  });

  describe('register', () => {
    it('should register new component', () => {
      const MockComponent = () => null;
      blockRegistry.register('test-component', MockComponent);
      
      expect(blockRegistry.has('test-component')).toBe(true);
      const component = blockRegistry.getComponent('test-component');
      expect(component).toBe(MockComponent);
    });

    it('should register critical component', () => {
      const MockComponent = () => null;
      blockRegistry.register('test-critical', MockComponent, true);
      
      const criticalTypes = blockRegistry.getCriticalTypes();
      expect(criticalTypes).toContain('test-critical');
    });
  });

  describe('registerLazy', () => {
    it('should register lazy component', () => {
      const MockComponent = () => null;
      const loader = async () => ({ default: MockComponent });
      
      blockRegistry.registerLazy('test-lazy', loader);
      expect(blockRegistry.has('test-lazy')).toBe(true);
    });

    it('should load registered lazy component', async () => {
      const MockComponent = () => null;
      const loader = async () => ({ default: MockComponent });
      
      blockRegistry.registerLazy('test-lazy-load', loader);
      const component = await blockRegistry.getComponentAsync('test-lazy-load');
      
      expect(component).toBe(MockComponent);
    });
  });

  describe('Cache Management', () => {
    it('should cache accessed components', () => {
      blockRegistry.getComponent('text-inline');
      const stats = blockRegistry.getStats();
      expect(stats.registry.cachedTypes).toBeGreaterThan(0);
    });

    it('should clear cache', () => {
      blockRegistry.getComponent('text-inline');
      blockRegistry.clearCache();
      const stats = blockRegistry.getStats();
      expect(stats.registry.cachedTypes).toBe(0);
    });
  });

  describe('Fallback System', () => {
    it('should fallback to TextInlineBlock for text patterns', () => {
      const component1 = blockRegistry.getComponent('custom-text');
      const component2 = blockRegistry.getComponent('my-paragraph');
      expect(component1).toBeDefined();
      expect(component2).toBeDefined();
    });

    it('should fallback to ButtonInlineBlock for button patterns', () => {
      const component1 = blockRegistry.getComponent('custom-button');
      const component2 = blockRegistry.getComponent('my-cta');
      expect(component1).toBeDefined();
      expect(component2).toBeDefined();
    });

    it('should fallback to ImageInlineBlock for image patterns', () => {
      const component1 = blockRegistry.getComponent('custom-image');
      const component2 = blockRegistry.getComponent('my-photo');
      expect(component1).toBeDefined();
      expect(component2).toBeDefined();
    });

    it('should fallback to FormInputBlock for form patterns', () => {
      const component = blockRegistry.getComponent('custom-form-field');
      expect(component).toBeDefined();
    });
  });

  describe('Performance Metrics', () => {
    it('should track load metrics', async () => {
      await blockRegistry.getComponentAsync('text-inline');
      await blockRegistry.getComponentAsync('button-inline');
      
      const stats = blockRegistry.getStats();
      expect(stats.performance.totalLoads).toBeGreaterThan(0);
    });

    it('should track cache hits', async () => {
      await blockRegistry.getComponentAsync('text-inline');
      await blockRegistry.getComponentAsync('text-inline'); // Cache hit
      
      const stats = blockRegistry.getStats();
      expect(stats.performance.cacheHitRate).toBeGreaterThan(0);
    });

    it('should return top components', () => {
      const stats = blockRegistry.getStats();
      expect(Array.isArray(stats.topComponents)).toBe(true);
    });
  });

  describe('getAllTypes', () => {
    it('should return all available types', () => {
      const types = blockRegistry.getAllTypes();
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThan(0);
      expect(types).toContain('text-inline');
      expect(types).toContain('button-inline');
    });

    it('should return sorted types', () => {
      const types = blockRegistry.getAllTypes();
      const sorted = [...types].sort();
      expect(types).toEqual(sorted);
    });
  });

  describe('Error Handling', () => {
    it('should handle null/undefined type gracefully', () => {
      const component1 = blockRegistry.getComponent(null as any);
      const component2 = blockRegistry.getComponent(undefined as any);
      expect(component1).toBeDefined(); // Should fallback
      expect(component2).toBeDefined(); // Should fallback
    });

    it('should handle empty string type', () => {
      const component = blockRegistry.getComponent('');
      expect(component).toBeDefined(); // Should fallback
    });

    it('should not throw on async errors', async () => {
      await expect(
        blockRegistry.getComponentAsync('definitely-does-not-exist-xyz-123')
      ).resolves.not.toThrow();
    });
  });
});
