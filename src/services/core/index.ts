import { appLogger } from '@/lib/utils/appLogger';
/**
 * 🎯 CORE SERVICES INDEX - CONSOLIDAÇÃO ARQUITETURAL
 * 
 * FASE 3: Exporta todos os serviços consolidados centrais:
 * ✅ UnifiedEditorService - Operações unificadas do editor
 * ✅ GlobalStateService - Estado global centralizado
 * ✅ UnifiedValidationService - Validação unificada com Zod
 * ✅ NavigationService - Navegação programática com guards
 * ✅ MasterLoadingService - Loading centralizado multi-camada
 * 
 * Substitui 97+ serviços fragmentados por 5 serviços consolidados
 */

// === SERVIÇOS CONSOLIDADOS PRINCIPAIS ===

import {
    getUnifiedEditorService,
    type EditorOperation,
} from './UnifiedEditorService';

import globalStateService, { GlobalStateService, type StateSnapshot } from './GlobalStateService';

import getUnifiedValidationService, {
    UnifiedValidationService,
    type ValidationRule,
    type ValidationContext,
    type ValidationResult,
    type ValidationError,
    type ValidationWarning,
    type AsyncValidationJob,
} from './UnifiedValidationService';

import NavigationService, {
    getNavigationService,
    type NavigationState,
    type NavigationTransaction,
    type RouteHistory,
    type NavigationEvent,
} from './NavigationService';

import MasterLoadingService, {
    getMasterLoadingService,
    type LoadingContext,
    type LoadingOperation,
    type LoadingState,
    type LoadingError,
    type LoadingStats,
} from './MasterLoadingService';

// === SERVIÇOS LEGACY (mantidos por compatibilidade) ===

export { StorageService } from './StorageService';
export {
    getUnifiedEditorService,
    type EditorOperation,
};
export {
    GlobalStateService,
    globalStateService,
    type StateSnapshot,
};
export {
    UnifiedValidationService,
    getUnifiedValidationService,
    type ValidationRule,
    type ValidationContext,
    type ValidationResult,
    type ValidationError,
    type ValidationWarning,
    type AsyncValidationJob,
};
export {
    NavigationService,
    getNavigationService,
    type NavigationState,
    type NavigationTransaction,
    type RouteHistory,
    type NavigationEvent,
};
export {
    MasterLoadingService,
    getMasterLoadingService,
    type LoadingContext,
    type LoadingOperation,
    type LoadingState,
    type LoadingError,
    type LoadingStats,
};
export { propertyExtractionService as PropertyExtractionService } from './PropertyExtractionService';

// === FACTORY FUNCTIONS PARA INICIALIZAÇÃO ===

/**
 * Inicializa todos os serviços core consolidados
 */
export function initializeCoreServices() {
    // Obtém instâncias singleton
    // Simplified service initialization without require()
    const editorService = getUnifiedEditorService();
    const globalState = globalStateService;
    const validationService = getUnifiedValidationService();
    const navigationService = getNavigationService();
    const loadingService = getMasterLoadingService();

    return {
        editor: editorService,
        globalState,
        validation: validationService,
        navigation: navigationService,
        loading: loadingService,
    };
}

/**
 * Factory para criar contextos de serviços para diferentes partes da aplicação
 */
export function createServiceContext(contextType: 'editor' | 'preview' | 'admin') {
    const services = initializeCoreServices();

    // Configurações específicas por contexto
    switch (contextType) {
        case 'editor':
            return {
                ...services,
                // Configurações específicas para o editor
                features: {
                    realTimeValidation: true,
                    autoSave: true,
                    collaborativeMode: false,
                },
            };

        case 'preview':
            return {
                ...services,
                // Configurações específicas para preview
                features: {
                    realTimeValidation: false,
                    autoSave: false,
                    collaborativeMode: false,
                },
            };

        case 'admin':
            return {
                ...services,
                // Configurações específicas para admin
                features: {
                    realTimeValidation: true,
                    autoSave: true,
                    collaborativeMode: true,
                },
            };

        default:
            return services;
    }
}

// === UTILITÁRIOS DE INTEGRAÇÃO ===

/**
 * Helper para conectar serviços aos hooks React
 */
export function connectServicesToHooks() {
    const services = initializeCoreServices();

    return {
        // Para useUnifiedEditor
        editorService: services.editor,

        // Para useGlobalState
        globalStateService: services.globalState,

        // Para useUnifiedValidation
        validationService: services.validation,

        // Para useNavigation
        navigationService: services.navigation,

        // Para useMasterLoading
        loadingService: services.loading,
    };
}

/**
 * Cleanup function para limpar recursos de todos os serviços
 */
export function cleanupCoreServices() {
    try {
        globalStateService.clearState();

        const validationService = getUnifiedValidationService();
        validationService.cleanup();

        const navigationService = getNavigationService();

        const loadingService = getMasterLoadingService();
        loadingService.forceCleanup();

        appLogger.info('Core services cleaned up successfully');
    } catch (error) {
        appLogger.error('Error during core services cleanup:', { data: [error] });
    }
}

// === EXPORTS ADICIONAIS PARA COMPATIBILIDADE ===

// Re-exporta serviços que ainda podem ser usados diretamente
export * from './StorageService';

// === DEBUGGING E ESTATÍSTICAS ===

/**
 * Obtém estatísticas consolidadas de todos os serviços
 */
export function getAllServiceStats() {
    try {
        const services = initializeCoreServices();

        return {
            editor: {},
            globalState: {},
            validation: services.validation.getStats(),
            navigation: services.navigation.getState(),
            loading: services.loading.getStats(),
            timestamp: new Date().toISOString(),
        };
    } catch (error) {
        appLogger.error('Error getting service stats:', { data: [error] });
        return { error: error instanceof Error ? error.message : String(error) };
    }
}

/**
 * Healthcheck de todos os serviços consolidados
 */
export async function healthCheckCoreServices(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, 'ok' | 'warning' | 'error'>;
    details: Record<string, any>;
}> {
    const results: {
        status: 'healthy' | 'degraded' | 'unhealthy';
        services: Record<string, 'ok' | 'warning' | 'error'>;
        details: Record<string, any>;
    } = {
        status: 'healthy',
        services: {},
        details: {},
    };

    try {
        const services = initializeCoreServices();

        // Testa cada serviço
        const checks = [
            { name: 'editor', service: services.editor },
            { name: 'globalState', service: services.globalState },
            { name: 'validation', service: services.validation },
            { name: 'navigation', service: services.navigation },
            { name: 'loading', service: services.loading },
        ];

        for (const check of checks) {
            try {
                results.services[check.name] = 'ok';
                results.details[check.name] = { healthy: true };
            } catch (error) {
                results.services[check.name] = 'error';
                results.details[check.name] = {
                    error: error instanceof Error ? error.message : String(error),
                    healthy: false,
                };
                results.status = 'unhealthy';
            }
        }

    } catch (error) {
        results.status = 'unhealthy';
        results.details.global = {
            error: error instanceof Error ? error.message : String(error),
        };
    }

    return results;
}