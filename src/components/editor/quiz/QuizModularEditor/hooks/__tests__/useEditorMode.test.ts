/**
 * 🧪 TESTES: useEditorMode Hook
 * 
 * Valida modos de visualização, edição e controle de painéis
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEditorMode } from '../useEditorMode';

describe('useEditorMode', () => {
  it('deve iniciar com valores padrão', () => {
    const { result } = renderHook(() => useEditorMode());

    expect(result.current.previewMode).toBe('desktop');
    expect(result.current.editMode).toBe('design');
    expect(result.current.visualizationMode).toBe('blocks');
    expect(result.current.showComponentLibrary).toBe(true);
    expect(result.current.showProperties).toBe(true);
    expect(result.current.showPreview).toBe(false);
  });

  it('deve iniciar com valores customizados', () => {
    const { result } = renderHook(() => useEditorMode({
      initialPreviewMode: 'mobile',
      initialEditMode: 'json',
      initialVisualizationMode: 'canvas',
      initialShowComponentLibrary: false,
      initialShowProperties: false,
      initialShowPreview: true,
    }));

    expect(result.current.previewMode).toBe('mobile');
    expect(result.current.editMode).toBe('json');
    expect(result.current.visualizationMode).toBe('canvas');
    expect(result.current.showComponentLibrary).toBe(false);
    expect(result.current.showProperties).toBe(false);
    expect(result.current.showPreview).toBe(true);
  });

  it('deve alternar preview mode', () => {
    const { result } = renderHook(() => useEditorMode());

    expect(result.current.previewMode).toBe('desktop');
    expect(result.current.isDesktopMode).toBe(true);

    act(() => {
      result.current.setPreviewMode('mobile');
    });

    expect(result.current.previewMode).toBe('mobile');
    expect(result.current.isMobileMode).toBe(true);
    expect(result.current.isDesktopMode).toBe(false);
  });

  it('deve alternar edit mode', () => {
    const { result } = renderHook(() => useEditorMode());

    expect(result.current.editMode).toBe('design');
    expect(result.current.isDesignMode).toBe(true);

    act(() => {
      result.current.setEditMode('json');
    });

    expect(result.current.editMode).toBe('json');
    expect(result.current.isJsonMode).toBe(true);
    expect(result.current.isDesignMode).toBe(false);
  });

  it('deve alternar visualization mode', () => {
    const { result } = renderHook(() => useEditorMode());

    expect(result.current.visualizationMode).toBe('blocks');
    expect(result.current.isBlocksMode).toBe(true);

    act(() => {
      result.current.setVisualizationMode('canvas');
    });

    expect(result.current.visualizationMode).toBe('canvas');
    expect(result.current.isCanvasMode).toBe(true);
    expect(result.current.isBlocksMode).toBe(false);
  });

  it('deve alternar visibilidade da biblioteca de componentes', () => {
    const { result } = renderHook(() => useEditorMode());

    expect(result.current.showComponentLibrary).toBe(true);

    act(() => {
      result.current.toggleComponentLibrary();
    });

    expect(result.current.showComponentLibrary).toBe(false);

    act(() => {
      result.current.toggleComponentLibrary();
    });

    expect(result.current.showComponentLibrary).toBe(true);
  });

  it('deve alternar visibilidade do painel de propriedades', () => {
    const { result } = renderHook(() => useEditorMode());

    expect(result.current.showProperties).toBe(true);

    act(() => {
      result.current.toggleProperties();
    });

    expect(result.current.showProperties).toBe(false);

    act(() => {
      result.current.setShowProperties(true);
    });

    expect(result.current.showProperties).toBe(true);
  });

  it('deve calcular número de painéis visíveis', () => {
    const { result } = renderHook(() => useEditorMode({
      initialShowComponentLibrary: true,
      initialShowProperties: true,
      initialShowPreview: false,
    }));

    expect(result.current.visiblePanelsCount).toBe(2);

    act(() => {
      result.current.setShowPreview(true);
    });

    expect(result.current.visiblePanelsCount).toBe(3);

    act(() => {
      result.current.setShowComponentLibrary(false);
    });

    expect(result.current.visiblePanelsCount).toBe(2);
  });

  it('deve identificar layout compacto', () => {
    const { result } = renderHook(() => useEditorMode({
      initialShowComponentLibrary: true,
      initialShowProperties: true,
      initialShowPreview: true,
    }));

    // 3+ painéis = layout compacto
    expect(result.current.isCompactLayout).toBe(true);

    act(() => {
      result.current.setShowPreview(false);
    });

    // 2 painéis = não compacto
    expect(result.current.isCompactLayout).toBe(false);
  });

  it('deve ter computed values booleanos corretos para preview mode', () => {
    const { result } = renderHook(() => useEditorMode());

    act(() => {
      result.current.setPreviewMode('mobile');
    });
    expect(result.current.isMobileMode).toBe(true);
    expect(result.current.isTabletMode).toBe(false);
    expect(result.current.isDesktopMode).toBe(false);

    act(() => {
      result.current.setPreviewMode('tablet');
    });
    expect(result.current.isMobileMode).toBe(false);
    expect(result.current.isTabletMode).toBe(true);
    expect(result.current.isDesktopMode).toBe(false);

    act(() => {
      result.current.setPreviewMode('desktop');
    });
    expect(result.current.isMobileMode).toBe(false);
    expect(result.current.isTabletMode).toBe(false);
    expect(result.current.isDesktopMode).toBe(true);
  });

  it('deve ter computed values booleanos corretos para edit mode', () => {
    const { result } = renderHook(() => useEditorMode());

    expect(result.current.isDesignMode).toBe(true);
    expect(result.current.isJsonMode).toBe(false);
    expect(result.current.isSplitMode).toBe(false);

    act(() => {
      result.current.setEditMode('json');
    });
    expect(result.current.isDesignMode).toBe(false);
    expect(result.current.isJsonMode).toBe(true);
    expect(result.current.isSplitMode).toBe(false);

    act(() => {
      result.current.setEditMode('split');
    });
    expect(result.current.isDesignMode).toBe(false);
    expect(result.current.isJsonMode).toBe(false);
    expect(result.current.isSplitMode).toBe(true);
  });

  it('deve ter computed values booleanos corretos para visualization mode', () => {
    const { result } = renderHook(() => useEditorMode());

    expect(result.current.isBlocksMode).toBe(true);
    expect(result.current.isCanvasMode).toBe(false);
    expect(result.current.isFullMode).toBe(false);

    act(() => {
      result.current.setVisualizationMode('canvas');
    });
    expect(result.current.isBlocksMode).toBe(false);
    expect(result.current.isCanvasMode).toBe(true);
    expect(result.current.isFullMode).toBe(false);

    act(() => {
      result.current.setVisualizationMode('full');
    });
    expect(result.current.isBlocksMode).toBe(false);
    expect(result.current.isCanvasMode).toBe(false);
    expect(result.current.isFullMode).toBe(true);
  });
});
