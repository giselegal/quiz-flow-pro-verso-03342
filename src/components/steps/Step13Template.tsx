import { useEditor } from '@/context/EditorContext';
import { useTemplateConfig } from '@/hooks/useTemplateConfig';
import { useState } from 'react';

/**
 * 🎯 STEP 13 CONECTADO - QUESTÃO ESTRATÉGICA
 * ✅ INTEGRADO: useEditor + useTemplateConfig + JSON híbrido
 *
 * Funcionalidades:
 * - Carrega configuração JSON para opções e design
 * - Conecta ao EditorContext.quizState para salvar respostas estratégicas
 * - Progresso dinâmico baseado no número de respostas
 */
export const ConnectedStep13Template = () => {
  const { quizState } = useEditor();
  const { config, loading, getDesignTokens } = useTemplateConfig(13);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const designTokens = getDesignTokens();

  // Calcular progresso dinâmico baseado nas respostas
  const progressValue = Math.round(
    ((quizState.answers.length + quizState.strategicAnswers.length) / 21) * 100
  );

  const handleOptionSelect = (optionId: string, category: string) => {
    setSelectedOption(optionId);

    // ✅ CONECTAR AO HOOK: Usar answerStrategicQuestion para salvar
    console.log('📊 ConnectedStep13: Selecionando opção estratégica:', { optionId, category });
    quizState.answerStrategicQuestion(
      'strategic-question-13',
      optionId,
      category,
      'difficulty-challenge'
    );

    // Disparar evento para navegação
    setTimeout(() => {
      const event = new CustomEvent('quiz-selection-change', {
        detail: {
          questionId: 'strategic-question-13',
          selectedOptions: [optionId],
          isStrategic: true,
          category: category,
        },
      });
      window.dispatchEvent(event);
    }, 300);
  };

  if (loading || !config) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#B89B7A] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#432818]">Carregando questão...</p>
        </div>
      </div>
    );
  }

  // Obter opções da configuração JSON
  const optionsBlock = config.blocks.find(block => block.type === 'options-grid');
  const options = optionsBlock?.properties?.options || [
    {
      id: 's13a',
      text: 'Tenho peças, mas não sei como combiná-las',
      value: 'combinacao',
      points: 1,
    },
    { id: 's13b', text: 'Compro por impulso e me arrependo depois', value: 'impulso', points: 2 },
    {
      id: 's13c',
      text: 'Minha imagem não reflete quem eu sou',
      value: 'desalinhamento',
      points: 3,
    },
    {
      id: 's13d',
      text: 'Perco tempo e acabo usando sempre os mesmos looks',
      value: 'repeticao',
      points: 4,
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: designTokens?.backgroundColor || '#FAF9F7',
        fontFamily: designTokens?.fontFamily || "'Playfair Display', serif",
      }}
    >
      {/* Header com progresso */}
      <div className="w-full py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <img
              src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
              alt="Logo Gisele Galvão"
              className="w-16 h-16 object-contain"
            />
            <div className="text-right text-sm text-gray-600">Questão 12 de 13</div>
          </div>

          {/* Barra de progresso dinâmica */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${progressValue}%`,
                backgroundColor: designTokens?.progressBar.color || '#B89B7A',
              }}
            ></div>
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">{progressValue}% completo</div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full">
          {/* Título da questão */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: designTokens?.secondaryColor || '#432818' }}
            >
              O que mais te desafia na hora de se vestir?
            </h1>
            {quizState.userName && (
              <p className="text-lg text-gray-600">
                {quizState.userName}, essa informação nos ajuda a personalizar suas recomendações
              </p>
            )}
          </div>

          {/* Opções */}
          <div className="space-y-4">
            {options.map((option: any) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id, option.value || option.category)}
                className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  selectedOption === option.id
                    ? 'border-[#B89B7A] bg-[#B89B7A]/10 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-[#B89B7A]/50'
                }`}
                style={{
                  borderRadius: designTokens?.card.borderRadius || '16px',
                  boxShadow:
                    selectedOption === option.id
                      ? designTokens?.card.shadow || '0 4px 20px rgba(184, 155, 122, 0.10)'
                      : 'none',
                }}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-6 h-6 rounded-full border-2 transition-colors ${
                      selectedOption === option.id
                        ? 'bg-[#B89B7A] border-[#B89B7A]'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedOption === option.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="text-lg font-medium text-gray-800">{option.text}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Botão de continuar */}
          <div className="mt-8 text-center">
            <button
              disabled={!selectedOption}
              className={`px-8 py-4 text-white font-semibold text-lg rounded-lg transition-all duration-300 ${
                selectedOption ? 'hover:scale-105 active:scale-95' : 'opacity-50 cursor-not-allowed'
              }`}
              style={{
                background: selectedOption
                  ? designTokens?.button.background || 'linear-gradient(90deg, #B89B7A, #aa6b5d)'
                  : '#ccc',
                borderRadius: designTokens?.button.borderRadius || '10px',
                boxShadow: selectedOption
                  ? designTokens?.button.shadow || '0 4px 14px rgba(184, 155, 122, 0.15)'
                  : 'none',
              }}
              onClick={() => {
                if (selectedOption) {
                  // Navegar para próxima etapa
                  const event = new CustomEvent('navigate-to-step', {
                    detail: { step: 14 },
                  });
                  window.dispatchEvent(event);
                }
              }}
            >
              Próxima Questão →
            </button>
          </div>
        </div>
      </div>

      {/* Debug info (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-white/90 p-2 rounded text-xs text-gray-600 border">
          <div>Usuário: {quizState.userName}</div>
          <div>Respostas: {quizState.answers.length}</div>
          <div>Estratégicas: {quizState.strategicAnswers.length}</div>
          <div>Progresso: {progressValue}%</div>
          <div>Selecionado: {selectedOption}</div>
        </div>
      )}
    </div>
  );
};

// Função de compatibilidade para manter funcionamento com sistema antigo
export const getStep13Template = () => {
  return [
    {
      id: 'step13-connected-wrapper',
      type: 'connected-template',
      properties: {
        component: 'ConnectedStep13Template',
        stepNumber: 13,
      },
    },
  ];
};

export default ConnectedStep13Template;
