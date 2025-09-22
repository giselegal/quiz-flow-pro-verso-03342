import React from 'react';

interface SimpleLegalNoticeBlockProps {
    block: {
        id: string;
        type: string;
        content?: {
            text?: string;
        };
        properties?: Record<string, any>;
    };
    isSelected?: boolean;
    editMode?: boolean;
    previewMode?: boolean;
    onSelect?: () => void;
}

const SimpleLegalNoticeBlock: React.FC<SimpleLegalNoticeBlockProps> = ({
    block,
    isSelected = false,
    editMode = false,
    onSelect,
}) => {
    const { text = '2025 - Todos os direitos reservados' } = block.content || {};

    return (
        <div
            onClick={onSelect}
            className={`p-4 ${isSelected && editMode
                    ? 'border-2 border-blue-500 bg-blue-50'
                    : 'border border-transparent'
                } cursor-pointer transition-all`}
        >
            <div className="text-center text-sm text-gray-500 opacity-75">
                {text}
            </div>
        </div>
    );
};

export default SimpleLegalNoticeBlock;