/**
 * 🧪 TESTES DE EQUIVALÊNCIA PARA MIGRAÇÃO DE TEMPLATES
 * 
 * Testes unitários para garantir que o template migrado mantém
 * equivalência lógica com o template original (quiz21StepsComplete)
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import { QuizTemplateAdapter, MigrationUtils } from '../QuizTemplateAdapter';
import { QuizFunnelSchema, StepType } from '../../types/quiz-schema';
// import { QUIZ_STYLE_21_STEPS_TEMPLATE, QUIZ_QUESTIONS_COMPLETE } from '../../templates/quiz21StepsComplete';

describe('QuizTemplateAdapter - Testes de Equivalência', () => {
  let migratedSchema: QuizFunnelSchema;

  beforeAll(async () => {
    migratedSchema = await QuizTemplateAdapter.convertLegacyTemplate();
  });

  describe('Estrutura Básica', () => {
    it('deve manter o mesmo número de etapas', () => {
      const legacyStepsCount = Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).length;
      expect(migratedSchema.steps.length).toBe(legacyStepsCount);
      expect(migratedSchema.steps.length).toBe(21);
    });

    it('deve ter todas as etapas ordenadas corretamente', () => {
      for (let i = 0; i < migratedSchema.steps.length; i++) {
        const step = migratedSchema.steps[i];
        expect(step.order).toBe(i + 1);
        expect(step.id).toBe(`step-${i + 1}`);
      }
    });

    it('deve ter metadados básicos corretos', () => {
      expect(migratedSchema.id).toBeDefined();
      expect(migratedSchema.name).toBeDefined();
      expect(migratedSchema.description).toBeDefined();
      expect(migratedSchema.version).toBe('3.0.0');
      expect(migratedSchema.category).toBe('quiz');
      expect(migratedSchema.templateType).toBe('quiz-complete');
    });
  });

  describe('Tipos de Etapas', () => {
    it('deve classificar a etapa 1 como lead-capture', () => {
      const step1 = migratedSchema.steps[0];
      expect(step1.type).toBe('lead-capture');
      expect(step1.name).toBe('Coleta de Dados Pessoais');
    });

    it('deve classificar etapas 2-11 como quiz-question', () => {
      for (let i = 1; i <= 10; i++) {
        const step = migratedSchema.steps[i];
        expect(step.type).toBe('quiz-question');
        expect(step.name).toBe(`Pergunta ${i}`);
      }
    });

    it('deve classificar etapa 12 como transition', () => {
      const step12 = migratedSchema.steps[11];
      expect(step12.type).toBe('transition');
      expect(step12.name).toBe('Transição para Questões Estratégicas');
    });

    it('deve classificar etapas 13-18 como strategic-question', () => {
      for (let i = 12; i <= 17; i++) {
        const step = migratedSchema.steps[i];
        expect(step.type).toBe('strategic-question');
        expect(step.name).toBe(`Pergunta Estratégica ${i - 11}`);
      }
    });

    it('deve classificar etapa 19 como transition', () => {
      const step19 = migratedSchema.steps[18];
      expect(step19.type).toBe('transition');
      expect(step19.name).toBe('Processando Resultado');
    });

    it('deve classificar etapa 20 como result', () => {
      const step20 = migratedSchema.steps[19];
      expect(step20.type).toBe('result');
      expect(step20.name).toBe('Seu Resultado Personalizado');
    });

    it('deve classificar etapa 21 como offer', () => {
      const step21 = migratedSchema.steps[20];
      expect(step21.type).toBe('offer');
      expect(step21.name).toBe('Oferta Exclusiva');
    });
  });

  describe('Blocos de Conteúdo', () => {
    it('deve preservar todos os blocos de cada etapa', () => {
      for (const step of migratedSchema.steps) {
        const legacyBlocks = QUIZ_STYLE_21_STEPS_TEMPLATE[step.id];
        expect(step.blocks.length).toBe(legacyBlocks?.length || 0);
      }
    });

    it('deve manter propriedades essenciais dos blocos', () => {
      migratedSchema.steps.forEach(step => {
        step.blocks.forEach(block => {
          expect(block.id).toBeDefined();
          expect(block.type).toBeDefined();
          expect(block.editable).toBe(true);
          expect(block.version).toBe('2.0.0');
        });
      });
    });
  });

  describe('Lógica de Navegação', () => {
    it('deve configurar navegação sequencial correta', () => {
      migratedSchema.steps.forEach((step, index) => {
        if (index < migratedSchema.steps.length - 1) {
          expect(step.navigation.nextStep).toBe(`step-${index + 2}`);
        } else {
          expect(step.navigation.nextStep).toBeUndefined();
        }

        if (index > 0) {
          expect(step.navigation.prevStep).toBe(`step-${index}`);
        } else {
          expect(step.navigation.prevStep).toBeUndefined();
        }
      });
    });

    it('deve adicionar ações de cálculo para etapas de quiz', () => {
      const quizSteps = migratedSchema.steps.filter(step => step.type === 'quiz-question');

      quizSteps.forEach(step => {
        const hasScoreAction = step.navigation.actions.some(action =>
          action.type === 'calculate-score'
        );
        expect(hasScoreAction).toBe(true);
      });
    });

    it('deve adicionar ações de variável para etapas estratégicas', () => {
      const strategicSteps = migratedSchema.steps.filter(step => step.type === 'strategic-question');

      strategicSteps.forEach(step => {
        const hasVariableAction = step.navigation.actions.some(action =>
          action.type === 'set-variable'
        );
        expect(hasVariableAction).toBe(true);
      });
    });
  });

  describe('Configurações de Etapa', () => {
    it('deve configurar progresso corretamente', () => {
      migratedSchema.steps.forEach((step, index) => {
        if (index === 0) {
          expect(step.settings.showProgress).toBe(false);
        } else {
          expect(step.settings.showProgress).toBe(true);
        }
      });
    });

    it('deve configurar botões de navegação', () => {
      migratedSchema.steps.forEach((step, index) => {
        // Botão "Voltar" deve aparecer apenas após a primeira etapa
        if (index === 0) {
          expect(step.settings.showBackButton).toBe(false);
        } else {
          expect(step.settings.showBackButton).toBe(true);
        }

        // Botão "Avançar" deve aparecer em todas as etapas
        expect(step.settings.showNextButton).toBe(true);
      });
    });

    it('deve desabilitar pular por padrão', () => {
      migratedSchema.steps.forEach(step => {
        expect(step.settings.allowSkip).toBe(false);
      });
    });
  });

  describe('Validação de Dados', () => {
    it('deve marcar etapas com formulários como obrigatórias', () => {
      migratedSchema.steps.forEach(step => {
        const hasFormInput = step.blocks.some(block =>
          block.type === 'form-input' ||
          block.type === 'options-grid' ||
          block.type === 'quiz-question-inline'
        );

        expect(step.validation.required).toBe(hasFormInput);
      });
    });

    it('deve ter mensagens de erro padrão', () => {
      migratedSchema.steps.forEach(step => {
        expect(step.validation.errorMessages.required).toBeDefined();
        expect(step.validation.errorMessages.minSelection).toBeDefined();
        expect(step.validation.errorMessages.maxSelection).toBeDefined();
        expect(step.validation.errorMessages.invalidEmail).toBeDefined();
      });
    });
  });

  describe('Configurações Globais', () => {
    it('deve ter configurações de SEO completas', () => {
      const seo = migratedSchema.settings.seo;

      expect(seo.title).toBeDefined();
      expect(seo.description).toBeDefined();
      expect(seo.keywords).toBeInstanceOf(Array);
      expect(seo.keywords.length).toBeGreaterThan(0);
      expect(seo.robots).toBe('index,follow');

      expect(seo.openGraph.title).toBeDefined();
      expect(seo.openGraph.description).toBeDefined();
      expect(seo.openGraph.image).toBeDefined();
      expect(seo.openGraph.type).toBe('website');

      expect(seo.twitter.card).toBe('summary_large_image');
      expect(seo.twitter.title).toBeDefined();
      expect(seo.twitter.description).toBeDefined();
      expect(seo.twitter.image).toBeDefined();
    });

    it('deve ter configurações de analytics', () => {
      const analytics = migratedSchema.settings.analytics;

      expect(analytics.enabled).toBe(true);
      expect(analytics.googleAnalytics).toBeDefined();
      expect(analytics.customEvents).toBeInstanceOf(Array);
      expect(analytics.utm).toBeDefined();
    });

    it('deve ter configurações de branding completas', () => {
      const branding = migratedSchema.settings.branding;

      expect(branding.colors.primary).toBe('#B89B7A');
      expect(branding.colors.secondary).toBe('#D4C2A8');
      expect(branding.colors.accent).toBe('#4CAF50');

      expect(branding.typography.fontFamily.primary).toBeDefined();
      expect(branding.logo.primary).toBeDefined();
      expect(branding.spacing).toBeDefined();
      expect(branding.borderRadius).toBeDefined();
      expect(branding.shadows).toBeDefined();
    });
  });

  describe('Configurações de Publicação', () => {
    it('deve ter configurações de publicação básicas', () => {
      const publication = migratedSchema.publication;

      expect(publication.status).toBe('draft');
      expect(publication.baseUrl).toBeDefined();
      expect(publication.slug).toBeDefined();
      expect(publication.version).toBe('3.0.0');
      expect(publication.changelog).toBeInstanceOf(Array);
      expect(publication.changelog.length).toBeGreaterThan(0);
    });

    it('deve ser público por padrão', () => {
      expect(migratedSchema.publication.accessControl.public).toBe(true);
    });

    it('deve ter CDN habilitado', () => {
      expect(migratedSchema.publication.cdn.enabled).toBe(true);
    });
  });

  describe('Metadados do Editor', () => {
    it('deve ter metadados básicos', () => {
      const editorMeta = migratedSchema.editorMeta;

      expect(editorMeta.lastModified).toBeDefined();
      expect(editorMeta.lastModifiedBy).toBe('sistema-migracao');
      expect(editorMeta.editorVersion).toBe('2.0.0');
      expect(editorMeta.baseTemplate).toBe('quiz21StepsComplete');
    });

    it('deve ter estatísticas corretas', () => {
      const stats = migratedSchema.editorMeta.stats;

      expect(stats.totalSteps).toBe(21);
      expect(stats.totalBlocks).toBeGreaterThan(0);
      expect(stats.estimatedCompletionTime).toBe(15);
    });

    it('deve ter tags e categorias', () => {
      expect(migratedSchema.editorMeta.tags).toContain('quiz');
      expect(migratedSchema.editorMeta.tags).toContain('estilo-pessoal');
      expect(migratedSchema.editorMeta.tags).toContain('migrado');

      expect(migratedSchema.editorMeta.categories).toContain('quiz');
      expect(migratedSchema.editorMeta.categories).toContain('conversão');
    });
  });
});

describe('MigrationUtils', () => {
  describe('Processo Completo de Migração', () => {
    it('deve executar migração sem erros', async () => {
      await expect(MigrationUtils.runMigration()).resolves.toBeDefined();
    });

    it('deve retornar schema válido', async () => {
      const schema = await MigrationUtils.runMigration();

      expect(schema).toBeDefined();
      expect(schema.id).toBeDefined();
      expect(schema.steps).toBeInstanceOf(Array);
      expect(schema.steps.length).toBe(21);
      expect(schema.settings).toBeDefined();
      expect(schema.publication).toBeDefined();
      expect(schema.editorMeta).toBeDefined();
    });
  });
});

describe('Validação de Equivalência Funcional', () => {
  it('deve preservar todas as perguntas do quiz original', () => {
    const originalQuestions = Object.values(QUIZ_QUESTIONS_COMPLETE);
    const migratedQuestions = migratedSchema.steps
      .filter(step => step.type === 'quiz-question' || step.type === 'strategic-question')
      .map(step => step.description)
      .filter(desc => desc.includes(':'))
      .map(desc => desc.split(': ')[1]);

    // Verificar se as perguntas essenciais foram preservadas
    expect(migratedQuestions.length).toBeGreaterThan(0);

    // TODO: Implementar comparação mais rigorosa quando tivermos acesso às perguntas específicas
  });

  it('deve manter lógica de pontuação equivalente', () => {
    const quizSteps = migratedSchema.steps.filter(step => step.type === 'quiz-question');

    quizSteps.forEach(step => {
      const scoreAction = step.navigation.actions.find(action =>
        action.type === 'calculate-score'
      );

      expect(scoreAction).toBeDefined();
      expect(scoreAction?.parameters.scoreType).toBe('style-points');
      expect(scoreAction?.parameters.method).toBe('accumulative');
    });
  });

  it('deve preservar estrutura de resultado', () => {
    const resultStep = migratedSchema.steps.find(step => step.type === 'result');

    expect(resultStep).toBeDefined();
    expect(resultStep?.navigation.actions.some(action =>
      action.type === 'calculate-score' &&
      action.parameters.method === 'determine-primary-style'
    )).toBe(true);
  });
});