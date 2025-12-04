/**
 * 🏛️ CANONICAL SERVICES - Main Export
 * 
 * 12 Services Canônicos que consolidam 108 services legados
 * 
 * ARQUITETURA:
 * - Cada service é singleton com lifecycle management
 * - Result pattern para error handling consistente
 * - Base class compartilhada (BaseCanonicalService)
 * - Event-driven communication via editorEventBus
 * 
 * SERVICES:
 * 1. CacheService      ✅ Consolidar 5 cache services
 * 2. TemplateService   🔄 Consolidar 20 template services
 * 3. DataService       🔄 Consolidar 31 data services
 * 4. AnalyticsService  🔄 Consolidar 4 analytics services
 * 5. StorageService    🔄 Consolidar 7 storage services
 * 6. AuthService       🔄 Consolidar 4 auth services
 * 7. ConfigService     🔄 Consolidar 9 config services
 * 8. ValidationService 🔄 Consolidar 5 validation services
 * 9. HistoryService    🔄 Consolidar 7 history services
 * 10. MonitoringService 🔄 Consolidar 3 monitoring services
 * 11. NotificationService 🔄 Consolidar 1 notification service
 * 12. EditorService     🔄 Consolidar 7 editor services
 */

// Base types
export * from './types';

// Canonical Services - Unified API Layer
export * from './CacheService';
export * from './TemplateService';
export * from './DataService';
export * from './ValidationService';
export * from './MonitoringService';
export * from './NotificationService';
export * from './AnalyticsService';
export * from './AuthService';
export * from './StorageService';
export * from './ConfigService';
export * from './HistoryService';
export * from './EditorService';
export * from './persistenceService';
// FunnelService - Redirecionado para o serviço canônico
// @deprecated Use import direto de '@/services'
export {
  funnelService,
  type FunnelMetadata,
} from '@/services';
export type {
  LoadFunnelResult,
  SaveFunnelResult
} from '@/services/funnel/FunnelService';
export * from './monitoring';

// TODO: Exportar quando implementados
// export { DataService, dataService } from './DataService';
// export { AnalyticsService, analyticsService } from './AnalyticsService';
// export { StorageService, storageService } from './StorageService';
// export { AuthService, authService } from './AuthService';
// export { ConfigService, configService } from './ConfigService';
// export { ValidationService, validationService } from './ValidationService';
// export { HistoryService, historyService } from './HistoryService';
// export { MonitoringService, monitoringService } from './MonitoringService';
// export { NotificationService, notificationService } from './NotificationService';
// export { EditorService, editorService } from './EditorService';
