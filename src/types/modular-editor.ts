/**
 * 🎯 TIPOS TYPESCRIPT PARA SISTEMA MODULAR
 * 
 * Definições completas para a arquitetura modular do editor de quiz
 */

// ============================================================================
// TIPOS BASE DO SISTEMA MODULAR
// ============================================================================

export type ComponentType =
    | 'header'
    | 'title'
    | 'text'
    | 'image'
    | 'form-field'
    | 'options-grid'
    | 'button'
    | 'spacer'
    | 'divider'
    | 'video'
    | 'custom-html'
    | 'result-display'
    | 'progress-bar'
    | 'countdown-timer'
    | 'social-share';

export type StepType =
    | 'intro'
    | 'question'
    | 'strategic-question'
    | 'transition'
    | 'result'
    | 'offer'
    | 'custom';

export type AlignmentType = 'left' | 'center' | 'right' | 'justify';
export type SizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// ============================================================================
// ESTILOS E DESIGN
// ============================================================================

export interface ComponentStyle {
    // Layout
    width?: string;
    height?: string;
    padding?: string;
    margin?: string;
    marginTop?: string;
    marginBottom?: string;
    marginLeft?: string;
    marginRight?: string;

    // Tipografia
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    textAlign?: AlignmentType;

    // Cores
    color?: string;
    backgroundColor?: string;
    borderColor?: string;

    // Bordas e sombras
    borderRadius?: string;
    borderWidth?: string;
    boxShadow?: string;

    // Responsividade
    breakpoints?: {
        base?: Partial<ComponentStyle>;
        sm?: Partial<ComponentStyle>;
        md?: Partial<ComponentStyle>;
        lg?: Partial<ComponentStyle>;
        xl?: Partial<ComponentStyle>;
    };
}

// ============================================================================
// VALIDAÇÃO E REGRAS
// ============================================================================

export interface ComponentValidation {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customValidator?: (value: any) => boolean | string;
}

export interface ScoringRule {
    id: string;
    name: string;
    description?: string;
    points: number;
    weight?: number;
    condition?: {
        field: string;
        operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
        value: any;
    };
}

// ============================================================================
// COMPONENTES MODULARES
// ============================================================================

export interface BaseComponentProps {
    id: string;
    type: ComponentType;
    order: number;
    style?: ComponentStyle;
    validation?: ComponentValidation;
    isVisible?: boolean;
    isEditable?: boolean;
}

export interface HeaderBlockProps extends BaseComponentProps {
    type: 'header';
    showLogo: boolean;
    logoUrl?: string;
    logoAlt?: string;
    showProgress: boolean;
    progressColor?: string;
    allowReturn: boolean;
    returnText?: string;
    backgroundColor?: string;
    textColor?: string;
}

export interface TitleBlockProps extends BaseComponentProps {
    type: 'title';
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
    alignment: AlignmentType;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    marginTop?: string;
    marginBottom?: string;
}

export interface TextBlockProps extends BaseComponentProps {
    type: 'text';
    content: string;
    alignment: AlignmentType;
    fontSize?: string;
    lineHeight?: string;
    color?: string;
    allowMarkdown?: boolean;
}

export interface ImageBlockProps extends BaseComponentProps {
    type: 'image';
    src: string;
    alt: string;
    caption?: string;
    width?: string;
    height?: string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
    borderRadius?: string;
    lazy?: boolean;
}

export interface FormFieldBlockProps extends BaseComponentProps {
    type: 'form-field';
    fieldType: 'text' | 'email' | 'tel' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
    label: string;
    placeholder?: string;
    helpText?: string;
    required: boolean;
    options?: Array<{ value: string; label: string; }>;
    validation?: ComponentValidation;
}

export interface OptionsGridBlockProps extends BaseComponentProps {
    type: 'options-grid';
    question: string;
    description?: string;
    options: QuizOption[];
    columns: number;
    multiSelect: boolean;
    required: boolean;
    minSelections?: number;
    maxSelections?: number;
    randomize: boolean;
    showImages: boolean;
    scoringRules?: ScoringRule[];
}

export interface ButtonBlockProps extends BaseComponentProps {
    type: 'button';
    text: string;
    variant: 'solid' | 'outline' | 'ghost' | 'link';
    size: SizeType;
    colorScheme?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    loadingText?: string;
    leftIcon?: string;
    rightIcon?: string;
    onClick?: () => void;
}

export interface QuizOption {
    id: string;
    text: string;
    description?: string;
    image?: string;
    value: any;
    points?: number;
    category?: string;
    isCorrect?: boolean;
}

// Interface base para todos os componentes modulares
export interface ModularComponent {
    id: string;
    type: ComponentType;
    props: Record<string, any>;
    style?: ComponentStyle;
    validation?: ComponentValidation;
    order?: number;
}

// Union type para props específicos dos componentes
export type ComponentProps =
    | HeaderBlockProps
    | TitleBlockProps
    | TextBlockProps
    | ImageBlockProps
    | FormFieldBlockProps
    | OptionsGridBlockProps
    | ButtonBlockProps;

// ============================================================================
// ETAPAS E FUNIL
// ============================================================================

export interface StepSettings {
    // Navegação
    canGoBack?: boolean;
    canSkip?: boolean;
    allowSkip?: boolean;
    autoAdvance?: boolean;
    timeLimit?: number;
    showProgress?: boolean;

    // Validação
    requireCompletion?: boolean;
    customValidation?: (data: any) => boolean | string;

    // Pontuação
    scoringRules?: ScoringRule[];

    // SEO
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];

    // Analytics
    trackingEvents?: Array<{
        event: string;
        properties?: Record<string, any>;
    }>;
}

export interface ModularQuizStep {
    id: string;
    type: StepType;
    name: string;
    title?: string;
    description?: string;
    components: ModularComponent[];
    settings: StepSettings;
    nextStep?: string;
    conditionalNext?: Array<{
        condition: any;
        nextStep: string;
    }>;
    order: number;
}

export interface FunnelSettings {
    // Informações básicas
    title: string;
    description?: string;
    language: string;

    // SEO Global
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    ogImage?: string;

    // Design Global
    theme: {
        colors: {
            primary: string;
            secondary: string;
            accent: string;
            background: string;
            text: string;
        };
        fonts: {
            heading: string;
            body: string;
        };
        borderRadius: string;
        shadows: boolean;
    };

    // Comportamento
    allowBackNavigation: boolean;
    showProgressBar: boolean;
    saveProgress: boolean;
    timeLimit?: number;
    shuffleQuestions?: boolean;
    showResults?: boolean;
    collectEmail?: boolean;
    collectName?: boolean;

    // Integrações
    webhooks?: Array<{
        event: string;
        url: string;
        method: 'POST' | 'PUT' | 'PATCH';
        headers?: Record<string, string>;
    }>;

    analytics?: {
        googleAnalytics?: string;
        facebookPixel?: string;
        googleTagManager?: string;
        customScripts?: string[];
    };

    // Resultados
    resultCalculation: 'points' | 'categories' | 'custom';
    resultTemplates?: Array<{
        id: string;
        name: string;
        condition: any;
        components: ModularComponent[];
    }>;
}

export interface ModularQuizFunnel {
    id: string;
    name: string;
    title?: string;
    description?: string;
    status: 'draft' | 'published' | 'archived';
    steps: ModularQuizStep[];
    settings: FunnelSettings;

    // Metadados
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    version: number;

    // Configurações de colaboração
    permissions?: {
        canEdit: string[];
        canView: string[];
        canPublish: string[];
    };
}

// ============================================================================
// UI E ESTADO DO EDITOR
// ============================================================================

export interface PanelVisibility {
    steps: boolean;
    properties: boolean;
    components: boolean;
    settings: boolean;
    preview: boolean;
}

export interface EditorUIState {
    selectedStepId: string | null;
    selectedComponentId: string | null;
    previewMode: boolean;
    panelVisibility: PanelVisibility;
    dragMode: boolean;
    clipboardComponent: ModularComponent | null;
}

// ============================================================================
// CONTEXTO DO EDITOR
// ============================================================================

export interface QuizEditorContextType {
    // Estado do funil
    funnel: ModularQuizFunnel;
    currentStep: ModularQuizStep | null;
    selectedComponent: ModularComponent | null;

    // Ações do funil
    updateFunnel: (updates: Partial<ModularQuizFunnel>) => void;
    saveFunnel: () => Promise<void>;
    publishFunnel: () => Promise<void>;

    // Ações de etapas
    addStep: (type: StepType, afterStepId?: string) => ModularQuizStep;
    updateStep: (stepId: string, updates: Partial<ModularQuizStep>) => void;
    deleteStep: (stepId: string) => void;
    duplicateStep: (stepId: string) => ModularQuizStep;
    reorderSteps: (fromIndex: number, toIndex: number) => void;

    // Ações de componentes
    addComponent: (stepId: string, component: Partial<ModularComponent>, index?: number) => ModularComponent;
    updateComponent: (stepId: string, componentId: string, updates: Partial<ModularComponent>) => void;
    deleteComponent: (stepId: string, componentId: string) => void;
    duplicateComponent: (stepId: string, componentId: string) => ModularComponent;
    reorderComponents: (stepId: string, fromIndex: number, toIndex: number) => void;

    // Seleção
    selectStep: (stepId: string | null) => void;
    selectComponent: (componentId: string | null) => void;

    // Configurações
    settings: FunnelSettings;
    updateSettings: (updates: Partial<FunnelSettings>) => void;

    // Estados da UI
    uiState: EditorUIState;
    updateUIState: (updates: Partial<EditorUIState>) => void;

    // Utilitários
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;

    // Clipboard
    copyComponent: (componentId: string) => void;
    pasteComponent: (stepId: string, index?: number) => void;
    canPaste: boolean;

    // Configuração do editor
    _config?: {
        theme: string;
        layout: string;
        showPreview: boolean;
        autoSave: boolean;
        debug: boolean;
    };
}