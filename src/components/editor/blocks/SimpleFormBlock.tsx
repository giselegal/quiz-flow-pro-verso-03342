import type { BlockComponentProps } from '@/types/blocks';
import React from 'react';

/**
 * 📝 SimpleFormBlock - Versão simples para o ModularV1Editor
 */
const SimpleFormBlock: React.FC<BlockComponentProps> = ({
    block,
    isSelected = false,
    onClick,
    className = '',
}) => {
    const {
        title = 'Como posso te chamar?',
        placeholder = 'Digite seu nome...',
        buttonText = 'Continuar'
    } = block?.content || {};

    return (
        <div
            className={`
        py-2 px-2 cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-1 ring-blue-400 bg-blue-50/30' : 'hover:bg-gray-50/50'}
        ${className}
      `}
            onClick={onClick}
        >
            <div className="max-w-md mx-auto p-6 bg-white border-2 border-[#B89B7A] rounded-lg">
                <h3 className="text-lg font-semibold text-center mb-4 text-[#432818]">
                    {title}
                </h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder={placeholder}
                        className="w-full p-3 border-2 border-[#B89B7A] rounded-lg text-[#432818]"
                        disabled={true} // Sempre disabled no editor
                    />
                    <button
                        className="w-full py-3 px-6 bg-[#B89B7A] text-white rounded-lg font-semibold"
                        disabled={true} // Sempre disabled no editor
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SimpleFormBlock;