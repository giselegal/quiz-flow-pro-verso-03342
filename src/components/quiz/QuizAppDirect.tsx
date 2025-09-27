'use client';

import React, { useState } from 'react';
import IntroStepDirect from './IntroStepDirect';
import Step2Direct from './Step2Direct';

/**
 * 🎯 QUIZ APP DIRETO - SEM CAMADAS DESNECESSÁRIAS
 * 
 * Implementação direta que remove toda a complexidade:
 * - ❌ Não usa useQuizState
 * - ❌ Não usa getPersonalizedStepTemplate
 * - ❌ Não usa quiz21StepsSimplified
 * - ❌ Não usa quiz21StepsComplete
 * - ✅ Renderiza diretamente a Etapa 1 conforme modelo
 * - ✅ Navega para step-2 corretamente
 */

interface QuizAppDirectProps {
    funnelId?: string;
}

export default function QuizAppDirect({ funnelId }: QuizAppDirectProps) {
    const [currentStep, setCurrentStep] = useState<string>('step-1');
    const [userName, setUserName] = useState<string>('');
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const handleNameSubmit = (name: string) => {

        setUserName(name);
        console.log('✅ TESTE FLUXO: Nome coletado com sucesso:', name);
        console.log('🔄 TESTE FLUXO: Preparando para avançar para step-2...');

        // Mostrar feedback de sucesso
        setShowSuccess(true);

        // Transição para próxima etapa após delay
        setTimeout(() => {
            console.log('➡️ TESTE FLUXO: Avançando para step-2');
            setCurrentStep('step-2');
            setShowSuccess(false);
        }, 1000);
    };

    const handleStep2Answer = (answer: string) => {
        console.log('✅ TESTE FLUXO: Resposta da etapa 2:', answer);
        setAnswers(prev => ({ ...prev, 'step-2': answer }));

        // Por enquanto, mostrar sucesso da etapa 2
        alert(`🎉 ETAPA 2 COMPLETADA!\n\nResposta: ${answer}\n\nPróximo: Implementar etapa 3...`);
        // Aqui você pode implementar setCurrentStep('step-3') quando necessário
    };

    // Para step-1, renderizar IntroStep adaptado
    if (currentStep === 'step-1') {
        // Criar dados mock para compatibilidade com props data
        const mockData = {
            id: 'intro',
            type: 'intro' as const,
            title: 'Descobra seu Estilo Pessoal',
            description: 'Quiz completo para descobrir seu estilo único',
            image: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png',
            buttonText: 'Quero Descobrir meu Estilo Agora!',
            placeholder: 'Digite seu primeiro nome aqui...'
        };

        return (
            <div>
                <IntroStep
                    data={mockData}
                    onNameSubmit={handleNameSubmit}
                />
                {showSuccess && (
                    <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-pulse">
                        <p className="font-semibold">✅ Nome coletado!</p>
                        <p className="text-sm">Preparando próxima etapa...</p>
                    </div>
                )}
            </div>
        );
    }

    // Para step-2, renderizar Step2Direct
    if (currentStep === 'step-2') {
        return (
            <Step2Direct
                userName={userName}
                onAnswer={handleStep2Answer}
            />
        );
    }

    // Outras etapas (implementar conforme necessário)
    return (
        <div className="quiz-container">
            <h2>Etapa: {currentStep}</h2>
            <p>Nome: {userName}</p>
        </div>
    );
}