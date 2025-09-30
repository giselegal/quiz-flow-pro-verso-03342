import { QUIZ_STEPS } from '@/data/quizSteps';
import { styleConfigGisele } from '@/data/styles';
import { QuizQuestionEditable, QuizStyleEditable } from '@/types/quizEditor';

interface BuildResult {
    questions: QuizQuestionEditable[];
    styles: QuizStyleEditable[];
}

/**
 * Converte a estrutura legacy (QUIZ_STEPS + styleConfigGisele) em formato normalizado.
 * Mantém IDs originais dos steps para rastreabilidade.
 */
export function buildQuizEditableModel(): BuildResult {
    const entries = Object.entries(QUIZ_STEPS).filter(([_, step]) => step.type === 'question');

    const questions: QuizQuestionEditable[] = entries.map(([id, step], index) => ({
        id,
        stepNumber: index + 1,
        title: step.questionText || step.title || `Questão ${index + 1}`,
        subtitle: step.title,
        type: 'multiple-choice',
        requiredSelections: step.requiredSelections,
        answers: (step.options || []).map(opt => ({
            id: `${id}-${opt.id}`,
            text: opt.text,
            stylePoints: {},
        })),
        metadata: { legacyType: step.type },
    }));

    const styles: QuizStyleEditable[] = Object.values(styleConfigGisele).map(style => ({
        id: style.id,
        name: style.name,
        description: style.description,
        characteristics: style.characteristics,
        color: style.colors?.[0],
        metadata: { source: 'styleConfigGisele' },
    }));

    return { questions, styles };
}
