/**
 * 🎛️ ATOMIC BUTTON COMPONENT
 * 
 * Componente atômico para botões modulares.
 */

import React from 'react';
import { AtomicButton, AtomicComponentProps } from './types';
import { AtomicWrapper } from './shared/AtomicWrapper';
import { PropertyHighlighter } from '../editable-steps/shared/PropertyHighlighter';
import { Button } from '@/components/ui/button';

interface AtomicButtonComponentProps extends Omit<AtomicComponentProps, 'component'> {
    component: AtomicButton;
}

const AtomicButtonComponent: React.FC<AtomicButtonComponentProps> = ({
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
        console.log(`[AtomicButton] Property clicked: ${propKey}`, { component, element });
        onSelect();
    };

    const handleClick = (e: React.MouseEvent) => {
        if (isEditable) {
            e.preventDefault();
            onSelect();
        }
        // Em modo não-editável, aqui executaria a ação do botão
    };

    const sizeMap = {
        small: 'sm',
        medium: 'default',
        large: 'lg'
    } as const;

    const variantMap = {
        primary: 'default',
        secondary: 'secondary',
        outline: 'outline',
        ghost: 'ghost'
    } as const;

    return (
        <AtomicWrapper
            componentId={component.id}
            componentType="button"
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
            <div className={`flex ${component.fullWidth ? 'w-full' : 'justify-center'}`}>
                <PropertyHighlighter
                    propKey="text"
                    value={component.text}
                    onPropertyClick={handlePropertyClick}
                    className="inline-block"
                >
                    <Button
                        size={sizeMap[component.size]}
                        variant={variantMap[component.style]}
                        onClick={handleClick}
                        className={`
                            transition-all duration-200
                            ${component.fullWidth ? 'w-full' : 'px-8'}
                            ${isEditable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                        `}
                    >
                        {component.text || 'Clique para editar'}
                    </Button>
                </PropertyHighlighter>
            </div>
        </AtomicWrapper>
    );
};

export default AtomicButtonComponent;