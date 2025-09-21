import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Block, BlockType } from '../../types/editor';

// Interface para estado do SimpleBuilder
export interface SimpleBuilderState {
    steps: Record<string, Block[]>;
    currentStep: number;
    totalSteps: number;
    isLoading: boolean;
    score: number;
    responses: Record<string, any>;
    stepValidation: Record<number, boolean>;
}

// Interface para ações do SimpleBuilder
export interface SimpleBuilderActions {
    goToStep: (step: number) => void;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    updateBlock: (stepKey: string, blockId: string, updates: Partial<Block>) => void;
    addBlock: (stepKey: string, block: Block) => void;
    removeBlock: (stepKey: string, blockId: string) => void;
    updateResponse: (stepKey: string, response: any) => void;
    setStepValid: (step: number, isValid: boolean) => void;
    exportJSON: () => string;
    importJSON: (json: string) => void;

    // Compatibility with EditorProvider
    canUndo: boolean;
    canRedo: boolean;
    undo: () => void;
    redo: () => void;
    addBlockAtIndex: (stepKey: string, block: Block, index: number) => Promise<void>;
    reorderBlocks: (stepKey: string, oldIndex: number, newIndex: number) => Promise<void>;
    loadDefaultTemplate: () => void;
    
    // AI Integration
    loadTemplate: (templateId: string) => Promise<void>;
    applyAISteps: (steps: any[]) => void;
}

export interface SimpleBuilderContextValue {
    state: SimpleBuilderState;
    actions: SimpleBuilderActions;
}

const SimpleBuilderContext = createContext<SimpleBuilderContextValue | undefined>(undefined);

export const useSimpleBuilder = () => {
    const context = useContext(SimpleBuilderContext);
    if (!context) {
        throw new Error('useSimpleBuilder must be used within SimpleBuilderProvider');
    }
    return context;
};

// 🎯 GERAÇÃO INLINE DAS 21 ETAPAS - VERSÃO SIMPLES E VÁLIDA
const generate21StepsSimple = (): Record<string, Block[]> => {
    console.log('🏗️ Generating 21 simplified steps...');

    const steps: Record<string, Block[]> = {};

    // Gerar 21 etapas simples com tipos válidos
    for (let i = 1; i <= 21; i++) {
        steps[`step-${i}`] = [
            {
                id: `step${i}-header`,
                type: 'headline' as BlockType,
                order: 1,
                properties: {
                    stepNumber: i,
                    stepType: i === 1 ? 'intro' : i <= 11 ? 'question' : i === 12 ? 'result' : 'offer',
                    required: true
                },
                content: {
                    text: `Etapa ${i}`,
                    level: 2,
                    align: 'center'
                }
            },
            {
                id: `step${i}-content`,
                type: 'text' as BlockType,
                order: 2,
                properties: {
                    stepNumber: i,
                    contentType: 'description'
                },
                content: {
                    text: i === 1 ? 'Vamos começar com algumas perguntas!' :
                        i <= 11 ? `Pergunta ${i - 1}: Qual sua preferência?` :
                            i === 12 ? 'Seus resultados estão prontos!' :
                                i <= 16 ? `Oferta ${i - 12}: Produto personalizado` :
                                    `Configuração ${i - 16}: Ajustes finais`,
                    fontSize: '16px',
                    textAlign: 'center'
                }
            }
        ];

        // Adicionar botão para navegação
        if (i < 21) {
            steps[`step-${i}`].push({
                id: `step${i}-button`,
                type: 'button' as BlockType,
                order: 3,
                properties: {
                    action: 'next-step',
                    variant: 'primary'
                },
                content: {
                    text: i === 1 ? 'Começar' : i <= 11 ? 'Próxima' : i === 12 ? 'Ver Ofertas' : 'Continuar',
                    url: '#',
                    variant: 'primary',
                    size: 'medium'
                }
            });
        }
    }

    console.log(`✅ Generated ${Object.keys(steps).length} steps successfully`);
    return steps;
};

