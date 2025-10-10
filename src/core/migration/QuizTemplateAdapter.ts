// @ts-nocheck
/**
 * 🔄 CARREGADOR E ADAPTADOR PARA MI  static loadLegacyTemplate() {
    // Template básico temporário até implementar o sistema completo
    return {
      template: null, // QUIZ_STYLE_21_STEPS_TEMPLATE,
      questions: [], // QUIZ_QUESTIONS_COMPLETE,
      persistence: null, // FUNNEL_PERSISTENCE_SCHEMA,
      globalConfig: null // QUIZ_GLOBAL_CONFIG
    };
  }E TEMPLATES
 * 
 * Sistema para converter templates antigos (quiz21StepsComplete) para o novo 
 * esquema unificado (QuizFunnelSchema), garantindo equivalência lógica e 
 * compatibilidade completa com o editor visual.
 */

import { QuizFunnelSchema, FunnelStep, StepType } from '@/types/quiz-schema';
import { Block } from '@/types/editor';
import { QUIZ_STYLE_21_STEPS_TEMPLATE, QUIZ_QUESTIONS_COMPLETE } from '../templates/quiz21StepsComplete';
import { FUNNEL_PERSISTENCE_SCHEMA, QUIZ_GLOBAL_CONFIG } from '../templates/quiz21StepsComplete';

// ============================================================================
// ADAPTADOR PRINCIPAL
// ============================================================================

export class QuizTemplateAdapter {
  /**
   * Converte o template quiz21StepsComplete para o novo esquema unificado
   */
  static async convertLegacyTemplate(): Promise<QuizFunnelSchema> {
    console.log('🔄 Iniciando conversão do template legacy para esquema unificado...');

    const legacyTemplate = this.loadLegacyTemplate();
    const unifiedSchema = await this.transformToUnifiedSchema(legacyTemplate);

    // Validar equivalência
    const validation = this.validateConversion(legacyTemplate, unifiedSchema);
    if (!validation.isValid) {
      throw new Error(`Conversão falhou: ${validation.errors.join(', ')}`);
    }

    console.log('✅ Conversão concluída com sucesso');
    return unifiedSchema;
  }

  /**
   * Carrega o template legacy do quiz21StepsComplete
   */
  private static loadLegacyTemplate() {
    return {
      template: QUIZ_STYLE_21_STEPS_TEMPLATE,
      questions: QUIZ_QUESTIONS_COMPLETE,
      persistence: FUNNEL_PERSISTENCE_SCHEMA,
      globalConfig: QUIZ_GLOBAL_CONFIG
    };
  }

