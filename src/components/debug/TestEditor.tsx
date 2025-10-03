import React from 'react';

const TestEditor: React.FC = () => {
  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🧪 Test Editor</h1>
      <div className="space-y-4">
        <p className="text-green-600">✅ Editor está carregando corretamente</p>
        <p className="text-blue-600">📍 Versão de teste do editor</p>
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Status dos componentes:</h2>
          <ul className="space-y-1">
            <li>✅ React renderizando</li>
            <li>✅ Tailwind CSS funcionando</li>
            <li>✅ Rotas funcionando</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestEditor;