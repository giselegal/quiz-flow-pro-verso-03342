/**
 * 🎯 LOADING HOOKS UNIFIED EXPORT
 * 
 * Ponto de entrada único para todos os loading hooks:
 * - MasterLoadingService (novo serviço unificado)
 * - Legacy adapters (compatibilidade total)
 * - Migration utilities
 * - Type definitions
 * 
 * ✅ USO RECOMENDADO:
 * ```typescript
 * import { masterLoadingService } from '@/hooks/loading';
 * 
 * // Global loading
 * masterLoadingService.setGlobalLoading(true, 'Carregando...', 50);
 * 
 * // Component loading
 * const manager = masterLoadingService.createComponentManager('my-component');
 * manager.setLoading(true);
 * 
 * // Progress tracking
 * masterLoadingService.setGlobalProgress(75, 'Quase pronto...');
 * ```
 * 
 * ✅ COMPATIBILIDADE LEGACY:
 * ```typescript
 * import { useLoadingState, useGlobalLoading } from '@/hooks/loading';
 * 
 * // Ainda funcionam, mas exibem warnings de deprecação
 * const { isLoading, setLoading } = useLoadingState();
 * const { state, setLoading } = useGlobalLoading();
 * ```
 */

// =============================================
// MASTER SERVICE (RECOMENDADO)
// =============================================
import {
    masterLoadingService,
    MasterLoadingService,
    MasterLoadingProvider,
    type UnifiedLoadingState,
    type LoadingCategory,
    type LoadingPriority,
    type LoadingOptions,
    type LoadingManager
} from './MasterLoadingService';

export {
    masterLoadingService,
    MasterLoadingService,
    MasterLoadingProvider,
    type UnifiedLoadingState,
    type LoadingCategory,
    type LoadingPriority,
    type LoadingOptions,
    type LoadingManager
};

// =============================================
// LEGACY HOOKS (COMPATIBILIDADE)
// =============================================
export {
    // Legacy hooks
    useLoadingState,
    useGlobalLoading,
    useFunnelLoadingState,

    // Legacy providers
    GlobalLoadingProvider,

    // Legacy interfaces
    type FunnelLoadingState,

    // Migration utilities
    checkLegacyLoadingUsage,
    migrateLegacyLoadingStates
} from './LegacyLoadingAdapters';

// =============================================
// CONVENIENCE EXPORTS
// =============================================

/**
 * 🎯 QUICK ACCESS - Master Loading Service
 * Use this for all new code
 */
export const loadingService = masterLoadingService;

/**
 * 🎯 HOOKS SHORTCUTS
 * @deprecated Use masterLoadingService methods instead
 */
export {
    useLoadingState as useLocalLoading,
    useGlobalLoading as useGlobal,
    useFunnelLoadingState as useFunnel
} from './LegacyLoadingAdapters';

// =============================================
// UTILITY FUNCTIONS
// =============================================

import { checkLegacyLoadingUsage } from './LegacyLoadingAdapters';

/**
 * Initialize loading services
 */
export function initializeLoadingServices(): void {
    console.log('🎯 Loading Services initialized');
    console.log('   ✅ MasterLoadingService ready');
    console.log('   🔄 Legacy adapters available');
    console.log('   📢 Use masterLoadingService for new code');

    // Check for legacy usage
    const { hasLegacyUsage, recommendations } = checkLegacyLoadingUsage();

    if (hasLegacyUsage) {
        console.warn('⚠️ Legacy loading hook usage detected');
        recommendations.forEach((rec: string) => console.warn(`   📝 ${rec}`));
    }
}

/**
 * Get loading service health status
 */
export async function getGlobalLoadingState(): Promise<{
    isLoading: boolean;
    message?: string;
    progress?: number;
    errors: string[];
    warnings: string[];
}> {
    try {
        // Use dynamic import instead of require
        const masterLoadingService = (await import('./MasterLoadingService')).masterLoadingService;
        const currentState = masterLoadingService.getCurrentState();
        const allStates = masterLoadingService.getAllComponentStates();

        // Calcular estado global
        const hasActiveLoadings = Array.from(allStates.values())
            .some(state => (state as any)?.isLoading);

        return {
            isLoading: currentState.isLoading || hasActiveLoadings,
            message: currentState.message,
            progress: currentState.progress,
            errors: currentState.error ? [currentState.error] : [],
            warnings: []
        };
    } catch (error) {
        console.warn('Failed to get global loading state:', error);
        return {
            isLoading: false,
            errors: [],
            warnings: []
        };
    }
}

/**
 * Clear all loading states
 */
export async function clearAllLoadingStates(): Promise<void> {
    const masterLoadingService = await import('./MasterLoadingService').then(m => m.masterLoadingService);
    masterLoadingService.clearAllStates();
    console.log('🧹 All loading states cleared');
}

/**
 * Reset loading performance metrics
 */
export async function resetLoadingMetrics(): Promise<void> {
    const masterLoadingService = await import('./MasterLoadingService').then(m => m.masterLoadingService);
    masterLoadingService.resetPerformanceMetrics();
    console.log('📊 Loading performance metrics reset');
}

/**
 * Get loading performance summary
 */
export async function getLoadingPerformanceSummary(): Promise<{
    totalLoadings: number;
    averageLoadingTime: number;
    errorCount: number;
    longestLoadingTime: number;
    currentActiveLoadings: number;
}> {
    const masterLoadingService = await import('./MasterLoadingService').then(m => m.masterLoadingService);
    const metrics = masterLoadingService.getPerformanceMetrics();
    const allStates = masterLoadingService.getAllComponentStates();
    const currentActiveLoadings = Array.from(allStates.values()).filter((s: any) => s.isLoading).length;

    return {
        ...metrics,
        currentActiveLoadings
    };
}

// =============================================
// AUTO-INITIALIZATION
// =============================================

// Initialize on import
initializeLoadingServices();

console.log('🎯 Loading Hooks Module loaded successfully');
console.log('   📦 masterLoadingService: Main unified service');
console.log('   🔧 Legacy adapters: Full backward compatibility');
console.log('   🚀 Ready for use!');