/**
 * 🎛️ ATOMIC INPUT COMPONENT
 * 
 * Componente atômico para inputs modulares.
 */

import React from 'react';
import { AtomicInput, AtomicComponentProps } from './types';
import { AtomicWrapper } from './shared/AtomicWrapper';
import { PropertyHighlighter } from '../editable-steps/shared/PropertyHighlighter';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AtomicInputComponentProps extends Omit<AtomicComponentProps, 'component'> {
    component: AtomicInput;
}

const AtomicInputComponent: React.FC<AtomicInputComponentProps> = ({
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
        console.log(`[AtomicInput] Property clicked: ${propKey}`, { component, element });
        onSelect();
    };

    const handleInputClick = (e: React.MouseEvent) => {
        if (isEditable) {
            e.preventDefault();
            onSelect();
        }
    };

    return (
        <AtomicWrapper
            componentId={component.id}
            componentType="input"
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
            <div className="space-y-2">
                <PropertyHighlighter
                    propKey="label"
                    value={component.label}
                    onPropertyClick={handlePropertyClick}
                    className="block"
                >
                    <Label className="text-sm font-medium cursor-pointer hover:text-blue-600">
                        {component.label || 'Clique para editar label'}
                        {component.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                </PropertyHighlighter>

                <PropertyHighlighter
                    propKey="placeholder"
                    value={component.placeholder}
                    onPropertyClick={handlePropertyClick}
                    className="block"
                >
                    <Input
                        type={component.inputType}
                        placeholder={component.placeholder || 'Clique para editar placeholder'}
                        onClick={handleInputClick}
                        readOnly={isEditable}
                        className={`
                            transition-all duration-200
                            ${isEditable ? 'cursor-pointer hover:border-blue-300 hover:shadow-sm' : ''}
                        `}
                    />
                </PropertyHighlighter>
            </div>
        </AtomicWrapper>
    );
};

export default AtomicInputComponent;