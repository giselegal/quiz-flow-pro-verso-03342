/**
 * 🔄 FUNNEL SERVICE LEGACY ADAPTER
 * 
 * Adapta a API legada para o novo FunnelService
 * Permite que código antigo continue funcionando enquanto migramos gradualmente
 * 
 * MÉTODOS LEGADOS SUPORTADOS:
 * - getFunnel() → loadFunnel()
 * - createFunnel() → saveFunnel()
 * - updateFunnel() → saveFunnel()
 * - checkPermissions() → sempre retorna true (temporário)
 * - clearCache() → noop
 * - on/off → event emitter básico
 * 
 * @deprecated Use FunnelService diretamente
 * @version 4.1.0
 */

import { FunnelService, type Funnel, type LoadFunnelResult } from './FunnelService';
import { appLogger } from '@/lib/utils/appLogger';
import type { QuizSchema } from '@/schemas/quiz-schema.zod';

type EventCallback = (...args: any[]) => void;

/**
 * Adapter que estende FunnelService com API legada
 */
export class FunnelServiceLegacyAdapter extends FunnelService {
  private eventListeners = new Map<string, EventCallback[]>();

  /**
   * LEGADO: getFunnel
   * Mapeia para loadFunnel
   */
  async getFunnel(funnelId: string): Promise<Funnel | null> {
    try {
      const result = await this.loadFunnel({ funnelId });
      return result.funnel;
    } catch (error) {
      appLogger.error('[FunnelServiceAdapter] getFunnel error', { funnelId, error });
      return null;
    }
  }

  /**
   * LEGADO: createFunnel
   * Mapeia para saveFunnel (novo draft)
   */
  async createFunnel(
    quiz: QuizSchema,
    funnelId?: string,
    userId?: string
  ): Promise<Funnel | null> {
    try {
      const id = funnelId || quiz.metadata?.id || `funnel-${Date.now()}`;
      const result = await this.saveFunnel(quiz, id, undefined, userId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create funnel');
      }

      // Carregar o funnel criado
      const loaded = await this.loadFunnel({ funnelId: id, draftId: result.draftId });
      return loaded.funnel;
    } catch (error) {
      appLogger.error('[FunnelServiceAdapter] createFunnel error', { funnelId, error });
      return null;
    }
  }

  /**
   * LEGADO: updateFunnel
   * Mapeia para saveFunnel (update draft existente)
   */
  async updateFunnel(
    funnelId: string,
    quiz: QuizSchema,
    draftId?: string,
    userId?: string
  ): Promise<Funnel | null> {
    try {
      const result = await this.saveFunnel(quiz, funnelId, draftId, userId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update funnel');
      }

      // Carregar o funnel atualizado
      const loaded = await this.loadFunnel({ funnelId, draftId: result.draftId });
      return loaded.funnel;
    } catch (error) {
      appLogger.error('[FunnelServiceAdapter] updateFunnel error', { funnelId, error });
      return null;
    }
  }

  /**
   * LEGADO: checkPermissions
   * Temporariamente retorna sempre true
   * TODO: Implementar verificação real de permissões
   */
  async checkPermissions(funnelId: string, userId?: string): Promise<boolean> {
    appLogger.debug('[FunnelServiceAdapter] checkPermissions (always true)', { funnelId, userId });
    // TODO: Implementar RLS real quando necessário
    return true;
  }

  /**
   * LEGADO: clearCache
   * Não faz nada no novo sistema (sem cache central)
   */
  clearCache(): void {
    appLogger.debug('[FunnelServiceAdapter] clearCache (noop in new system)');
    // O novo sistema não tem cache central
    // Cada componente gerencia seu próprio cache se necessário
  }

  /**
   * LEGADO: on (event listener)
   * Simula event emitter básico
   */
  on(event: string, callback: EventCallback): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
    appLogger.debug('[FunnelServiceAdapter] Event listener added', { event });
  }

  /**
   * LEGADO: off (remove event listener)
   */
  off(event: string, callback: EventCallback): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
    appLogger.debug('[FunnelServiceAdapter] Event listener removed', { event });
  }

  /**
   * Dispara evento
   */
  private emit(event: string, ...args: any[]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          appLogger.error('[FunnelServiceAdapter] Event callback error', { event, error });
        }
      });
    }
  }

  /**
   * Override saveFunnel para emitir eventos
   */
  async saveFunnel(
    quiz: QuizSchema,
    funnelId: string,
    draftId?: string,
    userId?: string
  ) {
    const result = await super.saveFunnel(quiz, funnelId, draftId, userId);
    
    if (result.success) {
      this.emit(draftId ? 'funnel:updated' : 'funnel:created', {
        funnelId,
        draftId: result.draftId,
        version: result.version
      });
    }
    
    return result;
  }

  /**
   * Override deleteFunnel para emitir eventos
   */
  async deleteFunnel(draftId: string): Promise<boolean> {
    const result = await super.deleteFunnel(draftId);
    
    if (result) {
      this.emit('funnel:deleted', { draftId });
    }
    
    return result;
  }
}

/**
 * Singleton com adapter
 */
export const funnelServiceAdapter = new FunnelServiceLegacyAdapter();

/**
 * Export default para compatibilidade
 */
export const funnelService = funnelServiceAdapter;
