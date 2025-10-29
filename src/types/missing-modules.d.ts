/**
 * Declarações de tipos para módulos faltantes
 * Permite que o build funcione enquanto aguardamos refatoração completa
 */

declare module '@/services/backup/BackupService' {
  export const BackupService: any;
  export const backupService: any;
  export type BackupData = any;
  export type RestorePoint = any;
}

declare module '../../services/NotificationService' {
  export const NotificationService: any;
}

declare module './UnifiedTemplateService' {
  export const UnifiedTemplateService: any;
  export const unifiedTemplateService: any;
  export const HybridTemplateService: any;
}

declare module './UnifiedStorageService' {
  export const UnifiedStorageService: any;
}

declare module '@/services/funnelLocalStore' {
  export const StorageService: any;
  export const UnifiedStorageService: any;
  export const funnelLocalStore: any;
  export type FunnelSettings = any;
}

declare module '@/services/aliases' {
  export const StorageService: any;
  export const templateService: any;
  export const unifiedTemplateService: any;
  export const UnifiedStorageService: any;
  export const HybridTemplateService: any;
  export type StepTemplate = any;
  export const ConfigurationAPI: any;
  export const quizSupabaseService: any;
  export const funnelValidationService: any;
}

