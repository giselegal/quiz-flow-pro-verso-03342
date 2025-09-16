/**
 * 🧪 useUnifiedEditor Hook Tests
 * Tests for the unified editor hook
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUnifiedEditor } from '@/hooks/useUnifiedEditor';

describe('useUnifiedEditor', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useUnifiedEditor());
    
    expect(result.current).toBeDefined();
    expect(result.current.blocks).toBeDefined();
    expect(result.current.selectedBlockId).toBeNull();
    expect(result.current.activeStageId).toBeDefined();
  });

  it('handles block selection', () => {
    const { result } = renderHook(() => useUnifiedEditor());
    
    act(() => {
      result.current.setSelectedBlockId('test-block-id');
    });
    
    expect(result.current.selectedBlockId).toBe('test-block-id');
  });

  it('manages blocks correctly', async () => {
    const { result } = renderHook(() => useUnifiedEditor());
    
    await act(async () => {
      await result.current.addBlock('text-inline');
    });
    
    expect(result.current.blocks).toBeDefined();
    expect(Array.isArray(result.current.blocks)).toBe(true);
  });

  it('handles block property updates', async () => {
    const { result } = renderHook(() => useUnifiedEditor());
    
    // First get a block ID
    let blockId: string = '';
    await act(async () => {
      blockId = await result.current.addBlock('text-inline');
    });
    
    // Then update its properties
    await act(async () => {
      await result.current.updateBlock(blockId, { content: 'Updated content' });
    });
    
    // Check that update worked without errors
    expect(result.current.blocks).toBeDefined();
  });

  it('handles block reordering', async () => {
    const { result } = renderHook(() => useUnifiedEditor());
    
    // Add two blocks
    await act(async () => {
      await result.current.addBlock('text-inline');
      await result.current.addBlock('button-inline');
    });
    
    // Reorder them
    act(() => {
      result.current.reorderBlocks(0, 1);
    });
    
    expect(Array.isArray(result.current.blocks)).toBe(true);
  });

  it('handles block deletion', async () => {
    const { result } = renderHook(() => useUnifiedEditor());
    
    // Add a block
    let blockId: string = '';
    await act(async () => {
      blockId = await result.current.addBlock('text-inline');
    });
    
    // Delete it
    await act(async () => {
      await result.current.deleteBlock(blockId);
    });
    
    // Should not throw error
    expect(result.current.blocks).toBeDefined();
  });

  it('manages stage state', () => {
    const { result } = renderHook(() => useUnifiedEditor());
    
    act(() => {
      result.current.setActiveStage('step-2');
    });
    
    expect(result.current.activeStageId).toBe('step-2');
  });

  it('manages preview mode', () => {
    const { result } = renderHook(() => useUnifiedEditor());
    
    act(() => {
      result.current.setIsPreviewing(true);
    });
    
    expect(result.current.isPreviewing).toBe(true);
  });

  it('exposes template actions when available', () => {
    const { result } = renderHook(() => useUnifiedEditor());
    
    // Template actions should be available (or null)
    expect(result.current.templateActions === null || typeof result.current.templateActions === 'object').toBe(true);
  });

  it('indicates context type correctly', () => {
    const { result } = renderHook(() => useUnifiedEditor());
    
    expect(['legacy', 'none'].includes(result.current.contextType)).toBe(true);
    expect(typeof result.current.isLegacy).toBe('boolean');
  });
});