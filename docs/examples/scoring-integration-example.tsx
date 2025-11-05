/**
 * 🎯 EXEMPLO COMPLETO DE INTEGRAÇÃO
 * Mostra como o sistema de pontuação funciona do início ao fim
 */

import React, { useState, useEffect } from 'react';
import { calculateScore, analyzePerformance, Answer } from '@/utils/scoreCalculator';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// EXEMPLO 1: COMPONENTE DE QUESTÃO COM TIMER
// ============================================================================

export const QuizQuestionWithScoring = ({
    stepId,
    questionText,
    options,
    weight = 1,
    timeLimit = 30,
    onComplete
}) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [startTime] = useState(Date.now());
    const [timeElapsed, setTimeElapsed] = useState(0);

    // Atualizar tempo a cada segundo
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    const handleSubmit = () => {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);

        // Criar resposta no formato esperado
        const answer: Answer = {
            questionId: stepId,
            selectedOptions,
            timeSpent,
        };

        onComplete(answer);
    };

    const isSpeedBonus = timeElapsed < 15;

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Timer */}
            <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                    Peso: <span className="font-bold">{weight}x</span>
                </div>
                <div className={`text-lg font-mono ${isSpeedBonus ? 'text-green-600' : 'text-gray-600'}`}>
                    ⏱️ {timeElapsed}s
                    {isSpeedBonus && <span className="text-xs ml-2">⚡ Speed Bonus!</span>}
                </div>
            </div>

            {/* Questão */}
            <h2 className="text-2xl font-bold mb-6">{questionText}</h2>

            {/* Opções */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => {
                            setSelectedOptions(prev =>
                                prev.includes(option.id)
                                    ? prev.filter(id => id !== option.id)
                                    : [...prev, option.id]
                            );
                        }}
                        className={`p-4 rounded-lg border-2 transition-all ${selectedOptions.includes(option.id)
                                ? 'border-[#B89B7A] bg-[#F3E8D3]'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <img src={option.image} alt={option.text} className="w-full h-32 object-cover rounded mb-2" />
                        <p className="text-sm">{option.text}</p>
                    </button>
                ))}
            </div>

            {/* Botão Avançar */}
            <button
                onClick={handleSubmit}
                disabled={selectedOptions.length === 0}
                className="w-full py-3 bg-[#B89B7A] text-white rounded-lg font-semibold disabled:opacity-50"
            >
                Avançar
            </button>
        </div>
    );
};

// ============================================================================
// EXEMPLO 2: DISPLAY DE SCORE NO HEADER
// ============================================================================

export const QuizScoreHeader = ({
    totalScore,
    level,
    badges,
    currentXP,
    nextLevelAt
}) => {
    const xpProgress = ((currentXP - [0, 100, 250, 500, 1000, 2000][level.current - 1]) /
        (nextLevelAt - [0, 100, 250, 500, 1000, 2000][level.current - 1])) * 100;

    return (
        <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-md z-50 p-4"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Score */}
                <motion.div
                    className="flex items-center gap-3"
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="text-3xl font-bold text-[#B89B7A]">
                        {totalScore}
                    </div>
                    <div className="text-sm">
                        <div className="font-semibold">pontos</div>
                        <div className="text-xs text-gray-500">
                            Nível {level.current} · {level.name}
                        </div>
                    </div>
                </motion.div>

                {/* Progress Bar */}
                <div className="flex-1 max-w-md mx-8">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progresso para Nível {level.current + 1}</span>
                        <span>{Math.round(xpProgress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${xpProgress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-[#B89B7A] to-[#A68B6A]"
                        />
                    </div>
                </div>

                {/* Badges */}
                <div className="flex gap-2">
                    <AnimatePresence>
                        {badges.slice(0, 3).map((badge, index) => (
                            <motion.div
                                key={badge}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-2xl"
                                title={badge}
                            >
                                {badge.split(' ')[0]}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

// ============================================================================
// EXEMPLO 3: PÁGINA DE RESULTADOS COMPLETA
// ============================================================================

export const QuizResultsWithScore = ({ answers, totalSteps }) => {
    const [scoreResult, setScoreResult] = useState(null);
    const [analysis, setAnalysis] = useState(null);

    useEffect(() => {
        // Calcular score
        const result = calculateScore(answers, {
            completionBonus: 50,
            speedBonusThreshold: 15,
            speedBonusPoints: 5,
            streakMultiplier: 1.5
        });

        setScoreResult(result);

        // Analisar performance
        const perf = analyzePerformance(result, answers);
        setAnalysis(perf);
    }, [answers]);

    if (!scoreResult || !analysis) {
        return <div>Calculando resultados...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] to-[#F3E8D3] py-12 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Header de Resultado */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <div className="text-8xl font-bold text-[#B89B7A] mb-4">
                        {scoreResult.totalScore}
                    </div>
                    <div className="text-2xl text-gray-700 mb-2">
                        {scoreResult.percentage}% de aproveitamento
                    </div>
                    <div className="text-xl text-gray-600">
                        Nível {scoreResult.level.current} · {scoreResult.level.name}
                    </div>
                </motion.div>

                {/* Badges */}
                {scoreResult.badges.length > 0 && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl shadow-lg p-8 mb-8"
                    >
                        <h3 className="text-2xl font-bold mb-6 text-center">🏆 Conquistas</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {scoreResult.badges.map((badge, index) => (
                                <motion.div
                                    key={badge}
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl"
                                >
                                    <div className="text-4xl mb-2">{badge.split(' ')[0]}</div>
                                    <div className="text-sm font-semibold">{badge.split(' ').slice(1).join(' ')}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Análise de Performance */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="grid md:grid-cols-2 gap-6 mb-8"
                >
                    {/* Pontos Fortes */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-xl font-bold mb-4 text-green-600 flex items-center gap-2">
                            💪 Pontos Fortes
                        </h3>
                        <ul className="space-y-2">
                            {analysis.strengths.map((strength, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                    className="flex items-start gap-2"
                                >
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-gray-700">{strength}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    {/* Sugestões */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-xl font-bold mb-4 text-blue-600 flex items-center gap-2">
                            💡 Sugestões
                        </h3>
                        <ul className="space-y-2">
                            {analysis.suggestions.length > 0 ? (
                                analysis.suggestions.map((suggestion, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.8 + index * 0.1 }}
                                        className="flex items-start gap-2"
                                    >
                                        <span className="text-blue-500 mt-1">→</span>
                                        <span className="text-gray-700">{suggestion}</span>
                                    </motion.li>
                                ))
                            ) : (
                                <li className="text-gray-500 italic">Performance impecável! 🎉</li>
                            )}
                        </ul>
                    </div>
                </motion.div>

                {/* Detalhamento por Questão */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="bg-white rounded-2xl shadow-lg p-8"
                >
                    <h3 className="text-2xl font-bold mb-6">📊 Detalhamento</h3>
                    <div className="space-y-4">
                        {scoreResult.breakdown.map((item, index) => (
                            <div key={item.questionId} className="border-b pb-4 last:border-b-0">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-gray-700">
                                        Questão {index + 1}
                                    </span>
                                    <span className="text-2xl font-bold text-[#B89B7A]">
                                        {item.totalPoints} pts
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                                    <div>Base: {item.basePoints} pts</div>
                                    {item.bonusPoints > 0 && (
                                        <div className="text-green-600">Bonus: +{item.bonusPoints} pts</div>
                                    )}
                                    {item.penalties < 0 && (
                                        <div className="text-red-600">Penalidade: {item.penalties} pts</div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {item.notes.map((note, i) => (
                                        <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                            {note}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Botões de Ação */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="flex gap-4 mt-8"
                >
                    <button className="flex-1 py-4 bg-[#B89B7A] text-white rounded-xl font-semibold hover:bg-[#A68B6A] transition">
                        Ver Recomendações de Estilo
                    </button>
                    <button className="px-6 py-4 border-2 border-[#B89B7A] text-[#B89B7A] rounded-xl font-semibold hover:bg-[#F3E8D3] transition">
                        Refazer Quiz
                    </button>
                </motion.div>

            </div>
        </div>
    );
};

// ============================================================================
// EXEMPLO 4: INTEGRAÇÃO COMPLETA COM FLUXO DO QUIZ
// ============================================================================

export const QuizFlowWithScoring = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [scoreState, setScoreState] = useState({
        totalScore: 0,
        level: { current: 1, name: 'Iniciante', nextLevelAt: 100 },
        badges: [],
        breakdown: []
    });

    const handleAnswerComplete = (answer: Answer) => {
        // Adicionar resposta
        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);

        // Recalcular score
        const result = calculateScore(newAnswers);
        setScoreState({
            totalScore: result.totalScore,
            level: result.level,
            badges: result.badges,
            breakdown: result.breakdown
        });

        // Avançar para próxima questão
        setCurrentStep(prev => prev + 1);
    };

    const questions = [
        {
            id: 'step-02',
            text: 'Qual o seu tipo de roupa favorita?',
            options: [
                { id: 'natural', text: 'Conforto e praticidade', image: '...' },
                { id: 'classico', text: 'Discrição e sobriedade', image: '...' },
                // ... mais opções
            ],
            weight: 1,
            timeLimit: 30
        },
        // ... mais questões
    ];

    if (currentStep >= questions.length) {
        return <QuizResultsWithScore answers={answers} totalSteps={questions.length} />;
    }

    const currentQuestion = questions[currentStep];

    return (
        <div className="min-h-screen bg-[#FAF9F7] pt-24">
            {/* Header com Score */}
            <QuizScoreHeader
                totalScore={scoreState.totalScore}
                level={scoreState.level}
                badges={scoreState.badges}
                currentXP={scoreState.totalScore}
                nextLevelAt={scoreState.level.nextLevelAt}
            />

            {/* Questão */}
            <QuizQuestionWithScoring
                stepId={currentQuestion.id}
                questionText={currentQuestion.text}
                options={currentQuestion.options}
                weight={currentQuestion.weight}
                timeLimit={currentQuestion.timeLimit}
                onComplete={handleAnswerComplete}
            />
        </div>
    );
};
