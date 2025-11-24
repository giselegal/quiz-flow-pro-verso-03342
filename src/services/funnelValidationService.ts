/**
 * ⚠️ LEGACY ADAPTER - Redirects to canonical ValidationService
 * 
 * 🔐 SERVIÇO DE VALIDAÇÃO E AUTORIZAÇÃO DE FUNIS
 * 
 * Este serviço foi consolidado em `ValidationService` canônico.
 * 
 * @deprecated Use `validationService` from '@/services/canonical/ValidationService' instead
 * 
 * Migration guide:
 * - funnelValidationService.validateFunnelAccess(id, userId) → validationService.validateFunnelAccess(id, userId)
 * - funnelValidationService.getFunnelPermissions(id, userId) → validationService.checkFunnelPermissions(funnel, userId)
 */

import { validationService } from '@/services/canonical/ValidationService';
import type { FunnelValidationResult as CanonicalFunnelValidationResult, FunnelPermission as CanonicalFunnelPermission } from '@/services/canonical/ValidationService';

// Re-export types from canonical
export type FunnelValidationResult = CanonicalFunnelValidationResult;
export type FunnelPermission = CanonicalFunnelPermission;

export class FunnelValidationService {
    private static instance: FunnelValidationService;

    static getInstance(): FunnelValidationService {
        if (!FunnelValidationService.instance) {
            FunnelValidationService.instance = new FunnelValidationService();
        }
        return FunnelValidationService.instance;
    }

    /**
     * Valida se um funil existe e se o usuário tem permissão para acessá-lo
     * @deprecated Use validationService.validateFunnelAccess() instead
     */
    async validateFunnelAccess(funnelId: string, userId?: string): Promise<FunnelValidationResult> {
        const result = await validationService.validateFunnelAccess(funnelId, userId);
        return result.success ? result.data : {
            isValid: false,
            exists: false,
            hasPermission: false,
            error: result.error?.message || 'Erro ao validar funil',
            errorType: 'NETWORK_ERROR',
        };
    }

    /**
     * Verifica permissões do usuário sobre um funil
     * @deprecated Use validationService.checkFunnelPermissions() instead
     */
    async getFunnelPermissions(funnelId: string, userId?: string): Promise<FunnelPermission> {
        const validation = await this.validateFunnelAccess(funnelId, userId);
        
        if (!validation.isValid || !validation.funnel) {
            return {
                canRead: false,
                canWrite: false,
                canDelete: false,
                canShare: false,
                isOwner: false,
            };
        }

        return validationService.checkFunnelPermissions(validation.funnel, userId);
    }

    /**
     * Sugere funis alternativos
     * @deprecated Simple stub - use template discovery in canonical service
     */
    async suggestAlternativeFunnels(originalFunnelId: string): Promise<string[]> {
        return ['default', 'template-1', 'quiz-basico'].filter(id => id !== originalFunnelId);
    }

    /**
     * Limpa o cache de validação
     * @deprecated Cache is managed by canonical ValidationService
     */
    clearCache(): void {
        console.warn('[funnelValidationService.clearCache] Deprecated - cache managed by canonical ValidationService');
    }

    /**
     * Remove entrada específica do cache
     * @deprecated Cache is managed by canonical ValidationService
     */
    invalidateCache(funnelId: string, userId?: string): void {
        console.warn('[funnelValidationService.invalidateCache] Deprecated - cache managed by canonical ValidationService');
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
        invalidateCache: funnelValidationService.invalidateCache.bind(funnelValidationService),
    };
}
