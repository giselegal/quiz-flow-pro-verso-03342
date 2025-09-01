// Tipos canônicos para templates de Quiz (21 etapas)
// Suporta perguntas pontuadas (scored) e estratégicas (strategic)

export type SchemaVersion = `v${number}`;

export type SelectionMode = 'single' | 'multiple';

export interface QuizOption {
    id: string;
    text: string;
    imageUrl?: string;
    // Mapa de estilo -> pontos. Opcional para perguntas estratégicas
    score?: Record<string, number>;
    // Segmento estratégico opcional (ex.: "curvy", "pear", etc.)
    segment?: string;
}

export interface QuizQuestion {
    id: string; // ex.: q1..q21
    step: number; // 1..21
    title: string;
    text?: string;
    kind: 'scored' | 'strategic';
    options: QuizOption[];
    selectionMode?: SelectionMode; // default: single
    requiredSelections?: number; // p/ múltipla seleção
    maxSelections?: number;
    // Peso por questão (aplicado aos scores das opções)
    weight?: number;
}

export interface QuizSchema {
    id: string; // funnel id
    name: string;
    schemaVersion: SchemaVersion;
    styles?: string[]; // lista de estilos válidos no domínio
    questions: QuizQuestion[];
}

export interface CanonicalResultBreakdownItem {
    style: string;
    points: number;
}

export interface CanonicalResultPayload {
    primaryStyle: string;
    percentage: number;
    breakdown: CanonicalResultBreakdownItem[];
    userName?: string;
}

// Regras de negócios padrão (podem ser parametrizadas no schema):
// - Q1..Q10: 1 ponto por questão (opções somam 1 para o estilo escolhido)
// - Q12..Q17: estratégicas (sem pontuação); usar "kind: 'strategic'"
// - Outras questões podem definir score explícito ou weight por questão
