/**
 * 🎯 UNIFIED EDITOR CORE - FASE 2: ARQUITETURA CONSOLIDADA
 * 
 * Editor unificado que substitui todos os editores fragmentados
 * Single source of truth para todo o sistema de edição
 */

import React from 'react';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
import { EditorProvider } from '@/components/editor/provider-alias';

// Simple components for now to avoid complex type issues
const SimpleEditorLayout: React.FC<{ isPreview: boolean }> = ({ isPreview }) => {
  return (
    <div className="flex h-screen bg-background">
      {/* Left Panel - Steps */}
      <div className="w-80 border-r border-border bg-card">
        <div className="p-4">
          <h3 className="text-lg font-semibold">Steps Panel</h3>
          <p className="text-sm text-muted-foreground">Step navigation will be implemented here</p>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        {!isPreview && (
          <div className="border-b border-border bg-card/50 p-4">
            <h3 className="text-lg font-semibold">Editor Toolbar</h3>
            <p className="text-sm text-muted-foreground">Toolbar controls will be implemented here</p>
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1 overflow-hidden p-4">
          <div className="h-full border-2 border-dashed border-border rounded-lg flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Editor Canvas</h3>
              <p className="text-muted-foreground">Visual editor canvas will be implemented here</p>
              {isPreview && (
                <p className="text-sm text-blue-600 mt-2">Preview Mode Active</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface UnifiedEditorCoreProps {
  funnelId?: string;
  isPreview?: boolean;
}

export const UnifiedEditorCore: React.FC<UnifiedEditorCoreProps> = ({
  funnelId,
  isPreview = false
}) => {
  return (
    <ErrorBoundary>
      <EditorProvider funnelId={funnelId}>
        <SimpleEditorLayout isPreview={isPreview} />
      </EditorProvider>
    </ErrorBoundary>
  );
};

export default UnifiedEditorCore;