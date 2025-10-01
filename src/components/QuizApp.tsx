/**
 * 🎯 COMPONENTES PRINCIPAIS DO QUIZ DE ESTILO PESSOAL
 * 
 * Este arquivo contém todos os componentes React necessários para o quiz:
 * - QuizApp: Componente principal que gerencia todo o fluxo
 * - IntroStep: Etapa de introdução e coleta do nome
 * - QuestionStep: Etapas de perguntas com seleção múltipla
 * - TransitionStep: Etapas de transição com loading
 * - ResultStep: Exibição do resultado personalizado
 * - OfferStep: Oferta final personalizada
 */

'use client';

import React from 'react';
import { useQuizState } from '@/hooks/useQuizState';
import { QUIZ_STEPS, getStepById, STRATEGIC_ANSWER_TO_OFFER_KEY } from '@/data/quizSteps';
import { styleConfigGisele } from '@/data/styles';
import type { QuizStep } from '@/data/quizSteps';

// ================================
// 🎯 COMPONENTE PRINCIPAL DO QUIZ
// ================================

export function QuizApp() {
    const {
        currentStep,
        userName,
        answers,
        strategicAnswers,
        resultStyle,
        secondaryStyles,
        navigateToStep,
        setUserName,
        addAnswer,
        addStrategicAnswer,
        calculateResult
    } = useQuizState();

    const stepData = getStepById(currentStep);

    if (!stepData) {
        return (
            <div className="quiz-container">
                <div className="quiz-card">
                    <p className="text-urgent">Erro: Etapa não encontrada.</p>
                </div>
            </div>
        );
    }

    const renderStep = () => {
        switch (stepData.type) {
            case 'intro':
                return <IntroStep stepData={stepData} onNext={navigateToStep} onNameChange={setUserName} />;
            case 'question':
                return (
                    <QuestionStep
                        stepData={stepData}
                        answers={answers}
                        onAnswer={(stepId: string, answerId: string) => {
                            // Converter interface: onAnswer espera string, addAnswer espera string[]
                            const currentStepAnswers = answers[stepId] || [];
                            const isSelected = currentStepAnswers.includes(answerId);

                            let newAnswers: string[];
                            if (isSelected) {
                                // Remove seleção
                                newAnswers = currentStepAnswers.filter(id => id !== answerId);
                            } else {
                                // Adiciona seleção
                                newAnswers = [...currentStepAnswers, answerId];
                            }

                            addAnswer(stepId, newAnswers);
                        }}
                        onNext={navigateToStep}
                    />
                );
            case 'strategic-question':
                return <StrategicQuestionStep stepData={stepData} onAnswer={addStrategicAnswer} onNext={navigateToStep} />;
            case 'transition':
            case 'transition-result':
                return <TransitionStep stepData={stepData} onNext={navigateToStep} />;
            case 'result':
                return <ResultStep
                    stepData={stepData}
                    userName={userName}
                    resultStyle={resultStyle}
                    secondaryStyles={secondaryStyles}
                    onNext={navigateToStep}
                    onCalculate={calculateResult}
                />;
            case 'offer':
                return <OfferStep
                    stepData={stepData}
                    userName={userName}
                    resultStyle={resultStyle}
                    strategicAnswers={strategicAnswers}
                />;
            default:
                return <div>Tipo de etapa não reconhecido</div>;
        }
    };

    const renderProgressBar = () => {
        if (['intro', 'transition', 'transition-result'].includes(stepData.type)) {
            return null;
        }

        const stepIndex = Object.keys(QUIZ_STEPS).indexOf(currentStep);
        const totalSteps = Object.keys(QUIZ_STEPS).length - 3; // Exclui transições
        const progress = Math.min(100, Math.round((stepIndex / totalSteps) * 100));

        return (
            <div className="quiz-progress">
                <div className="quiz-progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
        );
    };

    return (
        <div className="quiz-container">
            {renderProgressBar()}
            {renderStep()}
        </div>
    );
}

// ================================
// 🚀 COMPONENTE DE INTRODUÇÃO
// ================================

interface IntroStepProps {
    stepData: QuizStep;
    onNext: (stepId: string) => void;
    onNameChange: (name: string) => void;
}

