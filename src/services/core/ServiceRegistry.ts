/**
 * 🎯 SERVICE REGISTRY - REGISTRO ÚNICO DE SERVICES ATIVOS
 * 
 * Registry que substitui 77 services fragmentados por 12 services essenciais
 * organizados por domínio e responsabilidade
 */

import { serviceManager } from './UnifiedServiceManager';
import { consolidatedTemplateService } from './ConsolidatedTemplateService';
import { consolidatedFunnelService } from './ConsolidatedFunnelService';

// ============================================================================
// ESSENTIAL SERVICES (12 CORE SERVICES)
// ============================================================================

export const ESSENTIAL_SERVICES = {
  // 1. Template Management
  TEMPLATE: 'ConsolidatedTemplateService',
  
  // 2. Funnel Management  
  FUNNEL: 'ConsolidatedFunnelService',
  
  // 3. Analytics & Monitoring
  ANALYTICS: 'ConsolidatedAnalyticsService',
  
  // 4. Storage & Persistence
  STORAGE: 'ConsolidatedStorageService',
  
  // 5. Authentication & Users
  AUTH: 'ConsolidatedAuthService',
  
  // 6. Media & Assets
  MEDIA: 'ConsolidatedMediaService',
  
  // 7. Validation & Rules
  VALIDATION: 'ConsolidatedValidationService',
  
  // 8. Navigation & Routing
  NAVIGATION: 'ConsolidatedNavigationService',
  
  // 9. Configuration & Settings
  CONFIG: 'ConsolidatedConfigService',
  
  // 10. Notifications & Events
  EVENTS: 'ConsolidatedEventsService',
  
  // 11. Performance & Optimization
  PERFORMANCE: 'ConsolidatedPerformanceService',
  
  // 12. Development & Debug
  DEBUG: 'ConsolidatedDebugService'
} as const;

// ============================================================================
// DEPRECATED SERVICES (TO BE REMOVED)
// ============================================================================

export const DEPRECATED_SERVICES = [
  // Template services (replaced by ConsolidatedTemplateService)
  'UnifiedTemplateService',
  'HybridTemplateService', 
  'TemplateFunnelService',
  'templateService',
  'stepTemplateService',
  'customTemplateService',
  'templateLibraryService',
  'ScalableHybridTemplateService',
  
  // Funnel services (replaced by ConsolidatedFunnelService)
  'FunnelUnifiedService',
  'FunnelUnifiedServiceV2',
  'EnhancedFunnelService',
  'contextualFunnelService',
  'migratedContextualFunnelService',
  'funnelService',
  'improvedFunnelSystem',
  'correctedSchemaDrivenFunnelService',
  'schemaDrivenFunnelService',
  
  // Analytics services (to be consolidated)
  'analyticsService',
  'analyticsEngine',
  'unifiedAnalytics',
  'realTimeAnalytics',
  'compatibleAnalytics',
  'simpleAnalytics',
  
  // Storage services (to be consolidated)  
  'AdvancedFunnelStorage',
  'UnifiedBlockStorageService',
  'funnelLocalStore',
  'migratedFunnelLocalStore',
  'resultPageStorage',
  
  // Other fragmented services
  'ComponentsService',
  'PropertyExtractionService',
  'ConfigurationService',
  'MonitoringService',
  'MigrationService',
  'mediaUploadService',
  'publishService',
  'reportService',
  'versioningService'
] as const;

// ============================================================================
// SERVICE REGISTRY CLASS
// ============================================================================

