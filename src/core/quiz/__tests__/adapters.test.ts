/**
 * 🧪 ADAPTERS TESTS - Wave 3
 * 
 * Testes para os adaptadores de blocos legados.
 * 
 * @version 1.0.0
 * @wave 3
 */

import { describe, it, expect, vi } from 'vitest';

// Mock appLogger antes de importar adapters
vi.mock('@/lib/utils/appLogger', () => ({
  appLogger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  }
}));

import {
  adaptLegacyBlock,
  adaptLegacyBlocks,
  isValidBlockInstance,
  normalizeBlockInstance,
  cloneBlockInstance,
} from '../blocks/adapters';
import type { BlockInstance } from '../blocks/types';

describe('Block Adapters', () => {
  describe('adaptLegacyBlock', () => {
    it('should adapt simple legacy block', () => {
      const legacyBlock = {
        id: 'legacy-1',
        type: 'intro-logo',
        properties: {
          width: 200,
        },
        content: {
          src: 'https://example.com/logo.png',
          alt: 'Logo',
        },
        order: 1,
      };

      const adapted = adaptLegacyBlock(legacyBlock as any);
      
      expect(adapted.id).toBe('legacy-1');
      expect(adapted.type).toBe('intro-logo');
      expect(adapted.order).toBe(1);
      expect(adapted.properties?.src ?? adapted.content?.src).toBe('https://example.com/logo.png');
    });

    it('should handle missing properties with defaults', () => {
      const legacyBlock = {
        id: 'legacy-2',
        type: 'intro-title',
        properties: {},
        content: {},
        order: 1,
      };

      const adapted = adaptLegacyBlock(legacyBlock as any);
      
      expect(adapted.properties?.text ?? adapted.content?.text).toBeDefined();
      expect(adapted.properties?.level ?? adapted.content?.level).toBeDefined();
    });

    it('should adapt blocks without children property', () => {
      const legacyBlock = {
        id: 'parent',
        type: 'intro-logo-header',
        properties: {},
        content: {},
        order: 1,
      };

      const adapted = adaptLegacyBlock(legacyBlock as any);
      
      expect(adapted.id).toBe('parent');
      expect(adapted.type).toBe('intro-logo-header');
    });

    it('should handle null and undefined gracefully', () => {
      // These now return default blocks instead of throwing
      const nullResult = adaptLegacyBlock(null as any, 0);
      const undefinedResult = adaptLegacyBlock(undefined as any, 0);
      
      expect(nullResult).toBeDefined();
      expect(undefinedResult).toBeDefined();
    });
  });

  describe('adaptLegacyBlocks', () => {
    it('should adapt array of blocks', () => {
      const legacyBlocks = [
        { id: '1', type: 'intro-title', properties: {}, content: {}, order: 1 },
        { id: '2', type: 'intro-description', properties: {}, content: {}, order: 2 },
      ];

      const adapted = adaptLegacyBlocks(legacyBlocks as any);
      
      expect(adapted.length).toBe(2);
      expect(adapted[0].id).toBe('1');
      expect(adapted[1].id).toBe('2');
    });

    it('should handle empty array', () => {
      const adapted = adaptLegacyBlocks([]);
      expect(adapted.length).toBe(0);
    });

    it('should handle invalid blocks', () => {
      const legacyBlocks = [
        { id: '1', type: 'intro-title', properties: {}, content: {}, order: 1 },
        null, // invalid
        { id: '3', type: 'intro-description', properties: {}, content: {}, order: 3 },
      ];

      const adapted = adaptLegacyBlocks(legacyBlocks as any);
      
      // Should skip null and process valid blocks
      expect(adapted.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('isValidBlockInstance', () => {
    it('should return true for valid block', () => {
      const block = {
        id: 'test-1',
        type: 'intro-title',
        properties: {},
        content: {},
        order: 1,
      };

      expect(isValidBlockInstance(block)).toBe(true);
    });

    it('should return false for invalid instances', () => {
      expect(isValidBlockInstance(null)).toBe(false);
      expect(isValidBlockInstance({})).toBe(false);
      expect(isValidBlockInstance({ id: '1' })).toBe(false);
      expect(isValidBlockInstance({ id: '1', type: 'test' })).toBe(false);
    });
  });

  describe('normalizeBlockInstance', () => {
    it('should normalize block with proper structure', () => {
      const block = {
        id: 'test-1',
        type: 'intro-title',
        properties: {},
        content: {},
        order: 1,
      };

      const normalized = normalizeBlockInstance(block as any, 0);
      
      expect(normalized.id).toBe('test-1');
      expect(normalized.type).toBeDefined();
    });

    it('should apply default properties', () => {
      const block = {
        id: 'test-1',
        type: 'intro-title',
        properties: {},
        content: {},
        order: 1,
      };

      const normalized = normalizeBlockInstance(block as any, 0);
      
      expect(normalized.properties?.text ?? normalized.content?.text).toBeDefined();
      expect(normalized.properties?.level ?? normalized.content?.level).toBeDefined();
    });
  });

  describe('cloneBlockInstance', () => {
    it('should create deep clone', () => {
      const block = {
        id: 'original',
        type: 'intro-title',
        properties: { text: 'Original' },
        content: {},
        order: 1,
      };

      const cloned = cloneBlockInstance(block as any);
      
      expect(cloned.id).toBe(block.id);
      expect(cloned.type).toBe(block.type);
      expect(cloned.properties.text).toBe('Original');
      
      // Verify deep clone
      (cloned as any).properties.text = 'Modified';
      expect(block.properties.text).toBe('Original');
    });
  });
});
