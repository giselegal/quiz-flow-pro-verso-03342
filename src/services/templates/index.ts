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
// MASTER SERVICE (RECOMENDADO)
// =============================================
export {
    masterTemplateService,
    MasterTemplateService,
    type UnifiedTemplate,
    type TemplateStep,
    type TemplateSource,
    type TemplateLoadOptions,
    type TemplateContext
} from './MasterTemplateService';

// =============================================
// LEGACY SERVICES (COMPATIBILIDADE)
// =============================================
export {
    // Legacy service adapters
    unifiedTemplateService,
    templateLibraryService,
    funnelTemplateService,
    contextualFunnelService,
    funnelComponentsService,
    funnelDataMigration,
    funnelUnifiedService,

    // Adapter classes (para casos avançados)
    UnifiedTemplateServiceAdapter,
    TemplateLibraryServiceAdapter,
    FunnelTemplateServiceAdapter,
    ContextualFunnelServiceAdapter,
    FunnelComponentsServiceAdapter,
    FunnelDataMigrationAdapter,
    FunnelUnifiedServiceAdapter,

    // Migration utilities
    checkLegacyUsage,
    migrateExistingTemplates,

    // Legacy type exports
    type ContextualFunnelData,
    type FunnelTemplate
} from './LegacyTemplateAdapters';

// =============================================
// CONVENIENCE EXPORTS
// =============================================

/**
 * 🎯 QUICK ACCESS - Master Template Service
 * Use this for all new code
 */
export { masterTemplateService as templateService } from './MasterTemplateService';

/**
 * 🎯 LEGACY SHORTCUTS
 * @deprecated Use masterTemplateService instead
 */
export {
    unifiedTemplateService as templateUnified,
    templateLibraryService as templateLibrary,
    funnelTemplateService as templateFunnel,
    contextualFunnelService as templateContextual,
    funnelComponentsService as templateComponents
} from './LegacyTemplateAdapters';

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
            legacyServices: 'deprecated' as const,
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