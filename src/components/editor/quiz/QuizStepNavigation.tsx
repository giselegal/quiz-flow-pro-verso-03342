/**
 * 🎯 QUIZ STEP NAVIGATION INTEGRATED - FASE 2
 * 
 * Sistema de navegação entre questões do quiz integrado ao editor,
 * permitindo configurar cada questão individualmente.
 */

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    ChevronLeft, ChevronRight, Plus, Edit3, Check, AlertCircle,
    Target, Brain, Crown, Star, Play, Shuffle
} from 'lucide-react';

import { QuizQuestion } from '@/types/quiz';

interface QuizStepNavigationProps {
    questions: QuizQuestion[];
    currentStep: number;
    onStepChange: (step: number) => void;
    onQuestionEdit: (questionIndex: number) => void;
    onAddQuestion: () => void;
    className?: string;
}

interface StepInfo {
    index: number;
    question: QuizQuestion & { rawType?: string };
    isComplete: boolean;
    hasAnswers: boolean;
    hasScoring: boolean;
    rawType: string;
}

const QuizStepNavigation: React.FC<QuizStepNavigationProps> = ({
    questions,
    currentStep,
    onStepChange,
    onQuestionEdit,
    onAddQuestion,
    className = ''
}) => {
    // Processar informações dos passos
    const stepInfos: StepInfo[] = questions.map((question: any, index) => ({
        index,
        question,
        isComplete: Boolean(
            question.title?.trim() &&
            question.answers?.length >= 2 &&
            question.answers.every((answer: any) => answer.text?.trim() && answer.stylePoints)
        ),
        hasAnswers: question.answers?.length >= 2,
        hasScoring: question.answers?.every((answer: any) => answer.stylePoints) || false,
        rawType: question.rawType || question.type || 'question'
    }));

    const completedSteps = stepInfos.filter(step => step.isComplete).length;
    const progress = questions.length > 0 ? (completedSteps / questions.length) * 100 : 0;

    const getStepIcon = useCallback((step: StepInfo) => {
        // Ícones diferenciados por tipo/base
        const t = step.rawType;
        if (t === 'strategic-question') return Brain;
        if (t === 'offer') return Crown;
        if (t === 'result' || t === 'transition-result') return Star;
        if (t === 'intro') return Play;
        if (t === 'transition') return Shuffle;
        if (step.isComplete) return Check;
        if (step.hasAnswers && !step.hasScoring) return AlertCircle;
        return Edit3;
    }, []);

    const getStepColor = useCallback((step: StepInfo, isCurrent: boolean) => {
        if (isCurrent) return 'primary';
        if (step.isComplete) return 'default';
        if (step.hasAnswers) return 'secondary';
        return 'outline';
    }, []);

    return (
        <Card className={`quiz-step-navigation ${className}`}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Navegação das Questões
                    </CardTitle>

                    <div className="flex items-center gap-2">
                        <Badge variant="outline">
                            {completedSteps} / {questions.length} completas
                        </Badge>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onAddQuestion}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Questão
                        </Button>
                    </div>
                </div>

                {/* Barra de progresso */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Progresso de configuração</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                        <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {/* Lista de questões */}
                <ScrollArea className="h-[400px]" role="navigation" aria-label="Navegação de questões do quiz">
                    <div className="space-y-2" role="list">
                        {stepInfos.map((stepInfo, index) => {
                            const Icon = getStepIcon(stepInfo);
                            const isCurrent = currentStep === index;

                            return (
                                <div key={stepInfo.question.id || index} role="listitem">
                                    <Button
                                        variant={getStepColor(stepInfo, isCurrent) as any}
                                        className={`w-full justify-start h-auto p-3 ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''
                                            }`}
                                        onClick={() => onStepChange(index)}
                                        aria-current={isCurrent ? 'true' : undefined}
                                        aria-label={`Ir para questão ${index + 1}${stepInfo.isComplete ? ' completa' : ''}`}
                                        tabIndex={0}
                                    >
                                        <div className="flex items-center gap-3 w-full">
                                            {/* Ícone do status */}
                                            <div className={`p-1 rounded-full ${stepInfo.isComplete ? 'bg-green-100 text-green-600' :
                                                stepInfo.hasAnswers ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                <Icon className="w-4 h-4" />
                                            </div>

                                            {/* Conteúdo da questão */}
                                            <div className="flex-1 text-left">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-medium">
                                                        Questão {index + 1}
                                                    </span>
                                                    <Badge variant="outline" className="text-xs capitalize">
                                                        {stepInfo.rawType.replace('-', ' ')}
                                                    </Badge>
                                                    {stepInfo.isComplete && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            Completa
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="text-sm text-muted-foreground">
                                                    {stepInfo.question.title ? (
                                                        stepInfo.question.title.length > 40
                                                            ? `${stepInfo.question.title.substring(0, 40)}...`
                                                            : stepInfo.question.title
                                                    ) : (
                                                        <span className="italic">Sem título definido</span>
                                                    )}
                                                </div>

                                                {/* Indicadores de status */}
                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                    <Badge
                                                        variant={stepInfo.hasAnswers ? "default" : "outline"}
                                                        className="text-xs"
                                                    >
                                                        {(stepInfo.question as any).answers?.length || 0} respostas
                                                    </Badge>

                                                    <Badge
                                                        variant={stepInfo.hasScoring ? "default" : "outline"}
                                                        className="text-xs"
                                                    >
                                                        {stepInfo.hasScoring ? "Com pontuação" : "Sem pontuação"}
                                                    </Badge>
                                                    {stepInfo.rawType === 'offer' && (
                                                        <Badge
                                                            variant={(stepInfo.question as any).variants?.length ? 'secondary' : 'outline'}
                                                            className="text-xs"
                                                        >
                                                            {(stepInfo.question as any).variants?.length ? `${(stepInfo.question as any).variants.length} variantes` : 'Sem variantes'}
                                                        </Badge>
                                                    )}
                                                    {stepInfo.rawType === 'strategic-question' && (
                                                        <Badge
                                                            variant={(stepInfo.question as any).answers?.some((a: any) => a.matchValue || a.strategyKey) ? 'secondary' : 'outline'}
                                                            className="text-xs"
                                                        >
                                                            Mapping {(stepInfo.question as any).answers?.some((a: any) => a.matchValue || a.strategyKey) ? 'ok' : 'pendente'}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Ações rápidas */}
                                            <div className="flex flex-col gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onQuestionEdit(index);
                                                    }}
                                                >
                                                    <Edit3 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Button>

                                    {index < stepInfos.length - 1 && (
                                        <Separator className="my-1" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>

                {/* Navegação rápida */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStepChange(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Anterior
                    </Button>

                    <div className="text-center">
                        <div className="text-sm font-medium">
                            Questão {currentStep + 1} de {questions.length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {stepInfos[currentStep]?.isComplete ? 'Completa' : 'Em edição'}
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStepChange(Math.min(questions.length - 1, currentStep + 1))}
                        disabled={currentStep === questions.length - 1}
                    >
                        Próximo
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>

                {/* Resumo de status */}
                <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="space-y-1">
                            <div className="text-lg font-semibold text-green-600">
                                {completedSteps}
                            </div>
                            <div className="text-xs text-muted-foreground">Completas</div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-lg font-semibold text-yellow-600">
                                {stepInfos.filter(s => s.hasAnswers && !s.isComplete).length}
                            </div>
                            <div className="text-xs text-muted-foreground">Em progresso</div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-lg font-semibold text-gray-600">
                                {stepInfos.filter(s => !s.hasAnswers).length}
                            </div>
                            <div className="text-xs text-muted-foreground">Pendentes</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default QuizStepNavigation;