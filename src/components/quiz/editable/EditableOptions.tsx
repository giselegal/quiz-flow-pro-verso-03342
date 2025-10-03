import React from 'react';
import { EditableField } from './EditableField';

export interface QuizOption {
    id: string;
    text: string;
    htmlContent?: string;
    image?: string;
    prefix?: string; // A), B), C), etc.
}

export interface EditableOptionsProps {
    // Layout
    columns?: 1 | 2 | 3 | 4;
    direction?: 'vertical' | 'horizontal';
    disposition?: 'image-text' | 'text-image' | 'text-only' | 'image-only';

    // Opções
    options?: QuizOption[];
    selectedOptions?: string[];
    onSelectionChange?: (selectedIds: string[]) => void;

    // Validações
    multipleChoice?: boolean;
    required?: boolean;
    autoProceed?: boolean;

    // Estilização
    borders?: 'small' | 'medium' | 'large' | 'none';
    shadows?: 'none' | 'small' | 'medium' | 'large';
    spacing?: 'small' | 'medium' | 'large';
    detail?: 'none' | 'subtle' | 'prominent';
    style?: 'simple' | 'rounded' | 'modern';

    // Personalização
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;

    // Avançado
    componentId?: string;

    // Geral
    maxWidth?: number; // 10-100
    generalAlignment?: 'start' | 'center' | 'end';

    // Controle
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}

/**
 * 🎯 COMPONENTE DE OPÇÕES AVANÇADO
 * 
 * Componente que replica completamente as funcionalidades do modelo HTML:
 * - Layout configurável (colunas, direção, disposição)
 * - Opções editáveis com imagem + texto HTML
 * - Validações (múltipla escolha, obrigatório, auto-avançar)
 * - Estilização completa (bordas, sombras, espaçamento, detalhes)
 * - Personalização de cores
 * - Configurações avançadas
 */