  /**
   * Transforma o template legacy para o esquema unificado
   */
  private static async transformToUnifiedSchema(legacyTemplate: any): Promise<QuizFunnelSchema> {
    const steps = await this.convertSteps(legacyTemplate.template, legacyTemplate.questions);
    const settings = this.convertGlobalSettings(legacyTemplate.globalConfig);

    return {
      id: 'migrated-quiz21-steps-complete',
      name: 'Quiz de Estilo Pessoal - 21 Etapas (Migrado)',
      description: 'Template completo migrado para o novo sistema headless/canônico',
      version: '3.0.0',
      category: 'quiz',
      templateType: 'quiz-complete',

      settings,
      // Runtime e conteúdos padronizados (poderão ser refinados conforme legado)
      runtime: {
        scoring: {
          method: 'sum',
          tieBreak: 'alphabetical'
        },
        navigation: {
          autoAdvance: {
            enable: true,
            delayMs: 800
          }
        }
      },
      results: {
        styles: {
          natural: {
            title: 'Estilo Natural',
            description: 'Conforto e praticidade com leveza. Peças básicas com bom caimento e tons neutros.',
            image: 'https://placehold.co/640x360/B89B7A/FFFFFF?text=Natural'
          },
          classico: {
            title: 'Estilo Clássico',
            description: 'Elegância atemporal, cortes retos e qualidade. Paleta sóbria e sofisticação discreta.',
            image: 'https://placehold.co/640x360/432818/FFFFFF?text=Classico'
          },
          romantico: {
            title: 'Estilo Romântico',
            description: 'Delicadeza e feminilidade. Babados leves, florais suaves e curvas suaves.',
            image: 'https://placehold.co/640x360/D4AF37/FFFFFF?text=Romantico'
          }
        },
        offersMap: {
          'Montar looks com mais facilidade e confiança': {
            title: 'Guia Prático de Looks Perfeitos',
            description: 'Aprenda a combinar peças com confiança diária usando seu estilo predominante.',
            ctaLabel: 'Quero meu Guia',
            ctaUrl: '#oferta-looks',
            image: 'https://placehold.co/640x360/8F7A6A/FFFFFF?text=Guia+Looks'
          },
          'Usar o que já tenho e me sentir estilosa': {
            title: 'Rota do Guarda-Roupa Inteligente',
            description: 'Maximize o que você já tem com combinações certeiras para seu estilo.',
            ctaLabel: 'Começar Agora',
            ctaUrl: '#oferta-guarda-roupa',
            image: 'https://placehold.co/640x360/AA6B5D/FFFFFF?text=Guarda-Roupa'
          }
        }
      },
      ui: {
        behavior: {
          selectionEffects: { enabled: true, highlightColor: '#B89B7A', pulseOnComplete: true },
          validation: { showErrorOnUnderSelection: true, errorCopy: 'Selecione as opções necessárias' }
        }
      },
      steps,

      publication: {
        status: 'draft',
        baseUrl: 'https://quiz.giselegalvao.com.br',
        slug: 'descubra-seu-estilo',
        version: '3.0.0',
        changelog: [{
          version: '3.0.0',
          date: new Date().toISOString(),
          changes: [
            'Migração para esquema unificado',
            'Suporte completo ao editor visual',
            'Preview real implementado',
            'Publicação instantânea habilitada'
          ],
          author: 'Sistema de Migração'
        }],
        accessControl: {
          public: true
        },
        cdn: {
          enabled: true,
          provider: 'cloudflare'
        }
      },

      editorMeta: {
        lastModified: new Date().toISOString(),
        lastModifiedBy: 'sistema-migracao',
        editorVersion: '2.0.0',
        editorSettings: {
          autoSave: true,
          previewMode: 'desktop',
          showGrid: false,
          snapToGrid: true
        },
        baseTemplate: 'quiz21StepsComplete',
        variations: [],
        collaborators: [],
        tags: ['quiz', 'estilo-pessoal', 'completo', 'migrado'],
        categories: ['quiz', 'conversão', 'lead-generation'],
        stats: {
          totalBlocks: steps.reduce((acc, step) => acc + step.blocks.length, 0),
          totalSteps: steps.length,
          estimatedCompletionTime: 15 // minutos
        }
      }
    };
  }

  /**
   * Converte as etapas do template legacy
   */
  private static async convertSteps(legacyTemplate: Record<string, Block[]>, questions: Record<number, string>): Promise<FunnelStep[]> {
    // Validação defensiva: se legacyTemplate for null/undefined, retornar array vazio
    if (!legacyTemplate || typeof legacyTemplate !== 'object') {
      console.warn('⚠️ QuizTemplateAdapter: legacyTemplate inválido, retornando array vazio');
      return [];
    }

    const steps: FunnelStep[] = [];

    for (const [stepId, blocks] of Object.entries(legacyTemplate)) {
      const stepNumber = parseInt(stepId.replace('step-', ''));
      const step = await this.convertSingleStep(stepId, stepNumber, blocks, questions[stepNumber]);
      steps.push(step);
    }

    // Ordenar por número da etapa
    return steps.sort((a, b) => a.order - b.order);
  }

  /**
   * Converte uma única etapa
   */
  private static async convertSingleStep(
    stepId: string,
    stepNumber: number,
    blocks: Block[],
    questionText?: string
  ): Promise<FunnelStep> {
    const stepType = this.determineStepType(stepNumber);
    const stepName = this.generateStepName(stepNumber, stepType, questionText);

    return {
      id: stepId,
      name: stepName,
      description: this.generateStepDescription(stepNumber, stepType, questionText),
      order: stepNumber,
      type: stepType,

      settings: {
        showProgress: stepNumber > 1,
        progressStyle: 'bar',
        showBackButton: stepNumber > 1,
        showNextButton: true,
        allowSkip: false,
        trackTimeOnStep: true,
        trackInteractions: true,
        customEvents: [`step_${stepNumber}_viewed`]
      },

      blocks: this.convertBlocks(blocks),

      navigation: this.generateNavigationLogic(stepId, stepNumber, stepType),

      validation: this.generateValidationRules(stepType, blocks),

      seo: this.generateStepSEO(stepNumber, stepType, questionText)
    };
  }

