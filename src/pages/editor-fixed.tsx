import React from 'react';

const EditorFixedPage: React.FC = () => {
  console.log('🔥 EditorFixedPage: PÁGINA RENDERIZANDO!');
  
  // Teste simples primeiro
  return (
    <div className="p-4">
      <h1>Editor Fixed - Teste Básico</h1>
      <p>Se você vê esta mensagem, o componente está carregando.</p>
      <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
        <p className="text-red-700">⚠️ Versão simplificada para debug</p>
      </div>
    </div>
  );
};

export default EditorFixedPage;
};

export default EditorFixedPage;
