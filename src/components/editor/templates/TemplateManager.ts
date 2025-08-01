/**
 * Sistema Consolidado de Templates
 * Centraliza toda a lógica de carregamento de templates em uma arquitetura modular
 */

import { BlockData } from '../../../types/blocks';

// Interface para definir um template de etapa
export interface StepTemplate {
  id: string;
  name: string;
  description: string;
  category: 'intro' | 'question' | 'strategic' | 'transition' | 'result' | 'offer';
  blocks: BlockData[];
  metadata?: {
    questionNumber?: number;
    totalQuestions?: number;
    isStrategic?: boolean;
    hasProgress?: boolean;
  };
}

// Interface para configuração de template
export interface TemplateConfig {
  stepIndex: number;
  questionNumber?: number;
  totalQuestions?: number;
  isStrategic?: boolean;
  customData?: Record<string, any>;
}

// Cache de templates para otimização de performance
const templateCache = new Map<string, StepTemplate>();

/**
 * Classe principal para gerenciamento de templates
 */
export class TemplateManager {
  private static instance: TemplateManager;
  
  private constructor() {}
  
  public static getInstance(): TemplateManager {
    if (!TemplateManager.instance) {
      TemplateManager.instance = new TemplateManager();
    }
    return TemplateManager.instance;
  }

  /**
   * Carrega um template de forma assíncrona
   */
  public async loadTemplate(config: TemplateConfig): Promise<BlockData[]> {
    const cacheKey = this.generateCacheKey(config);
    
    // Verificar cache primeiro
    if (templateCache.has(cacheKey)) {
      const template = templateCache.get(cacheKey)!;
      return this.cloneBlocks(template.blocks);
    }

    // Carregar template baseado na configuração
    const template = await this.generateTemplate(config);
    
    // Armazenar no cache
    templateCache.set(cacheKey, template);
    
    return this.cloneBlocks(template.blocks);
  }

  /**
   * Gera um template baseado na configuração
   */
  private async generateTemplate(config: TemplateConfig): Promise<StepTemplate> {
    const { stepIndex } = config;

    if (stepIndex === 0) {
      return this.createIntroTemplate();
    } else if (stepIndex >= 1 && stepIndex <= 12) {
      return this.createMainQuestionTemplate(config);
    } else if (stepIndex === 13) {
      return this.createTransitionTemplate();
    } else if (stepIndex >= 14 && stepIndex <= 19) {
      return this.createStrategicQuestionTemplate(config);
    } else if (stepIndex === 20) {
      return this.createResultTemplate();
    } else if (stepIndex === 21) {
      return this.createOfferTemplate();
    }

    return this.createEmptyTemplate(stepIndex);
  }

  /**
   * Template de introdução (Etapa 0)
   */
  private createIntroTemplate(): StepTemplate {
    return {
      id: 'intro-template',
      name: 'Introdução',
      description: 'Página de introdução com coleta de nome',
      category: 'intro',
      blocks: [
        {
          id: 'intro-header',
          type: 'HeaderBlock',
          order: 0,
          properties: {
            title: 'Descubra Seu Estilo Pessoal',
            subtitle: 'Quiz Personalizado para Você',
            alignment: 'center',
            titleColor: '#1a1a1a',
            subtitleColor: '#666666',
            backgroundColor: 'transparent',
            titleSize: 'text-4xl',
            subtitleSize: 'text-xl',
            spacing: 'py-8'
          }
        },
        {
          id: 'intro-decorative-bar',
          type: 'DecorativeBarBlock',
          order: 1,
          properties: {
            style: 'gradient',
            height: '4px',
            colors: ['#8B5CF6', '#3B82F6'],
            width: '200px',
            alignment: 'center',
            margin: 'my-6'
          }
        },
        {
          id: 'intro-text',
          type: 'TextBlock',
          order: 2,
          properties: {
            content: 'Bem-vindo ao nosso quiz exclusivo! Vamos descobrir qual estilo combina mais com você através de algumas perguntas divertidas.',
            alignment: 'center',
            fontSize: 'text-lg',
            color: '#4a5568',
            backgroundColor: 'transparent',
            padding: 'p-4',
            maxWidth: 'max-w-2xl',
            margin: 'mx-auto mb-8'
          }
        },
        {
          id: 'intro-image',
          type: 'ImageBlock',
          order: 3,
          properties: {
            src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            alt: 'Quiz de Estilo Pessoal',
            width: '400px',
            height: '300px',
            alignment: 'center',
            borderRadius: '12px',
            shadow: 'shadow-lg',
            margin: 'mb-8'
          }
        },
        {
          id: 'name-input',
          type: 'NameInputBlock',
          order: 4,
          properties: {
            label: 'Como você gostaria de ser chamado?',
            placeholder: 'Digite seu primeiro nome...',
            required: true,
            buttonText: 'Começar Quiz',
            buttonColor: 'bg-gradient-to-r from-purple-600 to-blue-600',
            buttonHoverColor: 'hover:from-purple-700 hover:to-blue-700',
            alignment: 'center',
            maxWidth: 'max-w-md',
            margin: 'mx-auto'
          }
        }
      ]
    };
  }

