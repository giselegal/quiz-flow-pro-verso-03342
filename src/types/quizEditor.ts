import { QuizQuestion } from './quiz';

// =============================
// Categorias legacy (mantidas)
// =============================
export const QUIZ_CATEGORIES = [
  { id: 'clothingQuestions', name: 'Roupas', icon: '👚', description: 'Perguntas sobre preferências de roupas', isStrategic: false },
  { id: 'personalityQuestions', name: 'Personalidade', icon: '😊', description: 'Perguntas sobre traços de personalidade', isStrategic: false },
  { id: 'accessoriesQuestions', name: 'Acessórios', icon: '💍', description: 'Perguntas sobre preferências de acessórios', isStrategic: false },
  { id: 'strategicQuestions', name: 'Perguntas Estratégicas', icon: '🎯', description: 'Perguntas para coleta de informações direcionadas', isStrategic: true },
];
export type QuizCategory = (typeof QUIZ_CATEGORIES)[number]['id'];

export interface QuizEditorState {
  questions: QuizQuestion[];
  editingQuestionId: string | null;
  selectedCategory: string | null;
}

// =============================================================
// Tipos normalizados para o novo pipeline de edição de Quiz
// =============================================================
export interface QuizAnswerStylePoints { [styleId: string]: number; }
export interface QuizAnswerEditable {
  id: string;
  text: string;
  description?: string;
  image?: string;
  stylePoints: QuizAnswerStylePoints;
}

export interface QuizQuestionEditable {
  id: string;          // Mantém step-id ou ID gerado
  stepNumber: number;  // Sequência exibida ao usuário
  title: string;
  subtitle?: string;
  type: 'multiple-choice' | 'single-choice' | 'open' | 'info';
  answers: QuizAnswerEditable[];
  requiredSelections?: number;
  metadata?: Record<string, any>;
}

export interface QuizStyleEditable {
  id: string;
  name: string;
  description?: string;
  characteristics?: string[];
  color?: string;
  icon?: any; // Componente React (mantemos flexível)
  metadata?: Record<string, any>;
}

export interface QuizTemplateData {
  templateId: string;
  version: string;
  questions: QuizQuestionEditable[];
  styles: QuizStyleEditable[];
  // Matriz de pontuação agregada: questionId -> answerId -> styleId -> weight
  scoringMatrix?: Record<string, Record<string, Record<string, number>>>;
  updatedAt: string;
}

export interface QuizPersistenceResult {
  success: boolean;
  error?: string;
  version?: string;
}

export interface QuizEditorPersistence {
  load(templateId: string): Promise<QuizTemplateData | null>;
  save(data: QuizTemplateData): Promise<QuizPersistenceResult>;
}

export const QUIZ_EDITOR_VERSION = '1.0.0';
