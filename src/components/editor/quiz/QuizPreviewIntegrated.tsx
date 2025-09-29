'use client';

/**
 * 🎯 QUIZ PREVIEW INTEGRATED - FASE 2
 * 
 * Preview em tempo real do quiz dentro do editor, mostrando
 * como as questões aparecem para o usuário final.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    Eye, Play, Pause, RotateCcw, ChevronLeft, ChevronRight,
    Target, Crown, Brain, Heart, Palette, Users, Zap, Star
} from 'lucide-react';

import { QuizQuestion, QuizStyle, QuizState } from '@/types/quiz';

interface QuizPreviewIntegratedProps {
    questions: QuizQuestion[];
    styles: QuizStyle[];
    currentQuestionIndex?: number;
    onQuestionChange?: (index: number) => void;
    onAnswerSelect?: (questionId: string, answerId: string) => void;
    className?: string;
}

interface PreviewState {
    isPlaying: boolean;
    currentStep: number;
    answers: Record<string, string>;
    calculatedStyle?: QuizStyle;
    showResults: boolean;
    progress: number;
}

const QuizPreviewIntegrated: React.FC<QuizPreviewIntegratedProps> = ({
    questions,
    styles,
    currentQuestionIndex = 0,
    onQuestionChange,
    onAnswerSelect,
    className = ''
}) => {
    const [state, setState] = useState<PreviewState>({
        isPlaying: false,
        currentStep: 0,
        answers: {},
        showResults: false,
        progress: 0
    });

    // Atualizar progresso
    useEffect(() => {
        const totalAnswered = Object.keys(state.answers).length;
        const progress = questions.length > 0 ? (totalAnswered / questions.length) * 100 : 0;

        setState(prev => ({ ...prev, progress }));
    }, [state.answers, questions.length]);

    // Calcular estilo baseado nas respostas
    useEffect(() => {
        if (Object.keys(state.answers).length >= 3) {
            const calculatedStyle = calculateUserStyle(state.answers, styles);
            setState(prev => ({ ...prev, calculatedStyle }));
        }
    }, [state.answers, styles]);

    const calculateUserStyle = (answers: Record<string, string>, styles: QuizStyle[]): QuizStyle | undefined => {
        const stylePoints: Record<string, number> = {};

        // Inicializar contadores
        styles.forEach(style => {
            stylePoints[style.id] = 0;
        });

        // Contar pontos por estilo baseado nas respostas
        Object.values(answers).forEach(answerId => {
            questions.forEach(question => {
                const answer = question.answers.find(a => a.id === answerId);
                if (answer?.stylePoints) {
                    Object.entries(answer.stylePoints).forEach(([styleId, points]) => {
                        stylePoints[styleId] = (stylePoints[styleId] || 0) + points;
                    });
                }
            });
        });

        // Encontrar estilo com mais pontos
        const topStyleId = Object.entries(stylePoints)
            .sort(([, a], [, b]) => b - a)[0]?.[0];

        return styles.find(style => style.id === topStyleId);
    };

    const handlePlayPause = useCallback(() => {
        setState(prev => ({
            ...prev,
            isPlaying: !prev.isPlaying,
            currentStep: prev.isPlaying ? prev.currentStep : 0
        }));
    }, []);

    const handleReset = useCallback(() => {
        setState({
            isPlaying: false,
            currentStep: 0,
            answers: {},
            showResults: false,
            progress: 0
        });
    }, []);

    const handleAnswerClick = useCallback((questionId: string, answerId: string) => {
        setState(prev => ({
            ...prev,
            answers: { ...prev.answers, [questionId]: answerId }
        }));

        onAnswerSelect?.(questionId, answerId);

        // Auto-avançar se estiver em modo play
        if (state.isPlaying && state.currentStep < questions.length - 1) {
            setTimeout(() => {
                setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
                onQuestionChange?.(state.currentStep + 1);
            }, 800);
        }
    }, [state.isPlaying, state.currentStep, questions.length, onAnswerSelect, onQuestionChange]);

    const handleStepChange = useCallback((step: number) => {
        setState(prev => ({ ...prev, currentStep: step }));
        onQuestionChange?.(step);
    }, [onQuestionChange]);

    const currentQuestion = questions[state.currentStep];
    const selectedAnswer = currentQuestion ? state.answers[currentQuestion.id] : undefined;

    return (
        <div className={`quiz-preview-integrated ${className}`}>
            {/* Header do Preview */}
            <Card className="mb-4">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Eye className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">Preview do Quiz</CardTitle>
                            <Badge variant="outline">FASE 2 - Live</Badge>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant={state.isPlaying ? "secondary" : "default"}
                                size="sm"
                                onClick={handlePlayPause}
                            >
                                {state.isPlaying ? (
                                    <><Pause className="w-4 h-4 mr-2" /> Pausar</>
                                ) : (
                                    <><Play className="w-4 h-4 mr-2" /> Iniciar</>
                                )}
                            </Button>

                            <Button variant="outline" size="sm" onClick={handleReset}>
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reset
                            </Button>
                        </div>
                    </div>

                    {/* Progresso */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Progresso: {Math.round(state.progress)}%</span>
                            <span>
                                {Object.keys(state.answers).length} / {questions.length} respondidas
                            </span>
                        </div>
                        <Progress value={state.progress} className="h-2" />
                    </div>
                </CardHeader>
            </Card>

            <div className="flex gap-4 h-[600px]">
                {/* Preview da Questão */}
                <Card className="flex-1">
                    <CardContent className="p-6 h-full flex flex-col">
                        {currentQuestion ? (
                            <>
                                {/* Cabeçalho da questão */}
                                <div className="text-center mb-6">
                                    <Badge variant="secondary" className="mb-2">
                                        Questão {state.currentStep + 1} de {questions.length}
                                    </Badge>
                                    <h3 className="text-xl font-semibold mb-2">
                                        {currentQuestion.title}
                                    </h3>
                                    {currentQuestion.subtitle && (
                                        <p className="text-muted-foreground">
                                            {currentQuestion.subtitle}
                                        </p>
                                    )}
                                </div>

                                {/* Respostas */}
                                <div className="flex-1 space-y-3">
                                    {currentQuestion.answers.map((answer) => (
                                        <Button
                                            key={answer.id}
                                            variant={selectedAnswer === answer.id ? "default" : "outline"}
                                            className={`w-full h-auto p-4 text-left justify-start ${selectedAnswer === answer.id ? 'ring-2 ring-primary' : ''
                                                }`}
                                            onClick={() => handleAnswerClick(currentQuestion.id, answer.id)}
                                        >
                                            <div>
                                                <div className="font-medium">{answer.text}</div>
                                                {answer.description && (
                                                    <div className="text-sm text-muted-foreground mt-1">
                                                        {answer.description}
                                                    </div>
                                                )}
                                            </div>
                                        </Button>
                                    ))}
                                </div>

                                {/* Navegação */}
                                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleStepChange(Math.max(0, state.currentStep - 1))}
                                        disabled={state.currentStep === 0}
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                        Anterior
                                    </Button>

                                    <div className="text-sm text-muted-foreground">
                                        Passo {state.currentStep + 1}
                                    </div>

                                    <Button
                                        variant="outline"
                                        onClick={() => handleStepChange(Math.min(questions.length - 1, state.currentStep + 1))}
                                        disabled={state.currentStep === questions.length - 1}
                                    >
                                        Próximo
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-center">
                                <div>
                                    <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-lg font-semibold mb-2">Nenhuma questão</h3>
                                    <p className="text-muted-foreground">
                                        Configure questões no painel de propriedades
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Preview do Resultado */}
                <Card className="w-80">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Crown className="w-5 h-5" />
                            Resultado Calculado
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {state.calculatedStyle ? (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-primary to-primary/60 rounded-full flex items-center justify-center">
                                        <Crown className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="text-lg font-semibold">{state.calculatedStyle.name}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {state.calculatedStyle.description}
                                    </p>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <h5 className="font-semibold">Características:</h5>
                                    <ul className="text-sm space-y-1 text-muted-foreground">
                                        {state.calculatedStyle.characteristics?.map((char, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <Star className="w-3 h-3 text-primary" />
                                                {char}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Badge variant="secondary" className="w-full justify-center">
                                    Baseado em {Object.keys(state.answers).length} respostas
                                </Badge>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="text-sm">
                                    Responda pelo menos 3 questões para ver o resultado
                                </p>
                                <Badge variant="outline" className="mt-2">
                                    {Object.keys(state.answers).length} / 3 respostas
                                </Badge>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default QuizPreviewIntegrated;