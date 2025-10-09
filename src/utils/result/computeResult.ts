/**
 * 🧮 Utilidade: computeResult
 * Cálculo simples (determinístico) do resultado do quiz baseado nas respostas.
 * Mantém compatibilidade com a lógica atual de `useQuizState` mas isolado e testável.
 *
 * Regras:
 * - Considera apenas steps do tipo 'question'.
 * - Cada seleção vale 1 ponto para o estilo (option id). (Sem pesos avançados aqui.)
 * - Empate: ordena alfabeticamente pelo id para ter resultado estável.
 * - Fallback: se não houver respostas, usa primeiro estilo do styleMapping.
 * - Normaliza ids de estilo via `resolveStyleId` para garantir acentos corretos quando possível.
 */

import { QUIZ_STEPS, type QuizStep } from '@/data/quizSteps';
import { styleMapping } from '@/data/styles';
import { toUnaccentedStyleId } from '@/utils/styleIds';

export interface ComputeResultInput {
    answers: Record<string, string[]>; // stepId -> optionIds selecionadas
    steps?: Record<string, QuizStep>;
}

export interface ComputeResultOutputBasic {
    primaryStyleId: string;               // id canônico do estilo predominante
    secondaryStyleIds: string[];          // até 2 estilos subsequentes (pode variar)
    scores: Record<string, number>;       // pontuação absoluta por estilo (id sem/ com acento conforme vindo)
    orderedStyleIds: string[];            // todos estilos ordenados por pontuação desc
    percentages: Record<string, number>;  // porcentagens normalizadas (0..100) — soma ~100
    totalAnswers: number;                 // total de seleções consideradas
}

export function computeResult({ answers, steps = QUIZ_STEPS }: ComputeResultInput): ComputeResultOutputBasic {
    // Inicializa scores com todos estilos em 0 para consistência de UI
    const scores: Record<string, number> = {};
    Object.keys(styleMapping).forEach(id => { scores[id] = 0; });

    let totalAnswers = 0;

    for (const [stepId, selections] of Object.entries(answers)) {
        const step = (steps as any)[stepId];
        if (!step || step.type !== 'question' || !Array.isArray(selections)) continue;
        for (const rawOptId of selections) {
            if (!rawOptId) continue;
            // Mantemos ids internos SEM acento para consistência, convertendo caso venha acentuado
            const internalId = scores[rawOptId] !== undefined ? rawOptId : toUnaccentedStyleId(rawOptId);
            if (scores[internalId] === undefined) continue; // ignora ids não reconhecidos
            scores[internalId] += 1;
            totalAnswers += 1;
        }
    }

    // Ordenar estilos pelo score (desc) e depois id (asc) para desempate estável
    const orderedStyleIds = Object.keys(scores)
        .sort((a, b) => {
            const diff = scores[b] - scores[a];
            if (diff !== 0) return diff;
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
