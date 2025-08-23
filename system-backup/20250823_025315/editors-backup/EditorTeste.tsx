import React from 'react';

const EditorTeste: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">🚀 Editor de Quiz Funcional</h1>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-lg font-semibold text-green-800 mb-2">✅ Rota Funcionando</h2>
            <p className="text-green-700">
              Esta página confirma que o roteamento está funcionando perfeitamente!
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-md font-semibold text-blue-800 mb-2">🎯 Próximos Passos</h3>
            <ul className="text-blue-700 space-y-1">
              <li>• Interface do editor carregada</li>
              <li>• Sistema de navegação ativo</li>
              <li>• Pronto para desenvolvimento</li>
            </ul>
          </div>

          <div className="flex space-x-4 justify-center">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              🎨 Novo Quiz
            </button>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              📝 Editar Existente
            </button>
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              👁️ Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorTeste;
