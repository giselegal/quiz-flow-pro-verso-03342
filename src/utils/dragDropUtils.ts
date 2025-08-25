import { Block } from '@/types/editor';
import { Active, Over } from '@dnd-kit/core';

/**
 * 🎯 Utilitários para Drag & Drop mais seguros
 */

export interface DragData {
  type: 'sidebar-component' | 'canvas-block';
  blockType?: string;
  blockId?: string;
  sourceStepKey?: string;
}

export interface DropValidationResult {
  isValid: boolean;
  reason?: string;
  action?: 'add' | 'reorder' | 'move';
}

const isUuid = (v: unknown) =>
  typeof v === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v as string);

/**
 * Valida se um drop é válido
 */
export const validateDrop = (
  active: Active,
  over: Over | null,
  currentStepBlocks: Block[]
): DropValidationResult => {
  if (!over) {
    return { isValid: false, reason: 'Nenhuma zona de drop válida' };
  }

  const activeData = active.data.current as DragData | undefined;

  if (!activeData) {
    return { isValid: false, reason: 'Dados de drag inválidos' };
  }

  // Validação para componente da sidebar
  if (activeData.type === 'sidebar-component') {
    const overId = String(over.id);

    // Aceitar soltar diretamente sobre bloco existente (insere antes dele)
    const isOverExistingBlock = currentStepBlocks.some(block => String(block.id) === overId);

    // Aceitar canvas e drop-zones padronizadas
    const isOverCanvasArea =
      overId === 'canvas-drop-zone' ||
      overId.startsWith('drop-zone-') ||
      overId.startsWith('canvas-');

    if (!activeData.blockType) return { isValid: false, reason: 'Componente sem blockType' };
    if (isOverCanvasArea || isOverExistingBlock || isUuid(overId)) {
      return { isValid: true, action: 'add' };
    }
    return { isValid: false, reason: 'Alvo de drop inválido para adicionar' };
  }

  // Validação para bloco do canvas
  if (activeData.type === 'canvas-block') {
    const activeBlockExists = currentStepBlocks.some(
      block => String(block.id) === String(activeData.blockId)
    );
    if (!activeBlockExists) return { isValid: false, reason: 'Bloco de origem não encontrado' };

    const overId = String(over.id);
    const overIsDropZone = overId === 'canvas-drop-zone' || overId.startsWith('drop-zone-');
    const overIsBlock = currentStepBlocks.some(block => String(block.id) === overId);
    if (overIsDropZone || overIsBlock || isUuid(overId)) {
      return { isValid: true, action: 'reorder' };
    }
    return { isValid: false, reason: 'Posição de drop inválida para reordenação' };
  }

  return { isValid: false, reason: 'Tipo de drag não reconhecido' };
};

/**
 * Extrai dados seguros do active item
 */
export const extractDragData = (active: Active): DragData | null => {
  const data = active.data.current;

  if (!data || typeof data !== 'object') {
    return null;
  }

  // Validação básica de estrutura
  if ('type' in data && typeof data.type === 'string') {
    const dragData: DragData = {
      type: data.type as DragData['type'],
    };

    if ('blockType' in data && typeof data.blockType === 'string') {
      dragData.blockType = data.blockType;
    }

    if ('blockId' in data && typeof data.blockId === 'string') {
      dragData.blockId = data.blockId;
    }

    if ('sourceStepKey' in data && typeof data.sourceStepKey === 'string') {
      dragData.sourceStepKey = data.sourceStepKey;
    }

    return dragData;
  }

  return null;
};

/**
 * Helper para logging de drag events
 */
export const logDragEvent = (
  event: 'start' | 'end' | 'cancel',
  active: Active,
  over?: Over | null,
  validation?: DropValidationResult
) => {
  if (process.env.NODE_ENV === 'development') {
    const data = extractDragData(active);

    console.log(`🎯 [Drag ${event.toUpperCase()}]`, {
      activeId: active.id,
      overId: over?.id,
      dragData: data,
      validation,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Gera feedback visual para o usuário durante drag
 */
export const getDragFeedback = (
  dragData: DragData | null,
  validation: DropValidationResult
): { message: string; type: 'success' | 'error' | 'info' } => {
  if (!dragData) {
    return { message: 'Dados de drag inválidos', type: 'error' };
  }

  if (!validation.isValid) {
    return { message: validation.reason || 'Drop inválido', type: 'error' };
  }

  switch (validation.action) {
    case 'add':
      return { message: `Adicionar ${dragData.blockType} ao canvas`, type: 'success' };
    case 'reorder':
      return { message: 'Reordenar blocos', type: 'info' };
    case 'move':
      return { message: 'Mover bloco', type: 'info' };
    default:
      return { message: 'Ação válida', type: 'success' };
  }
};
