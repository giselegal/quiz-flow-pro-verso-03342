import { QuizFlowProvider } from '@/context/QuizFlowProvider';
import { templateLibraryService } from '@/services/templateLibraryService';
import React from 'react';
import { useLocation } from 'wouter';
// EditorPro será usado via require dinâmico no EditorInitializer para evitar ciclos
import { EditorProvider } from '../components/editor/EditorProvider';
import { ErrorBoundary } from '../components/editor/ErrorBoundary';
import { EditorTelemetryPanel } from '../components/editor/EditorTelemetryPanel';
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
                  
                  {/* Mantendo apenas o painel de telemetria simples */}
                  <EditorTelemetryPanel quizId={funnelId || undefined} />
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
  // 🎯 CONSENSO CORRIGIDO: EditorPro é quem usa MAIS a arquitetura CORE
  const [EditorProComp, setEditorProComp] = React.useState<React.ComponentType | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('../legacy/editor/EditorPro');
        // Preferir default (ModularEditorPro). Manter fallback por segurança.
        const Comp = (mod as any).default || (mod as any).ModularEditorPro || (mod as any).EditorPro;
        if (!cancelled && Comp) setEditorProComp(() => Comp);
      } catch (e) {
        console.error('Falha ao carregar EditorPro dinamicamente:', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!EditorProComp || !templateId) return;
    // const { useEditor } = editor.current!; // reservado para futuras integrações
    try {
      const tpl = templateLibraryService.getById(templateId);
      if (!tpl) return;
      const stepBlocks: any = {};
      Object.entries(tpl.steps).forEach(([k, arr]: any) => {
        stepBlocks[k] = (arr || []).map((b: any, idx: number) => ({
          id: `${k}-${b.type}-${idx}`,
          type: b.type,
          order: idx,
          properties: b.properties || {},
          content: b.properties || {},
        }));
      });
      // apply into editor state
      // Hook must be used inside component; instead, dispatch via window event and let EditorPro handle if needed
      window.dispatchEvent(new CustomEvent('editor-load-template', { detail: { stepBlocks } }));
    } catch (e) {
      console.warn('Falha ao aplicar template:', e);
    }
  }, [EditorProComp, templateId]);

  if (!EditorProComp) return null;
  const EditorPro = EditorProComp as React.ComponentType;
  return <EditorPro />;
};

export default MainEditor;
