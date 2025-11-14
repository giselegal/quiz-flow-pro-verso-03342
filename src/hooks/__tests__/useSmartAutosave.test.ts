import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useSmartAutosave } from '../../hooks/useSmartAutosave';

describe('useSmartAutosave', () => {
  it('deve salvar dados após debounce', async () => {
    const saveFn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useSmartAutosave(saveFn, { debounceMs: 100 })
    );

    act(() => {
      result.current.enqueueSave({ test: 'data' });
    });

    expect(result.current.status).toBe('queued');

    await waitFor(() => {
      expect(saveFn).toHaveBeenCalledWith({ test: 'data' });
      expect(result.current.status).toBe('saved');
    });
  });

  it('deve coalescer múltiplos saves', async () => {
    const saveFn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useSmartAutosave(saveFn, { debounceMs: 100 })
    );

    act(() => {
      result.current.enqueueSave({ version: 1 });
      result.current.enqueueSave({ version: 2 });
      result.current.enqueueSave({ version: 3 });
    });

    await waitFor(() => {
      expect(saveFn).toHaveBeenCalledTimes(1);
      expect(saveFn).toHaveBeenCalledWith({ version: 3 });
    });
  });

  it('deve fazer retry em caso de erro', async () => {
    const saveFn = vi.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useSmartAutosave(saveFn, { debounceMs: 10, retryDelayMs: 50, maxRetries: 3 })
    );

    act(() => {
      result.current.saveNow({ test: 'data' });
    });

    await waitFor(() => {
      expect(saveFn).toHaveBeenCalledTimes(3);
      expect(result.current.status).toBe('saved');
    }, { timeout: 5000 });
  });

  it('deve reportar erro após max retries', async () => {
    const saveFn = vi.fn().mockRejectedValue(new Error('Network error'));
    const onError = vi.fn();

    const { result } = renderHook(() =>
      useSmartAutosave(saveFn, {
        debounceMs: 10,
        retryDelayMs: 50,
        maxRetries: 2,
        onError,
      })
    );

    act(() => {
      result.current.saveNow({ test: 'data' });
    });

    await waitFor(() => {
      expect(result.current.status).toBe('error');
      expect(onError).toHaveBeenCalled();
    }, { timeout: 5000 });
  });
});
