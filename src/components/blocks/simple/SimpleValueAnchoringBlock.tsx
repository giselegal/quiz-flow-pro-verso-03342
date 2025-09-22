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

const SimpleValueAnchoringBlock: React.FC<BlockComponentProps> = ({
    block,
    isSelected,
    editMode,
    onSelect
}) => {
    const content = block.content || {};

    return (
        <div
            onClick={onSelect}
            className={`
                p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl
                ${isSelected && editMode ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                ${editMode ? 'cursor-pointer hover:border-blue-300' : ''}
                transition-all duration-200
            `}
        >
            {content.title && (
                <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">
                    {content.title}
                </h3>
            )}

            <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg border border-blue-100 flex justify-between items-center">
                    <span className="font-medium text-blue-800">Consultoria presencial</span>
                    <span className="text-lg font-bold text-blue-600">R$ 1.500</span>
                </div>
                <div className="bg-white/60 p-4 rounded-lg border border-blue-100 flex justify-between items-center">
                    <span className="font-medium text-blue-800">Análise completa digital</span>
                    <span className="text-lg font-bold text-blue-600">R$ 397</span>
                </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg text-center border border-blue-200">
                <span className="font-semibold text-blue-800">💰 Valor Total do Pacote</span>
            </div>
        </div>
    );
};

export default SimpleValueAnchoringBlock;