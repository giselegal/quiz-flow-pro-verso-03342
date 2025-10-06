/**
 * 🧩 COMPONENTE TITLE MODULAR CORRIGIDO
 * 
 * Versão estável sem dependências problemáticas do Chakra UI
 */

import React, { useState } from 'react';
import { useCustomTheme } from '@/hooks/useCustomTheme';
import { TitleBlockProps } from '@/types/modular-editor';

interface ModularTitleProps extends TitleBlockProps {
    isEditable?: boolean;
    isSelected?: boolean;
    onSelect?: () => void;
    onUpdate?: (updates: Partial<TitleBlockProps>) => void;
}

export const ModularTitleStable: React.FC<ModularTitleProps> = ({
    text = "Título",
    fontSize = "xl",
    fontWeight = "bold",
    textAlign = "center",
    color = "gray.800",
    backgroundColor,
    padding = "16px",
    margin = "8px 0",
    isEditable = false,
    isSelected = false,
    onSelect,
    onUpdate
}) => {
    const theme = useCustomTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [localText, setLocalText] = useState(text);

    const containerStyle: React.CSSProperties = {
        backgroundColor: backgroundColor || 'transparent',
        padding,
        margin,
        borderRadius: theme.radii.md,
        boxShadow: isSelected ? `0 0 0 2px ${theme.colors.primary}` : 'none',
        cursor: isEditable ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        position: 'relative'
    };

    const titleStyle: React.CSSProperties = {
        margin: 0,
        fontSize: theme.fontSizes[fontSize as keyof typeof theme.fontSizes] || theme.fontSizes.xl,
        fontWeight: fontWeight === 'bold' ? 'bold' : fontWeight === 'normal' ? 'normal' : '600',
        textAlign: textAlign as 'left' | 'center' | 'right',
        color: theme.colors.gray[800],
        fontFamily: theme.fonts.heading,
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
        if (onUpdate && localText !== text) {
            onUpdate({ text: localText });
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleBlur();
        }
        if (e.key === 'Escape') {
            setLocalText(text);
            setIsEditing(false);
        }
    };

    return (
        <div style={containerStyle} onClick={handleClick}>
            {isEditing ? (
                <input
                    type="text"
                    value={localText}
                    onChange={(e) => setLocalText(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyPress}
                    autoFocus
                    style={{
                        ...titleStyle,
                        background: 'transparent',
                        border: `2px solid ${theme.colors.primary}`,
                        borderRadius: theme.radii.sm,
                        padding: '4px 8px',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                />
            ) : (
                <h2 style={titleStyle}>
                    {text}
                </h2>
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
                    Clique para editar
                </div>
            )}
        </div>
    );
};

export default ModularTitleStable;