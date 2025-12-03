/**
 * 🎯 CANONICAL FUNNEL SERVICE - API Unificada
 * 
 * Implementação canônica que expõe métodos de alto nível
 * para operações CRUD de funis, delegando para FunnelService.
 * 
 * Esta classe substitui o FunnelServiceCompatAdapter e será
 * a única API pública para gerenciamento de funis.
 */

import { FunnelService, type Funnel, type LoadFunnelResult, type SaveFunnelResult } from './FunnelService';
import type { FunnelMetadata, CreateFunnelInput, UpdateFunnelInput } from '@/types/funnel';
import { appLogger } from '@/lib/utils/appLogger';

export class CanonicalFunnelService {
  private service: FunnelService;
  private static instance: CanonicalFunnelService;

  private constructor() {
    this.service = new FunnelService();
  }

  static getInstance(): CanonicalFunnelService {
    if (!CanonicalFunnelService.instance) {
      CanonicalFunnelService.instance = new CanonicalFunnelService();
    }
    return CanonicalFunnelService.instance;
  }

  /**
   * Lista funis do usuário
   * Aceita tanto `userId` (string) quanto objeto de filtros (compat)
   */
  async listFunnels(userOrFilters?: string | Record<string, any>): Promise<FunnelMetadata[]> {
    try {
      const effectiveUserId = typeof userOrFilters === 'string' ? userOrFilters : 'current-user'; // TODO: pegar do auth context
      const funnels = await this.service.listFunnels(effectiveUserId);
      return funnels.map(f => this.toMetadata(f));
    } catch (error) {
      appLogger.error('Erro ao listar funis:', { data: [error] });
      return [];
    }
  }

  /**
   * Busca um funil por ID
   */
  async getFunnel(id: string): Promise<FunnelMetadata> {
    const result = await this.service.loadFunnel({ funnelId: id });
    return this.toMetadata(result.funnel);
  }

  /**
   * Busca funil com componentes completos (quiz)
   */
  async getFunnelWithComponents(id: string): Promise<any> {
    const result = await this.service.loadFunnel({ funnelId: id });
    return {
      ...this.toMetadata(result.funnel),
      components: result.funnel.quiz?.steps || [],
      quiz: result.funnel.quiz,
    };
  }

  /**
   * Cria novo funil
   */
  async createFunnel(input: CreateFunnelInput): Promise<FunnelMetadata> {
    const quizConfig: any = input.config || {
      version: '1.0.0',
      metadata: {
        name: input.name || 'Novo Funil',
        id: input.name?.toLowerCase().replace(/\s+/g, '-') || 'novo-funil',
        description: '',
        author: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      theme: {
        colors: { primary: '#000000', secondary: '#ffffff' },
        fonts: { body: 'Inter', heading: 'Inter' },
      },
      schemaVersion: '1.0.0',
      steps: [],
      settings: {},
    };

    const result = await this.service.saveFunnel(
      quizConfig,
      input.name || 'Novo Funil',
      undefined // Criar novo draft
    );

    if (!result.success) {
      throw new Error(result.error || 'Falha ao criar funil');
    }

    return this.getFunnel(result.draftId);
  }

  /**
   * Atualiza funil existente
   */
  async updateFunnel(id: string, updates: UpdateFunnelInput): Promise<FunnelMetadata> {
    const current = await this.service.loadFunnel({ funnelId: id });
    
    const updatedQuiz = {
      ...current.funnel.quiz,
      metadata: {
        ...current.funnel.quiz?.metadata,
        ...updates,
      },
    };

    const result = await this.service.saveFunnel(
      updatedQuiz,
      updates.name || current.funnel.id,
      current.funnel.draftId
    );

    if (!result.success) {
      throw new Error(result.error || 'Falha ao atualizar funil');
    }

    return this.getFunnel(id);
  }

  /**
   * Duplica um funil
   */
  async duplicateFunnel(id: string, newName?: string): Promise<FunnelMetadata> {
    const original = await this.service.loadFunnel({ funnelId: id });
    
    const newQuiz = {
      ...original.funnel.quiz,
      metadata: {
        ...original.funnel.quiz?.metadata,
        name: newName || `${original.funnel.id} - Cópia`,
      },
    };

    const result = await this.service.saveFunnel(
      newQuiz,
      newName || `${original.funnel.id} - Cópia`,
      undefined // Criar novo draft
    );

    if (!result.success) {
      throw new Error(result.error || 'Falha ao duplicar funil');
    }

    return this.getFunnel(result.draftId);
  }

  /**
   * Deleta um funil (soft delete)
   */
  async deleteFunnel(id: string): Promise<boolean> {
    // TODO: Implementar soft delete no FunnelService
    appLogger.warn('deleteFunnel ainda não implementado no FunnelService');
    return false;
  }

  /**
   * Event emitter mock (compat): on/off
   */
  on(event: string, handler: (...args: any[]) => void): void {
    // Noop por enquanto; integrar com sistema de eventos quando disponível
    appLogger.debug?.(`canonicalFunnelService.on(${event}) registrado (noop)`);
  }

  off(event: string, handler: (...args: any[]) => void): void {
    // Noop por enquanto
    appLogger.debug?.(`canonicalFunnelService.off(${event}) removido (noop)`);
  }

  /**
   * Limpeza de cache (compat): no-op até termos cache dedicado
   */
  clearCache(): void {
    // Noop
    appLogger.debug?.('canonicalFunnelService.clearCache() (noop)');
  }

  /**
   * Verifica permissões (mock por enquanto)
   */
  async checkPermissions(id: string): Promise<{ 
    canRead: boolean; 
    canEdit: boolean; 
    canDelete: boolean; 
    isOwner: boolean 
  }> {
    // TODO: Integrar com sistema de permissões real
    return {
      canRead: true,
      canEdit: true,
      canDelete: true,
      isOwner: true,
    };
  }

  /**
   * Busca blocos de um step específico (backward compatibility)
   */
  async getStepBlocks(funnelId: string, stepKey: string): Promise<any[]> {
    const result = await this.service.loadFunnel({ funnelId });
    const step = result.funnel.quiz?.steps?.find((s: any) => s.key === stepKey);
    return step?.blocks || [];
  }

  /**
   * Salva blocos de um step (deprecated - use saveFunnel com quiz completo)
   */
  async saveStepBlocks(funnelId: string, stepKey: string, blocks: any[]): Promise<void> {
    appLogger.warn('saveStepBlocks é deprecated - use saveFunnel com quiz completo');
  }

  /**
   * Converte Funnel para FunnelMetadata
   */
  private toMetadata(funnel: Funnel): FunnelMetadata {
    const quizMeta = funnel.quiz?.metadata || {} as any;
    return {
      id: funnel.id,
      name: quizMeta.name || funnel.id,
      type: 'quiz',
      status: funnel.draftId ? 'draft' : 'published',
      isActive: !funnel.draftId,
      createdAt: funnel.createdAt || new Date().toISOString(),
      updatedAt: funnel.updatedAt || new Date().toISOString(),
      userId: funnel.userId,
    };
  }
}

// Export singleton instance
export const canonicalFunnelService = CanonicalFunnelService.getInstance();
