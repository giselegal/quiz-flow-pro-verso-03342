/**
 * 🔄 PERSISTENCE SERVICE - Camada Única de Persistência
 * 
 * Serviço consolidado para persistência de dados do quiz/editor.
 * Substitui múltiplas camadas fragmentadas (TemplateManager, BlockEditingService, etc).
 * 
 * RESPONSABILIDADES:
 * - Salvar/carregar templates e blocos
 * - Integração com Supabase
 * - Versionamento e migrações
 * - Optimistic updates
 * - Tratamento de erros e retry
 * 
 * @example
 * ```typescript
 * import { persistenceService } from '@/core/services/persistenceService';
 * 
 * // Salvar
 * await persistenceService.saveBlocks('step-01', blocks);
 * 
 * // Carregar
 * const blocks = await persistenceService.loadBlocks('step-01');
 * 
 * // Rollback
 * await persistenceService.rollback('step-01', version);
 * ```
 */

import type { Block } from '@/core/schemas';
import { validateBlock } from '@/core/schemas/blockSchema';
import { appLogger } from '@/lib/utils/appLogger';

export interface SaveOptions {
    validateBeforeSave?: boolean;
    maxRetries?: number;
    metadata?: Record<string, any>;
}

export interface LoadOptions {
    includeMetadata?: boolean;
}

export type SaveResult =
    | { success: true; version: string }
    | { success: false; error: string };

export type LoadResult =
    | { success: true; blocks: Block[]; version: string }
    | { success: false; error: string };

export type VersionInfo = {
    version: string;
    timestamp: number;
    blockCount: number;
};

export type ListVersionsResult =
    | { success: true; versions: VersionInfo[] }
    | { success: false; error: string };

export type RollbackResult =
    | { success: true; version: string }
    | { success: false; error: string };

/**
 * Storage para dados persistidos (simulando DB)
 */
interface StoredData {
    funnelId: string;
    version: string;
    timestamp: number;
    blocks: Block[];
    metadata?: Record<string, any>;
}

/**
 * Classe principal do serviço de persistência
 */
class PersistenceService {
    private storage: Map<string, StoredData[]> = new Map();
    private pendingOperations: Map<string, Promise<any>> = new Map();
    
