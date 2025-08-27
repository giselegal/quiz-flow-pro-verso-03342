import { QuizFlowProvider } from '@/context/QuizFlowProvider';
import React from 'react';
import { useLocation } from 'wouter';
import { templateLibraryService } from '@/services/templateLibraryService';
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

  return (
    <div>
      <ErrorBoundary>
        <QuizFlowProvider>
          <EditorProvider
            enableSupabase={(import.meta as any)?.env?.VITE_ENABLE_SUPABASE === 'true'}
            funnelId={(import.meta as any)?.env?.VITE_SUPABASE_FUNNEL_ID}
            quizId={(import.meta as any)?.env?.VITE_SUPABASE_QUIZ_ID}
            storageKey="main-editor-state"
          >
            {/* 🎯 EDITOR PRINCIPAL COM CABEÇALHO EDITÁVEL */}
            <EditorInitializer templateId={templateId || undefined} funnelId={funnelId || undefined} />
          </EditorProvider>
        </QuizFlowProvider>
      </ErrorBoundary>
    </div>
  );
};

const EditorInitializer: React.FC<{ templateId?: string; funnelId?: string }> = ({ templateId }) => {
  const editor = React.useRef<ReturnType<typeof requireEditor> | null>(null);
  function requireEditor() {
    // lazy access to avoid import cycles
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('../components/editor/EditorProvider');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ui = require('../components/editor/EditorPro');
    return { useEditor: mod.useEditor, EditorPro: ui.EditorPro } as any;
  }

  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    editor.current = requireEditor();
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (!ready || !templateId) return;
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
  }, [ready, templateId]);

  if (!ready) return null;
  const { EditorPro } = editor.current!;
  return <EditorPro />;
};

export default MainEditor;
