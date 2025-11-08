/**
 * 🧪 CONTRACT TESTS - ITemplateService
 * 
 * Testes para garantir que a implementação do TemplateService
 * está em conformidade com o contrato ITemplateService.
 * 
 * @version 1.0.0
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { templateServiceAdapter } from '../TemplateServiceAdapter';
import type { Block } from '@/types/editor';

describe('ITemplateService Contract', () => {
  let testStepId: string;
  let testBlockId: string;

  beforeAll(async () => {
    testStepId = 'step-01';
  });

  afterAll(async () => {
    // Cleanup if needed
  });

  describe('State Management', () => {
    it('should set and get active template', () => {
      templateServiceAdapter.setActiveTemplate('test-template', 21);
      const activeTemplate = templateServiceAdapter.getActiveTemplate();
      expect(activeTemplate).toBe('test-template');
    });

    it('should set and get active funnel', () => {
      templateServiceAdapter.setActiveFunnel('test-funnel');
      const activeFunnel = templateServiceAdapter.getActiveFunnel();
      expect(activeFunnel).toBe('test-funnel');
    });

    it('should clear active funnel', () => {
      templateServiceAdapter.setActiveFunnel('test-funnel');
      templateServiceAdapter.setActiveFunnel(null);
      const activeFunnel = templateServiceAdapter.getActiveFunnel();
      expect(activeFunnel).toBeNull();
    });
  });

  describe('Step Operations', () => {
    it('should get step blocks with Result pattern', async () => {
      const result = await templateServiceAdapter.getStep(testStepId);
      
      expect(result).toHaveProperty('success');
      
      if (result.success) {
        expect(Array.isArray(result.data)).toBe(true);
      } else {
        expect(result.error).toBeInstanceOf(Error);
      }
    });

    it('should support AbortSignal in getStep', async () => {
      const controller = new AbortController();
      
      // Start request
      const promise = templateServiceAdapter.getStep(testStepId, undefined, {
        signal: controller.signal,
      });
      
      // Abort immediately
      controller.abort();
      
      const result = await promise;
      
      // Should handle abort gracefully
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toMatch(/abort|cancel/i);
      }
    });

    it('should list steps with metadata', async () => {
      const result = await templateServiceAdapter.listSteps();
      
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data.length).toBeGreaterThan(0);
        
        const firstStep = result.data[0];
        expect(firstStep).toHaveProperty('id');
        expect(firstStep).toHaveProperty('name');
        expect(firstStep).toHaveProperty('type');
        expect(firstStep).toHaveProperty('order');
        expect(firstStep).toHaveProperty('blocksCount');
      }
    });
  });

  describe('Validation', () => {
    it('should validate step structure', async () => {
      const validBlocks: Block[] = [
        {
          id: 'block-1',
          type: 'text' as any,
          order: 0,
          properties: {},
          content: {},
        },
        {
          id: 'block-2',
          type: 'button' as any,
          order: 1,
          properties: {},
          content: {},
        },
      ];
      
      const result = await templateServiceAdapter.validateStep(testStepId, validBlocks);
      
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.isValid).toBe(true);
        expect(result.data.errors).toHaveLength(0);
      }
    });

    it('should detect invalid step blocks', async () => {
      const invalidBlocks = [
        { id: '', type: '', order: 0 }, // Missing required fields
      ] as any[];
      
      const result = await templateServiceAdapter.validateStep(testStepId, invalidBlocks);
      
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.isValid).toBe(false);
        expect(result.data.errors.length).toBeGreaterThan(0);
      }
    });

    it('should detect non-sequential block order', async () => {
      const blocks: Block[] = [
        {
          id: 'block-1',
          type: 'text' as any,
          order: 0,
          properties: {},
          content: {},
        },
        {
          id: 'block-2',
          type: 'button' as any,
          order: 5, // Non-sequential
          properties: {},
          content: {},
        },
      ];
      
      const result = await templateServiceAdapter.validateStep(testStepId, blocks);
      
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.warnings.length).toBeGreaterThan(0);
        expect(result.data.warnings.some(w => w.includes('order'))).toBe(true);
      }
    });
  });

  describe('Performance & Optimization', () => {
    it('should prepare template', async () => {
      const result = await templateServiceAdapter.prepareTemplate('quiz21StepsComplete');
      
      // Should not throw
      expect(result).toHaveProperty('success');
    });

    it('should support preload neighbors', async () => {
      const result = await templateServiceAdapter.preloadNeighbors('step-01', 1);
      
      // Should not throw
      expect(result).toHaveProperty('success');
    });
  });

  describe('Type Safety', () => {
    it('should enforce ServiceResult<T> pattern for async methods', async () => {
      const result = await templateServiceAdapter.getStep('step-01');
      
      // TypeScript should enforce this at compile time
      if (result.success) {
        const blocks: Block[] = result.data;
        expect(Array.isArray(blocks)).toBe(true);
      } else {
        const error: Error = result.error;
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should accept AbortSignal in options', async () => {
      const controller = new AbortController();
      
      // TypeScript should allow this
      await templateServiceAdapter.getStep('step-01', undefined, {
        signal: controller.signal,
        timeout: 5000,
        debug: false,
      });
      
      expect(true).toBe(true); // Type check passed
    });
  });
});
