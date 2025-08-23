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
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-[#6B4F43] mb-4">
                    Editor Modular - 21 Etapas
                  </h1>
                  <p className="text-[#8B7355]">Sistema modular em desenvolvimento</p>
                </div>
              </div>
            </div>
          </Quiz21StepsProvider>
        </EditorQuizProvider>
      </EditorProvider>
    </FunnelsProvider>
  );
};

export default EditorModularPage;
