/**
 * 🎯 BLOCK RENDERER - Renderizador Universal
 * 
 * Componente que renderiza qualquer bloco baseado em JSON.
 * Consulta o BlockRegistry para obter o componente correto.
 */

import React from 'react';
import { BlockData, BlockComponentProps } from '@/types/blockTypes';
import { getBlockComponent } from '@/editor/registry/BlockComponentMap';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface BlockRendererProps {
    /** Dados do bloco a renderizar */
    block: BlockData;

    /** Se o bloco está selecionado */
    isSelected?: boolean;

    /** Se o bloco é editável */
    isEditable?: boolean;

    /** Callback ao selecionar o bloco */
    onSelect?: () => void;

    /** Callback ao atualizar props do bloco */
    onUpdate?: (updates: Partial<BlockData['props']>) => void;

    /** Callback ao deletar o bloco */
    onDelete?: () => void;

    /** Callback ao duplicar o bloco */
    onDuplicate?: () => void;

    /** Callback ao mover bloco para cima */
    onMoveUp?: () => void;

    /** Callback ao mover bloco para baixo */
    onMoveDown?: () => void;

    /** Classe CSS adicional */
    className?: string;
}

/**
 * Renderizador universal de blocos
 */
export const BlockRenderer: React.FC<BlockRendererProps> = ({
    block,
    isSelected = false,
    isEditable = true,
    onSelect,
    onUpdate,
    onDelete,
    onDuplicate,
    onMoveUp,
    onMoveDown,
    className
}) => {
    // Buscar componente no registry
    const Component = getBlockComponent(block.component);

    // Se componente não encontrado, mostrar erro
    if (!Component) {
        return (
            <div
                className={cn(
                    'p-4 border-2 border-red-300 bg-red-50 rounded-lg',
                    'flex items-center gap-3',
                    className
                )}
            >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                    <div className="text-red-700 font-semibold text-sm">
                        Componente não encontrado
                    </div>
                    <div className="text-red-600 text-xs mt-1">
                        "{block.component}" não está registrado no BlockRegistry
                    </div>
                    <div className="text-red-500 text-xs mt-1">
                        Block ID: {block.id} | Type: {block.type}
                    </div>
                </div>
            </div>
        );
    }

    // Preparar props para o componente
    const componentProps: BlockComponentProps = {
        data: block,
        isSelected,
        isEditable,
        onSelect: onSelect || (() => { }),
        onUpdate: onUpdate || (() => { }),
        onDelete,
        onDuplicate,
        onMoveUp,
        onMoveDown,
    };

    // Renderizar componente
    return (
        <div
            className={cn(
                'block-wrapper',
                isSelected && 'block-selected',
                className
            )}
            data-block-id={block.id}
            data-block-type={block.type}
            data-block-component={block.component}
            data-block-order={block.order}
        >
            <Component {...componentProps} />
        </div>
    );
};

export default BlockRenderer;
