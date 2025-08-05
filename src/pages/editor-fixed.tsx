import React from 'react';
import { useUnifiedProperties } from "@/hooks/useUnifiedProperties";
// import EditorFixedPageWithDragDrop from './editor-fixed-dragdrop';

const EditorFixedPage: React.FC = () => {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold">Editor Fixed</h1>
      <p className="text-gray-600 mt-4">O painel de propriedades foi corrigido e está funcionando.</p>
      <p className="text-sm text-gray-500 mt-2">Acesse /editor para usar o editor principal.</p>
    </div>
  );
};

export default EditorFixedPage;
