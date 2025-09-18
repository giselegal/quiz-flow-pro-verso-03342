/**
 * 🎯 CORE FUNNEL SERVICES INDEX
 * 
 * Centralizador de todos os serviços do core de funil
 * Permite importação simplificada e controle de dependências
 */

import { TemplateService, templateService } from './TemplateService';
import { ComponentsService, componentsService } from './ComponentsService';
import { PersistenceService, persistenceService } from './PersistenceService';
import { SettingsService, settingsService } from './SettingsService';
import { LocalStorageService, localStorageService } from './LocalStorageService';
import { PublishingService, publishingService } from './PublishingService';

export { TemplateService, templateService } from './TemplateService';
export { ComponentsService, componentsService } from './ComponentsService';
export { PersistenceService, persistenceService } from './PersistenceService';
export { SettingsService, settingsService } from './SettingsService';
export { LocalStorageService, localStorageService } from './LocalStorageService';
export { PublishingService, publishingService } from './PublishingService';

export type {
    AddComponentInput,
    UpdateComponentInput,
    ComponentInstance
} from './ComponentsService';

export type {
    FunnelPersistenceData,
    SaveFunnelOptions,
    LoadFunnelOptions,
    FunnelListItem
} from './PersistenceService';

export type {
    DefaultSettingsOptions,
    SettingsValidationResult
} from './SettingsService';

export type {
    CacheOptions,
    StorageItem,
    StorageStats
} from './LocalStorageService';

export type {
    PublishOptions,
    PublishResult,
    DeploymentInfo,
    PublishingStats
} from './PublishingService';

// ============================================================================
// UNIFIED SERVICES INTERFACE
// ============================================================================

export interface FunnelCoreServices {
    templates: TemplateService;
    components: ComponentsService;
    persistence: PersistenceService;
    settings: SettingsService;
    localStorage: LocalStorageService;
    publishing: PublishingService;
}

/**
 * Instância unificada de todos os serviços
 */
export const funnelServices: FunnelCoreServices = {
    templates: templateService,
    components: componentsService,
    persistence: persistenceService,
    settings: settingsService,
    localStorage: localStorageService,
    publishing: publishingService
};

// ============================================================================
// SERVICE HEALTH CHECK
// ============================================================================

export async function checkServicesHealth(): Promise<Record<string, boolean>> {
    const health: Record<string, boolean> = {};

    try {
        // Test template service
        const templates = await templateService.getTemplates();
        health.templates = Array.isArray(templates);
    } catch (error) {
        health.templates = false;
    }

    try {
        // Test components service (basic check)
        health.components = typeof componentsService.getComponents === 'function';
    } catch (error) {
        health.components = false;
    }

    try {
        // Test persistence service (basic check)
        health.persistence = typeof persistenceService.saveFunnel === 'function';
    } catch (error) {
        health.persistence = false;
    }

    try {
        // Test settings service (basic check)
        health.settings = typeof settingsService.loadSettings === 'function';
    } catch (error) {
        health.settings = false;
    }

    try {
        // Test localStorage service (basic check)
        health.localStorage = localStorageService.isStorageAvailable();
    } catch (error) {
        health.localStorage = false;
    }

    try {
        // Test publishing service (basic check)
        health.publishing = typeof publishingService.publishFunnel === 'function';
    } catch (error) {
        health.publishing = false;
    }

    return health;
}
