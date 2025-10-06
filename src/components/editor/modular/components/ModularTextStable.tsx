/**
 * 🧩 COMPONENTE TEXT MODULAR CORRIGIDO
 * 
 * Versão estável sem dependências problemáticas do Chakra UI
 */

import React, { useState } from 'react';
import { useCustomTheme } from '@/hooks/useCustomTheme';
import { TextBlockProps } from '@/types/modular-editor';

interface ModularTextProps extends TextBlockProps {
    isEditable?: boolean;
    isSelected?: boolean;
    onSelect?: () => void;
    onUpdate?: (updates: Partial<TextBlockProps>) => void;
    maxLength?: number;
    placeholder?: string;
}

export const ModularTextStable: React.FC<ModularTextProps> = ({
    content = "Texto de exemplo",
    fontSize = "md",
    fontWeight = "normal",
    textAlign = "left",
    color = "gray.700",
    backgroundColor,
    padding = "12px",
    margin = "8px 0",
    maxLength = 500,
    placeholder = "Digite o texto aqui...",
    isEditable = false,
    isSelected = false,
    onSelect,
    onUpdate
}) => {
    const theme = useCustomTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [localText, setLocalText] = useState(content);

    const containerStyle: React.CSSProperties = {
        backgroundColor: backgroundColor || 'transparent',
        padding,
        margin,
        borderRadius: theme.radii.md,
        boxShadow: isSelected ? `0 0 0 2px ${theme.colors.primary}` : 'none',
        cursor: isEditable ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        position: 'relative',
        minHeight: '50px'
    };

    const textStyle: React.CSSProperties = {
        margin: 0,
        fontSize: theme.fontSizes[fontSize as keyof typeof theme.fontSizes] || theme.fontSizes.md,
        fontWeight: fontWeight === 'bold' ? 'bold' : fontWeight === 'normal' ? 'normal' : '400',
        textAlign: textAlign as 'left' | 'center' | 'right',
        color: theme.colors.gray[700],
        fontFamily: theme.fonts.body,
        lineHeight: '1.6',
        wordWrap: 'break-word'
    };

    const handleClick = () => {
        if (isEditable && onSelect) {
            onSelect();
        }
        if (isEditable && !isEditing) {
            setIsEditing(true);
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (onUpdate && localText !== content) {
            onUpdate({ content: localText });
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setLocalText(content);
            setIsEditing(false);
        }
        // Para textarea, Ctrl+Enter salva
        if (e.key === 'Enter' && e.ctrlKey) {
            handleBlur();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        if (maxLength && newText.length <= maxLength) {
            setLocalText(newText);
        } else if (!maxLength) {
            setLocalText(newText);
        }
    };

    return (
        <div style={containerStyle} onClick={handleClick}>
            {isEditing ? (
                <textarea
                    value={localText}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyPress}
                    placeholder={placeholder}
                    autoFocus
                    style={{
                        ...textStyle,
                        background: 'transparent',
                        border: `2px solid ${theme.colors.primary}`,
                        borderRadius: theme.radii.sm,
                        padding: '8px',
                        width: '100%',
                        minHeight: '100px',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                        outline: 'none'
                    }}
                />
            ) : (
                <div style={textStyle}>
                    {content || placeholder}
                </div>
            )}

            {/* Character Count */}
            {isEditing && maxLength && (
                <div style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '8px',
                    fontSize: theme.fontSizes.xs,
                    color: localText.length > maxLength * 0.8 ? theme.colors.warning : theme.colors.gray[400]
                }}>
                    {localText.length}/{maxLength}
                </div>
            )}

            {/* Selection Indicator */}
            {isSelected && (
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: theme.colors.primary,
                    color: 'white',
                    borderRadius: theme.radii.sm,
                    padding: '2px 6px',
                    fontSize: theme.fontSizes.xs,
                    fontWeight: 'bold'
                }}>
                    SELECIONADO
                </div>
            )}

            {/* Edit Hint */}
            {isEditable && !isEditing && (
                <div style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '4px',
                    fontSize: theme.fontSizes.xs,
                    color: theme.colors.gray[400],
                    opacity: isSelected ? 1 : 0,
                    transition: 'opacity 0.2s ease'
                }}>
                    Clique para editar • Ctrl+Enter para salvar
                </div>
            )}
        </div>
    );
};

export default ModularTextStable;