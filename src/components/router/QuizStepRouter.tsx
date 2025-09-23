/**
 * 🔀 QUIZ STEP ROUTER - Roteamento Inteligente
 * 
 * Determina se uma etapa deve usar componente especializado
 * ou o editor modular universal.
 */

// @ts-nocheck
import React from 'react';

export interface QuizStepRouterProps {
  currentStep: number;
  totalSteps?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onStepChange?: (step: number) => void;
}

export class QuizStepRouter {
  /**
   * 🎯 Determina o tipo de renderização para uma etapa
   */
  static getStepType(stepNumber: number): 'specialized' | 'modular' {
    // Etapas que precisam de componentes especializados
    const specializedSteps = [1, 20, 21];
    return specializedSteps.includes(stepNumber) ? 'specialized' : 'modular';
  }

  /**
   * 🧩 Determina se é uma etapa de transição
   */
  static isTransitionStep(stepNumber: number): boolean {
    const transitionSteps = [12, 19];
    return transitionSteps.includes(stepNumber);
  }

  /**
   * 🎨 Obtém informações sobre o tipo de etapa
   */
  static getStepInfo(stepNumber: number) {
    if (stepNumber === 1) {
      return {
        type: 'specialized' as const,
        category: 'intro',
        title: 'Coleta de Nome',
        description: 'Página de introdução com coleta de dados do usuário',
        expectedBehavior: 'Input de nome com validação obrigatória',
      };
    }

    if (stepNumber >= 2 && stepNumber <= 11) {
      return {
        type: 'modular' as const,
        category: 'scored-question',
        title: `Questão ${stepNumber - 1} de 10`,
        description: 'Questão pontuada com múltiplas seleções',
        expectedBehavior: '3 seleções obrigatórias + auto-avanço',
      };
    }

    if (stepNumber === 12) {
      return {
        type: 'modular' as const,
        category: 'transition',
        title: 'Transição - Questões Estratégicas',
        description: 'Página de transição entre questões pontuadas e estratégicas',
        expectedBehavior: 'Botão "Continuar" sempre ativo',
      };
    }

    if (stepNumber >= 13 && stepNumber <= 18) {
      return {
        type: 'modular' as const,
        category: 'strategic-question',
        title: `Questão Estratégica ${stepNumber - 12} de 6`,
        description: 'Questão estratégica com seleção única',
        expectedBehavior: '1 seleção obrigatória + avanço manual',
      };
    }

    if (stepNumber === 19) {
      return {
        type: 'modular' as const,
        category: 'transition',
        title: 'Transição - Preparação do Resultado',
        description: 'Página de transição antes do resultado',
        expectedBehavior: 'Botão "Continuar" sempre ativo',
      };
    }

    if (stepNumber === 20) {
      return {
        type: 'specialized' as const,
        category: 'result',
        title: 'Página de Resultado',
        description: 'Resultado personalizado com análise do estilo',
        expectedBehavior: 'Exibição do resultado + CTA para oferta',
      };
    }

    if (stepNumber === 21) {
      return {
        type: 'specialized' as const,
        category: 'offer',
        title: 'Página de Oferta',
        description: 'Página de vendas com oferta personalizada',
        expectedBehavior: 'CTA de conversão + timer de urgência',
      };
    }

    // Fallback
    return {
      type: 'modular' as const,
      category: 'generic',
      title: `Etapa ${stepNumber}`,
      description: 'Etapa genérica',
      expectedBehavior: 'Comportamento padrão',
    };
  }

  /**
   * 📊 Estatísticas da arquitetura
   */
  static getArchitectureStats() {
    const totalSteps = 21;
    const specializedSteps = [1, 20, 21];
    const modularSteps = Array.from({ length: 21 }, (_, i) => i + 1)
      .filter(step => !specializedSteps.includes(step));

    return {
      totalSteps,
      specializedSteps: {
        count: specializedSteps.length,
        steps: specializedSteps,
        percentage: Math.round((specializedSteps.length / totalSteps) * 100),
      },
      modularSteps: {
        count: modularSteps.length,
        steps: modularSteps,
        percentage: Math.round((modularSteps.length / totalSteps) * 100),
      },
    };
  }
}

/**
 * 🚀 COMPONENTE DE ROTEAMENTO PRINCIPAL
 */
export const QuizStepRenderer: React.FC<QuizStepRouterProps> = ({
  currentStep,
  totalSteps = 21,
  onNext,
  onPrevious,
  onStepChange,
}) => {
  const stepInfo = QuizStepRouter.getStepInfo(currentStep);

  // 🎯 Renderização especializada
  if (stepInfo.type === 'specialized') {
    return (
      <div className="specialized-step">
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            📄 Página Especializada - {stepInfo.title}
          </h2>
          <p className="text-blue-600 text-sm mb-2">{stepInfo.description}</p>
          <p className="text-blue-700 text-sm font-medium">
            ⚙️ {stepInfo.expectedBehavior}
          </p>
        </div>

        <div className="text-center p-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <h3 className="text-xl font-bold text-yellow-800 mb-4">
            🚧 Componente Especializado Necessário
          </h3>
          <p className="text-yellow-700 mb-4">
            Esta etapa requer um componente especializado que ainda não foi implementado.
          </p>
          <div className="text-sm text-yellow-600">
            <p><strong>Etapa:</strong> {currentStep}</p>
            <p><strong>Categoria:</strong> {stepInfo.category}</p>
            <p><strong>Componente sugerido:</strong> {
              currentStep === 1 ? 'QuizIntroPage' :
                currentStep === 20 ? 'ResultPage' :
                  currentStep === 21 ? 'OfferPage' : 'SpecializedComponent'
            }</p>
          </div>
        </div>

        {/* Navegação temporária */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <button
              onClick={onPrevious}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              ← Anterior
            </button>
          )}
          {currentStep < totalSteps && (
            <button
              onClick={onNext}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto"
            >
              Próxima →
            </button>
          )}
        </div>
      </div>
    );
  }

  // 🧩 Renderização modular
  return (
    <div className="modular-step">
      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-lg font-semibold text-green-800 mb-2">
          🧩 Etapa Modular - {stepInfo.title}
        </h2>
        <p className="text-green-600 text-sm mb-2">{stepInfo.description}</p>
        <p className="text-green-700 text-sm font-medium">
          ⚙️ {stepInfo.expectedBehavior}
        </p>
      </div>

      {/* Aqui será integrado o ModularV1Editor */}
      <div className="text-center p-8 bg-green-50 border-2 border-green-200 rounded-lg">
        <h3 className="text-xl font-bold text-green-800 mb-4">
          🧩 ModularV1Editor
        </h3>
        <p className="text-green-700 mb-4">
          Esta etapa usa o editor modular universal (etapas 2-19).
        </p>
        <div className="text-sm text-green-600">
          <p><strong>Etapa:</strong> {currentStep}</p>
          <p><strong>Categoria:</strong> {stepInfo.category}</p>
          <p><strong>Integração:</strong> ModularV1Editor pronto para uso</p>
        </div>
      </div>

      {/* Navegação temporária */}
      <div className="flex justify-between mt-6">
        {currentStep > 1 && (
          <button
            onClick={onPrevious}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            ← Anterior
          </button>
        )}
        {currentStep < totalSteps && (
          <button
            onClick={onNext}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-auto"
          >
            Próxima →
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizStepRenderer;