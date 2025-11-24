/**
 * 🎮 useEditorMode - State Machine para Modos do Editor
 * 
 * Centraliza a lógica dos 2 modos de visualização:
 * - Preview Live: Edição ao vivo com dados locais (WYSIWYG)
 * - Preview Production: Visualização com dados publicados
 * 
 * @version 2.0.0
 */

import { useMemo } from 'react';

export type PreviewMode = 'live' | 'production';
export type DataSource = 'local' | 'production';

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
  previewMode: PreviewMode;
}

/**
 * Hook que retorna configuração do modo atual do editor
 */
export function useEditorMode({ previewMode }: UseEditorModeOptions): EditorModeConfig {
  return useMemo(() => {
    // Modo Preview Live (edição ao vivo)
    if (previewMode === 'live') {
      return {
        isEditable: true,
        dataSource: 'local',
        showValidation: true,
        showDraftIndicator: true,
        badge: {
          icon: '📝',
          text: 'Editando',
          color: 'blue',
        },
        description: 'Edição ao vivo - mudanças aparecem instantaneamente',
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
  }, [previewMode]);
}

export default useEditorMode;
