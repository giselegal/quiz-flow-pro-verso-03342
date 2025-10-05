/**
 * 🎯 COMPONENTE EDITÁVEL: OPTIONS GRID
 * 
 * Componente específico para editar grids de opções de quiz (questões múltipla escolha)
 */

import React, { useState } from 'react';
import { RealComponentProps, OptionsGridContent } from './types';
import { cn } from '@/lib/utils';
import { Edit3, Settings, Plus, X } from 'lucide-react';

interface OptionsGridEditorProps extends RealComponentProps {
    content: OptionsGridContent;
}

export const OptionsGridEditor: React.FC<OptionsGridEditorProps> = ({
    id,
    content,
    properties,
    isEditing = false,
    isSelected = false,
    onUpdate,
    onSelect
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleContentUpdate = (updates: Partial<OptionsGridContent>) => {
        onUpdate?.({
            content: { ...content, ...updates }
        });
    };

    const handleQuestionUpdate = (newQuestion: string) => {
        handleContentUpdate({ question: newQuestion });
    };

    const handleOptionUpdate = (optionIndex: number, updates: Partial<OptionsGridContent['options'][0]>) => {
        const newOptions = [...content.options];
        newOptions[optionIndex] = { ...newOptions[optionIndex], ...updates };
        handleContentUpdate({ options: newOptions });
    };

    const handleAddOption = () => {
        const newOption = {
            id: `option_${Date.now()}`,
            text: 'Nova opção',
            imageUrl: '',
            score: {}
        };
        handleContentUpdate({ options: [...content.options, newOption] });
    };

    const handleRemoveOption = (optionIndex: number) => {
        const newOptions = content.options.filter((_, index) => index !== optionIndex);
        handleContentUpdate({ options: newOptions });
    };

    return (
        <div
            className={cn(
                'relative transition-all duration-200 rounded-lg p-6',
                'border-2 border-transparent',
                isSelected && 'border-blue-500 shadow-lg',
                isHovered && 'border-gray-300 shadow-md',
                'cursor-pointer bg-white'
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onSelect}
        >
            {/* 🎨 Overlay de edição */}
            {(isHovered || isSelected) && (
                <div className="absolute top-2 right-2 flex gap-1 z-10">
                    <button
                        className="p-1 bg-white rounded shadow-md hover:bg-gray-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddOption();
                        }}
                    >
                        <Plus size={14} className="text-green-600" />
                    </button>
                    <button
                        className="p-1 bg-white rounded shadow-md hover:bg-gray-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Ativar modo de edição inline
                        }}
                    >
                        <Edit3 size={14} className="text-gray-600" />
                    </button>
                    <button
                        className="p-1 bg-white rounded shadow-md hover:bg-gray-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Abrir painel de propriedades
                        }}
                    >
                        <Settings size={14} className="text-gray-600" />
                    </button>
                </div>
            )}

            {/* 🏷️ Label do tipo */}
            {isSelected && (
                <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                    Question Grid
                </div>
            )}

            {/* ❓ Pergunta */}
            <h2
                className="text-xl font-bold text-center mb-6 text-gray-800"
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleQuestionUpdate(e.currentTarget.textContent || '')}
                style={{ minHeight: isEditing ? '2rem' : 'auto' }}
            >
                {content.question}
            </h2>

            {/* 📊 Configurações de seleção */}
            {(content.minSelections || content.maxSelections) && (
                <div className="text-center text-sm text-gray-600 mb-4">
                    {content.minSelections && content.maxSelections && content.minSelections === content.maxSelections && (
                        <span>Selecione exatamente {content.minSelections} opções</span>
                    )}
                    {content.minSelections && content.maxSelections && content.minSelections !== content.maxSelections && (
                        <span>Selecione entre {content.minSelections} e {content.maxSelections} opções</span>
                    )}
                    {content.maxSelections && !content.minSelections && (
                        <span>Selecione até {content.maxSelections} opções</span>
                    )}
                    {content.minSelections && !content.maxSelections && (
                        <span>Selecione pelo menos {content.minSelections} opções</span>
                    )}
                </div>
            )}

            {/* 🎯 Grid de opções */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.options.map((option, index) => (
                    <div
                        key={option.id}
                        className={cn(
                            'relative group border-2 border-gray-200 rounded-lg p-4',
                            'hover:border-blue-300 transition-all duration-200',
                            'cursor-pointer bg-gray-50'
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 🗑️ Botão remover opção */}
                        {isSelected && content.options.length > 1 && (
                            <button
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemoveOption(index)}
                            >
                                <X size={12} />
                            </button>
                        )}

                        {/* 🖼️ Imagem da opção */}
                        {option.imageUrl && (
                            <div className="mb-3">
                                <img
                                    src={option.imageUrl}
                                    alt={option.text}
                                    className="w-full h-32 object-cover rounded"
                                />
                            </div>
                        )}

                        {/* 📝 Texto da opção */}
                        <p
                            className="text-center font-medium text-gray-800"
                            contentEditable={isEditing}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleOptionUpdate(index, { text: e.currentTarget.textContent || '' })}
                            style={{ minHeight: isEditing ? '1.5rem' : 'auto' }}
                        >
                            {option.text}
                        </p>

                        {/* 📊 Scores (se existirem) */}
                        {option.score && Object.keys(option.score).length > 0 && isSelected && (
                            <div className="mt-2 text-xs text-gray-500">
                                Pontuação: {Object.entries(option.score).map(([key, value]) => `${key}: ${value}`).join(', ')}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* ➕ Botão adicionar opção (quando não há hover) */}
            {isSelected && !isHovered && (
                <div className="mt-4 text-center">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddOption();
                        }}
                    >
                        + Adicionar Opção
                    </button>
                </div>
            )}
        </div>
    );
};