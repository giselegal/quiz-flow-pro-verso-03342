import React from 'react';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
import SimpleBuilderProvider from '@/components/editor/SimpleBuilderProviderFixed';
import { FunnelsProvider } from '@/context/FunnelsContext';
import ModularEditorPro from '@/components/editor/EditorPro/components/ModularEditorPro';

/**
 * 🎯 MAIN EDITOR - ESTRUTURA ROBUSTA COM LOADING DINÂMICO
 * 
 * Correções implementadas:
 * ✅ FunnelId dinâmico da URL (não hardcoded)
 * ✅ Prioridade: funnelId real > templateId > novo funil
 * ✅ EditorProvider com Supabase ativo
 * ✅ Loading inteligente de funis/templates
 * ✅ Fallback para template quando necessário
 */
const MainEditor: React.FC = () => {
  // 🔧 CORREÇÃO CRÍTICA: Capturar parâmetros dinâmicos da URL
  const urlParams = new URLSearchParams(window.location.search);
  const urlFunnelId = urlParams.get('funnel');
  const urlTemplateId = urlParams.get('template');
  
  // Lógica de prioridade: funnelId real > templateId > sem parâmetros = undefined (canvas vazio)
  const funnelId = urlFunnelId || (urlTemplateId ? `template-${urlTemplateId}` : undefined);
  const quizId = urlFunnelId || urlTemplateId || 'professional-quiz-editor';
  
  console.log('🎯 MainEditor: Parâmetros dinâmicos:', {
    urlFunnelId,
    urlTemplateId,
    resolvedFunnelId: funnelId,
    resolvedQuizId: quizId
  });

  return (
    <div className="h-screen w-full bg-background">
      <ErrorBoundary>
        <FunnelsProvider debug={true}>
          <SimpleBuilderProvider funnelId={funnelId}>
            <ModularEditorPro />
          </SimpleBuilderProvider>
        </FunnelsProvider>
      </ErrorBoundary>
    </div>
  );
};

export default MainEditor;