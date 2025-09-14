/**
 * TODO: TypeScript Migration - Deadline: Janeiro 2025
 * - [ ] Adicionar interfaces para diferentes tipos de ID (componentId, funnelId, etc.)
 * - [ ] Implementar validação de formato de ID
 * - [ ] Considerar UUID v4 para maior entropia
 * - [ ] Adicionar testes unitários
 */

import { appLogger } from './logger';

export const generateId = (): string => {
  const id = Math.random().toString(36).substr(2, 9);
  appLogger.debug('Generated new ID', { id, length: id.length });
  return id;
};
