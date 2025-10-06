/**
 * ⚏ COMPONENTE OPTIONS GRID MODULAR SIMPLIFICADO - Versão Temporária
 * 
 * Versão simplificada sem dependências problemáticas do Chakra UI
 */

import React from 'react';

export interface Option {
    id: string;
    text: string;
    image?: string;
    value?: any;
}

export interface OptionsGridBlockProps {
    options: Option[];
    columns?: number;
    spacing?: string;
    allowMultiple?: boolean;
    selectedOptions?: string[];
    onSelectionChange?: (selectedIds: string[]) => void;
}

interface ModularOptionsGridProps extends OptionsGridBlockProps {
    isEditable?: boolean;
    isSelected?: boolean;
    onSelect?: () => void;
    onUpdate?: (newProps: Partial<OptionsGridBlockProps>) => void;
}

export const ModularOptionsGridSimple: React.FC<ModularOptionsGridProps> = ({
    options = [
        { id: '1', text: 'Opção 1' },
        { id: '2', text: 'Opção 2' }
    ],
    columns = 2,
    spacing = '12px',
    allowMultiple = false,
    selectedOptions = [],
    onSelectionChange,
    isEditable = false,
    isSelected = false,
    onSelect,
    onUpdate
}) => {
    const containerStyle: React.CSSProperties = {
        border: isSelected ? '2px solid #4299e1' : '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '16px',
        cursor: isEditable ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        position: 'relative'
    };

    const gridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: spacing,
        width: '100%'
    };

    const handleContainerClick = () => {
        if (isEditable && onSelect) {
            onSelect();
        }
    };

    const handleOptionClick = (optionId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!onSelectionChange) return;

        let newSelection: string[];

        if (allowMultiple) {
            if (selectedOptions.includes(optionId)) {
                newSelection = selectedOptions.filter(id => id !== optionId);
            } else {
                newSelection = [...selectedOptions, optionId];
            }
        } else {
            newSelection = selectedOptions.includes(optionId) ? [] : [optionId];
        }

        onSelectionChange(newSelection);
    };

    return (
        <div style={containerStyle} onClick={handleContainerClick}>
            <div style={gridStyle}>
                {options.map((option) => {
                    const isOptionSelected = selectedOptions.includes(option.id);

                    const optionStyle: React.CSSProperties = {
                        padding: '16px',
                        border: isOptionSelected ? '2px solid #4299e1' : '1px solid #e2e8f0',
                        borderRadius: '8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: isOptionSelected ? '#ebf8ff' : 'white',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px'
                    };

                    return (
                        <div
                            key={option.id}
                            style={optionStyle}
                            onClick={(e) => handleOptionClick(option.id, e)}
                            onMouseEnter={(e) => {
                                if (!isOptionSelected) {
                                    e.currentTarget.style.borderColor = '#4299e1';
                                    e.currentTarget.style.backgroundColor = '#f7fafc';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isOptionSelected) {
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                    e.currentTarget.style.backgroundColor = 'white';
                                }
                            }}
                        >
                            {option.image && (
                                <img
                                    src={option.image}
                                    alt={option.text}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        borderRadius: '50%'
                                    }}
                                />
                            )}
                            <div style={{
                                fontWeight: isOptionSelected ? '600' : '400',
                                color: isOptionSelected ? '#1a202c' : '#2d3748'
                            }}>
                                {option.text}
                            </div>
                            {isOptionSelected && (
                                <div style={{
                                    width: '16px',
                                    height: '16px',
                                    backgroundColor: '#4299e1',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '10px'
                                }}>
                                    ✓
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {options.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#718096',
                    border: '2px dashed #cbd5e0',
                    borderRadius: '8px',
                    backgroundColor: '#f7fafc'
                }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚏</div>
                    <div>Nenhuma opção configurada</div>
                    {isEditable && (
                        <div style={{ fontSize: '12px', marginTop: '4px' }}>
                            Clique para editar as opções
                        </div>
                    )}
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

export default ModularOptionsGridSimple;