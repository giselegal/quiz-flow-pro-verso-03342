/**
 * 🎯 QUIZ SCORE DISPLAY - Componente de Exibição de Pontuação
 * 
 * Exibe pontuação do quiz com badges, níveis e breakdown opcional.
 * Integrado com scoreCalculator.ts e quizStore.ts
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Award, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuizScoreDisplayProps {
    block?: {
        id: string;
        type: string;
        props?: Record<string, any>;
    };
    isSelected?: boolean;
    onClick?: () => void;    // Score data
    score?: number;
    maxScore?: number;
    percentage?: number;
    level?: {
        current: number;
        name: string;
        nextLevelAt: number;
    };
    badges?: string[];

    // Visual options
    variant?: 'compact' | 'detailed' | 'celebration';
    showBreakdown?: boolean;
    showLevel?: boolean;
    showBadges?: boolean;
    animate?: boolean;

    // Breakdown data (optional)
    breakdown?: Array<{
        questionId: string;
        basePoints: number;
        bonusPoints: number;
        penalties: number;
        totalPoints: number;
        notes: string[];
    }>;
}

const badgeIcons: Record<string, React.ReactNode> = {
    '🔥': <Zap className="w-5 h-5 text-orange-500" />,
    '💎': <Star className="w-5 h-5 text-blue-500" />,
    '✅': <Award className="w-5 h-5 text-green-500" />,
    '⚡': <Zap className="w-5 h-5 text-yellow-500" />,
    '🏆': <Trophy className="w-5 h-5 text-yellow-600" />,
};

export const QuizScoreDisplay: React.FC<QuizScoreDisplayProps> = ({
    block,
    isSelected = false,
    onClick,
    score: propScore,
    maxScore: propMaxScore,
    percentage: propPercentage,
    level: propLevel,
    badges: propBadges,
    variant = 'detailed',
    showBreakdown: propShowBreakdown,
    showLevel: propShowLevel = true,
    showBadges: propShowBadges = true,
    animate: propAnimate = true,
    breakdown: propBreakdown,
}) => {
    // Merge props from block.props if block is provided
    const score = propScore ?? block?.props?.score ?? 0;
    const maxScore = propMaxScore ?? block?.props?.maxScore ?? 100;
    const percentage = propPercentage ?? block?.props?.percentage ?? Math.round((score / maxScore) * 100);
    const level = propLevel ?? block?.props?.level;
    const badges = propBadges ?? block?.props?.badges ?? [];
    const showBreakdown = propShowBreakdown ?? block?.props?.showBreakdown ?? false;
    const showLevel = propShowLevel ?? block?.props?.showLevel ?? true;
    const showBadges = propShowBadges ?? block?.props?.showBadges ?? true;
    const animate = propAnimate ?? block?.props?.animate ?? true;
    const breakdown = propBreakdown ?? block?.props?.breakdown; const getScoreColor = (perc: number) => {
        if (perc >= 90) return 'text-green-600';
        if (perc >= 70) return 'text-blue-600';
        if (perc >= 50) return 'text-yellow-600';
        return 'text-orange-600';
    };

    const getScoreMessage = (perc: number) => {
        if (perc >= 90) return 'Excelente! 🎉';
        if (perc >= 70) return 'Muito Bem! 👏';
        if (perc >= 50) return 'Bom trabalho! 👍';
        return 'Continue tentando! 💪';
    };

    if (variant === 'compact') {
        return (
            <motion.div
                initial={animate ? { opacity: 0, y: 20 } : undefined}
                animate={animate ? { opacity: 1, y: 0 } : undefined}
                className={cn(
                    'p-4 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200',
                    isSelected && 'ring-2 ring-blue-400',
                    onClick && 'cursor-pointer'
                )}
                onClick={onClick}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Trophy className="w-6 h-6 text-purple-600" />
                        <div>
                            <div className="text-sm text-gray-600">Sua Pontuação</div>
                            <div className={cn('text-2xl font-bold', getScoreColor(percentage))}>
                                {score} / {maxScore}
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className={cn('text-3xl font-bold', getScoreColor(percentage))}>
                            {percentage}%
                        </div>
                        <div className="text-xs text-gray-500">performance</div>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (variant === 'celebration') {
        return (
            <motion.div
                initial={animate ? { scale: 0.8, opacity: 0 } : undefined}
                animate={animate ? { scale: 1, opacity: 1 } : undefined}
                transition={{ type: 'spring', duration: 0.6 }}
                className={cn(
                    'p-8 rounded-2xl bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 border-2 border-purple-300 shadow-xl',
                    isSelected && 'ring-2 ring-blue-400',
                    onClick && 'cursor-pointer'
                )}
                onClick={onClick}
            >
                <div className="text-center space-y-6">
                    <motion.div
                        animate={animate ? { rotate: [0, 10, -10, 0] } : undefined}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Trophy className="w-20 h-20 mx-auto text-yellow-500" />
                    </motion.div>

                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            {getScoreMessage(percentage)}
                        </h2>
                        <p className="text-gray-600">Você completou o quiz com sucesso!</p>
                    </div>

                    <div className="bg-white/80 rounded-xl p-6 backdrop-blur">
                        <div className={cn('text-6xl font-bold mb-2', getScoreColor(percentage))}>
                            {score}
                        </div>
                        <div className="text-xl text-gray-600">
                            de {maxScore} pontos possíveis
                        </div>
                        <div className={cn('text-4xl font-bold mt-4', getScoreColor(percentage))}>
                            {percentage}%
                        </div>
                    </div>

                    {showBadges && badges.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-700">Conquistas Desbloqueadas:</h3>
                            <div className="flex flex-wrap justify-center gap-2">
                                {badges.map((badge, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={animate ? { scale: 0 } : undefined}
                                        animate={animate ? { scale: 1 } : undefined}
                                        transition={{ delay: 0.3 + idx * 0.1 }}
                                        className="px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium"
                                    >
                                        {badge}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {showLevel && level && (
                        <div className="bg-white/80 rounded-lg p-4 backdrop-blur">
                            <div className="text-sm text-gray-600 mb-1">Nível Atual</div>
                            <div className="text-2xl font-bold text-purple-600 mb-2">
                                {level.name}
                            </div>
                            <div className="text-xs text-gray-500">
                                {level.current < 6
                                    ? `Próximo nível em ${level.nextLevelAt - score} pontos`
                                    : 'Nível máximo alcançado! 🎉'
                                }
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    }

    // Default: 'detailed' variant
    return (
        <motion.div
            initial={animate ? { opacity: 0, y: 20 } : undefined}
            animate={animate ? { opacity: 1, y: 0 } : undefined}
            className={cn(
                'p-6 rounded-xl bg-white border border-gray-200 shadow-lg',
                isSelected && 'ring-2 ring-blue-400',
                onClick && 'cursor-pointer'
            )}
            onClick={onClick}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Target className="w-6 h-6 text-purple-600" />
                        Resultado do Quiz
                    </h3>
                    <div className={cn('text-3xl font-bold', getScoreColor(percentage))}>
                        {percentage}%
                    </div>
                </div>

                {/* Score Display */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Pontuação Total</div>
                            <div className={cn('text-4xl font-bold', getScoreColor(percentage))}>
                                {score}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-600 mb-1">Máximo Possível</div>
                            <div className="text-3xl font-bold text-gray-400">
                                {maxScore}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                            initial={animate ? { width: 0 } : undefined}
                            animate={animate ? { width: `${percentage}%` } : { width: `${percentage}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={cn(
                                'h-full rounded-full',
                                percentage >= 90 ? 'bg-green-500' :
                                    percentage >= 70 ? 'bg-blue-500' :
                                        percentage >= 50 ? 'bg-yellow-500' :
                                            'bg-orange-500'
                            )}
                        />
                    </div>
                </div>

                {/* Level Display */}
                {showLevel && level && (
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Star className="w-8 h-8 text-purple-600" />
                            <div>
                                <div className="text-sm text-gray-600">Nível</div>
                                <div className="text-xl font-bold text-purple-600">{level.name}</div>
                            </div>
                        </div>
                        {level.current < 6 && (
                            <div className="text-right">
                                <div className="text-xs text-gray-500">Próximo nível</div>
                                <div className="text-sm font-semibold text-gray-700">
                                    {level.nextLevelAt - score} pts
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Badges */}
                {showBadges && badges.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Conquistas
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {badges.map((badge, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={animate ? { scale: 0, opacity: 0 } : undefined}
                                    animate={animate ? { scale: 1, opacity: 1 } : undefined}
                                    transition={{ delay: idx * 0.1 }}
                                    className="px-3 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full text-sm font-medium text-gray-700 border border-purple-200"
                                >
                                    {badge}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Breakdown */}
                {showBreakdown && breakdown && breakdown.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700">Detalhamento</h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {breakdown.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="p-3 bg-gray-50 rounded-lg text-xs"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium text-gray-700">
                                            {item.questionId.replace('step-', 'Questão ')}
                                        </span>
                                        <span className="font-bold text-purple-600">
                                            {item.totalPoints} pts
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-gray-600">
                                        {item.notes.map((note, noteIdx) => (
                                            <div key={noteIdx}>• {note}</div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default QuizScoreDisplay;
