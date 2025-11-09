/**
 * 🧮 Utilidade: computeResult
 * Cálculo simples (determinístico) do resultado do quiz baseado nas respostas.
 * Mantém compatibilidade com a lógica atual de `useQuizState` mas isolado e testável.
 *
 * ✅ MIGRADO: usa TemplateService como fonte canônica
 * 
 * USO RECOMENDADO:
 * ```ts
 * // Passar steps do template ao invés de usar fallback
 * const result = computeResult({ 
 *   answers, 
 *   steps: convertedStepsFromTemplate 
 * });
 * ```
 *
 * Regras:
 * - Considera apenas steps do tipo 'question'.
 * - Cada seleção vale 1 ponto para o estilo (option id). (Sem pesos avançados aqui.)
 * - Empate: ordena alfabeticamente pelo id para ter resultado estável.
 * - Fallback: se não houver respostas, usa primeiro estilo do styleMapping.
 * - Normaliza ids de estilo via `resolveStyleId` para garantir acentos corretos quando possível.
 */

import { templateService } from '@/services/canonical/TemplateService';
import type { QuizStepV3 as QuizStep } from '@/types/quiz';
import { styleMapping } from '@/data/styles';
import { toUnaccentedStyleId } from '@/lib/utils/styleIds';
import type { QuizFunnelSchema } from '@/types/quiz-schema';

export interface ComputeResultInput {
    answers: Record<string, string[]>; // stepId -> optionIds selecionadas
    steps?: Record<string, QuizStep>;
    scoring?: QuizFunnelSchema['runtime'] extends { scoring?: infer S } ? S : any; // opcional: configurações de scoring do runtime
}

export interface ComputeResultOutputBasic {
    primaryStyleId: string;               // id canônico do estilo predominante
    secondaryStyleIds: string[];          // até 2 estilos subsequentes (pode variar)
    scores: Record<string, number>;       // pontuação absoluta por estilo (id sem/ com acento conforme vindo)
    orderedStyleIds: string[];            // todos estilos ordenados por pontuação desc
    percentages: Record<string, number>;  // porcentagens normalizadas (0..100) — soma ~100
    totalAnswers: number;                 // total de seleções consideradas
}

export function computeResult({ answers, steps, scoring }: ComputeResultInput): ComputeResultOutputBasic {
    // Fonte de steps: preferir TemplateService (canônico) quando não informado explicitamente
    const stepsSource = steps || templateService.getAllStepsSync() || {};
    // Inicializa scores com todos estilos em 0 para consistência de UI
    const scores: Record<string, number> = {};
    Object.keys(styleMapping).forEach(id => { scores[id] = 0; });

    let totalAnswers = 0;

    // Pesos opcionais por estilo (baseline atual)
    const weights: Record<string, number> | undefined = (scoring as any)?.weights;
    // Pesos por opção (override mais específico): scoring.optionWeights[stepId][optionId] = weight
    let optionWeights: Record<string, Record<string, number>> | undefined = (scoring as any)?.optionWeights;

    // Derivar pesos por opção automaticamente a partir do metadata.scoring.weight por etapa,
    // quando não fornecido explicitamente. Isso alinha o motor ao quiz21-complete.json.
    if (!optionWeights) {
        const derived: Record<string, Record<string, number>> = {};
        try {
            for (const [stepId, step] of Object.entries(stepsSource as Record<string, any>)) {
                if (!step || step.type !== 'question') continue;
                const stepWeight = Number(step?.metadata?.scoring?.weight);
                // aplica somente se for número válido (> 0), senão assume 1 implicito
                const effectiveWeight = Number.isFinite(stepWeight) ? stepWeight : undefined;
                const options = (step as any).options as Array<{ id: string } | string> | undefined;
                if (!options || options.length === 0) continue;
                for (const opt of options) {
                    const optId = typeof opt === 'string' ? opt : opt.id;
                    if (!optId) continue;
                    if (!derived[stepId]) derived[stepId] = {};
                    // se weight não definido, não seta — o fallback de 1 permanece
                    if (typeof effectiveWeight === 'number') {
                        derived[stepId][optId] = effectiveWeight;
                    }
                }
            }
            // Só aplica se tivermos de fato pelo menos um peso derivado
            const hasAny = Object.values(derived).some(x => Object.keys(x).length > 0);
            optionWeights = hasAny ? derived : undefined;
        } catch {
            // Em caso de qualquer estrutura inesperada, ignora silenciosamente e usa baseline
            optionWeights = undefined;
        }
    }

    for (const [stepId, selections] of Object.entries(answers)) {
        const step = (stepsSource as any)[stepId];
        if (!step || step.type !== 'question' || !Array.isArray(selections)) continue;
        for (const rawOptId of selections) {
            if (!rawOptId) continue;
            // Mantemos ids internos SEM acento para consistência, convertendo caso venha acentuado
            const internalId = scores[rawOptId] !== undefined ? rawOptId : toUnaccentedStyleId(rawOptId);
            if (scores[internalId] === undefined) continue; // ignora ids não reconhecidos
            // 1) Peso específico por opção, se configurado
            const wByOption = optionWeights?.[stepId]?.[rawOptId];
            // 2) Peso por estilo (legacy/atual) se não houver peso específico
            const wByStyle = (weights && typeof weights[internalId] === 'number') ? weights[internalId] : undefined;
            // 3) Fallback: 1 ponto
            const w = typeof wByOption === 'number' ? wByOption : (typeof wByStyle === 'number' ? wByStyle : 1);
            scores[internalId] += w;
            totalAnswers += 1;
        }
    }

    // Ordenar estilos pelo score (desc) e depois id (asc) para desempate estável
    const tieBreak: string | undefined = (scoring as any)?.tieBreak;
    const orderedStyleIds = Object.keys(scores)
        .sort((a, b) => {
            const diff = scores[b] - scores[a];
            if (diff !== 0) return diff;
            // desempate configurável (default: alfabético)
            if (tieBreak === 'first') {
                // Mantém a ordem de inserção original (sort estável)
                return 0;
            }
            if (tieBreak === 'random') {
                return Math.random() - 0.5;
            }
            if (tieBreak === 'natural-first') {
                // exemplo: priorizar 'natural' se empatar
                if (a === 'natural') return -1;
                if (b === 'natural') return 1;
            }
            return a.localeCompare(b, 'pt-BR');
        });

    // Fallback se nenhum ponto atribuído
    let primaryStyleId = orderedStyleIds[0];
    if (totalAnswers === 0) {
        // Busca primeiro estilo "real" que tenha config base (não alias duplicado). Aqui mantemos o primeiro da ordenação.
        primaryStyleId = orderedStyleIds[0];
    }

    // Seleciona até 2 secundários (excluindo o primário)
    const secondaryStyleIds = orderedStyleIds.filter(id => id !== primaryStyleId).slice(0, 2);

    // Percentuais
    const totalPoints = Object.values(scores).reduce((a, b) => a + b, 0);
    const percentages: Record<string, number> = {};
    if (totalPoints > 0) {
        Object.entries(scores).forEach(([id, val]) => {
            percentages[id] = (val / totalPoints) * 100;
        });
    } else {
        // Tudo zero — manter zeros explícitos (ajuda no gráfico)
        Object.keys(scores).forEach(id => { percentages[id] = 0; });
    }

    return {
        primaryStyleId,
        secondaryStyleIds,
        scores,
        orderedStyleIds,
        percentages,
        totalAnswers,
    };
}

export default computeResult;
