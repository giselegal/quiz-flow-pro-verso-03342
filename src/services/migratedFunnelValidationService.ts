/**
 * 🔄 MIGRATED FUNNEL VALIDATION SERVICE
 * 
 * Este serviço substitui o funnelValidationService legado, integrando
 * com a nova arquitetura baseada em:
 * - schemaValidation.ts para validação de schemas
 * - errorHandling.ts para tratamento padronizado de erros  
 * - idValidation.ts para validação rigorosa de IDs
 * - improvedFunnelSystem.ts para operações unificadas
 */

import { validateFunnelId } from '@/utils/idValidation';
import { validateFunnelSchema } from '@/utils/schemaValidation';
import { errorManager, createValidationError, createStorageError, StandardizedError } from '@/utils/errorHandling';
import { performSystemHealthCheck } from '@/utils/improvedFunnelSystem';
import { dbToFrontend, frontendToDb } from '@/utils/namingStandards';

export interface MigratedFunnelValidationResult {
    isValid: boolean;
    exists: boolean;
    hasPermission: boolean;
    funnel?: any;
    error?: StandardizedError;
    validationDetails?: {
        idValidation: boolean;
        schemaValidation: boolean;
        permissionCheck: boolean;
        healthCheck: boolean;
    };
}

export interface FunnelPermission {
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
    canShare: boolean;
    isOwner: boolean;
    accessLevel: 'none' | 'read' | 'write' | 'admin' | 'owner';
}

export class MigratedFunnelValidationService {
    private static instance: MigratedFunnelValidationService;
    private cache = new Map<string, { result: MigratedFunnelValidationResult; timestamp: number }>();
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

    static getInstance(): MigratedFunnelValidationService {
        if (!MigratedFunnelValidationService.instance) {
            MigratedFunnelValidationService.instance = new MigratedFunnelValidationService();
        }
        return MigratedFunnelValidationService.instance;
    }

