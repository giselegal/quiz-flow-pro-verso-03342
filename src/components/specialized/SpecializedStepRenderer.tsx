/**
 * 🎯 SPECIALIZED STEP RENDERER
 * 
 * Conecta páginas especializadas existentes com o fluxo principal do quiz
 * Resolve o problema das etapas 1 e 20 que não renderizam
 */

import React from 'react';
import { QuizStepRouter } from '@/components/router/QuizStepRouter';
import QuizIntro from '@/components/QuizIntro';
import ResultPage from '@/pages/ResultPage';

interface SpecializedStepRendererProps {
    stepNumber: number;
    data: any;
    onNext: () => void;
    onBack?: () => void;
    funnelId?: string;
}

/**
 * Renderiza páginas especializadas baseado no número do step
 */
export const SpecializedStepRenderer: React.FC<SpecializedStepRendererProps> = ({
    stepNumber,
    data,
    onNext,
    onBack,
    funnelId = 'quiz21StepsComplete'
}) => {

    // Usar QuizStepRouter para determinar tipo de step
    const stepInfo = QuizStepRouter.getStepInfo(stepNumber);
    const stepType = QuizStepRouter.getStepType(stepNumber);

    console.log('🎯 SpecializedStepRenderer:', { stepNumber, stepType, stepInfo });

    switch (stepNumber) {
        case 1:
            // Etapa 1: Página de Introdução com coleta de nome
            return (
                <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1]">
                    <QuizIntro
                        onStart={(userName) => {
                            console.log('👤 Nome coletado:', userName);
                            // Salvar nome no contexto/estado global se necessário
                            localStorage.setItem('quizUserName', userName);
                            onNext();
                        }}
                        globalStyles={{
                            backgroundColor: 'linear-gradient(135deg, #FAF9F7, #F5F2E9, #EEEBE1)'
                        }}
                    />
                </div>
            );

        case 20:
            // Etapa 20: Página de Resultado
            return (
                <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1]">
                    <ResultPage />
                    {/* Note: ResultPage já gerencia seu próprio routing e navegação */}
                </div>
            );

        case 21:
            // Etapa 21: Finalização / Transição
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1]">
                    <div className="text-center space-y-6">
                        <div className="text-6xl">🎉</div>
                        <div>
                            <h2 className="text-3xl font-bold text-[#432818] mb-4">
                                Quiz Finalizado!
                            </h2>
                            <p className="text-[#6B4F43] text-lg mb-8">
                                Obrigado por descobrir seu estilo pessoal!
                            </p>
                            <button
                                onClick={onNext}
                                className="bg-gradient-to-r from-[#B89B7A] to-[#8B7355] text-white px-8 py-3 rounded-lg font-semibold hover:from-[#A08966] hover:to-[#7A6B4D] transition-all duration-300"
                            >
                                Ver Resultado Completo
                            </button>
                        </div>
                    </div>
                </div>
            );

        default:
            // Para steps não especializados, retornar null 
            // (será tratado pelo UniversalQuizStep)
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="text-4xl">⚠️</div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">
                                Step Especializado Não Encontrado
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Step {stepNumber} não tem implementação especializada
                            </p>
                            <div className="text-sm text-gray-500 space-y-1">
                                <p>Tipo detectado: {stepType}</p>
                                <p>Categoria: {stepInfo.category}</p>
                            </div>
                            <button
                                onClick={onNext}
                                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Continuar →
                            </button>
                        </div>
                    </div>
                </div>
            );
    }
};

export default SpecializedStepRenderer;