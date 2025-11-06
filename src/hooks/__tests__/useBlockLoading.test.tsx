/**
 * 🧪 USE BLOCK LOADING - TESTES UNITÁRIOS
 * 
 * Testes para useBlockLoading criado no SPRINT 2 Fase 2
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useBlockLoading, useSingleBlockLoading } from '../useBlockLoading';
import { EditorLoadingProvider } from '@/contexts/EditorLoadingContext';

describe('useBlockLoading', () => {
  describe('Standalone (sem EditorLoadingProvider)', () => {
    it('deve funcionar sem provider', () => {
      const { result } = renderHook(() => useBlockLoading());

      expect(result.current).toBeDefined();
      expect(result.current.loadingBlocks.size).toBe(0);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.progress).toBe(100);
    });

    it('deve gerenciar loading de blocos localmente', () => {
      const { result } = renderHook(() => useBlockLoading());

      expect(result.current.loadingBlocks.size).toBe(0);

      act(() => {
        result.current.setBlockLoading('block-1', true);
      });

      expect(result.current.loadingBlocks.size).toBe(1);
      expect(result.current.isBlockLoading('block-1')).toBe(true);
      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setBlockLoading('block-1', false);
      });

      expect(result.current.loadingBlocks.size).toBe(0);
      expect(result.current.isLoading).toBe(false);
    });

    it('deve calcular progresso corretamente sem provider', () => {
      const { result } = renderHook(() => useBlockLoading());

      // Sem blocos: 100%
      expect(result.current.progress).toBe(100);

      act(() => {
        result.current.setBlockLoading('block-1', true);
      });

      // Com blocos: 0% (não sabe o total)
      expect(result.current.progress).toBe(0);

      act(() => {
        result.current.setBlockLoading('block-1', false);
      });

      // Sem blocos novamente: 100%
      expect(result.current.progress).toBe(100);
    });
  });

  describe('Com EditorLoadingProvider', () => {
    it('deve usar contexto global quando disponível', () => {
      const { result } = renderHook(() => useBlockLoading(), {
        wrapper: EditorLoadingProvider,
      });

      expect(result.current).toBeDefined();
      expect(result.current.loadingBlocks.size).toBe(0);

      act(() => {
        result.current.setBlockLoading('block-1', true);
      });

      expect(result.current.loadingBlocks.size).toBe(1);
      expect(result.current.isBlockLoading('block-1')).toBe(true);
    });

    it('deve usar progresso do contexto global', () => {
      const { result } = renderHook(() => useBlockLoading(), {
        wrapper: EditorLoadingProvider,
      });

      // Progresso inicial do contexto (100%)
      expect(result.current.progress).toBe(100);

      act(() => {
        result.current.setBlockLoading('block-1', true);
      });

      // Progresso calculado pelo contexto (67% quando blocks loading)
      expect(result.current.progress).toBe(67);
    });
  });

  describe('setBlockLoading', () => {
    it('deve adicionar bloco ao set quando loading=true', () => {
      const { result } = renderHook(() => useBlockLoading());

      act(() => {
        result.current.setBlockLoading('block-1', true);
      });

      expect(result.current.isBlockLoading('block-1')).toBe(true);
      expect(result.current.getTotalLoadingBlocks()).toBe(1);
    });

    it('deve remover bloco do set quando loading=false', () => {
      const { result } = renderHook(() => useBlockLoading());

      act(() => {
        result.current.setBlockLoading('block-1', true);
        result.current.setBlockLoading('block-1', false);
      });

      expect(result.current.isBlockLoading('block-1')).toBe(false);
      expect(result.current.getTotalLoadingBlocks()).toBe(0);
    });

    it('deve gerenciar múltiplos blocos simultaneamente', () => {
      const { result } = renderHook(() => useBlockLoading());

      act(() => {
        result.current.setBlockLoading('block-1', true);
        result.current.setBlockLoading('block-2', true);
        result.current.setBlockLoading('block-3', true);
      });

      expect(result.current.getTotalLoadingBlocks()).toBe(3);
      expect(result.current.isBlockLoading('block-1')).toBe(true);
      expect(result.current.isBlockLoading('block-2')).toBe(true);
      expect(result.current.isBlockLoading('block-3')).toBe(true);

      act(() => {
        result.current.setBlockLoading('block-2', false);
      });

      expect(result.current.getTotalLoadingBlocks()).toBe(2);
      expect(result.current.isBlockLoading('block-2')).toBe(false);
    });
  });

  describe('setBatchLoading', () => {
    it('deve adicionar múltiplos blocos de uma vez', () => {
      const { result } = renderHook(() => useBlockLoading());

      const blockIds = ['block-1', 'block-2', 'block-3'];

      act(() => {
        result.current.setBatchLoading(blockIds, true);
      });

      expect(result.current.getTotalLoadingBlocks()).toBe(3);
      blockIds.forEach((blockId) => {
        expect(result.current.isBlockLoading(blockId)).toBe(true);
      });
    });

    it('deve remover múltiplos blocos de uma vez', () => {
      const { result } = renderHook(() => useBlockLoading());

      const blockIds = ['block-1', 'block-2', 'block-3'];

      act(() => {
        result.current.setBatchLoading(blockIds, true);
        result.current.setBatchLoading(blockIds, false);
      });

      expect(result.current.getTotalLoadingBlocks()).toBe(0);
      blockIds.forEach((blockId) => {
        expect(result.current.isBlockLoading(blockId)).toBe(false);
      });
    });

    it('deve funcionar com array vazio', () => {
      const { result } = renderHook(() => useBlockLoading());

      act(() => {
        result.current.setBatchLoading([], true);
      });

      expect(result.current.getTotalLoadingBlocks()).toBe(0);
    });
  });

  describe('clearAllLoading', () => {
    it('deve limpar todos os blocos em loading', () => {
      const { result } = renderHook(() => useBlockLoading());

      act(() => {
        result.current.setBlockLoading('block-1', true);
        result.current.setBlockLoading('block-2', true);
        result.current.setBlockLoading('block-3', true);
      });

      expect(result.current.getTotalLoadingBlocks()).toBe(3);

      act(() => {
        result.current.clearAllLoading();
      });

      expect(result.current.getTotalLoadingBlocks()).toBe(0);
      expect(result.current.isLoading).toBe(false);
    });

    it('deve funcionar mesmo sem blocos em loading', () => {
      const { result } = renderHook(() => useBlockLoading());

      expect(result.current.getTotalLoadingBlocks()).toBe(0);

      act(() => {
        result.current.clearAllLoading();
      });

      expect(result.current.getTotalLoadingBlocks()).toBe(0);
    });
  });

  describe('Query methods', () => {
    it('isBlockLoading deve retornar estado correto', () => {
      const { result } = renderHook(() => useBlockLoading());

      expect(result.current.isBlockLoading('block-1')).toBe(false);

      act(() => {
        result.current.setBlockLoading('block-1', true);
      });

      expect(result.current.isBlockLoading('block-1')).toBe(true);
      expect(result.current.isBlockLoading('block-2')).toBe(false);
    });

    it('getLoadingBlockIds deve retornar array de IDs', () => {
      const { result } = renderHook(() => useBlockLoading());

      expect(result.current.getLoadingBlockIds()).toEqual([]);

      act(() => {
        result.current.setBlockLoading('block-1', true);
        result.current.setBlockLoading('block-2', true);
      });

      const ids = result.current.getLoadingBlockIds();
      expect(ids).toHaveLength(2);
      expect(ids).toContain('block-1');
      expect(ids).toContain('block-2');
    });

    it('getTotalLoadingBlocks deve retornar contagem correta', () => {
      const { result } = renderHook(() => useBlockLoading());

      expect(result.current.getTotalLoadingBlocks()).toBe(0);

      act(() => {
        result.current.setBlockLoading('block-1', true);
        result.current.setBlockLoading('block-2', true);
      });

      expect(result.current.getTotalLoadingBlocks()).toBe(2);

      act(() => {
        result.current.setBlockLoading('block-1', false);
      });

      expect(result.current.getTotalLoadingBlocks()).toBe(1);
    });
  });

  describe('isLoading computed state', () => {
    it('deve ser false quando nenhum bloco está loading', () => {
      const { result } = renderHook(() => useBlockLoading());

      expect(result.current.isLoading).toBe(false);
    });

    it('deve ser true quando pelo menos um bloco está loading', () => {
      const { result } = renderHook(() => useBlockLoading());

      act(() => {
        result.current.setBlockLoading('block-1', true);
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('deve voltar a false quando todos os blocos param de loading', () => {
      const { result } = renderHook(() => useBlockLoading());

      act(() => {
        result.current.setBlockLoading('block-1', true);
        result.current.setBlockLoading('block-2', true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setBlockLoading('block-1', false);
        result.current.setBlockLoading('block-2', false);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });
});

describe('useSingleBlockLoading', () => {
  it('deve gerenciar loading de um único bloco', () => {
    const { result } = renderHook(() => useSingleBlockLoading('block-123'));

    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('deve isolar estado de diferentes blocos', () => {
    const { result: result1 } = renderHook(() => useSingleBlockLoading('block-1'));
    const { result: result2 } = renderHook(() => useSingleBlockLoading('block-2'));

    act(() => {
      result1.current.setLoading(true);
    });

    expect(result1.current.isLoading).toBe(true);
    expect(result2.current.isLoading).toBe(false);
  });

  it('deve funcionar com EditorLoadingProvider', () => {
    const { result } = renderHook(() => useSingleBlockLoading('block-123'), {
      wrapper: EditorLoadingProvider,
    });

    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);
  });
});
