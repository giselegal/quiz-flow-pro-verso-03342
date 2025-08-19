import React from 'react';
import { EditorProvider } from '@/context/EditorContext';
import { FunnelsProvider } from '@/context/FunnelsContext';
import { EditorQuizProvider } from '@/context/EditorQuizContext';
import { Quiz21StepsProvider } from '@/components/quiz/Quiz21StepsProvider';
import { QuizFlowController } from '@/components/editor/quiz/QuizFlowController';
import { QuizFlowPageModular } from '@/components/editor/quiz/QuizFlowPageModular';

/**
 * 🎯 PÁGINA PRINCIPAL DO EDITOR - ARQUITETURA MODULAR
 * 
 * Nova arquitetura modular completa para gerenciamento
 * das 21 etapas do quiz com preview idêntico à produção
 */
const EditorPage: React.FC = () => {
  return (
    <FunnelsProvider debug={true}>
      <EditorProvider>
        <EditorQuizProvider>
          <Quiz21StepsProvider debug={true}>
            <QuizFlowController 
              initialStep={1}
              mode="editor"
            >
              <div className="h-screen w-full overflow-hidden bg-background">
                <QuizFlowPageModular />
              </div>
            </QuizFlowController>
          </Quiz21StepsProvider>
        </EditorQuizProvider>
      </EditorProvider>
    </FunnelsProvider>
  );
};

export default EditorPage;