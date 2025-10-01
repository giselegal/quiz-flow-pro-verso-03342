import React from 'react';

interface BlockPaletteProps {
    onInsert?: (type: string) => void;
}

const CATALOG: { type: string; label: string; description?: string }[] = [
    { type: 'text', label: 'Texto' },
    { type: 'image', label: 'Imagem' },
    { type: 'question', label: 'Pergunta' },
    { type: 'cta', label: 'CTA' }
];

export const BlockPalette: React.FC<BlockPaletteProps> = ({ onInsert }) => {
    return (
        <div className="flex flex-col h-full">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 border-b bg-neutral-50">Componentes</div>
            <div className="p-2 space-y-2 overflow-y-auto flex-1">
                {CATALOG.map(item => (
                    <button
                        key={item.type}
                        onClick={() => onInsert?.(item.type)}
                        className="w-full text-left px-3 py-2 rounded-md bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm"
                    >
                        <div className="font-medium">{item.label}</div>
                        {item.description && <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BlockPalette;
