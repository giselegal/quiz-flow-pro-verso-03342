/**
 * 🔐 SERVIÇO DE VALIDAÇÃO E AUTORIZAÇÃO DE FUNIS
 * 
 * Serviço responsável por:
 * - Validar existência de funis
 * - Verificar permissões de acesso
 * - Gerenciar autorização de usuário
 * - Fornecer fallbacks seguros
 */

export interface FunnelValidationResult {
    isValid: boolean;
    exists: boolean;
    hasPermission: boolean;
    funnel?: any;
    error?: string;
    errorType?: 'NOT_FOUND' | 'NO_PERMISSION' | 'INVALID_FORMAT' | 'NETWORK_ERROR';
}

export interface FunnelPermission {
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
    canShare: boolean;
    isOwner: boolean;
}

export class FunnelValidationService {
    private static instance: FunnelValidationService;
    private cache = new Map<string, { result: FunnelValidationResult; timestamp: number }>();
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

    static getInstance(): FunnelValidationService {
        if (!FunnelValidationService.instance) {
            FunnelValidationService.instance = new FunnelValidationService();
        }
        return FunnelValidationService.instance;
    }

    /**
     * Valida se um funil existe e se o usuário tem permissão para acessá-lo
     */
    async validateFunnelAccess(funnelId: string, userId?: string): Promise<FunnelValidationResult> {
        try {
            // Validação básica de formato
            if (!funnelId || typeof funnelId !== 'string') {
                return {
                    isValid: false,
                    exists: false,
                    hasPermission: false,
                    error: 'ID do funil inválido',
                    errorType: 'INVALID_FORMAT'
                };
            }

            // Verificar cache primeiro
            const cacheKey = `${funnelId}-${userId || 'anonymous'}`;
            const cached = this.cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
                return cached.result;
            }

            // Simular verificação de existência do funil
            // Em produção, isso seria uma chamada para API/Supabase
            const funnelExists = await this.checkFunnelExists(funnelId);

            if (!funnelExists.exists) {
                const result: FunnelValidationResult = {
                    isValid: false,
                    exists: false,
                    hasPermission: false,
                    error: 'Funil não encontrado',
                    errorType: 'NOT_FOUND'
                };
                this.cache.set(cacheKey, { result, timestamp: Date.now() });
                return result;
            }

            // Verificar permissões do usuário
            const permissions = await this.checkFunnelPermissions(funnelId, userId);

            if (!permissions.canRead) {
                const result: FunnelValidationResult = {
                    isValid: false,
                    exists: true,
                    hasPermission: false,
                    error: 'Sem permissão para acessar este funil',
                    errorType: 'NO_PERMISSION'
                };
                this.cache.set(cacheKey, { result, timestamp: Date.now() });
                return result;
            }

            // Sucesso - funil existe e usuário tem permissão
            const result: FunnelValidationResult = {
                isValid: true,
                exists: true,
                hasPermission: true,
                funnel: funnelExists.funnel
            };
            this.cache.set(cacheKey, { result, timestamp: Date.now() });
            return result;

        } catch (error) {
            console.error('Erro ao validar acesso ao funil:', error);
            return {
                isValid: false,
                exists: false,
                hasPermission: false,
                error: 'Erro de rede ao validar funil',
                errorType: 'NETWORK_ERROR'
            };
        }
    }

    /**
     * Verifica se um funil existe no sistema
     */
    private async checkFunnelExists(funnelId: string): Promise<{ exists: boolean; funnel?: any }> {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 100));

        // Lista de funis válidos para demonstração
        // Em produção, isso seria uma consulta ao banco de dados
        const validFunnels = [
            'default',
            'template-1',
            'template-2',
            'quiz-basico',
            'quiz-avancado',
            'funnel-vendas',
            'funnel-leads'
        ];

        if (validFunnels.includes(funnelId)) {
            return {
                exists: true,
                funnel: {
                    id: funnelId,
                    name: `Funil ${funnelId}`,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    owner_id: 'user-1',
                    status: 'active'
                }
            };
        }

        return { exists: false };
    }

    /**
     * Verifica permissões do usuário para um funil específico
     */
    private async checkFunnelPermissions(funnelId: string, userId?: string): Promise<FunnelPermission> {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 50));

        // Lógica simples de permissões para demonstração
        // Em produção, isso seria uma consulta ao sistema de permissões

        if (!userId) {
            // Usuário anônimo - apenas leitura de funis públicos
            return {
                canRead: ['default', 'template-1', 'template-2'].includes(funnelId),
                canWrite: false,
                canDelete: false,
                canShare: false,
                isOwner: false
            };
        }

        // Usuário logado - permissões completas por enquanto
        return {
            canRead: true,
            canWrite: true,
            canDelete: true,
            canShare: true,
            isOwner: true
        };
    }

    /**
     * Obtém permissões detalhadas para um funil
     */
    async getFunnelPermissions(funnelId: string, userId?: string): Promise<FunnelPermission | null> {
        const validation = await this.validateFunnelAccess(funnelId, userId);

        if (!validation.isValid) {
            return null;
        }

        return this.checkFunnelPermissions(funnelId, userId);
    }

    /**
     * Sugere funis alternativos quando um funil não é encontrado
     */
    async suggestAlternativeFunnels(originalFunnelId: string): Promise<string[]> {
        // Lógica para sugerir funis similares ou templates padrão
        const suggestions = [
            'default',
            'template-1',
            'quiz-basico'
        ];

        return suggestions.filter(id => id !== originalFunnelId);
    }

    /**
     * Limpa o cache de validação
     */
    clearCache(): void {
        this.cache.clear();
    }

    /**
     * Remove entrada específica do cache
     */
    invalidateCache(funnelId: string, userId?: string): void {
        const cacheKey = `${funnelId}-${userId || 'anonymous'}`;
        this.cache.delete(cacheKey);
    }
}

// Export da instância singleton
export const funnelValidationService = FunnelValidationService.getInstance();

// Hook para usar o serviço de validação de funil
export function useFunnelValidation() {
    return {
        validateAccess: funnelValidationService.validateFunnelAccess.bind(funnelValidationService),
        getPermissions: funnelValidationService.getFunnelPermissions.bind(funnelValidationService),
        suggestAlternatives: funnelValidationService.suggestAlternativeFunnels.bind(funnelValidationService),
        clearCache: funnelValidationService.clearCache.bind(funnelValidationService),
        invalidateCache: funnelValidationService.invalidateCache.bind(funnelValidationService)
    };
}
