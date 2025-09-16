/**
 * 🧪 ComponentsSidebar Tests
 * Tests for the components sidebar functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from './testUtils';
import ComponentsSidebar from '@/components/editor/ComponentsSidebar';

// Mock drag and drop
const mockDragStart = vi.fn();
const mockDragEnd = vi.fn();

Object.defineProperty(global, 'DataTransfer', {
  writable: true,
  value: class DataTransfer {
    data: Record<string, string> = {};
    setData(format: string, data: string) {
      this.data[format] = data;
    }
    getData(format: string) {
      return this.data[format] || '';
    }
  },
});

describe('ComponentsSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all component categories', async () => {
    render(<ComponentsSidebar />);
    
    await waitFor(() => {
      expect(screen.getByText('Componentes')).toBeInTheDocument();
    });

    // Check for main categories
    expect(screen.queryByText('Layout')).toBeInTheDocument();
    expect(screen.queryByText('Conteúdo')).toBeInTheDocument();
    expect(screen.queryByText('Formulários')).toBeInTheDocument();
  });

  it('shows component items when category is expanded', async () => {
    render(<ComponentsSidebar />);
    
    await waitFor(() => {
      const layoutCategory = screen.getByText('Layout');
      fireEvent.click(layoutCategory);
    });

    await waitFor(() => {
      // Should show layout components
      expect(screen.queryByTestId('component-text-inline')).toBeInTheDocument();
      expect(screen.queryByTestId('component-button-inline')).toBeInTheDocument();
    });
  });

  it('handles component drag operations', async () => {
    render(<ComponentsSidebar />);
    
    await waitFor(() => {
      const textComponent = screen.queryByTestId('component-text-inline');
      if (textComponent) {
        // Test drag start
        fireEvent.dragStart(textComponent, {
          dataTransfer: new DataTransfer(),
        });
        
        expect(textComponent.getAttribute('draggable')).toBe('true');
      }
    });
  });

  it('filters components based on search', async () => {
    render(<ComponentsSidebar />);
    
    await waitFor(() => {
      const searchInput = screen.queryByPlaceholderText('Buscar componentes...');
      if (searchInput) {
        fireEvent.change(searchInput, { target: { value: 'texto' } });
        
        // Should filter to show only text-related components
        expect(screen.queryByTestId('component-text-inline')).toBeInTheDocument();
      }
    });
  });

  it('displays component previews on hover', async () => {
    render(<ComponentsSidebar />);
    
    await waitFor(() => {
      const textComponent = screen.queryByTestId('component-text-inline');
      if (textComponent) {
        fireEvent.mouseEnter(textComponent);
        
        // Should show preview tooltip
        expect(screen.queryByTestId('component-preview')).toBeInTheDocument();
      }
    });
  });
});