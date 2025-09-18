/**
 * 🔑 SISTEMA PADRONIZADO DE IDs ÚNICOS
 * 
 * Resolve conflitos entre etapas 2-21 gerando IDs únicos e consistentes
 */

export interface IdContext {
  stepNumber?: number | string;
  blockId?: string;
  type?: 'block' | 'dropzone' | 'slot';
  position?: number;
}

/**
 * Gera ID único baseado em contexto para evitar colisões DnD
 */
export const generateUniqueId = (context: IdContext): string => {
  const {
    stepNumber = 'default',
    blockId,
    type = 'block',
    position
  } = context;

  const step = String(stepNumber);
  
  switch (type) {
    case 'block':
      return `dnd-block-${step}-${blockId}`;
    case 'dropzone':
      return `canvas-drop-zone-${step}`;
    case 'slot':
      return `drop-zone-${step}-${position}`;
    default:
      return `${type}-${step}-${blockId || position || 'unknown'}`;
  }
};

/**
 * Extrai contexto de um ID único
 */
export const parseUniqueId = (id: string): IdContext | null => {
  const parts = id.split('-');
  
  if (parts.length < 3) return null;
  
  const [, type, step, ...rest] = parts;
  
  return {
    stepNumber: step,
    type: type as 'block' | 'dropzone' | 'slot',
    blockId: rest.join('-') || undefined
  };
};

/**
 * Valida se um ID segue o padrão único
 */
export const isValidUniqueId = (id: string): boolean => {
  return parseUniqueId(id) !== null;
};

/**
 * Gera key estável para React baseada no contexto
 */
export const generateStableKey = (context: IdContext): string => {
  const { stepNumber, blockId, type, position } = context;
  return `${type}-${stepNumber}-${blockId || position || 'default'}`;
};