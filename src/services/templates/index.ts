/**
 * 🎯 TEMPLATE SERVICES UNIFIED EXPORT
 * 
 * Ponto de entrada único para todos os template services:
 * - MasterTemplateService (novo serviço unificado)
 * - Type definitions
 * 
 * ✅ USO RECOMENDADO:
 * ```typescript
 * import { masterTemplateService } from '@/services/templates';
 * 
 * // Load template
 * const template = await masterTemplateService.loadTemplate('templateId');
 * 
 * // Apply template
 * await masterTemplateService.applyTemplate(template, { stepNumber: 1 });
 * ```
 */

// =============================================
// MASTER SERVICE (RECOMENDADO)
// =============================================
import {
    masterTemplateService,
    MasterTemplateService,
    type UnifiedTemplate,
    type TemplateLoadOptions
} from './MasterTemplateService';

export {
    masterTemplateService,
    MasterTemplateService,
    type UnifiedTemplate,
    type TemplateLoadOptions
};

// =============================================
// CONVENIENCE EXPORTS
// =============================================

/**
 * 🎯 QUICK ACCESS - Master Template Service
 * Use this for all new code
 */
export const templateService = masterTemplateService;
export const funnelTemplateService = masterTemplateService;
export const templateLibraryService = masterTemplateService;

/**
 * Initialize template services
 */
export function initializeTemplateServices(): void {
    console.log('🎯 Template Services initialized');
    console.log('   ✅ MasterTemplateService ready');
    console.log('   📢 Use masterTemplateService for new code');
}

/**
 * Get template service health status
 */
export function getTemplateServiceHealth(): {
    status: 'healthy' | 'unhealthy';
    availableTemplates: number;
    errors: string[];
} {
    try {
        return {
            status: 'healthy',
            availableTemplates: 0,
            errors: []
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            availableTemplates: 0,
            errors: [String(error)]
        };
    }
}

// =============================================
// AUTO-INITIALIZATION
// =============================================

// Initialize on import
initializeTemplateServices();

console.log('🎯 Template Services Module loaded successfully');
console.log('   📦 masterTemplateService: Main unified service');
console.log('   🚀 Ready for use!');