export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private migrationLog: string[] = [];

  private constructor() {}

  static getInstance(): ServiceRegistry {
    if (!this.instance) {
      this.instance = new ServiceRegistry();
    }
    return this.instance;
  }

  /**
   * 🚀 INITIALIZE ESSENTIAL SERVICES
   */
  async initializeEssentialServices(): Promise<void> {
    console.log('🚀 Initializing essential services...');
    
    try {
      // Register consolidated services
      serviceManager.registerService(consolidatedTemplateService);
      serviceManager.registerService(consolidatedFunnelService);
      
      // Preload critical templates
      await consolidatedTemplateService.preloadCriticalTemplates();
      
      // Health check all services
      const healthResults = await serviceManager.healthCheckAll();
      const healthyServices = Object.entries(healthResults)
        .filter(([_, healthy]) => healthy)
        .map(([name]) => name);
      
      console.log('✅ Essential services initialized:', healthyServices);
      
      this.logMigration(`Essential services initialized: ${healthyServices.length}/2 healthy`);
      
    } catch (error) {
      console.error('❌ Failed to initialize essential services:', error);
      this.logMigration(`Failed to initialize: ${error}`);
      throw error;
    }
  }

  /**
   * 🧹 DEPRECATE OLD SERVICES
   */
  deprecateOldServices(): void {
    console.log('🧹 Deprecating old services...');
    
    let deprecatedCount = 0;
    
    for (const serviceName of DEPRECATED_SERVICES) {
      try {
        // Mark as deprecated in global scope
        if (typeof window !== 'undefined') {
          (window as any)[`__DEPRECATED_${serviceName}`] = true;
        }
        
        deprecatedCount++;
        this.logMigration(`Deprecated: ${serviceName}`);
        
      } catch (error) {
        console.warn(`⚠️ Failed to deprecate ${serviceName}:`, error);
      }
    }
    
    console.log(`✅ Deprecated ${deprecatedCount}/${DEPRECATED_SERVICES.length} services`);
  }

  /**
   * 📊 GET MIGRATION STATUS
   */
  getMigrationStatus(): {
    essential: number;
    deprecated: number;
    performance: any;
    log: string[];
  } {
    const performance = serviceManager.getPerformanceSummary();
    
    return {
      essential: Object.keys(ESSENTIAL_SERVICES).length,
      deprecated: DEPRECATED_SERVICES.length,
      performance,
      log: this.migrationLog
    };
  }

  /**
   * 🔍 CHECK SERVICE HEALTH
   */
  async checkServiceHealth(): Promise<Record<string, boolean>> {
    return await serviceManager.healthCheckAll();
  }

  /**
   * 📈 GET PERFORMANCE METRICS
   */
  getPerformanceMetrics(): any {
    return {
      serviceManager: serviceManager.getPerformanceSummary(),
      templates: consolidatedTemplateService.getCacheStats(),
      funnels: consolidatedFunnelService.getCacheStats()
    };
  }

  /**
   * 📝 PRIVATE HELPERS
   */
  private logMigration(message: string): void {
    const timestamp = new Date().toISOString();
    this.migrationLog.push(`[${timestamp}] ${message}`);
    
    // Keep only last 100 log entries
    if (this.migrationLog.length > 100) {
      this.migrationLog = this.migrationLog.slice(-100);
    }
  }

  /**
   * 🧪 DEVELOPMENT HELPERS
   */
  getDevelopmentInfo(): any {
    if (process.env.NODE_ENV !== 'development') {
      return { message: 'Available only in development mode' };
    }

    return {
      essentialServices: ESSENTIAL_SERVICES,
      deprecatedServices: DEPRECATED_SERVICES,
      migrationLog: this.migrationLog,
      performance: this.getPerformanceMetrics(),
      registeredServices: Array.from(serviceManager['services'].keys())
    };
  }
}

// ============================================================================
// EXPORT SINGLETON & AUTO-INITIALIZE
// ============================================================================

export const serviceRegistry = ServiceRegistry.getInstance();

// Auto-initialize in browser
if (typeof window !== 'undefined') {
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      serviceRegistry.initializeEssentialServices().catch(console.error);
      serviceRegistry.deprecateOldServices();
    });
  } else {
    // DOM already ready
    setTimeout(() => {
      serviceRegistry.initializeEssentialServices().catch(console.error);
      serviceRegistry.deprecateOldServices();
    }, 100);
  }
}

export default serviceRegistry;
