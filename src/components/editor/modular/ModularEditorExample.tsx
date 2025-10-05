/**
 * 🚀 EXEMPLO DE USO DO SISTEMA MODULAR
 * 
 * Demonstração de como integrar o editor modular
 */

import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { QuizEditorProvider } from '@/context/QuizEditorContext';
import { editorTheme } from '@/theme/editor-theme';
import ModularEditor from './ModularEditor';
import { ModularQuizStep, ModularFunnel } from '@/types/modular-editor';

// Exemplo de funil com etapas modulares
const exampleFunnel: ModularFunnel = {
    id: 'funnel_exemplo',
    title: 'Quiz Modular de Exemplo',
    description: 'Demonstração do sistema modular',
    steps: [
        {
            id: 'step_intro',
            title: 'Introdução',
            type: 'intro',
            order: 1,
            components: [
                {
                    id: 'header_1',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: true,
                        progressColor: 'brand',
                        allowReturn: false,
                    },
                    style: {},
                },
                {
                    id: 'title_1',
                    type: 'title',
                    props: {
                        text: 'Bem-vindo ao Quiz Modular!',
                        fontSize: '2xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'gray.800',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'text_1',
                    type: 'text',
                    props: {
                        text: 'Este é um exemplo de como o sistema modular funciona. Cada componente pode ser editado, movido ou removido facilmente.',
                        fontSize: 'md',
                        textAlign: 'center',
                        color: 'gray.600',
                    },
                    style: {
                        marginBottom: '8',
                    },
                },
                {
                    id: 'button_1',
                    type: 'button',
                    props: {
                        text: 'Começar Quiz',
                        variant: 'solid',
                        colorScheme: 'brand',
                        size: 'lg',
                        isFullWidth: false,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: true,
                autoAdvance: false,
                timeLimit: 0,
            },
        },
        {
            id: 'step_question_1',
            title: 'Pergunta 1',
            type: 'question',
            order: 2,
            components: [
                {
                    id: 'header_2',
                    type: 'header',
                    props: {
                        showLogo: true,
                        logoUrl: '/logo.png',
                        showProgress: true,
                        progressColor: 'brand',
                        allowReturn: true,
                        returnText: 'Voltar',
                    },
                    style: {},
                },
                {
                    id: 'title_2',
                    type: 'title',
                    props: {
                        text: 'Qual é a sua cor favorita?',
                        fontSize: 'xl',
                        fontWeight: 'semibold',
                        textAlign: 'center',
                        color: 'gray.800',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'image_1',
                    type: 'image',
                    props: {
                        src: 'https://via.placeholder.com/400x200/colorful/fff?text=Cores',
                        alt: 'Paleta de cores',
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: 'md',
                    },
                    style: {
                        marginBottom: '6',
                    },
                },
                {
                    id: 'options_1',
                    type: 'options-grid',
                    props: {
                        options: [
                            { id: 'red', text: '🔴 Vermelho', value: 'red' },
                            { id: 'blue', text: '🔵 Azul', value: 'blue' },
                            { id: 'green', text: '🟢 Verde', value: 'green' },
                            { id: 'yellow', text: '🟡 Amarelo', value: 'yellow' },
                        ],
                        columns: 2,
                        gap: 4,
                        optionStyle: 'button',
                        allowMultipleSelection: false,
                    },
                    style: {},
                },
            ],
            settings: {
                allowSkip: false,
                showProgress: true,
                autoAdvance: false,
                timeLimit: 0,
            },
        },
    ],
    settings: {
        showProgressBar: true,
        allowBackNavigation: true,
        shuffleQuestions: false,
        showResults: true,
        collectEmail: false,
        collectName: false,
    },
    metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0',
        createdBy: 'sistema_modular',
    },
};

export const ModularEditorExample: React.FC = () => {
    const [currentStepId, setCurrentStepId] = useState('step_intro');
    const [showEditor, setShowEditor] = useState(true);

    const handleSave = (step: ModularQuizStep) => {
        console.log('💾 Etapa salva:', step);
        // Aqui você implementaria a lógica de salvamento
        // Por exemplo, enviar para uma API ou salvar no localStorage
    };

    const handlePreview = (step: ModularQuizStep) => {
        console.log('👁️ Preview da etapa:', step);
        // Aqui você implementaria a lógica de preview
        // Por exemplo, abrir em uma nova aba ou modal
    };

    const handleBack = () => {
        setShowEditor(false);
        // Aqui você voltaria para a lista de etapas ou dashboard
    };

    if (!showEditor) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>📋 Dashboard do Quiz</h2>
                <p>Aqui estaria o dashboard principal do quiz.</p>
                <button
                    onClick={() => setShowEditor(true)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#0090ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginTop: '20px',
                    }}
                >
                    ✏️ Editar Etapa de Introdução
                </button>
            </div>
        );
    }

    return (
        <ChakraProvider theme={editorTheme}>
            <QuizEditorProvider initialFunnel={exampleFunnel}>
                <ModularEditor
                    stepId={currentStepId}
                    onSave={handleSave}
                    onPreview={handlePreview}
                    onBack={handleBack}
                />
            </QuizEditorProvider>
        </ChakraProvider>
    );
};

// Componente para demonstrar o uso em uma página Next.js
export const ModularEditorPage: React.FC = () => {
    return (
        <div>
            {/* 
        Para usar em uma página Next.js, adicione ao seu pages/editor/modular.tsx:
        
        import { ModularEditorExample } from '@/components/editor/modular/ModularEditorExample';
        
        export default function ModularEditorPage() {
          return <ModularEditorExample />;
        }
      */}
            <ModularEditorExample />
        </div>
    );
};

// Hook para facilitar o uso do editor modular
export const useModularEditor = () => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [currentStepId, setCurrentStepId] = useState<string>('');

    const openEditor = (stepId: string) => {
        setCurrentStepId(stepId);
        setIsEditorOpen(true);
    };

    const closeEditor = () => {
        setIsEditorOpen(false);
        setCurrentStepId('');
    };

    const renderEditor = (props?: {
        onSave?: (step: ModularQuizStep) => void;
        onPreview?: (step: ModularQuizStep) => void;
    }) => {
        if (!isEditorOpen || !currentStepId) return null;

        return (
            <ModularEditor
                stepId={currentStepId}
                onSave={props?.onSave}
                onPreview={props?.onPreview}
                onBack={closeEditor}
            />
        );
    };

    return {
        isEditorOpen,
        currentStepId,
        openEditor,
        closeEditor,
        renderEditor,
    };
};

export default ModularEditorExample;