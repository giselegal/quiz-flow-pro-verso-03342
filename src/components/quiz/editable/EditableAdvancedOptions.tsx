import React, { useState } from 'react';
import { Plus, Trash2, Bold, Italic, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdvancedOption {
    id: string;
    text: string;
    htmlContent?: string;
    prefix?: string; // A), B), C), etc.
}

interface EditableAdvancedOptionsProps {
    options: AdvancedOption[];
    selectedOptions: string[];
    onOptionsChange: (options: string[]) => void;
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
    multiSelect?: boolean;
}

/**
 * 🎯 OPÇÕES AVANÇADAS COM RICH TEXT
 * 
 * Versão avançada das opções que replica o modelo:
 * - Rich text editing (bold, italic)
 * - Prefixos automáticos (A, B, C...)
 * - Hover effects sofisticados
 * - HTML content support
 */
export default function EditableAdvancedOptions({
    options = [],
    selectedOptions = [],
    onOptionsChange = () => { },
    isEditable = false,
    onEdit = () => { },
    multiSelect = false
}: EditableAdvancedOptionsProps) {
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleOptionClick = (optionId: string) => {
        if (isEditable) return;

        let newSelection: string[];

        if (multiSelect) {
            newSelection = selectedOptions.includes(optionId)
                ? selectedOptions.filter(id => id !== optionId)
                : [...selectedOptions, optionId];
        } else {
            newSelection = selectedOptions.includes(optionId) ? [] : [optionId];
        }

        onOptionsChange(newSelection);
    };

    const handleAddOption = () => {
        const newOption: AdvancedOption = {
            id: `option-${Date.now()}`,
            text: 'Nova opção',
            prefix: String.fromCharCode(65 + options.length) + ')' // A), B), C)...
        };

        const newOptions = [...options, newOption];
        onEdit('options', newOptions);
    };

    const handleRemoveOption = (optionId: string) => {
        const newOptions = options.filter(opt => opt.id !== optionId);
        // Reajustar prefixos
        const reindexedOptions = newOptions.map((opt, index) => ({
            ...opt,
            prefix: String.fromCharCode(65 + index) + ')'
        }));
        onEdit('options', reindexedOptions);
    };

    const handleOptionEdit = (optionId: string, field: string, value: any) => {
        const newOptions = options.map(opt =>
            opt.id === optionId ? { ...opt, [field]: value } : opt
        );
        onEdit('options', newOptions);
    };

    const toggleBold = (optionId: string) => {
        const option = options.find(o => o.id === optionId);
        if (!option) return;

        const currentText = option.htmlContent || option.text;
        const newHtml = currentText.includes('<strong>')
            ? currentText.replace(/<\/?strong>/g, '')
            : `<strong>${currentText}</strong>`;

        handleOptionEdit(optionId, 'htmlContent', newHtml);
    };

    return (
        <div className="flex flex-col items-start justify-start gap-2">
            {options.map((option, index) => {
                const isSelected = selectedOptions.includes(option.id);
                const isEditing = editingId === option.id;
                const displayText = option.htmlContent || option.text;

                return (
                    <div key={option.id} className="relative group w-full">
                        <button
                            className={`whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 option border-zinc-200 bg-background hover:bg-primary hover:text-foreground px-4 py-2 hover:shadow-2xl overflow-hidden min-w-full gap-2 flex h-auto flex-col items-center justify-start border drop-shadow-none ${isSelected && !isEditable
                                    ? 'bg-primary text-primary-foreground shadow-lg'
                                    : ''
                                } ${isEditable
                                    ? 'cursor-default border-blue-200 hover:border-blue-400'
                                    : 'cursor-pointer'
                                }`}
                            onClick={() => handleOptionClick(option.id)}
                            disabled={isEditable}
                        >
                            <div className="py-2 px-4 w-full flex flex-row text-base items-center text-full-primary justify-between">
                                <div className="break-words w-full text-left">
                                    {isEditable && isEditing ? (
                                        <div className="flex flex-col gap-2">
                                            <textarea
                                                value={option.text}
                                                onChange={(e) => handleOptionEdit(option.id, 'text', e.target.value)}
                                                onBlur={() => setEditingId(null)}
                                                className="w-full p-2 border rounded resize-none bg-white"
                                                rows={2}
                                                autoFocus
                                            />
                                            <div className="flex gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleBold(option.id);
                                                    }}
                                                    className="h-6 px-2"
                                                >
                                                    <Bold className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingId(null);
                                                    }}
                                                    className="h-6 px-2"
                                                >
                                                    ✓
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className={`custom-quill quill ql-editor quill-option text-left ${isEditable ? 'cursor-text hover:bg-blue-50 p-1 rounded' : ''
                                                }`}
                                            onClick={(e) => {
                                                if (isEditable) {
                                                    e.stopPropagation();
                                                    setEditingId(option.id);
                                                }
                                            }}
                                        >
                                            <p>
                                                <span className="font-bold text-gray-600 mr-1">
                                                    {option.prefix}
                                                </span>
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: displayText
                                                    }}
                                                />
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Indicador de Seleção */}
                            {isSelected && !isEditable && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                    <span className="text-primary-foreground text-sm">✓</span>
                                </div>
                            )}
                        </button>

                        {/* Controles de Edição */}
                        {isEditable && !isEditing && (
                            <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="flex flex-col gap-1">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setEditingId(option.id)}
                                        className="h-6 w-6 p-0"
                                        title="Editar"
                                    >
                                        <Type className="w-3 h-3" />
                                    </Button>
                                    {options.length > 1 && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleRemoveOption(option.id)}
                                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                            title="Remover"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Botão Adicionar Opção */}
            {isEditable && (
                <button
                    onClick={handleAddOption}
                    className="w-full p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center text-blue-600 hover:text-blue-800"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Adicionar Opção</span>
                </button>
            )}

            {/* Status de Seleção */}
            {!isEditable && (
                <div className="w-full text-center text-xs text-gray-500 mt-2">
                    {selectedOptions.length > 0 && (
                        <span className="text-green-600">
                            {selectedOptions.length} opç{selectedOptions.length === 1 ? 'ão selecionada' : 'ões selecionadas'} ✓
                        </span>
                    )}
                </div>
            )}

            {/* Indicador de Modo Edição */}
            {isEditable && (
                <div className="w-full text-center text-xs text-blue-600 bg-blue-50 py-2 px-4 rounded-lg border border-blue-200 mt-2">
                    💡 <strong>Rich Text:</strong> Clique nos textos para editar. Use os controles para formatação.
                </div>
            )}
        </div>
    );
}