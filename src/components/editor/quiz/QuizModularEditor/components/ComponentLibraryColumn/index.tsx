// Biblioteca de componentes — versão mínima para desbloquear a migração do editor modular
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Block } from '@/services/UnifiedTemplateRegistry';

export type ComponentLibraryColumnProps = {
    currentStepKey: string | null;
    onAddBlock: (type: Block['type']) => void;
};

const DEFAULT_BLOCK_TYPES: Array<{ type: Block['type']; label: string }> = [
    { type: 'text' as Block['type'], label: 'Texto' },
    { type: 'heading' as Block['type'], label: 'Título' },
    { type: 'image' as Block['type'], label: 'Imagem' },
    { type: 'button' as Block['type'], label: 'Botão' },
];

function DraggableLibraryItem({ type, label, disabled }: { type: Block['type']; label: string; disabled?: boolean }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `lib:${type}`,
        disabled,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`w-full border rounded px-2 py-2 text-xs cursor-grab hover:bg-accent disabled:opacity-50 ${isDragging ? 'shadow-lg' : ''}`}
        >
            + {label}
        </div>
    );
}

export default function ComponentLibraryColumn({ currentStepKey, onAddBlock }: ComponentLibraryColumnProps) {
    return (
        <div className="p-2 space-y-2">
            <div className="text-sm font-medium">Biblioteca</div>
            {!currentStepKey && (
                <div className="text-xs text-muted-foreground">Selecione uma etapa para adicionar blocos.</div>
            )}
            <ul className="grid grid-cols-2 gap-2">
                {DEFAULT_BLOCK_TYPES.map((item) => (
                    <li key={item.type}>
                        <DraggableLibraryItem
                            type={item.type}
                            label={item.label}
                            disabled={!currentStepKey}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}
