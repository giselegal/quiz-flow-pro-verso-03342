/**
 * 🎯 CONTEXTUAL FUNNEL SERVICE - FASE 1
 * 
 * Service de gerenciamento de funis com isolamento por contexto
 * Previne vazamento de dados entre Editor, Templates, Meus Funis, etc.
 * 
 * ✅ Isolamento completo por contexto
 * ✅ CRUD completo com contexto
 * ✅ Migração automática de dados legados
 * ✅ Cache contextualizado
 * ✅ Type-safe
 */

import { FunnelContext, generateContextualId, extractContextFromId } from '@/core/contexts/FunnelContext';
import { ContextualStorageService } from './ContextualStorageService';
import type { UnifiedFunnelData } from '@/services/FunnelUnifiedService';

export interface ContextualFunnelMetadata {
  id: string;
  name: string;
  context: FunnelContext;
  createdAt: string;
  updatedAt: string;
}

export class ContextualFunnelService {
  private storage: ContextualStorageService;
  private cache = new Map<string, UnifiedFunnelData>();

  constructor(private readonly context: FunnelContext) {
    this.storage = new ContextualStorageService(context);
  }

  /**
   * Salva funil com ID contextualizado
   */
  async saveFunnel(funnel: UnifiedFunnelData): Promise<string> {
    try {
      // Garantir que o ID tenha o contexto correto
      const contextualId = funnel.id.startsWith(`${this.context}-`) 
        ? funnel.id 
        : generateContextualId(this.context, funnel.id);

      const funnelWithContext: UnifiedFunnelData = {
        ...funnel,
        id: contextualId,
        context: this.context,
        updatedAt: new Date()
      };

      // Salvar no storage contextual
      const storageKey = `funnel-${contextualId}`;
      const success = this.storage.setJSON(storageKey, funnelWithContext);

      if (success) {
        // Atualizar cache
        this.cache.set(contextualId, funnelWithContext);
        
        // Atualizar lista de funis
        await this.updateFunnelsList(contextualId, funnelWithContext.name);
        
        console.log(`💾 [ContextualFunnel] Salvo: ${contextualId} no contexto ${this.context}`);
        return contextualId;
      }

      throw new Error('Falha ao salvar no storage');
    } catch (error) {
      console.error('[ContextualFunnel] Erro ao salvar:', error);
      throw error;
    }
  }

  /**
   * Carrega funil por ID
   */
  async getFunnel(funnelId: string): Promise<UnifiedFunnelData | null> {
    try {
      // Verificar cache primeiro
      if (this.cache.has(funnelId)) {
        return this.cache.get(funnelId)!;
      }

      // Garantir que o ID tenha o contexto correto
      const contextualId = funnelId.startsWith(`${this.context}-`) 
        ? funnelId 
        : generateContextualId(this.context, funnelId);

      const storageKey = `funnel-${contextualId}`;
      const funnel = this.storage.getJSON<UnifiedFunnelData>(storageKey);

      if (funnel) {
        // Validar contexto
        const funnelContext = extractContextFromId(funnel.id);
        if (funnelContext !== this.context) {
          console.warn(`⚠️ [ContextualFunnel] Contexto inválido: esperado ${this.context}, recebido ${funnelContext}`);
          return null;
        }

        this.cache.set(contextualId, funnel);
        return funnel;
      }

      // Tentar migrar dados legados
      return await this.tryMigrateLegacyFunnel(funnelId);
    } catch (error) {
      console.error('[ContextualFunnel] Erro ao carregar:', error);
      return null;
    }
  }

  /**
   * Lista todos os funis deste contexto
   */
  async listFunnels(): Promise<ContextualFunnelMetadata[]> {
    try {
      const listKey = 'funnels-list';
      const list = this.storage.getJSON<ContextualFunnelMetadata[]>(listKey) || [];
      
      // Filtrar apenas funis deste contexto
      return list.filter(meta => meta.context === this.context);
    } catch (error) {
      console.error('[ContextualFunnel] Erro ao listar:', error);
      return [];
    }
  }

