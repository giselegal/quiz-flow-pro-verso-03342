/**
 * 🧩 COMPONENTE HEADER MODULAR CORRIGIDO
 * 
 * Versão estável sem dependências problemáticas do Chakra UI
 */

import React from 'react';
import { useCustomTheme } from '@/hooks/useCustomTheme';
import { HeaderBlockProps } from '@/types/modular-editor';

interface ModularHeaderProps extends HeaderBlockProps {
    currentStep?: number;
    totalSteps?: number;
    onBack?: () => void;
    isEditable?: boolean;
    isSelected?: boolean;
    onSelect?: () => void;
}

export const ModularHeaderStable: React.FC<ModularHeaderProps> = ({
    showLogo = true,
    logoUrl,
    title = "Quiz Título",
    subtitle,
    showProgress = true,
    currentStep = 1,
    totalSteps = 10,
    onBack,
    isEditable = false,
    isSelected = false,
    onSelect,
    backgroundColor = '#ffffff',
    padding = '20px',
    margin = '0'
}) => {
    const theme = useCustomTheme();

    const containerStyle: React.CSSProperties = {
        backgroundColor,
        padding,
        margin,
        borderRadius: theme.radii.lg,
        boxShadow: isSelected ? `0 0 0 2px ${theme.colors.primary}` : theme.shadows.sm,
        cursor: isEditable ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        position: 'relative'
    };

    const handleClick = () => {
        if (isEditable && onSelect) {
            onSelect();
        }
    };

    const progressPercentage = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

    return (
        <div style={containerStyle} onClick={handleClick}>
            {/* Header Container */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                {/* Logo Section */}
                {showLogo && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt="Logo"
                                style={{
                                    maxWidth: '100px',
                                    maxHeight: '40px',
                                    objectFit: 'contain'
                                }}
                            />
                        ) : (
                            <div style={{
                                width: '60px',
                                height: '40px',
                                backgroundColor: theme.colors.gray[200],
                                borderRadius: theme.radii.md,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: theme.fontSizes.xs,
                                color: theme.colors.gray[500]
                            }}>
                                LOGO
                            </div>
                        )}
                    </div>
                )}

                {/* Back Button */}
                {onBack && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onBack();
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: theme.radii.md,
                            fontSize: '18px',
                            color: theme.colors.gray[600]
                        }}
                        title="Voltar"
                    >
                        ←
                    </button>
                )}
            </div>

            {/* Title Section */}
            <div style={{ textAlign: 'center', marginBottom: showProgress ? '20px' : '0' }}>
                <h1 style={{
                    margin: '0 0 8px 0',
                    fontSize: theme.fontSizes['2xl'],
                    fontWeight: 'bold',
                    color: theme.colors.gray[800],
                    fontFamily: theme.fonts.heading
                }}>
                    {title}
                </h1>
                {subtitle && (
                    <p style={{
                        margin: 0,
                        fontSize: theme.fontSizes.md,
                        color: theme.colors.gray[600],
                        fontFamily: theme.fonts.body
                    }}>
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Progress Section */}
            {showProgress && (
                <div style={{ marginTop: '16px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                    }}>
                        <span style={{
                            fontSize: theme.fontSizes.sm,
                            color: theme.colors.gray[600]
                        }}>
                            Etapa {currentStep} de {totalSteps}
                        </span>
                        <span style={{
                            fontSize: theme.fontSizes.sm,
                            color: theme.colors.gray[600]
                        }}>
                            {Math.round(progressPercentage)}%
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: theme.colors.gray[200],
                        borderRadius: theme.radii.full,
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${progressPercentage}%`,
                            height: '100%',
                            backgroundColor: theme.colors.primary,
                            borderRadius: theme.radii.full,
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
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
                    padding: '4px 8px',
                    fontSize: theme.fontSizes.xs,
                    fontWeight: 'bold'
                }}>
                    SELECIONADO
                </div>
            )}
        </div>
    );
};

export default ModularHeaderStable;