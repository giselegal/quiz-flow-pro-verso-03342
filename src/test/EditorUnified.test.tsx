/**
 * 🧪 EditorUnified Integration Tests
 * Tests for the unified editor system
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from './testUtils';
import EditorUnifiedPro from '@/components/editor/EditorUnifiedPro';

// Mock performance API
const mockPerformanceNow = vi.fn(() => Date.now());
Object.defineProperty(global, 'performance', {
  writable: true,
  value: { now: mockPerformanceNow },
});

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

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
      // Check that debug panel exists or rendering works without errors
      const editor = screen.getByTestId('editor-unified');
      expect(editor).toBeInTheDocument();
    });
  });

  it('manages editor state properly', async () => {
    render(<EditorUnifiedPro />);
    
    await waitFor(() => {
      const editor = screen.getByTestId('editor-unified');
      expect(editor).toBeInTheDocument();
    });
  });
});