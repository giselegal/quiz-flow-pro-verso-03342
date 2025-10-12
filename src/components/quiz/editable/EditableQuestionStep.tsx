import React, { useState } from 'react';
import type { QuizStep } from '@/data/quizSteps';
import { EditableField } from './EditableField';
import { Plus, Trash2, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DragDropManager } from '@/components/editor/DragDropManager';

interface EditableQuestionStepProps {
    data: QuizStep;
    currentAnswers: string[];
    onAnswersChange: (answers: string[]) => void;
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}

/**
 * 🎯 QUESTION STEP EDITÁVEL
 * 
 * Versão híbrida que permite:
 * - Edição inline de pergunta e opções
 * - Adição/remoção de opções
 * - Preview funcional de seleções
 */
export default function EditableQuestionStep({
    data,
    currentAnswers,
    onAnswersChange,
    isEditable = false,
    onEdit = () => { }
}: EditableQuestionStepProps) {
    const [localAnswers, setLocalAnswers] = useState<string[]>(currentAnswers);

    const hasImages = data.options?.[0]?.image;
    const gridClass = hasImages ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1';

    const handleOptionClick = (optionId: string) => {
        if (isEditable) return; // Não permitir seleção em modo edição

        const isSelected = localAnswers.includes(optionId);

        if (isSelected) {
            const newAnswers = localAnswers.filter(id => id !== optionId);
            setLocalAnswers(newAnswers);
            onAnswersChange(newAnswers);
        } else if (localAnswers.length < (data.requiredSelections || 1)) {
            const newAnswers = [...localAnswers, optionId];
            setLocalAnswers(newAnswers);
            onAnswersChange(newAnswers);
        }
    };

    const handleAddOption = () => {
        const newOptions = [...(data.options || []), {
            id: `opt-${Date.now()}`,
            text: 'Nova opção',
            image: hasImages ? '/api/placeholder/150/150' : undefined
        }];
        onEdit('options', newOptions);
    };

    const handleRemoveOption = (optionId: string) => {
        const newOptions = (data.options || []).filter(opt => opt.id !== optionId);
        onEdit('options', newOptions);
    };

    const handleOptionEdit = (optionId: string, field: string, value: any) => {
        const newOptions = (data.options || []).map(opt =>
            opt.id === optionId ? { ...opt, [field]: value } : opt
        );
        onEdit('options', newOptions);
    };

    const canProceed = localAnswers.length === (data.requiredSelections || 1);
    const selectionText = data.requiredSelections && data.requiredSelections > 1
        ? `Selecione ${data.requiredSelections} opções`
        : 'Selecione uma opção';

    return (
        <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-6xl mx-auto">
            {/* Número da Pergunta - EDITÁVEL */}
            <EditableField
                value={data.questionNumber || 'Pergunta X de Y'}
                onChange={(value) => onEdit('questionNumber', value)}
                isEditable={isEditable}
                className="text-xl md:text-2xl font-bold mb-4"
                placeholder="Número da pergunta..."
            />

            {/* Texto da Pergunta - EDITÁVEL */}
            <EditableField
                value={data.questionText || 'Qual é a sua pergunta?'}
                onChange={(value) => onEdit('questionText', value)}
                isEditable={isEditable}
                multiline={true}
                className="text-xl md:text-2xl font-bold text-[#deac6d] mb-4 playfair-display"
                placeholder="Digite a pergunta..."
            />

            {/* Configurações de Seleção - EDITÁVEL */}
            {isEditable && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-center gap-4 text-sm">
                        <label className="flex items-center gap-2">
                            <span>Seleções obrigatórias:</span>
                            <input
                                type="number"
                                min="1"
                                max={data.options?.length || 1}
                                value={data.requiredSelections || 1}
                                onChange={(e) => onEdit('requiredSelections', parseInt(e.target.value) || 1)}
                                className="w-16 px-2 py-1 border rounded text-center"
                            />
                        </label>
                        <button
                            onClick={() => onEdit('options', (data.options || []).map(opt => ({ ...opt, image: opt.image ? undefined : '/api/placeholder/150/150' })))}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            {hasImages ? 'Remover Imagens' : 'Adicionar Imagens'}
                        </button>
                    </div>
                </div>
            )}

            {/* Instruções de Seleção */}
            <p className="text-gray-600 mb-6">
                {isEditable ? `Configurado para: ${data.requiredSelections || 1} seleção(ões)` : selectionText}
            </p>

            {/* Opções com Drag & Drop */}
            <div className="mb-6">
                {isEditable ? (
                    <DragDropManager
                        items={data.options || []}
                        onReorder={(fromIndex: number, toIndex: number) => {
                            const options = [...(data.options || [])];
                            const [movedOption] = options.splice(fromIndex, 1);
                            options.splice(toIndex, 0, movedOption);
                            onEdit('options', options);
                        }}
                        enabled={true}
                        renderItem={(option: any, index: number, isDragging: boolean) => {
                            const isSelected = localAnswers.includes(option.id);
                            return (
                                <div
                                    className={`relative group cursor-pointer p-4 border-2 rounded-lg transition-all duration-200 ${isSelected && !isEditable
                                            ? 'border-[#deac6d] bg-[#deac6d]/10'
                                            : isEditable
                                                ? 'border-blue-200 bg-blue-50 hover:border-blue-400'
                                                : 'border-gray-200 hover:border-[#deac6d] hover:bg-gray-50'
                                        } ${isDragging ? 'opacity-50 scale-95' : ''}`}
                                    onClick={() => !isDragging && handleOptionClick(option.id)}
                                >
                                    {/* Botão de Remover Opção (Modo Edição) */}
                                    {isEditable && (data.options?.length || 0) > 1 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveOption(option.id);
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                                            title="Remover opção"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    )}

                                    {/* Imagem da Opção (se houver) */}
                                    {option.image && (
                                        <div className="mb-3 relative">
                                            <img
                                                src={option.image}
                                                alt={option.text}
                                                className="w-full h-32 object-cover rounded"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/api/placeholder/150/150';
                                                }}
                                            />
                                            {isEditable && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const newUrl = prompt('URL da nova imagem:', option.image);
                                                        if (newUrl !== null) {
                                                            handleOptionEdit(option.id, 'image', newUrl);
                                                        }
                                                    }}
                                                    className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white text-sm"
                                                >
                                                    <Image className="w-4 h-4 mr-1" />
                                                    Alterar
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Texto da Opção - EDITÁVEL */}
                                    <EditableField
                                        value={option.text}
                                        onChange={(value) => handleOptionEdit(option.id, 'text', value)}
                                        isEditable={isEditable}
                                        className="font-medium text-gray-800"
                                        placeholder="Texto da opção..."
                                    />

                                    {/* Indicador de Seleção */}
                                    {isSelected && !isEditable && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#deac6d] rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm">✓</span>
                                        </div>
                                    )}
                                </div>
                            );
                        }}
                        className={`grid ${gridClass} gap-4`}
                    />
                ) : (
                    <div className={`grid ${gridClass} gap-4`}>
                        {(data.options || []).map((option) => {
                            const isSelected = localAnswers.includes(option.id);
                            return (
                                <div
                                    key={option.id}
                                    className={`relative group cursor-pointer p-4 border-2 rounded-lg transition-all duration-200 ${isSelected && !isEditable
                                            ? 'border-[#deac6d] bg-[#deac6d]/10'
                                            : 'border-gray-200 hover:border-[#deac6d] hover:bg-gray-50'
                                        }`}
                                    onClick={() => handleOptionClick(option.id)}
                                >
                                    {/* Imagem da Opção (se houver) */}
                                    {option.image && (
                                        <div className="mb-3 relative">
                                            <img
                                                src={option.image}
                                                alt={option.text}
                                                className="w-full h-32 object-cover rounded"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/api/placeholder/150/150';
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Texto da Opção */}
                                    <div className="font-medium text-gray-800">{option.text}</div>

                                    {/* Indicador de Seleção */}
                                    {isSelected && !isEditable && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#deac6d] rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm">✓</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Botão Adicionar Opção (Modo Edição) */}
                {isEditable && (
                    <div className={`grid ${gridClass} gap-4 mt-4`}>
                        <button
                            onClick={handleAddOption}
                            className="p-6 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex flex-col items-center justify-center text-blue-600 hover:text-blue-800"
                        >
                            <Plus className="w-8 h-8 mb-2" />
                            <span className="text-sm font-medium">Adicionar Opção</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Indicador de Progresso/Status */}
            <div className="text-center">
                {isEditable ? (
                    <div className="text-xs text-blue-600 bg-blue-50 py-2 px-4 rounded-lg border border-blue-200">
                        💡 <strong>Modo Edição:</strong> Clique nos textos para editar. Use os botões + e - para gerenciar opções.
                    </div>
                ) : (
                    <div className={`text-sm ${canProceed ? 'text-green-600' : 'text-gray-500'}`}>
                        {localAnswers.length} de {data.requiredSelections || 1} selecionado(s)
                        {canProceed && ' - Pronto para avançar! ✓'}
                    </div>
                )}
            </div>
        </div>
    );
}