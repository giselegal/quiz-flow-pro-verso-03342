import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { EditorProvider, EditorState } from '@/components/editor/EditorProvider';

interface RenderWithProvidersOptions extends RenderOptions {
  initialState?: Partial<EditorState>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: RenderWithProvidersOptions = {}
) {
  const { initialState, ...renderOptions } = options;
  
  // Generate unique storage key for each test to avoid state collision
  const testStorageKey = `test-${Date.now()}-${Math.random()}`;
  
  // Clear localStorage before each test
  if (typeof window !== 'undefined') {
    localStorage.removeItem(testStorageKey);
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <EditorProvider initial={initialState} storageKey={testStorageKey}>
        {children}
      </EditorProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from testing library
export * from '@testing-library/react';
export { renderWithProviders as render };