/**
 * 🎯 BUTTON BLOCK - Componente Modular
 * 
 * Botão de ação genérico usado em várias etapas.
 * Suporta diferentes variantes, tamanhos e ícones.
 */

import React from 'react';
import { BlockComponentProps } from '@/editor/registry/BlockRegistry';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, ShoppingCart, CheckCircle } from 'lucide-react';

const ICONS = {
    'arrow-right': ArrowRight,
    'lock': Lock,
    'cart': ShoppingCart,
    'check': CheckCircle
};

const ButtonBlock: React.FC<BlockComponentProps> = ({
    data,
    isSelected,
    onSelect
}) => {
    // Extrair propriedades
    const text = data.content?.text || 'Botão';
    const subtext = data.content?.subtext || '';
    const iconName = data.content?.icon as keyof typeof ICONS;
    const variant = data.properties?.variant || 'default';
    const size = data.properties?.size || 'default';
    const fullWidth = data.properties?.fullWidth || false;
    const backgroundColor = data.properties?.backgroundColor;
    const textColor = data.properties?.textColor;
    const fontSize = data.properties?.fontSize;
    const fontWeight = data.properties?.fontWeight;

    const Icon = iconName ? ICONS[iconName] : null;

    return (
        <div
            className={cn(
                'relative p-4 transition-all duration-200 cursor-pointer',
                'hover:ring-1 hover:ring-blue-200',
                isSelected && 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/20'
            )}
            onClick={onSelect}
            data-block-id={data.id}
            data-block-type={data.type}
        >
            {isSelected && (
                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded shadow-sm z-10">
                    🔘 Button
                </div>
            )}

            <div className={cn('flex flex-col items-center gap-2', fullWidth && 'w-full')}>
                <Button
                    variant={variant as any}
                    size={size as any}
                    className={cn(
                        'flex items-center gap-2',
                        fullWidth && 'w-full',
                        fontSize && `text-${fontSize}`,
                        fontWeight && `font-${fontWeight}`
                    )}
                    style={{
                        backgroundColor: backgroundColor || undefined,
                        color: textColor || undefined
                    }}
                    disabled={true} // Preview mode
                >
                    {text}
                    {Icon && <Icon className="w-4 h-4" />}
                </Button>

                {subtext && (
                    <p className="text-xs text-gray-500 text-center">
                        {subtext}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ButtonBlock;
