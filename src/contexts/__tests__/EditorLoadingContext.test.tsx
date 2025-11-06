/**
 * 🧪 EDITOR LOADING CONTEXT - TESTES UNITÁRIOS
 * 
 * Testes para EditorLoadingContext criado no SPRINT 2 Fase 2
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react';
import {
  EditorLoadingProvider,
  useEditorLoading,
  useOptionalEditorLoading,
} from '../EditorLoadingContext';

describe('EditorLoadingContext', () => {
  describe('Provider', () => {
    it('deve inicializar com estados padrão', () => {
      const { result } = renderHook(() => useEditorLoading(), {
        wrapper: EditorLoadingProvider,
      });

      expect(result.current.isLoadingTemplate).toBe(false);
      expect(result.current.isLoadingStep).toBe(false);
      expect(result.current.loadingBlocks.size).toBe(0);
      expect(result.current.errors.size).toBe(0);
      expect(result.current.progress).toBe(100); // 100% quando nada está carregando
      expect(result.current.isAnyLoading).toBe(false);
      expect(result.current.hasErrors).toBe(false);
    });

    it('deve renderizar children corretamente', () => {
      const TestChild = () => <div>Test Child</div>;
      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <EditorLoadingProvider>
          <TestChild />
          {children}
        </EditorLoadingProvider>
      );

      const { result } = renderHook(() => useEditorLoading(), { wrapper: Wrapper });
      
      expect(result.current).toBeDefined();
    });
  });

  describe('useEditorLoading hook', () => {
    it('deve lançar erro quando usado fora do provider', () => {
      // Suprimir console.error para este teste
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useEditorLoading());
      }).toThrow('useEditorLoading deve ser usado dentro de EditorLoadingProvider');

      consoleSpy.mockRestore();
    });

    it('deve funcionar corretamente dentro do provider', () => {
      const { result } = renderHook(() => useEditorLoading(), {
        wrapper: EditorLoadingProvider,
      });

      expect(result.current).toBeDefined();
      expect(result.current.setTemplateLoading).toBeDefined();
      expect(result.current.setStepLoading).toBeDefined();
      expect(result.current.setBlockLoading).toBeDefined();
    });
  });

  describe('useOptionalEditorLoading hook', () => {
    it('deve retornar undefined quando usado fora do provider', () => {
      const { result } = renderHook(() => useOptionalEditorLoading());

      expect(result.current).toBeUndefined();
    });

    it('deve retornar contexto quando usado dentro do provider', () => {
      const { result } = renderHook(() => useOptionalEditorLoading(), {
        wrapper: EditorLoadingProvider,
      });

      expect(result.current).toBeDefined();
      expect(result.current?.setTemplateLoading).toBeDefined();
    });
  });

  describe('Template Loading', () => {
    it('deve atualizar isLoadingTemplate corretamente', () => {
      const { result } = renderHook(() => useEditorLoading(), {
        wrapper: EditorLoadingProvider,
      });

      expect(result.current.isLoadingTemplate).toBe(false);

      act(() => {
        result.current.setTemplateLoading(true);
      });

      expect(result.current.isLoadingTemplate).toBe(true);
      expect(result.current.isAnyLoading).toBe(true);

      act(() => {
        result.current.setTemplateLoading(false);
      });

      expect(result.current.isLoadingTemplate).toBe(false);
      expect(result.current.isAnyLoading).toBe(false);
    });

    it('deve calcular progresso corretamente com template loading', () => {
      const { result } = renderHook(() => useEditorLoading(), {
        wrapper: EditorLoadingProvider,
      });

      expect(result.current.progress).toBe(100);

      act(() => {
        result.current.setTemplateLoading(true);
      });

      expect(result.current.progress).toBe(67); // 2/3 completos
    });
  });

  describe('Step Loading', () => {
    it('deve atualizar isLoadingStep corretamente', () => {
      const { result } = renderHook(() => useEditorLoading(), {
        wrapper: EditorLoadingProvider,
      });

      expect(result.current.isLoadingStep).toBe(false);

      act(() => {
        result.current.setStepLoading(true);
      });

      expect(result.current.isLoadingStep).toBe(true);
      expect(result.current.isAnyLoading).toBe(true);

      act(() => {
        result.current.setStepLoading(false);
      });

      expect(result.current.isLoadingStep).toBe(false);
    });
  });

  describe('Block Loading', () => {
    it('deve adicionar e remover blocos do set de loading', () => {
      const { result } = renderHook(() => useEditorLoading(), {
        wrapper: EditorLoadingProvider,
      });

      expect(result.current.loadingBlocks.size).toBe(0);

      act(() => {
        result.current.setBlockLoading('block-1', true);
      });

      expect(result.current.loadingBlocks.size).toBe(1);
      expect(result.current.loadingBlocks.has('block-1')).toBe(true);
      expect(result.current.isAnyLoading).toBe(true);

      act(() => {
        result.current.setBlockLoading('block-2', true);
      });

      expect(result.current.loadingBlocks.size).toBe(2);

      act(() => {
        result.current.setBlockLoading('block-1', false);
      });

      expect(result.current.loadingBlocks.size).toBe(1);
      expect(result.current.loadingBlocks.has('block-1')).toBe(false);
      expect(result.current.loadingBlocks.has('block-2')).toBe(true);
    });

    it('deve usar getBlockLoadingState para verificar estado de bloco específico', () => {
      const { result } = renderHook(() => useEditorLoading(), {
        wrapper: EditorLoadingProvider,
      });

      act(() => {
        result.current.setBlockLoading('block-1', true);
      });

      expect(result.current.getBlockLoadingState('block-1')).toBe(true);
      expect(result.current.getBlockLoadingState('block-2')).toBe(false);
    });

    it('deve calcular progresso corretamente com blocos loading', () => {
      const { result } = renderHook(() => useEditorLoading(), {
        wrapper: EditorLoadingProvider,
      });

      expect(result.current.progress).toBe(100);

      act(() => {
        result.current.setBlockLoading('block-1', true);
      });

      expect(result.current.progress).toBe(67); // 2/3 completos
    });
  });

  describe('Error Management', () => {
    it('deve adicionar e remover erros', () => {
      const { result } = renderHook(() => useEditorLoading(), {
        wrapper: EditorLoadingProvider,
      });

      const testError = new Error('Test error');

      expect(result.current.errors.size).toBe(0);
      expect(result.current.hasErrors).toBe(false);

      act(() => {
        result.current.setError('template', testError);
      });

      expect(result.current.errors.size).toBe(1);
      expect(result.current.hasErrors).toBe(true);
      expect(result.current.getError('template')).toBe(testError);

      act(() => {
        result.current.setError('template', null);
      });

      expect(result.current.errors.size).toBe(0);
      expect(result.current.hasErrors).toBe(false);
    });

    it('deve limpar todos os erros', () => {
      const { result } = renderHook(() => useEditorLoading(), {
        wrapper: EditorLoadingProvider,
      });

      act(() => {
        result.current.setError('error1', new Error('Error 1'));
        result.current.setError('error2', new Error('Error 2'));
      });

      expect(result.current.errors.size).toBe(2);

      act(() => {
        result.current.clearErrors();
      });

      expect(result.current.errors.size).toBe(0);
      expect(result.current.hasErrors).toBe(false);
    });

    it('deve retornar undefined para erro não existente', () => {
      const { result } = renderHook(() => useEditorLoading(), {
        wrapper: EditorLoadingProvider,
      });

      expect(result.current.getError('non-existent')).toBeUndefined();
    });
  });

  describe('Progress Calculation', () => {
    it('deve calcular 100% quando nada está carregando', () => {
      const { result } = renderHook(() => useEditorLoading(), {
        wrapper: EditorLoadingProvider,
      });

      expect(result.current.progress).toBe(100);
    });

    it('deve calcular 0% quando tudo está carregando', () => {
      const { result } = renderHook(() => useEditorLoading(), {
        wrapper: EditorLoadingProvider,
      });

      act(() => {
        result.current.setTemplateLoading(true);
        result.current.setStepLoading(true);
        result.current.setBlockLoading('block-1', true);
      });

      expect(result.current.progress).toBe(0);
    });

    it('deve calcular 33% quando 1 de 3 está completo', () => {
      const { result } = renderHook(() => useEditorLoading(), {
        wrapper: EditorLoadingProvider,
      });

      act(() => {
        result.current.setTemplateLoading(true);
        result.current.setStepLoading(true);
        // blocks não loading (1/3 completo)
      });

      expect(result.current.progress).toBe(33);
    });

    it('deve calcular 67% quando 2 de 3 estão completos', () => {
      const { result } = renderHook(() => useEditorLoading(), {
        wrapper: EditorLoadingProvider,
      });

      act(() => {
        result.current.setTemplateLoading(true);
        // step não loading (2/3 completos)
        // blocks não loading
      });

      expect(result.current.progress).toBe(67);
    });
  });

  describe('isAnyLoading Helper', () => {
    it('deve retornar true quando qualquer estado está loading', () => {
      const { result } = renderHook(() => useEditorLoading(), {
        wrapper: EditorLoadingProvider,
      });

      expect(result.current.isAnyLoading).toBe(false);

      // Template loading
      act(() => {
        result.current.setTemplateLoading(true);
      });
      expect(result.current.isAnyLoading).toBe(true);

      act(() => {
        result.current.setTemplateLoading(false);
      });
      expect(result.current.isAnyLoading).toBe(false);

      // Step loading
      act(() => {
        result.current.setStepLoading(true);
      });
      expect(result.current.isAnyLoading).toBe(true);

      act(() => {
        result.current.setStepLoading(false);
      });
      expect(result.current.isAnyLoading).toBe(false);

      // Block loading
      act(() => {
        result.current.setBlockLoading('block-1', true);
      });
      expect(result.current.isAnyLoading).toBe(true);

      act(() => {
        result.current.setBlockLoading('block-1', false);
      });
      expect(result.current.isAnyLoading).toBe(false);
    });
  });

  describe('Multiple Consumers', () => {
    it('deve compartilhar estado entre múltiplos consumers', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <EditorLoadingProvider>{children}</EditorLoadingProvider>
      );

      const { result: result1 } = renderHook(() => useEditorLoading(), { wrapper });
      const { result: result2 } = renderHook(() => useEditorLoading(), { wrapper });

      act(() => {
        result1.current.setTemplateLoading(true);
      });

      // Ambos consumers veem a mudança
      expect(result1.current.isLoadingTemplate).toBe(true);
      expect(result2.current.isLoadingTemplate).toBe(true);
    });
  });
});
