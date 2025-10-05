/**
 * 🎯 SISTEMA HÍBRIDO DE COMPONENTES CANVAS
 * 
 * Combina a flexibilidade do sistema Canvas Vertical com nossos componentes Step-based
 * Inspirado na análise do modelo HTML fornecido
 */

import React from 'react';

// =============================================================================
// TIPOS BASE DO SISTEMA CANVAS
// =============================================================================

export interface CanvasItem {
    /** ID único (UUID) para identificação */
    id: string;

    /** Tipo do componente */
    type: 'heading' | 'image' | 'input' | 'button' | 'text' | 'divider' | 'spacer';

    /** Dados específicos do componente */
    data: Record<string, any>;

    /** Ordem no canvas */
    order: number;

    /** Se está selecionado */
    isSelected?: boolean;

    /** Se pode ser arrastado */
    isDraggable?: boolean;

    /** Metadados */
    metadata?: {
        stepId?: string;
        category?: string;
        tags?: string[];
    };
}

export interface CanvasStep {
    /** ID do step */
    stepId: string;

    /** Tipo do step */
    stepType: 'intro' | 'question' | 'result' | 'offer';

    /** Items do canvas para este step */
    canvasItems: CanvasItem[];

    /** Configurações do step */
    stepConfig: {
        title?: string;
        description?: string;
        nextStep?: string;
        validationRules?: Record<string, any>;
    };
}

// =============================================================================
// COMPONENTES CANVAS ATÔMICOS
// =============================================================================

export interface CanvasComponentProps {
    item: CanvasItem;
    isEditable: boolean;
    isSelected: boolean;
    onUpdate: (updates: Partial<CanvasItem>) => void;
    onSelect: () => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
}

// =============================================================================
// COMPONENTES CANVAS ATÔMICOS COMPLETOS
// =============================================================================

// Heading Component
export const EditableCanvasHeading: React.FC<CanvasComponentProps> = ({
    item,
    isEditable,
    isSelected,
    onUpdate,
    onSelect
}) => {
    const { text = 'Título', level = 1, alignment = 'center' } = item.data;
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

    const alignmentClass = ({
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    } as any)[alignment] || 'text-center';

    const sizeClass = ({
        1: 'text-3xl',
        2: 'text-2xl',
        3: 'text-xl',
        4: 'text-lg',
        5: 'text-base',
        6: 'text-sm'
    } as any)[level] || 'text-2xl';

    return (
        <div
            className={`canvas-heading relative group cursor-pointer min-h-[40px] ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/30' : ''
                } ${isEditable ? 'hover:ring-1 hover:ring-blue-300' : ''}`}
            onClick={onSelect}
        >
            {isSelected && isEditable && (
                <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 text-xs rounded z-10">
                    Título H{level}
                </div>
            )}
            <HeadingTag
                className={`${sizeClass} font-bold ${alignmentClass} transition-all duration-200`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => onUpdate({ data: { ...item.data, text: e.target.textContent || text } })}
                style={{ outline: 'none' }}
            >
                {text}
            </HeadingTag>
        </div>
    );
};