  /**
   * Determina o tipo de etapa baseado no número
   */
  private static determineStepType(stepNumber: number): StepType {
    if (stepNumber === 1) return 'lead-capture';
    if (stepNumber >= 2 && stepNumber <= 11) return 'quiz-question';
    if (stepNumber === 12 || stepNumber === 19) return 'transition';
    if (stepNumber >= 13 && stepNumber <= 18) return 'strategic-question';
    if (stepNumber === 20) return 'result';
    if (stepNumber === 21) return 'offer';
    return 'custom';
  }

  /**
   * Gera nome da etapa
   */
  private static generateStepName(stepNumber: number, stepType: StepType, questionText?: string): string {
    switch (stepType) {
      case 'lead-capture':
        return 'Coleta de Dados Pessoais';
      case 'quiz-question':
        return `Pergunta ${stepNumber - 1}`;
      case 'strategic-question':
        return `Pergunta Estratégica ${stepNumber - 12}`;
      case 'transition':
        return stepNumber === 12 ? 'Transição para Questões Estratégicas' : 'Processando Resultado';
      case 'result':
        return 'Seu Resultado Personalizado';
      case 'offer':
        return 'Oferta Exclusiva';
      default:
        return `Etapa ${stepNumber}`;
    }
  }

  /**
   * Gera descrição da etapa
   */
  private static generateStepDescription(stepNumber: number, stepType: StepType, questionText?: string): string {
    switch (stepType) {
      case 'lead-capture':
        return 'Página para coleta de nome e informações básicas do usuário';
      case 'quiz-question':
        return questionText ? `Pergunta do quiz: ${questionText}` : `Pergunta pontuada número ${stepNumber - 1}`;
      case 'strategic-question':
        return questionText ? `Pergunta estratégica: ${questionText}` : `Pergunta qualitativa número ${stepNumber - 12}`;
      case 'transition':
        return stepNumber === 12 ? 'Página de transição entre quiz pontuado e questões estratégicas' : 'Página de processamento do resultado';
      case 'result':
        return 'Página com resultado personalizado do quiz de estilo';
      case 'offer':
        return 'Página de oferta do guia personalizado baseado no resultado';
      default:
        return `Etapa customizada número ${stepNumber}`;
    }
  }

  /**
   * Converte blocos do formato legacy
   */
  private static convertBlocks(blocks: Block[]): Block[] {
    // Por enquanto, mantém os blocos como estão
    // TODO: Implementar conversões específicas se necessário
    return blocks.map(block => ({
      ...block,
      // Adicionar propriedades do novo esquema se necessário
      editable: true,
      version: '2.0.0'
    }));
  }

  /**
   * Gera lógica de navegação para a etapa
   */
  private static generateNavigationLogic(stepId: string, stepNumber: number, stepType: StepType) {
    const baseLogic = {
      conditions: [],
      nextStep: stepNumber < 21 ? `step-${stepNumber + 1}` : undefined,
      prevStep: stepNumber > 1 ? `step-${stepNumber - 1}` : undefined,
      actions: []
    };

    // Adicionar lógicas específicas baseadas no tipo
    switch (stepType) {
      case 'quiz-question':
        baseLogic.actions.push({
          type: 'calculate-score',
          parameters: {
            scoreType: 'style-points',
            method: 'accumulative'
          }
        });
        break;

      case 'strategic-question':
        baseLogic.actions.push({
          type: 'set-variable',
          parameters: {
            variableName: `strategic_answer_${stepNumber - 12}`,
            source: 'user_input'
          }
        });
        break;

      case 'result':
        baseLogic.actions.push({
          type: 'calculate-score',
          parameters: {
            scoreType: 'final-result',
            method: 'determine-primary-style'
          }
        });
        break;
    }

    return baseLogic;
  }

  /**
   * Gera regras de validação para a etapa
   */
  private static generateValidationRules(stepType: StepType, blocks: Block[]) {
    const hasFormInput = blocks.some(block =>
      block.type === 'form-input' ||
      block.type === 'options-grid' ||
      block.type === 'quiz-question-inline'
    );

    return {
      required: hasFormInput,
      customRules: [],
      errorMessages: {
        required: 'Este campo é obrigatório',
        minSelection: 'Selecione pelo menos uma opção',
        maxSelection: 'Selecione no máximo as opções permitidas',
        invalidEmail: 'Digite um email válido'
      }
    };
  }

