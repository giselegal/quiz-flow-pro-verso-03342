/**
 * 🎁 EDITABLE BLOCK WRAPPER
 * 
 * Wrapper universal para todos os componentes editáveis.
 * Fornece funcionalidades de seleção, highlight, controles e integração com o editor.
 */

import React, { useCallback, useMemo } from 'react';
import { PropertyHighlighter } from './PropertyHighlighter';
import { LiveEditControls } from './LiveEditControls';
import { EditableStepProps } from './EditableStepProps';

export interface EditableBlockWrapperProps extends Omit<EditableStepProps, 'data'> {
    /** Propriedades que podem ser editadas */
    editableProps: string[];

    /** Componente filho a ser renderizado */
    children: React.ReactNode;

    /** Callback quando uma propriedade é clicada para edição */
    onPropertyClick?: (propKey: string, element: HTMLElement) => void;

    /** Classes CSS adicionais */
    className?: string;

    /** Estilo inline adicional */
    style?: React.CSSProperties;

    /** ID único do bloco */
    blockId?: string;
}

export const EditableBlockWrapper: React.FC<EditableBlockWrapperProps> = ({
    editableProps,
    children,
    isEditable,
    isSelected,
    onUpdate,
    onSelect,
    onDuplicate,
    onDelete,
    onMoveUp,
    onMoveDown,
    onPropertyClick,
    canMoveUp = true,
    canMoveDown = true,
    canDelete = true,
    className = '',
    style = {},
    blockId
}) => {

    // 🎯 Handle click para seleção
    const handleClick = useCallback((e: React.MouseEvent) => {
        if (!isEditable) return;

        e.preventDefault();
        e.stopPropagation();
        onSelect();
    }, [isEditable, onSelect]);

    // 🎨 Handle property click
    const handlePropertyClick = useCallback((propKey: string, element: HTMLElement) => {
        onSelect(); // Selecionar primeiro
        onPropertyClick?.(propKey, element);
    }, [onSelect, onPropertyClick]);

    // 🎭 Classes CSS dinâmicas baseadas no estado
    const wrapperClasses = useMemo(() => {
        const baseClasses = 'relative transition-all duration-200';
        const editableClasses = isEditable ? 'cursor-pointer' : '';
        const selectedClasses = isSelected
            ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/10'
            : 'hover:ring-1 hover:ring-blue-300 hover:ring-offset-1';

        return `${baseClasses} ${editableClasses} ${selectedClasses} ${className}`.trim();
    }, [isEditable, isSelected, className]);

    // 🎨 Estilos dinâmicos
    const wrapperStyle = useMemo(() => ({
        ...style,
        ...(isSelected && {
            position: 'relative' as const,
            zIndex: 10
        })
    }), [style, isSelected]);

    return (
        <div
            className={wrapperClasses}
            style={wrapperStyle}
            onClick={handleClick}
            data-block-id={blockId}
            data-editable={isEditable}
            data-selected={isSelected}
        >
            {/* 🎨 Property Highlighter - apenas em modo editável */}
            {isEditable ? (
                <PropertyHighlighter
                    editableProps={editableProps}
                    onPropertyClick={handlePropertyClick}
                    isActive={isSelected}
                >
                    {children}
                </PropertyHighlighter>
            ) : (
                children
            )}

            {/* 🎮 Live Edit Controls - aparecem quando selecionado */}
            <LiveEditControls
                isVisible={isEditable && isSelected}
                position="overlay"
                onEdit={() => {
                    // Abrir painel de propriedades focando no primeiro prop editável
                    if (editableProps.length > 0) {
                        handlePropertyClick(editableProps[0], document.body);
                    }
                }}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onSettings={() => {
                    // Abrir configurações avançadas
                    console.log('[EditableBlockWrapper] Configurações avançadas');
                }}
                canMoveUp={canMoveUp}
                canMoveDown={canMoveDown}
                canDelete={canDelete}
            />

            {/* 🏷️ Label do tipo de componente - debug/desenvolvimento */}
            {isEditable && isSelected && (
                <div className="absolute -top-6 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-t">
                    {editableProps.length > 0 ? `📝 ${editableProps.length} props` : '📝 Editável'}
                </div>
            )}
        </div>
    );
};