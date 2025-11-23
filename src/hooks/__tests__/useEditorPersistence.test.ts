/**
 * 🧪 TESTES UNITÁRIOS - useEditorPersistence
 * 
 * Testa o hook de auto-save do editor com undo/redo
 * 
 * @version 1.0.0 - Phase 3: Testing
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useEditorPersistence } from '../useEditorPersistence';
import { funnelComponentsService } from '@/services/funnelComponentsService';

// Mock do funnelComponentsService
vi.mock('@/services/funnelComponentsService', () => ({
  funnelComponentsService: {
    syncStepComponents: vi.fn(),
    getStepComponents: vi.fn(),
  },
}));

// Mock do Logger
vi.mock('@/services/core/Logger', () => ({
  appLogger: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('useEditorPersistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const mockFunnelId = 'test-funnel-id';
  const mockStep = 1;
  const mockBlocks = [
    { id: 'block1', type: 'heading', content: 'Test' },
    { id: 'block2', type: 'paragraph', content: 'Content' },
  ];

  // ============================================================
  // TESTE 1: Estado inicial
  // ============================================================

  it('deve retornar estado inicial correto', () => {
    const { result } = renderHook(() => 
      useEditorPersistence(mockFunnelId, mockStep, [])
    );

    expect(result.current.isSaving).toBe(false);
    expect(result.current.lastSaved).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  // ============================================================
  // TESTE 2: Carregamento inicial de blocks
  // ============================================================

  it('deve carregar blocks existentes no mount', async () => {
    const mockExistingBlocks = [
      { id: 'existing1', type: 'heading', content: 'Existing' },
    ];

    (funnelComponentsService.getStepComponents as any).mockResolvedValue(
      mockExistingBlocks
    );

    renderHook(() => useEditorPersistence(mockFunnelId, mockStep, []));

    await waitFor(() => {
      expect(funnelComponentsService.getStepComponents).toHaveBeenCalledWith(
        mockFunnelId,
        mockStep
      );
    });
  });

  // ============================================================
  // TESTE 3: Auto-save com debounce
  // ============================================================

  it('deve fazer auto-save após debounce de 1 segundo', async () => {
    (funnelComponentsService.syncStepComponents as any).mockResolvedValue(undefined);

    const { rerender } = renderHook(
      ({ blocks }) => useEditorPersistence(mockFunnelId, mockStep, blocks),
      { initialProps: { blocks: [] } }
    );

    // Atualiza blocks
    rerender({ blocks: mockBlocks });

    // Antes do debounce, não deve ter salvo
    expect(funnelComponentsService.syncStepComponents).not.toHaveBeenCalled();

    // Avança timer 1 segundo
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(funnelComponentsService.syncStepComponents).toHaveBeenCalledWith(
        mockFunnelId,
        mockStep,
        mockBlocks
      );
    });
  });

  // ============================================================
  // TESTE 4: Indicador de salvamento
  // ============================================================

  it('deve mostrar indicador de salvamento durante o processo', async () => {
    let resolveSync: any;
    const syncPromise = new Promise(resolve => { resolveSync = resolve; });
    (funnelComponentsService.syncStepComponents as any).mockReturnValue(syncPromise);

    const { result, rerender } = renderHook(
      ({ blocks }) => useEditorPersistence(mockFunnelId, mockStep, blocks),
      { initialProps: { blocks: [] } }
    );

    // Atualiza blocks
    rerender({ blocks: mockBlocks });

    // Avança debounce
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Deve estar salvando
    await waitFor(() => {
      expect(result.current.isSaving).toBe(true);
    });

    // Resolve save
    act(() => {
      resolveSync();
    });

    // Deve ter terminado de salvar
    await waitFor(() => {
      expect(result.current.isSaving).toBe(false);
      expect(result.current.lastSaved).toBeDefined();
    });
  });

  // ============================================================
  // TESTE 5: Tratamento de erros
  // ============================================================

  it('deve capturar e expor erros de salvamento', async () => {
    const mockError = new Error('Save failed');
    (funnelComponentsService.syncStepComponents as any).mockRejectedValue(mockError);

    const { result, rerender } = renderHook(
      ({ blocks }) => useEditorPersistence(mockFunnelId, mockStep, blocks),
      { initialProps: { blocks: [] } }
    );

    // Atualiza blocks
    rerender({ blocks: mockBlocks });

    // Avança debounce
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
      expect(result.current.error?.message).toBe('Save failed');
    });
  });

  // ============================================================
  // TESTE 6: Função saveNow (save imediato)
  // ============================================================

  it('deve permitir save imediato via saveNow', async () => {
    (funnelComponentsService.syncStepComponents as any).mockResolvedValue(undefined);

    const { result } = renderHook(() => 
      useEditorPersistence(mockFunnelId, mockStep, mockBlocks)
    );

    // Chama saveNow
    await act(async () => {
      await result.current.saveNow();
    });

    expect(funnelComponentsService.syncStepComponents).toHaveBeenCalledWith(
      mockFunnelId,
      mockStep,
      mockBlocks
    );
  });

  // ============================================================
  // TESTE 7: Histórico de undo
  // ============================================================

  it('deve armazenar histórico para undo', async () => {
    const { result, rerender } = renderHook(
      ({ blocks }) => useEditorPersistence(mockFunnelId, mockStep, blocks),
      { initialProps: { blocks: [] } }
    );

    // Primeira mudança
    rerender({ blocks: mockBlocks });
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(result.current.canUndo).toBe(true);
    });
  });

  // ============================================================
  // TESTE 8: Funcionalidade de undo
  // ============================================================

  it('deve desfazer alterações com undo', async () => {
    (funnelComponentsService.syncStepComponents as any).mockResolvedValue(undefined);

    const initialBlocks = [{ id: 'initial', type: 'heading', content: 'Initial' }];
    
    const { result, rerender } = renderHook(
      ({ blocks }) => useEditorPersistence(mockFunnelId, mockStep, blocks),
      { initialProps: { blocks: initialBlocks } }
    );

    // Salva snapshot inicial
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Atualiza blocks
    rerender({ blocks: mockBlocks });
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(result.current.canUndo).toBe(true);
    });

    // Faz undo
    act(() => {
      result.current.undo();
    });

    // Deve ter voltado ao estado anterior
    expect(funnelComponentsService.syncStepComponents).toHaveBeenCalledWith(
      mockFunnelId,
      mockStep,
      initialBlocks
    );
  });

  // ============================================================
  // TESTE 9: Funcionalidade de redo
  // ============================================================

  it('deve refazer alterações com redo', async () => {
    (funnelComponentsService.syncStepComponents as any).mockResolvedValue(undefined);

    const initialBlocks = [{ id: 'initial', type: 'heading', content: 'Initial' }];
    
    const { result, rerender } = renderHook(
      ({ blocks }) => useEditorPersistence(mockFunnelId, mockStep, blocks),
      { initialProps: { blocks: initialBlocks } }
    );

    // Snapshot inicial
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Atualiza blocks
    rerender({ blocks: mockBlocks });
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Faz undo
    act(() => {
      result.current.undo();
    });

    await waitFor(() => {
      expect(result.current.canRedo).toBe(true);
    });

    // Faz redo
    act(() => {
      result.current.redo();
    });

    // Deve ter voltado ao estado mais recente
    expect(funnelComponentsService.syncStepComponents).toHaveBeenLastCalledWith(
      mockFunnelId,
      mockStep,
      mockBlocks
    );
  });

  // ============================================================
  // TESTE 10: Limite de histórico (50 snapshots)
  // ============================================================

  it('deve limitar histórico a 50 snapshots', async () => {
    (funnelComponentsService.syncStepComponents as any).mockResolvedValue(undefined);

    const { result, rerender } = renderHook(
      ({ blocks }) => useEditorPersistence(mockFunnelId, mockStep, blocks),
      { initialProps: { blocks: [] } }
    );

    // Cria 55 mudanças
    for (let i = 0; i < 55; i++) {
      const newBlocks = [{ id: `block${i}`, type: 'heading', content: `Test ${i}` }];
      rerender({ blocks: newBlocks });
      
      act(() => {
        vi.advanceTimersByTime(1000);
      });
    }

    // Deve ter no máximo 50 snapshots (canUndo = true, mas limitado)
    expect(result.current.canUndo).toBe(true);

    // Tenta fazer undo 51 vezes
    let undoCount = 0;
    while (result.current.canUndo && undoCount < 51) {
      act(() => {
        result.current.undo();
      });
      undoCount++;
    }

    // Não deve conseguir fazer mais de 50 undos
    expect(undoCount).toBeLessThanOrEqual(50);
  });

  // ============================================================
  // TESTE 11: Cancelamento de debounce em mudanças rápidas
  // ============================================================

  it('deve cancelar debounce anterior em mudanças rápidas', async () => {
    (funnelComponentsService.syncStepComponents as any).mockResolvedValue(undefined);

    const { rerender } = renderHook(
      ({ blocks }) => useEditorPersistence(mockFunnelId, mockStep, blocks),
      { initialProps: { blocks: [] } }
    );

    // Primeira mudança
    rerender({ blocks: [{ id: '1', type: 'heading', content: 'First' }] });
    
    // Avança 500ms (metade do debounce)
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Segunda mudança (cancela debounce anterior)
    rerender({ blocks: mockBlocks });

    // Avança mais 500ms (total 1s desde segunda mudança)
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Deve ter salvado apenas 1 vez (a segunda mudança)
    await waitFor(() => {
      expect(funnelComponentsService.syncStepComponents).toHaveBeenCalledTimes(1);
      expect(funnelComponentsService.syncStepComponents).toHaveBeenCalledWith(
        mockFunnelId,
        mockStep,
        mockBlocks
      );
    });
  });

  // ============================================================
  // TESTE 12: Cleanup em unmount
  // ============================================================

  it('deve limpar debounce em unmount', async () => {
    (funnelComponentsService.syncStepComponents as any).mockResolvedValue(undefined);

    const { unmount, rerender } = renderHook(
      ({ blocks }) => useEditorPersistence(mockFunnelId, mockStep, blocks),
      { initialProps: { blocks: [] } }
    );

    // Atualiza blocks
    rerender({ blocks: mockBlocks });

    // Unmount antes do debounce completar
    unmount();

    // Avança timer
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Não deve ter salvo após unmount
    expect(funnelComponentsService.syncStepComponents).not.toHaveBeenCalled();
  });
});
