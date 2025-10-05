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

    return (
        <div
            className={`canvas-heading ${isSelected ? 'selected' : ''} ${isEditable ? 'editable' : ''}`}
            onClick={onSelect}
        >
            <HeadingTag
                className={`text-${level === 1 ? '3xl' : level === 2 ? '2xl' : 'xl'} font-bold text-${alignment}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => onUpdate({ data: { ...item.data, text: e.target.textContent } })}
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
    const { src = '', alt = 'Imagem', width = 'auto', height = 'auto' } = item.data;

    return (
        <div
            className={`canvas-image ${isSelected ? 'selected' : ''}`}
            onClick={onSelect}
        >
            <div className="image-container">
                <img
                    src={src}
                    alt={alt}
                    className="object-cover w-full h-auto rounded-lg max-w-96"
                    style={{ width, height }}
                />
                {isEditable && (
                    <div className="image-controls">
                        <input
                            type="url"
                            placeholder="URL da imagem"
                            value={src}
                            onChange={(e) => onUpdate({ data: { ...item.data, src: e.target.value } })}
                        />
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
        label = 'Campo',
        placeholder = 'Digite aqui...',
        required = false,
        type = 'text'
    } = item.data;

    return (
        <div
            className={`canvas-input ${isSelected ? 'selected' : ''}`}
            onClick={onSelect}
        >
            <div className="grid w-full items-center gap-1.5">
                <label className="text-sm font-medium leading-none">
                    {isEditable ? (
                        <input
                            value={label}
                            onChange={(e) => onUpdate({ data: { ...item.data, label: e.target.value } })}
                            className="inline-edit"
                        />
                    ) : (
                        label
                    )}
                    {required && <span> *</span>}
                </label>
                <input
                    type={type}
                    placeholder={isEditable ? 'Placeholder editável' : placeholder}
                    className="flex h-10 w-full rounded-md border border-input bg-background p-4"
                    readOnly={!isEditable}
                    value={isEditable ? placeholder : ''}
                    onChange={isEditable ? (e) => onUpdate({ data: { ...item.data, placeholder: e.target.value } }) : undefined}
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
        text = 'Botão',
        variant = 'primary',
        size = 'default',
        fullWidth = true
    } = item.data;

    return (
        <div
            className={`canvas-button ${isSelected ? 'selected' : ''}`}
            onClick={onSelect}
        >
            <button
                className={`btn btn-${variant} btn-${size} ${fullWidth ? 'w-full' : ''} h-14`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => onUpdate({ data: { ...item.data, text: e.target.textContent } })}
            >
                {text}
            </button>
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
    };

    return (
        <div className="vertical-canvas">
            {/* Header do Step */}
            <div className="canvas-header">
                <div className="flex justify-center items-center gap-4">
                    <img src="/logo.png" alt="Logo" className="w-24 h-24" />
                    <div className="progress-bar w-full h-2 bg-gray-300 rounded-full">
                        <div className="progress h-full bg-primary rounded-full" style={{ width: '30%' }} />
                    </div>
                </div>
            </div>

            {/* Canvas Items */}
            <div className="canvas-content">
                {step.canvasItems
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => {
                        const Component = componentMap[item.type as keyof typeof componentMap];

                        if (!Component) return null;

                        return (
                            <div
                                key={item.id}
                                className={`canvas-item-wrapper ${isEditable ? 'editable' : ''} ${selectedItemId === item.id ? 'selected' : ''
                                    }`}
                                role={isEditable ? 'button' : undefined}
                                tabIndex={isEditable ? 0 : undefined}
                                aria-roledescription={isEditable ? 'sortable' : undefined}
                                data-sentry-component="VerticalCanvasItem"
                            >
                                <div
                                    className="canvas-item-content min-h-[1.25rem] min-w-full relative box-border
                           group-hover:border-2 border-dashed hover:border-2 border-blue-500 rounded-md"
                                    data-state="closed"
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

            {/* Add Item Controls */}
            {isEditable && (
                <div className="canvas-add-controls">
                    <div className="flex gap-2 justify-center p-4">
                        <button onClick={() => onItemAdd('heading')}>+ Título</button>
                        <button onClick={() => onItemAdd('image')}>+ Imagem</button>
                        <button onClick={() => onItemAdd('input')}>+ Campo</button>
                        <button onClick={() => onItemAdd('button')}>+ Botão</button>
                    </div>
                </div>
            )}
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
    // Converter step existente para formato canvas
    const canvasItems: CanvasItem[] = [];

    // Exemplo de conversão
    if (step.title) {
        canvasItems.push(createCanvasItem('heading', 0, {
            text: step.title,
            level: 1,
            alignment: 'center'
        }));
    }

    if (step.image) {
        canvasItems.push(createCanvasItem('image', 1, {
            src: step.image,
            alt: 'Imagem do step'
        }));
    }

    if (step.formQuestion) {
        canvasItems.push(createCanvasItem('input', 2, {
            label: step.formQuestion,
            placeholder: step.placeholder || 'Digite aqui...',
            required: true
        }));
    }

    if (step.buttonText) {
        canvasItems.push(createCanvasItem('button', 3, {
            text: step.buttonText,
            variant: 'primary',
            fullWidth: true
        }));
    }

    return {
        stepId: step.id,
        stepType: step.type,
        canvasItems,
        stepConfig: {
            title: step.title,
            description: step.description,
            nextStep: step.nextStep,
        }
    };
};