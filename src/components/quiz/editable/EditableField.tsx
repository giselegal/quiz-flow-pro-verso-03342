import React, { useState, useEffect, useRef } from 'react';

interface EditableFieldProps {
    value: string;
    onChange: (value: string) => void;
    isEditable: boolean;
    className?: string;
    placeholder?: string;
    multiline?: boolean;
    htmlContent?: boolean;
    children?: React.ReactNode;
}

/**
 * 🎯 CAMPO EDITÁVEL UNIVERSAL
 * 
 * Componente que alterna entre:
 * - Modo Edição: contentEditable ou input
 * - Modo Preview: span/div normal
 * 
 * Mantém aparência idêntica em ambos os modos
 */
export const EditableField: React.FC<EditableFieldProps> = ({
    value,
    onChange,
    isEditable,
    className = '',
    placeholder = 'Digite aqui...',
    multiline = false,
    htmlContent = false,
    children
}) => {
    const [localValue, setLocalValue] = useState(value);
    const [isEditing, setIsEditing] = useState(false);
    const elementRef = useRef<HTMLDivElement | HTMLTextAreaElement>(null);

    // Sincronizar valor externo com local
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleBlur = () => {
        setIsEditing(false);
        if (localValue !== value) {
            onChange(localValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) {
            e.preventDefault();
            handleBlur();
        }
        if (e.key === 'Escape') {
            setLocalValue(value); // Restaurar valor original
            setIsEditing(false);
        }
    };

    const handleDoubleClick = () => {
        if (isEditable) {
            setIsEditing(true);
            // Focus após render
            setTimeout(() => {
                elementRef.current?.focus();
            }, 0);
        }
    };

    if (!isEditable) {
        // MODO PREVIEW: Renderização normal
        if (htmlContent) {
            return (
                <div
                    className={className}
                    dangerouslySetInnerHTML={{ __html: value }}
                />
            );
        }
        return (
            <div className={className}>
                {value || children}
            </div>
        );
    }

    // MODO EDIÇÃO: Campo editável
    const editableClassName = `${className} ${isEditing ? 'ring-2 ring-blue-400 ring-offset-1' : 'hover:ring-1 hover:ring-gray-300'} transition-all duration-200 cursor-text`;

    if (multiline) {
        return (
            <textarea
                ref={elementRef as React.RefObject<HTMLTextAreaElement>}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsEditing(true)}
                className={`${editableClassName} resize-none border-none outline-none bg-transparent`}
                placeholder={placeholder}
                rows={3}
            />
        );
    }

    if (htmlContent) {
        return (
            <div
                ref={elementRef as React.RefObject<HTMLDivElement>}
                contentEditable
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{ __html: localValue }}
                onBlur={(e) => {
                    setIsEditing(false);
                    const newValue = e.currentTarget.innerHTML;
                    if (newValue !== value) {
                        onChange(newValue);
                    }
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsEditing(true)}
                onDoubleClick={handleDoubleClick}
                className={editableClassName}
                data-placeholder={placeholder}
            />
        );
    }

    return (
        <input
            ref={elementRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsEditing(true)}
            className={`${editableClassName} border-none outline-none bg-transparent w-full`}
            placeholder={placeholder}
        />
    );
};

export default EditableField;