import React from 'react';
import { EditableField } from './EditableField';

export interface QuizOption {
    id: string;
    text: string;
    prefix?: string; // A), B), C), etc.
    image?: string;
    htmlContent?: string;
}

interface EditableOptionsGridProps {
    options?: QuizOption[];
    selectedOptions?: string[];
    onSelectionChange?: (selectedIds: string[]) => void;
    multiSelect?: boolean;
    maxSelections?: number;
    columns?: 1 | 2 | 3 | 4;
    gap?: number;
    showImages?: boolean;
    showPrefixes?: boolean;
    buttonStyle?: 'default' | 'outline' | 'ghost';
    imageSize?: 'small' | 'medium' | 'large';
    orientation?: 'vertical' | 'horizontal';
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}

/**
 * 🎯 GRADE DE OPÇÕES EDITÁVEL
 * 
 * Componente que replica a estrutura de opções do modelo original:
 * - Grid responsivo com 1-4 colunas
 * - Opções clicáveis com imagem + texto HTML
 * - Seleção múltipla/única configurável
 * - Prefixos automáticos (A), B), C)
 * - Totalmente editável via painel de propriedades
 */
export default function EditableOptionsGrid({
    options = [],
    selectedOptions = [],
    onSelectionChange = () => { },
    multiSelect = true,
    maxSelections = 3,
    columns = 2,
    gap = 2,
    showImages = true,
    showPrefixes = true,
    buttonStyle = 'default',
    imageSize = 'medium',
    orientation = 'vertical',
    isEditable = false,
    onEdit = () => { }
}: EditableOptionsGridProps) {

    const handleOptionClick = (optionId: string) => {
        if (!multiSelect) {
            // Seleção única - substitui a seleção atual
            onSelectionChange([optionId]);
            return;
        }

        // Seleção múltipla
        const currentSelected = [...selectedOptions];
        const isAlreadySelected = currentSelected.includes(optionId);

        if (isAlreadySelected) {
            // Remove da seleção
            const newSelected = currentSelected.filter(id => id !== optionId);
            onSelectionChange(newSelected);
        } else {
            // Adiciona à seleção se não exceder o máximo
            if (currentSelected.length < maxSelections) {
                onSelectionChange([...currentSelected, optionId]);
            }
        }
    };

    // Classes para diferentes estilos de botão
    const getButtonClasses = (optionId: string) => {
        const isSelected = selectedOptions.includes(optionId);
        const baseClasses = "whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 option border-zinc-200 bg-background hover:bg-primary hover:text-foreground px-4 hover:shadow-2xl overflow-hidden min-w-full gap-2 flex h-auto py-2 flex-col items-center justify-start border drop-shadow-none option-button";

        if (isSelected) {
            return `${baseClasses} bg-blue-100 border-blue-500 shadow-lg`;
        }

        switch (buttonStyle) {
            case 'outline':
                return `${baseClasses} border-2 bg-transparent`;
            case 'ghost':
                return `${baseClasses} border-0 bg-transparent hover:bg-gray-100`;
            default:
                return baseClasses;
        }
    };

    // Classes para tamanho da imagem
    const getImageClasses = () => {
        const baseClasses = "w-full rounded-t-md bg-white";
        switch (imageSize) {
            case 'small':
                return `${baseClasses} h-32`;
            case 'large':
                return `${baseClasses} h-80`;
            default: // medium
                return `${baseClasses} h-full`;
        }
    };

    // Orientação das opções
    const getOrientationClasses = () => {
        return orientation === 'vertical'
            ? 'flex-col items-center'
            : 'flex-row items-center gap-4';
    };

    if (options.length === 0) {
        return (
            <div className="min-h-[100px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                <p>Nenhuma opção configurada. Use o painel de propriedades para adicionar opções.</p>
            </div>
        );
    }

    return (
        <div
            className={`grid grid-cols-${columns} gap-${gap}`}
            style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gap: `${gap * 0.25}rem`
            }}
        >
            {options.map((option, index) => (
                <button
                    key={option.id}
                    className={getButtonClasses(option.id)}
                    onClick={() => handleOptionClick(option.id)}
                    type="button"
                >
                    {/* Imagem da opção */}
                    {showImages && option.image && (
                        <img
                            src={option.image}
                            alt={option.text || `Opção ${index + 1}`}
                            width="256"
                            height="256"
                            className={getImageClasses()}
                        />
                    )}

                    {/* Conteúdo da opção */}
                    <div className="py-2 px-4 w-full flex flex-row text-base items-center text-full-primary justify-between">
                        <div className="break-words w-full custom-quill quill ql-editor quill-option text-centered mt-2">
                            {showPrefixes && option.prefix && (
                                <span className="font-semibold">{option.prefix} </span>
                            )}

                            {/* Renderizar HTML ou texto */}
                            {option.htmlContent ? (
                                <span dangerouslySetInnerHTML={{ __html: option.htmlContent }} />
                            ) : option.text ? (
                                <span dangerouslySetInnerHTML={{ __html: option.text }} />
                            ) : (
                                <span>Opção {index + 1}</span>
                            )}
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}

/**
 * 🎯 COMPONENTE WRAPPER PARA PROPRIEDADES
 * 
 * Componente que encapsula a grade de opções com painel de propriedades
 */
export function EditableOptionsGridWithProperties(props: EditableOptionsGridProps) {
    return (
        <EditableField
            label="Grade de Opções"
            isEditable={props.isEditable}
            onEdit={props.onEdit}
        >
            <EditableOptionsGrid {...props} />
        </EditableField>
    );
}