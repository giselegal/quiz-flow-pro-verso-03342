import { QuizEditorExample } from '@/components/editor/quiz/QuizEditorExample';
import { Quiz21StepsProvider } from '@/components/quiz/Quiz21StepsProvider';
import { EditorProvider } from '@/context/EditorContext';
import { EditorQuizProvider } from '@/context/EditorQuizContext';
import { FunnelsProvider } from '@/context/FunnelsContext';
import React from 'react';

/**
 * 🎯 PÁGINA DO EDITOR MODULAR DAS 21 ETAPAS
 *
 * Implementação da nova estrutura modular para gerenciamento
 * das 21 etapas com preview idêntico à produção
 */
const EditorModularPage: React.FC = () => {
  return (
    <FunnelsProvider debug={true}>
      <EditorProvider>
        <EditorQuizProvider>
          <Quiz21StepsProvider debug={true}>
            <div className="h-screen w-full overflow-hidden bg-background">
              <QuizEditorExample initialStep={1} />
            </div>
          </Quiz21StepsProvider>
        </EditorQuizProvider>
      </EditorProvider>
    </FunnelsProvider>
  );
};

export default EditorModularPage;
