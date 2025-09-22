import React from 'react';

interface BlockComponentProps {
    block: {
        type: string;
        content: any;
        properties: any;
    };
    isSelected: boolean;
    editMode: boolean;
    previewMode?: boolean;
    onSelect: () => void;
}

/**
 * 🔄 SIMPLE BEFORE AFTER INLINE BLOCK
 * 
 * Comparação antes/depois da transformação
 * Mostra o impacto visual de aplicar o estilo
 */
const SimpleBeforeAfterInlineBlock: React.FC<BlockComponentProps> = ({
    block,
    isSelected,
    editMode,
    onSelect
}) => {
    const content = block.content || {};
    const properties = block.properties || {};

    return (
        <div
            onClick={onSelect}
            className={`
                p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl
                ${isSelected && editMode ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                ${editMode ? 'cursor-pointer hover:border-green-300' : ''}
                transition-all duration-200
            `}
        >
            {/* Title */}
            {content.title && (
                <h3 className="text-2xl font-bold text-green-900 mb-2 text-center">
                    {content.title}
                </h3>
            )}

            {/* Subtitle */}
            {content.subtitle && (
                <p className="text-lg text-green-800 text-center mb-8">
                    {content.subtitle}
                </p>
            )}

            {/* Before/After comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Before section */}
                <div className="text-center">
                    <div className="mb-4">
                        <span className="inline-block px-4 py-2 bg-gray-500 text-white font-semibold rounded-full text-sm">
                            {content.beforeLabel || "ANTES"}
                        </span>
                    </div>

                    {/* Before placeholder image */}
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300 mb-4">
                        <div className="text-center text-gray-500">
                            <span className="text-4xl mb-2 block">😐</span>
                            <p className="text-sm font-medium">Sem estilo definido</p>
                            <p className="text-xs">Roupas aleatórias</p>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                        <p>• Sem direção visual</p>
                        <p>• Compras por impulso</p>
                        <p>• Looks sem coesão</p>
                    </div>
                </div>

                {/* After section */}
                <div className="text-center">
                    <div className="mb-4">
                        <span className="inline-block px-4 py-2 bg-green-600 text-white font-semibold rounded-full text-sm">
                            {content.afterLabel || "DEPOIS"}
                        </span>
                    </div>

                    {/* After placeholder image */}
                    <div className="w-full h-64 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center border border-green-300 mb-4">
                        <div className="text-center text-green-700">
                            <span className="text-4xl mb-2 block">✨</span>
                            <p className="text-sm font-medium">Estilo personalizado</p>
                            <p className="text-xs">Visual harmonioso</p>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm text-green-700">
                        <p>• Identidade visual clara</p>
                        <p>• Compras estratégicas</p>
                        <p>• Looks coordenados</p>
                    </div>
                </div>
            </div>

            {/* Transformation arrow */}
            <div className="flex justify-center my-6">
                <div className="hidden md:block">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full border border-green-300">
                        <span className="text-green-600 font-semibold text-sm">TRANSFORMAÇÃO</span>
                        <span className="text-green-600 text-lg">→</span>
                    </div>
                </div>
                <div className="md:hidden">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full border border-green-300">
                        <span className="text-green-600 font-semibold text-sm">TRANSFORMAÇÃO</span>
                        <span className="text-green-600 text-lg">↓</span>
                    </div>
                </div>
            </div>

            {/* Results highlight */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg text-center border border-green-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-xl">🎉</span>
                    <span className="font-semibold text-green-800">
                        Sua Transformação É Possível
                    </span>
                </div>
                <p className="text-sm text-green-700">
                    Descubra seu estilo e transforme seu visual
                </p>
            </div>

            {/* Debug info in edit mode */}
            {editMode && (
                <details className="mt-4 text-xs">
                    <summary className="cursor-pointer text-slate-500 hover:text-slate-700">
                        Dados do antes/depois
                    </summary>
                    <pre className="mt-2 p-2 bg-slate-200 rounded text-xs overflow-auto max-h-32">
                        {JSON.stringify({ content, properties }, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    );
};

export default SimpleBeforeAfterInlineBlock;