// Usar tipo leve para evitar acoplamento com editores específicos
import type { EditableQuizStepLite } from '@/types/editor-lite';
import type { RuntimeStepOverride } from './QuizRuntimeRegistry';

// Util simples para mapear uma opção genérica do editor para o formato do runtime
function normalizeOption(opt: any): { id: string; text: string; image?: string } {
    return {
        id: String(opt.id ?? opt.key ?? `${(opt.text || opt.label || 'opt').toString().toLowerCase().replace(/\s+/g, '-')}`),
        text: String(opt.text ?? opt.label ?? 'Opção'),
        image: opt.image ?? opt.imageUrl ?? opt.src ?? undefined
    };
}

// Mescla properties + content + config, com prioridade para config > properties > content
function mergeBlockConfig(block: any): Record<string, any> {
    const base: Record<string, any> = {};
    if (block && typeof block === 'object') {
        const content = (block.content && typeof block.content === 'object') ? block.content : {};
        const props = (block.properties && typeof block.properties === 'object') ? block.properties : {};
        const cfg = (block.config && typeof block.config === 'object') ? block.config : {};
        return { ...content, ...props, ...cfg };
    }
    return base;
}

/**
 * Converte a lista de steps editáveis do editor para o formato consumido pelo runtime (override).
 */
export function editorStepsToRuntimeMap(steps: EditableQuizStepLite[]): Record<string, RuntimeStepOverride> {
    const map: Record<string, RuntimeStepOverride> = {};

    // Preparar fallback de navegação baseado em order (se disponível)
    const ordered = Array.isArray(steps)
        ? steps.slice().sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
        : [];
    const nextById: Record<string, string | undefined> = {};
    for (let i = 0; i < ordered.length; i++) {
        const cur = ordered[i];
        const nxt = ordered[i + 1];
        if (cur?.id) nextById[cur.id] = nxt?.id;
    }

    for (const s of steps) {
        if (!s?.id) continue;

        // Normalizar blocks: aceitar formato legacy (config) e modular (properties/content → config)
        const blocksArray = Array.isArray((s as any).blocks) ? (s as any).blocks : [];
        const normalizedBlocks = blocksArray.length
            ? blocksArray.map((b: any) => ({ id: b.id, type: b.type, config: mergeBlockConfig(b) }))
            : undefined;

        // Derivar questionText / options a partir de blocos de pergunta, quando ausentes no step
        let derivedQuestionText: string | undefined = (s as any).questionText;
        let derivedQuestionNumber: string | number | undefined = (s as any).questionNumber;
        let derivedOptions: Array<{ id: string; text: string; image?: string }> | undefined = (s as any).options?.map(normalizeOption);

        if (!derivedOptions || derivedOptions.length === 0 || !derivedQuestionText) {
            const questionBlock = blocksArray.find((b: any) => b?.type === 'quiz-options' || b?.type === 'options-grid');
            if (questionBlock) {
                const cfg = mergeBlockConfig(questionBlock);
                const rawOptions = (cfg.options && Array.isArray(cfg.options)) ? cfg.options : [];
                if (!derivedOptions || derivedOptions.length === 0) {
                    derivedOptions = rawOptions.map(normalizeOption);
                }
                if (!derivedQuestionText) {
                    derivedQuestionText = cfg.question || cfg.questionText || (s as any).title || undefined;
                }
                if (!derivedQuestionNumber) {
                    derivedQuestionNumber = cfg.questionNumber ?? undefined;
                }
            }
        }

        // Fallback de nextStep com base no order quando ausente
        const nextStep = (s as any).nextStep ?? nextById[s.id];

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
