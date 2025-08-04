import React from "react";
import Step20Result from "../components/steps/Step20Result";
import { getStep20Template } from "../components/steps/Step20Template";

/**
 * Página de teste para verificar a integração do Step20 com dados reais
 */
const TestStep20Integration: React.FC = () => {
  // Dados de teste simulando um resultado real do quiz
  const mockPrimaryStyle = {
    style: "Natural" as any,
    category: "Natural",
    score: 25,
    points: 25,
    percentage: 85,
    rank: 1,
  };

  const mockSecondaryStyles = [
    {
      style: "Clássico" as any,
      category: "Clássico",
      score: 8,
      points: 8,
      percentage: 25,
      rank: 2,
    },
    {
      style: "Contemporâneo" as any,
      category: "Contemporâneo",
      score: 5,
      points: 5,
      percentage: 15,
      rank: 3,
    },
  ];

  const mockData = {
    primaryStyle: mockPrimaryStyle,
    secondaryStyles: mockSecondaryStyles,
    userName: "Maria Silva",
  };

  // Testar o template diretamente
  const templateBlocks = getStep20Template();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da página de teste */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-[#432818]">
            🧪 Teste Step20 - Página de Resultados
          </h1>
          <p className="text-[#8F7A6A] mt-2">
            Teste da integração entre Step20Template e dados reais do quiz
          </p>
        </div>
      </div>

      {/* Preview dos dados */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-3">
            📊 Dados de Teste Utilizados:
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded">
              <h3 className="font-medium text-blue-700">Estilo Principal:</h3>
              <p>
                <strong>{mockPrimaryStyle.category}</strong> (
                {mockPrimaryStyle.percentage}%)
              </p>
            </div>
            <div className="bg-white p-3 rounded">
              <h3 className="font-medium text-blue-700">
                Estilos Secundários:
              </h3>
              {mockSecondaryStyles.map((style) => (
                <p key={style.category}>
                  {style.category} ({style.percentage}%)
                </p>
              ))}
            </div>
            <div className="bg-white p-3 rounded">
              <h3 className="font-medium text-blue-700">Nome do Usuário:</h3>
              <p>{mockData.userName}</p>
            </div>
          </div>
        </div>

        {/* Preview dos blocos gerados */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-green-800 mb-3">
            🧱 Blocos Gerados ({templateBlocks.length} blocos):
          </h2>
          <div className="space-y-2">
            {templateBlocks.map((block, index) => (
              <div key={index} className="bg-white p-2 rounded text-sm border">
                <strong>
                  {index + 1}. {block.type}
                </strong>
                {block.properties.title && (
                  <span className="text-gray-600 ml-2">
                    - {block.properties.title}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Componente Step20Result real */}
      <Step20Result />
    </div>
  );
};

export default TestStep20Integration;
