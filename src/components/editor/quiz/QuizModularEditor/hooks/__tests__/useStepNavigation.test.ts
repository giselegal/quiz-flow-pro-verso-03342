/**
 * 🧪 TESTES: useStepNavigation Hook
 * 
 * Valida navegação entre steps, validação e limpeza de seleção
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStepNavigation } from '../useStepNavigation';

describe('useStepNavigation', () => {
  const mockSetCurrentStep = vi.fn();
  const mockSetSelectedBlock = vi.fn();
  
  const mockTemplate = {
    name: 'Test Template',
    steps: [
      { id: 'step-01', name: 'Step 1' },
      { id: 'step-02', name: 'Step 2' },
      { id: 'step-03', name: 'Step 3' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve limpar seleção ao navegar para outro step', () => {
    const { result } = renderHook(() => useStepNavigation({
      currentStepKey: 'step-01',
      loadedTemplate: mockTemplate,
      setCurrentStep: mockSetCurrentStep,
      setSelectedBlock: mockSetSelectedBlock,
      templateId: 'template-1',
      resourceId: 'resource-1',
    }));

    act(() => {
      result.current.handleSelectStep('step-02');
    });

    expect(mockSetSelectedBlock).toHaveBeenCalledWith(null);
    expect(mockSetCurrentStep).toHaveBeenCalledWith(2);
  });

  it('não deve fazer nada ao selecionar o step atual', () => {
    const { result } = renderHook(() => useStepNavigation({
      currentStepKey: 'step-01',
      loadedTemplate: mockTemplate,
      setCurrentStep: mockSetCurrentStep,
      setSelectedBlock: mockSetSelectedBlock,
      templateId: 'template-1',
      resourceId: 'resource-1',
    }));

    act(() => {
      result.current.handleSelectStep('step-01');
    });

    expect(mockSetSelectedBlock).not.toHaveBeenCalled();
    expect(mockSetCurrentStep).not.toHaveBeenCalled();
  });

  it('deve calcular totalSteps corretamente', () => {
    const { result } = renderHook(() => useStepNavigation({
      currentStepKey: 'step-01',
      loadedTemplate: mockTemplate,
      setCurrentStep: mockSetCurrentStep,
      setSelectedBlock: mockSetSelectedBlock,
    }));

    expect(result.current.totalSteps).toBe(3);
  });

  it('deve validar canNavigateNext e canNavigatePrevious', () => {
    const { result } = renderHook(() => useStepNavigation({
      currentStepKey: 'step-02',
      loadedTemplate: mockTemplate,
      setCurrentStep: mockSetCurrentStep,
      setSelectedBlock: mockSetSelectedBlock,
    }));

    expect(result.current.canNavigateNext).toBe(true);
    expect(result.current.canNavigatePrevious).toBe(true);
  });

  it('não deve permitir navegar além do último step', () => {
    const { result } = renderHook(() => useStepNavigation({
      currentStepKey: 'step-03',
      loadedTemplate: mockTemplate,
      setCurrentStep: mockSetCurrentStep,
      setSelectedBlock: mockSetSelectedBlock,
    }));

    expect(result.current.canNavigateNext).toBe(false);
    expect(result.current.canNavigatePrevious).toBe(true);
  });

  it('não deve permitir navegar antes do primeiro step', () => {
    const { result } = renderHook(() => useStepNavigation({
      currentStepKey: 'step-01',
      loadedTemplate: mockTemplate,
      setCurrentStep: mockSetCurrentStep,
      setSelectedBlock: mockSetSelectedBlock,
    }));

    expect(result.current.canNavigatePrevious).toBe(false);
    expect(result.current.canNavigateNext).toBe(true);
  });

  it('deve usar fallback para extrair número do step quando não há template', () => {
    const { result } = renderHook(() => useStepNavigation({
      currentStepKey: 'step-01',
      loadedTemplate: null,
      setCurrentStep: mockSetCurrentStep,
      setSelectedBlock: mockSetSelectedBlock,
    }));

    act(() => {
      result.current.handleSelectStep('step-05');
    });

    expect(mockSetSelectedBlock).toHaveBeenCalledWith(null);
    expect(mockSetCurrentStep).toHaveBeenCalledWith(5);
  });
});
