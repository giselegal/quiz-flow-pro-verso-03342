/**
 * 🚀 ENHANCED TEMPLATE GENERATOR
 *
 * Gerador de templates JSON que inclui automaticamente as configurações avançadas:
 * - ConnectedTemplateWrapper (hooks integrados)
 * - ConnectedLeadForm (validação complexa)
 * - QuizNavigation (navegação premium)
 * - StyleCardsGrid (cards interativos dos 8 estilos)
 * - GradientAnimation (gradientes e animações personalizadas)
 */

import { TemplateBlock, TemplateData } from './templateService';

export interface EnhancedTemplateConfig {
  stepNumber: number;
  stepType: 'intro' | 'question' | 'strategic' | 'result';
  sessionId?: string;
  includeNavigation?: boolean;
  includeStyleCards?: boolean;
  includeGradientBackground?: boolean;
  includeLeadForm?: boolean;
  customBlocks?: TemplateBlock[];
  questionData?: {
    title: string;
    options: Array<{
      id: string;
      text: string;
      imageUrl?: string;
      styleCategory: string;
      points: number;
    }>;
    minSelections?: number;
    maxSelections?: number;
  };
}

export class EnhancedTemplateGenerator {
  /**
   * 🎯 Gera template completo com todos os componentes avançados
   */
  static generateTemplate(config: EnhancedTemplateConfig): TemplateData {
    const {
      stepNumber,
      stepType,
      sessionId = 'default-session',
      includeNavigation = true,
      includeStyleCards = false,
      includeGradientBackground = true,
      includeLeadForm = false,
      customBlocks = [],
      questionData,
    } = config;

    const blocks: TemplateBlock[] = [];

    // 1. ✅ CONNECTED TEMPLATE WRAPPER (sempre incluído)
    blocks.push({
      id: `step${stepNumber}-wrapper`,
      type: 'connected-template-wrapper',
      properties: {
        wrapperConfig: {
          stepNumber,
          stepType,
          sessionId,
          enableHooks: true,
          trackingEnabled: true,
          validationEnabled: true,
        },
        backgroundColor: 'transparent',
        padding: '0',
      },
    });

    // 2. ✅ GRADIENT BACKGROUND (opcional)
    if (includeGradientBackground) {
      blocks.push({
        id: `step${stepNumber}-gradient`,
        type: 'gradient-animation',
        properties: {
          gradientConfig: {
            colors: ['#FAF9F7', '#ffffff', '#B89B7A'],
            direction: 'to-br',
            opacity: 0.1,
            animationDuration: '10s',
            enableAnimation: true,
          },
          containerClass: 'min-h-screen',
        },
      });
    }

    // 3. ✅ QUIZ NAVIGATION (opcional)
    if (includeNavigation) {
      blocks.push({
        id: `step${stepNumber}-navigation`,
        type: 'quiz-navigation',
        properties: {
          navigationConfig: {
            currentStep: stepNumber,
            totalSteps: 21,
            stepName: stepType === 'intro' ? 'Introdução' : `Questão ${stepNumber - 1}`,
            canProceed: stepType === 'intro' ? true : false,
            showUserInfo: stepNumber > 1,
            enableProgress: true,
            sessionId,
          },
          position: 'top',
          sticky: true,
        },
      });
    }

    // 4. ✅ HEADER (sempre incluído)
    blocks.push({
      id: `step${stepNumber}-header`,
      type: 'quiz-intro-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: Math.round((stepNumber / 21) * 100),
        progressTotal: 100,
        showProgress: stepNumber > 1,
        showBackButton: stepNumber > 1,
      },
    });

    // 5. ✅ STYLE CARDS GRID (opcional)
    if (includeStyleCards) {
      blocks.push({
        id: `step${stepNumber}-style-cards`,
        type: 'style-cards-grid',
        properties: {
          cardsConfig: {
            styles: [
              { name: 'Natural', color: '#8B7355', letter: 'A' },
              { name: 'Clássico', color: '#432818', letter: 'B' },
              { name: 'Contemporâneo', color: '#6B4F43', letter: 'C' },
              { name: 'Elegante', color: '#B89B7A', letter: 'D' },
              { name: 'Romântico', color: '#D4B5A0', letter: 'E' },
              { name: 'Sexy', color: '#8B4513', letter: 'F' },
              { name: 'Dramático', color: '#654321', letter: 'G' },
              { name: 'Criativo', color: '#A0522D', letter: 'H' },
            ],
            columns: 4,
            interactive: true,
            showAnimation: true,
          },
          marginBottom: 24,
        },
      });
    }

