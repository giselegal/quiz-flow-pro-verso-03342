/**
 * 🔐 CONTEXTUAL STORAGE SERVICE - FASE 1
 * 
 * Wrapper do StorageService que adiciona isolamento por contexto
 * para prevenir vazamento de dados entre diferentes áreas do app
 * 
 * ✅ Isolamento completo por contexto
 * ✅ Compatibilidade com StorageService existente
 * ✅ Migração automática de dados legados
 * ✅ Type-safe com generics
 */

import { StorageService } from './StorageService';
import { FunnelContext, generateContextualStorageKey } from '@/core/contexts/FunnelContext';

export class ContextualStorageService {
  constructor(private readonly context: FunnelContext) {}

  /**
   * Obtém string com contexto isolado
   */
  getString(key: string): string | null {
    const contextualKey = generateContextualStorageKey(this.context, key);
    return StorageService.safeGetString(contextualKey);
  }

  /**
   * Obtém JSON com contexto isolado
   */
  getJSON<T = any>(key: string): T | null {
    const contextualKey = generateContextualStorageKey(this.context, key);
    return StorageService.safeGetJSON<T>(contextualKey);
  }

  /**
   * Salva string com contexto isolado
   */
  setString(key: string, value: string): boolean {
    const contextualKey = generateContextualStorageKey(this.context, key);
    return StorageService.safeSetString(contextualKey, value);
  }

  /**
   * Salva JSON com contexto isolado
   */
  setJSON(key: string, value: unknown): boolean {
    const contextualKey = generateContextualStorageKey(this.context, key);
    return StorageService.safeSetJSON(contextualKey, value);
  }

  /**
   * Remove item com contexto isolado
   */
  remove(key: string): boolean {
    const contextualKey = generateContextualStorageKey(this.context, key);
    return StorageService.safeRemove(contextualKey);
  }

  /**
   * Lista todas as chaves deste contexto
   */
  listKeys(): string[] {
    if (typeof window === 'undefined') return [];
    
    const contextPrefix = `${this.context}-`;
    const keys: string[] = [];

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(contextPrefix)) {
          // Retorna key sem o prefixo de contexto
          keys.push(key.replace(contextPrefix, ''));
        }
      }
    } catch (e) {
      console.warn('[ContextualStorage] Erro ao listar chaves:', e);
    }

    return keys;
  }

  /**
   * Limpa todos os dados deste contexto
   */
  clearContext(): number {
    if (typeof window === 'undefined') return 0;

    const contextPrefix = `${this.context}-`;
    const keysToRemove: string[] = [];

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(contextPrefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => StorageService.safeRemove(key));
      console.log(`🗑️ [ContextualStorage] Limpos ${keysToRemove.length} itens do contexto ${this.context}`);
      
      return keysToRemove.length;
    } catch (e) {
      console.warn('[ContextualStorage] Erro ao limpar contexto:', e);
      return 0;
    }
  }

  /**
   * Migra dados de chave legada (sem contexto) para contextual
   */
  migrateFromLegacy(legacyKey: string, newKey?: string): boolean {
    try {
      const data = StorageService.safeGetJSON(legacyKey);
      if (data) {
        const targetKey = newKey || legacyKey;
        const success = this.setJSON(targetKey, data);
        
        if (success) {
          // Remove chave legada após migração bem-sucedida
          StorageService.safeRemove(legacyKey);
          console.log(`🔄 [ContextualStorage] Migrado: ${legacyKey} → ${this.context}-${targetKey}`);
          return true;
        }
      }
      return false;
    } catch (e) {
      console.warn('[ContextualStorage] Erro na migração:', e);
      return false;
    }
  }

  /**
   * Obtém estatísticas de uso deste contexto
   */
  getStats() {
    const keys = this.listKeys();
    let totalSize = 0;

    keys.forEach(key => {
      const contextualKey = generateContextualStorageKey(this.context, key);
      const value = StorageService.safeGetString(contextualKey);
      if (value) {
        totalSize += value.length;
      }
    });

    return {
      context: this.context,
      keysCount: keys.length,
      totalSizeBytes: totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2)
    };
  }
}

/**
 * Factory para criar instâncias contextuais
 */
export const createContextualStorage = (context: FunnelContext): ContextualStorageService => {
  return new ContextualStorageService(context);
};

/**
 * Instâncias pré-criadas para contextos comuns
 */
export const editorStorage = new ContextualStorageService(FunnelContext.EDITOR);
export const templatesStorage = new ContextualStorageService(FunnelContext.TEMPLATES);
export const myFunnelsStorage = new ContextualStorageService(FunnelContext.MY_FUNNELS);
export const myTemplatesStorage = new ContextualStorageService(FunnelContext.MY_TEMPLATES);
export const previewStorage = new ContextualStorageService(FunnelContext.PREVIEW);
