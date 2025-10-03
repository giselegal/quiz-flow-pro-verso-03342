// 🎯 EXEMPLO PRÁTICO: MIGRAÇÃO DO STEP 1

// ============================================================================
// ANTES (Situação Atual - Complexa e Monolítica)
// ============================================================================

// QuizFunnelEditorWYSIWYG.tsx - 973 linhas (!)
const QuizFunnelEditorWYSIWYG = () => {
    // ❌ PROBLEMA: Tudo misturado em um componente gigante
    const [steps, setSteps] = useState<EditableQuizStep[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');

    // Lógica complexa para renderizar diferentes tipos de steps
    const renderRealComponent = useCallback((step: EditableQuizStep) => {
        // Centenas de linhas de lógica condicional
        switch (step.type) {
            case 'intro': // Lógica específica misturada
            case 'question': // Mais lógica misturada
            // ... etc
        }
    }, [/* muitas dependências */]);

    // Retorna JSX gigante com 4 colunas e centenas de linhas
    return (
        <div className="quiz-editor-container">
            {/* 300+ linhas de JSX complexo */}
        </div>
    );
};

// ============================================================================
// DEPOIS (Arquitetura Modular - Limpa e Organizada)
// ============================================================================

// src/components/steps/step-01/Step01Container.tsx - 45 linhas
import React from 'react';
import { BaseStepProps } from '../../step-registry/StepTypes';
import { IntroHeader, NameForm, StartButton } from './components';
import { useStep01Logic } from './hooks/useStep01Logic';

const Step01Container: React.FC<BaseStepProps> = ({
    stepId,
    stepNumber,
    isEditable,
    onNext,
    onSave,
    data
}) => {
    const { userName, setUserName, isValid, handleStart } = useStep01Logic({
        initialData: data,
        onSave,
        onNext
    });

    return (
        <div className="step-01-container">
            <IntroHeader
                isEditable={isEditable}
                title="Descubra Seu Estilo Pessoal"
                subtitle="Um quiz personalizado para descobrir seu estilo único"
            />

            <NameForm
                value={userName}
                onChange={setUserName}
                placeholder="Digite seu nome..."
                isEditable={isEditable}
            />

            <StartButton
                onClick={handleStart}
                disabled={!isValid}
                text="Quero Descobrir meu Estilo Agora!"
                isEditable={isEditable}
            />
        </div>
    );
};

export default Step01Container;

// src/components/steps/step-01/components/IntroHeader.tsx - 28 linhas
import React from 'react';
import { EditableField } from '../../shared/EditableField';

interface IntroHeaderProps {
    title: string;
    subtitle: string;
    isEditable: boolean;
    onEdit?: (field: string, value: string) => void;
}

const IntroHeader: React.FC<IntroHeaderProps> = ({
    title,
    subtitle,
    isEditable,
    onEdit
}) => {
    return (
        <div className="intro-header">
            <EditableField
                value={title}
                isEditable={isEditable}
                onChange={(value) => onEdit?.('title', value)}
                className="text-4xl font-bold text-center"
            />

            <EditableField
                value={subtitle}
                isEditable={isEditable}
                onChange={(value) => onEdit?.('subtitle', value)}
                className="text-xl text-gray-600 text-center mt-4"
            />
        </div>
    );
};

export default IntroHeader;

// src/components/steps/step-01/components/NameForm.tsx - 35 linhas
import React from 'react';
import { Input } from '@/components/ui/input';
import { EditableField } from '../../shared/EditableField';

interface NameFormProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    isEditable: boolean;
    onEdit?: (field: string, value: string) => void;
}

const NameForm: React.FC<NameFormProps> = ({
    value,
    onChange,
    placeholder,
    isEditable,
    onEdit
}) => {
    return (
        <div className="name-form">
            <EditableField
                value={placeholder}
                isEditable={isEditable}
                onChange={(value) => onEdit?.('placeholder', value)}
                className="text-lg font-medium mb-2"
                as="label"
            />

            <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="text-center text-lg"
                disabled={isEditable} // Desabilita durante edição
            />
        </div>
    );
};

export default NameForm;

// src/components/steps/step-01/hooks/useStep01Logic.ts - 32 linhas
import { useState, useCallback, useEffect } from 'react';

interface UseStep01LogicProps {
    initialData?: any;
    onSave: (data: any) => void;
    onNext: () => void;
}

