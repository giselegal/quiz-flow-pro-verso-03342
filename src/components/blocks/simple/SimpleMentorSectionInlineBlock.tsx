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

const SimpleMentorSectionInlineBlock: React.FC<BlockComponentProps> = ({
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
                p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl
                ${isSelected && editMode ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                ${editMode ? 'cursor-pointer hover:border-purple-300' : ''}
                transition-all duration-200
            `}
        >
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center text-4xl">
                    👩‍🏫
                </div>

                <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-purple-900 mb-2">
                        {content.mentorName || "Especialista em Estilo"}
                    </h3>
                    <p className="text-purple-800 mb-3">
                        {content.mentorTitle || "Consultora de Imagem"}
                    </p>
                    <p className="text-sm text-purple-700">
                        Mais de 10 anos transformando o estilo de mulheres
                    </p>
                </div>
            </div>

            <div className="mt-6 p-4 bg-purple-100 rounded-lg border border-purple-200 text-center">
                <span className="font-semibold text-purple-800">
                    👑 Sua Mentora Pessoal
                </span>
            </div>
        </div>
    );
};

export default SimpleMentorSectionInlineBlock;