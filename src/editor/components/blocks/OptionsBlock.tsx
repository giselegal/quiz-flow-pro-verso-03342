/**
 * 🎯 OPTIONS BLOCK - Bloco de Opções do Quiz
 * 
 * Componente modular para renderizar opções de resposta (AGRUPADO).
 * Consome 100% das propriedades do JSON.
 */

import React, { useState } from 'react';
import { BlockComponentProps } from '@/types/blockTypes';
import { cn } from '@/lib/utils';

interface QuizOption {
    id: string;
    text: string;
    image?: string;
}

export const OptionsBlock: React.FC<BlockComponentProps> = ({
    data,
    isSelected,
    isEditable,
    onSelect,
}) => {
    const {
        options = [] as QuizOption[],
        requiredSelections = 1,
        layout = 'grid',
        columns = 2,
        className: customClassName
    } = data.props;

    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const toggleOption = (optionId: string) => {
        if (isEditable) return; // Não permitir seleção no modo edição

        setSelectedOptions(prev => {
            if (prev.includes(optionId)) {
                return prev.filter(id => id !== optionId);
            }
            if (prev.length >= requiredSelections) {
                return [...prev.slice(1), optionId];
            }
            return [...prev, optionId];
        });
    };

    return (
        <div
            className={cn(
                'options-block relative p-4 transition-all duration-200',
                isEditable && 'cursor-pointer hover:bg-gray-50',
                isSelected && 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/30',
                customClassName
            )}
            onClick={isEditable ? onSelect : undefined}
            data-block-id={data.id}
        >
            {/* Indicador de seleção */}
            {isSelected && (
                <div className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded shadow-sm z-10">
                    ✅ Opções ({options.length})
                </div>
            )}

            {/* Informação sobre seleções */}
            {requiredSelections > 1 && (
                <div className="text-sm text-gray-600 text-center mb-4">
                    Selecione {requiredSelections} opções
                </div>
            )}

            {/* Grid de opções */}
            <div
                className={cn(
                    layout === 'grid' && `grid gap-4 grid-cols-${columns}`,
                    layout === 'list' && 'flex flex-col gap-3'
                )}
            >
                {options.map((option) => {
                    const isOptionSelected = selectedOptions.includes(option.id);

                    return (
                        <div
                            key={option.id}
                            className={cn(
                                'option-item border-2 rounded-lg p-4 transition-all cursor-pointer',
                                isOptionSelected
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300',
                                isEditable && 'cursor-default opacity-80'
                            )}
                            onClick={() => toggleOption(option.id)}
                        >
                            {/* Imagem (se houver) */}
                            {option.image && (
                                <div className="mb-3">
                                    <img
                                        src={option.image}
                                        alt={option.text}
                                        className="w-full h-32 object-cover rounded"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}

                            {/* Checkbox visual */}
                            <div className="flex items-start gap-3">
                                <div
                                    className={cn(
                                        'w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 mt-0.5',
                                        isOptionSelected
                                            ? 'border-blue-500 bg-blue-500'
                                            : 'border-gray-300'
                                    )}
                                >
                                    {isOptionSelected && (
                                        <svg
                                            className="w-3 h-3 text-white"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    )}
                                </div>

                                {/* Texto */}
                                <div className="flex-1 text-sm">
                                    {option.text}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Contador de seleções */}
            {!isEditable && (
                <div className="text-xs text-gray-500 text-center mt-4">
                    {selectedOptions.length} / {requiredSelections} selecionadas
                </div>
            )}
        </div>
    );
};

export default OptionsBlock;
