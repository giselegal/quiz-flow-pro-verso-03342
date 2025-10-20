/**
 * Exemplo de uso dos novos hooks unificados:
 * - useQuizUserProgress
 * - useUnifiedQuizNavigation
 */
import React, { useState, useEffect } from 'react';
import { useQuizUserProgress, useUnifiedQuizNavigation } from '../hooks';

// Componente de Exemplo
export const QuizWithUnifiedNavigation: React.FC = () => {
    // Dados de exemplo para o funil
    const funnelId = 'quiz-exemplo-123';
    const totalSteps = 5;

    // Configuração de regras de navegação condicional
    type AnswerOption = { id: string; value: string; points?: number };
    type StepAnswer = { stepId: number; selectedOptions: AnswerOption[]; inputValue?: string; questionId: string };

    const navigationRules = [
        {
            stepId: 1, // Se estiver no passo 1
            condition: (answers: StepAnswer[]) => {
                const stepAnswer = answers.find((a: StepAnswer) => a.stepId === 1);
                if (!stepAnswer) return false;

                // Se selecionou a opção "opção-3", vai direto para o passo 4
                return stepAnswer.selectedOptions.some((opt: AnswerOption) => opt.id === 'opcao-3');
            },
            targetStepId: 4 // Pula para o passo 4
        }
    ];

    // Hook de navegação unificada
    const {
        currentStepIndex,
        isFirstStep,
        isLastStep,
        canGoBack,
        canGoForward,
        completionPercentage,
        navigateToNextStep,
        navigateToPreviousStep,
        setStepValidity,
    } = useUnifiedQuizNavigation({
        funnelId,
        totalSteps,
        rules: navigationRules,
        onStepChange: (step) => console.log(`Mudou para o passo ${step + 1}`),
        onComplete: (answers) => console.log('Quiz completo!', answers),
    });

    // Hook de progresso do usuário
    const {
        recordAnswer,
        totalPoints,
        answers,
        duration,
    } = useQuizUserProgress({
        funnelId,
        persistToLocalStorage: true,
    });

    // Simular validação do passo atual
    const [inputValue, setInputValue] = useState('');

    // Exemplo de validação dinâmica
    useEffect(() => {
        // Validação diferente para cada passo
        switch (currentStepIndex) {
            case 0:
                // Primeiro passo: sempre válido
                setStepValidity(true);
                break;
            case 1:
            case 2:
                // Passos 2 e 3: precisa selecionar pelo menos uma opção
                setStepValidity(answers.some(a => a.stepId === currentStepIndex));
                break;
            case 3:
                // Passo 4: precisa digitar algo no campo
                setStepValidity(inputValue.length > 0);
                break;
            case 4:
                // Último passo: sempre válido
                setStepValidity(true);
                break;
            default:
                setStepValidity(false);
        }
    }, [currentStepIndex, inputValue, answers, setStepValidity]);

    // Opções fictícias para demonstração
    const getStepOptions = (stepIndex: number): AnswerOption[] => {
        switch (stepIndex) {
            case 1:
                return [
                    { id: 'opcao-1', value: 'Opção 1', points: 10 },
                    { id: 'opcao-2', value: 'Opção 2', points: 5 },
                    { id: 'opcao-3', value: 'Opção 3 (Pular para o passo final)', points: 20 },
                ];
            case 2:
                return [
                    { id: 'opcao-4', value: 'Opção A', points: 15 },
                    { id: 'opcao-5', value: 'Opção B', points: 10 },
                    { id: 'opcao-6', value: 'Opção C', points: 5 },
                ];
            default:
                return [];
        }
    };

    // Registrar uma seleção
    const handleOptionSelect = (option: AnswerOption) => {
        recordAnswer(currentStepIndex, {
            questionId: `pergunta-${currentStepIndex}`,
            selectedOptions: [option],
        });
    };

    // Registrar valor de input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = (e.target as HTMLInputElement).value;
        setInputValue(value);

        recordAnswer(currentStepIndex, {
            questionId: `pergunta-${currentStepIndex}`,
            selectedOptions: [],
            inputValue: value,
        });
    };

    // Renderização específica para cada passo
    const renderStepContent = () => {
        switch (currentStepIndex) {
            case 0:
                return (
                    <div className="step-content welcome">
                        <h2>Bem-vindo ao Quiz!</h2>
                        <p>Responda as perguntas e descubra seu resultado.</p>
                    </div>
                );

            case 1:
            case 2:
                return (
                    <div className="step-content options">
                        <h2>Pergunta {currentStepIndex}</h2>
                        <p>Selecione uma opção:</p>
                        <div className="options-list">
                            {getStepOptions(currentStepIndex).map(option => (
                                <button
                                    key={option.id}
                                    className={answers.some(a =>
                                        a.stepId === currentStepIndex &&
                                        a.selectedOptions.some(o => o.id === option.id)
                                    ) ? 'selected' : ''}
                                    onClick={() => handleOptionSelect(option)}
                                >
                                    {option.value}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="step-content input">
                        <h2>Quase lá!</h2>
                        <p>Digite seu nome:</p>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Seu nome aqui"
                        />
                    </div>
                );

            case 4:
                return (
                    <div className="step-content result">
                        <h2>Resultado Final</h2>
                        <p>Você completou o quiz!</p>
                        <p>Pontuação total: {totalPoints} pontos</p>
                        <p>Tempo: {Math.floor(duration / 1000)} segundos</p>
                        <button onClick={() => window.location.reload()}>
                            Reiniciar Quiz
                        </button>
                    </div>
                );

            default:
                return <p>Passo não encontrado</p>;
        }
    };

    return (
        <div className="quiz-container">
            {/* Barra de progresso */}
            <div className="progress-bar">
                <div className="progress" style={{ width: `${completionPercentage}%` }}></div>
                <span>{completionPercentage}%</span>
            </div>

            {/* Conteúdo do passo atual */}
            <div className="step-container">
                {renderStepContent()}
            </div>

            {/* Navegação */}
            <div className="navigation-buttons">
                {canGoBack && (
                    <button onClick={navigateToPreviousStep}>
                        Voltar
                    </button>
                )}

                {!isLastStep && (
                    <button
                        disabled={!canGoForward}
                        onClick={navigateToNextStep}
                    >
                        {currentStepIndex === 0 ? 'Começar' : 'Continuar'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuizWithUnifiedNavigation;