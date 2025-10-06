/**
 * 🧩 SISTEMA DE COMPONENTES MODULARES
 * 
 * Tipos e interfaces para o sistema de componentes modulares do editor de quiz.
 * Cada etapa do funil é composta por componentes independentes e editáveis.
 */

export type ComponentType =
    | 'title'
    | 'text'
    | 'input'
    | 'button'
    | 'image'
    | 'options'
    | 'spacer'
    | 'divider'
    | 'help-text'
    | 'progress-bar'
    | 'step-intro'
    | 'step-question'
    | 'step-strategic-question'
    | 'step-transition'
    | 'step-transition-result'
    | 'step-result'
    | 'step-offer';

export interface BaseComponentProps {
    id: string;
    type: ComponentType;
    order: number;
    visible: boolean;
    className?: string;
    style?: React.CSSProperties;
}

// 📝 Componente de Título
export interface TitleComponentProps extends BaseComponentProps {
    type: 'title';
    text: string;
    level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    align: 'left' | 'center' | 'right';
    color?: string;
    fontSize?: string;
}

// 📄 Componente de Texto
export interface TextComponentProps extends BaseComponentProps {
    type: 'text';
    content: string;
    align: 'left' | 'center' | 'right' | 'justify';
    color?: string;
    fontSize?: string;
    fontWeight?: 'normal' | 'bold' | 'lighter';
}

// 📥 Componente de Input
export interface InputComponentProps extends BaseComponentProps {
    type: 'input';
    label: string;
    placeholder: string;
    inputType: 'text' | 'email' | 'tel' | 'number';
    required: boolean;
    maxLength?: number;
    validation?: {
        pattern?: string;
        minLength?: number;
        maxLength?: number;
    };
}

// 🔘 Componente de Botão
export interface ButtonComponentProps extends BaseComponentProps {
    type: 'button';
    text: string;
    variant: 'primary' | 'secondary' | 'outline' | 'ghost';
    size: 'sm' | 'md' | 'lg';
    disabled: boolean;
    action: 'next' | 'submit' | 'custom';
    customAction?: string;
}

// 🖼️ Componente de Imagem
export interface ImageComponentProps extends BaseComponentProps {
    type: 'image';
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fit: 'cover' | 'contain' | 'fill' | 'scale-down';
    rounded: boolean;
    shadow: boolean;
}

// ☑️ Componente de Opções
export interface OptionsComponentProps extends BaseComponentProps {
    type: 'options';
    title?: string;
    options: Array<{
        id: string;
        text: string;
        image?: string;
        value: string;
        selected?: boolean;
    }>;
    selectionType: 'single' | 'multiple';
    minSelections: number;
    maxSelections: number;
    layout: 'grid' | 'list' | 'cards';
    columnsPerRow: number;
}

// 📏 Componente de Espaçador
export interface SpacerComponentProps extends BaseComponentProps {
    type: 'spacer';
    height: number;
    backgroundColor?: string;
}

// ➖ Componente de Divisor
export interface DividerComponentProps extends BaseComponentProps {
    type: 'divider';
    thickness: number;
    color: string;
    borderStyle: 'solid' | 'dashed' | 'dotted';
    margin: number;
}

// ❓ Componente de Texto de Ajuda
export interface HelpTextComponentProps extends BaseComponentProps {
    type: 'help-text';
    content: string;
    variant: 'info' | 'warning' | 'success' | 'error';
    icon?: string;
    collapsible: boolean;
}

// 📊 Componente de Barra de Progresso
export interface ProgressBarComponentProps extends BaseComponentProps {
    type: 'progress-bar';
    currentStep: number;
    totalSteps: number;
    showPercentage: boolean;
    showStepText: boolean;
    color: string;
    backgroundColor: string;
}

export interface StepIntroComponentProps extends BaseComponentProps {
    type: 'step-intro';
    title: string;
    formQuestion: string;
    placeholder: string;
    buttonText: string;
    image?: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
}

export interface StepQuestionOption {
    id: string;
    text: string;
    image?: string;
}

export interface StepQuestionComponentProps extends BaseComponentProps {
    type: 'step-question';
    questionNumber?: string;
    questionText: string;
    subtitle?: string;
    options: StepQuestionOption[];
    requiredSelections?: number;
    allowMultipleSelection?: boolean;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
}

export interface StepStrategicQuestionOption {
    id: string;
    text: string;
}

