/**
 * 🎯 BLOCK TYPES - Sistema JSON-Driven
 * 
 * Interfaces TypeScript para sistema de blocos modulares.
 * Cada step é decomposto em blocos independentes.
 * Componentes consomem 100% do JSON.
 */

/**
 * Dados de um bloco individual
 */
export interface BlockData {
    /** ID único do bloco */
    id: string;

    /** Tipo do bloco (title, form-input, button, etc) */
    type: string;

    /** Nome do componente React a renderizar */
    component: string;

    /** Ordem de renderização dentro do step */
    order: number;

    /** Propriedades específicas do bloco */
    props: Record<string, any>;

    /** Metadados opcionais */
    metadata?: {
        /** Label do bloco (ex: "Título Principal") */
        label?: string;
        /** Ícone do bloco (ex: "📝") */
        icon?: string;
        /** Categoria do bloco */
        category?: string;
        /** Descrição do bloco */
        description?: string;
    };
}

/**
 * Dados de um step completo
 */
export interface StepData {
    /** ID único do step */
    id: string;

    /** Tipo do step (intro, question, transition, result, offer) */
    type: 'intro' | 'question' | 'strategic-question' | 'transition' | 'transition-result' | 'result' | 'offer';

    /** Array de blocos que compõem o step */
    blocks: BlockData[];

    /** Próximo step na sequência */
    nextStep?: string;

    /** Metadados opcionais */
    metadata?: {
        /** Nome do step (ex: "Introdução") */
        name?: string;
        /** Descrição do step */
        description?: string;
        /** Número do step (ex: "1 de 21") */
        number?: string;
    };
}

/**
 * Props padrão para componentes de bloco
 */
export interface BlockComponentProps {
    /** Dados do bloco */
    data: BlockData;

    /** Se o bloco está selecionado */
    isSelected: boolean;

    /** Se o bloco é editável */
    isEditable: boolean;

    /** Callback ao selecionar o bloco */
    onSelect: () => void;

    /** Callback ao atualizar propriedades do bloco */
    onUpdate: (updates: Partial<BlockData['props']>) => void;

    /** Callback ao deletar o bloco */
    onDelete?: () => void;

    /** Callback ao duplicar o bloco */
    onDuplicate?: () => void;

    /** Callback ao mover bloco para cima */
    onMoveUp?: () => void;

    /** Callback ao mover bloco para baixo */
    onMoveDown?: () => void;
}

/**
 * Mapa de componentes de bloco
 */
export type BlockComponentMap = Record<string, React.ComponentType<BlockComponentProps>>;

/**
 * Resultado da decomposição de um step
 */
export interface DecomposedStep {
    /** Step original */
    step: StepData;

    /** Blocos gerados */
    blocks: BlockData[];

    /** Total de blocos */
    totalBlocks: number;
}
