import React from 'react';

interface SimpleImageBlockProps {
    block: {
        id: string;
        type: string;
        content?: {
            imageUrl?: string;
            alt?: string;
        };
        properties?: Record<string, any>;
    };
    isSelected?: boolean;
    editMode?: boolean;
    previewMode?: boolean;
    onSelect?: () => void;
}

const SimpleImageBlock: React.FC<SimpleImageBlockProps> = ({
    block,
    isSelected = false,
    editMode = false,
    onSelect,
}) => {
    const { imageUrl, alt = 'Imagem' } = block.content || {};

    return (
        <div
            onClick={onSelect}
            className={`p-4 ${isSelected && editMode
                    ? 'border-2 border-blue-500 bg-blue-50'
                    : 'border border-transparent'
                } cursor-pointer transition-all`}
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={alt}
                    className="max-w-full h-auto rounded-lg shadow-sm"
                />
            ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
                    📷 Imagem não configurada
                </div>
            )}
        </div>
    );
};

export default SimpleImageBlock;