export interface StepStrategicQuestionComponentProps extends BaseComponentProps {
    type: 'step-strategic-question';
    questionText: string;
    options: StepStrategicQuestionOption[];
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
}

export interface StepTransitionComponentProps extends BaseComponentProps {
    type: 'step-transition';
    title: string;
    text?: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
}

export interface StepTransitionResultComponentProps extends BaseComponentProps {
    type: 'step-transition-result';
    title: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
}

export interface StepResultComponentProps extends BaseComponentProps {
    type: 'step-result';
    title: string;
    subtitle?: string;
    resultPlaceholder?: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
}

export interface StepOfferTestimonial {
    quote: string;
    author: string;
}

export interface StepOfferComponentProps extends BaseComponentProps {
    type: 'step-offer';
    title: string;
    description: string;
    buttonText: string;
    image?: string;
    testimonial?: StepOfferTestimonial;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
}

// União de todos os tipos de componentes
export type ModularComponent =
    | TitleComponentProps
    | TextComponentProps
    | InputComponentProps
    | ButtonComponentProps
    | ImageComponentProps
    | OptionsComponentProps
    | SpacerComponentProps
    | DividerComponentProps
    | HelpTextComponentProps
    | ProgressBarComponentProps
    | StepIntroComponentProps
    | StepQuestionComponentProps
    | StepStrategicQuestionComponentProps
    | StepTransitionComponentProps
    | StepTransitionResultComponentProps
    | StepResultComponentProps
    | StepOfferComponentProps;

// 🏗️ Etapa Modular
export interface ModularStep {
    id: string;
    name: string;
    type: 'intro' | 'question' | 'strategic-question' | 'transition' | 'result' | 'offer' | 'custom';
    components: ModularComponent[];
    settings: {
        backgroundColor?: string;
        backgroundImage?: string;
        padding?: number;
        minHeight?: number;
        maxWidth?: number;
        centerContent?: boolean;
    };
    validation?: {
        required: boolean;
        customValidation?: string;
    };
}

// 🎯 Estado do Editor Modular
export interface ModularEditorState {
    steps: ModularStep[];
    currentStepId: string | null;
    selectedComponentId: string | null;
    dragMode: boolean;
    previewMode: boolean;
    history: {
        past: ModularStep[][];
        present: ModularStep[];
        future: ModularStep[][];
    };
}

// 🔧 Ações do Editor
export type EditorAction =
    | { type: 'SET_STEPS'; payload: ModularStep[] }
    | { type: 'ADD_STEP'; payload: ModularStep }
    | { type: 'UPDATE_STEP'; payload: { stepId: string; updates: Partial<ModularStep> } }
    | { type: 'DELETE_STEP'; payload: string }
    | { type: 'REORDER_STEPS'; payload: { fromIndex: number; toIndex: number } }
    | { type: 'SELECT_STEP'; payload: string | null }
    | { type: 'ADD_COMPONENT'; payload: { stepId: string; component: ModularComponent } }
    | { type: 'UPDATE_COMPONENT'; payload: { stepId: string; componentId: string; updates: Partial<ModularComponent> } }
    | { type: 'DELETE_COMPONENT'; payload: { stepId: string; componentId: string } }
    | { type: 'REORDER_COMPONENTS'; payload: { stepId: string; fromIndex: number; toIndex: number } }
    | { type: 'SELECT_COMPONENT'; payload: string | null }
    | { type: 'TOGGLE_DRAG_MODE' }
    | { type: 'TOGGLE_PREVIEW_MODE' }
    | { type: 'UNDO' }
    | { type: 'REDO' };

// 🎨 Props para renderização de componentes
export interface ComponentRenderProps {
    component: ModularComponent;
    isSelected: boolean;
    isEditing: boolean;
    onSelect: (id: string) => void;
    onUpdate: (updates: Partial<ModularComponent>) => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
}

// 🔨 Factory de Componentes
export interface ComponentFactory {
    create: (type: ComponentType, overrides?: Partial<ModularComponent>) => ModularComponent;
    duplicate: (component: ModularComponent) => ModularComponent;
    getDefaultProps: (type: ComponentType) => ModularComponent;
}

// 📋 Template de Etapa
export interface StepTemplate {
    id: string;
    name: string;
    description: string;
    type: ModularStep['type'];
    components: Omit<ModularComponent, 'id'>[];
    preview?: string;
}