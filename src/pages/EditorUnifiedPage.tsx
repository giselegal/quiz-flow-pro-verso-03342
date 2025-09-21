/**
 * 🎯 EDITOR UNIFIED PAGE - PONTO DE ENTRADA UNIFICADO
 * 
 * Página única que substitui todas as variações de editor:
 * - EditorProPageSimple
 * - EditorProConsolidatedPage  
 * - MainEditor
 * - MainEditorUnified
 * 
 * ✅ SimpleBuilderProvider como base única
 * ✅ EditorProUnified com todas as funcionalidades
 * ✅ Suporte a parâmetros dinâmicos (funnelId, templateId)
 * ✅ Fallback inteligente para canvas vazio
 */

import React from 'react';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
import ModernUnifiedEditor from './editor/ModernUnifiedEditor';

interface EditorUnifiedPageProps {
  initialStep?: number;
  funnelId?: string;
}

const EditorUnifiedPage: React.FC<EditorUnifiedPageProps> = ({
  initialStep = 1,
  funnelId: propFunnelId
}) => {
  // 🔧 Capturar parâmetros dinâmicos da URL
  const urlParams = new URLSearchParams(window.location.search);
  const urlFunnelId = urlParams.get('funnel');
  const urlTemplateId = urlParams.get('template');

  // Lógica de prioridade: props > URL funnel > URL template > fallback
  const resolvedFunnelId = propFunnelId || urlFunnelId || (urlTemplateId ? `template-${urlTemplateId}` : undefined);

  console.log('🎯 EditorUnifiedPage: Parâmetros consolidados:', {
    propFunnelId,
    urlFunnelId,
    urlTemplateId,
    resolvedFunnelId,
    initialStep
  });

  return (
    <div className="h-screen w-full bg-background">
      <ErrorBoundary>
        <ModernUnifiedEditor
          funnelId={resolvedFunnelId}
          mode="visual"
        />
      </ErrorBoundary>
    </div>
  );
};

export default EditorUnifiedPage;