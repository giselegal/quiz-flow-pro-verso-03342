import React from 'react';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
import { EditorProvider } from '@/components/editor/EditorProvider';
import { FunnelsProvider } from '@/context/FunnelsContext';
import { EditorPro } from '@/legacy/editor/EditorPro';
// import { SimplifiedOptimizedEditor } from '@/components/editor/EditorPro/components/SimplifiedOptimizedEditor';

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
  
  // Lógica de prioridade: funnelId real > templateId > fallback
  const funnelId = urlFunnelId || (urlTemplateId ? `template-${urlTemplateId}` : 'new-funnel');
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
          <EditorProvider
            enableSupabase={!!urlFunnelId} // Ativar Supabase apenas para funis reais
            funnelId={funnelId}
            quizId={quizId}
            storageKey={`editor-${funnelId}`}
            initial={{
              currentStep: 1,
              selectedBlockId: null,
              isSupabaseEnabled: !!urlFunnelId,
              databaseMode: urlFunnelId ? 'supabase' : 'local'
            }}
          >
            <EditorPro className="h-full w-full" />
            {/* Para testar otimizações, descomente a linha abaixo e comente a de cima:
            <SimplifiedOptimizedEditor />
            */}
          </EditorProvider>
        </FunnelsProvider>
      </ErrorBoundary>
    </div>
  );
};

export default MainEditor;