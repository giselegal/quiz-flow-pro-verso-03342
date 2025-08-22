import { EditorProvider } from '@/components/editor/EditorProvider';
import { EditorErrorBoundary } from '@/components/error/EditorErrorBoundary';
import React from 'react';

// Componente temporário para teste de cache
const QuizEditorProTemp: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-green-500 text-4xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Cache Test Component</h2>
        <p className="text-gray-600 mb-4">
          Se você está vendo esta mensagem, o problema era cache do browser.
        </p>
        <p className="text-sm text-gray-500">
          O QuizEditorPro funcionará normalmente após limpeza do cache.
        </p>
      </div>
    </div>
  );
};

const QuizEditorProPageTemp: React.FC = () => {
  return (
    <EditorErrorBoundary>
      <EditorProvider>
        <QuizEditorProTemp />
      </EditorProvider>
    </EditorErrorBoundary>
  );
};

export default QuizEditorProPageTemp;
