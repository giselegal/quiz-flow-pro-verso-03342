/**
 * 🎯 QUIZ QUESTION TYPES VISUAL - FASE 2
 * 
 * Componentes visuais especializados para diferentes tipos de questão:
 * - Múltipla escolha
 * - Escala de valores
 * - Seleção de imagens
 * - Texto livre
 */

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
    CheckSquare, Circle, Sliders, Image, Type, Heart,
    Star, ThumbsUp, Zap, Crown, Brain, Palette,
    Plus, Minus, Edit3
} from 'lucide-react';

import { QuizQuestion, QuizAnswer } from '@/types/quiz';

interface QuizQuestionTypeEditorProps {
    question: QuizQuestion;
    onQuestionChange: (question: QuizQuestion) => void;
    className?: string;
}

interface QuestionTypeConfig {
    id: string;
    name: string;
    icon: React.ElementType;
    description: string;
    defaultAnswers: Partial<QuizAnswer>[];
}

const QUESTION_TYPES: QuestionTypeConfig[] = [
    {
        id: 'multiple-choice',
        name: 'Múltipla Escolha',
        icon: CheckSquare,
        description: 'Opções predefinidas com uma resposta',
        defaultAnswers: [
            { text: 'Opção A', description: 'Descrição da opção A' },
            { text: 'Opção B', description: 'Descrição da opção B' },
            { text: 'Opção C', description: 'Descrição da opção C' }
        ]
    },
    {
        id: 'scale',
        name: 'Escala de Valores',
        icon: Sliders,
        description: 'Escala numérica (1-5 ou 1-10)',
        defaultAnswers: [
            { text: 'Discordo totalmente', description: '1 - Mínimo' },
            { text: 'Discordo parcialmente', description: '2-3 - Baixo' },
            { text: 'Neutro', description: '4-6 - Médio' },
            { text: 'Concordo parcialmente', description: '7-8 - Alto' },
            { text: 'Concordo totalmente', description: '9-10 - Máximo' }
        ]
    },
    {
        id: 'image-select',
        name: 'Seleção Visual',
        icon: Image,
        description: 'Escolha baseada em imagens ou símbolos',
        defaultAnswers: [
            { text: '🎨 Criativo', description: 'Gosto de criar e inovar' },
            { text: '📊 Analítico', description: 'Prefiro dados e análises' },
            { text: '👥 Social', description: 'Valorizo conexões pessoais' },
            { text: '🎯 Estratégico', description: 'Foco em objetivos e resultados' }
        ]
    }
];

