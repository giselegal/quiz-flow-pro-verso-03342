import { Block } from '@/types/editor';
import type { Active, Over } from '@dnd-kit/core'; // type-only import para evitar incluir runtime de dnd-kit no bundle principal
import { logger } from '@/lib/utils/debugLogger';
import { parseUniqueId } from '@/lib/utils/generateUniqueId';
import { makeStepKey } from '@/lib/utils/stepKey';

/**
 * 🎯 Utilitários para Drag & Drop mais seguros
 */

export interface DragData {
  type: 'sidebar-component' | 'canvas-block' | 'block';
  blockType?: string;
  blockId?: string;
  sourceStepKey?: string;
  block?: Block;
}

export interface DropValidationResult {
  isValid: boolean;
  reason?: string;
  action?: 'add' | 'reorder' | 'move';
}

const isUuid = (v: unknown) =>
  typeof v === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v as string);

// Check if a string looks like a block ID (either UUID or nanoid format)
const isValidBlockId = (v: unknown) =>
  typeof v === 'string' && (isUuid(v) || /^block-[\w-]+-[A-Za-z0-9_-]{8}$/.test(v as string));

// Compat: ids de wrappers podem usar prefixo como 'dnd-block-'.
// Importante: não remover 'block-' do ID real, pois os block.id podem começar com 'block-'.
export const normalizeOverId = (id: string | null | undefined): string | null => {
  if (!id) return null;
  let out = id;
  if (out.startsWith('dnd-block-')) out = out.replace(/^dnd-block-/, '');
  return out;
};

/**
 * Normaliza IDs de blocos para comparação
 * Remove prefixos de DnD wrappers e extrai o ID real do bloco
 * 
 * Formatos suportados:
 * - `block-{uuid}` → `block-{uuid}` (já normalizado)
 * - `dnd-block-{step}-block-{uuid}` → `block-{uuid}` (remove wrapper DnD)
 * - `{step}-block-{uuid}` → `block-{uuid}` (remove step prefix)
 * 
 * @param id - ID potencialmente prefixado
 * @returns ID normalizado do bloco ou null se inválido
 */
export const normalizeBlockId = (id: string | null | undefined): string | null => {
  if (!id) return null;
  
  // Já é um ID de bloco válido (sem prefixos)
  if (id.startsWith('block-') && !id.includes('dnd-block-')) {
    return id;
  }
  
  // Remove wrapper DnD: dnd-block-{step}-{blockId} → {step}-{blockId}
  let normalized = id;
  if (normalized.startsWith('dnd-block-')) {
    normalized = normalized.replace(/^dnd-block-/, '');
  }
  
  // Extrai blockId: {step}-block-{uuid} → block-{uuid}
  // Procura pelo padrão block- seguido de UUID (formato: 8-4-4-4-12 caracteres hex)
  // ou qualquer sequência hex longa o suficiente para ser um UUID
  const blockIdMatch = normalized.match(/(block-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
  if (blockIdMatch) {
    return blockIdMatch[1];
  }
  
  // Fallback: Se não encontrou UUID completo, tenta padrão mais simples
  // Isso captura IDs legados ou formatos diferentes
  const simpleMatch = normalized.match(/(block-[a-z0-9-]+)/i);
  if (simpleMatch) {
    return simpleMatch[1];
  }
  
  // Se não encontrou padrão block-, retorna como está (pode ser outro formato válido)
  return normalized;
};

/**
 * Valida se um drop é válido
 */
export const validateDrop = (
  active: Active,
  over: Over | null,
  currentStepBlocks: Block[],
): DropValidationResult => {
  if (!over) {
    return { isValid: false, reason: 'Nenhuma zona de drop válida' };
  }

  const activeData = active.data.current as DragData | undefined;

  if (!activeData) {
    return { isValid: false, reason: 'Dados de drag inválidos' };
  }

  // Dados adicionais do alvo
  const overData: any = (over as any)?.data?.current ?? {};
  const overIsDropZone = overData?.type === 'dropzone';

  // Validação para componente da sidebar
  if (activeData.type === 'sidebar-component') {
    const rawOverId = String(over.id);
    // Normaliza IDs vindos de wrappers otimizados (ex.: 'dnd-block-<id>')
    const overId = normalizeOverId(rawOverId) || rawOverId;

    // Aceitar soltar diretamente sobre bloco existente (insere antes dele)
    const isOverExistingBlock = currentStepBlocks.some(block => String(block.id) === overId);

    // Aceitar canvas e drop-zones padronizadas
    const isOverCanvasArea =
      overIsDropZone ||
      overId === 'canvas-drop-zone' ||
      overId.startsWith('drop-zone-') ||
      overId.startsWith('canvas-');

    if (!activeData.blockType) return { isValid: false, reason: 'Componente sem blockType' };
    if (isOverCanvasArea || isOverExistingBlock || isValidBlockId(overId)) {
      return { isValid: true, action: 'add' };
    }
    return { isValid: false, reason: 'Alvo de drop inválido para adicionar' };
  }

  // Validação para bloco do canvas
  if (activeData.type === 'canvas-block' || activeData.type === 'block') {
    const activeBlockExists = currentStepBlocks.some(
      block => String(block.id) === String(activeData.blockId),
    );
    if (!activeBlockExists) return { isValid: false, reason: 'Bloco de origem não encontrado' };

    const rawOverId = String(over.id);
    const overId = normalizeOverId(rawOverId) || rawOverId;
    const overIsBlock = currentStepBlocks.some(block => String(block.id) === overId);
    if (overIsDropZone || overIsBlock || isValidBlockId(overId)) {
      // Detectar move entre etapas (quando possível)
      let sourceKey: string | null = null;
      const rawSource = (active.data.current as any)?.sourceStepKey ?? ((): any => {
        const parsed = typeof active.id === 'string' ? parseUniqueId(active.id) : null;
        return parsed?.stepNumber;
      })();
      if (rawSource != null) {
        try { sourceKey = makeStepKey(rawSource); } catch { sourceKey = null; }
      }

      let targetKey: string | null = null;
      const rawTarget = (over as any)?.data?.current?.scopeId ?? ((): any => {
        const parsed = typeof over.id === 'string' ? parseUniqueId(String(over.id)) : null;
        return parsed?.stepNumber;
      })();
      if (rawTarget != null) {
        try { targetKey = makeStepKey(rawTarget); } catch { targetKey = null; }
      }

      if (sourceKey && targetKey && sourceKey !== targetKey) {
        return { isValid: true, action: 'move' };
      }
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

    if ('block' in data && typeof (data as any).block === 'object') {
      dragData.block = (data as any).block as Block;
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
  validation?: DropValidationResult,
) => {
  if (process.env.NODE_ENV === 'development') {
    const data = extractDragData(active);

    logger.debug(`🎯 [Drag ${event.toUpperCase()}]`, {
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
  validation: DropValidationResult,
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
