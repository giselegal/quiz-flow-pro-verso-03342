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

/** Valida se ID tem formato UUID válido */
export function isValidGeneratedId(id: string): boolean {
  const parts = id.split('-');
  if (parts.length < 5) return false;
  const uuidPart = parts.slice(1).join('-');
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuidPart);
}
