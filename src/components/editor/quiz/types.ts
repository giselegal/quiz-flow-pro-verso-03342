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
  nextStep?: string | null;
  offerMap?: Record<string, any>;
  settings?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface BlockSnippet {
  id: string;
  name: string;
  blocks: BlockComponent[];
}
