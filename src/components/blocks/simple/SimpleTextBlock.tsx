import React from 'react';

interface SimpleTextBlockProps {
    block: {
        id: string;
        type: string;
        content: {
            text?: string;
        };
        properties?: Record<string, any>;
    };
    isSelected?: boolean;
    editMode?: boolean;
    previewMode?: boolean;
    onSelect?: () => void;
}

const SimpleTextBlock: React.FC<SimpleTextBlockProps> = ({
    block,
    isSelected = false,
    editMode = false,
    onSelect,
}) => {
    const { text = 'Texto padrão' } = block.content || {};

    return (
        <div
            onClick={onSelect}
            className={`p-4 ${isSelected && editMode
                    ? 'border-2 border-blue-500 bg-blue-50'
                    : 'border border-transparent'
                } cursor-pointer transition-all`}
        >
            <div
                dangerouslySetInnerHTML={{ __html: text }}
                className="prose max-w-none"
            />
        </div>
    );
};

export default SimpleTextBlock;