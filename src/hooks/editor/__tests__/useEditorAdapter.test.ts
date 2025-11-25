/**
 * 🧪 TESTES - useEditorAdapter Hook
 *
 * Testa o hook canônico de adaptação do editor.
 * Cobre:
 * - Interface padronizada state/actions
 * - deleteBlock com ponte para removeBlock legado
 * - Duplicação de blocos
 * - Seleção de blocos
 * 
 * @see Fase 2 - Unificar contextos e ações de bloco
 * @see Fase 7 - Testes e hardening
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

// Mock do EditorContext
const mockEditorContext = {
  currentStep: 1,
  selectedBlockId: 'block-1',
  isPreviewing: false,
  isLoading: false,
  state: {
    blocks: [
      { id: 'block-1', type: 'header', properties: { title: 'Test' }, content: {}, order: 0 },
      { id: 'block-2', type: 'text', properties: { text: 'Hello' }, content: {}, order: 1 },
    ],
  },
  actions: {
    addBlock: vi.fn(),
    updateBlock: vi.fn(),
    deleteBlock: vi.fn(),
    removeBlock: vi.fn(),
    setSelectedBlockId: vi.fn(),
    save: vi.fn(),
    setCurrentStep: vi.fn(),
  },
};

// Mock do módulo useEditor
vi.mock('@/contexts/editor/EditorContext', () => ({
  useEditor: () => mockEditorContext,
}));

// Mock do appLogger
vi.mock('@/lib/utils/appLogger', () => ({
  appLogger: {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock do uuid
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid-1234',
}));

// Import após mocks
import { useEditorAdapter } from '@/hooks/editor/useEditorAdapter';

describe('useEditorAdapter - Interface Padronizada', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('State', () => {
    it('deve expor currentStep do contexto', () => {
      const { result } = renderHook(() => useEditorAdapter());
      expect(result.current.currentStep).toBe(1);
    });

    it('deve expor selectedBlockId do contexto', () => {
      const { result } = renderHook(() => useEditorAdapter());
      expect(result.current.selectedBlockId).toBe('block-1');
    });

    it('deve derivar selectedBlock dos blocks', () => {
      const { result } = renderHook(() => useEditorAdapter());
      expect(result.current.selectedBlock).toEqual({
        id: 'block-1',
        type: 'header',
        properties: { title: 'Test' },
        content: {},
        order: 0,
      });
    });

    it('deve retornar null para selectedBlock quando não há seleção', () => {
      mockEditorContext.selectedBlockId = null;
      const { result } = renderHook(() => useEditorAdapter());
      expect(result.current.selectedBlock).toBeNull();
      mockEditorContext.selectedBlockId = 'block-1'; // Reset
    });

    it('deve expor array de blocks', () => {
      const { result } = renderHook(() => useEditorAdapter());
      expect(result.current.blocks).toHaveLength(2);
      expect(result.current.blocks[0].id).toBe('block-1');
    });

    it('deve expor isPreviewing e isLoading', () => {
      const { result } = renderHook(() => useEditorAdapter());
      expect(result.current.isPreviewing).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Actions - deleteBlock', () => {
    it('deve chamar deleteBlock do contexto quando disponível', async () => {
      const { result } = renderHook(() => useEditorAdapter());

      await act(async () => {
        await result.current.actions.deleteBlock('block-1');
      });

      expect(mockEditorContext.actions.deleteBlock).toHaveBeenCalledWith('block-1');
    });

    it('deve fazer fallback para removeBlock quando deleteBlock falha', async () => {
      // Simular deleteBlock que falha
      mockEditorContext.actions.deleteBlock.mockRejectedValueOnce(new Error('Failed'));

      const { result } = renderHook(() => useEditorAdapter());

      await act(async () => {
        await result.current.actions.deleteBlock('block-2');
      });

      // Deve ter tentado removeBlock como fallback
      expect(mockEditorContext.actions.removeBlock).toHaveBeenCalled();
    });

    it('removeBlock deve ser alias para deleteBlock', async () => {
      const { result } = renderHook(() => useEditorAdapter());

      await act(async () => {
        await result.current.actions.removeBlock('block-1');
      });

      // Deve chamar a mesma função
      expect(mockEditorContext.actions.deleteBlock).toHaveBeenCalledWith('block-1');
    });
  });

  describe('Actions - duplicateBlock', () => {
    it('deve criar cópia do bloco com novo ID', async () => {
      mockEditorContext.actions.addBlock.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useEditorAdapter());

      let newId: string | undefined;
      await act(async () => {
        newId = await result.current.actions.duplicateBlock?.('block-1');
      });

      expect(newId).toBe('mock-uuid-1234');
      expect(mockEditorContext.actions.addBlock).toHaveBeenCalled();
    });

    it('deve retornar undefined quando bloco não existe', async () => {
      const { result } = renderHook(() => useEditorAdapter());

      let newId: string | undefined;
      await act(async () => {
        newId = await result.current.actions.duplicateBlock?.('non-existent-block');
      });

      expect(newId).toBeUndefined();
    });
  });

  describe('Actions - selectBlock', () => {
    it('deve chamar setSelectedBlockId do contexto', () => {
      const { result } = renderHook(() => useEditorAdapter());

      act(() => {
        result.current.actions.selectBlock('block-2');
      });

      expect(mockEditorContext.actions.setSelectedBlockId).toHaveBeenCalledWith('block-2');
    });

    it('deve aceitar null para limpar seleção', () => {
      const { result } = renderHook(() => useEditorAdapter());

      act(() => {
        result.current.actions.selectBlock(null);
      });

      expect(mockEditorContext.actions.setSelectedBlockId).toHaveBeenCalledWith(null);
    });
  });

  describe('Actions - save', () => {
    it('deve chamar save do contexto', async () => {
      mockEditorContext.actions.save.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useEditorAdapter());

      await act(async () => {
        await result.current.actions.save();
      });

      expect(mockEditorContext.actions.save).toHaveBeenCalled();
    });
  });

  describe('Actions - setCurrentStep', () => {
    it('deve chamar setCurrentStep do contexto', () => {
      const { result } = renderHook(() => useEditorAdapter());

      act(() => {
        result.current.actions.setCurrentStep(5);
      });

      expect(mockEditorContext.actions.setCurrentStep).toHaveBeenCalledWith(5);
    });
  });
});

describe('useEditorAdapter - Fallbacks e Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar valores default quando contexto está incompleto', () => {
    // Simular contexto parcialmente disponível
    const incompleteContext = {
      currentStep: undefined,
      selectedBlockId: undefined,
      state: { blocks: undefined },
      actions: {},
    };

    vi.doMock('@/contexts/editor/EditorContext', () => ({
      useEditor: () => incompleteContext,
    }));

    const { result } = renderHook(() => useEditorAdapter());

    // Deve ter valores default seguros
    expect(result.current.currentStep).toBe(1);
    expect(result.current.selectedBlockId).toBeNull();
    expect(result.current.blocks).toEqual([]);
  });
});
