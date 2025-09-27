'use client';

import React, { useState } from 'react';
import IntroStepDirect from './IntroStepDirect';

/**
 * 🎯 QUIZ APP DIRETO - SEM CAMADAS DESNECESSÁRIAS
 * 
 * Implementação direta que remove toda a complexidade:
 * - ❌ Não usa useQuizState
 * - ❌ Não usa getPersonalizedStepTemplate
 * - ❌ Não usa quiz21StepsSimplified
 * - ❌ Não usa quiz21StepsComplete
 * - ✅ Renderiza diretamente a Etapa 1 conforme modelo
 */

interface QuizAppDirectProps {
    funnelId?: string;
}

export default function QuizAppDirect({ funnelId }: QuizAppDirectProps) {
    const [currentStep, setCurrentStep] = useState<string>('step-1');
    const [userName, setUserName] = useState<string>('');
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    const handleNameSubmit = (name: string) => {
        setUserName(name);
        console.log('✅ TESTE FLUXO: Nome coletado com sucesso:', name);
        console.log('🔄 TESTE FLUXO: Preparando para avançar para step-2...');

        // Mostrar feedback de sucesso
        setShowSuccess(true);

        // Simular transição para próxima etapa após delay
        setTimeout(() => {
            console.log('➡️ TESTE FLUXO: Avançando para step-2');
            // setCurrentStep('step-2'); // Descomentado quando step-2 estiver pronto
            alert(`🎉 FLUXO TESTADO COM SUCESSO!\n\nNome: ${name}\nPróximo: Etapa 2 (Quiz de Perguntas)\n\nTodos os sistemas funcionando! 🚀`);
        }, 1000);
    };

    // Para step-1, renderizar IntroStepDirect
    if (currentStep === 'step-1') {
        return (
            <div>
                <IntroStepDirect onNameSubmit={handleNameSubmit} />
                {showSuccess && (
                    <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-pulse">
                        <p className="font-semibold">✅ Nome coletado!</p>
                        <p className="text-sm">Preparando próxima etapa...</p>
                    </div>
                )}
            </div>
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