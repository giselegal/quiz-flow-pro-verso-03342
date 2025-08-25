import { EditorProvider } from '@/components/editor/EditorProvider';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
// import { QuizEditorPro } from '@/components/editor/QuizEditorPro'; // Component não encontrado
import React from 'react';

const QuizEditorProPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <EditorProvider>
        <div className="p-4 text-center">
          <p>QuizEditorPro em manutenção - componente não encontrado</p>
        </div>
      </EditorProvider>
    </ErrorBoundary>
  );
};

export default QuizEditorProPage;
