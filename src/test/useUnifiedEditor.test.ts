/**
 * 🧪 useUnifiedEditor Hook Tests
 * Tests for the unified editor hook
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUnifiedEditor } from '@/hooks/useUnifiedEditor';
import { mockBlockData } from './testUtils';

describe('useUnifiedEditor', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useUnifiedEditor());
    
    expect(result.current.state).toBeDefined();
    expect(result.current.actions).toBeDefined();
    expect(result.current.state.stepBlocks).toBeDefined();
    expect(result.current.state.selectedBlockId).toBeNull();
  });

  it('handles block selection', () => {
    const { result } = renderHook(() => useUnifiedEditor());
    
    act(() => {
      result.current.actions.selectBlock('test-block-id');
    });
    
    expect(result.current.state.selectedBlockId).toBe('test-block-id');
  });

  it('manages step blocks correctly', async () => {
    const { result } = renderHook(() => useUnifiedEditor());
    
    await act(async () => {
      await result.current.actions.addBlockAtIndex('step-1', mockBlockData.text, 0);
    });
    
    const stepBlocks = result.current.state.stepBlocks['step-1'];
    expect(stepBlocks).toBeDefined();
    expect(stepBlocks.length).toBeGreaterThan(0);
    expect(stepBlocks[0].id).toBe(mockBlockData.text.id);
  });

  it('handles block property updates', async () => {
    const { result } = renderHook(() => useUnifiedEditor());
    
    // First add a block
    await act(async () => {
      await result.current.actions.addBlockAtIndex('step-1', mockBlockData.text, 0);
    });
    
    // Then update its properties
    await act(async () => {
      await result.current.actions.updateBlockProperties(
        mockBlockData.text.id,
        { content: 'Updated content' }
      );
    });
    
    const updatedBlock = result.current.state.stepBlocks['step-1']?.[0];
    expect(updatedBlock?.properties.content).toBe('Updated content');
  });

  it('handles block reordering', async () => {
    const { result } = renderHook(() => useUnifiedEditor());
    
    // Add two blocks
    await act(async () => {
      await result.current.actions.addBlockAtIndex('step-1', mockBlockData.text, 0);
      await result.current.actions.addBlockAtIndex('step-1', mockBlockData.button, 1);
    });
    
    // Reorder them
    await act(async () => {
      await result.current.actions.reorderBlocks('step-1', 0, 1);
    });
    
    const blocks = result.current.state.stepBlocks['step-1'];
    expect(blocks[0].id).toBe(mockBlockData.button.id);
    expect(blocks[1].id).toBe(mockBlockData.text.id);
  });

  it('handles block deletion', async () => {
    const { result } = renderHook(() => useUnifiedEditor());
    
    // Add a block
    await act(async () => {
      await result.current.actions.addBlockAtIndex('step-1', mockBlockData.text, 0);
    });
    
    // Delete it
    await act(async () => {
      await result.current.actions.deleteBlock(mockBlockData.text.id);
    });
    
    const blocks = result.current.state.stepBlocks['step-1'];
    expect(blocks.length).toBe(0);
  });

  it('manages performance optimizations', () => {
    const { result } = renderHook(() => useUnifiedEditor());
    
    expect(result.current.performance).toBeDefined();
    expect(typeof result.current.performance.metrics).toBe('object');
    expect(typeof result.current.performance.optimize).toBe('function');
  });
});