    /**
     * ✨ NOVA VERSÃO: Validação completa de funil com nova arquitetura
     */
    async validateFunnelAccess(funnelId: string, userId?: string): Promise<MigratedFunnelValidationResult> {
        try {
            // 1. VALIDAÇÃO DE ID usando nova arquitetura
            const idValidationResult = validateFunnelId(funnelId);
            if (!idValidationResult.isValid) {
                const error = createValidationError(
                    'INVALID_FUNNEL_ID',
                    `ID do funil inválido: ${idValidationResult.error}`,
                    {
                        funnelId,
                        additionalData: { validationResult: idValidationResult }
                    }
                );

                errorManager.handleError(error);

                return {
                    isValid: false,
                    exists: false,
                    hasPermission: false,
                    error,
                    validationDetails: {
                        idValidation: false,
                        schemaValidation: false,
                        permissionCheck: false,
                        healthCheck: false
                    }
                };
            }

            // 2. VERIFICAR CACHE com nova estrutura
            const cacheKey = `${funnelId}-${userId || 'anonymous'}`;
            const cached = this.cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
                return cached.result;
            }

            // 3. VERIFICAR EXISTÊNCIA DO FUNIL
            const funnelExists = await this.checkFunnelExistsAdvanced(funnelId);

            if (!funnelExists.exists) {
                const error = createStorageError(
                    'NOT_FOUND',
                    `Funil '${funnelId}' não foi encontrado no sistema`,
                    {
                        funnelId,
                        additionalData: { searchAttempts: funnelExists.searchAttempts }
                    }
                );

                errorManager.handleError(error);

                const result: MigratedFunnelValidationResult = {
                    isValid: false,
                    exists: false,
                    hasPermission: false,
                    error,
                    validationDetails: {
                        idValidation: true,
                        schemaValidation: false,
                        permissionCheck: false,
                        healthCheck: false
                    }
                };

                this.cache.set(cacheKey, { result, timestamp: Date.now() });
                return result;
            }

            // 4. VALIDAÇÃO DE SCHEMA usando nova arquitetura
            const schemaValidation = validateFunnelSchema(funnelExists.funnel);
            if (!schemaValidation.isValid) {
                const error = createValidationError(
                    'SCHEMA_VALIDATION_FAILED',
                    `Schema do funil inválido: ${schemaValidation.errors?.join(', ')}`,
                    {
                        funnelId,
                        additionalData: { schemaErrors: schemaValidation.errors }
                    }
                );

                errorManager.handleError(error);

                const result: MigratedFunnelValidationResult = {
                    isValid: false,
                    exists: true,
                    hasPermission: false,
                    error,
                    validationDetails: {
                        idValidation: true,
                        schemaValidation: false,
                        permissionCheck: false,
                        healthCheck: false
                    }
                };

                this.cache.set(cacheKey, { result, timestamp: Date.now() });
                return result;
            }

            // 5. VERIFICAR PERMISSÕES AVANÇADAS
            const permissions = await this.checkAdvancedFunnelPermissions(funnelId, userId);

            if (!permissions.canRead) {
                const error = createValidationError(
                    'FORBIDDEN',
                    `Usuário não tem permissão para acessar o funil '${funnelId}'`,
                    {
                        funnelId,
                        userId: userId || 'anonymous',
                        additionalData: { accessLevel: permissions.accessLevel }
                    }
                );

                errorManager.handleError(error);

                const result: MigratedFunnelValidationResult = {
                    isValid: false,
                    exists: true,
                    hasPermission: false,
                    error,
                    validationDetails: {
                        idValidation: true,
                        schemaValidation: true,
                        permissionCheck: false,
                        healthCheck: false
                    }
                };

                this.cache.set(cacheKey, { result, timestamp: Date.now() });
                return result;
            }

            // 6. HEALTH CHECK do sistema
            const healthCheck = await performSystemHealthCheck();

            // 7. SUCESSO COMPLETO
            const result: MigratedFunnelValidationResult = {
                isValid: true,
                exists: true,
                hasPermission: true,
                funnel: dbToFrontend(funnelExists.funnel), // Padronizar nomenclatura
                validationDetails: {
                    idValidation: true,
                    schemaValidation: true,
                    permissionCheck: true,
                    healthCheck: healthCheck.overall === 'healthy'
                }
            };

            this.cache.set(cacheKey, { result, timestamp: Date.now() });

            return result;

        } catch (error) {
            const standardizedError = createStorageError(
                'SERVER_ERROR',
                'Erro interno no sistema de validação',
                {
                    funnelId,
                    userId,
                    additionalData: { originalError: error }
                }
            );

            errorManager.handleError(standardizedError);

            return {
                isValid: false,
                exists: false,
                hasPermission: false,
                error: standardizedError,
                validationDetails: {
                    idValidation: false,
                    schemaValidation: false,
                    permissionCheck: false,
                    healthCheck: false
                }
            };
        }
    }    /**
     * 🔍 VERIFICAÇÃO AVANÇADA DE EXISTÊNCIA
     */
    private async checkFunnelExistsAdvanced(funnelId: string): Promise<{
        exists: boolean;
        funnel?: any;
        searchAttempts: number;
        dataSource?: 'supabase' | 'localStorage' | 'cache' | 'template';
    }> {
        let searchAttempts = 0;

        // 1. Tentar buscar em templates padrão
        searchAttempts++;
        const templateFunnels = [
            'default', 'template-1', 'template-2', 'quiz-basico',
            'quiz-avancado', 'funnel-vendas', 'funnel-leads'
        ];

        if (templateFunnels.includes(funnelId)) {
            return {
                exists: true,
                searchAttempts,
                dataSource: 'template',
                funnel: {
                    id: funnelId,
                    name: `Funil ${funnelId}`,
                    type: 'template',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    owner_id: 'system',
                    status: 'active',
                    is_template: true
                }
            };
        }

        // 2. Tentar localStorage (simulação - em prod seria Supabase)
        searchAttempts++;
        const localStorageKey = `funnel-${funnelId}`;
        const localData = localStorage.getItem(localStorageKey);

        if (localData) {
            try {
                const funnel = JSON.parse(localData);
                return {
                    exists: true,
                    searchAttempts,
                    dataSource: 'localStorage',
                    funnel: frontendToDb(funnel) // Padronizar para snake_case
                };
            } catch (parseError) {
                // Dados corrompidos, continuar busca
            }
        }

        // 3. Funil não encontrado
        return {
            exists: false,
            searchAttempts,
            dataSource: undefined
        };
    }

    /**
     * 🔐 VERIFICAÇÃO AVANÇADA DE PERMISSÕES
     */
    private async checkAdvancedFunnelPermissions(funnelId: string, userId?: string): Promise<FunnelPermission> {
        // Simular delay realístico
        await new Promise(resolve => setTimeout(resolve, 50));

        if (!userId) {
            // Usuário anônimo - acesso limitado a templates públicos
            const publicTemplates = ['default', 'template-1', 'template-2'];
            const hasAccess = publicTemplates.includes(funnelId);

            return {
                canRead: hasAccess,
                canWrite: false,
                canDelete: false,
                canShare: false,
                isOwner: false,
                accessLevel: hasAccess ? 'read' : 'none'
            };
        }

        // Usuário logado - lógica mais sofisticada
        // Em produção, seria consulta ao sistema de permissões do Supabase

        if (funnelId.startsWith('template-') || funnelId === 'default') {
            // Templates: somente leitura
            return {
                canRead: true,
                canWrite: false,
                canDelete: false,
                canShare: true,
                isOwner: false,
                accessLevel: 'read'
            };
        }

        // Funis próprios: acesso completo
        return {
            canRead: true,
            canWrite: true,
            canDelete: true,
            canShare: true,
            isOwner: true,
            accessLevel: 'owner'
        };
    }

    /**
     * 📋 OBTER PERMISSÕES DETALHADAS
     */
    async getFunnelPermissions(funnelId: string, userId?: string): Promise<FunnelPermission | null> {
        const validation = await this.validateFunnelAccess(funnelId, userId);

        if (!validation.isValid || validation.error) {
            return null;
        }

        return this.checkAdvancedFunnelPermissions(funnelId, userId);
    }

    /**
     * 💡 SUGESTÕES INTELIGENTES DE FUNIS
     */
    async suggestAlternativeFunnels(originalFunnelId: string, userId?: string): Promise<string[]> {
        const baseTemplates = ['default', 'template-1', 'quiz-basico'];

        // Filtrar sugestões baseadas em permissões do usuário
        const suggestions = [];

        for (const templateId of baseTemplates) {
            if (templateId !== originalFunnelId) {
                const permissions = await this.checkAdvancedFunnelPermissions(templateId, userId);
                if (permissions.canRead) {
                    suggestions.push(templateId);
                }
            }
        }

        return suggestions;
    }

    /**
     * 🧹 GERENCIAMENTO DE CACHE
     */
    clearCache(): void {
        this.cache.clear();
    }

    invalidateCache(funnelId: string, userId?: string): void {
        const cacheKey = `${funnelId}-${userId || 'anonymous'}`;
        this.cache.delete(cacheKey);
    }

    /**
     * 📊 ESTATÍSTICAS DE CACHE
     */
    getCacheStats(): { size: number; oldestEntry: Date | null; newestEntry: Date | null } {
        const entries = Array.from(this.cache.values());

        if (entries.length === 0) {
            return { size: 0, oldestEntry: null, newestEntry: null };
        }

        const timestamps = entries.map(entry => entry.timestamp);

        return {
            size: entries.length,
            oldestEntry: new Date(Math.min(...timestamps)),
            newestEntry: new Date(Math.max(...timestamps))
        };
    }
}