  /**
   * Gera configurações de SEO específicas da etapa
   */
  private static generateStepSEO(stepNumber: number, stepType: StepType, questionText?: string) {
    const baseTitle = 'Descubra Seu Estilo Pessoal';

    switch (stepType) {
      case 'lead-capture':
        return {
          title: `${baseTitle} - Comece Agora`,
          description: 'Descubra seu estilo pessoal através de nosso quiz exclusivo'
        };

      case 'quiz-question':
        return {
          title: `${baseTitle} - Pergunta ${stepNumber - 1}`,
          description: questionText || `Responda à pergunta ${stepNumber - 1} do quiz de estilo`
        };

      case 'result':
        return {
          title: `${baseTitle} - Seu Resultado`,
          description: 'Descubra seu estilo predominante e transforme seu guarda-roupa'
        };

      case 'offer':
        return {
          title: `${baseTitle} - Oferta Exclusiva`,
          description: 'Transforme seu resultado em um guia personalizado completo'
        };

      default:
        return undefined;
    }
  }

  /**
   * Converte configurações globais
   */
  private static convertGlobalSettings(globalConfig: any) {
    return {
      seo: this.convertSEOConfig(globalConfig.seo),
      analytics: this.convertAnalyticsConfig(globalConfig.analytics),
      branding: this.convertBrandingConfig(globalConfig.branding),
      persistence: this.convertPersistenceConfig(globalConfig.persistence),
      integrations: this.convertIntegrationsConfig(globalConfig.integrations),
      performance: this.convertPerformanceConfig(globalConfig.performance),
      legal: this.convertLegalConfig(globalConfig.legal)
    };
  }

  /**
   * Converte configurações de SEO
   */
  private static convertSEOConfig(seoConfig: any) {
    return {
      title: seoConfig?.title || 'Descubra Seu Estilo Pessoal - Quiz Interativo | Gisele Galvão',
      description: seoConfig?.description || 'Descubra seu estilo predominante através do nosso quiz personalizado e transforme seu guarda-roupa com confiança.',
      keywords: seoConfig?.keywords || ['estilo pessoal', 'consultoria de imagem', 'quiz de estilo'],
      robots: 'index,follow' as const,

      openGraph: {
        title: seoConfig?.openGraph?.title || 'Quiz de Estilo Pessoal',
        description: seoConfig?.openGraph?.description || 'Descubra seu estilo único',
        image: seoConfig?.openGraph?.image || 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735378/quiz_og_image.webp',
        imageAlt: 'Quiz de Estilo Pessoal',
        type: 'website' as const,
        url: 'https://quiz.giselegalvao.com.br',
        siteName: 'Gisele Galvão - Consultoria de Imagem'
      },

      twitter: {
        card: 'summary_large_image' as const,
        title: 'Quiz de Estilo Pessoal',
        description: 'Descubra seu estilo único',
        image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735378/quiz_twitter_card.webp'
      },

      structuredData: {
        '@type': 'Quiz' as const,
        name: 'Quiz de Estilo Pessoal',
        description: 'Quiz interativo para descoberta do estilo pessoal',
        provider: {
          '@type': 'Organization' as const,
          name: 'Gisele Galvão',
          url: 'https://giselegalvao.com.br',
          logo: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
        },
        category: ['Fashion', 'Lifestyle', 'Personal Development'],
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString()
      }
    };
  }

  /**
   * Converte configurações de analytics
   */
  private static convertAnalyticsConfig(analyticsConfig: any) {
    return {
      enabled: true,

      googleAnalytics: {
        measurementId: analyticsConfig?.googleAnalytics?.measurementId || 'GA4-XXXXXXXXX',
        enableEcommerce: true,
        customEvents: [
          'quiz_started',
          'step_completed',
          'quiz_completed',
          'result_viewed',
          'offer_viewed',
          'conversion'
        ]
      },

      customEvents: [
        {
          name: 'quiz_progression',
          category: 'engagement',
          action: 'step_completed',
          label: 'quiz_flow'
        },
        {
          name: 'result_interaction',
          category: 'conversion',
          action: 'result_viewed',
          label: 'quiz_result'
        }
      ],

      utm: {
        source: 'organic',
        medium: 'quiz',
        campaign: 'estilo-pessoal'
      }
    };
  }

