/**
 * 🎯 TIPOS DE COMPONENTES MODULARES
 * 
 * Define os tipos de componentes que podem existir dentro de cada step
 */

export interface BaseComponent {
    id: string;
    type: string;
    order: number;
}

export interface HeaderComponent extends BaseComponent {
    type: 'header';
    title: string;
    subtitle?: string;
    alignment?: 'left' | 'center' | 'right';
    size?: 'small' | 'medium' | 'large';
}

export interface TextComponent extends BaseComponent {
    type: 'text';
    content: string;
    alignment?: 'left' | 'center' | 'right';
    size?: 'small' | 'medium' | 'large';
}

export interface ImageComponent extends BaseComponent {
    type: 'image';
    src: string;
    alt: string;
    width?: number;
    height?: number;
    alignment?: 'left' | 'center' | 'right';
}

export interface ButtonComponent extends BaseComponent {
    type: 'button';
    text: string;
    action: 'next' | 'submit' | 'custom';
    style?: 'primary' | 'secondary' | 'outline';
    customAction?: string;
}

export interface SpacerComponent extends BaseComponent {
    type: 'spacer';
    height: number;
}

export interface QuestionComponent extends BaseComponent {
    type: 'question';
    questionText: string;
    options: Array<{
        id: string;
        text: string;
        image?: string;
    }>;
    requiredSelections?: number;
    multipleChoice?: boolean;
}

export interface InputComponent extends BaseComponent {
    type: 'input';
    label: string;
    placeholder: string;
    inputType: 'text' | 'email' | 'tel' | 'number';
    required?: boolean;
}

// Generic component for quiz-specific types
export interface GenericComponent extends BaseComponent {
    type: string;
    [key: string]: any;
}

export type StepComponent =
    | HeaderComponent
    | TextComponent
    | ImageComponent
    | ButtonComponent
    | SpacerComponent
    | QuestionComponent
    | InputComponent
    | GenericComponent;

export interface ModularStep {
    id: string;
    name: string;
    type: 'intro' | 'question' | 'result' | 'transition' | 'custom';
    components: StepComponent[];
}

export interface ComponentTemplate {
    type: string;
    name: string;
    icon: string;
    defaultProps: Partial<StepComponent>;
}

export const COMPONENT_TEMPLATES: ComponentTemplate[] = [
    {
        type: 'header',
        name: 'Cabeçalho',
        icon: '📝',
        defaultProps: {
            type: 'header',
            title: 'Novo Cabeçalho',
            alignment: 'center',
            size: 'medium'
        }
    },
    {
        type: 'text',
        name: 'Texto',
        icon: '📄',
        defaultProps: {
            type: 'text',
            content: 'Novo parágrafo de texto...',
            alignment: 'left',
            size: 'medium'
        }
    },
    {
        type: 'image',
        name: 'Imagem',
        icon: '🖼️',
        defaultProps: {
            type: 'image',
            src: '/api/placeholder/400/300',
            alt: 'Nova imagem',
            alignment: 'center'
        }
    },
    {
        type: 'button',
        name: 'Botão',
        icon: '🔘',
        defaultProps: {
            type: 'button',
            text: 'Novo Botão',
            action: 'next',
            style: 'primary'
        }
    },
    {
        type: 'spacer',
        name: 'Espaçador',
        icon: '📏',
        defaultProps: {
            type: 'spacer',
            height: 32
        }
    },
    {
        type: 'question',
        name: 'Pergunta',
        icon: '❓',
        defaultProps: {
            type: 'question',
            questionText: 'Nova pergunta?',
            options: [
                { id: 'opt1', text: 'Opção 1' },
                { id: 'opt2', text: 'Opção 2' }
            ],
            requiredSelections: 1
        }
    },
    {
        type: 'input',
        name: 'Campo de Entrada',
        icon: '📝',
        defaultProps: {
            type: 'input',
            label: 'Novo Campo',
            placeholder: 'Digite aqui...',
            inputType: 'text',
            required: false
        }
    }
];