// Export da instância singleton migrada
export const migratedFunnelValidationService = MigratedFunnelValidationService.getInstance();

/**
 * 🪝 HOOK PARA USAR O NOVO SERVIÇO DE VALIDAÇÃO
 */
export function useMigratedFunnelValidation() {
    return {
        validateAccess: migratedFunnelValidationService.validateFunnelAccess.bind(migratedFunnelValidationService),
        getPermissions: migratedFunnelValidationService.getFunnelPermissions.bind(migratedFunnelValidationService),
        suggestAlternatives: migratedFunnelValidationService.suggestAlternativeFunnels.bind(migratedFunnelValidationService),
        clearCache: migratedFunnelValidationService.clearCache.bind(migratedFunnelValidationService),
        invalidateCache: migratedFunnelValidationService.invalidateCache.bind(migratedFunnelValidationService),
        getCacheStats: migratedFunnelValidationService.getCacheStats.bind(migratedFunnelValidationService)
    };
}

/**
 * 🔄 COMPATIBILITY LAYER - Para migração gradual
 * 
 * Permite usar a nova API com interface similar à antiga
 */
export async function legacyValidateFunnelAccess(funnelId: string, userId?: string): Promise<{
    isValid: boolean;
    exists: boolean;
    hasPermission: boolean;
    funnel?: any;
    error?: string;
    errorType?: 'NOT_FOUND' | 'NO_PERMISSION' | 'INVALID_FORMAT' | 'NETWORK_ERROR';
}> {
    const result = await migratedFunnelValidationService.validateFunnelAccess(funnelId, userId);

    // Converter novo formato para formato legado
    return {
        isValid: result.isValid,
        exists: result.exists,
        hasPermission: result.hasPermission,
        funnel: result.funnel,
        error: result.error?.message,
        errorType: mapNewErrorTypeToLegacy(result.error?.code)
    };
}

function mapNewErrorTypeToLegacy(errorCode?: string): 'NOT_FOUND' | 'NO_PERMISSION' | 'INVALID_FORMAT' | 'NETWORK_ERROR' | undefined {
    if (!errorCode) return undefined;

    switch (errorCode) {
        case 'FUNNEL_NOT_FOUND':
            return 'NOT_FOUND';
        case 'FUNNEL_ACCESS_DENIED':
            return 'NO_PERMISSION';
        case 'FUNNEL_ID_INVALID':
        case 'FUNNEL_SCHEMA_INVALID':
            return 'INVALID_FORMAT';
        case 'VALIDATION_SYSTEM_ERROR':
            return 'NETWORK_ERROR';
        default:
            return 'NETWORK_ERROR';
    }
}