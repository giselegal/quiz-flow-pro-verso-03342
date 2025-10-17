import { useMemo } from 'react';
import { styleConfigGisele } from '@/data/styles';
import { resolveStyleId } from '@/utils/styleIds';
import type { QuizScores } from '@/hooks/useQuizState';

/**
 * 🧮 HOOK DE CÁLCULOS DE RESULTADO
 * 
 * Extrai a lógica de cálculo de resultados do ResultStep para um hook reutilizável.
 * Mantém EXATAMENTE o mesmo algoritmo, apenas modularizado.
 */

export interface StyleWithPercentage {
    key: string;
    displayKey: string;
    name: string;
    score: number;
    percentage: number;
    originalIndex: number;
}

export interface ResultCalculations {
    // Estilos com porcentagens (TOP 3)
    topStyles: StyleWithPercentage[];
    
    // Estilo dominante
    primaryStyle: StyleWithPercentage | null;
    
    // Estilos secundários
    secondaryStyles: StyleWithPercentage[];
    
    // Total de pontos
    totalPoints: number;
    
    // Confiança do resultado (0-100)
    confidence: number;
    
    // Todos os estilos processados (não filtrados)
    allStyles: StyleWithPercentage[];
}

export const useResultCalculations = (
    scores: QuizScores | undefined,
    userProfile?: {
        resultStyle?: string;
        secondaryStyles?: string[];
    }
): ResultCalculations => {
    return useMemo(() => {
        // Resultado vazio se não há scores
        if (!scores) {
            return {
                topStyles: [],
                primaryStyle: null,
                secondaryStyles: [],
                totalPoints: 0,
                confidence: 0,
                allStyles: []
            };
        }
        
        // ✅ LÓGICA ORIGINAL PRESERVADA (do ResultStep.tsx linha 77-122)
        
        // 1. Converter QuizScores para array de entradas
        // A ORDEM AQUI DEFINE O DESEMPATE: primeiro aparece = primeira escolha do usuário
        const scoresEntries = [
            ['natural', scores.natural || 0],
            ['classico', scores.classico || 0],
            ['contemporaneo', scores.contemporaneo || 0],
            ['elegante', scores.elegante || 0],
            ['romantico', scores.romantico || 0],
            ['sexy', scores.sexy || 0],
            ['dramatico', scores.dramatico || 0],
            ['criativo', scores.criativo || 0]
        ] as [string, number][];
        
        // 2. Calcular total de pontos
        const totalPoints = scoresEntries.reduce((sum, [, score]) => sum + score, 0);
        
        if (totalPoints === 0) {
            return {
                topStyles: [],
                primaryStyle: null,
                secondaryStyles: [],
                totalPoints: 0,
                confidence: 0,
                allStyles: []
            };
        }
        
        // 3. Processar estilos com porcentagens
        const stylesWithPercentages = scoresEntries
            .map(([styleKey, score], originalIndex) => {
                const displayKey = resolveStyleId(styleKey); // chave canônica (acentuada se existir)
                return {
                    key: styleKey,
                    displayKey: displayKey,
                    name: styleConfigGisele[displayKey]?.name || displayKey,
                    score,
                    percentage: ((score / totalPoints) * 100),
                    originalIndex // Preserva ordem original para desempate
                };
            })
            .filter(style => style.score > 0)
            .sort((a, b) => {
                // Ordenar por pontuação (decrescente)
                if (b.score !== a.score) {
                    return b.score - a.score;
                }
                // Em caso de EMPATE: menor índice (escolhido primeiro) vem antes
                return a.originalIndex - b.originalIndex;
            });
        
        // 4. Extrair TOP 3 estilos
        const topStyles = stylesWithPercentages.slice(0, 3);
        
        // 5. Identificar primário e secundários
        const primaryStyle = topStyles[0] || null;
        const secondaryStyles = topStyles.slice(1);
        
        // 6. Calcular confiança (baseado na diferença entre 1º e 2º)
        let confidence = 100;
        if (topStyles.length >= 2) {
            const percentageDiff = topStyles[0].percentage - topStyles[1].percentage;
            // Confiança varia de 50% (empate técnico) a 100% (diferença grande)
            confidence = Math.min(100, Math.max(50, 50 + percentageDiff));
        }
        
        return {
            topStyles,
            primaryStyle,
            secondaryStyles,
            totalPoints,
            confidence: Math.round(confidence),
            allStyles: stylesWithPercentages
        };
        
    }, [scores, userProfile?.resultStyle, userProfile?.secondaryStyles]);
};
