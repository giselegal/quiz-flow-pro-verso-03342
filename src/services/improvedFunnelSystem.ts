/**
 * 🚀 SISTEMA HÍBRIDO UNIFICADO - IMPROVED FUNNEL SYSTEM
 * 
 * Este é o sistema híbrido completo que integra:
 * - AdvancedFunnelStorage (storage avançado)
 * - Validation systems (idValidation, schemaValidation, errorHandling)
 * - FunnelUnifiedService (serviços unificados)
 * - Template management unificado
 * 
 * Baseado na documentação: RELATORIO_MELHORIAS_ADMIN_FUNIS.md
 */

import { getLogger } from '@/utils/logging';
import { advancedFunnelStorage } from './AdvancedFunnelStorage';
import { validateFunnelId } from '@/utils/idValidation';
import { errorManager, createStorageError } from '@/utils/errorHandling';
import { FunnelContext } from '@/core/contexts/FunnelContext';

// ============================================================================
// INTERFACES E TIPOS
// ============================================================================

export interface HybridFunnelData {
    id: string;
    name: string;
    description?: string;
    category?: string;
    templateId?: string;
    context: FunnelContext;
    userId: string;
    autoPublish?: boolean;
    status?: 'draft' | 'published';
    url?: string;
    version?: number;
    createdAt?: string;
    updatedAt?: string;
    checksum?: string;
}

export interface FunnelCreationResult {
    id: string;
    name: string;
    url: string;
    status: 'draft' | 'published';
    createdAt: string;
    updatedAt: string;
    success: boolean;
    validationStatus: 'valid' | 'invalid';
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

// ============================================================================
// CLASSE PRINCIPAL DO SISTEMA HÍBRIDO
// ============================================================================

class ImprovedFunnelSystem {
    private readonly logger = getLogger();

    // ============================================================================
    // VALIDAÇÃO INTEGRADA
    // ============================================================================

    private async validateFunnelData(data: Partial<HybridFunnelData>): Promise<ValidationResult> {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: []
        };

        // Validação de ID
        if (data.id) {
            const idValidation = validateFunnelId(data.id);
            if (!idValidation.isValid) {
                result.isValid = false;
                result.errors.push(`ID inválido: ${idValidation.error}`);
            }
        }

        // Validação de schema básico
        if (data.name && data.name.length < 3) {
            result.errors.push('Nome deve ter pelo menos 3 caracteres');
            result.isValid = false;
        }

        if (data.userId && !data.userId.trim()) {
            result.errors.push('UserID é obrigatório');
            result.isValid = false;
        }

        // Validações de negócio
        if (data.context && !Object.values(FunnelContext).includes(data.context)) {
            result.warnings.push('Contexto não reconhecido');
        }

        this.logger.debug('hybrid-validation', 'Validação completa', {
            isValid: result.isValid,
            errorsCount: result.errors.length,
            warningsCount: result.warnings.length
        });

        return result;
    }

    // ============================================================================
    // CRIAÇÃO DE FUNIS HÍBRIDA
    // ============================================================================

    async createFunnel(params: Omit<HybridFunnelData, 'id' | 'createdAt' | 'updatedAt'>): Promise<FunnelCreationResult> {
        this.logger.info('hybrid-creation', 'Iniciando criação de funil híbrida', {
            name: params.name,
            templateId: params.templateId,
            context: params.context
        });

        try {
            // 1. Gerar ID único e seguro
            const funnelId = this.generateSecureId(params.name);
            const now = new Date().toISOString();

            // 2. Criar dados completos do funil
            const funnelData: HybridFunnelData = {
                id: funnelId,
                name: params.name,
                description: params.description || `Funil baseado no template ${params.templateId || 'personalizado'}`,
                category: params.category || 'general',
                templateId: params.templateId,
                context: params.context,
                userId: params.userId,
                status: params.autoPublish ? 'published' : 'draft',
                url: `/editor/${encodeURIComponent(funnelId)}`,
                version: 1,
                createdAt: now,
                updatedAt: now
            };

            // 3. Validação híbrida integrada
            const validation = await this.validateFunnelData(funnelData);
            if (!validation.isValid) {
                const validationError = createStorageError(
                    'STORAGE_NOT_AVAILABLE',
                    `Validação falhou: ${validation.errors.join(', ')}`,
                    { operation: 'createFunnel', funnelId }
                );
                errorManager.handleError(validationError);

                return {
                    id: funnelId,
                    name: params.name,
                    url: '',
                    status: 'draft',
                    createdAt: now,
                    updatedAt: now,
                    success: false,
                    validationStatus: 'invalid'
                };
            }

            // 4. Armazenamento através do AdvancedFunnelStorage
            const storedFunnel = await advancedFunnelStorage.upsertFunnel(funnelData);

            this.logger.info('hybrid-creation', 'Funil criado com sucesso no sistema híbrido', {
                funnelId: storedFunnel.id,
                status: storedFunnel.status,
                validationPassed: true,
                storageMethod: 'advanced'
            });

            return {
                id: storedFunnel.id,
                name: storedFunnel.name,
                url: storedFunnel.url || `/editor/${encodeURIComponent(storedFunnel.id)}`,
                status: storedFunnel.status,
                createdAt: storedFunnel.createdAt,
                updatedAt: storedFunnel.updatedAt,
                success: true,
                validationStatus: 'valid'
            };

        } catch (error) {
            this.logger.error('hybrid-creation', 'Falha na criação híbrida', {
                error: error instanceof Error ? error.message : String(error),
                params
            });

            const systemError = createStorageError(
                'STORAGE_NOT_AVAILABLE',
                `Falha na criação do funil: ${error instanceof Error ? error.message : String(error)}`,
                { operation: 'createFunnel' }
            );
            errorManager.handleError(systemError);

            throw error;
        }
    }

