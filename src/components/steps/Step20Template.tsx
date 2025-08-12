/**
 * Step20Template - Template Modular para Etapa 20 do Quiz
 * ✅ PÁGINA DE RESULTADO FINAL
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
          text: 'Com base em suas respostas, aqui está sua análise personalizada:',
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
        resultConfig: {
          showProgressBar: true,
          showCategoryScores: true,
          showPersonalizedMessage: true,
          includeNextSteps: true,
          enableSocialShare: false,
          resultCardStyle: 'modern',
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
          event: 'quiz_result_viewed',
          properties: {
            step: 20,
            resultType: 'final_score',
            calculatedFrom: 'questions_2_to_11',
          },
        },
        stepInfo: {
          step: 20,
          category: 'result',
          isScoring: false,
          isStrategic: false,
          isTransition: false,
          isResult: true,
          flowPosition: 'final-result',
          dependencies: ['questions_2_to_11_completed'],
          nextStep: 21,
          description: 'Página de resultado final calculado apenas das questões 2-11',
        },
      },
    },
  ];
};

export default getStep20Template;
