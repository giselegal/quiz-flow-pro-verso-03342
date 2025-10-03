/**
 * ✏️ CAMPO EDITÁVEL COMPARTILHADO
 * 
 * Componente que pode alternar entre modo de visualização
 * e edição, usado em vários steps.
 */

import React, { useState, useRef, useEffect } from 'react';
import { STEP_COLORS } from './StepConfig';

interface EditableFieldProps {
    value: string;
    isEditable: boolean;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    onKeyPress?: (e: React.KeyboardEvent) => void;

    // Estilo
    className?: string;
    placeholder?: string;
    multiline?: boolean;
    maxLength?: number;

    // Comportamento
    autoFocus?: boolean;
    selectAllOnFocus?: boolean;

    // Elemento HTML
    as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
}

const EditableField: React.FC<EditableFieldProps> = ({
    value,
    isEditable,
    onChange = () => { },
    onBlur = () => { },
    onKeyPress = () => { },
    className = '',
    placeholder = 'Digite aqui...',
    multiline = false,
    maxLength,
    autoFocus = false,
    selectAllOnFocus = true,
    as: Element = 'span'
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    // Atualizar valor interno quando prop mudar
    useEffect(() => {
        setEditValue(value);
    }, [value]);

    // Focar quando entrar em modo de edição
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            if (selectAllOnFocus) {
                inputRef.current.select();
            }
        }
    }, [isEditing, selectAllOnFocus]);

    const handleDoubleClick = () => {
        if (isEditable) {
            setIsEditing(true);
        }
    };

    const handleSave = () => {
        setIsEditing(false);
        onChange(editValue);
        onBlur();
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditValue(value); // Restaurar valor original
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleCancel();
        }
        onKeyPress(e);
    };

    // Modo de edição
    if (isEditable && isEditing) {
        const InputComponent = multiline ? 'textarea' : 'input';

        return (
            <InputComponent
                ref={inputRef as any}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                maxLength={maxLength}
                className={`${className} border-2 border-dashed focus:border-solid transition-all`}
                style={{
                    borderColor: STEP_COLORS.primary,
                    backgroundColor: 'rgba(184, 155, 122, 0.1)'
                }}
                autoFocus={autoFocus}
                rows={multiline ? 3 : undefined}
            />
        );
    }

    // Modo de visualização
    const displayValue = value || placeholder;
    const isPlaceholder = !value;

    return (
        <Element
            className={`${className
                } ${isEditable ? 'cursor-pointer hover:bg-opacity-10 hover:bg-gray-200 transition-colors rounded px-1 -mx-1' : ''
                } ${isPlaceholder ? 'text-gray-400 italic' : ''
                }`}
            onDoubleClick={handleDoubleClick}
            title={isEditable ? 'Clique duas vezes para editar' : undefined}
        >
            {displayValue}
            {isEditable && (
                <span className="ml-1 text-xs text-gray-400">✏️</span>
            )}
        </Element>
    );
};

export default EditableField;
