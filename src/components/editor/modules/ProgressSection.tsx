import React, { useEffect, useState } from 'react';
import { useEditor } from '@craftjs/core';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BaseModuleProps, themeColors, withCraftjsComponent } from './types';

export interface ProgressSectionProps extends BaseModuleProps {
    // Configurações de progresso
    percentage?: number;
    label?: string;
    showLabel?: boolean;
    showPercentage?: boolean;

    // Configurações visuais da barra
    progressColor?: string;
    backgroundColor?: string;
    size?: 'sm' | 'md' | 'lg';
    barStyle?: 'rounded' | 'square' | 'pill';

    // Animações
    animated?: boolean;
    animationDuration?: number; // em segundos
    animationDelay?: number; // em segundos
    pulseEffect?: boolean;

    // Layout
    layout?: 'horizontal' | 'vertical' | 'circular';
    alignment?: 'left' | 'center' | 'right';

    // Gradiente e efeitos visuais
    useGradient?: boolean;
    gradientColors?: [string, string];
    showGlow?: boolean;

    // Texto e formatação
    textColor?: string;
    labelSize?: 'sm' | 'md' | 'lg';
    percentageSize?: 'sm' | 'md' | 'lg';

    // Espaçamento
    padding?: 'sm' | 'md' | 'lg';
    marginBottom?: 'sm' | 'md' | 'lg';
}

