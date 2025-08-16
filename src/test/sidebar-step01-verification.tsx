// Verificação de componentes Step01 na sidebar
// src/test/sidebar-step01-verification.tsx

import { AVAILABLE_COMPONENTS } from '@/components/editor/blocks/enhancedBlockRegistry';
import { QUIZ_CONFIGURATION } from '@/config/quizConfiguration';

// Função para gerar blocos do quiz (simulando o que está na sidebar)
const generateQuizBlocks = () => {
  const headerBlock = {
    type: 'quiz-intro-header',
    name: 'Cabeçalho do Quiz',
    description: 'Cabeçalho configurável com logo e barra decorativa',
    category: 'Questões do Quiz',
  };

  const introBlock = {
    type: 'step01-intro',
    name: 'Introdução - Step 1',
    description: 'Componente de introdução para a primeira etapa do quiz',
    category: 'Questões do Quiz',
  };

  // Blocos das etapas do quiz
  const stepBlocks = QUIZ_CONFIGURATION.steps.map((step, index) => ({
    type: `quiz-${step.type}`,
    name: `${step.title}`,
    description: step.description || `Etapa ${index + 1} do quiz de estilo pessoal`,
    category: 'Questões do Quiz',
  }));

  return [headerBlock, introBlock, ...stepBlocks];
};

// Componente de verificação
export const SidebarStep01Verification = () => {
  const quizBlocks = generateQuizBlocks();
  const regularBlocks = AVAILABLE_COMPONENTS.map(comp => ({
    type: comp.type,
    name: comp.label,
    category: comp.category,
    description: `Componente ${comp.label}`
  }));
  const allBlocks = [...quizBlocks, ...regularBlocks];

  // Agrupar por categoria
  const groupedBlocks = allBlocks.reduce(
    (groups, block) => {
      const category = block.category || 'Outros';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(block);
      return groups;
    },
    {} as Record<string, any[]>
  );

  const step01Blocks = allBlocks.filter(
    block => block.type.includes('step01') || block.type.includes('intro')
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Verificação dos Componentes Step01</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Estatísticas</h3>
            <ul className="space-y-1 text-sm">
              <li>Total de blocos: {allBlocks.length}</li>
              <li>Blocos do quiz: {quizBlocks.length}</li>
              <li>Blocos regulares: {regularBlocks.length}</li>
              <li>Blocos step01/intro: {step01Blocks.length}</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Componentes Step01 Encontrados</h3>
            {step01Blocks.length > 0 ? (
              <ul className="space-y-1 text-sm">
                {step01Blocks.map((block, index) => (
                  <li key={index} className="flex justify-between">
                    <span className="font-mono text-blue-600">{block.type}</span>
                    <span className="text-gray-600">{block.category}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-red-600">❌ Nenhum componente step01 encontrado!</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Componentes por Categoria</h3>
        <div className="space-y-4">
          {Object.entries(groupedBlocks).map(([category, blocks]: [string, any[]]) => (
            <div key={category} className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">
                {category} ({blocks.length} componentes)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {blocks.map((block: any, index: number) => (
                  <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                    <div className="font-mono text-blue-600">{block.type}</div>
                    <div className="text-gray-700">{block.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarStep01Verification;
