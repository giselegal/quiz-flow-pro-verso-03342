import React from 'react';

interface EditableSpacerProps {
    height?: number; // em pixels
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}

/**
 * 📏 ESPAÇADOR EDITÁVEL
 * 
 * Componente para criar espaçamentos visuais editáveis:
 * - Altura configurável
 * - Visual indicativo em modo edição
 * - Invisível em modo preview
 */
export default function EditableSpacer({
    height = 32,
    isEditable = false,
    onEdit = () => { }
}: EditableSpacerProps) {
    if (!isEditable) {
        // MODO PREVIEW: Espaçamento invisível
        return <div style={{ height: `${height}px` }} />;
    }

    // MODO EDIÇÃO: Espaçador visual
    return (
        <div className="relative group">
            <div
                className="min-w-full border-dashed border-yellow-500 border-2 rounded-lg flex items-center justify-center transition-all duration-200 hover:border-yellow-600 hover:bg-yellow-50"
                style={{ height: `${Math.max(height, 20)}px` }}
            >
                <span className="text-yellow-600 text-xs font-medium opacity-60">
                    Espaçador ({height}px)
                </span>
            </div>

            {/* Controles de Altura */}
            <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex flex-col gap-1 bg-white shadow-lg rounded p-2 border text-xs">
                    <button
                        onClick={() => onEdit('height', Math.min(height + 10, 200))}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                        title="Aumentar altura"
                    >
                        +
                    </button>
                    <span className="text-center text-gray-600 text-xs">
                        {height}px
                    </span>
                    <button
                        onClick={() => onEdit('height', Math.max(height - 10, 10))}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                        title="Diminuir altura"
                    >
                        -
                    </button>
                </div>
            </div>

            {/* Input direto para altura */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <input
                    type="number"
                    min="10"
                    max="200"
                    value={height}
                    onChange={(e) => onEdit('height', parseInt(e.target.value) || 32)}
                    className="w-20 px-2 py-1 text-xs border rounded text-center"
                    placeholder="Altura"
                />
            </div>
        </div>
    );
}