export default function EditableOptions({
    // Layout
    columns = 2,
    direction = 'vertical',
    disposition = 'image-text',

    // Opções
    options = [],
    selectedOptions = [],
    onSelectionChange = () => { },

    // Validações
    multipleChoice = true,
    required = true,
    autoProceed = false,

    // Estilização
    borders = 'small',
    shadows = 'none',
    spacing = 'small',
    detail = 'none',
    style = 'simple',

    // Personalização
    backgroundColor = '#ffffff',
    textColor = '#000000',
    borderColor = '#e5e7eb',

    // Avançado
    componentId = '',

    // Geral
    maxWidth = 100,
    generalAlignment = 'start',

    // Controle
    isEditable = false,
    onEdit = () => { }
}: EditableOptionsProps) {

    const handleOptionClick = (optionId: string) => {
        if (!multipleChoice) {
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
            // Adiciona à seleção
            onSelectionChange([...currentSelected, optionId]);
        }
    };

    // Classes base para layout
    const getLayoutClasses = () => {
        const baseClasses = 'grid gap-2';
        return `${baseClasses} grid-cols-${columns}`;
    };

    // Classes para bordas
    const getBorderClasses = () => {
        const borderMap = {
            none: 'border-0',
            small: 'border',
            medium: 'border-2',
            large: 'border-4'
        };
        return borderMap[borders];
    };

    // Classes para sombras
    const getShadowClasses = () => {
        const shadowMap = {
            none: 'shadow-none',
            small: 'shadow-sm',
            medium: 'shadow-md',
            large: 'shadow-2xl'
        };
        return shadowMap[shadows];
    };

    // Classes para espaçamento
    const getSpacingClasses = () => {
        const spacingMap = {
            small: 'p-2',
            medium: 'p-4',
            large: 'p-6'
        };
        return spacingMap[spacing];
    };

    // Classes para estilo
    const getStyleClasses = () => {
        const styleMap = {
            simple: 'rounded-md',
            rounded: 'rounded-lg',
            modern: 'rounded-xl'
        };
        return styleMap[style];
    };

    // Classes para alinhamento geral
    const getGeneralAlignmentClasses = () => {
        const alignmentMap = {
            start: 'self-start',
            center: 'self-center',
            end: 'self-end'
        };
        return alignmentMap[generalAlignment];
    };

    // Classes do botão de opção
    const getOptionButtonClasses = (optionId: string) => {
        const isSelected = selectedOptions.includes(optionId);
        const baseClasses = `
            whitespace-nowrap rounded-md text-sm font-medium ring-offset-background 
            transition-colors focus-visible:outline-none focus-visible:ring-2 
            focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none 
            disabled:opacity-50 option bg-background hover:bg-primary hover:text-foreground 
            px-4 hover:shadow-2xl overflow-hidden min-w-full gap-2 flex h-auto py-2 
            flex-col items-center justify-start drop-shadow-none option-button
            ${getBorderClasses()} ${getShadowClasses()} ${getSpacingClasses()} ${getStyleClasses()}
        `;

        if (isSelected) {
            return `${baseClasses} border-blue-500 bg-blue-50`;
        }

        return baseClasses;
    };

    // Renderização baseada na disposição
    const renderOptionContent = (option: QuizOption, index: number) => {
        const hasImage = option.image && (disposition === 'image-text' || disposition === 'text-image' || disposition === 'image-only');
        const hasText = disposition !== 'image-only';

        const imageElement = hasImage ? (
            <img
                src={option.image}
                alt={option.text || `Opção ${index + 1}`}
                width="256"
                height="256"
                className="w-full rounded-t-md bg-white h-full"
            />
        ) : null;

        const textElement = hasText ? (
            <div className="py-2 px-4 w-full flex flex-row text-base items-center text-full-primary justify-between">
                <div className="break-words w-full custom-quill quill ql-editor quill-option text-centered mt-2">
                    {option.htmlContent ? (
                        <div dangerouslySetInnerHTML={{ __html: option.htmlContent }} />
                    ) : option.text ? (
                        <div dangerouslySetInnerHTML={{ __html: option.text }} />
                    ) : (
                        <p>Opção {index + 1}</p>
                    )}
                </div>
            </div>
        ) : null;

        // Determinar ordem baseada na disposição
        if (disposition === 'text-image') {
            return (
                <>
                    {textElement}
                    {imageElement}
                </>
            );
        }

        return (
            <>
                {imageElement}
                {textElement}
            </>
        );
    };

    // Estilo do container principal
    const containerStyle = {
        backgroundColor: backgroundColor !== '#ffffff' ? backgroundColor : undefined,
        color: textColor !== '#000000' ? textColor : undefined,
        borderColor: borderColor !== '#e5e7eb' ? borderColor : undefined,
        maxWidth: maxWidth < 100 ? `${maxWidth}%` : undefined,
    };

    if (options.length === 0) {
        return (
            <div className="min-h-[100px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                <p>Nenhuma opção configurada. Use o painel para adicionar opções.</p>
            </div>
        );
    }

    return (
        <div
            className={`min-h-[1.25rem] min-w-full relative box-border ${getGeneralAlignmentClasses()}`}
            style={containerStyle}
            id={componentId || undefined}
        >
            <div className={getLayoutClasses()}>
                {options.map((option, index) => (
                    <button
                        key={option.id}
                        className={getOptionButtonClasses(option.id)}
                        onClick={() => handleOptionClick(option.id)}
                        type="button"
                        style={{
                            borderColor: borderColor !== '#e5e7eb' ? borderColor : undefined,
                        }}
                    >
                        {renderOptionContent(option, index)}
                    </button>
                ))}
            </div>

            {/* Indicador de Modo Edição */}
            {isEditable && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-blue-600 bg-blue-50 py-1 px-3 rounded border border-blue-200">
                    💡 Opções ({options.length}) - {multipleChoice ? 'Múltipla' : 'Única'} Escolha
                </div>
            )}
        </div>
    );
}

/**
 * 🎯 WRAPPER COM PROPRIEDADES EDITÁVEIS
 */
export function EditableOptionsWithProperties(props: EditableOptionsProps) {
    return (
        <EditableField
            value={''}
            onChange={() => { }}
            isEditable={props.isEditable ?? true}
        >
            <EditableOptions {...props} />
        </EditableField>
    );
}