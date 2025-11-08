/**
 * Testes de validação de templates
 * Validação pura de lógica sem dependências de DOM
 */

import { describe, it, expect, vi } from 'vitest';

// Mock do appLogger para evitar dependências
vi.mock('@/lib/appLogger', () => ({
  appLogger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));
import {
  validateTemplate,
  validateAndNormalizeTemplate,
  normalizeId,
  normalizeTemplateIds,
  formatValidationErrors,
} from '../normalize';
import { isValidUUID, isLegacyId } from '../templateV3Schema';

describe('templateV3Schema validation', () => {
  describe('validateTemplate', () => {
    it('deve validar template v3 válido', () => {
      const validTemplate = {
        metadata: {
          name: 'Test Template',
          version: '3.0.0',
          description: 'Template de teste',
        },
        steps: {
          'step-1': [
            {
              id: 'block-123e4567-e89b-12d3-a456-426614174000',
              type: 'text',
              order: 0,
              content: {
                text: 'Hello World',
              },
              properties: {},
            },
          ],
        },
      };

      const result = validateTemplate(validTemplate);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.metadata.name).toBe('Test Template');
        expect(result.data.steps['step-1']).toHaveLength(1);
      }
    });

    it('deve rejeitar template sem metadata.name', () => {
      const invalidTemplate = {
        metadata: {
          version: '3.0.0',
        },
        steps: {},
      };

      const result = validateTemplate(invalidTemplate);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors[0].path).toContain('metadata');
      }
    });

    it('deve rejeitar template sem metadata.version', () => {
      const invalidTemplate = {
        metadata: {
          name: 'Test',
        },
        steps: {},
      };

      const result = validateTemplate(invalidTemplate);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar block sem id', () => {
      const invalidTemplate = {
        metadata: {
          name: 'Test',
          version: '3.0.0',
        },
        steps: {
          'step-1': [
            {
              type: 'text',
              order: 0,
              content: {},
              properties: {},
            },
          ],
        },
      };

      const result = validateTemplate(invalidTemplate);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar block sem type', () => {
      const invalidTemplate = {
        metadata: {
          name: 'Test',
          version: '3.0.0',
        },
        steps: {
          'step-1': [
            {
              id: 'block-1',
              order: 0,
              content: {},
              properties: {},
            },
          ],
        },
      };

      const result = validateTemplate(invalidTemplate);
      expect(result.success).toBe(false);
    });

    it('deve detectar IDs legados e emitir warnings', () => {
      const templateWithLegacyIds = {
        metadata: {
          name: 'Legacy Template',
          version: '3.0.0',
        },
        steps: {
          'step-1': [
            {
              id: 'block-1234567890',
              type: 'text',
              order: 0,
              content: {
                text: 'Old ID',
              },
              properties: {},
            },
          ],
        },
      };

      const result = validateTemplate(templateWithLegacyIds);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.warnings).toBeDefined();
        expect(result.warnings!.length).toBeGreaterThan(0);
        expect(result.warnings![0]).toContain('formato legado');
      }
    });
  });

  describe('normalizeId', () => {
    it('deve manter UUID v4 válido', () => {
      const validUuid = 'block-550e8400-e29b-41d4-a716-446655440000';
      const result = normalizeId(validUuid);
      expect(result).toBe(validUuid);
    });

    it('deve substituir ID legado por UUID mantendo prefixo', () => {
      const legacyId = 'block-1234567890';
      const result = normalizeId(legacyId);
      
      expect(result).toMatch(/^block-/);
      expect(result).not.toBe(legacyId);
      expect(isValidUUID(result.replace('block-', ''))).toBe(true);
    });

    it('deve preservar step-N sem normalizar', () => {
      const stepId = 'step-1';
      const result = normalizeId(stepId);
      // step-N é formato legado válido, mas deve ser preservado
      expect(result).toBe(stepId);
    });

    it('deve adicionar prefixo block- se não houver prefixo', () => {
      const noPrefixId = '1234567890';
      const result = normalizeId(noPrefixId);
      
      expect(result).toMatch(/^block-/);
      expect(isValidUUID(result.replace('block-', ''))).toBe(true);
    });

    it('deve normalizar custom-DATE.now() para custom-UUID', () => {
      const customLegacyId = 'custom-9876543210';
      const result = normalizeId(customLegacyId);
      
      expect(result).toMatch(/^custom-/);
      expect(isValidUUID(result.replace('custom-', ''))).toBe(true);
    });
  });

  describe('normalizeTemplateIds', () => {
    it('deve normalizar todos os IDs legados em um template', () => {
      const templateWithLegacyIds = {
        metadata: {
          name: 'Legacy Template',
          version: '3.0.0',
        },
        steps: {
          'step-1': [
            {
              id: 'block-1111',
              type: 'text',
              order: 0,
              content: {
                text: 'Block 1',
              },
              properties: {},
            },
            {
              id: 'block-2222',
              type: 'button',
              order: 1,
              content: {
                buttonText: 'Click me',
                options: [
                  { id: 'option-3333', text: 'Option A' },
                  { id: 'option-4444', text: 'Option B' },
                ],
              },
              properties: {},
            },
          ],
          'step-2': [
            {
              id: 'block-5555',
              type: 'heading',
              order: 0,
              content: {
                title: 'Title',
              },
              properties: {},
            },
          ],
        },
      };

      const normalized = normalizeTemplateIds(templateWithLegacyIds);

      // Check step-1 blocks
      expect(normalized.steps['step-1']).toHaveLength(2);
      expect(normalized.steps['step-1'][0].id).toMatch(/^block-/);
      expect(isValidUUID(normalized.steps['step-1'][0].id.replace('block-', ''))).toBe(true);
      
      // Check options normalized
      const optionsBlock = normalized.steps['step-1'][1];
      expect(optionsBlock.content.options).toHaveLength(2);
      expect(optionsBlock.content.options![0].id).toMatch(/^option-/);
      expect(isValidUUID(optionsBlock.content.options![0].id.replace('option-', ''))).toBe(true);

      // Check step-2 blocks
      expect(normalized.steps['step-2']).toHaveLength(1);
      expect(isValidUUID(normalized.steps['step-2'][0].id.replace('block-', ''))).toBe(true);
    });

    it('não deve alterar IDs já válidos (UUID v4)', () => {
      const templateWithValidUuids = {
        metadata: {
          name: 'Valid UUID Template',
          version: '3.0.0',
        },
        steps: {
          'step-1': [
            {
              id: 'block-550e8400-e29b-41d4-a716-446655440000',
              type: 'text',
              order: 0,
              content: { text: 'Test' },
              properties: {},
            },
          ],
        },
      };

      const normalized = normalizeTemplateIds(templateWithValidUuids);
      
      expect(normalized.steps['step-1'][0].id).toBe('block-550e8400-e29b-41d4-a716-446655440000');
    });
  });

  describe('validateAndNormalizeTemplate', () => {
    it('deve validar e normalizar template em uma única operação', () => {
      const templateWithLegacyIds = {
        metadata: {
          name: 'Combined Test',
          version: '3.0.0',
        },
        steps: {
          'step-1': [
            {
              id: 'block-12345',
              type: 'text',
              order: 0,
              content: { text: 'Hello' },
              properties: {},
            },
          ],
        },
      };

      const result = validateAndNormalizeTemplate(templateWithLegacyIds);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.warnings).toBeDefined();
        expect(result.warnings!.length).toBeGreaterThan(0);
        
        const normalizedBlock = result.data.steps['step-1'][0];
        expect(normalizedBlock.id).toMatch(/^block-/);
        expect(isValidUUID(normalizedBlock.id.replace('block-', ''))).toBe(true);
      }
    });

    it('deve rejeitar template inválido antes de normalizar', () => {
      const invalidTemplate = {
        metadata: {
          // faltando name e version
        },
        steps: {},
      };

      const result = validateAndNormalizeTemplate(invalidTemplate);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });
  });

  describe('formatValidationErrors', () => {
    it('deve formatar erros de validação para exibição', () => {
      const mockError = {
        success: false as const,
        errors: [
          { path: ['metadata', 'name'], message: 'Required', code: 'invalid_type' },
          { path: ['steps'], message: 'Expected object', code: 'invalid_type' },
        ],
        rawError: {} as any,
      };

      const formatted = formatValidationErrors(mockError);
      
      expect(formatted).toContain('❌');
      expect(formatted).toContain('metadata.name');
      expect(formatted).toContain('Required');
      expect(formatted).toContain('steps');
    });
  });

  describe('isValidUUID helper', () => {
    it('deve aceitar UUID v4 válido', () => {
      // UUIDs v4 válidos (terceiro grupo começa com '4')
      expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(isValidUUID('9f2495e8-6420-4cb9-84a9-920bda36d019')).toBe(true);
    });

    it('deve rejeitar UUIDs inválidos', () => {
      expect(isValidUUID('not-a-uuid')).toBe(false);
      expect(isValidUUID('12345678-1234-1234-1234-123456789012')).toBe(false); // not v4
      expect(isValidUUID('1234567890')).toBe(false);
      expect(isValidUUID('')).toBe(false);
    });
  });

  describe('isLegacyId helper', () => {
    it('deve identificar IDs legados', () => {
      expect(isLegacyId('block-1234567890')).toBe(true);
      expect(isLegacyId('custom-9876543210')).toBe(true);
      expect(isLegacyId('option-111111')).toBe(true);
      expect(isLegacyId('step-1')).toBe(true);
    });

    it('não deve aceitar IDs não-legados', () => {
      expect(isLegacyId('block-123e4567-e89b-12d3-a456-426614174000')).toBe(false);
      expect(isLegacyId('invalid-id')).toBe(false);
      expect(isLegacyId('123456')).toBe(false);
    });
  });
});
