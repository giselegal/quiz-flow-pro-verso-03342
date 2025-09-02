import { Block } from '@/types/editor';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  copyToClipboard,
  createBlockFromComponent,
  duplicateBlock,
  generateBlockId,
  validateEditorJSON,
} from '../editorUtils';

// Mock do nanoid
vi.mock('nanoid', () => ({
  nanoid: vi.fn(() => 'mock-id-12345678'),
}));

describe('editorUtils', () => {
  describe('generateBlockId', () => {
    it('deve gerar um ID consistente', () => {
      const id = generateBlockId('text');
      expect(id).toBe('block-text-mock-id-12345678');
    });
  });

  describe('createBlockFromComponent', () => {
    it('deve criar um bloco com ordem correta', () => {
      const existingBlocks: Block[] = [
        { id: '1', type: 'text', order: 1, content: {}, properties: {} },
        { id: '2', type: 'button', order: 2, content: {}, properties: {} },
      ];

      const newBlock = createBlockFromComponent('form-container', existingBlocks);

      expect(newBlock).toMatchObject({
        id: 'block-form-container-mock-id-12345678',
        type: 'form-container',
        order: 3,
        content: {},
      });
      // Deve aplicar defaults vindos do registry
      expect(newBlock.properties).toMatchObject({
        title: 'Fale com a gente',
        description: 'Preencha seus dados',
        submitText: 'Enviar',
      });
    });

    it('deve funcionar com array vazio', () => {
      const newBlock = createBlockFromComponent('text', []);

      expect(newBlock.order).toBe(1);
    });
  });

  describe('duplicateBlock', () => {
    it('deve duplicar um bloco com novo ID e ordem', () => {
      const originalBlock: Block = {
        id: 'original-id',
        type: 'text',
        order: 1,
        content: { title: 'Original' },
        properties: { color: 'blue' },
      };

      const existingBlocks: Block[] = [originalBlock];
      const duplicatedBlock = duplicateBlock(originalBlock, existingBlocks);

      expect(duplicatedBlock).toEqual({
        id: 'block-text-copy-mock-id-12345678',
        type: 'text',
        order: 2,
        content: { title: 'Original' },
        properties: { color: 'blue' },
      });
    });
  });

  describe('validateEditorJSON', () => {
    it('deve validar JSON válido', () => {
      const validJSON = JSON.stringify({
        stepBlocks: {
          'step-1': [],
          'step-2': [],
        },
        currentStep: 1,
        selectedBlockId: null,
      });

      const result = validateEditorJSON(validJSON);
      expect(result.valid).toBe(true);
    });

    it('deve rejeitar JSON inválido', () => {
      const invalidJSON = '{ invalid json';
      const result = validateEditorJSON(invalidJSON);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('JSON inválido');
    });

    it('deve rejeitar estrutura inválida', () => {
      const invalidStructure = JSON.stringify({
        wrongProperty: 'value',
      });

      const result = validateEditorJSON(invalidStructure);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('JSON deve conter stepBlocks');
    });

    it('deve rejeitar currentStep inválido', () => {
      const invalidStep = JSON.stringify({
        stepBlocks: {},
        currentStep: -1,
      });

      const result = validateEditorJSON(invalidStep);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('currentStep deve ser um número positivo');
    });
  });

  describe('copyToClipboard', () => {
    beforeEach(() => {
      // Reset mocks
      vi.resetAllMocks();
    });

    it('deve usar navigator.clipboard quando disponível', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);

      // Mock navigator.clipboard
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
      });

      Object.defineProperty(window, 'isSecureContext', {
        value: true,
        writable: true,
      });

      const result = await copyToClipboard('test text');

      expect(mockWriteText).toHaveBeenCalledWith('test text');
      expect(result).toBe(true);
    });

    it('deve usar fallback quando clipboard não está disponível', async () => {
      // Mock navigator.clipboard como undefined
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
      });

      // Mock document methods
      const mockTextArea = {
        value: '',
        style: {},
        focus: vi.fn(),
        select: vi.fn(),
      };

      const mockCreateElement = vi.fn().mockReturnValue(mockTextArea);
      const mockAppendChild = vi.fn();
      const mockRemoveChild = vi.fn();
      const mockExecCommand = vi.fn().mockReturnValue(true);

      document.createElement = mockCreateElement;
      document.body.appendChild = mockAppendChild;
      document.body.removeChild = mockRemoveChild;
      document.execCommand = mockExecCommand;

      const result = await copyToClipboard('test text');

      expect(mockCreateElement).toHaveBeenCalledWith('textarea');
      expect(mockTextArea.value).toBe('test text');
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
      expect(result).toBe(true);
    });
  });
});
