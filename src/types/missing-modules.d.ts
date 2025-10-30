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

// Shims para módulos de passos modulares ausentes em ambientes de checagem
declare module '@/components/core/quiz-modular/ModularIntroStep' {
  const Component: any;
  export default Component;
}

// Shims relativos usados por testes de autoload (arquivos podem estar arquivados/pendentes)
declare module '../ModularTransitionStep' {
  const Component: any;
  export default Component;
}
declare module '../ModularResultStep' {
  const Component: any;
  export default Component;
}
declare module '../ModularIntroStep' {
  const Component: any;
  export default Component;
}
declare module '../ModularQuestionStep' {
  const Component: any;
  export default Component;
}
declare module '../ModularStrategicQuestionStep' {
  const Component: any;
  export default Component;
}

