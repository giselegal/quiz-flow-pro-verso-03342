/**
 * 🔄 INTEGRAÇÃO DO STEP 01 MODULAR COM QUIZAPP
 * 
 * Este arquivo demonstra como integrar o Step01Container modular
 * com o QuizApp.tsx existente, mantendo a mesma funcionalidade.
 */

// (Isolado temporariamente para sanar erros de type-check)
import React from 'react';
// import { stepRegistry, StepRenderer } from './steps'; // removido: módulo './steps' inexistente
// import { useQuizState } from '@/hooks/useQuizState';
// import { getStepById } from '@/data/quizSteps';

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
const ModularIntroStep: React.FC<ModularIntroStepProps> = ({ stepData }) => {
    return (
        <div className="p-4 border border-dashed rounded text-xs text-gray-600">
            <p>Modulo experimental ModularIntroStep isolado (placeholder)</p>
            <pre className="mt-2 bg-gray-50 p-2 rounded max-h-40 overflow-auto">{JSON.stringify(stepData?.id || 'step-01', null, 2)}</pre>
        </div>
    );
};

export default ModularIntroStep;
