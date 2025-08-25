import React, { useEffect } from 'react';

/**
 * Hook para melhorar a compatibilidade do DnD com scroll
 */
export const useDnDScrollFix = () => {
  useEffect(() => {
    // Desabilitar scroll automático durante o drag
    let isDragging = false;

    const handleDragStart = () => {
      isDragging = true;
      document.body.style.overflow = 'hidden';
    };

    const handleDragEnd = () => {
      isDragging = false;
      document.body.style.overflow = '';
    };

    // Listener para eventos DnD globais
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragend', handleDragEnd);
    document.addEventListener('drop', handleDragEnd);

    return () => {
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('dragend', handleDragEnd);
      document.removeEventListener('drop', handleDragEnd);
      document.body.style.overflow = '';
    };
  }, []);
};

/**
 * Componente wrapper para melhorar DnD
 */
export const DnDScrollContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useDnDScrollFix();

  return (
    <div
      className="dnd-scroll-container"
      style={{
        // Garantir que o container não interfira com eventos
        pointerEvents: 'auto',
        position: 'relative',
      }}
    >
      {children}
    </div>
  );
};
