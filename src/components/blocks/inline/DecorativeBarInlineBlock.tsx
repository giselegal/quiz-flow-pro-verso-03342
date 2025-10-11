import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

/**
 * DecorativeBarInlineBlock - Componente modular para barras decorativas/separadoras
 * 
 * FEATURES:
 * - Múltiplos estilos (solid, dashed, dotted, double, gradient)
 * - Cores personalizáveis
 * - Largura e altura configuráveis
 * - Posicionamento (left, center, right)
 * - Ícone opcional no centro
 * - Animação opcional
 * 
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | DECORATIVO
 */
const DecorativeBarInlineBlock: React.FC<BlockComponentProps> = ({
    block,
    isSelected = false,
    onClick,
    onPropertyChange,
    className = '',
}) => {
    // Extrair propriedades com valores padrão
    const {
        style = 'solid', // 'solid' | 'dashed' | 'dotted' | 'double' | 'gradient'
        color = '#B89B7A', // brand-gold
        gradientFrom = '#B89B7A',
        gradientTo = '#8B7355',
        height = 2,
        width = '100%', // '25%' | '50%' | '75%' | '100%' | 'auto'
        align = 'center', // 'left' | 'center' | 'right'
        icon = '', // emoji ou text
        iconSize = 'text-lg',
        animated = false,
        // Espaçamento
        marginTop = 24,
        marginBottom = 24,
        marginLeft = 0,
        marginRight = 0,
    } = block?.properties ?? {};

    // Mapeamento de alinhamento
    const alignClasses = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
    };

    // Estilo da barra baseado no tipo
    const getBarStyle = () => {
        const baseStyle: React.CSSProperties = {
            height: `${height}px`,
            width: typeof width === 'number' ? `${width}%` : width,
        };

        switch (style) {
            case 'solid':
                return {
                    ...baseStyle,
                    backgroundColor: color,
                };
            case 'dashed':
                return {
                    ...baseStyle,
                    borderTop: `${height}px dashed ${color}`,
                    height: 0,
                };
            case 'dotted':
                return {
                    ...baseStyle,
                    borderTop: `${height}px dotted ${color}`,
                    height: 0,
                };
            case 'double':
                return {
                    ...baseStyle,
                    borderTop: `${height}px double ${color}`,
                    height: 0,
                };
            case 'gradient':
                return {
                    ...baseStyle,
                    background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
                };
            default:
                return {
                    ...baseStyle,
                    backgroundColor: color,
                };
        }
    };

    return (
        <div
            className={cn(
                'decorative-bar-inline-block',
                'flex items-center w-full',
                alignClasses[align as keyof typeof alignClasses],
                isSelected && 'ring-2 ring-blue-500 ring-offset-4 rounded',
                className
            )}
            style={{
                marginTop: `${marginTop}px`,
                marginBottom: `${marginBottom}px`,
                marginLeft: `${marginLeft}px`,
                marginRight: `${marginRight}px`,
            }}
            onClick={onClick}
        >
            {!icon && (
                <div
                    className={cn(
                        'decorative-bar',
                        animated && 'animate-pulse'
                    )}
                    style={getBarStyle()}
                />
            )}

            {icon && (
                <div className="flex items-center gap-4 w-full">
                    <div
                        className={cn(
                            'decorative-bar flex-grow',
                            animated && 'animate-pulse'
                        )}
                        style={getBarStyle()}
                    />
                    <span className={cn('decorative-icon', iconSize, 'flex-shrink-0')}>
                        {icon}
                    </span>
                    <div
                        className={cn(
                            'decorative-bar flex-grow',
                            animated && 'animate-pulse'
                        )}
                        style={getBarStyle()}
                    />
                </div>
            )}
        </div>
    );
};

DecorativeBarInlineBlock.displayName = 'DecorativeBarInlineBlock';

export default DecorativeBarInlineBlock;
