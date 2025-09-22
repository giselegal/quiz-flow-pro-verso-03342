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

const SimpleSecurePurchaseBlock: React.FC<BlockComponentProps> = ({
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
                p-6 bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-xl
                ${isSelected && editMode ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                ${editMode ? 'cursor-pointer hover:border-green-300' : ''}
                transition-all duration-200 text-center
            `}
        >
            {content.title && (
                <h3 className="text-xl font-bold text-green-900 mb-4">
                    {content.title}
                </h3>
            )}

            <div className="flex justify-center gap-4 mb-4">
                <div className="text-center">
                    <div className="text-2xl mb-2">🔒</div>
                    <span className="text-sm text-green-700">SSL Seguro</span>
                </div>
                <div className="text-center">
                    <div className="text-2xl mb-2">💳</div>
                    <span className="text-sm text-green-700">Pagamento Protegido</span>
                </div>
                <div className="text-center">
                    <div className="text-2xl mb-2">✅</div>
                    <span className="text-sm text-green-700">Certificado</span>
                </div>
            </div>

            <p className="text-sm text-green-700">
                Seus dados estão 100% protegidos
            </p>
        </div>
    );
};

export default SimpleSecurePurchaseBlock;