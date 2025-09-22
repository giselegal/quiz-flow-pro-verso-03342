import React, { useState } from 'react';

interface SimpleFormContainerBlockProps {
    block: {
        id: string;
        type: string;
        content: {
            title?: string;
            placeholder?: string;
            buttonText?: string;
            requiredMessage?: string;
        };
        properties?: Record<string, any>;
    };
    isSelected?: boolean;
    editMode?: boolean;
    previewMode?: boolean;
    onSelect?: () => void;
}

const SimpleFormContainerBlock: React.FC<SimpleFormContainerBlockProps> = ({
    block,
    isSelected = false,
    editMode = false,
    previewMode = false,
    onSelect,
}) => {
    const [inputValue, setInputValue] = useState('');

    const {
        title = 'Como posso te chamar?',
        placeholder = 'Digite seu primeiro nome aqui...',
        buttonText = 'Continuar',
        requiredMessage = 'Por favor, digite seu nome para continuar'
    } = block.content || {};

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!previewMode) return;

        if (inputValue.trim()) {
            console.log('Nome coletado:', inputValue.trim());
            // Aqui você pode adicionar a lógica para salvar o nome
        } else {
            alert(requiredMessage);
        }
    };

    return (
        <div
            onClick={onSelect}
            className={`p-6 ${isSelected && editMode
                    ? 'border-2 border-blue-500 bg-blue-50'
                    : 'border border-transparent'
                } transition-all`}
        >
            <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-4 text-[#432818]">
                    {title}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={editMode}
                        className="w-full p-3 border border-[#B89B7A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B89B7A]/20"
                    />

                    <button
                        type="submit"
                        disabled={editMode || !inputValue.trim()}
                        className="w-full py-3 px-6 bg-[#B89B7A] text-white rounded-lg font-semibold hover:bg-[#A08966] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {buttonText}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SimpleFormContainerBlock;