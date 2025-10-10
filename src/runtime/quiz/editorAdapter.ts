// Usar tipo leve para evitar acoplamento com editores específicos
import type { EditableQuizStepLite } from '@/types/editor-lite';
import type { RuntimeStepOverride } from './QuizRuntimeRegistry';

/**
 * Converte a lista de steps editáveis do editor para o formato consumido pelo runtime (override).
 */
export function editorStepsToRuntimeMap(steps: EditableQuizStepLite[]): Record<string, RuntimeStepOverride> {
    const map: Record<string, RuntimeStepOverride> = {};
    for (const s of steps) {
        if (!s.id) continue;
        // Normalizar blocks: aceitar formato legacy (config) e modular (properties/content → config)
        const normalizedBlocks = Array.isArray((s as any).blocks)
            ? (s as any).blocks.map((b: any) => ({ id: b.id, type: b.type, config: b.config || b.properties || {} }))
            : undefined;
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
            blocks: normalizedBlocks,
            // ✅ Novo: incluir offerMap para step de oferta (step-21)
            offerMap: (s as any).offerMap,
        };
    }
    return map;
}
