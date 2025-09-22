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
 * 🎁 SIMPLE BONUS BLOCK
 * 
 * Seção de bônus inclusos na oferta
 * Destaca benefícios adicionais
 */
const SimpleBonusBlock: React.FC<BlockComponentProps> = ({
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
                p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl
                ${isSelected && editMode ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                ${editMode ? 'cursor-pointer hover:border-yellow-300' : ''}
                transition-all duration-200
            `}
        >
            {/* Title */}
            {content.title && (
                <h3 className="text-2xl font-bold text-yellow-900 mb-6 text-center">
                    {content.title}
                </h3>
            )}

            {/* Bonus items */}
            <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg border border-yellow-100 flex items-center gap-4">
                    <span className="text-3xl">📚</span>
                    <div>
                        <h4 className="font-semibold text-yellow-800">E-book Exclusivo</h4>
                        <p className="text-sm text-yellow-700">Guia completo de combinações</p>
                    </div>
                </div>

                <div className="bg-white/60 p-4 rounded-lg border border-yellow-100 flex items-center gap-4">
                    <span className="text-3xl">🎯</span>
                    <div>
                        <h4 className="font-semibold text-yellow-800">Planner de Looks</h4>
                        <p className="text-sm text-yellow-700">Organize seus visuais semanais</p>
                    </div>
                </div>

                <div className="bg-white/60 p-4 rounded-lg border border-yellow-100 flex items-center gap-4">
                    <span className="text-3xl">💡</span>
                    <div>
                        <h4 className="font-semibold text-yellow-800">Dicas Personalizadas</h4>
                        <p className="text-sm text-yellow-700">Conselhos específicos para seu estilo</p>
                    </div>
                </div>
            </div>

            {/* Bonus highlight */}
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg text-center border border-yellow-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-xl">🎁</span>
                    <span className="font-semibold text-yellow-800">
                        Bônus de Transformação
                    </span>
                </div>
                <p className="text-sm text-yellow-700">
                    Material extra para acelerar sua transformação
                </p>
            </div>

            {/* Debug info in edit mode */}
            {editMode && (
                <details className="mt-4 text-xs">
                    <summary className="cursor-pointer text-slate-500 hover:text-slate-700">
                        Dados do bônus
                    </summary>
                    <pre className="mt-2 p-2 bg-slate-200 rounded text-xs overflow-auto max-h-32">
                        {JSON.stringify({ content, properties }, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    );
};

export default SimpleBonusBlock;