import { EditorProvider } from '@/components/editor/EditorProvider';
import { QuizEditorPro } from '@/components/editor/QuizEditorPro';
import { EditorErrorBoundary } from '@/components/error/EditorErrorBoundary';
import React from 'react';

const QuizEditorProPage: React.FC = () => {
  return (
    <EditorErrorBoundary>
      <EditorProvider>
        <QuizEditorPro />
      </EditorProvider>
    </EditorErrorBoundary>
  );
};

export default QuizEditorProPage;