export const SimpleBuilderProvider: React.FC<{ children: React.ReactNode; funnelId?: string }> = ({
    children,
    funnelId
}) => {
    console.log('🚀 SimpleBuilderProvider initializing with funnelId:', funnelId);

    // Estado inicial
    const [state, setState] = useState<SimpleBuilderState>(() => ({
        steps: generate21StepsSimple(),
        currentStep: 1,
        totalSteps: 21,
        isLoading: false,
        score: 0,
        responses: {},
        stepValidation: {}
    }));

    // Ações do Builder
    const actions: SimpleBuilderActions = {
        goToStep: useCallback((step: number) => {
            setState(prev => {
                const max = prev.totalSteps || Object.keys(prev.steps).length || 1;
                const clamped = Math.max(1, Math.min(max, step));
                console.log(`📍 Navigated to step ${clamped} (requested: ${step}, max: ${max})`);
                return { ...prev, currentStep: clamped };
            });
        }, []),

        goToNextStep: useCallback(() => {
            setState(prev => {
                const max = prev.totalSteps || Object.keys(prev.steps).length || 1;
                const nextStep = Math.min(prev.currentStep + 1, max);
                console.log(`➡️ Next step: ${nextStep} (max: ${max})`);
                return { ...prev, currentStep: nextStep };
            });
        }, []),

        goToPreviousStep: useCallback(() => {
            setState(prev => {
                const prevStep = Math.max(prev.currentStep - 1, 1);
                console.log(`⬅️ Previous step: ${prevStep}`);
                return { ...prev, currentStep: prevStep };
            });
        }, []),

        updateBlock: useCallback((stepKey: string, blockId: string, updates: Partial<Block>) => {
            setState(prev => ({
                ...prev,
                steps: {
                    ...prev.steps,
                    [stepKey]: prev.steps[stepKey]?.map(block =>
                        block.id === blockId ? { ...block, ...updates } : block
                    ) || []
                }
            }));
            console.log(`🔄 Updated block ${blockId} in ${stepKey}`);
        }, []),

        addBlock: useCallback((stepKey: string, block: Block) => {
            setState(prev => ({
                ...prev,
                steps: {
                    ...prev.steps,
                    [stepKey]: [...(prev.steps[stepKey] || []), block]
                }
            }));
            console.log(`➕ Added block ${block.id} to ${stepKey}`);
        }, []),

        removeBlock: useCallback((stepKey: string, blockId: string) => {
            setState(prev => ({
                ...prev,
                steps: {
                    ...prev.steps,
                    [stepKey]: prev.steps[stepKey]?.filter(block => block.id !== blockId) || []
                }
            }));
            console.log(`🗑️ Removed block ${blockId} from ${stepKey}`);
        }, []),

        updateResponse: useCallback((stepKey: string, response: any) => {
            setState(prev => ({
                ...prev,
                responses: { ...prev.responses, [stepKey]: response }
            }));
            console.log(`💾 Saved response for ${stepKey}:`, response);
        }, []),

        setStepValid: useCallback((step: number, isValid: boolean) => {
            setState(prev => ({
                ...prev,
                stepValidation: { ...prev.stepValidation, [step]: isValid }
            }));
        }, []),

        exportJSON: useCallback(() => {
            const exportData = { ...state, timestamp: new Date().toISOString() };
            return JSON.stringify(exportData, null, 2);
        }, [state]),

        importJSON: useCallback((json: string) => {
            try {
                const importedData = JSON.parse(json);
                setState(importedData);
                console.log('📥 Data imported successfully');
            } catch (error) {
                console.error('❌ Failed to import data:', error);
            }
        }, []),

        // Compatibility methods
        canUndo: false,
        canRedo: false,
        undo: () => console.log('⏪ Undo action'),
        redo: () => console.log('⏩ Redo action'),
        addBlockAtIndex: async (stepKey: string, block: Block, index: number) => {
            setState(prev => {
                const stepBlocks = [...(prev.steps[stepKey] || [])];
                stepBlocks.splice(index, 0, block);
                return {
                    ...prev,
                    steps: { ...prev.steps, [stepKey]: stepBlocks }
                };
            });
        },
        reorderBlocks: async (stepKey: string, oldIndex: number, newIndex: number) => {
            setState(prev => {
                const stepBlocks = [...(prev.steps[stepKey] || [])];
                const [movedBlock] = stepBlocks.splice(oldIndex, 1);
                stepBlocks.splice(newIndex, 0, movedBlock);
                return {
                    ...prev,
                    steps: { ...prev.steps, [stepKey]: stepBlocks }
                };
            });
        },
        loadDefaultTemplate: () => {
            const newSteps = generate21StepsSimple();
            setState(prev => ({
                ...prev,
                steps: newSteps,
                totalSteps: Object.keys(newSteps).length
            }));
        },
        
        // AI Integration methods
        loadTemplate: async (templateId: string) => {
            console.log('🤖 Loading AI template:', templateId);
            try {
                // Import template service
                const { templateLibraryService } = await import('@/services/templateLibraryService');
                const template = templateLibraryService.getById(templateId);
                
                if (template && template.steps) {
                    const convertedSteps: Record<string, Block[]> = {};
                    
                    // Handle different template structures
                    if (Array.isArray(template.steps)) {
                        template.steps.forEach((step: any, index: number) => {
                            const stepKey = `step-${index + 1}`;
                            convertedSteps[stepKey] = step.blocks || [];
                        });
                    } else if (typeof template.steps === 'object') {
                        // Handle object-based steps structure
                        Object.entries(template.steps).forEach(([key, blocks]) => {
                            convertedSteps[key] = Array.isArray(blocks) ? blocks : [];
                        });
                    }
                    
                    setState(prev => ({
                        ...prev,
                        steps: convertedSteps,
                        totalSteps: Array.isArray(template.steps) ? template.steps.length : Object.keys(template.steps).length
                    }));
                    
                    console.log('✅ Template loaded successfully:', templateId);
                } else {
                    console.warn('⚠️ Template not found:', templateId);
                }
            } catch (error) {
                console.error('❌ Failed to load template:', error);
            }
        },
        
        applyAISteps: (steps: any[]) => {
            console.log('🤖 Applying AI generated steps:', steps);
            
            const convertedSteps: Record<string, Block[]> = {};
            
            steps.forEach((step, index) => {
                const stepKey = `step-${index + 1}`;
                
                // Convert AI step to blocks
                const blocks: Block[] = [];
                
                if (step.title) {
                    blocks.push({
                        id: `${stepKey}-title`,
                        type: 'headline' as BlockType,
                        order: 1,
                        properties: { stepNumber: index + 1 },
                        content: { text: step.title, level: 2, align: 'center' }
                    });
                }
                
                if (step.content || step.description) {
                    blocks.push({
                        id: `${stepKey}-content`,
                        type: 'text' as BlockType,
                        order: 2,
                        properties: { stepNumber: index + 1 },
                        content: { text: step.content || step.description, textAlign: 'center' }
                    });
                }
                
                if (step.options && Array.isArray(step.options)) {
                    blocks.push({
                        id: `${stepKey}-options`,
                        type: 'options-grid' as BlockType,
                        order: 3,
                        properties: { 
                            stepNumber: index + 1,
                            columns: 2,
                            options: step.options.map((opt: any, optIndex: number) => ({
                                id: `option-${optIndex + 1}`,
                                text: typeof opt === 'string' ? opt : opt.text || opt.label,
                                value: typeof opt === 'string' ? opt.toLowerCase() : opt.value,
                                category: step.category || 'default'
                            }))
                        },
                        content: { title: step.question || 'Escolha uma opção:' }
                    });
                }
                
                convertedSteps[stepKey] = blocks;
            });
            
            setState(prev => ({
                ...prev,
                steps: convertedSteps,
                totalSteps: steps.length
            }));
            
            console.log('✅ AI steps applied successfully');
        }
    };

    // Log do estado atual
    useEffect(() => {
        console.log('📊 SimpleBuilder State Update:', {
            currentStep: state.currentStep,
            totalSteps: state.totalSteps,
            availableSteps: Object.keys(state.steps).length,
            responses: Object.keys(state.responses).length
        });
    }, [state.currentStep, state.steps, state.responses]);

    const contextValue: SimpleBuilderContextValue = {
        state,
        actions
    };

    return (
        <SimpleBuilderContext.Provider value={contextValue}>
            {children}
        </SimpleBuilderContext.Provider>
    );
};

export default SimpleBuilderProvider;