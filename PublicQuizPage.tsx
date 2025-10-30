// 🎯 VERSÃO FINAL PÚBLICA - Página do Quiz para Usuário Final
// Este é o componente completo e funcional para Next.js (SSR)
// Localização sugerida: app/(public)/quiz/[quizId]/page.tsx

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// TIPOS
// ============================================================================

interface QuizOption {
    id: string;
    text: string;
    image?: string;
    value?: string;
    weight?: number;
}

interface QuizStep {
    id: string;
    type: 'intro' | 'question' | 'strategic-question' | 'transition' | 'result' | 'offer';
    questionNumber?: string;
    questionText?: string;
    instructions?: string;
    title?: string;
    description?: string;
    message?: string;
    options?: QuizOption[];
    requiredSelections?: number;
    image?: string;
    logo?: string;
    buttonText?: string;
    resultType?: string;
    characteristics?: string[];
    ctaText?: string;
    ctaUrl?: string;
}

interface QuizData {
    id: string;
    title: string;
    description?: string;
    steps: QuizStep[];
    totalSteps: number;
}

interface QuizState {
    currentStepIndex: number;
    answers: Record<string, string[]>;
    userName?: string;
    userEmail?: string;
    startTime: number;
    completed: boolean;
}

// ============================================================================
// UTILITÁRIOS
// ============================================================================

const computeProgress = (current: number, total: number): number => {
    return Math.round((current / total) * 100);
};

const validateAnswer = (answers: string[], required: number): boolean => {
    return answers.length === required;
};

const computeResult = (answers: Record<string, string[]>): string => {
    // Lógica simplificada - pode ser mais complexa baseada em pesos
    const totalAnswers = Object.values(answers).flat().length;
    if (totalAnswers <= 5) return 'beginner';
    if (totalAnswers <= 10) return 'intermediate';
    return 'advanced';
};

// ============================================================================
// COMPONENTES DE BLOCOS (SSR-SAFE)
// ============================================================================

const IntroBlock: React.FC<{
    logo?: string;
    title: string;
    description?: string;
    onStart: (name?: string) => void;
}> = ({ logo, title, description, onStart }) => {
    const [name, setName] = useState('');

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full text-center"
            >
                {logo && (
                    <motion.img
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        src={logo}
                        alt="Logo"
                        className="h-24 mx-auto mb-8"
                    />
                )}

                <h1 className="text-5xl font-bold text-[#432818] mb-6 leading-tight">
                    {title}
                </h1>

                {description && (
                    <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                        {description}
                    </p>
                )}

                <div className="bg-white p-8 rounded-2xl shadow-lg mb-6">
                    <label className="block text-left mb-3 text-sm font-medium text-gray-700">
                        Como você gostaria de ser chamado?
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Digite seu nome"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#deac6d] focus:outline-none text-lg"
                    />
                </div>

                <button
                    onClick={() => onStart(name)}
                    disabled={!name.trim()}
                    className={`
            w-full md:w-auto px-12 py-4 rounded-xl font-semibold text-lg
            transition-all duration-300 transform
            ${name.trim()
                            ? 'bg-[#deac6d] text-white hover:bg-[#5b4135] hover:scale-105 shadow-lg hover:shadow-xl'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
          `}
                >
                    Começar Quiz →
                </button>
            </motion.div>
        </div>
    );
};

