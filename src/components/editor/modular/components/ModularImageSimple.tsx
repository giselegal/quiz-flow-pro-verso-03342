/**
 * 🖼️ COMPONENTE IMAGE MODULAR SIMPLIFICADO - Versão Temporária
 * 
 * Versão simplificada sem dependências problemáticas do Chakra UI
 */

import React from 'react';
import { ImageBlockProps } from '@/types/modular-editor';

interface ModularImageProps extends ImageBlockProps {
    isEditable?: boolean;
    isSelected?: boolean;
    onSelect?: () => void;
    onUpdate?: (newProps: Partial<ImageBlockProps>) => void;
}

export const ModularImageSimple: React.FC<ModularImageProps> = ({
    src,
    alt = "Imagem",
    width = "100%",
    height = "auto",
    borderRadius = "8px",
    objectFit = "cover",
    isEditable = false,
    isSelected = false,
    onSelect,
    onUpdate
}) => {
    const containerStyle: React.CSSProperties = {
        border: isSelected ? '2px solid #4299e1' : '1px solid #e2e8f0',
        borderRadius,
        padding: '8px',
        cursor: isEditable ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        position: 'relative'
    };

    const handleClick = () => {
        if (isEditable && onSelect) {
            onSelect();
        }
    };

    return (
        <div style={containerStyle} onClick={handleClick}>
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    style={{
                        width,
                        height,
                        objectFit,
                        borderRadius,
                        display: 'block'
                    }}
                />
            ) : (
                <div style={{
                    width,
                    height: '200px',
                    backgroundColor: '#f7fafc',
                    borderRadius,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    border: '2px dashed #cbd5e0'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>🖼️</div>
                    <div style={{ color: '#718096', fontSize: '14px' }}>
                        {isEditable ? 'Clique para adicionar imagem' : 'Sem imagem'}
                    </div>
                </div>
            )}

            {isSelected && (
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: '#4299e1',
                    color: 'white',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                }}>
                    SELECIONADO
                </div>
            )}
        </div>
    );
};

export default ModularImageSimple;