  /**
   * Template de questão principal (Etapas 1-12)
   */
  private createMainQuestionTemplate(config: TemplateConfig): StepTemplate {
    const questionNumber = config.stepIndex;
    const mainQuestions = this.getMainQuestions();
    const currentQuestion = mainQuestions[questionNumber - 1];

    if (!currentQuestion) {
      return this.createEmptyTemplate(config.stepIndex);
    }

    return {
      id: `main-question-${questionNumber}`,
      name: `Questão ${questionNumber}`,
      description: currentQuestion.question,
      category: 'question',
      metadata: {
        questionNumber,
        totalQuestions: 12,
        isStrategic: false,
        hasProgress: true
      },
      blocks: [
        {
          id: `question-${questionNumber}-header`,
          type: 'HeaderBlock',
          order: 0,
          properties: {
            title: `Pergunta ${questionNumber} de 12`,
            subtitle: currentQuestion.question,
            alignment: 'center',
            titleColor: '#6B7280',
            subtitleColor: '#1F2937',
            backgroundColor: 'transparent',
            titleSize: 'text-sm',
            subtitleSize: 'text-2xl',
            spacing: 'py-6'
          }
        },
        {
          id: `question-${questionNumber}-progress`,
          type: 'ProgressBarBlock',
          order: 1,
          properties: {
            currentStep: questionNumber,
            totalSteps: 12,
            showPercentage: true,
            color: 'bg-gradient-to-r from-purple-600 to-blue-600',
            backgroundColor: 'bg-gray-200',
            height: '8px',
            borderRadius: 'rounded-full',
            margin: 'mb-8'
          }
        },
        {
          id: `question-${questionNumber}`,
          type: 'QuizQuestionBlock',
          order: 2,
          properties: {
            question: currentQuestion.question,
            options: currentQuestion.options,
            questionNumber: questionNumber,
            totalQuestions: 12,
            allowMultiple: false,
            required: true,
            buttonText: questionNumber === 12 ? 'Continuar para Questões Estratégicas' : 'Próxima Pergunta',
            buttonColor: 'bg-gradient-to-r from-purple-600 to-blue-600',
            buttonHoverColor: 'hover:from-purple-700 hover:to-blue-700'
          }
        }
      ]
    };
  }

  /**
   * Template de transição (Etapa 13)
   */
  private createTransitionTemplate(): StepTemplate {
    return {
      id: 'transition-template',
      name: 'Transição',
      description: 'Transição para questões estratégicas',
      category: 'transition',
      blocks: [
        {
          id: 'transition-header',
          type: 'HeaderBlock',
          order: 0,
          properties: {
            title: 'Ótimo trabalho!',
            subtitle: 'Agora vamos para algumas questões estratégicas',
            alignment: 'center',
            titleColor: '#059669',
            subtitleColor: '#1F2937',
            backgroundColor: 'transparent',
            titleSize: 'text-3xl',
            subtitleSize: 'text-xl',
            spacing: 'py-8'
          }
        },
        {
          id: 'transition-text',
          type: 'TextBlock',
          order: 1,
          properties: {
            content: 'Você completou as questões principais! Agora vamos fazer algumas perguntas estratégicas para personalizar ainda mais seu resultado.',
            alignment: 'center',
            fontSize: 'text-lg',
            color: '#4a5568',
            backgroundColor: 'transparent',
            padding: 'p-4',
            maxWidth: 'max-w-2xl',
            margin: 'mx-auto mb-8'
          }
        },
        {
          id: 'transition-button',
          type: 'ButtonBlock',
          order: 2,
          properties: {
            text: 'Continuar para Questões Estratégicas',
            color: 'bg-gradient-to-r from-green-600 to-blue-600',
            hoverColor: 'hover:from-green-700 hover:to-blue-700',
            textColor: 'text-white',
            size: 'px-8 py-3',
            borderRadius: 'rounded-lg',
            alignment: 'center',
            action: 'next-step'
          }
        }
      ]
    };
  }