  /**
   * Deleta funil
   */
  async deleteFunnel(funnelId: string): Promise<boolean> {
    try {
      const contextualId = funnelId.startsWith(`${this.context}-`) 
        ? funnelId 
        : generateContextualId(this.context, funnelId);

      const storageKey = `funnel-${contextualId}`;
      const success = this.storage.remove(storageKey);

      if (success) {
        this.cache.delete(contextualId);
        await this.removeFromFunnelsList(contextualId);
        console.log(`🗑️ [ContextualFunnel] Deletado: ${contextualId}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('[ContextualFunnel] Erro ao deletar:', error);
      return false;
    }
  }

  /**
   * Copia funil para outro contexto
   */
  async copyToContext(funnelId: string, targetContext: FunnelContext): Promise<string | null> {
    try {
      const funnel = await this.getFunnel(funnelId);
      if (!funnel) return null;

      // Criar service do contexto de destino
      const targetService = new ContextualFunnelService(targetContext);
      
      // Gerar novo ID para o contexto de destino
      const newId = generateContextualId(targetContext);
      
      const copiedFunnel: UnifiedFunnelData = {
        ...funnel,
        id: newId,
        name: `${funnel.name} (cópia)`,
        context: targetContext,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return await targetService.saveFunnel(copiedFunnel);
    } catch (error) {
      console.error('[ContextualFunnel] Erro ao copiar:', error);
      return null;
    }
  }

  /**
   * Limpa todos os dados deste contexto
   */
  async clearContext(): Promise<number> {
    this.cache.clear();
    return this.storage.clearContext();
  }

  /**
   * Obtém estatísticas deste contexto
   */
  getStats() {
    const storageStats = this.storage.getStats();
    const cacheSize = this.cache.size;

    return {
      ...storageStats,
      cacheSize,
      cacheHitRate: cacheSize > 0 ? '~' + Math.round((cacheSize / storageStats.keysCount) * 100) + '%' : '0%'
    };
  }

  /**
   * PRIVATE: Atualiza lista de funis
   */
  private async updateFunnelsList(funnelId: string, funnelName: string): Promise<void> {
    const listKey = 'funnels-list';
    const list = this.storage.getJSON<ContextualFunnelMetadata[]>(listKey) || [];

    const existingIndex = list.findIndex(meta => meta.id === funnelId);
    const metadata: ContextualFunnelMetadata = {
      id: funnelId,
      name: funnelName,
      context: this.context,
      createdAt: existingIndex >= 0 ? list[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      list[existingIndex] = metadata;
    } else {
      list.push(metadata);
    }

    this.storage.setJSON(listKey, list);
  }

  /**
   * PRIVATE: Remove da lista de funis
   */
  private async removeFromFunnelsList(funnelId: string): Promise<void> {
    const listKey = 'funnels-list';
    const list = this.storage.getJSON<ContextualFunnelMetadata[]>(listKey) || [];
    const filtered = list.filter(meta => meta.id !== funnelId);
    this.storage.setJSON(listKey, filtered);
  }

  /**
   * PRIVATE: Tenta migrar dados legados (sem contexto)
   */
  private async tryMigrateLegacyFunnel(legacyId: string): Promise<UnifiedFunnelData | null> {
    try {
      // Tentar carregar da chave legada
      const legacyKey = `funnel-${legacyId}`;
      const legacyData = this.storage.getJSON<any>(legacyKey);

      if (legacyData) {
        console.log(`🔄 [ContextualFunnel] Migrando dados legados: ${legacyId}`);
        
        // Adicionar contexto e salvar
        const contextualId = generateContextualId(this.context, legacyId);
        const migratedFunnel: UnifiedFunnelData = {
          ...legacyData,
          id: contextualId,
          context: this.context,
          updatedAt: new Date()
        };

        await this.saveFunnel(migratedFunnel);
        
        // Remover chave legada
        this.storage.remove(legacyKey);
        
        return migratedFunnel;
      }

      return null;
    } catch (error) {
      console.warn('[ContextualFunnel] Falha ao migrar dados legados:', error);
      return null;
    }
  }
}

/**
 * Factory para criar instâncias contextuais
 */
export const createContextualFunnelService = (context: FunnelContext): ContextualFunnelService => {
  return new ContextualFunnelService(context);
};

/**
 * Instâncias pré-criadas para contextos comuns
 */
export const editorFunnelService = new ContextualFunnelService(FunnelContext.EDITOR);
export const templatesFunnelService = new ContextualFunnelService(FunnelContext.TEMPLATES);
export const myFunnelsFunnelService = new ContextualFunnelService(FunnelContext.MY_FUNNELS);
export const myTemplatesFunnelService = new ContextualFunnelService(FunnelContext.MY_TEMPLATES);
export const previewFunnelService = new ContextualFunnelService(FunnelContext.PREVIEW);
