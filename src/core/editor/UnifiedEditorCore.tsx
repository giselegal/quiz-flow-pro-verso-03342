/**
 * 🎯 UNIFIED EDITOR CORE - FASE 2: ARQUITETURA CONSOLIDADA
 * 
 * Editor unificado que substitui todos os editores fragmentados
 * Single source of truth para todo o sistema de edição
 */

import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
import { EditorProvider } from '@/components/editor/EditorProvider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useUnifiedStepNavigation } from '@/hooks/useUnifiedStepNavigation';

// Lazy load components para otimização
const EditorCanvas = lazy(() => import('@/components/editor/EditorPro/components/EditorCanvas'));
const EditorToolbar = lazy(() => import('@/components/editor/EditorPro/components/EditorToolbar'));
const StepsPanel = lazy(() => import('@/components/editor/StepsPanel'));

interface UnifiedEditorCoreProps {
  funnelId?: string;
  templateId?: string;
  isPreview?: boolean;
}

export const UnifiedEditorCore: React.FC<UnifiedEditorCoreProps> = ({
  funnelId,
  templateId,
  isPreview = false
}) => {
  return (
    <ErrorBoundary>
      <EditorProvider funnelId={funnelId} templateId={templateId}>
        <div className="flex h-screen bg-background">
          {/* Left Panel - Steps */}
          <div className="w-80 border-r border-border bg-card">
            <Suspense fallback={<LoadingSpinner />}>
              <StepsPanel />
            </Suspense>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            {!isPreview && (
              <div className="border-b border-border bg-card/50">
                <Suspense fallback={<LoadingSpinner />}>
                  <EditorToolbar />
                </Suspense>
              </div>
            )}

            {/* Canvas */}
            <div className="flex-1 overflow-hidden">
              <Suspense fallback={<LoadingSpinner />}>
                <EditorCanvas isPreview={isPreview} />
              </Suspense>
            </div>
          </div>
        </div>
      </EditorProvider>
    </ErrorBoundary>
  );
};

export default UnifiedEditorCore;