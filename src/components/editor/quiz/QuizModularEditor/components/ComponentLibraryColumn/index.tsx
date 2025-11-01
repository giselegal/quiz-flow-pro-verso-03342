import React from 'react';
import type { Block } from '@/services/UnifiedTemplateRegistry';

export type ComponentLibraryColumnProps = {
    currentStepKey: string | null;
    onAddBlock: (type: Block['type']) => void;
};

const DEFAULT_BLOCK_TYPES: Array<Block['type']> = [
    // Lista mínima; ajustaremos conforme o registry canônico
    'text' as Block['type'],
    'heading' as Block['type'],
    'image' as Block['type'],
    'button' as Block['type'],
];

export default function ComponentLibraryColumn({ currentStepKey, onAddBlock }: ComponentLibraryColumnProps) {
    return (
        <div className="p-2 space-y-2">
            <div className="text-sm font-medium">Biblioteca</div>
            {!currentStepKey && (
                <div className="text-xs text-muted-foreground">Selecione uma etapa para adicionar blocos.</div>
            )}
            <ul className="grid grid-cols-2 gap-2">
                {DEFAULT_BLOCK_TYPES.map((t) => (
                    <li key={t}>
                        <button
                            className="w-full border rounded px-2 py-2 text-xs hover:bg-accent disabled:opacity-50"
                            disabled={!currentStepKey}
                            onClick={() => onAddBlock(t)}
                        >
                            + {t}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
