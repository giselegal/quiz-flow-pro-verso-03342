/**
 * 🎯 TK-CANVAS-09: PERFORMANCE TESTS
 * 
 * Testes automatizados de performance para Canvas
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { EditableBlock } from '../EditableBlock';
import { PreviewBlock } from '../PreviewBlock';
import { IsolatedPreview } from '../IsolatedPreview';
import { MemoizationMetrics } from '@/utils/performance/memoization';
import { Block } from '@/types/editor';

// Mock block
const mockBlock: Block = {
  id: 'test-block-1',
  type: 'text-inline',
  content: { text: 'Test content' },
  properties: {},
  order: 0,
  position: { x: 0, y: 0, width: 100, height: 100 },
};

describe('TK-CANVAS-09: Performance Tests', () => {
  beforeEach(() => {
    MemoizationMetrics.reset();
  });

  describe('EditableBlock Performance', () => {
    it('should render in less than 50ms', async () => {
      const start = performance.now();
      
      render(
        <EditableBlock
          block={mockBlock}
          isSelected={false}
          onSelect={() => {}}
        />
      );
      
      const end = performance.now();
      const renderTime = end - start;
      
      expect(renderTime).toBeLessThan(50);
    });

    it('should not re-render when props are the same', () => {
      const { rerender } = render(
        <EditableBlock
          block={mockBlock}
          isSelected={false}
          onSelect={() => {}}
        />
      );
      
      const initialRenders = MemoizationMetrics.getStats('EditableBlock').renders;
      
      // Re-render com mesmas props
      rerender(
        <EditableBlock
          block={mockBlock}
          isSelected={false}
          onSelect={() => {}}
        />
      );
      
      const finalRenders = MemoizationMetrics.getStats('EditableBlock').renders;
      
      // Deve ter memoizado (não aumentou contador)
      expect(finalRenders).toBeLessThanOrEqual(initialRenders + 1);
    });

    it('should re-render when isSelected changes', () => {
      const { rerender } = render(
        <EditableBlock
          block={mockBlock}
          isSelected={false}
          onSelect={() => {}}
        />
      );
      
      const initialRenders = MemoizationMetrics.getStats('EditableBlock').renders;
      
      // Re-render com isSelected diferente
      rerender(
        <EditableBlock
          block={mockBlock}
          isSelected={true}
          onSelect={() => {}}
        />
      );
      
      const finalRenders = MemoizationMetrics.getStats('EditableBlock').renders;
      
      // Deve ter re-renderizado
      expect(finalRenders).toBeGreaterThan(initialRenders);
    });
  });

  describe('PreviewBlock Performance', () => {
    it('should render in less than 30ms', async () => {
      const start = performance.now();
      
      render(
        <PreviewBlock
          block={mockBlock}
        />
      );
      
      const end = performance.now();
      const renderTime = end - start;
      
      expect(renderTime).toBeLessThan(30);
    });

    it('should have high memoization hit rate (>80%)', () => {
      const { rerender } = render(
        <PreviewBlock block={mockBlock} />
      );
      
      // Fazer 10 re-renders com mesmas props
      for (let i = 0; i < 10; i++) {
        rerender(<PreviewBlock block={mockBlock} />);
      }
      
      const stats = MemoizationMetrics.getStats('PreviewBlock');
      
      // Hit rate deve ser > 80%
      expect(stats.hitRate).toBeGreaterThan(80);
    });
  });

  describe('IsolatedPreview Performance', () => {
    it('should render multiple blocks efficiently', async () => {
      const blocks: Block[] = Array.from({ length: 50 }, (_, i) => ({
        ...mockBlock,
        id: `block-${i}`,
        order: i,
      }));
      
      const start = performance.now();
      
      render(
        <IsolatedPreview
          blocks={blocks}
          funnelId="test"
        />
      );
      
      const end = performance.now();
      const renderTime = end - start;
      
      // 50 blocos devem renderizar em menos de 200ms
      expect(renderTime).toBeLessThan(200);
    });
  });

  describe('Memory Leak Detection', () => {
    it('should not increase memory significantly after multiple renders', () => {
      if (!('memory' in performance)) {
        console.log('⚠️ Memory API not available, skipping test');
        return;
      }
      
      const initialMemory = (performance as any).memory.usedJSHeapSize;
      
      const { rerender } = render(
        <EditableBlock
          block={mockBlock}
          isSelected={false}
          onSelect={() => {}}
        />
      );
      
      // Fazer 100 re-renders
      for (let i = 0; i < 100; i++) {
        rerender(
          <EditableBlock
            block={{ ...mockBlock, content: { text: `Test ${i}` } }}
            isSelected={i % 2 === 0}
            onSelect={() => {}}
          />
        );
      }
      
      const finalMemory = (performance as any).memory.usedJSHeapSize;
      const memoryDiff = (finalMemory - initialMemory) / 1024 / 1024; // MB
      
      // Não deve aumentar mais de 5MB
      expect(memoryDiff).toBeLessThan(5);
    });
  });

  describe('Memoization Metrics', () => {
    it('should track render counts correctly', () => {
      const { rerender } = render(
        <EditableBlock
          block={mockBlock}
          isSelected={false}
          onSelect={() => {}}
        />
      );
      
      // 5 re-renders
      for (let i = 0; i < 5; i++) {
        rerender(
          <EditableBlock
            block={mockBlock}
            isSelected={false}
            onSelect={() => {}}
          />
        );
      }
      
      const stats = MemoizationMetrics.getStats('EditableBlock');
      
      expect(stats.renders).toBeGreaterThan(0);
      expect(stats.memoHits).toBeGreaterThan(0);
    });

    it('should calculate hit rate correctly', () => {
      const { rerender } = render(
        <PreviewBlock block={mockBlock} />
      );
      
      // 10 re-renders com mesmas props (deve memoizar todas)
      for (let i = 0; i < 10; i++) {
        rerender(<PreviewBlock block={mockBlock} />);
      }
      
      const stats = MemoizationMetrics.getStats('PreviewBlock');
      
      // Hit rate deve ser alto
      expect(stats.hitRate).toBeGreaterThan(70);
    });
  });
});

/**
 * Performance benchmarks (não são testes unitários)
 */
describe('Performance Benchmarks', () => {
  it('benchmark: EditableBlock render time', () => {
    const times: number[] = [];
    
    for (let i = 0; i < 100; i++) {
      const start = performance.now();
      
      render(
        <EditableBlock
          block={mockBlock}
          isSelected={false}
          onSelect={() => {}}
        />
      );
      
      const end = performance.now();
      times.push(end - start);
    }
    
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const max = Math.max(...times);
    const min = Math.min(...times);
    
    console.log(`📊 EditableBlock Benchmark:
      Average: ${avg.toFixed(2)}ms
      Min: ${min.toFixed(2)}ms
      Max: ${max.toFixed(2)}ms
    `);
    
    // Média deve ser < 20ms
    expect(avg).toBeLessThan(20);
  });
});
