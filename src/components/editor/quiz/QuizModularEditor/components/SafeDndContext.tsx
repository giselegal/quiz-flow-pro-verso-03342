/**
 * SAFE DND CONTEXT - Versão correta que respeita as regras de hooks do React
 *
 * CORREÇÕES IMPLEMENTADAS:
 * ✅ Imports estáticos de @dnd-kit (sem dynamic import)
 * ✅ Hooks sempre chamados na mesma ordem (sem stubs que trocam implementação)
 * ✅ Sem variáveis globais mutáveis (let PointerSensor = null)
 * ✅ Sem monkey-patch no React global
 * ✅ Early return antes de chamar hooks quando DnD não disponível
 */

import React from 'react';
import { appLogger } from '@/lib/utils/appLogger';

// ✅ IMPORTS ESTÁTICOS - @dnd-kit deve estar no bundle
import {
  DndContext as DndContextComponent,
  DragOverlay,
  closestCenter,
  closestCorners,
  pointerWithin,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DndContextProps,
} from '@dnd-kit/core';

import {
  SortableContext as SortableContextComponent,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface DndWrapperProps {
  children: React.ReactNode;
  onDragEnd?: (event: any) => void;
  onDragStart?: (event: any) => void;
  onDragOver?: (event: any) => void;
  sensors?: any[];
  collisionDetection?: any;
  disabled?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SENSORS HOOK - Implementação correta sem stubs
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook que retorna sensores de drag & drop de forma estável.
 * 
 * REGRAS RESPEITADAS:
 * - Sempre chama os mesmos hooks na mesma ordem
 * - Não troca implementação entre renders
 * - Não usa stubs que também chamam hooks
 */
export function useSafeDndSensors() {
  // ✅ SEMPRE chama os mesmos hooks na mesma ordem, sem condicionais
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
      tolerance: 5,
    },
  });

  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 10,
    },
  });

  // ✅ SEMPRE chama useSensors uma única vez
  const sensors = useSensors(pointerSensor, keyboardSensor, touchSensor);

  return sensors;
}

// ─────────────────────────────────────────────────────────────────────────────
// DND CONTEXT WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

export function SafeDndContext({
  children,
  onDragEnd,
  onDragStart,
  onDragOver,
  sensors,
  collisionDetection,
  disabled = false,
}: DndWrapperProps) {
  // Collision detection customizado como fallback
  const defaultCollisionDetection = React.useCallback((args: any) => {
    try {
      // Tenta closestCorners primeiro (melhor pra nested)
      const cornersResult = closestCorners(args);
      if (cornersResult && cornersResult.length > 0) {
        return cornersResult;
      }
    } catch (e) {
      appLogger.warn('[SafeDndContext] closestCorners falhou', { data: [e] });
    }

    try {
      // Depois pointerWithin
      const pointerResult = pointerWithin(args);
      if (pointerResult && pointerResult.length > 0) {
        return pointerResult;
      }
    } catch (e) {
      appLogger.warn('[SafeDndContext] pointerWithin falhou', { data: [e] });
    }

    try {
      // Fallback final: closestCenter
      return closestCenter(args);
    } catch (e) {
      appLogger.error('[SafeDndContext] Todos collision detectors falharam', { data: [e] });
      return [];
    }
  }, []);

  const activeCollisionDetection = collisionDetection || defaultCollisionDetection;

  // Se disabled, retorna fallback sem DnD
  if (disabled) {
    return <div data-testid="safe-dnd-disabled">{children}</div>;
  }

  try {
    return (
      <DndContextComponent
        sensors={sensors}
        collisionDetection={activeCollisionDetection}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        {children}
        <DragOverlay
          dropAnimation={{
            duration: 300,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}
        >
          <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-500 shadow-2xl rounded-lg p-4 opacity-95 scale-105 cursor-grabbing backdrop-blur-sm min-w-[280px]">
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  <div
                    className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"
                    style={{ animationDelay: '0.1s' }}
                  />
                </div>
                <div className="flex gap-1">
                  <div
                    className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <div
                    className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"
                    style={{ animationDelay: '0.3s' }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-800 mb-0.5">
                  Movendo bloco
                </div>
                <div className="text-xs text-gray-500">
                  Solte para reposicionar
                </div>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </div>
            </div>
          </div>
        </DragOverlay>
      </DndContextComponent>
    );
  } catch (err) {
    appLogger.error('[SafeDndContext] Erro ao renderizar DndContext', { data: [err] });
    return <div data-testid="safe-dnd-error">{children}</div>;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DROPPABLE HOOK - Versão segura
// ─────────────────────────────────────────────────────────────────────────────

export function useSafeDroppable(options: any = {}) {
  try {
    return useDroppable(options);
  } catch (err) {
    appLogger.error('[SafeDndContext] useDroppable erro', { data: [err] });
    // Fallback estável sem chamar mais hooks
    return {
      setNodeRef: () => { },
      isOver: false,
      active: null,
      node: { current: null },
      rect: null,
      over: null,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SORTABLE HOOK - Versão segura
// ─────────────────────────────────────────────────────────────────────────────

export function useSafeSortable(options: any = {}) {
  try {
    return useSortable(options);
  } catch (err) {
    appLogger.error('[SafeDndContext] useSortable erro', { data: [err] });
    // Fallback estável sem chamar mais hooks
    return {
      attributes: {},
      listeners: {},
      setNodeRef: () => { },
      transform: null,
      transition: null,
      isDragging: false,
      isSorting: false,
      over: null,
      active: null,
      index: 0,
      newIndex: 0,
      items: [],
      node: { current: null },
      rect: null,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SORTABLE CONTEXT - Versão segura
// ─────────────────────────────────────────────────────────────────────────────

export function SafeSortableContext({
  children,
  items,
  strategy = verticalListSortingStrategy,
}: {
  children: React.ReactNode;
  items: any[];
  strategy?: any;
}) {
  try {
    return (
      <SortableContextComponent items={items} strategy={strategy}>
        {children}
      </SortableContextComponent>
    );
  } catch (err) {
    appLogger.error('[SafeDndContext] SafeSortableContext erro', { data: [err] });
    return <>{children}</>;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export {
  CSS as SafeCSS,
  verticalListSortingStrategy as safeVerticalListSortingStrategy,
  closestCenter,
  closestCorners,
  pointerWithin,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  sortableKeyboardCoordinates,
};

export default SafeDndContext;