  /**
   * Template de questão estratégica (Etapas 14-19)
   */
  private createStrategicQuestionTemplate(config: TemplateConfig): StepTemplate {
    const strategicQuestionNumber = config.stepIndex - 13;
    const strategicQuestions = this.getStrategicQuestions();
    const currentQuestion = strategicQuestions[strategicQuestionNumber - 1];

    if (!currentQuestion) {
      return this.createEmptyTemplate(config.stepIndex);
    }

    return {
      id: `strategic-question-${strategicQuestionNumber}`,
      name: `Questão Estratégica ${strategicQuestionNumber}`,
      description: currentQuestion.question,
      category: 'strategic',
      metadata: {
        questionNumber: strategicQuestionNumber + 12,
        totalQuestions: 19,
        isStrategic: true,
        hasProgress: true
      },
      blocks: [
        {
          id: `strategic-${strategicQuestionNumber}-header`,
          type: 'HeaderBlock',
          order: 0,
          properties: {
            title: `Questão Estratégica ${strategicQuestionNumber} de 6`,
            subtitle: currentQuestion.question,
            alignment: 'center',
            titleColor: '#7C3AED',
            subtitleColor: '#1F2937',
            backgroundColor: 'transparent',
            titleSize: 'text-sm',
            subtitleSize: 'text-2xl',
            spacing: 'py-6'
          }
        },
        {
          id: `strategic-${strategicQuestionNumber}-progress`,
          type: 'ProgressBarBlock',
          order: 1,
          properties: {
            currentStep: strategicQuestionNumber + 12,
            totalSteps: 19,
            showPercentage: true,
            color: 'bg-gradient-to-r from-purple-600 to-pink-600',
            backgroundColor: 'bg-gray-200',
            height: '8px',
            borderRadius: 'rounded-full',
            margin: 'mb-8'
          }
        },
        {
          id: `strategic-${strategicQuestionNumber}`,
          type: 'QuizQuestionBlock',
          order: 2,
          properties: {
            question: currentQuestion.question,
            options: currentQuestion.options,
            questionNumber: strategicQuestionNumber + 12,
            totalQuestions: 19,
            allowMultiple: false,
            required: true,
            buttonText: strategicQuestionNumber === 6 ? 'Ver Meu Resultado' : 'Próxima Pergunta',
            buttonColor: 'bg-gradient-to-r from-purple-600 to-pink-600',
            buttonHoverColor: 'hover:from-purple-700 hover:to-pink-700'
          }
        }
      ]
    };
  }

  /**
   * Template de resultado (Etapa 20)
   */
  private createResultTemplate(): StepTemplate {
    return {
      id: 'result-template',
      name: 'Resultado',
      description: 'Página de resultado do quiz',
      category: 'result',
      blocks: [
        {
          id: 'result-header',
          type: 'HeaderBlock',
          order: 0,
          properties: {
            title: 'Seu Resultado Está Pronto!',
            subtitle: 'Descubra seu estilo pessoal único',
            alignment: 'center',
            titleColor: '#059669',
            subtitleColor: '#1F2937',
            backgroundColor: 'transparent',
            titleSize: 'text-4xl',
            subtitleSize: 'text-xl',
            spacing: 'py-8'
          }
        },
        {
          id: 'result-display',
          type: 'QuizResultBlock',
          order: 1,
          properties: {
            showPersonalizedResult: true,
            includeRecommendations: true,
            showShareButtons: true,
            resultTitle: 'Seu Estilo Pessoal',
            resultDescription: 'Baseado em suas respostas, identificamos seu perfil único de estilo.',
            backgroundColor: 'bg-gradient-to-br from-purple-50 to-blue-50',
            borderRadius: 'rounded-xl',
            padding: 'p-8',
            margin: 'mb-8'
          }
        },
        {
          id: 'result-cta',
          type: 'ButtonBlock',
          order: 2,
          properties: {
            text: 'Quero Receber Dicas Personalizadas',
            color: 'bg-gradient-to-r from-green-600 to-blue-600',
            hoverColor: 'hover:from-green-700 hover:to-blue-700',
            textColor: 'text-white',
            size: 'px-8 py-4',
            borderRadius: 'rounded-lg',
            alignment: 'center',
            action: 'next-step'
          }
        }
      ]
    };
  }

