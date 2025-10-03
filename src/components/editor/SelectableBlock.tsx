/**
 * 🎯 SELECTABLE BLOCK - Sistema de Seleção Visual para Editor
 * 
 * Wrapper que adiciona funcionalidade de seleção visual e interatividade
 * aos blocos do editor sem interferir na edição inline.
 */

import React, { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Move, Settings } from 'lucide-react';

interface SelectableBlockProps {
    /** ID único do bloco */
    blockId: string;
    /** Se o bloco está selecionado */
    isSelected: boolean;
    /** Se está no modo de edição */
    isEditable: boolean;
    /** Callback quando o bloco é selecionado */
    onSelect: (blockId: string) => void;
    /** Tipo/nome do bloco para exibição */
    blockType?: string;
    /** Índice do bloco para drag & drop */
    blockIndex?: number;
    /** Callback para abrir painel de propriedades */
    onOpenProperties?: (blockId: string) => void;
    /** Se permite drag & drop */
    isDraggable?: boolean;
    /** Callback quando drag inicia */
    onDragStart?: (blockId: string, index: number) => void;
    /** Callback quando drag termina */
    onDragEnd?: () => void;
    /** Filhos (conteúdo do bloco) */
    children: React.ReactNode;
    /** Classes CSS adicionais */
    className?: string;
}

export const SelectableBlock: React.FC<SelectableBlockProps> = ({
    blockId,
    isSelected,
    isEditable,
    onSelect,
    blockType = 'Block',
    blockIndex = 0,
    onOpenProperties,
    isDraggable = true,
    onDragStart,
    onDragEnd,
    children,
    className = ''
}) => {
    const handleClick = useCallback((e: React.MouseEvent) => {
        // Só intercepta se não estiver clicando em um input/textarea/button
        const target = e.target as HTMLElement;
        const isInteractiveElement = target.closest('input, textarea, button, select, [contenteditable]');

        if (!isInteractiveElement && isEditable) {
            e.preventDefault();
            e.stopPropagation();
            onSelect(blockId);
        }
    }, [blockId, isEditable, onSelect]);

    const handlePropertiesClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onOpenProperties?.(blockId);
    }, [blockId, onOpenProperties]);

    const handleDragStart = useCallback((e: React.DragEvent) => {
        if (!isDraggable || !isEditable) {
            e.preventDefault();
            return;
        }

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', blockId);
        onDragStart?.(blockId, blockIndex);
    }, [blockId, blockIndex, isDraggable, isEditable, onDragStart]);

    const handleDragEnd = useCallback(() => {
        onDragEnd?.();
    }, [onDragEnd]);

    return (
        <div
            className={cn(
                // Base styles
                'relative group transition-all duration-200',
                // Selection styles
                isSelected && isEditable && [
                    'ring-2 ring-blue-500 ring-offset-2',
                    'shadow-lg shadow-blue-500/20',
                    'z-10'
                ],
                // Hover styles (quando editável)
                isEditable && [
                    'hover:ring-1 hover:ring-blue-300 hover:ring-offset-1',
                    'hover:shadow-md hover:shadow-blue-500/10',
                    'cursor-pointer'
                ],
                // Draggable styles
                isDraggable && isEditable && 'select-none',
                className
            )}
            onClick={handleClick}
            draggable={isDraggable && isEditable}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            data-block-id={blockId}
            data-block-type={blockType}
            data-block-index={blockIndex}
        >
            {/* Selection Indicator */}
            {isSelected && isEditable && (
                <div className="absolute -top-6 left-0 z-20 flex items-center gap-2">
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md font-medium shadow-sm">
                        {blockType} #{blockIndex + 1}
                    </div>

                    {/* Properties Button */}
                    {onOpenProperties && (
                        <button
                            onClick={handlePropertiesClick}
                            className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded-md shadow-sm transition-colors"
                            title="Abrir Propriedades"
                        >
                            <Settings className="w-3 h-3" />
                        </button>
                    )}

                    {/* Drag Handle */}
                    {isDraggable && (
                        <div
                            className="bg-gray-700 text-white p-1 rounded-md shadow-sm cursor-move"
                            title="Arrastar para Reordenar"
                        >
                            <Move className="w-3 h-3" />
                        </div>
                    )}
                </div>
            )}

            {/* Hover Indicator */}
            {!isSelected && isEditable && (
                <div className="absolute -top-5 left-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded-md font-medium shadow-sm">
                        {blockType} #{blockIndex + 1}
                    </div>
                </div>
            )}

            {/* Block Content */}
            <div className="relative">
                {children}
            </div>

            {/* Drop Zone Indicator (for drag & drop) */}
            {isEditable && (
                <>
                    <div
                        className="absolute -top-1 left-0 right-0 h-2 bg-blue-500/20 opacity-0 transition-opacity"
                        data-drop-zone="before"
                        data-block-index={blockIndex}
                    />
                    <div
                        className="absolute -bottom-1 left-0 right-0 h-2 bg-blue-500/20 opacity-0 transition-opacity"
                        data-drop-zone="after"
                        data-block-index={blockIndex}
                    />
                </>
            )}
        </div>
    );
};

export default SelectableBlock;