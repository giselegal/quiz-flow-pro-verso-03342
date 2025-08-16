import { QuizQuestion } from './quiz';

export const QUIZ_CATEGORIES = [
  {
    id: 'clothingQuestions',
    name: 'Roupas',
    icon: '👚',
    description: 'Perguntas sobre preferências de roupas',
    isStrategic: false,
  },
  {
    id: 'personalityQuestions',
    name: 'Personalidade',
    icon: '😊',
    description: 'Perguntas sobre traços de personalidade',
    isStrategic: false,
  },
  {
    id: 'accessoriesQuestions',
    name: 'Acessórios',
    icon: '💍',
    description: 'Perguntas sobre preferências de acessórios',
    isStrategic: false,
  },
  {
    id: 'strategicQuestions',
    name: 'Perguntas Estratégicas',
    icon: '🎯',
    description: 'Perguntas para coleta de informações direcionadas',
    isStrategic: true,
  },
];

export type QuizCategory = (typeof QUIZ_CATEGORIES)[number]['id'];

export interface QuizEditorState {
  questions: QuizQuestion[];
  editingQuestionId: string | null;
  selectedCategory: string | null;
}
