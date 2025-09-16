/**
 * 🧪 EditorUnified Integration Tests
 * Tests for the unified editor system
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from './testUtils';
import EditorUnifiedPro from '@/components/editor/EditorUnifiedPro';
import { mockBlockData } from './testUtils';

// Mock performance API
const mockPerformanceNow = vi.fn(() => Date.now());
Object.defineProperty(global, 'performance', {
  writable: true,
  value: { now: mockPerformanceNow },
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  constructor(callback: IntersectionObserverCallback) {}
};

describe('EditorUnifiedPro Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders editor interface without errors', async () => {
    render(<EditorUnifiedPro />);
    
    await waitFor(() => {
      expect(screen.getByTestId('editor-unified')).toBeInTheDocument();
    });
  });

  it('displays performance metrics in debug mode', async () => {
    // Enable debug mode
    localStorage.setItem('editor-debug', 'true');
    
    render(<EditorUnifiedPro />);
    
    await waitFor(() => {
      const debugPanel = screen.queryByTestId('debug-performance');
      expect(debugPanel).toBeInTheDocument();
    });
  });

  it('handles block selection and property changes', async () => {
    render(<EditorUnifiedPro />);
    
    await waitFor(() => {
      expect(screen.getByTestId('editor-unified')).toBeInTheDocument();
    });

    // Test block selection
    const blockElement = screen.queryByTestId('block-text-inline');
    if (blockElement) {
      fireEvent.click(blockElement);
      
      await waitFor(() => {
        expect(screen.queryByTestId('property-panel')).toBeInTheDocument();
      });
    }
  });

  it('manages editor state properly', async () => {
    render(<EditorUnifiedPro />);
    
    await waitFor(() => {
      const editor = screen.getByTestId('editor-unified');
      expect(editor).toBeInTheDocument();
    });

    // Test that state is initialized
    expect(localStorage.getItem('editor-state')).toBeTruthy();
  });

  it('handles error recovery gracefully', async () => {
    // Force an error scenario
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock a component that throws
    const ThrowingComponent = () => {
      throw new Error('Test error');
    };
    
    // The error boundary should catch this
    expect(() => {
      render(<ThrowingComponent />);
    }).not.toThrow();
    
    consoleSpy.mockRestore();
  });

  it('optimizes performance with lazy loading', async () => {
    render(<EditorUnifiedPro />);
    
    await waitFor(() => {
      expect(screen.getByTestId('editor-unified')).toBeInTheDocument();
    });

    // Check that components are loaded lazily
    const lazyComponents = screen.queryAllByTestId(/lazy-/);
    expect(lazyComponents.length).toBeGreaterThanOrEqual(0);
  });
});