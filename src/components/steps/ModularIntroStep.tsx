/**
 * 🔄 INTEGRAÇÃO DO STEP 01 MODULAR COM QUIZAPP
 * 
 * Este arquivo demonstra como integrar o Step01Container modular
 * com o QuizApp.tsx existente, mantendo a mesma funcionalidade.
 */

import React from 'react';
import { stepRegistry, StepRenderer } from './steps';
import { useQuizState } from '@/hooks/useQuizState';
import { getStepById } from '@/data/quizSteps';

// Interface para compatibilidade com QuizApp
interface ModularIntroStepProps {
    stepData: any; // Dados do step atual
    onNext: (stepId: string) => void;
    onNameChange: (name: string) => void;
}

/**
 * Componente adaptador que conecta o Step01Container modular
 * com o sistema existente do QuizApp
 */
const ModularIntroStep: React.FC<ModularIntroStepProps> = ({
    stepData,
    onNext,
    onNameChange
}) => {
    const { userName, funnelId } = useQuizState();

    // Dados adaptados para o formato esperado pelo Step01Container
    const adaptedData = {
        userName: userName,
        currentStep: 1,
        totalSteps: 21,
        stepData: stepData
    };

    // Handlers adaptados
    const handleNext = () => {
        onNext(stepData.nextStep!);
    };

    const handleSave = (data: any) => {
        if (data.userName && data.userName !== userName) {
            onNameChange(data.userName);
        }
    };

    // Verificar se o step está registrado
    const step01 = stepRegistry.get('step-01');

    if (!step01) {
        // Fallback para o IntroStep original se o modular não estiver disponível
        console.warn('⚠️  Step 01 modular não disponível, usando fallback');
        return (
            <div className="quiz-card">
                <p className="text-orange-600 mb-4">
                    ⚠️ Sistema modular indisponível - usando versão original
                </p>
                {/* Aqui seria renderizado o IntroStep original */}
            </div>
        );
    }

    return (
        <StepRenderer
            stepId="step-01"
            stepNumber={1}
            isActive={true}
            isEditable={true}
            data={adaptedData}
            funnelId={funnelId}
            onNext={handleNext}
            onPrevious={() => { }} // Primeiro step não tem anterior
            onSave={handleSave}
        />
    );
};

export default ModularIntroStep;