  /**
   * Template de oferta (Etapa 21)
   */
  private createOfferTemplate(): StepTemplate {
    return {
      id: 'offer-template',
      name: 'Oferta',
      description: 'Página de oferta especial',
      category: 'offer',
      blocks: [
        {
          id: 'offer-header',
          type: 'HeaderBlock',
          order: 0,
          properties: {
            title: 'Oferta Especial Para Você!',
            subtitle: 'Consultoria de Estilo Personalizada',
            alignment: 'center',
            titleColor: '#DC2626',
            subtitleColor: '#1F2937',
            backgroundColor: 'transparent',
            titleSize: 'text-4xl',
            subtitleSize: 'text-2xl',
            spacing: 'py-8'
          }
        },
        {
          id: 'offer-content',
          type: 'OfferBlock',
          order: 1,
          properties: {
            title: 'Consultoria de Estilo Completa',
            originalPrice: 'R$ 497',
            discountPrice: 'R$ 197',
            discount: '60% OFF',
            features: [
              'Análise completa do seu perfil de estilo',
              'Guia personalizado de cores e cortes',
              'Lista de compras estratégica',
              'Consultoria por vídeo de 1 hora',
              'Suporte por 30 dias via WhatsApp'
            ],
            urgency: 'Oferta válida apenas hoje!',
            buttonText: 'Quero Minha Consultoria',
            buttonColor: 'bg-gradient-to-r from-red-600 to-pink-600',
            buttonHoverColor: 'hover:from-red-700 hover:to-pink-700'
          }
        }
      ]
    };
  }

  /**
   * Template vazio para etapas não encontradas
   */
  private createEmptyTemplate(stepIndex: number): StepTemplate {
    return {
      id: `empty-template-${stepIndex}`,
      name: `Etapa ${stepIndex}`,
      description: 'Template vazio',
      category: 'intro',
      blocks: []
    };
  }

  /**
   * Gera uma chave de cache baseada na configuração
   */
  private generateCacheKey(config: TemplateConfig): string {
    return `step-${config.stepIndex}-${config.questionNumber || 0}-${config.isStrategic || false}`;
  }

  /**
   * Clona os blocos para evitar mutação do cache
   */
  private cloneBlocks(blocks: BlockData[]): BlockData[] {
    return JSON.parse(JSON.stringify(blocks));
  }

  /**
   * Limpa o cache de templates
   */
  public clearCache(): void {
    templateCache.clear();
  }

  /**
   * Obtém informações sobre um template sem carregá-lo
   */
  public async getTemplateInfo(config: TemplateConfig): Promise<Omit<StepTemplate, 'blocks'>> {
    const template = await this.generateTemplate(config);
    const { blocks, ...info } = template;
    return info;
  }

  // Dados das questões principais
  private getMainQuestions() {
    return [
      {
        question: "Qual dessas cores mais representa sua personalidade?",
        options: [
          { text: "Azul - Calma e confiança", value: "azul", points: { elegante: 3, casual: 1, moderno: 2, classico: 2 } },
          { text: "Vermelho - Energia e paixão", value: "vermelho", points: { elegante: 2, casual: 3, moderno: 3, classico: 1 } },
          { text: "Verde - Natureza e equilíbrio", value: "verde", points: { elegante: 1, casual: 3, moderno: 1, classico: 3 } },
          { text: "Preto - Sofisticação e mistério", value: "preto", points: { elegante: 3, casual: 1, moderno: 3, classico: 2 } }
        ]
      },
      {
        question: "Como você prefere passar seu tempo livre?",
        options: [
          { text: "Lendo um bom livro", value: "lendo", points: { elegante: 2, casual: 1, moderno: 1, classico: 3 } },
          { text: "Praticando esportes", value: "esportes", points: { elegante: 1, casual: 3, moderno: 2, classico: 1 } },
          { text: "Explorando arte e cultura", value: "arte", points: { elegante: 3, casual: 1, moderno: 3, classico: 2 } },
          { text: "Relaxando em casa", value: "casa", points: { elegante: 1, casual: 3, moderno: 1, classico: 2 } }
        ]
      },
      // ... adicionar as outras 10 questões aqui
    ];
  }

  // Dados das questões estratégicas
  private getStrategicQuestions() {
    return [
      {
        question: "Qual faixa etária melhor te descreve?",
        options: [
          { text: "18-25 anos", value: "18-25", points: { jovem: 3, adulto: 1, maduro: 0 } },
          { text: "26-35 anos", value: "26-35", points: { jovem: 2, adulto: 3, maduro: 1 } },
          { text: "36-45 anos", value: "36-45", points: { jovem: 1, adulto: 3, maduro: 2 } },
          { text: "46+ anos", value: "46+", points: { jovem: 0, adulto: 2, maduro: 3 } }
        ]
      },
      // ... adicionar as outras 5 questões estratégicas aqui
    ];
  }
}

// Exportar instância singleton
export const templateManager = TemplateManager.getInstance();