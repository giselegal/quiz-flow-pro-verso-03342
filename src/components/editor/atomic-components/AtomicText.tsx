/**
 * 📝 ATOMIC TEXT COMPONENT
 * 
 * Componente atômico para textos/parágrafos modulares.
 */

import React from 'react';
import { AtomicText, AtomicComponentProps } from './types';
import { AtomicWrapper } from './shared/AtomicWrapper';
import { PropertyHighlighter } from '../editable-steps/shared/PropertyHighlighter';

interface AtomicTextComponentProps extends Omit<AtomicComponentProps, 'component'> {
    component: AtomicText;
}

const AtomicTextComponent: React.FC<AtomicTextComponentProps> = ({
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
        console.log(`[AtomicText] Property clicked: ${propKey}`, { component, element });
        onSelect();
    };

    const sizeClasses = {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg'
    };

    const alignmentClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    };

    return (
        <AtomicWrapper
            componentId={component.id}
            componentType="text"
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
                propKey="content"
                value={component.content}
                onPropertyClick={handlePropertyClick}
                className={`
                    ${sizeClasses[component.size]}
                    ${alignmentClasses[component.alignment]}
                    cursor-pointer transition-colors leading-relaxed
                    ${isEditable ? 'hover:bg-blue-50 hover:shadow-sm' : ''}
                `}
                style={{ color: component.color }}
            >
                {component.markdown ? (
                    <div dangerouslySetInnerHTML={{
                        __html: component.content?.replace(/\n/g, '<br/>') || 'Clique para editar texto'
                    }} />
                ) : (
                    component.content || 'Clique para editar texto'
                )}
            </PropertyHighlighter>
        </AtomicWrapper>
    );
};

export default AtomicTextComponent;