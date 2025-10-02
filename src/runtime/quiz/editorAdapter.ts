import type { EditableQuizStep } from '@/components/editor/quiz/QuizFunnelEditor';
import type { RuntimeStepOverride } from './QuizRuntimeRegistry';

/**
 * Converte a lista de steps editáveis do editor para o formato consumido pelo runtime (override).
 */
export function editorStepsToRuntimeMap(steps: EditableQuizStep[]): Record<string, RuntimeStepOverride> {
    const map: Record<string, RuntimeStepOverride> = {};
    for (const s of steps) {
        if (!s.id) continue;
        map[s.id] = {
            id: s.id,
            type: s.type,
            nextStep: s.nextStep,
            requiredSelections: (s as any).requiredSelections,
            questionText: (s as any).questionText,
            questionNumber: (s as any).questionNumber,
            options: (s as any).options?.map((o: any) => ({ id: o.id, text: o.text, image: o.image })),
            formQuestion: (s as any).formQuestion,
            placeholder: (s as any).placeholder,
            buttonText: (s as any).buttonText,
            title: (s as any).title,
            text: (s as any).text,
        };
    }
    return map;
}
