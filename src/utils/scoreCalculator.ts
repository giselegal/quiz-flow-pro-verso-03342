/**
 * 🎯 SISTEMA DE PONTUAÇÃO E SCORE
 * Calcula pontuação dinâmica baseada em respostas, tempo e comportamento
 */

export interface Answer {
    questionId: string;
    selectedOptions: string[];
    timeSpent: number;        // segundos
    isCorrect?: boolean;      // para quizzes com resposta certa
    confidence?: number;      // 0-100 (se usuário indicar)
}

export interface ScoringRules {
    weights: Record<string, number>;        // Peso por questão (1-10)
    correctAnswerPoints: number;            // Pontos por resposta correta
    speedBonusThreshold: number;            // Segundos para ganhar bonus
    speedBonusPoints: number;               // Pontos do speed bonus
    streakMultiplier: number;               // Multiplicador por sequência
    completionBonus: number;                // Bonus por completar 100%
    penaltyForSkip: number;                 // Penalidade por pular
}

const DEFAULT_SCORING: ScoringRules = {
    weights: {},
    correctAnswerPoints: 10,
    speedBonusThreshold: 15,
    speedBonusPoints: 5,
    streakMultiplier: 1.5,
    completionBonus: 50,
    penaltyForSkip: -5
};

export interface ScoreResult {
    totalScore: number;
    maxPossibleScore: number;
    percentage: number;
    breakdown: {
        questionId: string;
        basePoints: number;
        bonusPoints: number;
        penalties: number;
        totalPoints: number;
        notes: string[];
    }[];
    badges: string[];
    level: {
        current: number;
        name: string;
        nextLevelAt: number;
    };
}

export function calculateScore(
    answers: Answer[],
    rules: Partial<ScoringRules> = {}
): ScoreResult {
    const finalRules = { ...DEFAULT_SCORING, ...rules };
    const breakdown: ScoreResult['breakdown'] = [];
    let totalScore = 0;
    let consecutiveCorrect = 0;
    let maxPossibleScore = 0;
    const earnedBadges: string[] = [];
    
    answers.forEach((answer, index) => {
        const notes: string[] = [];
        const weight = finalRules.weights[answer.questionId] || 1;
        
        // Pontos base
        let basePoints = 0;
        if (answer.selectedOptions.length > 0) {
            if (answer.isCorrect !== false) {
                basePoints = finalRules.correctAnswerPoints * weight;
                notes.push(`Resposta: +${basePoints} pts`);
                consecutiveCorrect++;
            } else {
                notes.push('Resposta incorreta');
                consecutiveCorrect = 0;
            }
        } else {
            notes.push('Questão pulada');
            consecutiveCorrect = 0;
        }
        
        // Bonus de velocidade
        let bonusPoints = 0;
        if (answer.timeSpent > 0 && answer.timeSpent < finalRules.speedBonusThreshold) {
            bonusPoints += finalRules.speedBonusPoints * weight;
            notes.push(`Speed bonus: +${finalRules.speedBonusPoints * weight} pts`);
        }
        
        // Bonus de sequência (streak)
        if (consecutiveCorrect >= 3) {
            const streakBonus = Math.floor(basePoints * (finalRules.streakMultiplier - 1));
            bonusPoints += streakBonus;
            notes.push(`Streak x${consecutiveCorrect}: +${streakBonus} pts`);
            
            if (consecutiveCorrect === 5) {
                earnedBadges.push('🔥 Hot Streak');
            }
            if (consecutiveCorrect >= 10) {
                earnedBadges.push('💎 Perfect Streak');
            }
        }
        
        // Penalidades
        let penalties = 0;
        if (answer.selectedOptions.length === 0) {
            penalties = finalRules.penaltyForSkip;
            notes.push(`Penalidade por pular: ${penalties} pts`);
        }
        
        const questionTotal = Math.max(0, basePoints + bonusPoints + penalties);
        
        breakdown.push({
            questionId: answer.questionId,
            basePoints,
            bonusPoints,
            penalties,
            totalPoints: questionTotal,
            notes
        });
        
        totalScore += questionTotal;
        maxPossibleScore += finalRules.correctAnswerPoints * weight;
    });
    
    // Bonus de conclusão
    const answeredAll = answers.every(a => a.selectedOptions.length > 0);
    if (answeredAll && answers.length > 0) {
        totalScore += finalRules.completionBonus;
        earnedBadges.push('✅ Completou Tudo');
        breakdown.push({
            questionId: 'completion-bonus',
            basePoints: finalRules.completionBonus,
            bonusPoints: 0,
            penalties: 0,
            totalPoints: finalRules.completionBonus,
            notes: ['Bonus por completar 100%']
        });
    }
    
    // Badges adicionais
    const avgTime = answers.reduce((sum, a) => sum + a.timeSpent, 0) / answers.length;
    if (avgTime < 20 && answeredAll) {
        earnedBadges.push('⚡ Speed Demon');
    }
    
    if (totalScore === maxPossibleScore + finalRules.completionBonus) {
        earnedBadges.push('🏆 Pontuação Perfeita');
    }
    
    // Calcular nível
    const level = calculateLevel(totalScore);
    
    return {
        totalScore: Math.round(totalScore),
        maxPossibleScore: maxPossibleScore + finalRules.completionBonus,
        percentage: Math.round((totalScore / (maxPossibleScore + finalRules.completionBonus)) * 100),
        breakdown,
        badges: [...new Set(earnedBadges)],
        level
    };
}

