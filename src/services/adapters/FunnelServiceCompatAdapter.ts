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
      // Filtros customizados (status/type não fazem parte do QuizMetadata padrão)
      // TODO: adicionar campos custom se necessário

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
    // Criar estrutura de quiz com metadata
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
   * Deleta um funil (não implementado no novo serviço)
   */
  async deleteFunnel(id: string): Promise<boolean> {
    appLogger.warn('deleteFunnel não implementado no novo serviço');
    // TODO: Implementar delete no FunnelService
    return false;
  }

  /**
   * Verifica permissões (mock)
   */
  async checkPermissions(id: string): Promise<{ canRead: boolean; canEdit: boolean; canDelete: boolean; isOwner: boolean }> {
    return {
      canRead: true,
      canEdit: true,
      canDelete: true,
      isOwner: true,
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
   * Busca blocos de um step específico (backward compatibility)
   */
  async getStepBlocks(funnelId: string, stepKey: string): Promise<any[]> {
    const result = await this.service.loadFunnel({ funnelId });
    const step = result.funnel.quiz?.steps?.find((s: any) => s.key === stepKey);
    return step?.blocks || [];
  }

  /**
   * Converte Funnel para FunnelMetadata
   */
  private toMetadata(funnel: Funnel): FunnelMetadata {
    // QuizMetadata só tem: id, name, description, author, createdAt, updatedAt, version, tags
    const quizMeta = funnel.quiz?.metadata || {} as any;
    return {
      id: funnel.id,
      name: quizMeta.name || funnel.id,
      type: 'quiz', // default
      status: funnel.draftId ? 'draft' : 'published', // inferir do contexto
      isActive: !funnel.draftId, // se não tem draftId, está publicado
      createdAt: funnel.createdAt || new Date().toISOString(),
      updatedAt: funnel.updatedAt || new Date().toISOString(),
      userId: funnel.userId,
    };
  }
}

// Export singleton instance
export const funnelServiceCompat = FunnelServiceCompatAdapter.getInstance();
