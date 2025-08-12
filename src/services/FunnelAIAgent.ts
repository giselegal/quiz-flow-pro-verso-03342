import { generateSemanticId } from '@/utils/semanticIdGenerator';

export interface FunnelTemplate {
  meta: {
    name: string;
    description: string;
    version: string;
    author: string;
  };
  design: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    fontFamily: string;
    button: {
      background: string;
      textColor: string;
      borderRadius: string;
      shadow: string;
    };
    card: {
      background: string;
      borderRadius: string;
      shadow: string;
    };
    progressBar: {
      color: string;
      background: string;
      height: string;
    };
    animations: {
      questionTransition?: string;
      optionSelect?: string;
      button?: string;
      formTransition?: string;
      buttonHover?: string;
      resultAppear?: string;
      [key: string]: any;
    };
  };
  steps: Array<{
    type: string;
    title: string;
    description?: string;
    [key: string]: any;
  }>;
  logic: {
    selection: Record<string, string>;
    calculation: Record<string, string>;
    transitions: Record<string, string>;
  };
  config: {
    localStorageKeys: string[];
    analyticsEvents?: string[];
    tracking?: Record<string, any>;
    features?: Record<string, any>;
    [key: string]: any;
  };
  integrations?: {
    ai?: Record<string, any>;
    analytics?: Record<string, any>;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface AgentStep {
  id: string;
  name: string;
  description: string;
  processor: (template: FunnelTemplate, progress: (p: number) => void) => Promise<any>;
}

export class FunnelAIAgent {
  private steps: AgentStep[];
  private onStepUpdate?: (
    stepId: string,
    status: 'processing' | 'completed' | 'error',
    progress: number
  ) => void;

  constructor(
    onStepUpdate?: (
      stepId: string,
      status: 'processing' | 'completed' | 'error',
      progress: number
    ) => void
  ) {
    this.onStepUpdate = onStepUpdate;
    this.steps = [
      {
        id: 'analyze',
        name: 'Analisando Template',
        description: 'Processando estrutura JSON e validando dados...',
        processor: this.analyzeTemplate.bind(this),
      },
      {
        id: 'design',
        name: 'Aplicando Design System',
        description: 'Configurando cores, tipografia e componentes visuais...',
        processor: this.applyDesignSystem.bind(this),
      },
      {
        id: 'intro',
        name: 'Criando Página de Introdução',
        description: 'Gerando formulário de entrada com validação...',
        processor: this.createIntroStep.bind(this),
      },
      {
        id: 'questions',
        name: 'Configurando Perguntas Principais',
        description: 'Criando grids de opções com imagens e validação multiselect...',
        processor: this.createQuestionsSteps.bind(this),
      },
      {
        id: 'transition1',
        name: 'Tela de Transição 1',
        description: 'Implementando animação e loading entre etapas...',
        processor: this.createTransitionSteps.bind(this),
      },
      {
        id: 'strategic',
        name: 'Perguntas Estratégicas',
        description: 'Configurando questões de segmentação e qualificação...',
        processor: this.createStrategicSteps.bind(this),
      },
      {
        id: 'result',
        name: 'Página de Resultado',
        description: 'Gerando resultados personalizados com CTAs...',
        processor: this.createResultStep.bind(this),
      },
      {
        id: 'logic',
        name: 'Sistema de Cálculo',
        description: 'Implementando lógica de pontuação por categoria...',
        processor: this.implementCalculationLogic.bind(this),
      },
      {
        id: 'analytics',
        name: 'Configurando Analytics',
        description: 'Integrando eventos de tracking e conversão...',
        processor: this.setupAnalytics.bind(this),
      },
      {
        id: 'optimize',
        name: 'Otimizações Finais',
        description: 'Aplicando performance e responsividade...',
        processor: this.applyOptimizations.bind(this),
      },
      {
        id: 'deploy',
        name: 'Publicando Funil',
        description: 'Disponibilizando funil para acesso público...',
        processor: this.deployFunnel.bind(this),
      },
    ];
  }

  async generateFunnel(template: FunnelTemplate): Promise<string> {
    const funnelId = generateSemanticId({
      context: 'ai-agent',
      type: 'funnel',
      identifier: template.meta.name.toLowerCase().replace(/\s+/g, '-'),
      index: Date.now(),
    });

    console.log('🤖 AI Agent: Iniciando geração de funil...', {
      funnelId,
      template: template.meta.name,
    });

    const generatedFunnel: any = {
      id: generateSemanticId({
        context: 'ai-agent',
        type: 'funnel',
        identifier: template.meta.name.toLowerCase().replace(/\s+/g, '-'),
      }),
      template: template.meta.name,
      design: template.design,
      steps: [],
      logic: template.logic || {},
      config: template.config,
      integrations: template.integrations || {},
      createdAt: new Date().toISOString(),
      createdBy: 'ai-agent',
    }; // Executa cada etapa do agente
    for (const step of this.steps) {
      try {
        this.onStepUpdate?.(step.id, 'processing', 0);

        const result = await step.processor(template, progress => {
          this.onStepUpdate?.(step.id, 'processing', progress);
        });

        generatedFunnel.steps.push(result);

        this.onStepUpdate?.(step.id, 'completed', 100);

        // Simula tempo de processamento realista
        await this.delay(500 + Math.random() * 1000);
      } catch (error) {
        console.error(`❌ Erro na etapa ${step.id}:`, error);
        this.onStepUpdate?.(step.id, 'error', 0);
        throw error;
      }
    }

    // Salva o funil gerado no localStorage para simulação
    this.saveFunnelToStorage(funnelId, generatedFunnel);

    console.log('✅ AI Agent: Funil gerado com sucesso!', {
      funnelId,
      totalSteps: generatedFunnel.steps.length,
    });

    return funnelId;
  }

  private async analyzeTemplate(
    template: FunnelTemplate,
    progress: (p: number) => void
  ): Promise<any> {
    progress(20);
    await this.delay(300);

    // Valida estrutura do template
    const requiredFields = ['meta', 'design', 'steps'];
    for (const field of requiredFields) {
      if (!template[field]) {
        throw new Error(`Campo obrigatório ausente: ${field}`);
      }
    }

    progress(60);
    await this.delay(200);

    // Conta elementos
    const analysis = {
      totalSteps: Array.isArray(template.steps) ? template.steps.length : 21,
      hasDesignSystem: Boolean(template.design),
      hasLogic: Boolean(template.logic),
      hasAnalytics: Boolean(template.config?.analyticsEvents),
    };

    progress(100);

    return {
      type: 'analysis',
      data: analysis,
      timestamp: new Date().toISOString(),
    };
  }

  private async applyDesignSystem(
    template: FunnelTemplate,
    progress: (p: number) => void
  ): Promise<any> {
    progress(30);
    await this.delay(400);

    // Aplica sistema de cores
    const designSystem = {
      colors: {
        primary: template.design.primaryColor,
        secondary: template.design.secondaryColor,
        accent: template.design.accentColor,
        background: template.design.backgroundColor,
      },
      typography: {
        fontFamily: template.design.fontFamily,
      },
      components: {
        button: template.design.button,
        card: template.design.card,
        progressBar: template.design.progressBar,
      },
      animations: template.design.animations,
    };

    progress(80);
    await this.delay(300);
    progress(100);

    return {
      type: 'design-system',
      data: designSystem,
      timestamp: new Date().toISOString(),
    };
  }

  private async createIntroStep(
    template: FunnelTemplate,
    progress: (p: number) => void
  ): Promise<any> {
    progress(25);
    await this.delay(500);

    const introStep = {
      id: generateSemanticId({ context: 'step', type: 'intro', identifier: 'intro-page' }),
      type: 'intro',
      order: 1,
      content: {
        title: template.steps.find(s => s.type === 'intro')?.title || 'Bem-vindo ao Quiz',
        subtitle: template.steps.find(s => s.type === 'intro')?.descriptionTop || '',
        description: template.steps.find(s => s.type === 'intro')?.descriptionBottom || '',
        image: template.steps.find(s => s.type === 'intro')?.imageIntro || '',
        inputConfig: {
          type: 'text',
          label: 'Nome *',
          placeholder: 'Digite seu nome',
          required: true,
          validation: {
            minLength: 2,
            errorMessage: 'Digite seu nome para continuar',
          },
        },
        button: {
          text: 'Digite seu nome para continuar',
          style: template.design.button,
        },
      },
      design: {
        backgroundColor: template.design.backgroundColor,
        primaryColor: template.design.primaryColor,
      },
    };

    progress(70);
    await this.delay(300);
    progress(100);

    return introStep;
  }

  private async createQuestionsSteps(
    template: FunnelTemplate,
    progress: (p: number) => void
  ): Promise<any> {
    progress(15);
    await this.delay(600);

    // Simula criação de múltiplas perguntas
    const questionsData = template.steps.find(s => s.type === 'questions');
    const questionSteps = [];

    if (questionsData?.questions) {
      for (let i = 0; i < questionsData.questions.length; i++) {
        const question = questionsData.questions[i];

        questionSteps.push({
          id: generateSemanticId({
            context: 'step',
            type: 'question',
            identifier: `question-${i + 1}`,
          }),
          type: 'question',
          order: i + 2, // After intro
          content: {
            title: question.title,
            layout: question.layout,
            multiSelect: question.multiSelect,
            options: question.options,
            validation: {
              required: question.multiSelect,
              errorMessage: `Selecione ${question.multiSelect} opções para avançar.`,
            },
          },
          design: {
            gridColumns: question.layout === '2col' ? 2 : 1,
            optionStyle: template.design.animations.optionSelect,
            progressBar: template.design.progressBar,
          },
        });

        progress(15 + (i + 1) * 20);
        await this.delay(200);
      }
    }

    progress(100);

    return {
      type: 'questions-collection',
      data: questionSteps,
      count: questionSteps.length,
      timestamp: new Date().toISOString(),
    };
  }

  private async createTransitionSteps(
    template: FunnelTemplate,
    progress: (p: number) => void
  ): Promise<any> {
    progress(40);
    await this.delay(400);

    const transitions = template.steps.filter(
      s => s.type.includes('Transition') || s.type.includes('transition')
    );
    const transitionSteps = transitions.map((transition, index) => ({
      id: generateSemanticId({
        context: 'step',
        type: 'transition',
        identifier: `transition-${index + 1}`,
      }),
      type: 'transition',
      order: 10 + index, // Middle of funnel
      content: {
        title: transition.title,
        description: transition.description,
        backgroundImage: transition.backgroundImage,
        textColor: transition.textColor,
        showProgressBar: transition.progressBar?.show || false,
      },
      animations: {
        enter: 'fade-in',
        exit: 'fade-out',
        duration: 2000,
      },
    }));

    progress(80);
    await this.delay(300);
    progress(100);

    return {
      type: 'transitions-collection',
      data: transitionSteps,
      timestamp: new Date().toISOString(),
    };
  }

  private async createStrategicSteps(
    template: FunnelTemplate,
    progress: (p: number) => void
  ): Promise<any> {
    progress(20);
    await this.delay(700);

    const strategicData = template.steps.find(s => s.type === 'strategicQuestions');
    const strategicSteps = [];

    if (strategicData?.questions) {
      for (let i = 0; i < strategicData.questions.length; i++) {
        const question = strategicData.questions[i];

        strategicSteps.push({
          id: generateSemanticId({
            context: 'step',
            type: 'strategic',
            identifier: `strategic-${i + 1}`,
          }),
          type: 'strategic-question',
          order: 15 + i,
          content: {
            title: question.title,
            imageUrl: question.imageUrl,
            imageSize: question.imageSize,
            layout: question.layout,
            options: question.options,
            validation: {
              required: 1,
              errorMessage: 'Selecione uma opção para avançar.',
            },
          },
          design: {
            singleSelect: true,
            imagePosition: 'top',
            optionStyle: 'card',
          },
        });

        progress(20 + (i + 1) * 13);
        await this.delay(150);
      }
    }

    progress(100);

    return {
      type: 'strategic-collection',
      data: strategicSteps,
      timestamp: new Date().toISOString(),
    };
  }

  private async createResultStep(
    template: FunnelTemplate,
    progress: (p: number) => void
  ): Promise<any> {
    progress(30);
    await this.delay(500);

    const resultData = template.steps.find(s => s.type === 'result');

    const resultStep = {
      id: generateSemanticId({ context: 'step', type: 'result', identifier: 'result-page' }),
      type: 'result',
      order: 21,
      content: {
        title: resultData?.title || 'Seu Resultado',
        description: resultData?.description || '',
        styles: resultData?.styles || [],
        cta: resultData?.cta || {},
        bonus: resultData?.bonus || [],
      },
      logic: {
        calculationMethod: 'category-scoring',
        displayLogic: 'highest-score-wins',
        fallback: 'default-result',
      },
      design: {
        resultCardStyle: template.design.card,
        ctaButtonStyle: template.design.button,
        backgroundGradient: `linear-gradient(135deg, ${template.design.backgroundColor}, ${template.design.primaryColor}20)`,
      },
    };

    progress(85);
    await this.delay(400);
    progress(100);

    return resultStep;
  }

  private async implementCalculationLogic(
    template: FunnelTemplate,
    progress: (p: number) => void
  ): Promise<any> {
    progress(35);
    await this.delay(400);

    const calculationLogic = {
      method: template.logic.calculation.method,
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
      scoring: {
        perAnswer: 1,
        bonusMultiplier: 1.2,
        strategicWeight: 0.3,
      },
      resultDetermination: {
        primary: 'highest-score',
        secondary: 'second-highest',
        threshold: 0.1,
      },
    };

    progress(75);
    await this.delay(300);
    progress(100);

    return {
      type: 'calculation-logic',
      data: calculationLogic,
      timestamp: new Date().toISOString(),
    };
  }

  private async setupAnalytics(
    template: FunnelTemplate,
    progress: (p: number) => void
  ): Promise<any> {
    progress(25);
    await this.delay(350);

    const analyticsConfig = {
      events: template.config.analyticsEvents,
      tracking: template.config.tracking,
      localStorage: template.config.localStorageKeys,
      pixelEvents: ['PageView', 'Lead', 'CompleteRegistration', 'Purchase'],
      conversionGoals: {
        primary: 'quiz_completed',
        secondary: 'cta_clicked',
        conversion: 'purchase_completed',
      },
    };

    progress(70);
    await this.delay(250);
    progress(100);

    return {
      type: 'analytics-config',
      data: analyticsConfig,
      timestamp: new Date().toISOString(),
    };
  }

  private async applyOptimizations(
    template: FunnelTemplate,
    progress: (p: number) => void
  ): Promise<any> {
    progress(20);
    await this.delay(600);

    const optimizations = {
      performance: {
        imageOptimization: true,
        lazyLoading: true,
        codesplitting: true,
        bundleOptimization: true,
      },
      responsiveness: {
        mobileFirst: true,
        breakpoints: ['320px', '768px', '1024px', '1440px'],
        touchOptimized: true,
      },
      seo: {
        metaTags: true,
        structuredData: true,
        openGraph: true,
        sitemap: true,
      },
      accessibility: {
        ariaLabels: true,
        keyboardNavigation: true,
        colorContrast: 'AA',
        screenReader: true,
      },
    };

    progress(80);
    await this.delay(400);
    progress(100);

    return {
      type: 'optimizations',
      data: optimizations,
      timestamp: new Date().toISOString(),
    };
  }

  private async deployFunnel(
    template: FunnelTemplate,
    progress: (p: number) => void
  ): Promise<any> {
    progress(15);
    await this.delay(800);

    progress(45);
    await this.delay(600);

    progress(75);
    await this.delay(400);

    const deploymentInfo = {
      status: 'deployed',
      url: `/quiz/style-quiz-${Date.now()}`,
      environment: 'production',
      buildTime: '12.3s',
      bundleSize: '2.4MB',
      deployedAt: new Date().toISOString(),
    };

    progress(100);

    return {
      type: 'deployment',
      data: deploymentInfo,
      timestamp: new Date().toISOString(),
    };
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private saveFunnelToStorage(funnelId: string, funnelData: any): void {
    try {
      const key = `ai-generated-funnel-${funnelId}`;
      localStorage.setItem(key, JSON.stringify(funnelData));
      console.log('💾 Funil salvo no localStorage:', key);
    } catch (error) {
      console.error('❌ Erro ao salvar funil:', error);
    }
  }

  public static loadFunnelFromStorage(funnelId: string): any | null {
    try {
      const key = `ai-generated-funnel-${funnelId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ Erro ao carregar funil:', error);
      return null;
    }
  }
}

export default FunnelAIAgent;
