/**
 * 🎯 BUTTON BLOCK - Bloco de Botão
 * 
 * Componente modular para botões de ação.
 * Consome 100% das propriedades do JSON.
 */

import React from 'react';
import { BlockComponentProps } from '@/types/blockTypes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const ButtonBlock: React.FC<BlockComponentProps> = ({
    data,
    isSelected,
    isEditable,
    onSelect,
}) => {
    const {
        text = 'Botão',
        variant = 'default',
        size = 'lg',
        className: customClassName,
        icon
    } = data.props;

    return (
        <div
            className={cn(
                'button-block relative p-4 transition-all duration-200',
                isEditable && 'cursor-pointer hover:bg-gray-50',
                isSelected && 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/30',
                customClassName
            )}
            onClick={isEditable ? onSelect : undefined}
            data-block-id={data.id}
        >
            {/* Indicador de seleção */}
            {isSelected && (
                <div className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded shadow-sm z-10">
                    🔘 Botão
                </div>
            )}

            {/* Botão */}
            <div className="flex justify-center">
                <Button
                    variant={variant as any}
                    size={size as any}
                    disabled={isEditable} // Desabilitar no modo edição
                    className="min-w-[200px]"
                >
                    {icon && <span className="mr-2">{icon}</span>}
                    {text}
                </Button>
            </div>
        </div>
    );
};

export default ButtonBlock;
