import React from 'react';
import { EditorProvider } from '@/components/editor/EditorProvider';
import { QuizEditorPro } from '@/components/editor/QuizEditorPro';

const QuizEditorProPage: React.FC = () => {
  return (
    <EditorProvider>
      <QuizEditorPro />
    </EditorProvider>
  );
};

export default QuizEditorProPage;