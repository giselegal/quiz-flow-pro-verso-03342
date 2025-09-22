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
 * 🏆 SIMPLE RESULT HEADER INLINE BLOCK
 * 
 * Cabeçalho de resultado com título, subtítulo, descrição e imagens
 * Usado para mostrar o resultado do quiz com estilo personalizado
 */
const SimpleResultHeaderInlineBlock: React.FC<BlockComponentProps> = ({
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
                p-8 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl
                ${isSelected && editMode ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                ${editMode ? 'cursor-pointer hover:border-amber-300' : ''}
                transition-all duration-200
            `}
        >
            {/* Main result header */}
            <div className="text-center mb-8">
                {/* Title */}
                {content.title && (
                    <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
                        {content.title}
                    </h1>
                )}

                {/* Subtitle */}
                {content.subtitle && (
                    <h2 className="text-2xl md:text-3xl font-semibold text-amber-700 mb-4">
                        {content.subtitle}
                    </h2>
                )}

                {/* Description */}
                {content.description && (
                    <p className="text-lg text-amber-800 max-w-2xl mx-auto leading-relaxed mb-6">
                        {content.description}
                    </p>
                )}
            </div>

            {/* Images section */}
            {(content.imageUrl || content.styleGuideImageUrl) && (
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                    {/* Main result image */}
                    {content.imageUrl && (
                        <div className="flex-1 max-w-md">
                            <img
                                src={content.imageUrl}
                                alt="Resultado do estilo"
                                className="w-full h-64 object-cover rounded-lg shadow-lg border border-amber-200"
                            />
                            <p className="text-sm text-amber-700 text-center mt-2 font-medium">
                                Seu estilo personalizado
                            </p>
                        </div>
                    )}

                    {/* Style guide image */}
                    {content.styleGuideImageUrl && content.showBothImages && (
                        <div className="flex-1 max-w-md">
                            <img
                                src={content.styleGuideImageUrl}
                                alt="Guia de estilo"
                                className="w-full h-64 object-cover rounded-lg shadow-lg border border-amber-200"
                            />
                            <p className="text-sm text-amber-700 text-center mt-2 font-medium">
                                Guia de estilo
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Result highlight banner */}
            <div className="mt-8 p-4 bg-amber-100 border border-amber-300 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">🎯</span>
                    <span className="font-semibold text-amber-800">
                        Resultado Personalizado
                    </span>
                </div>
                <p className="text-sm text-amber-700">
                    Baseado em suas preferências e personalidade única
                </p>
            </div>

            {/* Debug info in edit mode */}
            {editMode && (
                <details className="mt-6 text-xs">
                    <summary className="cursor-pointer text-slate-500 hover:text-slate-700">
                        Dados do cabeçalho
                    </summary>
                    <pre className="mt-2 p-2 bg-slate-200 rounded text-xs overflow-auto max-h-32">
                        {JSON.stringify({ content, properties }, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    );
};

export default SimpleResultHeaderInlineBlock;