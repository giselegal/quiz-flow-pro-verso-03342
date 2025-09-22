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

const SimpleGuaranteeBlock: React.FC<BlockComponentProps> = ({
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
                p-6 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl
                ${isSelected && editMode ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                ${editMode ? 'cursor-pointer hover:border-emerald-300' : ''}
                transition-all duration-200 text-center
            `}
        >
            <div className="flex justify-center mb-4">
                {content.imageUrl ? (
                    <img src={content.imageUrl} alt="Garantia" className="h-16" />
                ) : (
                    <div className="text-4xl">🛡️</div>
                )}
            </div>

            {content.title && (
                <h3 className="text-xl font-bold text-emerald-900 mb-3">
                    {content.title}
                </h3>
            )}

            {content.description && (
                <p className="text-emerald-800 mb-4">
                    {content.description}
                </p>
            )}

            <div className="p-4 bg-emerald-100 rounded-lg border border-emerald-200">
                <span className="font-semibold text-emerald-800">
                    ✅ Garantia Incondicional
                </span>
            </div>
        </div>
    );
};

export default SimpleGuaranteeBlock;