/**
 * 🎯 TEMPLATES OTIMIZADOS DAS 21 ETAPAS
 * ====================================
 *
 * Baseado na auditoria de componentes, usando apenas componentes core
 * reutilizáveis com máxima flexibilidade de configuração.
 */

export const OPTIMIZED_STEP_TEMPLATES = {
  // ETAPA 1: Introdução
  step01: {
    id: 'step-1',
    name: 'Introdução',
    description: 'Página inicial do quiz com coleta de nome',
    blocks: [
      {
        id: 'header-logo',
        type: 'quiz-intro-header',
        properties: {
          logoUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          progressValue: 0,
          showProgress: false,
          backgroundColor: '#F9F5F1',
          height: 80,
        },
      },
      {
        id: 'main-title',
        type: 'heading-inline',
        properties: {
          content: 'Descubra Seu Estilo Predominante',
          level: 'h1',
          textAlign: 'center',
          color: '#432818',
          fontWeight: 'bold',
        },
      },
      {
        id: 'description',
        type: 'text-inline',
        properties: {
          text: 'Responda algumas perguntas rápidas e descubra qual dos 7 estilos universais combina mais com você.',
          fontSize: '1.125rem',
          alignment: 'center',
          color: '#6B5B4E',
        },
      },
      {
        id: 'decorative-separator',
        type: 'decorative-bar-inline',
        properties: {
          height: 4,
          color: '#B89B7A',
          marginTop: 20,
          marginBottom: 30,
        },
      },
      {
        id: 'name-input',
        type: 'form-input',
        properties: {
          label: 'Qual é o seu nome?',
          placeholder: 'Digite seu primeiro nome',
          required: true,
          type: 'text',
          backgroundColor: '#FFFFFF',
          borderColor: '#B89B7A',
        },
      },
      {
        id: 'start-button',
        type: 'button-inline',
        properties: {
          text: 'Iniciar Quiz',
          style: 'primary',
          size: 'large',
          backgroundColor: '#B89B7A',
          textColor: '#FFFFFF',
        },
      },
      {
        id: 'legal-notice',
        type: 'legal-notice-inline',
        properties: {
          privacyText: 'Política de privacidade',
          copyrightText: '© 2025 Gisele Galvão Consultoria',
          fontSize: 'text-xs',
          textAlign: 'center',
          color: '#8F7A6A',
        },
      },
    ],
  },

  // TEMPLATE PARA ETAPAS 2-11: Questões
  questionTemplate: {
    name: 'Questão do Quiz',
    description: 'Template reutilizável para as 10 questões principais',
    blocks: [
      {
        id: 'header-progress',
        type: 'quiz-intro-header',
        properties: {
          logoUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          progressValue: '{{progressValue}}', // Dinâmico 10-55%
          showProgress: true,
          backgroundColor: '#F9F5F1',
        },
      },
      {
        id: 'question-title',
        type: 'heading-inline',
        properties: {
          content: '{{questionTitle}}', // Dinâmico
          level: 'h2',
          textAlign: 'center',
          color: '#432818',
        },
      },
      {
        id: 'options-grid',
        type: 'options-grid',
        properties: {
          question: '{{questionText}}', // Dinâmico
          columns: 2,
          gap: 16,
          selectionMode: 'single',
          primaryColor: '#B89B7A',
          accentColor: '#D4C2A8',
          showImages: true,
        },
      },
      {
        id: 'progress-bar',
        type: 'quiz-progress',
        properties: {
          currentStep: '{{currentStep}}', // Dinâmico
          totalSteps: 21,
          showNumbers: true,
          showPercentage: true,
          barColor: '#B89B7A',
          backgroundColor: '#E5E7EB',
        },
      },
    ],
  },

  // ETAPA 20: Resultado
  step20: {
    id: 'step-20',
    name: 'Resultado Personalizado',
    description: 'Exibição do resultado calculado do quiz',
    blocks: [
      {
        id: 'header-clean',
        type: 'quiz-intro-header',
        properties: {
          logoUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          showProgress: false,
          backgroundColor: '#F9F5F1',
        },
      },
      {
        id: 'result-title',
        type: 'heading-inline',
        properties: {
          content: 'Seu Resultado: {{primaryStyle}}', // Dinâmico
          level: 'h1',
          textAlign: 'center',
          color: '#432818',
        },
      },
      {
        id: 'quiz-results',
        type: 'quiz-results',
        properties: {
          title: 'Seus Resultados',
          showScores: true,
          showPercentages: true,
          primaryColor: '#B89B7A',
          layout: 'vertical',
        },
      },
      {
        id: 'style-results',
        type: 'style-results',
        properties: {
          title: 'Seu Estilo Predominante',
          showGuideImage: true,
          guideImageUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp',
          primaryStyle: '{{primaryStyle}}', // Dinâmico
          showDescription: true,
        },
      },
      {
        id: 'cta-offer',
        type: 'button-inline',
        properties: {
          text: 'Ver Oferta Personalizada',
          style: 'primary',
          size: 'large',
          backgroundColor: '#B89B7A',
        },
      },
    ],
  },

  // ETAPA 21: Oferta Final
  step21: {
    id: 'step-21',
    name: 'Oferta Personalizada',
    description: 'Oferta final baseada no resultado do quiz',
    blocks: [
      {
        id: 'header-offer',
        type: 'quiz-intro-header',
        properties: {
          logoUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          showProgress: false,
          backgroundColor: '#F9F5F1',
        },
      },
      {
        id: 'final-step-editor',
        type: 'final-step',
        properties: {
          stepNumber: 21,
          title: 'Oferta Exclusiva Para Seu Estilo {{primaryStyle}}', // Dinâmico
          subtitle: 'Transforme seu guarda-roupa com um guia personalizado',
          showNavigation: false,
          backgroundColor: '#F9F5F1',
          accentColor: '#B89B7A',
        },
      },
      {
        id: 'offer-image',
        type: 'image-display-inline',
        properties: {
          src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911682/C%C3%B3pia_de_MOCKUPS_14_oxegnd.webp',
          alt: 'Guia Personalizado de Estilo',
          width: '100%',
          height: 'auto',
          borderRadius: 8,
          alignment: 'center',
        },
      },
      {
        id: 'offer-description',
        type: 'text-inline',
        properties: {
          text: 'Receba um guia completo personalizado para seu estilo {{primaryStyle}}, com dicas exclusivas, paleta de cores e orientações para criar looks incríveis.',
          fontSize: '1.125rem',
          alignment: 'center',
        },
      },
      {
        id: 'payment-options',
        type: 'options-grid',
        properties: {
          question: 'Escolha sua forma de pagamento:',
          columns: 2,
          gap: 16,
          selectionMode: 'single',
          primaryColor: '#4CAF50',
          accentColor: '#66BB6A',
        },
      },
      {
        id: 'final-cta',
        type: 'button-inline',
        properties: {
          text: 'Garantir Meu Guia Personalizado',
          style: 'primary',
          size: 'large',
          backgroundColor: '#4CAF50',
          textColor: '#FFFFFF',
        },
      },
      {
        id: 'guarantee',
        type: 'legal-notice-inline',
        properties: {
          privacyText: 'Garantia de 7 dias',
          copyrightText: 'Pagamento 100% seguro',
          fontSize: 'text-sm',
          textAlign: 'center',
          color: '#4CAF50',
        },
      },
    ],
  },
};

