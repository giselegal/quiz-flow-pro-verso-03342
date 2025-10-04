/**
 * 📝 ATOMIC TITLE COMPONENT
 * 
 * Componente atômico para títulos modulares.
 * Pode ser reordenado, editado e removido individualmente.
 */

import React from 'react';
import { AtomicTitle, AtomicComponentProps } from './types';
import { AtomicWrapper } from './shared/AtomicWrapper';
import { PropertyHighlighter } from '../editable-steps/shared/PropertyHighlighter';

interface AtomicTitleComponentProps extends Omit<AtomicComponentProps, 'component'> {
    component: AtomicTitle;
}

const AtomicTitleComponent: React.FC<AtomicTitleComponentProps> = ({
    component,
    isSelected,
    isEditable,
    onUpdate,
    onSelect,
    onDelete,
    onDuplicate,
    onMoveUp,
    onMoveDown,
    onInsertAfter,
    canMoveUp,
    canMoveDown,
    stepId
}) => {
    const handlePropertyClick = (propKey: string, element: HTMLElement) => {
        console.log(`[AtomicTitle] Property clicked: ${propKey}`, { component, element });
        onSelect();
    };

    const sizeClasses = {
        small: 'text-lg',
        medium: 'text-xl',
        large: 'text-2xl',
        xl: 'text-3xl'
    };

    const alignmentClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    };

    const weightClasses = {
        normal: 'font-normal',
        bold: 'font-bold',
        'extra-bold': 'font-extrabold'
    };

    return (
        <AtomicWrapper
            componentId={component.id}
            componentType="title"
            isSelected={isSelected}
            isEditable={isEditable}
            onSelect={onSelect}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onInsertAfter={onInsertAfter}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            stepId={stepId}
        >
            <PropertyHighlighter
                propKey="text"
                value={component.text}
                onPropertyClick={handlePropertyClick}
                className={`
                    ${sizeClasses[component.size]}
                    ${alignmentClasses[component.alignment]}
                    ${weightClasses[component.weight]}
                    cursor-pointer transition-colors
                    ${isEditable ? 'hover:bg-blue-50 hover:shadow-sm' : ''}
                `}
                style={{ color: component.color }}
            >
                {component.text || 'Clique para editar título'}
            </PropertyHighlighter>
        </AtomicWrapper>
    );
};

export default AtomicTitleComponent;