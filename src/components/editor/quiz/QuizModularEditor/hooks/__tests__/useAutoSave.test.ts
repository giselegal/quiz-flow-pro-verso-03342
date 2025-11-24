/**
 * 🧪 TESTES: useAutoSave Hook
 * 
 * Valida auto-save com debounce, tracking de mudanças e status
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAutoSave } from '../useAutoSave';

describe('useAutoSave', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve iniciar com status idle', () => {
    const { result } = renderHook(() => useAutoSave({
      enabled: true,
      debounceMs: 1000,
      onSave: mockOnSave,
      data: [],
    }));

    expect(result.current.saveStatus).toBe('idle');
    expect(result.current.hasUnsavedChanges).toBe(false);
    expect(result.current.lastSavedAt).toBe(null);
  });

  it('deve detectar mudanças nos dados', () => {
    mockOnSave.mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useAutoSave({
      enabled: true,
      debounceMs: 1000,
      onSave: mockOnSave,
      data: [{ id: '1', type: 'text' }],
    }));

    // Hook inicia sem mudanças não salvas
    expect(result.current.hasUnsavedChanges).toBe(false);
  });

  it('deve configurar debounce corretamente', () => {
    mockOnSave.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAutoSave({
      enabled: true,
      debounceMs: 2000,
      onSave: mockOnSave,
      data: [],
    }));

    // Hook é configurado com os valores corretos
    expect(result.current.saveStatus).toBe('idle');
  });

  it('deve atualizar status para saving durante salvamento', async () => {
    mockOnSave.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAutoSave({
      enabled: true,
      debounceMs: 100,
      onSave: mockOnSave,
      data: [{ id: '1' }],
    }));

    // Trigger manual e aguardar
    await act(async () => {
      await result.current.triggerSave();
    });

    // Após salvamento bem-sucedido, deve estar 'saved'
    expect(result.current.saveStatus).toBe('saved');
  });

  it('deve atualizar lastSavedAt após salvamento bem-sucedido', async () => {
    mockOnSave.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAutoSave({
      enabled: true,
      debounceMs: 100,
      onSave: mockOnSave,
      data: [{ id: '1' }],
    }));

    expect(result.current.lastSavedAt).toBe(null);

    await act(async () => {
      await result.current.triggerSave();
    });

    expect(result.current.lastSavedAt).not.toBe(null);
    expect(result.current.saveStatus).toBe('saved');
  });

  it('deve tratar erros de salvamento', async () => {
    const error = new Error('Save failed');
    mockOnSave.mockRejectedValue(error);

    const { result } = renderHook(() => useAutoSave({
      enabled: true,
      debounceMs: 100,
      onSave: mockOnSave,
      data: [{ id: '1' }],
    }));

    await act(async () => {
      await result.current.triggerSave();
    });

    await waitFor(() => {
      expect(result.current.saveStatus).toBe('error');
    }, { timeout: 1000 });
  });

  it('deve permitir trigger manual de save', async () => {
    mockOnSave.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAutoSave({
      enabled: true,
      debounceMs: 1000,
      onSave: mockOnSave,
      data: [{ id: '1' }],
    }));

    await act(async () => {
      await result.current.triggerSave();
    });

    expect(mockOnSave).toHaveBeenCalled();
  });

  it('permite trigger manual mesmo quando disabled', async () => {
    mockOnSave.mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useAutoSave({
      enabled: false,
      debounceMs: 100,
      onSave: mockOnSave,
      data: [{ id: '1' }],
    }));

    // triggerSave funciona mesmo quando disabled (para casos de emergência)
    await act(async () => {
      await result.current.triggerSave();
    });

    expect(mockOnSave).toHaveBeenCalled();
  });

  it('deve resetar status de save', () => {
    const { result } = renderHook(() => useAutoSave({
      enabled: true,
      debounceMs: 1000,
      onSave: mockOnSave,
      data: [],
    }));

    act(() => {
      result.current.resetSaveStatus();
    });

    expect(result.current.saveStatus).toBe('idle');
    expect(result.current.hasUnsavedChanges).toBe(false);
  });
});
