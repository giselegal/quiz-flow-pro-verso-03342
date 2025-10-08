import { useMemo } from 'react';

interface UseLiveScoringOptions {
    selections: Record<string, string[]>; // blockId -> optionIds
    scoringMap?: Record<string, Record<string, number>>; // blockId -> optionId -> score
}

// Retorna aggregate de scores por estilo
export function useLiveScoring({ selections, scoringMap = {} }: UseLiveScoringOptions) {
    const scores = useMemo(() => {
        const result: Record<string, number> = {};
        Object.entries(selections).forEach(([blockId, opts]) => {
            const map = scoringMap[blockId] || {};
            opts.forEach(optId => {
                const styleScores = map[optId];
                if (styleScores && typeof styleScores === 'object') {
                    Object.entries(styleScores as any).forEach(([style, val]) => {
                        result[style] = (result[style] || 0) + Number(val || 0);
                    });
                }
            });
        });
        return result;
    }, [selections, scoringMap]);

    const top = useMemo(() => {
        const entries = Object.entries(scores);
        if (entries.length === 0) return null;
        return entries.sort((a, b) => b[1] - a[1])[0];
    }, [scores]);

    return { scores, topStyle: top?.[0] || null };
}

export type LiveScoringResult = ReturnType<typeof useLiveScoring>;