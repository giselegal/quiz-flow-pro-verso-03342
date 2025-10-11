import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

/**
 * SpinnerBlock - Componente simples de spinner/loader
 * 
 * FEATURES:
 * - Múltiplos tamanhos (xs, sm, md, lg, xl)
 * - Cores personalizáveis
 * - Variações de velocidade
 * - Texto de loading opcional
 * - Centralizado ou inline
 * 
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | LEVE
 */
const SpinnerBlock: React.FC<BlockComponentProps> = ({
    block,
    isSelected = false,
    onClick,
    onPropertyChange,
    className = '',
}) => {
    // Extrair propriedades com valores padrão
    const {
        size = 'md', // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
        color = '#B89B7A', // brand-gold
        speed = 'normal', // 'slow' | 'normal' | 'fast'
        thickness = 'normal', // 'thin' | 'normal' | 'thick'
        text = '', // Texto opcional embaixo do spinner
        textSize = 'sm', // 'xs' | 'sm' | 'base' | 'lg'
        centered = true, // Centralizar no container
        // Espaçamento
        marginTop = 16,
        marginBottom = 16,
        marginLeft = 0,
        marginRight = 0,
    } = block?.properties ?? {};

    // Mapeamento de tamanhos (width/height)
    const sizeClasses = {
        xs: 'w-4 h-4',
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    // Mapeamento de espessura da borda
    const thicknessClasses = {
        thin: 'border-2',
        normal: 'border-4',
        thick: 'border-[6px]',
    };

    // Mapeamento de velocidade de animação
    const speedClasses = {
        slow: 'animate-spin-slow',
        normal: 'animate-spin',
        fast: 'animate-spin-fast',
    };

    // Mapeamento de tamanhos de texto
    const textSizeClasses = {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
    };

    return (
        <div
            className={cn(
                'spinner-block',
                centered && 'flex flex-col items-center justify-center',
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
            {/* Spinner circular */}
            <div
                className={cn(
                    'rounded-full border-t-transparent',
                    sizeClasses[size as keyof typeof sizeClasses],
                    thicknessClasses[thickness as keyof typeof thicknessClasses],
                    speedClasses[speed as keyof typeof speedClasses]
                )}
                style={{
                    borderColor: `${color}33`, // 20% opacity para borda base
                    borderTopColor: color, // Cor sólida para parte animada
                }}
                role="status"
                aria-label="Carregando"
            />

            {/* Texto opcional */}
            {text && (
                <p
                    className={cn(
                        'mt-3',
                        textSizeClasses[textSize as keyof typeof textSizeClasses]
                    )}
                    style={{ color }}
                >
                    {text}
                </p>
            )}
        </div>
    );
};

SpinnerBlock.displayName = 'SpinnerBlock';

export default SpinnerBlock;
