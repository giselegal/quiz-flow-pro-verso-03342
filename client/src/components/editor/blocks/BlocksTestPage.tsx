import React from 'react';
import { ComponentsSidebar } from '../../../src/components/editor/sidebar/ComponentsSidebar';

export const BlocksTestPage: React.FC = () => {
  const handleComponentSelect = (type: string) => {
    console.log('Selected component:', type);
    alert(`Componente selecionado: ${type}`);
  };

  return (
    <div className="blocks-test-page h-screen flex">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0">
        <ComponentsSidebar onComponentSelect={handleComponentSelect} />
      </div>
      
      {/* Content */}
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#432818] mb-4">
            🧱 Teste da Aba "Blocos"
          </h1>
          
          <div className="bg-white rounded-lg border border-[#B89B7A]/20 p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#432818] mb-3">
              ✅ Componentes Implementados
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h3 className="font-medium text-[#B89B7A]">📝 Básicos:</h3>
                <ul className="space-y-1 text-[#8F7A6A]">
                  <li>• Título (H1-H4)</li>
                  <li>• Texto simples</li>
                  <li>• Texto rico (HTML)</li>
                  <li>• Botão interativo</li>
                  <li>• Imagem com placeholder</li>
                  <li>• Espaçador configurável</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-[#B89B7A]">❓ Quiz:</h3>
                <ul className="space-y-1 text-[#8F7A6A]">
                  <li>• Introdução do Quiz</li>
                  <li>• Pergunta Avançada 🎯</li>
                  <li>• Barra de Progresso</li>
                  <li>• Resultado Personalizado</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#B89B7A]/20 p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#432818] mb-3">
              🎯 Recursos da Nova Aba "Blocos"
            </h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h3 className="font-medium text-green-600">🔍 Busca Inteligente</h3>
                <p className="text-[#8F7A6A]">
                  Busque por nome, descrição ou tags dos componentes
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-blue-600">⭐ Populares</h3>
                <p className="text-[#8F7A6A]">
                  Componentes mais usados destacados
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-purple-600">👑 Pro Features</h3>
                <p className="text-[#8F7A6A]">
                  Recursos avançados claramente identificados
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#B89B7A]/20 p-6">
            <h2 className="text-xl font-semibold text-[#432818] mb-3">
              🚀 Como Testar
            </h2>
            <ol className="space-y-2 text-[#8F7A6A]">
              <li><span className="font-medium text-[#B89B7A]">1.</span> Use a barra de busca no topo</li>
              <li><span className="font-medium text-[#B89B7A]">2.</span> Navegue pelas categorias (Populares, Básicos, Quiz, etc.)</li>
              <li><span className="font-medium text-[#B89B7A]">3.</span> Clique em qualquer componente</li>
              <li><span className="font-medium text-[#B89B7A]">4.</span> Veja a confirmação de seleção</li>
              <li><span className="font-medium text-[#B89B7A]">5.</span> Observe os badges: ⭐ Popular, 👑 Pro</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
