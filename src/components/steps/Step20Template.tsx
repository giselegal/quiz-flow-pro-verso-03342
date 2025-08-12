/**
 * Step20Template - Resultado Final com Cálculo Inteligente
 * ✅ INTEGRAÇÃO COM SISTEMA DE PONTUAÇÃO
 */

export const getStep20Template = () => {
  return [
    {
      id: 'step20-result',
      type: 'quiz-results',
      properties: {
        title: {
          text: 'Seu Resultado Personalizado',
          fontSize: 'text-3xl',
          fontWeight: 'font-bold',
          textAlign: 'text-center',
          color: 'text-blue-600',
          marginBottom: 'mb-8',
        },
        subtitle: {
          text: 'Baseado nas suas respostas das questões 2-11',
          fontSize: 'text-lg',
          textAlign: 'text-center',
          color: 'text-gray-700',
          marginBottom: 'mb-12',
        },
        backgroundColor: 'bg-gradient-to-b from-blue-50 to-white',
        padding: 'p-8',
        borderRadius: 'rounded-xl',
        shadow: 'shadow-lg',
        minHeight: 'min-h-screen',
        displayMode: 'full-analysis',
        showScoreBreakdown: true,
        showRecommendations: true,
        enableExport: true,
        resultLayout: 'vertical',
        animationDelay: 500,
        // ✅ NOVO: Configuração de cálculo automático
        scoreCalculation: {
          source: 'questions_2_to_11',
          method: 'weighted',
          showPercentage: true,
          showProfile: true,
          showCategoryBreakdown: true,
          autoCalculate: true,
        },
        resultConfig: {
          showProgressBar: true,
          showCategoryScores: true,
          showPersonalizedMessage: true,
          includeNextSteps: true,
          enableSocialShare: true,
          resultCardStyle: 'modern',
          // ✅ NOVO: Perfis de resultado
          profileMessages: {
            'Expert Avançado': {
              title: 'Parabéns! Você é um Expert',
              message:
                'Seu conhecimento em marketing digital é excepcional. Você está pronto para estratégias avançadas.',
              color: 'text-green-600',
              bgColor: 'bg-green-50',
            },
            'Profissional Experiente': {
              title: 'Muito Bom! Profissional Sólido',
              message:
                'Você tem uma base forte. Com algumas otimizações, pode chegar ao nível expert.',
              color: 'text-blue-600',
              bgColor: 'bg-blue-50',
            },
            Intermediário: {
              title: 'Bom Progresso! Nível Intermediário',
              message:
                'Você está no caminho certo. Foque em automatização e métricas para evoluir.',
              color: 'text-yellow-600',
              bgColor: 'bg-yellow-50',
            },
            Iniciante: {
              title: 'Começando Bem! Grande Potencial',
              message:
                'Todo expert começou como você. Foque nos fundamentos e evolua consistentemente.',
              color: 'text-purple-600',
              bgColor: 'bg-purple-50',
            },
          },
        },
        resultStyles: {
          cardBackground: 'bg-white',
          cardBorder: 'border border-gray-200',
          cardShadow: 'shadow-xl',
          titleColor: 'text-gray-900',
          scoreColor: 'text-blue-600',
          descriptionColor: 'text-gray-700',
          accentColor: 'blue',
        },
        tracking: {
          event: 'quiz_result_calculated',
          properties: {
            step: 20,
            resultType: 'weighted_score',
            calculatedFrom: 'questions_2_to_11',
            includesCategoryBreakdown: true,
          },
        },
        stepInfo: {
          step: 20,
          category: 'result',
          isScoring: true,
          isStrategic: false,
          isTransition: false,
          isResult: true,
          flowPosition: 'final-result',
          dependencies: ['questions_2_to_11_completed', 'user_name_collected'],
          nextStep: 21,
          description: 'Resultado final com cálculo inteligente baseado em 10 perguntas principais',
        },
      },
    },
  ];
};

export default getStep20Template;
