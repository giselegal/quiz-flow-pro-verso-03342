/**
 * 🧪 BLOCK REGISTRY TESTS - Wave 3
 * 
 * Testes unitários para o BlockRegistry.
 * 
 * @version 1.0.0
 * @wave 3
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { BlockRegistry } from '../blocks/registry';
import type { BlockDefinition, BlockCategoryEnum } from '../blocks/types';

describe('BlockRegistry', () => {
  describe('getDefinition', () => {
    it('should return definition for registered block', () => {
      const definition = BlockRegistry.getDefinition('intro-logo-header');
      expect(definition).toBeDefined();
      expect(definition?.type).toBe('intro-logo-header');
      expect(definition?.name).toBe('Logo Header');
    });

    it('should return undefined for unregistered block', () => {
      const definition = BlockRegistry.getDefinition('non-existent-block');
      expect(definition).toBeUndefined();
    });

    it('should resolve aliases to official types', () => {
      const definition = BlockRegistry.getDefinition('intro-hero');
      expect(definition).toBeDefined();
      expect(definition?.type).toBe('intro-logo-header');
    });
  });

  describe('hasType', () => {
    it('should return true for registered types', () => {
      expect(BlockRegistry.hasType('intro-logo-header')).toBe(true);
      expect(BlockRegistry.hasType('question-progress')).toBe(true);
    });

    it('should return true for aliases', () => {
      expect(BlockRegistry.hasType('intro-hero')).toBe(true);
      expect(BlockRegistry.hasType('quiz-intro-header')).toBe(true);
    });

    it('should return false for unregistered types', () => {
      expect(BlockRegistry.hasType('non-existent')).toBe(false);
    });
  });

  describe('resolveType', () => {
    it('should resolve aliases to official types', () => {
      expect(BlockRegistry.resolveType('intro-hero')).toBe('intro-logo-header');
      expect(BlockRegistry.resolveType('hero-block')).toBe('intro-logo-header');
      expect(BlockRegistry.resolveType('welcome-form')).toBe('intro-form');
    });

    it('should return same type if no alias', () => {
      expect(BlockRegistry.resolveType('intro-logo-header')).toBe('intro-logo-header');
    });
  });

  describe('getAllTypes', () => {
    it('should return array of all registered types', () => {
      const types = BlockRegistry.getAllTypes();
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThan(0);
      expect(types).toContain('intro-logo-header');
      expect(types).toContain('question-progress');
    });
  });

  describe('getByCategory', () => {
    it('should return blocks from specific category', () => {
      const introBlocks = BlockRegistry.getByCategory('intro' as BlockCategoryEnum);
      expect(Array.isArray(introBlocks)).toBe(true);
      expect(introBlocks.length).toBeGreaterThan(0);
      introBlocks.forEach((block) => {
        expect(block.category).toBe('intro');
      });
    });

    it('should return empty array for non-existent category', () => {
      const blocks = BlockRegistry.getByCategory('non-existent' as any);
      expect(Array.isArray(blocks)).toBe(true);
      expect(blocks.length).toBe(0);
    });
  });

  describe('getAliases', () => {
    it('should return all aliases for an official type', () => {
      const aliases = BlockRegistry.getAliases('intro-logo-header');
      expect(Array.isArray(aliases)).toBe(true);
      expect(aliases.length).toBeGreaterThan(0);
      expect(aliases).toContain('intro-hero');
      expect(aliases).toContain('quiz-intro-header');
    });

    it('should return empty array for type without aliases', () => {
      const aliases = BlockRegistry.getAliases('result-score');
      expect(Array.isArray(aliases)).toBe(true);
    });
  });

  describe('Block Definitions', () => {
    it('should have valid structure for all registered blocks', () => {
      const types = BlockRegistry.getAllTypes();
      types.forEach((type) => {
        const definition = BlockRegistry.getDefinition(type);
        expect(definition).toBeDefined();
        expect(definition!.type).toBe(type);
        expect(definition!.name).toBeTruthy();
        expect(definition!.description).toBeTruthy();
        expect(definition!.category).toBeTruthy();
        expect(Array.isArray(definition!.properties)).toBe(true);
        expect(typeof definition!.defaultProperties).toBe('object');
      });
    });

    it('should have consistent default properties', () => {
      const definition = BlockRegistry.getDefinition('intro-logo-header');
      expect(definition).toBeDefined();
      
      // Verificar que defaultProperties inclui todas as keys das properties
      const propertyKeys = definition!.properties.map((p) => p.key);
      const defaultKeys = Object.keys(definition!.defaultProperties);
      
      propertyKeys.forEach((key) => {
        expect(defaultKeys).toContain(key);
      });
    });
  });
});