    // ============================================================================
    // ARMAZENAMENTO E VALIDAÇÃO HÍBRIDA
    // ============================================================================

    async validateAndStore(funnelData: Partial<HybridFunnelData> & { id: string }): Promise<void> {
        this.logger.debug('hybrid-storage', 'Validando e armazenando funil', { funnelId: funnelData.id });

        try {
            // 1. Validação completa
            const validation = await this.validateFunnelData(funnelData);
            if (!validation.isValid) {
                throw new Error(`Validação falhou: ${validation.errors.join(', ')}`);
            }

            // 2. Preparar dados para armazenamento
            const now = new Date().toISOString();
            const storageData = {
                ...funnelData,
                updatedAt: now,
                createdAt: funnelData.createdAt || now,
                version: (funnelData.version || 0) + 1
            };

            // 3. Armazenar usando AdvancedFunnelStorage
            await advancedFunnelStorage.upsertFunnel(storageData);

            this.logger.info('hybrid-storage', 'Funil validado e armazenado com sucesso', {
                funnelId: funnelData.id,
                version: storageData.version
            });

        } catch (error) {
            this.logger.error('hybrid-storage', 'Erro no armazenamento híbrido', {
                funnelId: funnelData.id,
                error: error instanceof Error ? error.message : String(error)
            });

            const storageError = createStorageError(
                'STORAGE_NOT_AVAILABLE',
                `Erro no armazenamento: ${error instanceof Error ? error.message : String(error)}`,
                { operation: 'validateAndStore', funnelId: funnelData.id }
            );
            errorManager.handleError(storageError);

            throw error;
        }
    }

    // ============================================================================
    // LISTAGEM VALIDADA
    // ============================================================================

    async listValidatedFunnels(): Promise<any[]> {
        try {
            const funnels = await advancedFunnelStorage.listFunnels();

            this.logger.debug('hybrid-list', 'Funis listados com validação', {
                count: funnels.length
            });

            return funnels.filter(funnel => {
                const validation = validateFunnelId(funnel.id);
                return validation.isValid;
            });

        } catch (error) {
            this.logger.error('hybrid-list', 'Erro na listagem validada', {
                error: error instanceof Error ? error.message : String(error)
            });

            const listError = createStorageError(
                'STORAGE_NOT_AVAILABLE',
                `Erro na listagem: ${error instanceof Error ? error.message : String(error)}`,
                { operation: 'listValidatedFunnels' }
            );
            errorManager.handleError(listError);

            return [];
        }
    }

    // ============================================================================
    // UTILIDADES HÍBRIDAS
    // ============================================================================

    private generateSecureId(baseName: string): string {
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substr(2, 8);
        const safeBaseName = baseName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .substr(0, 20);

        return `${safeBaseName}-${timestamp}-${randomSuffix}`;
    }

    async getSystemStatus(): Promise<{
        storageReady: boolean;
        validationReady: boolean;
        errorHandlingReady: boolean;
        totalFunnels: number;
    }> {
        try {
            const storageInfo = await advancedFunnelStorage.getStorageInfo();

            return {
                storageReady: true,
                validationReady: typeof validateFunnelId === 'function',
                errorHandlingReady: typeof errorManager.handleError === 'function',
                totalFunnels: storageInfo.totalFunnels
            };
        } catch (error) {
            return {
                storageReady: false,
                validationReady: false,
                errorHandlingReady: false,
                totalFunnels: 0
            };
        }
    }
}

// ============================================================================
// EXPORTAR INSTÂNCIA SINGLETON
// ============================================================================

export const improvedFunnelSystem = new ImprovedFunnelSystem();

// Para compatibilidade, também exportar como default
export default improvedFunnelSystem;