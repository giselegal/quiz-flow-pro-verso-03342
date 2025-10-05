/**
 * 🎯 TIPOS DOS COMPONENTES REAIS DAS 21 ETAPAS
 * 
 * Tipos específicos baseados nos componentes reais encontrados no quiz21StepsComplete.ts
 */

// 📝 Tipos base do sistema
export interface RealComponentProps {
    id: string;
    type: string;
    order: number;
    content: Record<string, any>;
    properties: Record<string, any>;
    isEditing?: boolean;
    onUpdate?: (updates: Partial<RealComponentProps>) => void;
    onSelect?: () => void;
    isSelected?: boolean;
}

// 🎯 TODOS OS TIPOS DE COMPONENTES ENCONTRADOS NAS 21 ETAPAS
export type RealComponentType =
    | 'quiz-intro-header'
    | 'text'
    | 'text-inline'
    | 'image'
    | 'decorative-bar'
    | 'form-container'
    | 'form-input'
    | 'button-inline'
    | 'button'
    | 'legal-notice'
    | 'options-grid'
    | 'result-header-inline'
    | 'urgency-timer-inline'
    | 'mentor-section-inline'
    | 'style-card-inline'
    | 'testimonials'
    | 'benefits'
    | 'value-anchoring'
    | 'guarantee'
    | 'secure-purchase'
    | 'bonus'
    | 'before-after-inline'
    | 'secondary-styles'
    | 'quiz-offer-cta-inline'
    | 'fashion-ai-generator'
    | 'connected-template-wrapper'
    | 'conversion';

// 🎨 Configurações específicas do painel de propriedades
export interface PropertiesPanelConfig {
    enabled: boolean;
    inlineEditingDisabled?: boolean;
    categories: ('content' | 'style' | 'layout' | 'behavior' | 'data')[];
}

// 🏗️ Interface base para componentes editáveis específicos
export interface EditableRealComponent extends RealComponentProps {
    propertiesPanelConfig?: PropertiesPanelConfig;
}

// 📊 Tipos específicos de conteúdo para cada componente
export interface QuizIntroHeaderContent {
    title?: string;
    subtitle?: string;
    description?: string;
    showLogo?: boolean;
    showProgress?: boolean;
    showNavigation?: boolean;
}

export interface OptionsGridContent {
    question: string;
    options: Array<{
        id: string;
        text: string;
        imageUrl?: string;
        score?: Record<string, number>;
    }>;
    maxSelections?: number;
    minSelections?: number;
}

export interface FormContainerContent {
    fieldType: 'text' | 'email' | 'tel' | 'password';
    label?: string;
    placeholder?: string;
    required?: boolean;
    validation?: Record<string, any>;
}

export interface ResultHeaderContent {
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    styleGuideImageUrl?: string;
    showBothImages?: boolean;
}

// 🎯 Mapeamento de tipos para interfaces de conteúdo
export type ComponentContentMap = {
    'quiz-intro-header': QuizIntroHeaderContent;
    'options-grid': OptionsGridContent;
    'form-container': FormContainerContent;
    'result-header-inline': ResultHeaderContent;
    'text': { text: string };
    'image': { src: string; alt?: string };
    'button-inline': { text: string; action?: string };
    // ... outros tipos serão adicionados conforme necessário
};

// 🔧 Utilitário para inferir tipo de conteúdo
export type ContentForType<T extends RealComponentType> =
    T extends keyof ComponentContentMap
    ? ComponentContentMap[T]
    : Record<string, any>;