const QuizQuestionTypeEditor: React.FC<QuizQuestionTypeEditorProps> = ({
    question,
    onQuestionChange,
    className = ''
}) => {
    const [selectedType, setSelectedType] = useState<string>(
        question.type || 'multiple-choice'
    );

    const handleTypeChange = useCallback((typeId: string) => {
        const typeConfig = QUESTION_TYPES.find(t => t.id === typeId);
        if (!typeConfig) return;

        setSelectedType(typeId);

        const now = new Date().toISOString();
        const updatedQuestion: QuizQuestion = {
            ...question,
            type: typeId as any,
            answers: typeConfig.defaultAnswers.map((defaultAnswer, index) => ({
                id: `answer-${Date.now()}-${index}`,
                questionId: question.id,
                selectedOptions: [],
                value: defaultAnswer.text || `valor-${index + 1}`,
                text: defaultAnswer.text || '',
                description: defaultAnswer.description || '',
                timestamp: now,
                stylePoints: {}
            }))
        };

        onQuestionChange(updatedQuestion);
    }, [question, onQuestionChange]);

    const handleQuestionFieldChange = useCallback((field: string, value: string) => {
        onQuestionChange({
            ...question,
            [field]: value
        });
    }, [question, onQuestionChange]);

    const handleAnswerChange = useCallback((answerIndex: number, field: string, value: string) => {
        const updatedAnswers = [...(question.answers || [])];
        const existing = updatedAnswers[answerIndex];
        if (!existing) return;
        updatedAnswers[answerIndex] = {
            ...existing,
            [field]: value,
            // Garante que value reflita texto se campo "text" mudar e value estava igual ao antigo
            ...(field === 'text' && existing.value === existing.text ? { value } : {})
        } as any;

        onQuestionChange({
            ...question,
            answers: updatedAnswers
        });
    }, [question, onQuestionChange]);

    const handleAddAnswer = useCallback(() => {
        const index = (question.answers?.length || 0) + 1;
        const now = new Date().toISOString();
        const newAnswer: QuizAnswer = {
            id: `answer-${Date.now()}`,
            questionId: question.id,
            selectedOptions: [],
            value: `nova-opcao-${index}`,
            text: `Nova opção ${index}`,
            description: '',
            timestamp: now,
            stylePoints: {}
        };

        onQuestionChange({
            ...question,
            answers: [...(question.answers || []), newAnswer]
        });
    }, [question, onQuestionChange]);

    const handleRemoveAnswer = useCallback((answerIndex: number) => {
        const updatedAnswers = question.answers?.filter((_, index) => index !== answerIndex) || [];

        onQuestionChange({
            ...question,
            answers: updatedAnswers
        });
    }, [question, onQuestionChange]);

    const renderQuestionPreview = () => {
        switch (selectedType) {
            case 'scale':
                return (
                    <div className="space-y-4">
                        <div className="text-center">
                            <div className="flex justify-between text-sm text-muted-foreground mb-2">
                                <span>Discordo totalmente</span>
                                <span>Concordo totalmente</span>
                            </div>
                            <Slider
                                defaultValue={[5]}
                                max={10}
                                min={1}
                                step={1}
                                className="w-full"
                                disabled
                            />
                            <div className="text-sm mt-2 text-muted-foreground">
                                Valor selecionado: 5
                            </div>
                        </div>
                    </div>
                );

            case 'image-select':
                return (
                    <div className="grid grid-cols-2 gap-3">
                        {question.answers?.map((answer, index) => (
                            <Card key={answer.id} className="cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl mb-2">
                                        {(answer.text || '').split(' ')[0]}
                                    </div>
                                    <div className="font-medium text-sm">
                                        {(answer.text || '').replace(/^[^\s]+ /, '')}
                                    </div>
                                    {answer.description && (
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {answer.description}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                );

            default:
                return (
                    <RadioGroup className="space-y-3">
                        {question.answers?.map((answer) => (
                            <div key={answer.id || 'no-id'} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                                <RadioGroupItem value={answer.id || ''} id={answer.id || ''} className="mt-1" />
                                <div className="flex-1">
                                    <Label htmlFor={answer.id} className="font-medium cursor-pointer">
                                        {answer.text || 'Sem texto'}
                                    </Label>
                                    {answer.description && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {answer.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </RadioGroup>
                );
        }
    };

    return (
        <div className={`quiz-question-type-editor space-y-6 ${className}`}>
            {/* Seletor de tipo de questão */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Tipo de Questão</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {QUESTION_TYPES.map((type) => {
                            const Icon = type.icon;
                            const isSelected = selectedType === type.id;

                            return (
                                <Button
                                    key={type.id}
                                    variant={isSelected ? "default" : "outline"}
                                    className={`h-auto p-4 text-left justify-start ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                                        }`}
                                    onClick={() => handleTypeChange(type.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium">{type.name}</div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {type.description}
                                            </div>
                                        </div>
                                    </div>
                                </Button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Configuração da questão */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Configurar Questão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label htmlFor="question-title">Título da Questão</Label>
                            <Input
                                id="question-title"
                                placeholder="Digite o título da questão..."
                                value={question.title || ''}
                                onChange={(e) => handleQuestionFieldChange('title', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="question-subtitle">Subtítulo (opcional)</Label>
                            <Textarea
                                id="question-subtitle"
                                placeholder="Descrição adicional ou instrução..."
                                value={question.subtitle || ''}
                                onChange={(e) => handleQuestionFieldChange('subtitle', e.target.value)}
                                rows={2}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Preview da questão */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Preview da Questão</CardTitle>
                        <Badge variant="outline">
                            {selectedType.replace('-', ' ')}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {question.title && (
                            <div className="text-center">
                                <h3 className="text-xl font-semibold mb-2">{question.title}</h3>
                                {question.subtitle && (
                                    <p className="text-muted-foreground">{question.subtitle}</p>
                                )}
                            </div>
                        )}

                        {renderQuestionPreview()}
                    </div>
                </CardContent>
            </Card>

            {/* Editor de respostas */}
            {selectedType !== 'scale' && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Opções de Resposta</CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleAddAnswer}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar Opção
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {question.answers?.map((answer, index) => (
                                <div key={answer.id} className="flex items-start gap-3 p-4 border rounded-lg">
                                    <div className="flex-1 space-y-2">
                                        <div>
                                            <Label htmlFor={`answer-text-${index}`}>Texto da resposta</Label>
                                            <Input
                                                id={`answer-text-${index}`}
                                                placeholder="Digite o texto da resposta..."
                                                value={answer.text || ''}
                                                onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor={`answer-desc-${index}`}>Descrição (opcional)</Label>
                                            <Input
                                                id={`answer-desc-${index}`}
                                                placeholder="Descrição adicional..."
                                                value={answer.description || ''}
                                                onChange={(e) => handleAnswerChange(index, 'description', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveAnswer(index)}
                                        disabled={(question.answers?.length || 0) <= 2}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}

                            {question.answers && question.answers.length < 6 && (
                                <div className="text-center text-sm text-muted-foreground">
                                    Você pode adicionar até 6 opções de resposta
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default QuizQuestionTypeEditor;