// Image Component
export const EditableCanvasImage: React.FC<CanvasComponentProps> = ({
    item,
    isEditable,
    isSelected,
    onUpdate,
    onSelect
}) => {
    const {
        src = 'https://via.placeholder.com/400x300?text=Clique+para+editar',
        alt = 'Imagem',
        width = 'auto',
        height = 'auto',
        borderRadius = 'rounded-lg'
    } = item.data;

    return (
        <div
            className={`canvas-image relative group cursor-pointer ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                } ${isEditable ? 'hover:ring-1 hover:ring-blue-300' : ''}`}
            onClick={onSelect}
        >
            {isSelected && isEditable && (
                <div className="absolute -top-6 left-0 bg-green-500 text-white px-2 py-1 text-xs rounded z-10">
                    Imagem
                </div>
            )}
            <div className="image-container">
                <img
                    src={src}
                    alt={alt}
                    className={`object-cover w-full h-auto ${borderRadius} max-w-96 transition-all duration-200`}
                    style={{ width, height }}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Erro+ao+carregar';
                    }}
                />
                {isEditable && isSelected && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-white text-center">
                            <div className="text-sm mb-2">Clique para editar</div>
                            <input
                                type="url"
                                placeholder="Cole a URL da imagem"
                                value={src}
                                onChange={(e) => onUpdate({ data: { ...item.data, src: e.target.value } })}
                                className="px-2 py-1 text-xs rounded text-black"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Input Component
export const EditableCanvasInput: React.FC<CanvasComponentProps> = ({
    item,
    isEditable,
    isSelected,
    onUpdate,
    onSelect
}) => {
    const {
        label = 'Campo de Entrada',
        placeholder = 'Digite aqui...',
        required = false,
        type = 'text'
    } = item.data;

    return (
        <div
            className={`canvas-input relative group cursor-pointer ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/30' : ''
                } ${isEditable ? 'hover:ring-1 hover:ring-blue-300' : ''}`}
            onClick={onSelect}
        >
            {isSelected && isEditable && (
                <div className="absolute -top-6 left-0 bg-yellow-500 text-white px-2 py-1 text-xs rounded z-10">
                    Campo {type}
                </div>
            )}
            <div className="grid w-full items-center gap-1.5">
                <label className="text-sm font-medium leading-none">
                    {isEditable ? (
                        <input
                            value={label}
                            onChange={(e) => onUpdate({ data: { ...item.data, label: e.target.value } })}
                            className="bg-transparent border-none outline-none p-0 text-sm font-medium w-full"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        label
                    )}
                    {required && <span className="text-red-500"> *</span>}
                </label>
                <input
                    type={type}
                    placeholder={placeholder}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm 
                             ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium 
                             placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 
                             focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed 
                             disabled:opacity-50"
                    disabled={!isEditable}
                    onChange={isEditable ? (e) => onUpdate({ data: { ...item.data, placeholder: e.target.value } }) : undefined}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
};

// Button Component
export const EditableCanvasButton: React.FC<CanvasComponentProps> = ({
    item,
    isEditable,
    isSelected,
    onUpdate,
    onSelect
}) => {
    const {
        text = 'Continuar',
        variant = 'primary',
        size = 'default',
        fullWidth = true
    } = item.data;

    const variantClasses = ({
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
        ghost: 'text-blue-600 hover:bg-blue-100'
    } as any)[variant] || 'bg-blue-600 hover:bg-blue-700 text-white';

    const sizeClasses = ({
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 py-2',
        lg: 'h-14 px-6 text-lg'
    } as any)[size] || 'h-10 px-4 py-2';

    return (
        <div
            className={`canvas-button relative group cursor-pointer ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                } ${isEditable ? 'hover:ring-1 hover:ring-blue-300' : ''}`}
            onClick={onSelect}
        >
            {isSelected && isEditable && (
                <div className="absolute -top-6 left-0 bg-purple-500 text-white px-2 py-1 text-xs rounded z-10">
                    Botão {variant}
                </div>
            )}
            <button
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium 
                           ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 
                           focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none 
                           disabled:opacity-50 ${variantClasses} ${sizeClasses} ${fullWidth ? 'w-full' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => onUpdate({ data: { ...item.data, text: e.target.textContent || text } })}
                style={{ outline: 'none' }}
                onClick={(e) => e.stopPropagation()}
            >
                {text}
            </button>
        </div>
    );
};

// Text Component
export const EditableCanvasText: React.FC<CanvasComponentProps> = ({
    item,
    isEditable,
    isSelected,
    onUpdate,
    onSelect
}) => {
    const {
        content = 'Digite seu texto aqui...',
        fontSize = 'base',
        alignment = 'left',
        color = 'gray-900'
    } = item.data;

    const fontSizeClasses = ({
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl'
    } as any)[fontSize] || 'text-base';

    const alignmentClass = ({
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    } as any)[alignment] || 'text-left';

    return (
        <div
            className={`canvas-text relative group cursor-pointer min-h-[24px] ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/30' : ''
                } ${isEditable ? 'hover:ring-1 hover:ring-blue-300' : ''}`}
            onClick={onSelect}
        >
            {isSelected && isEditable && (
                <div className="absolute -top-6 left-0 bg-gray-500 text-white px-2 py-1 text-xs rounded z-10">
                    Texto
                </div>
            )}
            <p
                className={`${fontSizeClasses} ${alignmentClass} text-${color} transition-all duration-200 leading-relaxed`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => onUpdate({ data: { ...item.data, content: e.target.textContent || content } })}
                style={{ outline: 'none' }}
            >
                {content}
            </p>
        </div>
    );
};

// Spacer Component
export const EditableCanvasSpacer: React.FC<CanvasComponentProps> = ({
    item,
    isEditable,
    isSelected,
    onUpdate,
    onSelect
}) => {
    const { height = '20px', showGuides = false } = item.data;

    return (
        <div
            className={`canvas-spacer relative group cursor-pointer ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/30' : ''
                } ${isEditable ? 'hover:ring-1 hover:ring-blue-300' : ''}`}
            onClick={onSelect}
            style={{ height }}
        >
            {isSelected && isEditable && (
                <>
                    <div className="absolute -top-6 left-0 bg-indigo-500 text-white px-2 py-1 text-xs rounded z-10">
                        Espaçador {height}
                    </div>
                    <div className="absolute inset-0 border-2 border-dashed border-indigo-300 flex items-center justify-center">
                        <span className="text-indigo-500 text-xs bg-white px-2 rounded">
                            Espaço {height}
                        </span>
                    </div>
                </>
            )}
            {showGuides && (
                <div className="absolute inset-0 border border-dashed border-gray-300"></div>
            )}
        </div>
    );
};

// Divider Component
export const EditableCanvasDivider: React.FC<CanvasComponentProps> = ({
    item,
    isEditable,
    isSelected,
    onUpdate,
    onSelect
}) => {
    const {
        style = 'solid',
        color = 'gray-300',
        thickness = 1,
        margin = '16px'
    } = item.data;

    const borderStyle = ({
        solid: 'solid',
        dashed: 'dashed',
        dotted: 'dotted'
    } as any)[style] || 'solid';

    return (
        <div
            className={`canvas-divider relative group cursor-pointer ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/30' : ''
                } ${isEditable ? 'hover:ring-1 hover:ring-blue-300' : ''}`}
            onClick={onSelect}
            style={{ margin: `${margin} 0` }}
        >
            {isSelected && isEditable && (
                <div className="absolute -top-6 left-0 bg-gray-600 text-white px-2 py-1 text-xs rounded z-10">
                    Divisor {style}
                </div>
            )}
            <hr
                className={`border-${color} w-full`}
                style={{
                    borderWidth: `${thickness}px 0 0 0`,
                    borderStyle: `${borderStyle} none none none`
                }}
            />
        </div>
    );
};

// =============================================================================
// CANVAS CONTAINER
// =============================================================================

export interface VerticalCanvasProps {
    step: CanvasStep;
    isEditable: boolean;
    selectedItemId?: string;
    onItemSelect: (itemId: string) => void;
    onItemUpdate: (itemId: string, updates: Partial<CanvasItem>) => void;
    onItemReorder: (fromIndex: number, toIndex: number) => void;
    onItemAdd: (type: CanvasItem['type'], afterIndex?: number) => void;
    onItemDelete: (itemId: string) => void;
}

export const VerticalCanvas: React.FC<VerticalCanvasProps> = ({
    step,
    isEditable,
    selectedItemId,
    onItemSelect,
    onItemUpdate,
    onItemReorder,
    onItemAdd,
    onItemDelete
}) => {
    const componentMap = {
        heading: EditableCanvasHeading,
        image: EditableCanvasImage,
        input: EditableCanvasInput,
        button: EditableCanvasButton,
        text: EditableCanvasText,
        spacer: EditableCanvasSpacer,
        divider: EditableCanvasDivider,
    };

    return (
        <div className="vertical-canvas bg-white min-h-screen">
            {/* Header do Step - Similar ao modelo HTML analisado */}
            <div className="canvas-header flex flex-col gap-4 md:gap-6 p-3 md:p-5">
                <div className="flex flex-row w-full h-auto justify-center relative">
                    {/* Logo placeholder */}
                    <div className="flex flex-col w-full customizable-width justify-start items-center gap-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-500 text-xs">Logo</span>
                        </div>
                        {/* Progress bar */}
                        <div className="relative w-full overflow-hidden rounded-full bg-gray-300 h-2">
                            <div className="progress h-full w-full flex-1 bg-blue-500 transition-all"
                                style={{ transform: 'translateX(-70%)' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Canvas Items */}
            <div className="canvas-content main-content w-full relative mx-auto customizable-width">
                <div className="flex flex-row flex-wrap pb-10 gap-4">
                    {step.canvasItems
                        .sort((a, b) => a.order - b.order)
                        .map((item, index) => {
                            const Component = componentMap[item.type as keyof typeof componentMap];

                            if (!Component) {
                                return (
                                    <div key={item.id} className="w-full p-4 border-2 border-red-300 bg-red-50 rounded">
                                        <span className="text-red-600">Componente não encontrado: {item.type}</span>
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={item.id}
                                    className={`canvas-item-wrapper group/canvas-item max-w-full canvas-item min-h-[1.25rem] 
                                               relative self-auto mr-auto w-full ${isEditable ? 'editable' : ''} 
                                               ${selectedItemId === item.id ? 'selected' : ''}`}
                                    role={isEditable ? 'button' : undefined}
                                    tabIndex={isEditable ? 0 : undefined}
                                    aria-roledescription={isEditable ? 'sortable' : undefined}
                                    data-sentry-component="VerticalCanvasItem"
                                    style={{
                                        transform: 'translate3d(0px, 0px, 0px) scaleX(1) scaleY(1)',
                                        flexBasis: '100%'
                                    }}
                                >
                                    <div
                                        className="canvas-item-content min-h-[1.25rem] min-w-full relative self-auto box-border 
                                                   customizable-gap transition-all duration-200"
                                        data-state="closed"
                                        style={{ opacity: 1, willChange: 'transform' }}
                                    >
                                        <Component
                                            item={item}
                                            isEditable={isEditable}
                                            isSelected={selectedItemId === item.id}
                                            onUpdate={(updates) => onItemUpdate(item.id, updates)}
                                            onSelect={() => onItemSelect(item.id)}
                                            onDelete={() => onItemDelete(item.id)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Add Item Controls - Mais elegante */}
            {isEditable && (
                <div className="canvas-add-controls sticky bottom-0 bg-white border-t p-4 shadow-lg">
                    <div className="flex gap-2 justify-center flex-wrap max-w-4xl mx-auto">
                        <button
                            onClick={() => onItemAdd('heading')}
                            className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm flex items-center gap-2 transition-colors"
                        >
                            📝 Título
                        </button>
                        <button
                            onClick={() => onItemAdd('image')}
                            className="px-3 py-2 bg-green-100 hover:bg-green-200 rounded-lg text-sm flex items-center gap-2 transition-colors"
                        >
                            🖼️ Imagem
                        </button>
                        <button
                            onClick={() => onItemAdd('input')}
                            className="px-3 py-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-sm flex items-center gap-2 transition-colors"
                        >
                            📝 Campo
                        </button>
                        <button
                            onClick={() => onItemAdd('button')}
                            className="px-3 py-2 bg-purple-100 hover:bg-purple-200 rounded-lg text-sm flex items-center gap-2 transition-colors"
                        >
                            🔘 Botão
                        </button>
                        <button
                            onClick={() => onItemAdd('text')}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center gap-2 transition-colors"
                        >
                            📄 Texto
                        </button>
                        <button
                            onClick={() => onItemAdd('spacer')}
                            className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg text-sm flex items-center gap-2 transition-colors"
                        >
                            📏 Espaço
                        </button>
                        <button
                            onClick={() => onItemAdd('divider')}
                            className="px-3 py-2 bg-orange-100 hover:bg-orange-200 rounded-lg text-sm flex items-center gap-2 transition-colors"
                        >
                            ➖ Divisor
                        </button>
                    </div>
                </div>
            )}

            {/* Spacer final */}
            <div className="pt-10 md:pt-24"></div>
        </div>
    );
};

// =============================================================================
// UTILITÁRIOS
// =============================================================================

export const createCanvasItem = (
    type: CanvasItem['type'],
    order: number,
    defaultData: Record<string, any> = {}
): CanvasItem => ({
    id: `canvas-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    data: defaultData,
    order,
    isDraggable: true,
});

export const convertStepToCanvas = (step: any): CanvasStep => {
    const canvasItems: CanvasItem[] = [];
    let order = 0;

    // 1. Converter título principal
    if (step.title) {
        canvasItems.push(createCanvasItem('heading', order++, {
            text: step.title,
            level: step.type === 'intro' ? 1 : 2,
            alignment: 'center'
        }));
    }

    // 2. Converter subtitle se existir
    if (step.subtitle) {
        canvasItems.push(createCanvasItem('text', order++, {
            content: step.subtitle,
            fontSize: 'lg',
            alignment: 'center',
            color: 'gray-600'
        }));
    }

    // 3. Converter descrição se existir  
    if (step.description) {
        canvasItems.push(createCanvasItem('text', order++, {
            content: step.description,
            fontSize: 'base',
            alignment: 'center',
            color: 'gray-700'
        }));
    }

    // 4. Converter imagem
    if (step.image) {
        canvasItems.push(createCanvasItem('image', order++, {
            src: step.image,
            alt: step.title || 'Imagem do step',
            borderRadius: 'rounded-lg'
        }));
    }

    // 5. Converter pergunta de formulário
    if (step.formQuestion) {
        canvasItems.push(createCanvasItem('input', order++, {
            label: step.formQuestion,
            placeholder: step.placeholder || 'Digite aqui...',
            required: step.required !== false,
            type: step.inputType || 'text'
        }));
    }

    // 6. Converter pergunta de múltipla escolha
    if (step.questionText) {
        canvasItems.push(createCanvasItem('heading', order++, {
            text: step.questionText,
            level: 3,
            alignment: 'left'
        }));

        // TODO: Implementar opções de múltipla escolha como componentes específicos
    }

    // 7. Converter características (para results)
    if (step.characteristics && Array.isArray(step.characteristics)) {
        step.characteristics.forEach((characteristic: string) => {
            canvasItems.push(createCanvasItem('text', order++, {
                content: `• ${characteristic}`,
                fontSize: 'base',
                alignment: 'left',
                color: 'gray-700'
            }));
        });
    }

    // 8. Converter benefícios (para offers)
    if (step.benefits && Array.isArray(step.benefits)) {
        step.benefits.forEach((benefit: string) => {
            canvasItems.push(createCanvasItem('text', order++, {
                content: `✓ ${benefit}`,
                fontSize: 'base',
                alignment: 'left',
                color: 'green-700'
            }));
        });
    }

    // 9. Adicionar espaçador se houver muitos elementos
    if (canvasItems.length > 2) {
        canvasItems.push(createCanvasItem('spacer', order++, {
            height: '24px'
        }));
    }

    // 10. Converter botão (sempre por último)
    if (step.buttonText) {
        canvasItems.push(createCanvasItem('button', order++, {
            text: step.buttonText,
            variant: step.type === 'offer' ? 'primary' : 'primary',
            size: 'lg',
            fullWidth: true
        }));
    }

    return {
        stepId: step.id || `step-${Date.now()}`,
        stepType: step.type || 'question',
        canvasItems,
        stepConfig: {
            title: step.title,
            description: step.description,
            nextStep: step.nextStep,
            validationRules: step.validationRules || {}
        }
    };
};

// Converter Canvas de volta para Step tradicional
export const convertCanvasToStep = (canvasStep: CanvasStep): any => {
    const step: any = {
        id: canvasStep.stepId,
        type: canvasStep.stepType,
        ...canvasStep.stepConfig
    };

    // Extrair dados dos canvas items
    canvasStep.canvasItems
        .sort((a, b) => a.order - b.order)
        .forEach(item => {
            switch (item.type) {
                case 'heading':
                    if (!step.title && item.data.level <= 2) {
                        step.title = item.data.text;
                    } else if (!step.subtitle && item.data.level === 3) {
                        step.subtitle = item.data.text;
                    }
                    break;

                case 'image':
                    if (!step.image) {
                        step.image = item.data.src;
                    }
                    break;

                case 'input':
                    if (!step.formQuestion) {
                        step.formQuestion = item.data.label;
                        step.placeholder = item.data.placeholder;
                        step.required = item.data.required;
                        step.inputType = item.data.type;
                    }
                    break;

                case 'button':
                    if (!step.buttonText) {
                        step.buttonText = item.data.text;
                    }
                    break;

                case 'text':
                    if (!step.description && item.data.alignment === 'center') {
                        step.description = item.data.content;
                    }
                    break;
            }
        });

    return step;
};