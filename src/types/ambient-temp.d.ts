/**
 * Arquivo de declarações temporárias para desbloquear build (FASE 0).
 * TODO: Remover após consolidação de tipos (Plano Fase 2).
 */

declare type BlockComponentProps = any;
declare type PropertyConfig = any;
declare type StepTemplate = any;
declare type ConfigurationAPI = any;
declare type WhatsAppBusinessAPI = any;
declare type RecoveryAnalytics = any;
declare type UnifiedFunnel = any;
declare type HotmartWebhookData = any;
declare type TemplateDraftShared = any;
declare type ComponentCategories = any;
declare type ComponentType = any;
declare type PageConfig = any;
declare type HybridFunnelData = any;
declare type Testimonial = any;

// Merge de Block para permitir 'content' opcional
interface Block { content?: Record<string, any>; [key: string]: any; }

// Variáveis globais usadas em testes sem import explícito
declare const funnelLocalStore: any;

// Hook legado referenciado em export incorreto
declare function useWhatsAppCartRecovery(): any;
