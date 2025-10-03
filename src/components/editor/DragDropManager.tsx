/**
 * 🎯 DRAG DROP MANAGER - Sistema de Arrastar e Soltar para Quiz Steps
 * 
 * Gerencia a funcionalidade de drag & drop para reordenar steps do quiz,
 * com feedback visual e drop zones precisas.
 */

import React, { useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

interface DragDropManagerProps {
    /** Lista de items que podem ser reordenados */
    items: any[];
    /** Callback quando items são reordenados */
    onReorder: (fromIndex: number, toIndex: number) => void;
    /** Função para renderizar cada item */
    renderItem: (item: any, index: number, isDragging: boolean) => React.ReactNode;
    /** Se drag & drop está habilitado */
    enabled?: boolean;
    /** Classe CSS adicional */
    className?: string;
}

interface DropZoneProps {
    /** Posição da drop zone */
    position: 'before' | 'after';
    /** Índice do item */
    index: number;
    /** Se está ativa (mostrar indicador) */
    isActive: boolean;
    /** Callback quando algo é dropado */
    onDrop: (targetIndex: number) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ position, index, isActive, onDrop }) => {
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const targetIndex = position === 'before' ? index : index + 1;
        onDrop(targetIndex);
    }, [position, index, onDrop]);

    return (
        <div
            className={cn(
                'h-2 -my-1 transition-all duration-200 relative',
                isActive ? 'h-8 my-1' : 'h-2'
            )}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-drop-zone={position}
            data-drop-index={position === 'before' ? index : index + 1}
        >
            {isActive && (
                <div className="absolute inset-0 bg-blue-500/20 border-2 border-dashed border-blue-500 rounded-md flex items-center justify-center">
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium">
                        Soltar aqui
                    </div>
                </div>
            )}
        </div>
    );
};

export const DragDropManager: React.FC<DragDropManagerProps> = ({
    items,
    onReorder,
    renderItem,
    enabled = true,
    className = ''
}) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [dragOverPosition, setDragOverPosition] = useState<'before' | 'after' | null>(null);
    const draggedItemRef = useRef<any>(null);

    const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
        if (!enabled) {
            e.preventDefault();
            return;
        }

        setDraggedIndex(index);
        draggedItemRef.current = items[index];

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());

        // Add ghost image
        const ghostElement = e.currentTarget.cloneNode(true) as HTMLElement;
        ghostElement.style.opacity = '0.8';
        ghostElement.style.transform = 'rotate(2deg)';
        ghostElement.style.background = 'white';
        ghostElement.style.border = '2px solid #3b82f6';
        ghostElement.style.borderRadius = '8px';
        ghostElement.style.padding = '8px';

        document.body.appendChild(ghostElement);
        e.dataTransfer.setDragImage(ghostElement, 0, 0);

        // Remove ghost element after drag starts
        setTimeout(() => {
            document.body.removeChild(ghostElement);
        }, 0);
    }, [enabled, items]);

    const handleDragEnd = useCallback(() => {
        setDraggedIndex(null);
        setDragOverIndex(null);
        setDragOverPosition(null);
        draggedItemRef.current = null;
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
        if (!enabled || draggedIndex === null) return;

        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const rect = e.currentTarget.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        const position = e.clientY < midpoint ? 'before' : 'after';

        setDragOverIndex(index);
        setDragOverPosition(position);
    }, [enabled, draggedIndex]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        // Only clear if leaving the container, not child elements
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setDragOverIndex(null);
            setDragOverPosition(null);
        }
    }, []);

    const handleDrop = useCallback((targetIndex: number) => {
        if (!enabled || draggedIndex === null || draggedIndex === targetIndex) {
            return;
        }

        // Calculate final position considering drag direction
        let finalIndex = targetIndex;
        if (draggedIndex < targetIndex) {
            finalIndex = targetIndex - 1;
        }

        onReorder(draggedIndex, finalIndex);
        handleDragEnd();
    }, [enabled, draggedIndex, onReorder, handleDragEnd]);

    const isItemDragging = useCallback((index: number) => {
        return draggedIndex === index;
    }, [draggedIndex]);

    const shouldShowDropZone = useCallback((position: 'before' | 'after', index: number) => {
        if (!enabled || draggedIndex === null) return false;

        const targetIndex = position === 'before' ? index : index + 1;
        return dragOverIndex === index && dragOverPosition === position && draggedIndex !== targetIndex;
    }, [enabled, draggedIndex, dragOverIndex, dragOverPosition]);

    if (!enabled) {
        return (
            <div className={className}>
                {items.map((item, index) => (
                    <div key={item.id || index}>
                        {renderItem(item, index, false)}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={cn('space-y-1', className)} onDragLeave={handleDragLeave}>
            {items.map((item, index) => (
                <div key={item.id || index}>
                    {/* Drop zone before item */}
                    <DropZone
                        position="before"
                        index={index}
                        isActive={shouldShowDropZone('before', index)}
                        onDrop={handleDrop}
                    />

                    {/* Draggable item */}
                    <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(e, index)}
                        className={cn(
                            'transition-all duration-200',
                            isItemDragging(index) && 'opacity-50 scale-95'
                        )}
                        data-drag-index={index}
                    >
                        {renderItem(item, index, isItemDragging(index))}
                    </div>

                    {/* Drop zone after last item */}
                    {index === items.length - 1 && (
                        <DropZone
                            position="after"
                            index={index}
                            isActive={shouldShowDropZone('after', index)}
                            onDrop={handleDrop}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default DragDropManager;