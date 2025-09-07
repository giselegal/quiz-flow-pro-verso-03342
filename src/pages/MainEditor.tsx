import { QuizFlowProvider } from '@/context/QuizFlowProvider';
import { templateLibraryService } from '@/services/templateLibraryService';
import React from 'react';
import { useLocation } from 'wouter';
// EditorPro será usado via require dinâmico no EditorInitializer para evitar ciclos
import { EditorProvider } from '../components/editor/EditorProvider';
import { ErrorBoundary } from '../components/editor/ErrorBoundary';
// Painel de telemetria desativado conforme solicitado
// import { EditorTelemetryPanel } from '../components/editor/EditorTelemetryPanel';
// Dashboard de Análise de Etapas desativado conforme solicitado
// import { StepAnalyticsDashboard } from '../components/dev/StepAnalyticsDashboard';
import { FunnelsProvider } from '@/context/FunnelsContext';
import { EditorQuizProvider } from '@/context/EditorQuizContext';
import { Quiz21StepsProvider } from '@/components/quiz/Quiz21StepsProvider';

/**
 * 🎯 EDITOR PRINCIPAL - ÚNICO E LIMPO
 *
 * Editor consolidado sem aninhamento excessivo
 * - Drag & drop funcional
 * - 21 etapas carregando automaticamente
 * - Interface limpa e responsiva
 * - Sem conflitos entre múltiplos editores
 * - Preview Lovable removido para evitar interferência no DnD
 * - Cabeçalho editável DENTRO do EditorPro ✅
 */
const MainEditor: React.FC = () => {
  const [location] = useLocation();
  const params = React.useMemo(() => new URLSearchParams(location.split('?')[1] || ''), [location]);
  const templateId = params.get('template');
  const funnelId = params.get('funnel');
  const stepParam = params.get('step');
  const initialStep = stepParam ? Math.max(1, Math.min(21, parseInt(stepParam))) : undefined;

  // Dashboard de Análise de Etapas desativado conforme solicitado
  // const [showFullAnalytics, setShowFullAnalytics] = React.useState(false);

  return (
    <div>
      <ErrorBoundary>
        <FunnelsProvider debug={true}>
          <EditorProvider
            enableSupabase={(import.meta as any)?.env?.VITE_ENABLE_SUPABASE === 'true'}
            // Prefer ID vindo da URL; cai para env se ausente
            funnelId={funnelId || (import.meta as any)?.env?.VITE_SUPABASE_FUNNEL_ID}
            // Usar quizId do env, senão funnelId da URL como fallback para chaves locais (drafts)
            quizId={(import.meta as any)?.env?.VITE_SUPABASE_QUIZ_ID || funnelId || 'local-funnel'}
            storageKey="main-editor-state"
            initial={initialStep ? { currentStep: initialStep } : undefined}
          >
            <EditorQuizProvider>
              <Quiz21StepsProvider debug={true} initialStep={initialStep}>
                <QuizFlowProvider initialStep={initialStep} totalSteps={21}>
                  {/* 🎯 EDITOR PRINCIPAL COM CABEÇALHO EDITÁVEL */}
                  {/* Dashboard de Análise de Etapas desativado conforme solicitado */}
                  {/* <div className="fixed top-4 right-4 z-50">
                    <button
                      onClick={() => setShowFullAnalytics(!showFullAnalytics)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      {showFullAnalytics ? 'Painel Simples' : 'Dashboard Completo'}
                    </button>
                  </div> */}

                  <EditorInitializer
                    templateId={templateId || undefined}
                    funnelId={funnelId || undefined}
                  />

                  {/* Dashboard de Análise de Etapas desativado */}
                  {/* {showFullAnalytics ? (
                    <StepAnalyticsDashboard totalSteps={21} />
                  ) : (
                    <EditorTelemetryPanel quizId={funnelId || undefined} />
                  )} */}

                  {/* Painel de telemetria também desativado conforme solicitado */}
                  {/* <EditorTelemetryPanel quizId={funnelId || undefined} /> */}
                </QuizFlowProvider>
              </Quiz21StepsProvider>
            </EditorQuizProvider>
          </EditorProvider>
        </FunnelsProvider>
      </ErrorBoundary>
    </div>
  );
};

const EditorInitializer: React.FC<{ templateId?: string; funnelId?: string }> = ({
  templateId,
}) => {
  // 🎯 CONSOLIDAÇÃO: Usando UnifiedEditor como ponto de entrada único
  const [UnifiedEditorComp, setUnifiedEditorComp] = React.useState<React.ComponentType | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('../components/editor/UnifiedEditor');
        const Comp = mod.default || mod.UnifiedEditor;
        if (!cancelled && Comp) setUnifiedEditorComp(() => Comp);
      } catch (e) {
        console.error('Falha ao carregar UnifiedEditor:', e);
        // Fallback para EditorPro legacy
        try {
          const legacyMod = await import('../legacy/editor/EditorPro');
          const LegacyComp = legacyMod.default || legacyMod.EditorPro;
          if (!cancelled && LegacyComp) setUnifiedEditorComp(() => LegacyComp);
        } catch (legacyError) {
          console.error('Falha ao carregar fallback EditorPro:', legacyError);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!UnifiedEditorComp || !templateId) return;
    try {
      const tpl = templateLibraryService.getById(templateId);
      if (!tpl) return;
      const stepBlocks: any = {};
      Object.entries(tpl.steps).forEach(([k, arr]: any) => {
        stepBlocks[k] = (arr || []).map((b: any, idx: number) => ({
          id: b.id || `${k}-${b.type}-${idx}`,
          type: b.type,
          order: typeof b.order === 'number' ? b.order : idx,
          properties: b.properties || {},
          // CORREÇÃO: usar conteúdo correto (b.content) para preservar options, etc.
          content: b.content || {},
        }));
      });
      // Carregar template via evento para compatibilidade
      window.dispatchEvent(new CustomEvent('editor-load-template', { detail: { stepBlocks } }));
    } catch (e) {
      console.warn('Falha ao aplicar template:', e);
    }
  }, [UnifiedEditorComp, templateId]);

  if (!UnifiedEditorComp) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando editor...</p>
        </div>
      </div>
    );
  }

  const UnifiedEditor = UnifiedEditorComp as React.ComponentType;
  return <UnifiedEditor />;
};

export default MainEditor;
