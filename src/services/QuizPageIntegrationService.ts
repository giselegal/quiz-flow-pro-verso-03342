// @ts-nocheck
/**
 * 🎯 QUIZ PAGE INTEGRATION SERVICE
 *
 * Serviço para integrar o QuizPage com o sistema de editor existente
 * Funcionalidades:
 * - Mapear componentes do QuizPage para blocos editáveis
 * - Integrar com UnifiedCRUDService
 * - Gerenciar versões e histórico
 * - Sincronizar com dashboard
 */

import { unifiedCRUDService } from './UnifiedCRUDService';
import { versioningService } from './VersioningService';
import { historyManager } from './HistoryManager';
import { analyticsService } from './AnalyticsService';

export interface QuizPageComponent {
  id: string;
  type: 'intro' | 'question' | 'strategic' | 'transition' | 'result' | 'offer' | 'navigation';
  name: string;
  description: string;
  step: number;
  isEditable: boolean;
  properties: Record<string, any>;
  styles: Record<string, any>;
  content: {
    title?: string;
    description?: string;
    text?: string;
    options?: Array<{
      id: string;
      text: string;
      value: string;
    }>;
    buttonText?: string;
    buttonAction?: string;
  };
}

export interface QuizPageFunnel {
  id: string;
  name: string;
  description: string;
  type: 'quiz';
  status: 'draft' | 'published' | 'archived';
  version: string;
  publishedVersion?: string;
  totalSteps: number;
  components: QuizPageComponent[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export class QuizPageIntegrationService {
  private static instance: QuizPageIntegrationService;
  private quizFunnels: Map<string, QuizPageFunnel> = new Map();

  static getInstance(): QuizPageIntegrationService {
    if (!QuizPageIntegrationService.instance) {
      QuizPageIntegrationService.instance = new QuizPageIntegrationService();
    }
    return QuizPageIntegrationService.instance;
  }

  /**
   * Criar funil quiz padrão
   */
  async createDefaultQuizFunnel(funnelId: string = 'quiz-estilo-21-steps'): Promise<QuizPageFunnel> {
    const defaultComponents: QuizPageComponent[] = [
      {
        id: 'intro-step',
        type: 'intro',
        name: 'Etapa de Introdução',
        description: 'Coleta o nome do usuário',
        step: 1,
        isEditable: true,
        properties: {
          showLogo: true,
          logoUrl: '/logo.png',
          title: 'Descubra seu Estilo Pessoal',
          subtitle: 'Responda algumas perguntas e descubra seu estilo único',
          inputPlaceholder: 'Digite seu nome',
          buttonText: 'Começar Quiz'
        },
        styles: {
          backgroundColor: '#ffffff',
          textColor: '#333333',
          buttonColor: '#3b82f6',
          borderRadius: '8px'
        },
        content: {
          title: 'Descubra seu Estilo Pessoal',
          description: 'Responda algumas perguntas e descubra seu estilo único',
          buttonText: 'Começar Quiz'
        }
      },
      {
        id: 'question-step-1',
        type: 'question',
        name: 'Pergunta 1',
        description: 'Primeira pergunta do quiz',
        step: 2,
        isEditable: true,
        properties: {
          question: 'Qual é sua cor favorita?',
          options: [
            { id: '1', text: 'Azul', value: 'blue' },
            { id: '2', text: 'Verde', value: 'green' },
            { id: '3', text: 'Vermelho', value: 'red' },
            { id: '4', text: 'Roxo', value: 'purple' }
          ],
          allowMultiple: false,
          required: true
        },
        styles: {
          backgroundColor: '#ffffff',
          textColor: '#333333',
          optionColor: '#f8f9fa',
          selectedColor: '#3b82f6'
        },
        content: {
          title: 'Qual é sua cor favorita?',
          options: [
            { id: '1', text: 'Azul', value: 'blue' },
            { id: '2', text: 'Verde', value: 'green' },
            { id: '3', text: 'Vermelho', value: 'red' },
            { id: '4', text: 'Roxo', value: 'purple' }
          ]
        }
      },
      {
        id: 'strategic-question-1',
        type: 'strategic',
        name: 'Pergunta Estratégica 1',
        description: 'Pergunta estratégica sobre estilo',
        step: 3,
        isEditable: true,
        properties: {
          question: 'Como você se veste para uma ocasião especial?',
          options: [
            { id: '1', text: 'Elegante e sofisticado', value: 'elegant' },
            { id: '2', text: 'Casual e confortável', value: 'casual' },
            { id: '3', text: 'Ousado e único', value: 'bold' },
            { id: '4', text: 'Clássico e atemporal', value: 'classic' }
          ],
          allowMultiple: false,
          required: true
        },
        styles: {
          backgroundColor: '#ffffff',
          textColor: '#333333',
          optionColor: '#f8f9fa',
          selectedColor: '#3b82f6'
        },
        content: {
          title: 'Como você se veste para uma ocasião especial?',
          options: [
            { id: '1', text: 'Elegante e sofisticado', value: 'elegant' },
            { id: '2', text: 'Casual e confortável', value: 'casual' },
            { id: '3', text: 'Ousado e único', value: 'bold' },
            { id: '4', text: 'Clássico e atemporal', value: 'classic' }
          ]
        }
      },
      {
        id: 'transition-step-1',
        type: 'transition',
        name: 'Transição 1',
        description: 'Etapa de transição entre perguntas',
        step: 4,
        isEditable: true,
        properties: {
          title: 'Ótimo! Vamos continuar...',
          description: 'Agora vamos descobrir mais sobre seu estilo',
          buttonText: 'Próxima Pergunta',
          showProgress: true,
          progress: 20
        },
        styles: {
          backgroundColor: '#f8f9fa',
          textColor: '#333333',
          buttonColor: '#3b82f6',
          progressColor: '#3b82f6'
        },
        content: {
          title: 'Ótimo! Vamos continuar...',
          description: 'Agora vamos descobrir mais sobre seu estilo',
          buttonText: 'Próxima Pergunta'
        }
      },
      {
        id: 'result-step',
        type: 'result',
        name: 'Resultado',
        description: 'Exibição do resultado do quiz',
        step: 21,
        isEditable: true,
        properties: {
          title: 'Seu Estilo Pessoal',
          description: 'Baseado nas suas respostas, descobrimos seu estilo único',
          showScore: true,
          showRecommendations: true,
          buttonText: 'Ver Recomendações',
          shareText: 'Descobri meu estilo pessoal!'
        },
        styles: {
          backgroundColor: '#ffffff',
          textColor: '#333333',
          buttonColor: '#3b82f6',
          resultColor: '#10b981'
        },
        content: {
          title: 'Seu Estilo Pessoal',
          description: 'Baseado nas suas respostas, descobrimos seu estilo único',
          buttonText: 'Ver Recomendações'
        }
      }
    ];

    const quizFunnel: QuizPageFunnel = {
      id: funnelId,
      name: 'Quiz de Estilo Pessoal',
      description: 'Quiz completo para descobrir o estilo pessoal do usuário',
      type: 'quiz',
      status: 'draft',
      version: '1.0.0',
      totalSteps: 21,
      components: defaultComponents,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Salvar no UnifiedCRUDService
    await unifiedCRUDService.saveFunnel({
      id: funnelId,
      name: quizFunnel.name,
      description: quizFunnel.description,
      type: 'quiz',
      status: 'draft',
      stages: defaultComponents.map(comp => ({
        id: comp.id,
        name: comp.name,
        type: comp.type,
        order: comp.step,
        blocks: [{
          id: `${comp.id}-block`,
          type: comp.type,
          content: comp.content,
          properties: comp.properties,
          styles: comp.styles
        }]
      })),
      createdAt: quizFunnel.createdAt,
      updatedAt: quizFunnel.updatedAt
    });

    // Criar snapshot inicial
    await versioningService.createSnapshot(quizFunnel, 'initial', 'Criação do funil quiz');

    // Rastrear criação
    await historyManager.trackCRUDChange('create', 'funnel', funnelId, {
      name: quizFunnel.name,
      type: 'quiz',
      components: defaultComponents.length
    });

    this.quizFunnels.set(funnelId, quizFunnel);
    return quizFunnel;
  }

  /**
   * Carregar funil quiz
   */
  async loadQuizFunnel(funnelId: string): Promise<QuizPageFunnel | null> {
    try {
      // Verificar cache
      if (this.quizFunnels.has(funnelId)) {
        return this.quizFunnels.get(funnelId)!;
      }

      // Carregar do UnifiedCRUDService
      const funnel = await unifiedCRUDService.getFunnel(funnelId);
      if (!funnel) {
        return null;
      }

      // Converter para QuizPageFunnel
      const quizFunnel: QuizPageFunnel = {
        id: funnel.id,
        name: funnel.name,
        description: funnel.description,
        type: 'quiz',
        status: funnel.status as 'draft' | 'published' | 'archived',
        version: '1.0.0',
        totalSteps: funnel.stages?.length || 21,
        components: funnel.stages?.map(stage => ({
          id: stage.id,
          type: stage.type as any,
          name: stage.name,
          description: stage.name,
          step: stage.order,
          isEditable: true,
          properties: stage.blocks?.[0]?.properties || {},
          styles: stage.blocks?.[0]?.styles || {},
          content: stage.blocks?.[0]?.content || {}
        })) || [],
        createdAt: funnel.createdAt,
        updatedAt: funnel.updatedAt,
        publishedAt: funnel.publishedAt
      };

      this.quizFunnels.set(funnelId, quizFunnel);
      return quizFunnel;
    } catch (error) {
      console.error('❌ Erro ao carregar funil quiz:', error);
      return null;
    }
  }

  /**
   * Salvar funil quiz
   */
  async saveQuizFunnel(quizFunnel: QuizPageFunnel): Promise<void> {
    try {
      // Converter para formato UnifiedFunnel
      const unifiedFunnel = {
        id: quizFunnel.id,
        name: quizFunnel.name,
        description: quizFunnel.description,
        type: 'quiz',
        status: quizFunnel.status,
        stages: quizFunnel.components.map(comp => ({
          id: comp.id,
          name: comp.name,
          type: comp.type,
          order: comp.step,
          blocks: [{
            id: `${comp.id}-block`,
            type: comp.type,
            content: comp.content,
            properties: comp.properties,
            styles: comp.styles
          }]
        })),
        createdAt: quizFunnel.createdAt,
        updatedAt: new Date().toISOString()
      };

      // Salvar no UnifiedCRUDService
      await unifiedCRUDService.saveFunnel(unifiedFunnel);

      // Criar snapshot
      await versioningService.createSnapshot(quizFunnel, 'manual', 'Atualização do funil quiz');

      // Rastrear mudança
      await historyManager.trackCRUDChange('update', 'funnel', quizFunnel.id, {
        name: quizFunnel.name,
        components: quizFunnel.components.length
      });

      // Atualizar cache
      this.quizFunnels.set(quizFunnel.id, quizFunnel);
    } catch (error) {
      console.error('❌ Erro ao salvar funil quiz:', error);
      throw error;
    }
  }

  /**
   * Publicar funil quiz
   */
  async publishQuizFunnel(funnelId: string): Promise<void> {
    try {
      const quizFunnel = await this.loadQuizFunnel(funnelId);
      if (!quizFunnel) {
        throw new Error('Funil não encontrado');
      }

      // Atualizar status
      quizFunnel.status = 'published';
      quizFunnel.publishedAt = new Date().toISOString();
      quizFunnel.publishedVersion = quizFunnel.version;

      // Salvar
      await this.saveQuizFunnel(quizFunnel);

      // Rastrear publicação
      await historyManager.trackCRUDChange('publish', 'funnel', funnelId, {
        name: quizFunnel.name,
        version: quizFunnel.version
      });

      // Analytics
      await analyticsService.trackEvent('funnel_published', {
        funnelId,
        type: 'quiz',
        version: quizFunnel.version
      });
    } catch (error) {
      console.error('❌ Erro ao publicar funil quiz:', error);
      throw error;
    }
  }

  /**
   * Obter todos os funis quiz
   */
  async getAllQuizFunnels(): Promise<QuizPageFunnel[]> {
    try {
      const allFunnels = await unifiedCRUDService.getAllFunnels();
      const quizFunnels = allFunnels.filter(funnel => 
        funnel.type === 'quiz' || 
        funnel.id.includes('quiz') ||
        funnel.name.toLowerCase().includes('quiz')
      );

      return Promise.all(
        quizFunnels.map(async (funnel) => {
          const quizFunnel = await this.loadQuizFunnel(funnel.id);
          return quizFunnel!;
        })
      );
    } catch (error) {
      console.error('❌ Erro ao carregar funis quiz:', error);
      return [];
    }
  }

  /**
   * Obter componente editável
   */
  getEditableComponent(funnelId: string, componentId: string): QuizPageComponent | null {
    const quizFunnel = this.quizFunnels.get(funnelId);
    if (!quizFunnel) {
      return null;
    }

    return quizFunnel.components.find(comp => comp.id === componentId) || null;
  }

  /**
   * Atualizar componente
   */
  async updateComponent(funnelId: string, componentId: string, updates: Partial<QuizPageComponent>): Promise<void> {
    try {
      const quizFunnel = await this.loadQuizFunnel(funnelId);
      if (!quizFunnel) {
        throw new Error('Funil não encontrado');
      }

      const componentIndex = quizFunnel.components.findIndex(comp => comp.id === componentId);
      if (componentIndex === -1) {
        throw new Error('Componente não encontrado');
      }

      // Atualizar componente
      quizFunnel.components[componentIndex] = {
        ...quizFunnel.components[componentIndex],
        ...updates,
        id: componentId // Manter ID original
      };

      // Salvar
      await this.saveQuizFunnel(quizFunnel);

      // Rastrear mudança
      await historyManager.trackCRUDChange('update', 'component', componentId, {
        funnelId,
        componentType: updates.type || quizFunnel.components[componentIndex].type
      });
    } catch (error) {
      console.error('❌ Erro ao atualizar componente:', error);
      throw error;
    }
  }

  /**
   * Obter analytics do funil
   */
  async getFunnelAnalytics(funnelId: string): Promise<any> {
    try {
      const analytics = await analyticsService.getMetricsByCategory('usage');
      return {
        views: analytics.find(m => m.name === 'pageViews')?.value || 0,
        completions: analytics.find(m => m.name === 'conversions')?.value || 0,
        conversionRate: 0,
        funnels: analytics.find(m => m.name === 'funnels')?.value || 0
      };
    } catch (error) {
      console.error('❌ Erro ao carregar analytics:', error);
      return {
        views: 0,
        completions: 0,
        conversionRate: 0,
        funnels: 0
      };
    }
  }
}

export const quizPageIntegrationService = QuizPageIntegrationService.getInstance();