function IntroStep({ stepData, onNext, onNameChange }: IntroStepProps) {
    const [name, setName] = React.useState('');

    const handleSubmit = () => {
        if (name.trim()) {
            onNameChange(name.trim());
            onNext(stepData.nextStep!);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="quiz-card">
            <div dangerouslySetInnerHTML={{ __html: stepData.title! }} className="mb-xl" />

            {stepData.image && (
                <div className="mb-xl">
                    <img
                        src={stepData.image}
                        alt="Guarda-roupa organizado"
                        className="rounded-lg shadow mx-auto max-w-full h-auto"
                        style={{ maxWidth: '400px' }}
                    />
                </div>
            )}

            <div className="mt-xl">
                <p className="text-xl font-semibold mb-lg">{stepData.formQuestion}</p>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={stepData.placeholder}
                    className="w-full max-w-sm p-lg rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none transition-colors mb-lg"
                />
                <button
                    onClick={handleSubmit}
                    disabled={!name.trim()}
                    className={`quiz-button ${!name.trim() ? 'quiz-button-disabled' : ''} mt-lg`}
                >
                    {stepData.buttonText}
                </button>
            </div>
        </div>
    );
}

// ================================
// ❓ COMPONENTE DE PERGUNTA
// ================================

interface QuestionStepProps {
    stepData: QuizStep;
    answers: Record<string, string[]>;
    onAnswer: (stepId: string, answerId: string) => void;
    onNext: (stepId: string) => void;
}

function QuestionStep({ stepData, answers, onAnswer, onNext }: QuestionStepProps) {
    const currentAnswers = answers[stepData.questionNumber || ''] || [];
    const hasImages = stepData.options?.[0]?.image;
    const gridClass = hasImages ? 'quiz-options-3col' : 'quiz-options-1col';

    const handleOptionClick = (optionId: string) => {
        const isSelected = currentAnswers.includes(optionId);

        if (isSelected) {
            // Remove seleção
            onAnswer(stepData.questionNumber || '', optionId);
        } else if (currentAnswers.length < (stepData.requiredSelections || 1)) {
            // Adiciona seleção se não atingiu o limite
            onAnswer(stepData.questionNumber || '', optionId);
        }
    };

    const canProceed = currentAnswers.length === (stepData.requiredSelections || 1);

    // Avanço automático após 1 segundo quando atingir seleções necessárias
    React.useEffect(() => {
        if (canProceed && stepData.nextStep) {
            const timer = setTimeout(() => {
                onNext(stepData.nextStep!);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [canProceed, stepData.nextStep, onNext]);

    return (
        <div className="quiz-card">
            <h2 className="text-xl font-bold mb-md">
                {stepData.questionNumber}
            </h2>

            <p className="text-xl font-bold text-primary mb-xl playfair-display">
                {stepData.questionText}
            </p>

            <div className={`quiz-options ${gridClass}`}>
                {stepData.options?.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => handleOptionClick(option.id)}
                        className={`quiz-option ${currentAnswers.includes(option.id) ? 'quiz-option-selected' : ''
                            }`}
                    >
                        {option.image && (
                            <img
                                src={option.image}
                                alt={option.text}
                                className="w-full mb-md rounded"
                            />
                        )}
                        <p className="quiz-option-text">{option.text}</p>
                    </div>
                ))}
            </div>

            <button
                onClick={() => onNext(stepData.nextStep!)}
                disabled={!canProceed}
                className={`quiz-button mt-xl ${!canProceed ? 'quiz-button-disabled' : ''}`}
            >
                Próxima
            </button>
        </div>
    );
}

// ================================
// 🎯 COMPONENTE DE PERGUNTA ESTRATÉGICA
// ================================

interface StrategicQuestionStepProps {
    stepData: QuizStep;
    onAnswer: (question: string, answerId: string) => void;
    onNext: (stepId: string) => void;
}

function StrategicQuestionStep({ stepData, onAnswer, onNext }: StrategicQuestionStepProps) {
    const [selectedAnswer, setSelectedAnswer] = React.useState<string>('');

    const handleOptionClick = (optionId: string) => {
        setSelectedAnswer(optionId);
        onAnswer(stepData.questionText!, optionId);

        // Avanço automático após seleção
        setTimeout(() => {
            onNext(stepData.nextStep!);
        }, 800);
    };

    return (
        <div className="quiz-card">
            <p className="text-xl font-bold text-primary mb-xl playfair-display">
                {stepData.questionText}
            </p>

            <div className="quiz-options quiz-options-1col">
                {stepData.options?.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => handleOptionClick(option.id)}
                        className={`quiz-option ${selectedAnswer === option.id ? 'quiz-option-selected' : ''
                            }`}
                    >
                        <p className="quiz-option-text">{option.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ================================
// ⏳ COMPONENTE DE TRANSIÇÃO
// ================================

interface TransitionStepProps {
    stepData: QuizStep;
    onNext: (stepId: string) => void;
}

function TransitionStep({ stepData, onNext }: TransitionStepProps) {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onNext(stepData.nextStep!);
        }, 3000);
        return () => clearTimeout(timer);
    }, [stepData.nextStep, onNext]);

    return (
        <div className="quiz-card">
            <div className="quiz-loading mx-auto mb-lg"></div>
            <p className="text-xl font-semibold text-dark mb-md">
                {stepData.title}
            </p>
            {stepData.text && (
                <p className="text-secondary">{stepData.text}</p>
            )}
        </div>
    );
}

// ================================
// 🏆 COMPONENTE DE RESULTADO
// ================================

interface ResultStepProps {
    stepData: QuizStep;
    userName: string;
    resultStyle: string;
    secondaryStyles: string[];
    onNext: (stepId: string) => void;
    onCalculate: () => void;
}

function ResultStep({ stepData, userName, resultStyle, onNext, onCalculate }: ResultStepProps) {
    React.useEffect(() => {
        onCalculate();
    }, [onCalculate]);

    const styleConfig = styleConfigGisele[resultStyle];
    if (!styleConfig) {
        return (
            <div className="quiz-card">
                <p className="text-urgent">Erro: Estilo não encontrado.</p>
            </div>
        );
    }

    const handleContinue = () => {
        setTimeout(() => {
            onNext(stepData.nextStep!);
        }, 2000);
    };

    React.useEffect(() => {
        handleContinue();
    }, []);

    return (
        <div className="quiz-card">
            <h1 className="text-3xl font-bold playfair-display mb-md text-primary">
                {stepData.title?.replace('{userName}', userName)}
            </h1>

            <p className="text-2xl font-bold text-dark playfair-display mb-xl">
                {styleConfig.name}
            </p>

            <div className="mb-xl">
                <img
                    src={styleConfig.image}
                    alt={styleConfig.name}
                    className="rounded-lg shadow mx-auto mb-lg max-w-full md:max-w-2/3"
                />
                <p className="text-lg mb-lg text-left">
                    {styleConfig.description}
                </p>
            </div>

            <div className="quiz-special-tips">
                <h3 className="font-bold text-lg mb-md">
                    Dicas Especiais para o seu estilo:
                </h3>
                <ul>
                    {(styleConfig.specialTips || []).map((tip: string, index: number) => (
                        <li key={index}>{tip}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

// ================================
// 🎁 COMPONENTE DE OFERTA
// ================================

interface OfferStepProps {
    stepData: QuizStep;
    userName: string;
    resultStyle: string;
    strategicAnswers: Record<string, string>;
}

function OfferStep({ stepData, userName, resultStyle, strategicAnswers }: OfferStepProps) {
    // Determina qual oferta mostrar baseado na resposta estratégica final
    const finalAnswer = strategicAnswers['Qual desses resultados você mais gostaria de alcançar?'] || 'montar-looks-facilidade';
    const offerKey = STRATEGIC_ANSWER_TO_OFFER_KEY[finalAnswer as keyof typeof STRATEGIC_ANSWER_TO_OFFER_KEY] || 'Montar looks com mais facilidade e confiança';
    const offerContent = stepData.offerMap?.[offerKey];

    if (!offerContent) {
        return (
            <div className="quiz-card">
                <p className="text-urgent">Erro: Oferta não encontrada.</p>
            </div>
        );
    }

    const styleConfig = styleConfigGisele[resultStyle];
    const guideImage = styleConfig?.guideImage || stepData.image;

    return (
        <div className="quiz-card">
            <h2 className="text-3xl font-bold playfair-display mb-md text-primary">
                {offerContent.title.replace('{userName}', userName)}
            </h2>

            <p className="text-lg font-medium mb-lg text-dark">
                Transforme seu guarda-roupa e sua confiança com esta oferta exclusiva.
            </p>

            {guideImage && (
                <img
                    src={guideImage}
                    alt="Oferta Especial - Guia de Estilo"
                    className="rounded-lg shadow mx-auto mb-xl max-w-full"
                />
            )}

            <div className="bg-soft p-lg rounded-lg shadow-sm mb-xl text-left">
                <p className="text-base mb-lg">{offerContent.description}</p>
                <p className="text-center text-secondary italic">
                    "{offerContent.testimonial.quote}" - <strong>{offerContent.testimonial.author}</strong>
                </p>
            </div>

            <div className="text-center">
                <a
                    href="#"
                    className="quiz-button-cta inline-block text-decoration-none w-full max-w-sm"
                >
                    {offerContent.buttonText}
                </a>
            </div>
        </div>
    );
}

export default QuizApp;