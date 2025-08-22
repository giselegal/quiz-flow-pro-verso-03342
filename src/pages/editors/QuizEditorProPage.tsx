import { EditorProvider } from '@/components/editor/EditorProvider';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
import { QuizEditorPro } from '@/components/editor/QuizEditorPro';
import React from 'react';

const QuizEditorProPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <EditorProvider>
        <QuizEditorPro />
      </EditorProvider>
    </ErrorBoundary>
  );
};

export default QuizEditorProPage;
