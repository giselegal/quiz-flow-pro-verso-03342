import React from 'react';
import EditorSimpleLoader from '@/components/editor/EditorSimpleLoader';

/**
 * Rota principal do editor que carrega ModularEditorPro
 */
export const EditorMainRoute: React.FC = () => {
  return (
    <div className="h-screen w-full">
      <EditorSimpleLoader />
    </div>
  );
};

export default EditorMainRoute;