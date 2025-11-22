/**
 * 🧪 ADAPTERS TESTS - Wave 3
 * 
 * Testes para os adaptadores de blocos legados.
 * 
 * @version 1.0.0
 * @wave 3
 */

import { describe, it, expect } from 'vitest';
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
        type: 'intro-hero', // alias
        properties: {
          title: 'Test Title',
          logoUrl: 'https://example.com/logo.png',
        },
        order: 1,
      };

      const adapted = adaptLegacyBlock(legacyBlock);
      
      expect(adapted.id).toBe('legacy-1');
      expect(adapted.type).toBe('intro-logo-header'); // resolved
      expect(adapted.order).toBe(1);
      expect(adapted.properties.title).toBe('Test Title');
    });

    it('should handle missing properties with defaults', () => {
      const legacyBlock = {
        id: 'legacy-2',
        type: 'intro-title',
        properties: {},
        order: 1,
      };

      const adapted = adaptLegacyBlock(legacyBlock);
      
      expect(adapted.properties.text).toBeDefined();
      expect(adapted.properties.level).toBeDefined();
    });

    it('should adapt blocks with children', () => {
      const legacyBlock = {
        id: 'parent',
        type: 'intro-logo-header',
        properties: {},
        order: 1,
        children: [
          {
            id: 'child-1',
            type: 'intro-title',
            properties: { text: 'Child Title' },
            order: 1,
          },
        ],
      };

      const adapted = adaptLegacyBlock(legacyBlock);
      
      expect(adapted.children).toBeDefined();
      expect(adapted.children!.length).toBe(1);
      expect(adapted.children![0].id).toBe('child-1');
    });

    it('should throw error for invalid input', () => {
      expect(() => adaptLegacyBlock(null)).toThrow();
      expect(() => adaptLegacyBlock(undefined)).toThrow();
      expect(() => adaptLegacyBlock('string' as any)).toThrow();
    });
  });

  describe('adaptLegacyBlocks', () => {
    it('should adapt array of blocks', () => {
      const legacyBlocks = [
        { id: '1', type: 'intro-title', properties: {}, order: 1 },
        { id: '2', type: 'intro-description', properties: {}, order: 2 },
      ];

      const adapted = adaptLegacyBlocks(legacyBlocks);
      
      expect(adapted.length).toBe(2);
      expect(adapted[0].id).toBe('1');
      expect(adapted[1].id).toBe('2');
    });

    it('should handle empty array', () => {
      const adapted = adaptLegacyBlocks([]);
      expect(adapted.length).toBe(0);
    });

    it('should create fallback for invalid blocks', () => {
      const legacyBlocks = [
        { id: '1', type: 'intro-title', properties: {}, order: 1 },
        null, // invalid
        { id: '3', type: 'intro-description', properties: {}, order: 3 },
      ];

      const adapted = adaptLegacyBlocks(legacyBlocks as any);
      
      expect(adapted.length).toBe(3);
      expect(adapted[1].type).toBe('text'); // fallback
    });
  });

  describe('isValidBlockInstance', () => {
    it('should return true for valid instance', () => {
      const instance: BlockInstance = {
        id: 'test-1',
        type: 'intro-title',
        properties: {},
        order: 1,
      };

      expect(isValidBlockInstance(instance)).toBe(true);
    });

    it('should return false for invalid instances', () => {
      expect(isValidBlockInstance(null)).toBe(false);
      expect(isValidBlockInstance({})).toBe(false);
      expect(isValidBlockInstance({ id: '1' })).toBe(false);
      expect(isValidBlockInstance({ id: '1', type: 'test' })).toBe(false);
    });
  });

  describe('normalizeBlockInstance', () => {
    it('should normalize instance with alias', () => {
      const instance: BlockInstance = {
        id: 'test-1',
        type: 'intro-hero', // alias
        properties: {},
        order: 1,
      };

      const normalized = normalizeBlockInstance(instance);
      
      expect(normalized.type).toBe('intro-logo-header'); // resolved
    });

    it('should apply default properties', () => {
      const instance: BlockInstance = {
        id: 'test-1',
        type: 'intro-title',
        properties: {},
        order: 1,
      };

      const normalized = normalizeBlockInstance(instance);
      
      expect(normalized.properties.text).toBeDefined();
      expect(normalized.properties.level).toBeDefined();
    });

    it('should normalize children recursively', () => {
      const instance: BlockInstance = {
        id: 'parent',
        type: 'intro-logo-header',
        properties: {},
        order: 1,
        children: [
          {
            id: 'child',
            type: 'intro-hero', // alias
            properties: {},
            order: 1,
          },
        ],
      };

      const normalized = normalizeBlockInstance(instance);
      
      expect(normalized.children![0].type).toBe('intro-logo-header');
    });
  });

  describe('cloneBlockInstance', () => {
    it('should create deep clone with new ID', () => {
      const instance: BlockInstance = {
        id: 'original',
        type: 'intro-title',
        properties: { text: 'Original' },
        order: 1,
      };

      const cloned = cloneBlockInstance(instance);
      
      expect(cloned.id).not.toBe(instance.id);
      expect(cloned.id).toContain('clone');
      expect(cloned.type).toBe(instance.type);
      expect(cloned.properties.text).toBe('Original');
      
      // Verify deep clone
      cloned.properties.text = 'Modified';
      expect(instance.properties.text).toBe('Original');
    });

    it('should clone children', () => {
      const instance: BlockInstance = {
        id: 'parent',
        type: 'intro-logo-header',
        properties: {},
        order: 1,
        children: [
          {
            id: 'child',
            type: 'intro-title',
            properties: {},
            order: 1,
          },
        ],
      };

      const cloned = cloneBlockInstance(instance);
      
      expect(cloned.children).toBeDefined();
      expect(cloned.children!.length).toBe(1);
      expect(cloned.children![0].id).not.toBe('child');
      expect(cloned.children![0].id).toContain('clone');
    });
  });
});
