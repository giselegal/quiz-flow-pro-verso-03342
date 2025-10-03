/**
 * 🏠 STEP 01 CONTAINER - INTRODUÇÃO MODULAR
 * 
 * Container principal que coordena todos os componentes do Step 1,
 * replicando exatamente a funcionalidade do IntroStep atual.
 */

import React from 'react';
import { BaseStepProps } from '../../step-registry/StepTypes';
import {
    IntroHeader,
    IntroImage,
    IntroDescription,
    NameForm,
    IntroFooter
} from './components';
import { useStep01Logic } from './hooks/useStep01Logic';

const Step01Container: React.FC<BaseStepProps> = ({
    stepId,
    stepNumber,
    isActive,
    isEditable,
    onNext,
    onPrevious,
    onSave,
    data,
    funnelId
}) => {
    // Toda a lógica isolada no hook
    const {
        userName,
        isValid,
        isSubmitting,
        stepData,
        handleNameChange,
        handleSubmit,
        progress,
        canProceed,
        metadata
    } = useStep01Logic({
        initialData: data,
        onSave,
        onNext,
        funnelId
    });

    return (
        <main
            className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-white to-gray-50 py-8"
            data-section="intro"
            data-step-id={stepId}
            data-step-number={stepNumber}
            data-is-active={isActive}
            data-is-editable={isEditable}
        >
            {/* Header com logo e título */}
            <IntroHeader
                title={stepData.title}
                isEditable={isEditable}
            />

            {/* Seção principal */}
            <section className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 space-y-6 md:space-y-8 mx-auto">
                {/* Imagem principal */}
                <IntroImage
                    src={stepData.image}
                    alt="Descubra seu estilo predominante"
                    isEditable={isEditable}
                />

                {/* Texto descritivo */}
                <IntroDescription
                    isEditable={isEditable}
                />

                {/* Formulário de nome */}
                <NameForm
                    initialValue={userName}
                    formQuestion={stepData.formQuestion}
                    placeholder={stepData.placeholder}
                    buttonText={stepData.buttonText}
                    onValueChange={handleNameChange}
                    onSubmit={handleSubmit}
                    isEditable={isEditable}
                    disabled={isSubmitting}
                />
            </section>

            {/* Rodapé */}
            <IntroFooter />

            {/* Debug info (apenas em desenvolvimento) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed bottom-0 left-0 bg-black text-white p-2 text-xs max-w-sm overflow-auto max-h-32 z-50">
                    <strong>🔍 Step01 DEBUG:</strong><br />
                    Step ID: {stepId}<br />
                    Ativo: {isActive ? '✅' : '❌'}<br />
                    Editável: {isEditable ? '✅' : '❌'}<br />
                    Nome válido: {isValid ? '✅' : '❌'}<br />
                    Pode prosseguir: {canProceed ? '✅' : '❌'}<br />
                    Progresso: {progress}%<br />
                    FunnelId: {funnelId || 'N/A'}<br />
                    Categoria: {metadata.category}<br />
                    Tempo estimado: {metadata.estimatedTime}s
                </div>
            )}
        </main>
    );
};

export default Step01Container;