const QuestionBlock: React.FC<{
    step: QuizStep;
    currentAnswers: string[];
    onAnswersChange: (answers: string[]) => void;
    onNext: () => void;
    onPrev: () => void;
    progress: number;
    totalSteps: number;
}> = ({ step, currentAnswers, onAnswersChange, onNext, onPrev, progress, totalSteps }) => {
    const handleOptionClick = (optionId: string) => {
        const isSelected = currentAnswers.includes(optionId);
        const maxSelections = step.requiredSelections || 1;

        if (isSelected) {
            onAnswersChange(currentAnswers.filter(id => id !== optionId));
        } else if (currentAnswers.length < maxSelections) {
            onAnswersChange([...currentAnswers, optionId]);
        } else if (maxSelections === 1) {
            onAnswersChange([optionId]);
        }
    };

    const isValid = validateAnswer(currentAnswers, step.requiredSelections || 1);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-2 bg-gray-200 z-50">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-[#deac6d] to-[#5b4135]"
                />
            </div>

            <div className="container mx-auto px-4 py-12 pt-20 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    {/* Header */}
                    <div className="mb-12">
                        <div className="text-sm text-gray-500 mb-3 font-medium">
                            Pergunta {step.questionNumber} de {totalSteps}
                        </div>
                        <h2 className="text-4xl font-bold text-[#432818] mb-4 leading-tight">
                            {step.questionText}
                        </h2>
                        {step.instructions && (
                            <p className="text-lg text-gray-600">{step.instructions}</p>
                        )}
                    </div>

                    {/* Options Grid */}
                    <div className={`grid gap-4 mb-12 ${(step.options?.length || 0) > 4 ? 'md:grid-cols-3' : 'md:grid-cols-2'
                        }`}>
                        {step.options?.map((option) => {
                            const isSelected = currentAnswers.includes(option.id);

                            return (
                                <motion.button
                                    key={option.id}
                                    onClick={() => handleOptionClick(option.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`
                    flex flex-col items-center p-6 border-2 rounded-2xl
                    transition-all duration-300 relative overflow-hidden
                    ${isSelected
                                            ? 'border-[#5b4135] bg-gradient-to-br from-white to-[#f8f5f0] shadow-xl scale-105'
                                            : 'border-gray-200 bg-white hover:border-[#deac6d] hover:shadow-md'
                                        }
                  `}
                                >
                                    {option.image && (
                                        <img
                                            src={option.image}
                                            alt={option.text}
                                            className="rounded-xl w-full mb-4 object-cover h-48"
                                        />
                                    )}

                                    <p className="text-center font-medium leading-relaxed text-[#432818]">
                                        {option.text}
                                    </p>

                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="mt-4 w-8 h-8 bg-[#deac6d] rounded-full flex items-center justify-center shadow-lg"
                                        >
                                            <span className="text-white font-bold">✓</span>
                                        </motion.div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-4 justify-between items-center">
                        <button
                            onClick={onPrev}
                            className="px-8 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all"
                        >
                            ← Voltar
                        </button>

                        <div className="flex-1 text-center">
                            {(step.requiredSelections || 1) > 1 && (
                                <p className="text-sm text-gray-500">
                                    {currentAnswers.length} de {step.requiredSelections} selecionado(s)
                                </p>
                            )}
                        </div>

                        <button
                            onClick={onNext}
                            disabled={!isValid}
                            className={`
                px-12 py-3 rounded-xl font-semibold transition-all transform
                ${isValid
                                    ? 'bg-[#deac6d] text-white hover:bg-[#5b4135] hover:scale-105 shadow-lg'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }
              `}
                        >
                            Continuar →
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const TransitionBlock: React.FC<{
    message: string;
    onComplete: () => void;
}> = ({ message, onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 2000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#deac6d] to-[#5b4135] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center text-white"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-6"
                />
                <h2 className="text-3xl font-bold mb-4">{message}</h2>
                <p className="text-lg opacity-90">Aguarde um momento...</p>
            </motion.div>
        </div>
    );
};

const ResultBlock: React.FC<{
    step: QuizStep;
    userName?: string;
    onRestart: () => void;
}> = ({ step, userName, onRestart }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block mb-6"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-[#deac6d] to-[#5b4135] rounded-full flex items-center justify-center text-white text-5xl shadow-xl">
                            🎉
                        </div>
                    </motion.div>

                    <h1 className="text-5xl font-bold text-[#432818] mb-4">
                        Parabéns{userName ? `, ${userName}` : ''}!
                    </h1>

                    <p className="text-2xl text-gray-600 mb-8">
                        {step.title}
                    </p>
                </div>

                {step.image && (
                    <motion.img
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        src={step.image}
                        alt="Resultado"
                        className="rounded-2xl w-full max-w-2xl mx-auto mb-8 shadow-2xl"
                    />
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-8 rounded-2xl shadow-lg mb-8"
                >
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        {step.description}
                    </p>

                    {step.characteristics && step.characteristics.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="font-bold text-xl text-[#432818] mb-4">
                                Suas Características:
                            </h3>
                            {step.characteristics.map((char, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="flex items-start gap-3"
                                >
                                    <span className="text-[#deac6d] text-xl">✓</span>
                                    <p className="text-gray-700">{char}</p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {step.ctaUrl && (
                        <motion.a
                            href={step.ctaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="px-10 py-4 bg-gradient-to-r from-[#deac6d] to-[#5b4135] text-white rounded-xl font-semibold text-lg hover:scale-105 transition-transform shadow-lg text-center"
                        >
                            {step.ctaText || 'Saiba Mais'} →
                        </motion.a>
                    )}

                    <motion.button
                        onClick={onRestart}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="px-10 py-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                        🔄 Refazer Quiz
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

// ============================================================================
// COMPONENTE PRINCIPAL - QUIZ RENDERER
// ============================================================================

export default function PublicQuizPage({ quizData }: { quizData: QuizData }) {
    const [state, setState] = useState<QuizState>({
        currentStepIndex: 0,
        answers: {},
        startTime: Date.now(),
        completed: false,
    });

    // Persistência em localStorage
    useEffect(() => {
        const saved = localStorage.getItem(`quiz_${quizData.id}`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setState(parsed);
            } catch (e) {
                console.error('Erro ao carregar estado salvo:', e);
            }
        }
    }, [quizData.id]);

    useEffect(() => {
        localStorage.setItem(`quiz_${quizData.id}`, JSON.stringify(state));
    }, [state, quizData.id]);

    const currentStep = quizData.steps[state.currentStepIndex];
    const progress = computeProgress(state.currentStepIndex + 1, quizData.totalSteps);

    const handleStart = useCallback((name?: string) => {
        setState(prev => ({
            ...prev,
            userName: name,
            currentStepIndex: 1, // Pula intro
            startTime: Date.now(),
        }));
    }, []);

    const handleAnswersChange = useCallback((answers: string[]) => {
        setState(prev => ({
            ...prev,
            answers: {
                ...prev.answers,
                [currentStep.id]: answers,
            },
        }));
    }, [currentStep.id]);

    const handleNext = useCallback(() => {
        if (state.currentStepIndex < quizData.steps.length - 1) {
            setState(prev => ({
                ...prev,
                currentStepIndex: prev.currentStepIndex + 1,
            }));
        } else {
            setState(prev => ({ ...prev, completed: true }));
        }
    }, [state.currentStepIndex, quizData.steps.length]);

    const handlePrev = useCallback(() => {
        if (state.currentStepIndex > 0) {
            setState(prev => ({
                ...prev,
                currentStepIndex: prev.currentStepIndex - 1,
            }));
        }
    }, [state.currentStepIndex]);

    const handleRestart = useCallback(() => {
        setState({
            currentStepIndex: 0,
            answers: {},
            startTime: Date.now(),
            completed: false,
        });
        localStorage.removeItem(`quiz_${quizData.id}`);
    }, [quizData.id]);

    // Renderização condicional por tipo de step
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={state.currentStepIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                {currentStep.type === 'intro' && (
                    <IntroBlock
                        logo={currentStep.logo}
                        title={currentStep.title || quizData.title}
                        description={currentStep.description}
                        onStart={handleStart}
                    />
                )}

                {(currentStep.type === 'question' || currentStep.type === 'strategic-question') && (
                    <QuestionBlock
                        step={currentStep}
                        currentAnswers={state.answers[currentStep.id] || []}
                        onAnswersChange={handleAnswersChange}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        progress={progress}
                        totalSteps={quizData.totalSteps}
                    />
                )}

                {currentStep.type === 'transition' && (
                    <TransitionBlock
                        message={currentStep.message || 'Processando suas respostas...'}
                        onComplete={handleNext}
                    />
                )}

                {(currentStep.type === 'result' || currentStep.type === 'offer') && (
                    <ResultBlock
                        step={currentStep}
                        userName={state.userName}
                        onRestart={handleRestart}
                    />
                )}
            </motion.div>
        </AnimatePresence>
    );
}

// ============================================================================
// EXEMPLO DE USO (Next.js Page)
// ============================================================================

/*
// app/(public)/quiz/[quizId]/page.tsx

import PublicQuizPage from '@/components/quiz/PublicQuizPage';
import { fetchQuizById } from '@/lib/supabase/queries';

export default async function QuizPage({ params }: { params: { quizId: string } }) {
  const quizData = await fetchQuizById(params.quizId);

  if (!quizData) {
    return <div>Quiz não encontrado</div>;
  }

  return <PublicQuizPage quizData={quizData} />;
}

// Metadata para SEO
export async function generateMetadata({ params }: { params: { quizId: string } }) {
  const quiz = await fetchQuizById(params.quizId);
  
  return {
    title: quiz?.title || 'Quiz',
    description: quiz?.description || 'Descubra mais sobre você',
  };
}
*/