    // 6. ✅ QUESTION CONTENT (para steps de pergunta)
    if (stepType === 'question' && questionData) {
      // Título da questão
      blocks.push({
        id: `step${stepNumber}-question-title`,
        type: 'text-inline',
        properties: {
          content: questionData.title,
          fontSize: 'text-2xl',
          fontWeight: 'font-bold',
          textAlign: 'text-center',
          color: '#432818',
          fontFamily: "'Playfair Display', serif",
          marginBottom: 8,
        },
      });

      // Contador de questão
      blocks.push({
        id: `step${stepNumber}-question-counter`,
        type: 'text-inline',
        properties: {
          content: `Questão ${stepNumber - 1} de 13`,
          fontSize: 'text-sm',
          textAlign: 'text-center',
          color: '#6B7280',
          marginBottom: 24,
        },
      });

      // Grid de opções
      blocks.push({
        id: `step${stepNumber}-options-grid`,
        type: 'options-grid',
        properties: {
          options: questionData.options,
          columns: 2,
          imageSize: 256,
          showImages: true,
          multipleSelection: true,
          minSelections: questionData.minSelections || 3,
          maxSelections: questionData.maxSelections || 3,
          borderColor: '#E5E7EB',
          selectedBorderColor: '#B89B7A',
          hoverColor: '#F3E8D3',
          selectionStyle: 'glow',
          animationType: 'scale',
          validationMessage: `Selecione ${questionData.minSelections || 3} opções para avançar.`,
          scoring: {
            enabled: true,
            categories: [
              'Natural',
              'Clássico',
              'Contemporâneo',
              'Elegante',
              'Romântico',
              'Sexy',
              'Dramático',
              'Criativo',
            ],
          },
        },
      });

      // Botão de continuar
      blocks.push({
        id: `step${stepNumber}-continue-button`,
        type: 'button-inline',
        properties: {
          text: 'Próxima Questão →',
          textWhenDisabled: `Selecione ${questionData.minSelections || 3} opções para avançar`,
          variant: 'primary',
          size: 'large',
          fullWidth: true,
          backgroundColor: '#B89B7A',
          backgroundGradient: 'linear-gradient(90deg, #B89B7A, #aa6b5d)',
          textColor: '#ffffff',
          borderRadius: '10px',
          shadow: '0 4px 14px rgba(184, 155, 122, 0.15)',
          disabled: true,
          requiresValidInput: true,
          enableOnSelection: true,
          minSelections: questionData.minSelections || 3,
          animation: 'hover:scale-105, active:scale-95',
          marginTop: 24,
        },
      });
    }

    // 7. ✅ CONNECTED LEAD FORM (para intro ou resultado)
    if (includeLeadForm) {
      blocks.push({
        id: `step${stepNumber}-lead-form`,
        type: 'connected-lead-form',
        properties: {
          formConfig: {
            title: 'Como posso te chamar?',
            placeholder: 'Digite seu primeiro nome aqui...',
            buttonText: 'Quero Descobrir meu Estilo Agora!',
            buttonDisabledText: 'Digite seu nome para continuar',
            enableValidation: true,
            enableRealTimeValidation: true,
            sessionId,
          },
          styling: {
            backgroundColor: '#ffffff',
            borderColor: '#B89B7A',
            buttonGradient: 'linear-gradient(90deg, #B89B7A, #aa6b5d)',
          },
          marginTop: 24,
        },
      });
    }

    // 8. ✅ CUSTOM BLOCKS (blocos personalizados)
    blocks.push(...customBlocks);

