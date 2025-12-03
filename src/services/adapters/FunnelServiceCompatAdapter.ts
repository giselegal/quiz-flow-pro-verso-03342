/**
 * 🔄 FUNNEL SERVICE COMPAT ADAPTER
 * 
 * Adapter de compatibilidade que mantém a API antiga do FunnelService
 * enquanto delega para a nova implementação em src/services/funnel/FunnelService.ts
 * 
 * Este adapter permite que componentes antigos continuem funcionando
 * sem necessidade de refatoração imediata.
 */

import { FunnelService, type Funnel, type LoadFunnelResult, type SaveFunnelResult } from '../funnel/FunnelService';
import type { FunnelMetadata, CreateFunnelInput, UpdateFunnelInput } from '@/types/funnel';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Adapter que implementa a interface antiga do FunnelService
 */
export class FunnelServiceCompatAdapter {
  private service: FunnelService;
  private static instance: FunnelServiceCompatAdapter;

  private constructor() {
    this.service = new FunnelService();
  }

  static getInstance(): FunnelServiceCompatAdapter {
    if (!FunnelServiceCompatAdapter.instance) {
      FunnelServiceCompatAdapter.instance = new FunnelServiceCompatAdapter();
    }
    return FunnelServiceCompatAdapter.instance;
  }

  /**
   * Lista funis (adapter para listFunnels)
   */
  async listFunnels(filters?: { status?: string; type?: string; isActive?: boolean } | string): Promise<FunnelMetadata[]> {
    try {
      // Se receber string (userId), usar como userId
      if (typeof filters === 'string') {
        const funnels = await this.service.listFunnels(filters);
        return funnels.map(f => this.toMetadata(f));
      }

      // Buscar todos os funis do usuário atual (mock userId por enquanto)
      const userId = 'current-user'; // TODO: pegar do auth context
      const funnels = await this.service.listFunnels(userId);
      
      // Aplicar filtros
      let filtered = funnels;
      if (filters?.status) {
        filtered = filtered.filter(f => f.quiz?.metadata?.status === filters.status);
      }
      if (filters?.type) {
        filtered = filtered.filter(f => f.quiz?.metadata?.type === filters.type);
      }

      return filtered.map(f => this.toMetadata(f));
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
   * Busca funil com componentes
   */
  async getFunnelWithComponents(id: string): Promise<any> {
    const result = await this.service.loadFunnel({ funnelId: id });
    return {
      ...this.toMetadata(result.funnel),
      components: result.funnel.quiz?.steps || [],
    };
  }

  /**
   * Cria novo funil
   */
  async createFunnel(input: CreateFunnelInput): Promise<FunnelMetadata> {
    const result = await this.service.saveFunnel(
      input.config || { steps: [], metadata: {} },
      input.name || 'Novo Funil',
      undefined // Criar novo draft
    );

    if (!result.success) {
      throw new Error(result.error || 'Falha ao criar funil');
    }

    // Recarregar para obter metadata completo
    return this.getFunnel(result.draftId);
  }

  /**
   * Atualiza funil existente
   */
  async updateFunnel(id: string, updates: UpdateFunnelInput): Promise<FunnelMetadata> {
    // Carregar funil atual
    const current = await this.service.loadFunnel({ funnelId: id });
    
    // Mesclar updates
    const updatedQuiz = {
      ...current.funnel.quiz,
      metadata: {
        ...current.funnel.quiz?.metadata,
        ...updates,
      },
    };

    // Salvar
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
  async duplicateFunnel(id: string, newName?: string): Promise<LoadFunnelResult> {
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

    return this.service.loadFunnel({ funnelId: result.draftId });
  }

  /**
   * Deleta um funil (não implementado no novo serviço)
   */
  async deleteFunnel(id: string): Promise<void> {
    appLogger.warn('deleteFunnel não implementado no novo serviço');
    // TODO: Implementar delete no FunnelService
  }

  /**
   * Verifica permissões (mock)
   */
  async checkPermissions(id: string): Promise<{ canEdit: boolean; canDelete: boolean; canPublish: boolean }> {
    return {
      canEdit: true,
      canDelete: true,
      canPublish: true,
    };
  }

  /**
   * Limpa cache (não aplicável ao novo serviço)
   */
  clearCache(): void {
    // Noop - novo serviço não usa cache
  }

  /**
   * Event emitter mock (para compatibilidade)
   */
  on(event: string, handler: (...args: any[]) => void): void {
    // Noop - implementar se necessário
  }

  off(event: string, handler: (...args: any[]) => void): void {
    // Noop - implementar se necessário
  }

  /**
   * Salva blocos de um step (não usado no novo modelo)
   */
  async saveStepBlocks(funnelId: string, stepKey: string, blocks: any[]): Promise<void> {
    appLogger.warn('saveStepBlocks é deprecated - use saveFunnel com quiz completo');
  }

  /**
   * Converte Funnel para FunnelMetadata
   */
  private toMetadata(funnel: Funnel): FunnelMetadata {
    return {
      id: funnel.id,
      name: funnel.quiz?.metadata?.name || funnel.id,
      type: funnel.quiz?.metadata?.type || 'quiz',
      status: funnel.quiz?.metadata?.status || 'draft',
      isActive: funnel.quiz?.metadata?.status === 'published',
      createdAt: funnel.createdAt || new Date().toISOString(),
      updatedAt: funnel.updatedAt || new Date().toISOString(),
      userId: funnel.userId,
    };
  }
}

// Export singleton instance
export const funnelServiceCompat = FunnelServiceCompatAdapter.getInstance();
