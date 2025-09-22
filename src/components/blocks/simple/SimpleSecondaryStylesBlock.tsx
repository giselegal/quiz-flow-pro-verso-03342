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
 * 📊 SIMPLE SECONDARY STYLES BLOCK
 * 
 * Mostra estilos complementares com percentuais
 * Exibe os estilos secundários identificados no resultado
 */
const SimpleSecondaryStylesBlock: React.FC<BlockComponentProps> = ({
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
                p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-xl
                ${isSelected && editMode ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                ${editMode ? 'cursor-pointer hover:border-teal-300' : ''}
                transition-all duration-200
            `}
        >
            {/* Title */}
            {content.title && (
                <h3 className="text-2xl font-bold text-teal-900 mb-2 text-center">
                    {content.title}
                </h3>
            )}

            {/* Subtitle */}
            {content.subtitle && (
                <p className="text-lg text-teal-800 text-center mb-6">
                    {content.subtitle}
                </p>
            )}

            {/* Secondary styles */}
            {content.secondaryStyles && Array.isArray(content.secondaryStyles) && (
                <div className="space-y-4">
                    {content.secondaryStyles.map((style: any, index: number) => (
                        <div
                            key={index}
                            className="bg-white/60 p-4 rounded-lg border border-teal-100"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-lg font-semibold text-teal-800">
                                    {style.name || `Estilo ${index + 1}`}
                                </h4>
                                {style.percentage && (
                                    <span className="text-2xl font-bold text-teal-600">
                                        {style.percentage}
                                    </span>
                                )}
                            </div>

                            {/* Progress bar */}
                            {style.percentage && (
                                <div className="w-full bg-teal-100 rounded-full h-3 mb-3">
                                    <div
                                        className="bg-gradient-to-r from-teal-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(100, parseInt(style.percentage) || 0)}%` }}
                                    ></div>
                                </div>
                            )}

                            {/* Description */}
                            {style.description && (
                                <p className="text-teal-700 text-sm">
                                    {style.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Alternative content if no secondary styles */}
            {(!content.secondaryStyles || !Array.isArray(content.secondaryStyles)) && (
                <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 flex items-center justify-center">
                        <span className="text-2xl">📈</span>
                    </div>
                    <p className="text-teal-700 font-medium">
                        Estilos complementares serão exibidos aqui
                    </p>
                </div>
            )}

            {/* Summary */}
            <div className="mt-6 p-4 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-lg text-center border border-teal-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-xl">🎯</span>
                    <span className="font-semibold text-teal-800">
                        Combinação Perfeita
                    </span>
                </div>
                <p className="text-sm text-teal-700">
                    Seus estilos se complementam harmoniosamente
                </p>
            </div>

            {/* Debug info in edit mode */}
            {editMode && (
                <details className="mt-4 text-xs">
                    <summary className="cursor-pointer text-slate-500 hover:text-slate-700">
                        Dados dos estilos secundários
                    </summary>
                    <pre className="mt-2 p-2 bg-slate-200 rounded text-xs overflow-auto max-h-32">
                        {JSON.stringify({ content, properties }, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    );
};

export default SimpleSecondaryStylesBlock;