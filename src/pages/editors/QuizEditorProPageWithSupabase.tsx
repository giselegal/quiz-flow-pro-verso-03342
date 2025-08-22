import { EditorProvider } from '@/components/editor/EditorProvider';
import { QuizEditorPro } from '@/components/editor/QuizEditorPro';
import { EditorErrorBoundary } from '@/components/error/EditorErrorBoundary';
import React from 'react';

/**
 * QuizEditorProPage com integração Supabase habilitada
 * 
 * Para testar:
 * 1. Certifique-se de que tem funnelId ou quizId válidos
 * 2. Abra /editor-pro-supabase
 * 3. Teste drag & drop de componentes
 * 4. Verifique logs no console
 * 5. Confirme sincronização com Supabase
 */
const QuizEditorProPageWithSupabase: React.FC = () => {
  // TODO: Obter IDs reais do contexto/URL/props
  const funnelId = 'test-funnel-id'; // Substitua por ID real
  const quizId = undefined; // Ou use um quizId real

  return (
    <EditorErrorBoundary>
      <EditorProvider
        enableSupabase={true}
        funnelId={funnelId}
        quizId={quizId}
        storageKey="quiz-editor-supabase-state"
      >
        <div className="min-h-screen bg-background">
          {/* Header com informações de debug */}
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-sm">
            <div className="flex items-center gap-4">
              <span className="font-medium text-blue-800">
                🔄 Modo Supabase Ativo
              </span>
              <span className="text-blue-600">
                Funnel ID: {funnelId || 'N/A'}
              </span>
              <span className="text-blue-600">
                Quiz ID: {quizId || 'N/A'}
              </span>
              <span className="text-blue-500 text-xs">
                Verifique console para logs de sincronização
              </span>
            </div>
          </div>
          
          <QuizEditorPro />
        </div>
      </EditorProvider>
    </EditorErrorBoundary>
  );
};

export default QuizEditorProPageWithSupabase;
