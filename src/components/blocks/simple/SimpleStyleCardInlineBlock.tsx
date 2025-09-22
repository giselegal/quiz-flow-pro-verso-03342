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
 * 💎 SIMPLE STYLE CARD INLINE BLOCK
 * 
 * Card com características do estilo personalizado
 * Mostra detalhes específicos do resultado do quiz
 */
const SimpleStyleCardInlineBlock: React.FC<BlockComponentProps> = ({
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
                p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl
                ${isSelected && editMode ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                ${editMode ? 'cursor-pointer hover:border-purple-300' : ''}
                transition-all duration-200
            `}
        >
            {/* Card title */}
            {content.title && (
                <h3 className="text-2xl font-bold text-purple-900 mb-2 text-center">
                    {content.title}
                </h3>
            )}

            {/* Card description */}
            {content.description && (
                <p className="text-lg text-purple-800 text-center mb-6">
                    {content.description}
                </p>
            )}

            {/* Style features */}
            {content.features && Array.isArray(content.features) && (
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-purple-800 text-center mb-4">
                        ✨ Características do Seu Estilo
                    </h4>
                    <div className="grid gap-3">
                        {content.features.map((feature: string, index: number) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100"
                            >
                                <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"></div>
                                <span className="text-purple-800 font-medium">
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Alternative content if no features */}
            {(!content.features || !Array.isArray(content.features)) && (
                <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-2xl">👗</span>
                    </div>
                    <p className="text-purple-700 font-medium">
                        Características do estilo serão exibidas aqui
                    </p>
                </div>
            )}

            {/* Style highlight */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg text-center border border-purple-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-xl">🎨</span>
                    <span className="font-semibold text-purple-800">
                        Seu Estilo Único
                    </span>
                </div>
                <p className="text-sm text-purple-700">
                    Desenvolvido especialmente para você
                </p>
            </div>

            {/* Debug info in edit mode */}
            {editMode && (
                <details className="mt-4 text-xs">
                    <summary className="cursor-pointer text-slate-500 hover:text-slate-700">
                        Dados do card
                    </summary>
                    <pre className="mt-2 p-2 bg-slate-200 rounded text-xs overflow-auto max-h-32">
                        {JSON.stringify({ content, properties }, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    );
};

export default SimpleStyleCardInlineBlock;