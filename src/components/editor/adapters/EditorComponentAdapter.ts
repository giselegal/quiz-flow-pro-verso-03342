/**
 * 🔧 EDITOR COMPONENT ADAPTER
 * 
 * Interface abstrata para criar adaptadores que conectam componentes de produção
 * com o sistema editável do editor. Parte da FASE 1 do plano de modularização.
 */

import { QuizStep } from '@/data/quizSteps';

/**
 * 🎯 INTERFACE PRINCIPAL DO ADAPTER
 * 
 * Define como um componente de produção é adaptado para ser editável
 */
export interface EditorComponentAdapter<TProps = any> {
    /** Tipo único do componente (ex: 'intro', 'question', 'result') */
    componentType: string;

    /** Componente de produção original (React component) */
    productionComponent: React.ComponentType<TProps>;

    /** Lista das propriedades que podem ser editadas no editor */
    editableProps: Array<keyof TProps>;

    /** Propriedades padrão para novos componentes */
    defaultProps: Partial<TProps>;

    /** Converte props do componente para formato EditableBlock */
    toEditableBlock: (props: TProps) => EditableBlock;

    /** Converte EditableBlock de volta para props do componente */
    fromEditableBlock: (block: EditableBlock) => TProps;

    /** Cria mocks para callbacks (evita side effects no editor) */
    createMocks?: (originalProps: TProps) => Partial<TProps>;

    /** Valida se as props estão corretas */
    validateProps?: (props: TProps) => ValidationResult;
}

/**
 * 📦 EDITABLEBLOCK - FORMATO UNIVERSAL DO EDITOR
 * 
 * Todos os componentes no editor são representados como EditableBlocks
 */
export interface EditableBlock {
    id: string;
    type: string;
    data: Record<string, any>;
    style?: {
        margin?: string;
        padding?: string;
        backgroundColor?: string;
        [key: string]: any;
    };
    meta?: {
        created: Date;
        updated: Date;
        version: string;
    };
}

/**
 * ✅ VALIDATION RESULT
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

/**
 * 🏭 FACTORY PARA CRIAR ADAPTERS
 * 
 * Utilitário para criar adapters com configuração padrão
 */
export function createAdapter<TProps>(
    config: Omit<EditorComponentAdapter<TProps>, 'createMocks' | 'validateProps'> & {
        createMocks?: (originalProps: TProps) => Partial<TProps>;
        validateProps?: (props: TProps) => ValidationResult;
    }
): EditorComponentAdapter<TProps> {
    return {
        createMocks: (props) => ({}),
        validateProps: (props) => ({ isValid: true, errors: [], warnings: [] }),
        ...config
    };
}

/**
 * 🎨 PROPS EDITÁVEIS COMUNS
 * 
 * Tipos de propriedades que podem ser editadas
 */
export type EditablePropType =
    | 'text'           // Input de texto simples
    | 'html'           // Editor HTML/Rich text
    | 'number'         // Input numérico
    | 'image'          // Seletor de imagem (URL)
    | 'color'          // Seletor de cor
    | 'select'         // Dropdown de opções
    | 'boolean'        // Checkbox
    | 'array'          // Lista editável
    | 'object';        // Objeto complexo

export interface EditablePropConfig {
    key: string;
    type: EditablePropType;
    label: string;
    description?: string;
    required?: boolean;
    defaultValue?: any;
    options?: { value: any; label: string }[]; // Para tipo 'select'
    validation?: {
        min?: number;
        max?: number;
        pattern?: RegExp;
        custom?: (value: any) => ValidationResult;
    };
}

/**
 * 🔧 ADAPTER COM CONFIGURAÇÃO ESTENDIDA
 * 
 * Para casos mais complexos que precisam de configuração adicional
 */
export interface ExtendedEditorComponentAdapter<TProps = any> extends EditorComponentAdapter<TProps> {
    /** Configuração detalhada das props editáveis */
    propConfigs: EditablePropConfig[];

    /** Ícone do componente no painel */
    icon: string;

    /** Categoria do componente */
    category: 'intro' | 'question' | 'result' | 'transition' | 'offer' | 'strategic';

    /** Preview thumbnail do componente */
    thumbnail?: string;

    /** Se o componente pode ter filhos */
    canHaveChildren?: boolean;

    /** Componentes filhos permitidos */
    allowedChildren?: string[];
}

/**
 * 🚀 EXEMPLO DE USO
 * 
 * Como criar um adapter para IntroStep:
 * 
 * ```typescript
 * import IntroStep from '@/components/quiz/IntroStep';
 * 
 * export const IntroStepAdapter = createAdapter({
 *   componentType: 'intro',
 *   productionComponent: IntroStep,
 *   editableProps: ['title', 'formQuestion', 'placeholder', 'buttonText', 'image'],
 *   defaultProps: {
 *     title: 'Título padrão',
 *     formQuestion: 'Como posso te chamar?',
 *     placeholder: 'Digite seu nome...',
 *     buttonText: 'Continuar',
 *     image: ''
 *   },
 *   toEditableBlock: (props) => ({
 *     id: generateId(),
 *     type: 'intro',
 *     data: props
 *   }),
 *   fromEditableBlock: (block) => block.data,
 *   createMocks: (props) => ({
 *     onNameSubmit: (name: string) => console.log('[Editor Mock] Nome:', name)
 *   })
 * });
 * ```
 */