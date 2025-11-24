/**
 * 🎮 useEditorMode - State Machine para Modos do Editor
 * 
 * Centraliza a lógica dos 3 modos de visualização:
 * - Edit: Edição completa com WYSIWYG
 * - Preview Live: Visualização com dados locais (não salvos)
 * - Preview Production: Visualização com dados publicados
 * 
 * @version 1.0.0
 */

import { useMemo } from 'react';

export type CanvasMode = 'edit' | 'preview';
export type PreviewMode = 'live' | 'production';
export type DataSource = 'local' | 'local-synced' | 'production';

export interface EditorModeConfig {
  /** Permite edição */
  isEditable: boolean;
  /** Fonte de dados */
  dataSource: DataSource;
  /** Mostra validação em tempo real */
  showValidation: boolean;
  /** Mostra indicador de draft */
  showDraftIndicator: boolean;
  /** Badge descritivo */
  badge: {
    icon: string;
    text: string;
    color: 'blue' | 'green';
  };
  /** Descrição para tooltip */
  description: string;
}

export interface UseEditorModeOptions {
  canvasMode: CanvasMode;
  previewMode: PreviewMode;
}

/**
 * Hook que retorna configuração do modo atual do editor
 */
export function useEditorMode({ canvasMode, previewMode }: UseEditorModeOptions): EditorModeConfig {
  return useMemo(() => {
    // Modo Edição
    if (canvasMode === 'edit') {
      return {
        isEditable: true,
        dataSource: 'local',
        showValidation: true,
        showDraftIndicator: true,
        badge: {
          icon: '✏️',
          text: 'Editando',
          color: 'blue',
        },
        description: 'Modo edição - mudanças aparecem instantaneamente (WYSIWYG)',
      };
    }

    // Modo Preview Live (dados do editor)
    if (previewMode === 'live') {
      return {
        isEditable: false,
        dataSource: 'local-synced',
        showValidation: false,
        showDraftIndicator: true,
        badge: {
          icon: '📝',
          text: 'Editor',
          color: 'blue',
        },
        description: 'Visualizando dados do editor (incluindo não salvos)',
      };
    }

    // Modo Preview Production (dados publicados)
    return {
      isEditable: false,
      dataSource: 'production',
      showValidation: false,
      showDraftIndicator: false,
      badge: {
        icon: '✅',
        text: 'Publicado',
        color: 'green',
      },
      description: 'Visualizando dados publicados (versão final)',
    };
  }, [canvasMode, previewMode]);
}

export default useEditorMode;
