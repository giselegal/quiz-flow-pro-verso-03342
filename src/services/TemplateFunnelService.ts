/**
 * 🎯 TEMPLATE FUNNEL SERVICE
 * 
 * Serviço para criar funis baseados em templates automaticamente
 * quando um funil esperado não existe na base de dados
 */

import { FunnelUnifiedService, CreateFunnelOptions } from './FunnelUnifiedService';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { loadQuizEstiloCanonical } from '@/domain/quiz/quizEstiloPublishedFirstLoader';
import { canonicalizeQuizEstiloId, QUIZ_ESTILO_TEMPLATE_ID } from '@/domain/quiz/quiz-estilo-ids';

export class TemplateFunnelService {
  private static instance: TemplateFunnelService;
  private funnelService = FunnelUnifiedService.getInstance();

  private constructor() { }

  static getInstance(): TemplateFunnelService {
    if (!this.instance) {
      this.instance = new TemplateFunnelService();
    }
    return this.instance;
  }

  /**
   * Cria um funil baseado em template quando não existe
   */
  async createFunnelFromTemplate(
    funnelId: string,
    templateId: string = QUIZ_ESTILO_TEMPLATE_ID
  ): Promise<any> {
    console.log('🎯 TemplateFunnelService: Creating funnel from template', { funnelId, templateId });

    try {
      // Verificar se o funil já existe
      const existingFunnel = await this.funnelService.getFunnel(funnelId);
      if (existingFunnel) {
        console.log('✅ Funnel already exists:', funnelId);
        return existingFunnel;
      }

      // Extrair template base do ID
      const templateName = this.extractTemplateFromId(funnelId);

      // Definir opções de criação
      const createOptions: CreateFunnelOptions = {
        name: this.generateFunnelName(templateName),
        description: `Funil baseado no template ${templateName}`,
        category: 'quiz',
        context: FunnelContext.EDITOR,
        templateId: templateName,
        userId: 'anonymous', // For now, use anonymous until auth is implemented
        autoPublish: false
      };

      // Aplicar dados do template
      if (templateName === QUIZ_ESTILO_TEMPLATE_ID) {
        createOptions.name = 'Quiz 21 Passos - Estilo Pessoal';
        createOptions.description = 'Quiz interativo para descobrir seu estilo pessoal único';
      }

      // Criar o funil
      const newFunnel = await this.funnelService.createFunnel(createOptions);

      // Aplicar dados específicos do template
      if (templateName === QUIZ_ESTILO_TEMPLATE_ID) {
        await this.applyQuiz21StepsTemplate(newFunnel);
      }

      console.log('✅ Funnel created from template:', newFunnel);
      return newFunnel;

    } catch (error) {
      console.error('❌ Error creating funnel from template:', error);
      throw error;
    }
  }

  /**
   * Aplica dados específicos do template quiz-estilo (canônico)
   */
  private async applyQuiz21StepsTemplate(funnel: any): Promise<void> {
    try {
      // Convert template steps to funnel pages
      const loaded = await loadQuizEstiloCanonical();
      const questions = loaded?.questions || [];
      // Construir páginas simples a partir das perguntas (placeholder: páginas com um bloco virtual referenciando questionId)
      const pages = questions.map((q: any, index: number) => ({
        id: `step-${index + 1}`,
        page_order: index + 1,
        page_type: 'step',
        title: q.title || `Step ${index + 1}`,
        blocks: [
          {
            id: `qblock-${q.id}`,
            type: 'quiz-question-inline',
            order: 0,
            properties: {
              questionId: q.id,
              title: q.title,
              answers: q.answers || []
            },
            content: { title: q.title, description: q.subtitle || '' }
          }
        ],
        metadata: { originalTemplate: QUIZ_ESTILO_TEMPLATE_ID, stepNumber: index + 1 }
      }));

      // Update funnel with template data
      await this.funnelService.updateFunnel(funnel.id, {
        pages,
        settings: {
          totalSteps: 21,
          theme: 'quiz-style',
          hasScoring: true,
          showProgress: true
        }
      });

      console.log('✅ Quiz21Steps template applied successfully');
    } catch (error) {
      console.error('❌ Error applying quiz21Steps template:', error);
      throw error;
    }
  }

  /**
   * Converte dados do template para formato de páginas de funil
   */
  private convertTemplateToPages(template: any): any[] {
    if (!template || !template.pages) {
      return [];
    }

    return template.pages.map((page: any, index: number) => ({
      id: `step-${index + 1}`,
      page_order: index + 1,
      page_type: page.type || 'step',
      title: page.title || `Step ${index + 1}`,
      blocks: page.blocks || [],
      metadata: {
        originalTemplate: QUIZ_ESTILO_TEMPLATE_ID,
        stepNumber: index + 1,
        ...page.metadata
      }
    }));
  }

  /**
   * Extrai o nome do template do ID do funil
   */
  private extractTemplateFromId(funnelId: string): string {
    // Exemplo legado: quiz21StepsComplete-1758520854105_l81ndl -> canônico
    if (funnelId.startsWith('quiz21StepsComplete')) return QUIZ_ESTILO_TEMPLATE_ID;

    // Adicionar outros patterns conforme necessário
    if (funnelId.includes('quiz-style-express')) {
      return 'quiz-style-express';
    }

    // Default fallback
    return QUIZ_ESTILO_TEMPLATE_ID;
  }

  /**
   * Gera nome amigável para o funil
   */
  private generateFunnelName(templateName: string): string {
    const timestamp = new Date().toLocaleString('pt-BR');

    switch (templateName) {
      case QUIZ_ESTILO_TEMPLATE_ID:
        return `Quiz Estilo 21 Passos - ${timestamp}`;
      case 'quiz-style-express':
        return `Quiz Express - ${timestamp}`;
      default:
        return `Funil ${templateName} - ${timestamp}`;
    }
  }

  /**
   * Verifica se um ID de funil precisa de criação automática
   */
  shouldCreateFromTemplate(funnelId: string): boolean {
    // IDs que seguem padrão de template: templateName-timestamp_hash
    const templatePatterns = [
      /^quiz21StepsComplete-\d+_.+$/, // legacy alias ainda suportado
      /^quiz-style-express-\d+_.+$/,
      /^com-que-roupa-eu-vou-\d+_.+$/
    ];

    return templatePatterns.some(pattern => pattern.test(funnelId));
  }
}

export const templateFunnelService = TemplateFunnelService.getInstance();