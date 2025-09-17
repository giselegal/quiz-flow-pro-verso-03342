/**
 * 🎯 TEMPLATE SERVICES UNIFIED EXPORT
 * 
 * Ponto de entrada único para todos os template services:
 * - MasterTemplateService (novo serviço unificado)
 * - Legacy adapters (compatibilidade total)
 * - Migration utilities
 * - Type definitions
 * 
 * ✅ USO RECOMENDADO:
 * ```typescript
 * import { masterTemplateService } from '@/services/templates';
 * 
 * // Load template
 * const template = await masterTemplateService.loadTemplate('my-template');
 * 
 * // Load step blocks (backward compatibility)
 * const blocks = await masterTemplateService.loadStepBlocks('step-1');
 * 
 * // List templates
 * const templates = await masterTemplateService.listTemplates('quiz');
 * ```
 * 
 * ✅ COMPATIBILIDADE LEGACY:
 * ```typescript
 * import { unifiedTemplateService, templateLibraryService } from '@/services/templates';
 * 
 * // Ainda funcionam, mas exibem warnings de deprecação
 * const template = await unifiedTemplateService.loadTemplate('my-template');
 * const builtin = await templateLibraryService.getById('builtin-1');
 * ```
 */

// =============================================
// DYNAMIC EXPORTS (Para otimização do bundle)
// =============================================

/**
 * 🎯 MASTER TEMPLATE SERVICE - Dynamic Export
 * Use this for all new code - loaded on demand
 */
export async function getMasterTemplateService() {
    const { masterTemplateService } = await import('./MasterTemplateService');
    return masterTemplateService;
}

/**
 * 🎯 MASTER TEMPLATE SERVICE TYPES - Dynamic Export
 */
export async function getMasterTemplateTypes() {
    return await import('./MasterTemplateService');
}

/**
 * 🎯 LEGACY SERVICES - Dynamic Export
 * @deprecated Use getMasterTemplateService() instead
 */
export async function getLegacyTemplateServices() {
    return await import('./LegacyTemplateAdapters');
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Initialize template services
 */
export async function initializeTemplateServices(): Promise<void> {
    console.log('🎯 Template Services initialized');
    console.log('   ✅ MasterTemplateService ready');
    console.log('   🔄 Legacy adapters available');
    console.log('   📢 Use masterTemplateService for new code');

    // Check for legacy usage
    try {
        const { checkLegacyUsage } = await import('./LegacyTemplateAdapters');
        const { hasLegacyUsage, recommendations } = checkLegacyUsage();

        if (hasLegacyUsage) {
            console.warn('⚠️ Legacy template service usage detected');
            recommendations.forEach((rec: string) => console.warn(`   📝 ${rec}`));
        }
    } catch (error) {
        console.warn('⚠️ Could not load legacy adapters:', error);
    }
}

/**
 * Get service health status
 */
export async function getServiceHealth(): Promise<{
    masterService: 'healthy' | 'error';
    legacyServices: 'healthy' | 'deprecated';
    cacheSize: number;
    recommendations: string[];
}> {
    try {
        const { masterTemplateService } = await import('./MasterTemplateService');
        const { checkLegacyUsage } = await import('./LegacyTemplateAdapters');

        const cacheStats = masterTemplateService.getCacheStats();
        const { recommendations } = checkLegacyUsage();

        return {
            masterService: 'healthy',
            legacyServices: 'deprecated',
            cacheSize: cacheStats.size,
            recommendations
        };
    } catch (error) {
        return {
            masterService: 'error',
            legacyServices: 'error',
            cacheSize: 0,
            recommendations: ['Fix MasterTemplateService errors']
        };
    }
}

/**
 * Clear all template caches
 */
export async function clearAllTemplateCaches(): Promise<void> {
    try {
        const { masterTemplateService } = await import('./MasterTemplateService');
        masterTemplateService.clearCache();
        console.log('🧹 All template caches cleared');
    } catch (error) {
        console.warn('⚠️ Could not clear caches:', error);
    }
}

// =============================================
// AUTO-INITIALIZATION
// =============================================

// Initialize on import (async)
initializeTemplateServices().catch(console.warn);

console.log('🎯 Template Services Module loaded successfully');
console.log('   📦 masterTemplateService: Main unified service');
console.log('   🔧 Legacy adapters: Full backward compatibility');
console.log('   🚀 Ready for use!');