export const useStep01Logic = ({ initialData, onSave, onNext }: UseStep01LogicProps) => {
    const [userName, setUserName] = useState(initialData?.userName || '');

    // Validação em tempo real
    const isValid = userName.trim().length >= 2;

    // Auto-save quando dados mudam
    useEffect(() => {
        if (userName.trim()) {
            onSave({ userName: userName.trim() });
        }
    }, [userName, onSave]);

    const handleStart = useCallback(() => {
        if (isValid) {
            const data = { userName: userName.trim() };
            onSave(data);
            onNext();
        }
    }, [userName, isValid, onSave, onNext]);

    return {
        userName,
        setUserName,
        isValid,
        handleStart
    };
};

// ============================================================================
// SISTEMA DE REGISTRO AUTOMÁTICO
// ============================================================================

// src/components/steps/step-01/index.ts - 15 linhas
import { stepRegistry } from '../../step-registry/StepRegistry';
import Step01Container from './Step01Container';

// Auto-registro do step no sistema
stepRegistry.register({
    id: 'step-01',
    name: 'Introdução',
    component: Step01Container,
    config: {
        allowNavigation: {
            next: true,
            previous: false
        },
        validation: {
            required: true,
            rules: [{ field: 'userName', required: true, minLength: 2 }]
        }
    }
});

export { default as Step01Container } from './Step01Container';
export * from './components';
export * from './hooks';

// ============================================================================
// RENDERIZADOR UNIVERSAL (Substitui o código complexo atual)
// ============================================================================

// src/components/step-registry/StepRenderer.tsx - 25 linhas
import React from 'react';
import { stepRegistry } from './StepRegistry';
import { BaseStepProps } from './StepTypes';

interface StepRendererProps extends BaseStepProps {
    stepId: string;
}

export const StepRenderer: React.FC<StepRendererProps> = (props) => {
    const stepComponent = stepRegistry.get(props.stepId);

    if (!stepComponent) {
        return (
            <div className="step-error">
                <h2>Step não encontrado: {props.stepId}</h2>
                <p>Verifique se o step foi registrado corretamente.</p>
            </div>
        );
    }

    const Component = stepComponent.component;
    return <Component {...props} />;
};

// ============================================================================
// EDITOR PRINCIPAL SIMPLIFICADO
// ============================================================================

// src/components/editor/ModularQuizEditor.tsx - 85 linhas (vs 973!)
import React, { useState } from 'react';
import { StepRenderer } from '../step-registry/StepRenderer';
import { stepRegistry } from '../step-registry/StepRegistry';

const ModularQuizEditor: React.FC = () => {
    const [currentStepId, setCurrentStepId] = useState('step-01');
    const [isEditable, setIsEditable] = useState(true);
    const [stepData, setStepData] = useState<Record<string, any>>({});

    const allSteps = stepRegistry.getAll();
    const currentStep = stepRegistry.get(currentStepId);

    const handleSave = (stepId: string, data: any) => {
        setStepData(prev => ({ ...prev, [stepId]: data }));
        // Salvar no backend/localStorage
    };

    const handleNext = () => {
        const currentIndex = allSteps.findIndex(s => s.id === currentStepId);
        const nextStep = allSteps[currentIndex + 1];
        if (nextStep) {
            setCurrentStepId(nextStep.id);
        }
    };

    const handlePrevious = () => {
        const currentIndex = allSteps.findIndex(s => s.id === currentStepId);
        const prevStep = allSteps[currentIndex - 1];
        if (prevStep && currentStep?.config.allowNavigation.previous) {
            setCurrentStepId(prevStep.id);
        }
    };

    return (
        <div className="modular-quiz-editor">
            {/* Barra de navegação de steps */}
            <div className="steps-navigation">
                {allSteps.map(step => (
                    <button
                        key={step.id}
                        onClick={() => setCurrentStepId(step.id)}
                        className={`step-nav-button ${currentStepId === step.id ? 'active' : ''}`}
                    >
                        {step.name}
                    </button>
                ))}
            </div>

            {/* Área de renderização do step atual */}
            <div className="step-content">
                <StepRenderer
                    stepId={currentStepId}
                    stepNumber={parseInt(currentStepId.replace('step-', ''))}
                    isActive={true}
                    isEditable={isEditable}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    onSave={(data) => handleSave(currentStepId, data)}
                    data={stepData[currentStepId]}
                />
            </div>

            {/* Controles do editor */}
            <div className="editor-controls">
                <button onClick={() => setIsEditable(!isEditable)}>
                    {isEditable ? 'Preview' : 'Edit'}
                </button>
            </div>
        </div>
    );
};

export default ModularQuizEditor;