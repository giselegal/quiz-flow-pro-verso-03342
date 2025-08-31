import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import React, { useEffect, useRef } from 'react';

/**
 * Wrapper de força bruta para elementos draggable
 * Garante que o DnD funcione mesmo com interferências
 */
export const ForceDraggableWrapper: React.FC<{
  id: string;
  data: any;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onDoubleClick?: () => void;
}> = ({ id, data, children, disabled = false, className = '', onDoubleClick }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data,
    disabled,
  });

  const style = transform
    ? {
      transform: CSS.Transform.toString(transform),
      zIndex: isDragging ? 9999 : 'auto',
    }
    : undefined;

  // Force override de eventos se necessário
  useEffect(() => {
    const element = elementRef.current;
    if (!element || disabled) return;

    // Debug log
    console.log('🔧 ForceDraggableWrapper montado para:', id);

    // Force event listeners se os padrão não funcionarem
    let isForceListening = false;

    const handleMouseDown = (e: MouseEvent) => {
      console.log('🖱️ FORCE MouseDown capturado:', id, e);

      // Se os listeners padrão não estão funcionando, tentar força bruta
      if (!isDragging && !isForceListening) {
        console.log('🔄 Tentando força bruta para:', id);
        isForceListening = true;

        // Dispatch eventos customizados se necessário
        const customEvent = new CustomEvent('forceDragStart', {
          detail: { id, data, element },
        });
        window.dispatchEvent(customEvent);
      }
    };

    // Adicionar listeners de força bruta
    element.addEventListener('mousedown', handleMouseDown);

    // Override CSS se necessário
    element.style.pointerEvents = 'auto';
    element.style.userSelect = 'none';
    element.style.touchAction = 'none';
    // Não forçar cursor customizado (evita cursor grande)

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      isForceListening = false;
    };
  }, [id, data, disabled, isDragging]);

  return (
    <div
      ref={node => {
        setNodeRef(node);
        if (elementRef.current !== node) {
          (elementRef as any).current = node;
        }
      }}
      className={`force-draggable ${className}`}
      style={style}
      data-force-draggable="true"
      data-dragging={isDragging}
      onDoubleClick={onDoubleClick}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};
