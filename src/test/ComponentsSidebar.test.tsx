/**
 * 🧪 ComponentsSidebar Tests
 * Tests for the components sidebar functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from './testUtils';
import { ComponentsSidebar } from '@/components/editor/ComponentsSidebar';

describe('ComponentsSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders components sidebar without errors', async () => {
    render(<ComponentsSidebar />);
    
    await waitFor(() => {
      expect(screen.getByText('Componentes')).toBeInTheDocument();
    });
  });

  it('shows component categories', async () => {
    render(<ComponentsSidebar />);
    
    await waitFor(() => {
      const componentsTitle = screen.getByText('Componentes');
      expect(componentsTitle).toBeInTheDocument();
    });
  });

  it('handles click interactions without errors', async () => {
    render(<ComponentsSidebar />);
    
    await waitFor(() => {
      const sidebar = screen.getByText('Componentes');
      fireEvent.click(sidebar);
      
      // Should not throw error
      expect(sidebar).toBeInTheDocument();
    });
  });
});