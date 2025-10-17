/**
 * 🎯 COMPONENTES HELPER PARA DROP ZONES
 * 
 * Componentes reutilizáveis para drag & drop nos steps modulares
 * Evita duplicação de código entre ModularIntroStep, ModularQuestionStep, etc.
 */

import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface BlockWrapperProps {
    id: string;
    stepKey: string;
    index: number;
    children: React.ReactNode;
}

/**
 * Wrapper que adiciona drop zone ANTES de cada bloco
 */
export const BlockWrapper: React.FC<BlockWrapperProps> = ({ id, stepKey, index, children }) => {
    const dropZoneId = `drop-before-${id}`;
    const { setNodeRef, isOver } = useDroppable({
        id: dropZoneId,
        data: {
            dropZone: 'before',
            blockId: id,
            stepKey: stepKey,
            insertIndex: index
        }
    });

    return (
        <div className="relative group">
            {/* 🎯 ZONA DROPPABLE antes do bloco */}
            <div
                ref={setNodeRef}
                className={`h-3 -my-1.5 relative transition-all duration-200 border-2 rounded ${isOver
                        ? 'bg-blue-100 border-blue-400 border-dashed'
                        : 'border-transparent hover:bg-blue-50 hover:border-blue-300 hover:border-dashed'
                    }`}
            >
                <div className={`absolute inset-0 flex items-center justify-center ${isOver ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <span className="text-[10px] font-medium text-blue-600 bg-white px-2 py-0.5 rounded shadow-sm">
                        {isOver ? '⬇ Soltar aqui' : '+ Soltar antes'}
                    </span>
                </div>
            </div>

            {/* Bloco */}
            <div className="my-2">
                {children}
            </div>
        </div>
    );
};

interface DropZoneEndProps {
    stepKey: string;
    insertIndex: number;
}

/**
 * Drop zone ao FINAL da lista de blocos
 */
export const DropZoneEnd: React.FC<DropZoneEndProps> = ({ stepKey, insertIndex }) => {
    const dropZoneId = `drop-end-${stepKey}`;
    const { setNodeRef, isOver } = useDroppable({
        id: dropZoneId,
        data: {
            dropZone: 'after',
            stepKey: stepKey,
            insertIndex: insertIndex
        }
    });

    return (
        <div
            ref={setNodeRef}
            className={`h-16 mt-4 border-2 border-dashed rounded-lg transition-all
                      flex items-center justify-center text-sm cursor-pointer ${isOver
                    ? 'border-blue-400 bg-blue-100 text-blue-700'
                    : 'border-gray-300 text-gray-500 hover:border-blue-400 hover:bg-blue-50'
                }`}
        >
            <span className="font-medium">
                {isOver ? '⬇ Soltar aqui' : '+ Solte componente aqui para adicionar ao final'}
            </span>
        </div>
    );
};
