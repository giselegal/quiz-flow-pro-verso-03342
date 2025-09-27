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

    const handleNameSubmit = (name: string) => {
        setUserName(name);
        console.log('✅ Nome coletado:', name);
        // Aqui normalmente avançaria para step-2
        alert(`Olá ${name}! Quiz funcionando perfeitamente!`);
    };

    // Para step-1, renderizar IntroStepDirect
    if (currentStep === 'step-1') {
        return <IntroStepDirect onNameSubmit={handleNameSubmit} />;
    }

    // Outras etapas (implementar conforme necessário)
    return (
        <div className="quiz-container">
            <h2>Etapa: {currentStep}</h2>
            <p>Nome: {userName}</p>
        </div>
    );
}