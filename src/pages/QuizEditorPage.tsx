import IntegratedQuizEditor from '@/components/editor/quiz-specific/IntegratedQuizEditor';
import { toast } from '@/components/ui/use-toast';
import { EditorProvider } from '@/context/EditorContext';
import { ScrollSyncProvider } from '@/context/ScrollSyncContext';
import React from 'react';

/**
 * 🎯 PÁGINA DO EDITOR DE QUIZ INTEGRADO
 *
 * Página dedicada ao Editor de Quiz que utiliza o sistema
 * integrado com /editor-fixed e todos os providers necessários.
 */
const QuizEditorPage: React.FC = () => {
  const handleSave = () => {
    toast({
      title: 'Quiz Salvo!',
      description: 'Seu quiz foi salvo e adicionado ao editor principal',
    });
  };

  const handlePreview = () => {
    // Implementar preview em modal ou nova aba
    console.log('🎯 Preview do quiz solicitado');
    toast({
      title: 'Preview',
      description: 'Funcionalidade de preview será implementada',
    });
  };

  return (
    <EditorProvider>
      <ScrollSyncProvider>
        <div className="min-h-screen bg-[#FAF9F7]">
          <div className="container mx-auto p-4 h-screen">
            <IntegratedQuizEditor
              onSave={handleSave}
              onPreview={handlePreview}
              className="h-full"
            />
          </div>
        </div>
      </ScrollSyncProvider>
    </EditorProvider>
  );
};

export default QuizEditorPage;