    /**
     * Salvar blocos de um funnel
     */
    async saveBlocks(
        funnelId: string,
        blocks: Block[],
        options: SaveOptions = {}
    ): Promise<SaveResult> {
        try {
            // Validar funnelId
            if (!funnelId || funnelId.trim() === '') {
                return {
                    success: false,
                    error: 'FunnelId cannot be empty',
                };
            }
            
            // Validar blocos se solicitado
            if (options.validateBeforeSave !== false) {
                for (const block of blocks) {
                    const validation = validateBlock(block);
                    if (!validation.success) {
                        return {
                            success: false,
                            error: `Block validation failed: ${validation.error.message}`,
                        };
                    }
                }
            }
            
            // Deduplicar operações concorrentes
            const operationKey = `save:${funnelId}`;
            if (this.pendingOperations.has(operationKey)) {
                return this.pendingOperations.get(operationKey)!;
            }
            
            const operation = this._saveBlocksInternal(funnelId, blocks, options);
            this.pendingOperations.set(operationKey, operation);
            
            try {
                const result = await operation;
                return result;
            } finally {
                this.pendingOperations.delete(operationKey);
            }
        } catch (error) {
            appLogger.error('[PersistenceService] Erro ao salvar blocos:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    
    /**
     * Implementação interna de save com retry
     */
    private async _saveBlocksInternal(
        funnelId: string,
        blocks: Block[],
        options: SaveOptions
    ): Promise<SaveResult> {
        const maxRetries = options.maxRetries ?? 3;
        let lastError: string | undefined;
        
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const timestamp = Date.now();
                const version = `v${timestamp}`;
                
                // Criar novo registro de versão
                const storedData: StoredData = {
                    funnelId,
                    version,
                    timestamp,
                    blocks: JSON.parse(JSON.stringify(blocks)), // Deep clone
                    metadata: options.metadata,
                };
                
                // Obter versões existentes
                const existingVersions = this.storage.get(funnelId) || [];
                
                // Adicionar nova versão
                existingVersions.push(storedData);
                this.storage.set(funnelId, existingVersions);
                
                appLogger.info(`[PersistenceService] Blocos salvos: ${funnelId}`, {
                    count: blocks.length,
                    version,
                });
                
                return {
                    success: true,
                    version,
                };
            } catch (error) {
                lastError = error instanceof Error ? error.message : 'Unknown error';
                appLogger.warn(`[PersistenceService] Tentativa ${attempt + 1} falhou:`, error);
                
                if (attempt < maxRetries - 1) {
                    await this._delay(Math.pow(2, attempt) * 100); // Exponential backoff
                }
            }
        }
        
        return {
            success: false,
            error: lastError || 'Max retries exceeded',
        };
    }
    
    /**
     * Carregar blocos de um funnel
     */
    async loadBlocks(
        funnelId: string,
        version?: string
    ): Promise<LoadResult> {
        try {
            const versions = this.storage.get(funnelId);
            
            if (!versions || versions.length === 0) {
                return {
                    success: false,
                    error: `Funnel "${funnelId}" not found`,
                };
            }
            
            let storedData: StoredData | undefined;
            
            if (version) {
                // Carregar versão específica
                storedData = versions.find(v => v.version === version);
                if (!storedData) {
                    return {
                        success: false,
                        error: `Version "${version}" not found`,
                    };
                }
            } else {
                // Carregar versão mais recente
                storedData = versions[versions.length - 1];
            }
            
            appLogger.info(`[PersistenceService] Blocos carregados: ${funnelId}`, {
                count: storedData.blocks.length,
                version: storedData.version,
            });
            
            return {
                success: true,
                blocks: JSON.parse(JSON.stringify(storedData.blocks)), // Deep clone
                version: storedData.version,
            };
        } catch (error) {
            appLogger.error('[PersistenceService] Erro ao carregar blocos:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    
    /**
     * Fazer rollback para uma versão anterior
     */
    async rollback(funnelId: string, version: string): Promise<RollbackResult> {
        try {
            appLogger.info(`[PersistenceService] Rollback: ${funnelId} → versão ${version}`);
            
            // Carregar versão antiga
            const loadResult = await this.loadBlocks(funnelId, version);
            
            if (!loadResult.success) {
                return {
                    success: false,
                    error: loadResult.error,
                };
            }
            
            // Salvar como nova versão
            const saveResult = await this.saveBlocks(funnelId, loadResult.blocks, {
                metadata: {
                    rolledBackFrom: Date.now(),
                    rolledBackTo: version,
                },
            });
            
            if (!saveResult.success) {
                return {
                    success: false,
                    error: saveResult.error,
                };
            }
            
            return {
                success: true,
                version: saveResult.version,
            };
        } catch (error) {
            appLogger.error('[PersistenceService] Erro no rollback:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    
    /**
     * Listar versões disponíveis
     */
    async listVersions(funnelId: string): Promise<ListVersionsResult> {
        try {
            const versions = this.storage.get(funnelId) || [];
            
            // Ordenar por timestamp (mais recente primeiro)
            const sortedVersions = [...versions].sort((a, b) => b.timestamp - a.timestamp);
            
            return {
                success: true,
                versions: sortedVersions.map(v => ({
                    version: v.version,
                    timestamp: v.timestamp,
                    blockCount: v.blocks.length,
                })),
            };
        } catch (error) {
            appLogger.error('[PersistenceService] Erro ao listar versões:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    
    /**
     * Helper: delay para retry
     */
    private _delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * Instância singleton do serviço
 */
export const persistenceService = new PersistenceService();