const ProgressSectionComponent: React.FC<ProgressSectionProps> = ({
    // Progress props
    percentage = 75,
    label = 'Compatibilidade:',
    showLabel = true,
    showPercentage = true,

    // Visual props
    progressColor = themeColors.primary,
    backgroundColor = '#F3E8E6',
    size = 'md',
    barStyle = 'rounded',

    // Animation props
    animated = true,
    animationDuration = 1.5,
    animationDelay = 0.5,
    pulseEffect = false,

    // Layout props
    layout = 'horizontal',
    alignment = 'center',

    // Gradient props
    useGradient = false,
    gradientColors = [themeColors.primary, themeColors.secondary],
    showGlow = false,

    // Text props
    textColor = themeColors.brown,
    labelSize = 'md',
    percentageSize = 'md',

    // Spacing props
    padding = 'md',
    marginBottom = 'md',

    // System props
    className = '',
    isSelected = false,
}) => {
    const { enabled } = useEditor((state) => ({
        enabled: state.options.enabled
    }));

    const [displayPercentage, setDisplayPercentage] = useState(animated ? 0 : percentage);

    // Animação do valor da porcentagem
    useEffect(() => {
        if (!animated) {
            setDisplayPercentage(percentage);
            return;
        }

        const timer = setTimeout(() => {
            const increment = percentage / (animationDuration * 60); // 60 FPS
            let current = 0;

            const interval = setInterval(() => {
                current += increment;
                if (current >= percentage) {
                    setDisplayPercentage(percentage);
                    clearInterval(interval);
                } else {
                    setDisplayPercentage(Math.round(current));
                }
            }, 1000 / 60);

            return () => clearInterval(interval);
        }, animationDelay * 1000);

        return () => clearTimeout(timer);
    }, [percentage, animated, animationDuration, animationDelay]);

    // Classes para tamanho da barra
    const sizeClasses = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4'
    };

    // Classes para estilo da barra
    const barStyleClasses = {
        rounded: 'rounded-md',
        square: 'rounded-none',
        pill: 'rounded-full'
    };

    // Classes para tamanho do texto
    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };

    // Classes para alinhamento
    const alignmentClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    };

    // Classes de espaçamento
    const paddingClasses = {
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6'
    };

    const marginBottomClasses = {
        sm: 'mb-2',
        md: 'mb-4',
        lg: 'mb-6'
    };

    // Estilo do gradiente
    const progressStyle = useGradient
        ? {
            background: `linear-gradient(90deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`,
            ...(showGlow && {
                boxShadow: `0 0 10px ${gradientColors[0]}40`,
                filter: 'drop-shadow(0 0 3px rgba(184, 155, 122, 0.3))'
            })
        }
        : {
            backgroundColor: progressColor,
            ...(showGlow && {
                boxShadow: `0 0 10px ${progressColor}40`,
                filter: 'drop-shadow(0 0 3px rgba(184, 155, 122, 0.3))'
            })
        };

    // Renderização para layout circular (futuro)
    if (layout === 'circular') {
        // Implementação do progresso circular será adicionada futuramente
        return (
            <div className={cn(
                'w-full flex justify-center',
                paddingClasses[padding],
                marginBottomClasses[marginBottom],
                className
            )}>
                <div className="text-center">
                    <div className="w-24 h-24 rounded-full border-4 border-gray-200 flex items-center justify-center">
                        <span className="text-xl font-bold" style={{ color: textColor }}>
                            {displayPercentage}%
                        </span>
                    </div>
                    {showLabel && label && (
                        <p className={cn('mt-2', textSizeClasses[labelSize])} style={{ color: textColor }}>
                            {label}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: animationDelay }}
            className={cn(
                'w-full transition-all duration-200',
                paddingClasses[padding],
                marginBottomClasses[marginBottom],
                alignmentClasses[alignment],
                // Estados do editor
                enabled && isSelected && 'ring-2 ring-[#B89B7A] ring-offset-2 bg-[#B89B7A]/5',
                enabled && !isSelected && 'hover:ring-1 hover:ring-[#B89B7A]/50 hover:bg-[#B89B7A]/5',
                className
            )}
        >
            {/* Header com label e porcentagem */}
            <div className="flex justify-between items-center mb-2">
                {showLabel && label && (
                    <span
                        className={cn('font-medium', textSizeClasses[labelSize])}
                        style={{ color: textColor }}
                    >
                        {label}
                    </span>
                )}

                {showPercentage && (
                    <motion.span
                        key={displayPercentage} // Para re-animar quando muda
                        initial={{ scale: animated ? 0.8 : 1, opacity: animated ? 0.5 : 1 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn(
                            'font-bold',
                            textSizeClasses[percentageSize],
                            pulseEffect && 'animate-pulse'
                        )}
                        style={{ color: progressColor }}
                    >
                        {displayPercentage}%
                    </motion.span>
                )}
            </div>

            {/* Barra de progresso */}
            <div className="relative">
                {/* Background da barra */}
                <div
                    className={cn(
                        'w-full',
                        sizeClasses[size],
                        barStyleClasses[barStyle],
                        'overflow-hidden'
                    )}
                    style={{ backgroundColor }}
                >
                    {/* Barra de progresso com animação */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${displayPercentage}%` }}
                        transition={{
                            duration: animated ? animationDuration : 0,
                            delay: animationDelay,
                            ease: "easeOut"
                        }}
                        className={cn(
                            'h-full transition-all duration-300',
                            barStyleClasses[barStyle],
                            pulseEffect && 'animate-pulse'
                        )}
                        style={progressStyle}
                    >
                        {/* Brilho interno (opcional) */}
                        {showGlow && (
                            <div
                                className={cn(
                                    'h-full w-full opacity-50',
                                    barStyleClasses[barStyle]
                                )}
                                style={{
                                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                                }}
                            />
                        )}
                    </motion.div>
                </div>

                {/* Indicador visual no final da barra (opcional) */}
                {displayPercentage > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: animationDelay + animationDuration }}
                        className="absolute top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-md"
                        style={{
                            left: `calc(${displayPercentage}% - 4px)`,
                            backgroundColor: progressColor
                        }}
                    />
                )}
            </div>

            {/* Editor overlay quando selecionado */}
            {enabled && isSelected && (
                <div className="absolute -top-1 -right-1 bg-[#B89B7A] text-white text-xs px-2 py-1 rounded shadow-lg">
                    Progress
                </div>
            )}
        </motion.div>
    );
};

// Configurações do Craft.js para o ProgressSection
export const ProgressSection = withCraftjsComponent(ProgressSectionComponent, {
    props: {
        // Progress props
        percentage: {
            type: 'number',
            label: 'Porcentagem',
            min: 0,
            max: 100,
            step: 1
        },
        label: { type: 'text', label: 'Rótulo' },
        showLabel: { type: 'checkbox', label: 'Mostrar Rótulo' },
        showPercentage: { type: 'checkbox', label: 'Mostrar Porcentagem' },

        // Visual props
        progressColor: { type: 'color', label: 'Cor da Barra' },
        backgroundColor: { type: 'color', label: 'Cor de Fundo' },
        size: {
            type: 'select',
            label: 'Tamanho',
            options: [
                { value: 'sm', label: 'Pequeno' },
                { value: 'md', label: 'Médio' },
                { value: 'lg', label: 'Grande' }
            ]
        },
        barStyle: {
            type: 'select',
            label: 'Estilo da Barra',
            options: [
                { value: 'rounded', label: 'Arredondado' },
                { value: 'square', label: 'Quadrado' },
                { value: 'pill', label: 'Pílula' }
            ]
        },

        // Animation props
        animated: { type: 'checkbox', label: 'Animado' },
        animationDuration: {
            type: 'number',
            label: 'Duração da Animação (s)',
            min: 0.1,
            max: 5,
            step: 0.1
        },
        animationDelay: {
            type: 'number',
            label: 'Atraso da Animação (s)',
            min: 0,
            max: 3,
            step: 0.1
        },
        pulseEffect: { type: 'checkbox', label: 'Efeito Pulse' },

        // Layout props
        layout: {
            type: 'select',
            label: 'Layout',
            options: [
                { value: 'horizontal', label: 'Horizontal' },
                { value: 'vertical', label: 'Vertical' },
                { value: 'circular', label: 'Circular' }
            ]
        },
        alignment: {
            type: 'select',
            label: 'Alinhamento',
            options: [
                { value: 'left', label: 'Esquerda' },
                { value: 'center', label: 'Centro' },
                { value: 'right', label: 'Direita' }
            ]
        },

        // Gradient props
        useGradient: { type: 'checkbox', label: 'Usar Gradiente' },
        showGlow: { type: 'checkbox', label: 'Efeito Brilho' },

        // Text props
        textColor: { type: 'color', label: 'Cor do Texto' },
        labelSize: {
            type: 'select',
            label: 'Tamanho do Rótulo',
            options: [
                { value: 'sm', label: 'Pequeno' },
                { value: 'md', label: 'Médio' },
                { value: 'lg', label: 'Grande' }
            ]
        },
        percentageSize: {
            type: 'select',
            label: 'Tamanho da Porcentagem',
            options: [
                { value: 'sm', label: 'Pequeno' },
                { value: 'md', label: 'Médio' },
                { value: 'lg', label: 'Grande' }
            ]
        },

        // Spacing props
        padding: {
            type: 'select',
            label: 'Espaçamento Interno',
            options: [
                { value: 'sm', label: 'Pequeno' },
                { value: 'md', label: 'Médio' },
                { value: 'lg', label: 'Grande' }
            ]
        },
        marginBottom: {
            type: 'select',
            label: 'Margem Inferior',
            options: [
                { value: 'sm', label: 'Pequena' },
                { value: 'md', label: 'Média' },
                { value: 'lg', label: 'Grande' }
            ]
        }
    },
    related: {
        // Toolbar será implementada posteriormente
    }
});