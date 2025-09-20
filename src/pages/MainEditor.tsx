import React from 'react';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
import { EditorProvider } from '@/components/editor/EditorProvider';
import { FunnelsProvider } from '@/context/FunnelsContext';
import { EditorPro } from '@/legacy/editor/EditorPro';
// import { SimplifiedOptimizedEditor } from '@/components/editor/EditorPro/components/SimplifiedOptimizedEditor';

/**
 * 🎯 MAIN EDITOR - ESTRUTURA ROBUSTA E PROFISSIONAL
 * 
 * Arquitetura limpa e direta:
 * ✅ FunnelsProvider - Context de funnels necessário
 * ✅ EditorProvider (1158 linhas) - Estado robusto com Supabase
 * ✅ EditorPro (989 linhas) - Editor 4 colunas completo
 * ✅ ErrorBoundary - Tratamento de erros
 * ✅ Zero abstrações desnecessárias
 * 
 * Funcionalidades garantidas:
 * - 4 colunas responsivas
 * - 21 etapas dinâmicas
 * - Drag & Drop robusto
 * - Persistência Supabase
 * - Validação centralizada
 * - Cálculo automático de resultados
 */
const MainEditor: React.FC = () => {
  const funnelId = 'quiz-style-21-steps';
  const quizId = 'professional-quiz-editor';

  return (
    <div className="h-screen w-full bg-background">
      <ErrorBoundary>
        <FunnelsProvider debug={true}>
          <EditorProvider
            enableSupabase={true}
            funnelId={funnelId}
            quizId={quizId}
            storageKey="main-editor-professional"
            initial={{
              currentStep: 1,
              selectedBlockId: null,
              isSupabaseEnabled: true,
              databaseMode: 'supabase'
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