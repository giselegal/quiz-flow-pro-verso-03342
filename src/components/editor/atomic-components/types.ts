/**
 * 🧩 ATOMIC COMPONENTS TYPES
 * 
 * Tipos para componentes atômicos modulares que podem ser
 * reordenados, inseridos e removidos individualmente.
 */

export type AtomicComponentType =
    | 'title'
    | 'subtitle'
    | 'text'
    | 'input'
    | 'button'
    | 'image'
    | 'spacer'
    | 'divider'
    | 'question'
    | 'options'
    | 'progress'
    | 'timer';

export interface BaseAtomicComponent {
    id: string;
    type: AtomicComponentType;
    order: number;
    visible: boolean;
}

// 📝 Componentes de Texto
export interface AtomicTitle extends BaseAtomicComponent {
    type: 'title';
    text: string;
    size: 'small' | 'medium' | 'large' | 'xl';
    alignment: 'left' | 'center' | 'right';
    color: string;
    weight: 'normal' | 'bold' | 'extra-bold';
}

export interface AtomicSubtitle extends BaseAtomicComponent {
    type: 'subtitle';
    text: string;
    size: 'small' | 'medium' | 'large';
    alignment: 'left' | 'center' | 'right';
    color: string;
}

export interface AtomicText extends BaseAtomicComponent {
    type: 'text';
    content: string;
    size: 'small' | 'medium' | 'large';
    alignment: 'left' | 'center' | 'right';
    color: string;
    markdown: boolean;
}

// 🎛️ Componentes de Interação
export interface AtomicInput extends BaseAtomicComponent {
    type: 'input';
    label: string;
    placeholder: string;
    inputType: 'text' | 'email' | 'tel' | 'number';
    required: boolean;
    validation?: string;
}

export interface AtomicButton extends BaseAtomicComponent {
    type: 'button';
    text: string;
    action: 'next' | 'previous' | 'submit' | 'custom';
    style: 'primary' | 'secondary' | 'outline' | 'ghost';
    size: 'small' | 'medium' | 'large';
    fullWidth: boolean;
    customAction?: string;
}

// 🎨 Componentes Visuais
export interface AtomicImage extends BaseAtomicComponent {
    type: 'image';
    src: string;
    alt: string;
    width?: 'auto' | 'full' | '1/2' | '1/3' | '2/3';
    height?: number;
    borderRadius?: number;
    alignment?: 'left' | 'center' | 'right';
}

export interface AtomicSpacer extends BaseAtomicComponent {
    type: 'spacer';
    height?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export interface AtomicDivider extends BaseAtomicComponent {
    type: 'divider';
    style?: 'solid' | 'dashed' | 'dotted' | 'double';
    color?: 'gray' | 'blue' | 'purple' | 'green' | 'red' | 'yellow';
    thickness?: 'thin' | 'normal' | 'thick';
    margin?: 'none' | 'sm' | 'md' | 'lg';
}

// 🎯 Componentes de Quiz
export interface AtomicQuestion extends BaseAtomicComponent {
    type: 'question';
    question?: string;
    questionText?: string;
    questionNumber?: string;
    description?: string;
    questionType?: 'multiple-choice' | 'single-choice' | 'text' | 'scale';
    required?: boolean;
    style?: 'default' | 'card' | 'minimal';
}

export interface AtomicOptions extends BaseAtomicComponent {
    type: 'options';
    options?: Array<{
        id: string;
        text: string;
        value?: string;
    }>;
    optionType?: 'radio' | 'checkbox' | 'buttons' | 'cards';
    multipleChoice?: boolean;
    requiredSelections?: number;
    layout?: 'vertical' | 'horizontal' | 'grid';
    columns?: 1 | 2 | 3 | 4;
}

export interface AtomicProgress extends BaseAtomicComponent {
    type: 'progress';
    currentStep: number;
    totalSteps: number;
    showNumbers: boolean;
    showPercentage: boolean;
}

export interface AtomicTimer extends BaseAtomicComponent {
    type: 'timer';
    duration: number; // seconds
    autoAdvance: boolean;
    showWarning: boolean;
    warningAt: number; // seconds remaining
}

// 🎪 Union Type
export type AtomicComponent =
    | AtomicTitle
    | AtomicSubtitle
    | AtomicText
    | AtomicInput
    | AtomicButton
    | AtomicImage
    | AtomicSpacer
    | AtomicDivider
    | AtomicQuestion
    | AtomicOptions
    | AtomicProgress
    | AtomicTimer;

// 📋 Props para componentes atômicos
export interface AtomicComponentProps {
    component: AtomicComponent;
    isSelected: boolean;
    isEditable: boolean;
    onUpdate: (updates: Partial<AtomicComponent>) => void;
    onSelect: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    onInsertAfter: (componentType: AtomicComponentType) => void;
    canMoveUp: boolean;
    canMoveDown: boolean;
    stepId: string;
}

// 📦 Container de etapa modular
export interface ModularStep {
    id: string;
    name: string;
    type: string;
    components: AtomicComponent[];
    settings: {
        backgroundColor?: string;
        padding?: number;
        minHeight?: number;
    };
}

// 🎨 Props para container de etapa
export interface ModularStepProps {
    step: ModularStep;
    isEditable: boolean;
    selectedComponentId?: string;
    onUpdateStep: (updates: Partial<ModularStep>) => void;
    onUpdateComponent: (componentId: string, updates: Partial<AtomicComponent>) => void;
    onSelectComponent: (componentId: string) => void;
    onDeleteComponent: (componentId: string) => void;
    onDuplicateComponent: (componentId: string) => void;
    onReorderComponents: (fromIndex: number, toIndex: number) => void;
    onInsertComponent: (afterComponentId: string | null, componentType: AtomicComponentType) => void;
}