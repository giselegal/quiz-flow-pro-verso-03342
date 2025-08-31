import { QuizFlowProvider } from '@/context/QuizFlowProvider';
import { templateLibraryService } from '@/services/templateLibraryService';
import React from 'react';
import { useLocation } from 'wouter';
// EditorPro será usado via require dinâmico no EditorInitializer para evitar ciclos
import { EditorProvider } from '../components/editor/EditorProvider';
import { ErrorBoundary } from '../components/editor/ErrorBoundary';

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

  return (
    <div>
      <ErrorBoundary>
        <QuizFlowProvider>
          <EditorProvider
            enableSupabase={(import.meta as any)?.env?.VITE_ENABLE_SUPABASE === 'true'}
            // Prefer ID vindo da URL; cai para env se ausente
            funnelId={funnelId || (import.meta as any)?.env?.VITE_SUPABASE_FUNNEL_ID}
            // Usar quizId do env, senão funnelId da URL como fallback para chaves locais (drafts)
            quizId={(import.meta as any)?.env?.VITE_SUPABASE_QUIZ_ID || funnelId || 'local-funnel'}
            storageKey="main-editor-state"
            initial={initialStep ? { currentStep: initialStep } : undefined}
          >
            {/* 🎯 EDITOR PRINCIPAL COM CABEÇALHO EDITÁVEL */}
            <EditorInitializer
              templateId={templateId || undefined}
              funnelId={funnelId || undefined}
            />
          </EditorProvider>
        </QuizFlowProvider>
      </ErrorBoundary>
    </div>
  );
};

const EditorInitializer: React.FC<{ templateId?: string; funnelId?: string }> = ({
  templateId,
}) => {
  // Carregar EditorPro dinamicamente para evitar ciclos e manter ESM compatível
  const [EditorProComp, setEditorProComp] = React.useState<React.ComponentType | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('../components/editor/EditorPro');
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
