import React from 'react';

/**
 * 🧪 EDITOR SUPER SIMPLES - TESTE BÁSICO
 *
 * Para verificar se o React está funcionando
 */
const SimpleEditor: React.FC = () => {
  return (
    <div className="h-screen w-full bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">✅ Editor Funcionando!</h1>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">🔧 Componentes</h2>
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded cursor-pointer hover:bg-blue-100">
                📝 Texto
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded cursor-pointer hover:bg-green-100">
                🖼️ Imagem
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded cursor-pointer hover:bg-purple-100">
                🔘 Botão
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border min-h-[400px]">
            <h2 className="text-xl font-semibold mb-4">🎨 Canvas</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-full flex items-center justify-center text-gray-500">
              Arraste componentes aqui
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleEditor;
