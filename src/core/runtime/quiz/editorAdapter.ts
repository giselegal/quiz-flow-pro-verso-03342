// Usar tipo leve para evitar acoplamento com editores específicos
import type { EditableQuizStepLite } from '@/types/editor-lite';
import type { RuntimeStepOverride } from './QuizRuntimeRegistry';
import { getBlockConfig, normalizeOption, extractOptions, extractQuestionText, extractQuestionNumber } from '@/lib/utils/blockConfigMerger';

/**
 * Converte a lista de steps editáveis do editor para o formato consumido pelo runtime (override).
 * 
 * ✅ FASE 2.2: Simplificado - navegação automática delegada ao QuizRuntimeRegistry
 */
export function editorStepsToRuntimeMap(steps: EditableQuizStepLite[]): Record<string, RuntimeStepOverride> {
    const map: Record<string, RuntimeStepOverride> = {};

    // ✅ REMOVIDO: NavigationService é gerenciado automaticamente pelo QuizRuntimeRegistry
    // Apenas convertemos dados, sem calcular navegação aqui

    for (const s of steps) {
        if (!s?.id) continue;

        // ✅ FASE 2: MERGE COMPLETO - Propagar TODAS as propriedades
        const blocksArray = Array.isArray((s as any).blocks) ? (s as any).blocks : [];
        const normalizedBlocks = blocksArray.length
            ? blocksArray.map((b: any) => ({
                id: b.id,
                type: b.type,
                order: b.order,
                // 🎯 MERGE COMPLETO: content + properties + config
                config: getBlockConfig(b),
                // 🎯 PRESERVAR ESTRUTURA ORIGINAL para fallback
                properties: b.properties || {},
                content: b.content || {},
                // 🎯 METADADOS adicionais
                parentId: b.parentId,
                metadata: b.metadata || {},
              }))
            : undefined;

        // ✅ FASE 1 (P0): Derivar questionText / options usando funções unificadas
        let derivedQuestionText: string | undefined = (s as any).questionText;
        let derivedQuestionNumber: string | number | undefined = (s as any).questionNumber;
        let derivedOptions: Array<{ id: string; text: string; image?: string }> | undefined = (s as any).options?.map(normalizeOption);

        if (!derivedOptions || derivedOptions.length === 0 || !derivedQuestionText) {
            const questionBlock = blocksArray.find((b: any) => b?.type === 'quiz-options' || b?.type === 'options-grid');
            if (questionBlock) {
                if (!derivedOptions || derivedOptions.length === 0) {
                    derivedOptions = extractOptions(questionBlock);
                }
                if (!derivedQuestionText) {
                    derivedQuestionText = extractQuestionText(questionBlock, (s as any).title);
                }
                if (!derivedQuestionNumber) {
                    derivedQuestionNumber = extractQuestionNumber(questionBlock);
                }
            }
        }

        // ✅ FASE 2.2: nextStep será preenchido automaticamente pelo QuizRuntimeRegistry
        // Apenas passamos o valor original (se houver), sem cálculos redundantes
        const nextStep = (s as any).nextStep;

        map[s.id] = {
            id: s.id,
            type: s.type,
            nextStep,
            requiredSelections: (s as any).requiredSelections,
            questionText: derivedQuestionText,
            questionNumber: derivedQuestionNumber as any,
            options: derivedOptions,
            formQuestion: (s as any).formQuestion,
            placeholder: (s as any).placeholder,
            buttonText: (s as any).buttonText,
            title: (s as any).title,
            text: (s as any).text,
            blocks: normalizedBlocks,
            offerMap: (s as any).offerMap,
        };
    }
    return map;
}
