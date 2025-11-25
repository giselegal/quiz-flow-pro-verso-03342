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

import { supabase } from '@/services/integrations/supabase/client';
import type { Block } from '@/core/schemas';
import { validateBlocks } from '@/core/schemas';
import { appLogger } from '@/lib/utils/appLogger';

export interface SaveOptions {
    optimistic?: boolean;
    createVersion?: boolean;
    metadata?: Record<string, any>;
}

export interface LoadOptions {
    version?: number;
    includeMetadata?: boolean;
}

export interface PersistenceResult<T> {
    success: boolean;
    data?: T;
    error?: Error;
    version?: number;
}

/**
 * Classe principal do serviço de persistência
 */
class PersistenceService {
    private pendingOperations: Map<string, Promise<any>> = new Map();
    
    /**
     * Salvar blocos de um step
     */
    async saveBlocks(
        stepId: string,
        blocks: Block[],
        options: SaveOptions = {}
    ): Promise<PersistenceResult<Block[]>> {
        try {
            // Validar blocos
            const validation = validateBlocks(blocks);
            if (!validation.success) {
                throw new Error(`Validação falhou: ${validation.error.message}`);
            }
            
            // Deduplicar operações concorrentes
            const operationKey = `save:${stepId}`;
            if (this.pendingOperations.has(operationKey)) {
                appLogger.debug(`[PersistenceService] Operação já em andamento: ${operationKey}`);
                return this.pendingOperations.get(operationKey)!;
            }
            
            const operation = this._saveBlocksInternal(stepId, blocks, options);
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
                error: error instanceof Error ? error : new Error('Erro desconhecido'),
            };
        }
    }
    
    /**
     * Implementação interna de save com retry
     */
    private async _saveBlocksInternal(
        stepId: string,
        blocks: Block[],
        options: SaveOptions
    ): Promise<PersistenceResult<Block[]>> {
        const maxRetries = 3;
        let lastError: Error | undefined;
        
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const timestamp = Date.now();
                
                // Salvar no Supabase
                const { data, error } = await supabase
                    .from('editor_blocks')
                    .upsert({
                        step_id: stepId,
                        blocks: blocks,
                        metadata: options.metadata || {},
                        updated_at: timestamp,
                        version: options.createVersion ? timestamp : undefined,
                    })
                    .select();
                
                if (error) throw error;
                
                appLogger.info(`[PersistenceService] Blocos salvos: ${stepId}`, {
                    count: blocks.length,
                    version: data?.[0]?.version,
                });
                
                return {
                    success: true,
                    data: blocks,
                    version: data?.[0]?.version,
                };
            } catch (error) {
                lastError = error instanceof Error ? error : new Error('Erro desconhecido');
                appLogger.warn(`[PersistenceService] Tentativa ${attempt + 1} falhou:`, error);
                
                if (attempt < maxRetries - 1) {
                    await this._delay(Math.pow(2, attempt) * 1000); // Exponential backoff
                }
            }
        }
        
        return {
            success: false,
            error: lastError,
        };
    }
    
    /**
     * Carregar blocos de um step
     */
    async loadBlocks(
        stepId: string,
        options: LoadOptions = {}
    ): Promise<PersistenceResult<Block[]>> {
        try {
            let query = supabase
                .from('editor_blocks')
                .select('*')
                .eq('step_id', stepId);
            
            if (options.version) {
                query = query.eq('version', options.version);
            } else {
                query = query.order('updated_at', { ascending: false }).limit(1);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            if (!data || data.length === 0) {
                return {
                    success: true,
                    data: [],
                };
            }
            
            const blocks = data[0].blocks;
            const validation = validateBlocks(blocks);
            
            if (!validation.success) {
                throw new Error(`Dados inválidos do banco: ${validation.error.message}`);
            }
            
            appLogger.info(`[PersistenceService] Blocos carregados: ${stepId}`, {
                count: blocks.length,
            });
            
            return {
                success: true,
                data: validation.data,
                version: data[0].version,
            };
        } catch (error) {
            appLogger.error('[PersistenceService] Erro ao carregar blocos:', error);
            return {
                success: false,
                error: error instanceof Error ? error : new Error('Erro desconhecido'),
            };
        }
    }
    
    /**
     * Fazer rollback para uma versão anterior
     */
    async rollback(stepId: string, version: number): Promise<PersistenceResult<Block[]>> {
        try {
            appLogger.info(`[PersistenceService] Rollback: ${stepId} → versão ${version}`);
            
            // Carregar versão antiga
            const loadResult = await this.loadBlocks(stepId, { version });
            
            if (!loadResult.success || !loadResult.data) {
                throw new Error('Versão não encontrada');
            }
            
            // Salvar como versão atual
            return await this.saveBlocks(stepId, loadResult.data, {
                createVersion: true,
                metadata: {
                    rolledBackFrom: Date.now(),
                    rolledBackTo: version,
                },
            });
        } catch (error) {
            appLogger.error('[PersistenceService] Erro no rollback:', error);
            return {
                success: false,
                error: error instanceof Error ? error : new Error('Erro desconhecido'),
            };
        }
    }
    
    /**
     * Listar versões disponíveis
     */
    async listVersions(stepId: string): Promise<PersistenceResult<Array<{ version: number; timestamp: number }>>> {
        try {
            const { data, error } = await supabase
                .from('editor_blocks')
                .select('version, updated_at')
                .eq('step_id', stepId)
                .not('version', 'is', null)
                .order('version', { ascending: false });
            
            if (error) throw error;
            
            return {
                success: true,
                data: data?.map((v: any) => ({
                    version: v.version,
                    timestamp: v.updated_at,
                })) || [],
            };
        } catch (error) {
            appLogger.error('[PersistenceService] Erro ao listar versões:', error);
            return {
                success: false,
                error: error instanceof Error ? error : new Error('Erro desconhecido'),
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
