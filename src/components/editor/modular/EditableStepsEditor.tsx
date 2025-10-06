/**
 * 🚀 EDITABLE STEPS EDITOR - Sistema Modular Completo
 * 
 * Editor de 4 colunas com componentes editáveis, independentes e modulares:
 * - Coluna 1: Lista de Etapas
 * - Coluna 2: Biblioteca de Componentes
 * - Coluna 3: Canvas com Preview WYSIWYG
 * - Coluna 4: Painel de Propriedades Dinâmico
 */

import React, { useState } from 'react';
import { useQuizEditor } from '@/context/QuizEditorContext';
import EditableIntroStep from '../editable-steps/EditableIntroStep';
import EditableQuestionStep from '../editable-steps/EditableQuestionStep';
import EditableStrategicQuestionStep from '../editable-steps/EditableStrategicQuestionStep';
import EditableTransitionStep from '../editable-steps/EditableTransitionStep';
import EditableResultStep from '../editable-steps/EditableResultStep';
import EditableOfferStep from '../editable-steps/EditableOfferStep';
import DynamicPropertiesPanel from '../properties/DynamicPropertiesPanel';

const EditableStepsEditor: React.FC = () => {
    const {
        funnel,
        selectedComponent,
        selectComponent,
        updateComponent,
        deleteComponent,
        duplicateComponent,
        addComponent
    } = useQuizEditor();

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isEditMode, setIsEditMode] = useState(true);

    // Verificação de segurança
    if (!funnel || !funnel.steps || funnel.steps.length === 0) {
        return (
            <div style={{ padding: '20px', border: '2px solid red', background: '#ffe6e6' }}>
                <h2>❌ Erro: Funnel não carregado</h2>
                <p>O funnel não foi carregado corretamente pelo contexto.</p>
            </div>
        );
    }

    const currentStep = funnel.steps[currentStepIndex] || funnel.steps[0];
    const stepData = currentStep || { id: 'default', type: 'intro', title: '', components: [] };

    // Tipos de componentes disponíveis para adicionar
    const componentTypes = [
        { type: 'intro', name: 'Introdução', icon: '🏠', stepType: 'intro' },
        { type: 'question', name: 'Pergunta', icon: '❓', stepType: 'question' },
        { type: 'strategic-question', name: 'Pergunta Estratégica', icon: '🎯', stepType: 'strategic-question' },
        { type: 'transition', name: 'Transição', icon: '➡️', stepType: 'transition' },
        { type: 'result', name: 'Resultado', icon: '🎉', stepType: 'result' },
        { type: 'offer', name: 'Oferta', icon: '💰', stepType: 'offer' }
    ];

    // Renderizar componente editável baseado no tipo
    const renderEditableComponent = () => {
        const componentProps = {
            data: stepData,
            isEditable: isEditMode,
            isSelected: true,
            onUpdate: (updates: any) => {
                if (selectedComponent) {
                    updateComponent(selectedComponent.id, updates);
                }
            },
            onSelect: () => selectComponent(stepData),
            onDuplicate: () => {
                if (selectedComponent) {
                    duplicateComponent(selectedComponent.id);
                }
            },
            onDelete: () => {
                if (selectedComponent) {
                    deleteComponent(selectedComponent.id);
                }
            },
            onMoveUp: () => console.log('Move up'),
            onMoveDown: () => console.log('Move down'),
            canMoveUp: currentStepIndex > 0,
            canMoveDown: currentStepIndex < funnel.steps.length - 1,
            canDelete: funnel.steps.length > 1,
            blockId: stepData.id,
            onPropertyClick: (propKey: string, element: HTMLElement) => {
                console.log('Property clicked:', propKey, element);
            }
        };

        switch (stepData.type) {
            case 'intro':
                return <EditableIntroStep {...componentProps} />;
            case 'question':
                return <EditableQuestionStep {...componentProps} />;
            case 'strategic-question':
                return <EditableStrategicQuestionStep {...componentProps} />;
            case 'transition':
            case 'transition-result':
                return <EditableTransitionStep {...componentProps} />;
            case 'result':
                return <EditableResultStep {...componentProps} />;
            case 'offer':
                return <EditableOfferStep {...componentProps} />;
            default:
                return (
                    <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
                        <p>Tipo de step não reconhecido: {stepData.type}</p>
                    </div>
                );
        }
    };

    const mainStyle = {
        display: 'flex',
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: 'hsl(var(--background))'
    };

    const columnStyle = {
        background: 'hsl(var(--card))',
        borderRight: '1px solid hsl(var(--border))',
        display: 'flex',
        flexDirection: 'column' as const
    };

    const headerStyle = {
        padding: '16px',
        borderBottom: '1px solid hsl(var(--border))',
        background: 'hsl(var(--muted))'
    };

    return (
        <div style={mainStyle}>
            {/* COLUNA 1: ETAPAS (250px) */}
            <div style={{ ...columnStyle, width: '250px' }}>
                <div style={headerStyle}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: 'hsl(var(--foreground))' }}>
                        📋 Etapas ({funnel.steps.length})
                    </h3>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                    {funnel.steps.map((step, index) => (
                        <button
                            key={step.id}
                            onClick={() => setCurrentStepIndex(index)}
                            style={{
                                width: '100%',
                                padding: '12px 8px',
                                margin: '4px 0',
                                background: currentStepIndex === index ? 'hsl(var(--primary))' : 'hsl(var(--card))',
                                color: currentStepIndex === index ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div style={{ fontWeight: 'bold' }}>Etapa {index + 1}</div>
                            <div style={{ fontSize: '12px', opacity: 0.8 }}>
                                {step.title || step.name || `Etapa ${index + 1}`}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* COLUNA 2: COMPONENTES (280px) */}
            <div style={{ ...columnStyle, width: '280px' }}>
                <div style={headerStyle}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: 'hsl(var(--foreground))' }}>
                        🧩 Componentes
                    </h3>
                </div>
                <div style={{ padding: '16px' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <button
                            onClick={() => setIsEditMode(!isEditMode)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: isEditMode ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                                color: isEditMode ? 'hsl(var(--primary-foreground))' : 'hsl(var(--secondary-foreground))',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }}
                        >
                            {isEditMode ? '✏️ Modo Edição' : '👁️ Modo Preview'}
                        </button>
                    </div>

                    <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid hsl(var(--border))' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold', color: 'hsl(var(--muted-foreground))' }}>
                            TIPOS DE ETAPA
                        </p>
                        {componentTypes.map((compType) => (
                            <button
                                key={compType.type}
                                onClick={() => {
                                    addComponent(currentStep.id, {
                                        type: compType.stepType as any,
                                        props: {
                                            title: compType.name,
                                            text: `Nova etapa do tipo ${compType.name}`
                                        },
                                        style: {}
                                    });
                                }}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    margin: '4px 0',
                                    background: 'hsl(var(--card))',
                                    color: 'hsl(var(--foreground))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: '14px',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <span>{compType.icon}</span>
                                <span>{compType.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* COLUNA 3: CANVAS (flex) */}
            <div style={{ ...columnStyle, flex: 1, borderRight: 'none' }}>
                <div style={headerStyle}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: 'hsl(var(--foreground))' }}>
                        🎨 Canvas - {stepData.title || stepData.name || `Etapa ${currentStepIndex + 1}`}
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                        Tipo: {stepData.type}
                    </p>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: 'hsl(var(--muted) / 0.3)' }}>
                    <div style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        background: 'hsl(var(--card))',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        overflow: 'hidden'
                    }}>
                        {renderEditableComponent()}
                    </div>
                </div>
            </div>

            {/* COLUNA 4: PROPRIEDADES (320px) */}
            <div style={{ ...columnStyle, width: '320px', borderRight: 'none' }}>
                <div style={headerStyle}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: 'hsl(var(--foreground))' }}>
                        ⚙️ Propriedades
                    </h3>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <DynamicPropertiesPanel
                        selectedStep={stepData}
                        onUpdate={(updates) => {
                            if (selectedComponent) {
                                updateComponent(selectedComponent.id, updates);
                            }
                        }}
                        onDelete={() => {
                            if (selectedComponent && funnel.steps.length > 1) {
                                deleteComponent(selectedComponent.id);
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default EditableStepsEditor;
