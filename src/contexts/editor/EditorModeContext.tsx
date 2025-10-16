/**
 * 🎯 TK-CANVAS-04: EDITOR MODE PROVIDER
 * 
 * Store único para controlar modo de visualização do editor.
 * - Substituir activeTab, isPreviewing, isPreviewMode
 * - Single source of truth para viewMode
 * - Computed properties para fácil acesso
 * - Device preview mode para responsividade
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ViewMode = 'edit' | 'preview';
export type PreviewDevice = 'desktop' | 'mobile' | 'tablet';

interface EditorModeState {
  // Core state
  viewMode: ViewMode;
  previewDevice: PreviewDevice;
  
  // 🆕 Preview session data (para quiz interativo)
  previewSessionData: Record<string, any>;
  
  // Actions
  setViewMode: (mode: ViewMode) => void;
  setPreviewDevice: (device: PreviewDevice) => void;
  toggleViewMode: () => void;
  updatePreviewSessionData: (key: string, value: any) => void;
  resetPreviewSession: () => void;
  
  // Computed properties (getters)
  isEditMode: () => boolean;
  isPreviewMode: () => boolean;
}

/**
 * 🎯 EDITOR MODE STORE
 * Store Zustand centralizado para controle de modo de visualização
 */
export const useEditorMode = create<EditorModeState>()(
  devtools(
    (set, get) => ({
      // Initial state
      viewMode: 'edit',
      previewDevice: 'desktop',
      previewSessionData: {},
      
      // Actions
      setViewMode: (mode) => {
        console.log('🔄 EditorMode: Mudando para', mode);
        // Reset preview session ao entrar em preview mode
        if (mode === 'preview') {
          set({ viewMode: mode, previewSessionData: {} });
        } else {
          set({ viewMode: mode });
        }
      },
      
      setPreviewDevice: (device) => {
        console.log('📱 EditorMode: Mudando device para', device);
        set({ previewDevice: device });
      },
      
      toggleViewMode: () => {
        const current = get().viewMode;
        const next = current === 'edit' ? 'preview' : 'edit';
        console.log('🔄 EditorMode: Toggle', current, '→', next);
        get().setViewMode(next);
      },
      
      updatePreviewSessionData: (key, value) => {
        console.log('💾 EditorMode: Atualizando preview session', { key, value });
        set(state => ({
          previewSessionData: {
            ...state.previewSessionData,
            [key]: value
          }
        }));
      },
      
      resetPreviewSession: () => {
        console.log('🔄 EditorMode: Resetando preview session');
        set({ previewSessionData: {} });
      },
      
      // Computed properties
      isEditMode: () => get().viewMode === 'edit',
      isPreviewMode: () => get().viewMode === 'preview',
    }),
    {
      name: 'editor-mode-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

/**
 * Hook para acessar apenas o viewMode (otimizado)
 */
export const useViewMode = () => useEditorMode((state) => state.viewMode);

/**
 * Hook para acessar apenas o previewDevice (otimizado)
 */
export const usePreviewDevice = () => useEditorMode((state) => state.previewDevice);

/**
 * Hook para verificar se está em modo edição (otimizado)
 */
export const useIsEditMode = () => useEditorMode((state) => state.viewMode === 'edit');

/**
 * Hook para verificar se está em modo preview (otimizado)
 */
export const useIsPreviewMode = () => useEditorMode((state) => state.viewMode === 'preview');

export default useEditorMode;
