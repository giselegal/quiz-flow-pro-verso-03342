import React from 'react';
import {
  FunnelIntroStep,
  NameCollectStep,
  QuizIntroStep,
  QuestionMultipleStep,
  QuizTransitionStep,
  ProcessingStep,
  ResultIntroStep,
  ResultDetailsStep,
  ResultGuideStep,
  OfferTransitionStep,
  OfferPageStep,
  FunnelProgressBar,
  CountdownTimer,
  ResultCard,
  OfferCard
} from '../funnel-blocks';

/**
 * Renderer para componentes de funil no sistema de blocos
 * 
 * Este componente integra os componentes reutilizáveis de funil
 * com o sistema de renderização dinâmica de blocos.
 */

interface FunnelBlockRendererProps {
  block: {
    id: string;
    type: string;
    properties: Record<string, any>;
  };
  isEditable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const FunnelBlockRenderer: React.FC<FunnelBlockRendererProps> = ({
  block,
  isEditable = false,
  onEdit,
  onDelete
}) => {
  const { type, properties } = block;

  // Props comuns para todos os componentes
  const commonProps = {
    id: block.id,
    isEditable,
    onEdit,
    onDelete,
    ...properties
  };

  switch (type) {
    // ETAPAS DO FUNIL
    case 'funnel-intro-step':
      return (
        <FunnelIntroStep
          {...commonProps}
          stepType="intro"
          data={properties}
        />
      );

    case 'name-collect-step':
      return (
        <NameCollectStep
          {...commonProps}
          stepType="name-collect"
          data={properties}
        />
      );

    case 'quiz-intro-step':
      return (
        <QuizIntroStep
          {...commonProps}
          stepType="quiz-intro"
          data={properties}
        />
      );

    case 'question-multiple-step':
      return (
        <QuestionMultipleStep
          {...commonProps}
          stepType="question-multiple"
          data={properties}
        />
      );

    case 'quiz-transition-step':
      return (
        <QuizTransitionStep
          {...commonProps}
          stepType="quiz-transition"
          data={properties}
        />
      );

    case 'processing-step':
      return (
        <ProcessingStep
          {...commonProps}
          stepType="processing"
          data={properties}
        />
      );

    case 'result-intro-step':
      return (
        <ResultIntroStep
          {...commonProps}
          stepType="result-intro"
          data={properties}
        />
      );

    case 'result-details-step':
      return (
        <ResultDetailsStep
          {...commonProps}
          stepType="result-details"
          data={properties}
        />
      );

    case 'result-guide-step':
      return (
        <ResultGuideStep
          {...commonProps}
          stepType="result-guide"
          data={properties}
        />
      );

    case 'offer-transition-step':
      return (
        <OfferTransitionStep
          {...commonProps}
          stepType="offer-transition"
          data={properties}
        />
      );

    case 'offer-page-step':
      return (
        <OfferPageStep
          {...commonProps}
          stepType="offer-page"
          data={properties}
        />
      );

    // COMPONENTES COMPARTILHADOS
    case 'funnel-progress-bar':
      return (
        <div className="w-full p-4">
          <FunnelProgressBar
            currentStep={properties.currentStep || 1}
            totalSteps={properties.totalSteps || 21}
            showLabels={properties.showLabels || false}
            color={properties.color || '#B89B7A'}
            size={properties.size || 'md'}
            animated={properties.animated !== false}
            showPercentage={properties.showPercentage || false}
          />
        </div>
      );

    case 'countdown-timer':
      return (
        <div className="w-full p-4 flex justify-center">
          <CountdownTimer
            initialTime={properties.initialTime || 300}
            onComplete={() => console.log('Timer finalizado')}
            showIcon={properties.showIcon !== false}
            size={properties.size || 'md'}
            color={properties.color || '#B89B7A'}
          />
        </div>
      );

    case 'result-card':
      return (
        <div className="w-full p-4 flex justify-center">
          <ResultCard
            result={properties.result || {
              category: 'elegante',
              title: 'Seu Estilo é Elegante',
              description: 'Você possui uma preferência por elegância refinada.',
              imageUrl: ''
            }}
            showButton={properties.showButton !== false}
            buttonText={properties.buttonText || 'Ver Detalhes'}
            onButtonClick={() => console.log('Resultado clicado')}
            size={properties.size || 'md'}
          />
        </div>
      );

    case 'offer-card':
      return (
        <div className="w-full p-4 flex justify-center">
          <OfferCard
            offer={properties.offer || {
              title: 'Consultoria Personalizada',
              description: 'Receba um guia completo',
              price: 'R$ 297',
              originalPrice: 'R$ 497',
              buttonText: 'Adquirir agora',
              features: [
                'Análise completa',
                'Guia personalizado',
                'Suporte incluído'
              ]
            }}
            showDiscount={properties.showDiscount !== false}
            onPurchase={() => console.log('Compra iniciada')}
          />
        </div>
      );

    default:
      return (
        <div className="p-4 border border-red-300 bg-red-50 rounded">
          <p className="text-red-600 text-sm">
            Componente de funil não encontrado: {type}
          </p>
        </div>
      );
  }
};

/**
 * Hook para verificar se um tipo de bloco é um componente de funil
 */
export const useIsFunnelBlock = (type: string): boolean => {
  const funnelBlockTypes = [
    'funnel-intro-step',
    'name-collect-step',
    'quiz-intro-step',
    'question-multiple-step',
    'quiz-transition-step',
    'processing-step',
    'result-intro-step',
    'result-details-step',
    'result-guide-step',
    'offer-transition-step',
    'offer-page-step',
    'funnel-progress-bar',
    'countdown-timer',
    'result-card',
    'offer-card'
  ];

  return funnelBlockTypes.includes(type);
};

/**
 * Função utilitária para obter propriedades padrão de um componente de funil
 */
export const getFunnelBlockDefaults = (type: string): Record<string, any> => {
  const defaults: Record<string, Record<string, any>> = {
    'funnel-intro-step': {
      title: 'Descubra Seu Estilo Ideal',
      subtitle: 'Responda nosso quiz e receba um guia personalizado',
      buttonText: 'Começar Agora',
      stepNumber: 1,
      totalSteps: 21
    },
    'name-collect-step': {
      title: 'Como podemos te chamar?',
      subtitle: 'Digite seu nome para personalizar sua experiência',
      placeholder: 'Seu nome aqui...',
      buttonText: 'Continuar',
      stepNumber: 2,
      totalSteps: 21
    },
    'question-multiple-step': {
      question: 'Qual é sua preferência?',
      questionNumber: 1,
      totalQuestions: 10,
      options: [
        {
          id: 'opcao-1',
          text: 'Opção 1',
          imageUrl: '',
          value: 'opcao-1'
        },
        {
          id: 'opcao-2',
          text: 'Opção 2',
          imageUrl: '',
          value: 'opcao-2'
        }
      ]
    },
    'funnel-progress-bar': {
      currentStep: 1,
      totalSteps: 21,
      color: '#B89B7A',
      size: 'md'
    },
    'countdown-timer': {
      initialTime: 300,
      showIcon: true,
      size: 'md',
      color: '#B89B7A'
    },
    'result-card': {
      result: {
        category: 'elegante',
        title: 'Seu Estilo é Elegante',
        description: 'Você possui uma preferência por elegância refinada.',
        imageUrl: ''
      },
      showButton: true,
      buttonText: 'Ver Detalhes'
    },
    'offer-card': {
      offer: {
        title: 'Consultoria Personalizada',
        description: 'Receba um guia completo',
        price: 'R$ 297',
        originalPrice: 'R$ 497',
        buttonText: 'Adquirir agora',
        features: ['Análise completa', 'Guia personalizado', 'Suporte incluído']
      },
      showDiscount: true
    }
  };

  return defaults[type] || {};
};

export default FunnelBlockRenderer;