/**
 * Sistema de níveis baseado em XP total
 */
function calculateLevel(xp: number): ScoreResult['level'] {
    const levels = [
        { threshold: 0, name: 'Iniciante' },
        { threshold: 100, name: 'Aprendiz' },
        { threshold: 250, name: 'Explorador' },
        { threshold: 500, name: 'Especialista' },
        { threshold: 1000, name: 'Mestre' },
        { threshold: 2000, name: 'Lenda' }
    ];
    
    let currentLevel = 1;
    let levelName = 'Iniciante';
    let nextLevelAt = 100;
    
    for (let i = 0; i < levels.length; i++) {
        if (xp >= levels[i].threshold) {
            currentLevel = i + 1;
            levelName = levels[i].name;
            nextLevelAt = levels[i + 1]?.threshold || levels[i].threshold;
        } else {
            break;
        }
    }
    
    return {
        current: currentLevel,
        name: levelName,
        nextLevelAt
    };
}

/**
 * Calcular XP necessário para próximo nível
 */
export function calculateXPToNextLevel(
    currentXP: number
): {
    current: number;
    required: number;
    remaining: number;
    percentage: number;
} {
    const level = calculateLevel(currentXP);
    const prevThreshold = level.current > 1 
        ? [0, 100, 250, 500, 1000, 2000][level.current - 2]
        : 0;
    
    const required = level.nextLevelAt - prevThreshold;
    const current = currentXP - prevThreshold;
    const remaining = level.nextLevelAt - currentXP;
    const percentage = Math.round((current / required) * 100);
    
    return {
        current,
        required,
        remaining: Math.max(0, remaining),
        percentage: Math.min(100, percentage)
    };
}

/**
 * Analisar performance do usuário
 */
export interface PerformanceAnalysis {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    overall: 'excellent' | 'good' | 'average' | 'needs-improvement';
}

export function analyzePerformance(
    scoreResult: ScoreResult,
    answers: Answer[]
): PerformanceAnalysis {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];
    
    // Análise de velocidade
    const avgTime = answers.reduce((sum, a) => sum + a.timeSpent, 0) / answers.length;
    if (avgTime < 20) {
        strengths.push('Respostas muito rápidas - boa intuição!');
    } else if (avgTime > 60) {
        weaknesses.push('Tempo elevado por questão');
        suggestions.push('Tente confiar mais na sua primeira impressão');
    }
    
    // Análise de consistência
    const skippedCount = answers.filter(a => a.selectedOptions.length === 0).length;
    if (skippedCount === 0) {
        strengths.push('Completou todas as questões - comprometimento alto!');
    } else if (skippedCount > answers.length * 0.2) {
        weaknesses.push(`${skippedCount} questões puladas`);
        suggestions.push('Considere responder todas para resultados mais precisos');
    }
    
    // Análise de pontuação
    if (scoreResult.percentage >= 90) {
        strengths.push('Pontuação excelente!');
    } else if (scoreResult.percentage < 50) {
        weaknesses.push('Pontuação abaixo da média');
        suggestions.push('Revise suas respostas e tente novamente');
    }
    
    // Análise de badges
    if (scoreResult.badges.length >= 3) {
        strengths.push(`Conquistou ${scoreResult.badges.length} badges!`);
    }
    
    // Overall assessment
    const overall = scoreResult.percentage >= 85 ? 'excellent'
        : scoreResult.percentage >= 70 ? 'good'
        : scoreResult.percentage >= 50 ? 'average'
        : 'needs-improvement';
    
    return {
        strengths,
        weaknesses,
        suggestions,
        overall
    };
}
