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
import { analyticsServiceAdapter as analyticsService } from '@/analytics/compat/analyticsServiceAdapter';
import definition from '@/domain/quiz/quiz-definition';
import { canonicalToFunnelComponents } from '@/utils/canonicalQuizAdapters';

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
  async createDefaultQuizFunnel(funnelId: string = definition.id): Promise<QuizPageFunnel> {
    // Derivar diretamente do canonical
    const canonicalComponents = canonicalToFunnelComponents(definition).map(c => ({
      id: c.id,
      type: c.type as QuizPageComponent['type'],
      name: c.name,
      description: c.description,
      step: c.step,
      isEditable: true,
      properties: c.properties,
      styles: c.styles,
      content: c.content
    }));

    const quizFunnel: QuizPageFunnel = {
      id: funnelId,
      name: 'Quiz de Estilo Pessoal',
      description: 'Quiz completo para descobrir o estilo pessoal do usuário',
      type: 'quiz',
      status: 'draft',
      version: definition.version,
      totalSteps: canonicalComponents.length,
      components: canonicalComponents,
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
      stages: canonicalComponents.map(comp => ({
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
      analyticsService.trackEvent({
        funnelId,
        type: 'funnel_published',
        payload: { funnelId, funnelType: 'quiz', version: quizFunnel.version }
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
      const analytics = analyticsService.getMetricsByCategory('usage') as any[];
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
