import React from 'react';
import { EditorProvider } from '@/components/editor/EditorProvider';
import { QuizEditorPro } from '@/components/editor/QuizEditorPro';
import { EditorErrorBoundary } from '@/components/error/EditorErrorBoundary';

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