// Função para gerar etapas dinâmicas baseadas nos templates
export function generateStepFromTemplate(stepNumber: number, questionData: any = null) {
  if (stepNumber === 1) {
    return OPTIMIZED_STEP_TEMPLATES.step01;
  }

  if (stepNumber >= 2 && stepNumber <= 11) {
    const template = {
      ...OPTIMIZED_STEP_TEMPLATES.questionTemplate,
      id: `step-${stepNumber}`,
      name: `Q${stepNumber - 1} - ${questionData?.title || 'Questão'}`,
    };

    // Substituir placeholders dinâmicos
    template.blocks = template.blocks.map((block: any) => ({
      ...block,
      properties: {
        ...block.properties,
        progressValue: Math.round(((stepNumber - 1) / 20) * 100),
        currentStep: stepNumber.toString(),
        questionTitle: questionData?.title || `Questão ${stepNumber - 1}`,
        questionText: questionData?.text || 'Selecione uma opção:',
      },
    }));

    return template;
  }

  if (stepNumber === 20) {
    return OPTIMIZED_STEP_TEMPLATES.step20;
  }

  if (stepNumber === 21) {
    return OPTIMIZED_STEP_TEMPLATES.step21;
  }

  // Para outras etapas, usar template de questão
  return generateStepFromTemplate(Math.min(stepNumber, 11), questionData);
}

export default OPTIMIZED_STEP_TEMPLATES;
