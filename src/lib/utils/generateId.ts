/**
 * 🔑 Gerador de IDs únicos para blocos e steps
 * 
 * Usa nanoid para garantir unicidade global
 */

import { nanoid } from 'nanoid';

/**
 * Gera um ID único para um bloco
 * Formato: {blockType}-{nanoid}
 * @example generateBlockId('text-heading') => 'text-heading-V1StGXR8_Z5jdHi'
 */
export function generateBlockId(blockType: string): string {
  const sanitizedType = blockType.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
  return `${sanitizedType}-${nanoid(12)}`;
}

/**
 * Gera um ID único para um step
 * Formato: step-{nanoid}
 */
export function generateStepId(): string {
  return `step-${nanoid(8)}`;
}

/**
 * Gera um ID único para um quiz/funnel
 * Formato: quiz-{nanoid}
 */
export function generateQuizId(): string {
  return `quiz-${nanoid(10)}`;
}

/**
 * Verifica se um ID é válido (não vazio, não duplicado em lista)
 */
export function validateUniqueId(id: string, existingIds: string[]): boolean {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return false;
  }
  return !existingIds.includes(id);
}

/**
 * Regenera IDs duplicados em uma lista de blocos
 */
export function ensureUniqueBlockIds<T extends { id: string; type?: string }>(
  blocks: T[]
): T[] {
  const seenIds = new Set<string>();
  
  return blocks.map(block => {
    if (seenIds.has(block.id)) {
      // ID duplicado - gerar novo
      const newId = generateBlockId(block.type || 'block');
      seenIds.add(newId);
      return { ...block, id: newId };
    }
    seenIds.add(block.id);
    return block;
  });
}

/**
 * Adiciona timestamps de versão a um step
 */
export function addStepVersioning(step: any): any {
  return {
    ...step,
    version: (step.version || 0) + 1,
    lastModified: new Date().toISOString(),
    createdAt: step.createdAt || new Date().toISOString(),
  };
}
