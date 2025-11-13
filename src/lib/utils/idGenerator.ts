/**
 * 🆔 ID Generator - Centralized ID Generation
 * 
 * ✅ MIGRATED: Date.now() → UUID v4 (Nov 2025)
 * Substitui geração ad-hoc com Date.now() por UUIDs v4 determinísticos.
 * 
 * @version 2.0.0
 * @status PRODUCTION-READY
 */

import { v4 as uuidv4 } from 'uuid';
import { appLogger } from './logger';

/**
 * @deprecated Use generateBlockId(), generateFunnelId(), etc. for specific types
 * Legacy function kept for backwards compatibility
 */
export const generateId = (): string => {
  const id = Math.random().toString(36).substr(2, 9);
  appLogger.warn('⚠️ [DEPRECATED] Using legacy generateId(). Use UUID-based functions instead.');
  return id;
};

/** Gera ID único para blocos: block-{uuid} */
export function generateBlockId(): string {
  return `block-${uuidv4()}`;
}

/** Gera ID único para steps customizados: step-custom-{uuid} */
export function generateCustomStepId(): string {
  return `step-custom-${uuidv4()}`;
}

/** Gera ID único para funnels: funnel-{uuid} */
export function generateFunnelId(): string {
  return `funnel-${uuidv4()}`;
}

/** Gera ID único para drafts: draft-{uuid} */
export function generateDraftId(): string {
  return `draft-${uuidv4()}`;
}

/** Gera ID único para clones: clone-{uuid} */
export function generateCloneId(): string {
  return `clone-${uuidv4()}`;
}

/** Gera ID único para sessões: session-{uuid} */
export function generateSessionId(): string {
  return `session-${uuidv4()}`;
}

/** Gera ID único para options: option-{uuid} */
export function generateOptionId(): string {
  return `option-${uuidv4()}`;
}

/** Gera ID único offline: offline_{uuid} */
export function generateOfflineId(): string {
  return `offline_${uuidv4()}`;
}

/** Gera ID único para personas: persona-{uuid} */
export function generatePersonaId(): string {
  return `persona-${uuidv4()}`;
}

/** Gera ID único para brands: brand-{uuid} */
export function generateBrandId(): string {
  return `brand-${uuidv4()}`;
}

/** Gera ID único para clients: client-{uuid} */
export function generateClientId(): string {
  return `client-${uuidv4()}`;
}

/** Gera ID único para responses: response_{uuid} */
export function generateResponseId(): string {
  return `response_${uuidv4()}`;
}

/** Gera ID único para components: comp_{uuid} */
export function generateComponentId(): string {
  return `comp_${uuidv4()}`;
}

/** Gera ID único para timer IDs com prefixo customizado */
export function generateTimerId(prefix: string): string {
  return `${prefix}-${uuidv4()}`;
}

/** Gera ID único para history entries */
export function generateHistoryId(): string {
  return uuidv4();
}

/** Gera ID único para errors: error_{uuid} */
export function generateErrorId(): string {
  return `error_${uuidv4()}`;
}

/** Gera ID único para metrics: metric_{uuid} */
export function generateMetricId(): string {
  return `metric_${uuidv4()}`;
}

/** Gera ID único para alerts: alert_{uuid} */
export function generateAlertId(): string {
  return `alert_${uuidv4()}`;
}

/** Gera ID único para notifications: notif_{uuid} */
export function generateNotificationId(): string {
  return `notif_${uuidv4()}`;
}

/** Gera ID único para chat messages: chat_{uuid} */
export function generateChatId(): string {
  return `chat_${uuidv4()}`;
}

/** Gera ID único para comments: comment_{uuid} */
export function generateCommentId(): string {
  return `comment_${uuidv4()}`;
}

/** Gera ID único para events: event_{uuid} */
export function generateEventId(): string {
  return `event_${uuidv4()}`;
}

/** Gera ID único para pages: page-{uuid} */
export function generatePageId(): string {
  return `page-${uuidv4()}`;
}

/** Gera API key único: wl_{clientId}_{uuid} */
export function generateApiKey(clientId: string): string {
  return `wl_${clientId}_${uuidv4()}`;
}

/** Gera nome de arquivo único: {userId}-{uuid}.{ext} */
export function generateFileName(userId: string, extension: string): string {
  return `${userId}-${uuidv4()}.${extension}`;
}

/** Valida se ID tem formato UUID válido */
export function isValidGeneratedId(id: string): boolean {
  const parts = id.split('-');
  if (parts.length < 5) return false;
  const uuidPart = parts.slice(1).join('-');
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuidPart);
}
