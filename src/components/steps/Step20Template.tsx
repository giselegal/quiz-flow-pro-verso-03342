import { TemplateBlock } from '@/services/templateService';

/**
 * Step 20: Resultado Final do Quiz
 * Exibe o resultado calculado baseado apenas nas questões 2-11 que pontuam
 * Utiliza o ConnectedQuizResultsBlock para integração completa
 */
export const getStep20Template = (): TemplateBlock => ({
  id: 'step20-result',
  type: 'quiz-results',
  properties: {
    title: {
      text: 'Seu Resultado Personalizado',
      fontSize: 'text-3xl',
      fontWeight: 'font-bold',
      textAlign: 'text-center',
      color: 'text-blue-600',
      marginBottom: 'mb-8'
    },
    subtitle: {
      text: 'Com base em suas respostas, aqui está sua análise personalizada:',
      fontSize: 'text-lg',
      textAlign: 'text-center',
      color: 'text-gray-700',
      marginBottom: 'mb-12'
    },
    backgroundColor: 'bg-gradient-to-b from-blue-50 to-white',
    padding: 'p-8',
    borderRadius: 'rounded-xl',
    shadow: 'shadow-lg',
    minHeight: 'min-h-screen',
    displayMode: 'full-analysis', // Análise completa com gráficos
    showScoreBreakdown: true, // Mostrar detalhamento da pontuação
    showRecommendations: true, // Mostrar recomendações personalizadas
    enableExport: true, // Permitir exportar resultado
    resultLayout: 'vertical', // Layout vertical para melhor experiência
    animationDelay: 500, // Animação suave de entrada
    
    // Configurações específicas do resultado
    resultConfig: {
      showProgressBar: true,
      showCategoryScores: true,
      showPersonalizedMessage: true,
      includeNextSteps: true,
      enableSocialShare: false, // Desabilitado por privacidade
      resultCardStyle: 'modern'
    },
    
    // Estilização da apresentação do resultado
    resultStyles: {
      cardBackground: 'bg-white',
      cardBorder: 'border border-gray-200',
      cardShadow: 'shadow-xl',
      titleColor: 'text-gray-900',
      scoreColor: 'text-blue-600',
      descriptionColor: 'text-gray-700',
      accentColor: 'blue'
    },
    
    // Integração com analytics
    tracking: {
      event: 'quiz_result_viewed',
      properties: {
        step: 20,
        resultType: 'final_score',
        calculatedFrom: 'questions_2_to_11'
      }
    },
    
    // Metadados incluídos nas properties
    stepInfo: {
      step: 20,
      category: 'result',
      isScoring: false, // Não pontua, apenas exibe resultado
      isStrategic: false,
      isTransition: false,
      isResult: true,
      flowPosition: 'final-result',
      dependencies: ['questions_2_to_11_completed'],
      nextStep: 21,
      description: 'Página de resultado final calculado apenas das questões 2-11'
    }
  }
});

export default getStep20Template;
