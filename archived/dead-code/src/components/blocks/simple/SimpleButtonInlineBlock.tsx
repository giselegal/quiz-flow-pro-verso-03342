// @ts-nocheck
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

const SimpleButtonInlineBlock: React.FC<BlockComponentProps> = ({
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
                p-6 text-center
                ${isSelected && editMode ? 'ring-2 ring-blue-500 ring-opacity-50 rounded-lg' : ''}
                ${editMode ? 'cursor-pointer' : ''}
                transition-all duration-200
            `}
        >
            <button
                className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                disabled={editMode}
            >
                {content.buttonText || content.text || "Garantir Meu Acesso Agora"}
            </button>

            <p className="text-sm text-gray-600 mt-3">
                🔒 Pagamento 100% seguro
            </p>
        </div>
    );
};

export default SimpleButtonInlineBlock;