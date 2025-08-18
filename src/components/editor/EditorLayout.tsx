import { SchemaDrivenEditorResponsive } from '@/components/editor/SchemaDrivenEditorResponsive';
import { EditorToolbar } from '@/components/editor/toolbar/EditorToolbar';
import React from 'react';

/**
 * 🏗️ LAYOUT PRINCIPAL DO EDITOR
 *
 * Estrutura principal que combina:
 * - Toolbar superior com controles principais
 * - Editor responsivo de 4 colunas
 *
 * O SchemaDrivenEditorResponsive já integra:
 * ✅ FourColumnLayout
 * ✅ FunnelStagesPanel (21 etapas)
 * ✅ ComponentsSidebar
 * ✅ CanvasDropZone
 * ✅ PropertiesPanel
 */
export const EditorLayout: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col bg-background">
      {/* 🎨 TOOLBAR SUPERIOR */}
      <EditorToolbar />

      {/* 🏗️ EDITOR PRINCIPAL DE 4 COLUNAS */}
      <div className="flex-1 overflow-hidden">
        <SchemaDrivenEditorResponsive className="h-full" />
      </div>
    </div>
  );
};
