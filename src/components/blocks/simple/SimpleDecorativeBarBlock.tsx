import React from 'react';

interface SimpleDecorativeBarBlockProps {
    block: {
        id: string;
        type: string;
        content?: Record<string, any>;
        properties?: Record<string, any>;
    };
    isSelected?: boolean;
    editMode?: boolean;
    previewMode?: boolean;
    onSelect?: () => void;
}

const SimpleDecorativeBarBlock: React.FC<SimpleDecorativeBarBlockProps> = ({
    block,
    isSelected = false,
    editMode = false,
    onSelect,
}) => {
    return (
        <div
            onClick={onSelect}
            className={`p-4 ${isSelected && editMode
                ? 'border-2 border-blue-500 bg-blue-50'
                : 'border border-transparent'
                } cursor-pointer transition-all`}
        >
            <div className="flex justify-center">
                <div
                    className="h-1 rounded-full bg-gradient-to-r from-transparent via-[#B89B7A] to-transparent"
                    style={{ width: '120px' }}
                />
            </div>
        </div>
    );
};

export default SimpleDecorativeBarBlock;