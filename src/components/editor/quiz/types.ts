// Tipos centrais compartilhados do Editor de Quiz
// Manter este arquivo pequeno e estável para evitar ciclos

export type StepType = 'intro' | 'question' | 'strategic-question' | 'transition' | 'transition-result' | 'result' | 'offer';

export interface BlockComponent {
    id: string;
    type: string;
    order: number;
    parentId?: string | null;
    properties: Record<string, any>;
    content: Record<string, any>;
}

export interface EditableQuizStep {
    id: string;
    type: StepType;
    order: number;
    blocks: BlockComponent[];
    // Campos opcionais usados em vários pontos
    title?: string;
    nextStep?: string; // usar undefined quando ausente; evitar null para compatibilidade com utilidades
    offerMap?: Record<string, any>;
    settings?: Record<string, any>;
    metadata?: Record<string, any>;
}

export interface BlockSnippet {
    id: string;
    name: string;
    blocks: BlockComponent[];
}

// Item da biblioteca de componentes exibida na coluna de arraste
export interface ComponentLibraryItem {
    /** Identificador único mostrado/arrastado */
    type: string;
    /** Tipo real de bloco se diferente do tipo exposto */
    blockType?: string;
    label: string;
    icon: React.ReactNode;
    defaultProps: Record<string, any>;
    defaultContent?: Record<string, any>;
    category: 'layout' | 'content' | 'interactive' | 'media';
}
