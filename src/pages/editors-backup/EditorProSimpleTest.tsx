import React from 'react';

/**
 * 🧪 Teste simples para verificar se a rota funciona
 */
const EditorProSimpleTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-4xl mb-4">🚀</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">EditorPro - Teste Simples</h1>
        <p className="text-gray-600 mb-6">Esta página confirma que a rota está funcionando!</p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm">
            ✅ Rota /editor-pro-modular funcionando
            <br />
            ✅ Componente carregando corretamente
            <br />✅ Pronto para implementar o EditorPro completo
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditorProSimpleTest;