    // Gerar template completo
    const template: TemplateData = {
      templateVersion: '2.1',
      metadata: {
        id: `enhanced-step-${stepNumber.toString().padStart(2, '0')}`,
        name: `Enhanced Step ${stepNumber} - ${stepType}`,
        description: `Template avançado para etapa ${stepNumber} com componentes premium`,
        category: 'enhanced-quiz',
        type: stepType,
        tags: ['quiz', 'enhanced', 'premium', stepType, `step-${stepNumber}`],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: 'EnhancedTemplateGenerator',
      },
      design: {
        primaryColor: '#B89B7A',
        secondaryColor: '#432818',
        accentColor: '#3B82F6', // Baseado no quiz21StepsComplete
        backgroundColor: '#F8F9FA', // Baseado no quiz21StepsComplete
        fontFamily: "'Playfair Display', 'Inter', serif",
        button: {
          background: 'linear-gradient(90deg, #B89B7A, #aa6b5d)',
          textColor: '#fff',
          borderRadius: '10px',
          shadow: '0 4px 14px rgba(184, 155, 122, 0.15)',
        },
        card: {
          background: '#fff',
          borderRadius: '8px', // Baseado no quiz21StepsComplete
          shadow: '0 4px 20px rgba(184, 155, 122, 0.10)',
          padding: '24px', // Baseado no quiz21StepsComplete
        },
        progressBar: {
          color: '#B89B7A',
          background: '#F3E8E6',
          height: '6px',
        },
        animations: {
          questionTransition: 'fadeIn', // Baseado no quiz21StepsComplete
          optionSelect: 'glow, scale',
          button: 'hover:scale-105, active:scale-95',
          animationDuration: '0.8s', // Baseado no quiz21StepsComplete
        },
        imageOptionSize: {
          default: { width: 256, height: 256, aspect: 'square' },
          strategic: { width: 400, height: 256, aspect: 'landscape' },
        },
      },
      layout: {
        containerWidth: 'full',
        spacing: 'responsive',
        backgroundColor: '#F8F9FA', // Baseado no quiz21StepsComplete
        responsive: true,
        animations: {
          questionTransition: 'fadeIn', // Baseado no quiz21StepsComplete
          optionSelect: 'glow, scale',
          button: 'hover:scale-105, active:scale-95',
          animationDuration: '0.8s', // Baseado no quiz21StepsComplete
        },
      },
      blocks,
      validation: {
        required: true,
        minAnswers: questionData?.minSelections || 1,
        maxAnswers: questionData?.maxSelections || 3,
        validationMessage: questionData
          ? `Selecione ${questionData.minSelections || 3} opções para avançar.`
          : 'Complete os campos obrigatórios.',
      },
      analytics: {
        trackingId: `enhanced-step-${stepNumber.toString().padStart(2, '0')}`,
        events: ['page_view', 'interaction', 'validation_error', 'completion'],
        utmParams: true,
        customEvents: ['enhanced_component_interaction'],
      },
      logic: {
        navigation: {
          nextStep: stepNumber < 21 ? `step-${stepNumber + 1}` : 'result',
          prevStep: stepNumber > 1 ? `step-${stepNumber - 1}` : null,
          allowBack: stepNumber > 1,
          autoAdvance: false,
        },
        formHandling: {
          onSubmit: 'validateAndNext',
          validation: 'realTime',
          errorHandling: 'inline',
        },
        stateManagement: {
          localState: ['selections', 'validationState'],
          globalState: ['userProgress', 'currentStep', 'userName'],
        },
        scoring: {
          enabled: stepType === 'question',
          method: 'category-points',
          categories: [
            'Natural',
            'Clássico',
            'Contemporâneo',
            'Elegante',
            'Romântico',
            'Sexy',
            'Dramático',
            'Criativo',
          ],
        },
        conditions: null,
      },
      performance: {
        webVitals: {
          markComponentMounted: true,
          markLcpRendered: true,
          markUserInteraction: true,
        },
        optimizations: {
          preloadCriticalImages: true,
          inlineStyles: true,
          lazyLoadNonCritical: false,
          useRequestAnimationFrame: true,
        },
      },
      accessibility: {
        skipLinks: true,
        ariaLabels: true,
        focusManagement: true,
        keyboardNavigation: true,
        screenReader: true,
      },
      step: stepNumber,
    };

    return template;
  }

  /**
   * 🎯 Gera template para questão do quiz
   */
  static generateQuestionTemplate(
    stepNumber: number,
    questionTitle: string,
    options: any[],
    minSelections = 3
  ): TemplateData {
    return this.generateTemplate({
      stepNumber,
      stepType: 'question',
      includeNavigation: true,
      includeStyleCards: false,
      includeGradientBackground: true,
      includeLeadForm: false,
      questionData: {
        title: questionTitle,
        options,
        minSelections,
        maxSelections: minSelections,
      },
    });
  }

  /**
   * 🎯 Gera template para introdução
   */
  static generateIntroTemplate(stepNumber = 1): TemplateData {
    return this.generateTemplate({
      stepNumber,
      stepType: 'intro',
      includeNavigation: true,
      includeStyleCards: true,
      includeGradientBackground: true,
      includeLeadForm: true,
    });
  }

  /**
   * 🎯 Gera template para resultado
   */
  static generateResultTemplate(stepNumber = 22): TemplateData {
    return this.generateTemplate({
      stepNumber,
      stepType: 'result',
      includeNavigation: false,
      includeStyleCards: true,
      includeGradientBackground: true,
      includeLeadForm: false,
    });
  }

  /**
   * 🎯 Exporta template como JSON para arquivo
   */
  static exportTemplateAsJSON(template: TemplateData): string {
    return JSON.stringify(template, null, 2);
  }

  /**
   * 🎯 Gera todos os 21 templates automaticamente
   */
  static generateAllEnhancedTemplates(): TemplateData[] {
    const templates: TemplateData[] = [];

    // Step 1: Introdução
    templates.push(this.generateIntroTemplate(1));

    // Steps 2-21: Questões (exemplo com dados mock)
    for (let i = 2; i <= 21; i++) {
      templates.push(
        this.generateQuestionTemplate(i, `Questão ${i - 1} do Quiz de Estilo`, [
          { id: `${i}a`, text: 'Opção A', styleCategory: 'Natural', points: 1 },
          { id: `${i}b`, text: 'Opção B', styleCategory: 'Clássico', points: 2 },
          { id: `${i}c`, text: 'Opção C', styleCategory: 'Elegante', points: 3 },
        ])
      );
    }

    return templates;
  }
}

export default EnhancedTemplateGenerator;