  /**
   * Converte configurações de branding
   */
  private static convertBrandingConfig(brandingConfig: any) {
    return {
      colors: {
        primary: '#B89B7A',
        secondary: '#D4C2A8',
        accent: '#4CAF50',
        background: '#F9F5F1',
        surface: '#FFFFFF',
        text: {
          primary: '#432818',
          secondary: '#6B5B4E',
          disabled: '#9CA3AF'
        },
        error: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981'
      },

      typography: {
        fontFamily: {
          primary: 'Inter, system-ui, sans-serif',
          secondary: 'Poppins, sans-serif',
          monospace: 'JetBrains Mono, monospace'
        },
        fontSizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem'
        },
        fontWeights: {
          light: 300,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700
        },
        lineHeight: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.75
        }
      },

      logo: {
        primary: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        favicon: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/favicon.ico',
        appleTouchIcon: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/apple-touch-icon.png'
      },

      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem'
      },

      borderRadius: {
        none: '0',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        full: '9999px'
      },

      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }
    };
  }

  /**
   * Converte configurações de persistência
   */
  private static convertPersistenceConfig(persistenceConfig: any) {
    return {
      enabled: true,
      storage: ['localStorage', 'supabase'] as const,
      autoSave: true,
      autoSaveInterval: 30000,
      compression: true,
      encryption: false,
      backupEnabled: true,

      webhooks: []
    };
  }

  /**
   * Converte configurações de integrações
   */
  private static convertIntegrationsConfig(integrationsConfig: any) {
    return {
      webhooks: [
        {
          id: 'quiz-completion',
          name: 'Quiz Completion Webhook',
          url: 'https://hooks.zapier.com/hooks/catch/XXXXXX/XXXXXX/',
          method: 'POST' as const,
          headers: {
            'Content-Type': 'application/json'
          },
          events: ['quiz_completed', 'result_calculated'] as const,
          active: false,
          retryPolicy: {
            maxRetries: 3,
            backoffMultiplier: 2
          }
        }
      ]
    };
  }

  /**
   * Converte configurações de performance
   */
  private static convertPerformanceConfig(performanceConfig: any) {
    return {
      cache: {
        enabled: true,
        strategy: 'stale-while-revalidate' as const,
        ttl: 3600
      },

      lazyLoading: {
        images: true,
        components: true,
        threshold: 100
      },

      preload: {
        criticalResources: [
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
        ],
        nextStep: true
      },

      compression: {
        images: true,
        scripts: true,
        styles: true
      }
    };
  }

  /**
   * Converte configurações legais
   */
  private static convertLegalConfig(legalConfig: any) {
    return {
      privacy: {
        enabled: true,
        policyUrl: 'https://giselegalvao.com.br/privacidade',
        consentRequired: true,
        cookieNotice: true
      },

      terms: {
        enabled: true,
        termsUrl: 'https://giselegalvao.com.br/termos',
        acceptanceRequired: false
      },

      dataProcessing: {
        purpose: ['Personalização de conteúdo', 'Análise de comportamento', 'Marketing direcionado'],
        legalBasis: 'Consentimento explícito do usuário',
        retentionPeriod: 365,
        rightToDelete: true,
        rightToPortability: true
      }
    };
  }

  /**
   * Valida a conversão para garantir equivalência
   */
  private static validateConversion(legacyTemplate: any, unifiedSchema: QuizFunnelSchema) {
    const errors: string[] = [];

    // Validar número de etapas
    const legacyStepsCount = Object.keys(legacyTemplate.template).length;
    if (unifiedSchema.steps.length !== legacyStepsCount) {
      errors.push(`Número de etapas divergente: legacy=${legacyStepsCount}, unified=${unifiedSchema.steps.length}`);
    }

    // Validar presença de blocos essenciais
    for (const step of unifiedSchema.steps) {
      if (step.blocks.length === 0) {
        errors.push(`Etapa ${step.id} não possui blocos`);
      }
    }

    // Validar configurações obrigatórias
    if (!unifiedSchema.settings.seo.title) {
      errors.push('Título SEO é obrigatório');
    }

    if (!unifiedSchema.settings.branding.colors.primary) {
      errors.push('Cor primária da marca é obrigatória');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

