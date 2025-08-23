import React from 'react';

/**
 * 🧪 TESTE SUPER SIMPLES - SEM PROVIDERS
 *
 * Testando se o problema é nos providers ou no React básico
 */
const MainEditor: React.FC = () => {
  return (
    <div className="h-screen w-full bg-blue-50 p-8">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">🎯 Editor Teste Básico</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-700">Se você está vendo esta mensagem, o React está funcionando!</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => alert('Clique funcionando!')}
        >
          Testar Clique
        </button>
      </div>
    </div>
  );
};

export default MainEditor;
