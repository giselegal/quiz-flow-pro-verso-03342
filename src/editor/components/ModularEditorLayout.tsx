/**
 * 🎨 MODULAR EDITOR LAYOUT - Layout 4 Colunas com Sistema Modular
 * 
 * Layout principal do editor com:
 * - Sidebar esquerda: Lista de etapas (21 steps)
 * - Centro: StepCanvas (preview dos blocos)
 * - Direita: PropertiesPanel (edição de propriedades)
 * 
 * Substitui o QuizFunnelEditorSimplified com arquitetura modular.
 */

import React, { useState, useEffect } from 'react';
import { useUnifiedCRUD } from '@/contexts';
import StepCanvas from './StepCanvas';
import PropertiesPanel from './PropertiesPanel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
    Save,
    Eye,
    Rocket,
    ChevronRight,
    CheckCircle2,
    Circle,
    AlertCircle
} from 'lucide-react';
import type { QuizStep } from '@/data/quizSteps';

// ✅ Mesmo tipo usado no QuizFunnelEditorWYSIWYG
type EditableQuizStep = QuizStep & { id: string };

const STEP_LABELS = [
    { index: 0, label: 'Introdução', icon: '👋', category: 'intro' },
    { index: 1, label: 'Pergunta 1', icon: '❓', category: 'questions' },
    { index: 2, label: 'Pergunta 2', icon: '❓', category: 'questions' },
    { index: 3, label: 'Pergunta 3', icon: '❓', category: 'questions' },
    { index: 4, label: 'Pergunta 4', icon: '❓', category: 'questions' },
    { index: 5, label: 'Pergunta 5', icon: '❓', category: 'questions' },
    { index: 6, label: 'Pergunta 6', icon: '❓', category: 'questions' },
    { index: 7, label: 'Pergunta 7', icon: '❓', category: 'questions' },
    { index: 8, label: 'Pergunta 8', icon: '❓', category: 'questions' },
    { index: 9, label: 'Pergunta 9', icon: '❓', category: 'questions' },
    { index: 10, label: 'Pergunta 10', icon: '❓', category: 'questions' },
    { index: 11, label: 'Transição 1', icon: '⏳', category: 'transition' },
    { index: 12, label: 'Pergunta Estratégica 1', icon: '🎯', category: 'strategic' },
    { index: 13, label: 'Pergunta Estratégica 2', icon: '🎯', category: 'strategic' },
    { index: 14, label: 'Pergunta Estratégica 3', icon: '🎯', category: 'strategic' },
    { index: 15, label: 'Pergunta Estratégica 4', icon: '🎯', category: 'strategic' },
    { index: 16, label: 'Pergunta Estratégica 5', icon: '🎯', category: 'strategic' },
    { index: 17, label: 'Pergunta Estratégica 6', icon: '🎯', category: 'strategic' },
    { index: 18, label: 'Transição 2', icon: '⏳', category: 'transition' },
    { index: 19, label: 'Resultado', icon: '🎉', category: 'result' },
    { index: 20, label: 'Oferta', icon: '💰', category: 'offer' }
];

const ModularEditorLayout: React.FC = () => {
    // 🎯 USAR MESMA ESTRUTURA DO QuizFunnelEditorWYSIWYG
    const crud = useUnifiedCRUD();
    const [steps, setSteps] = useState<EditableQuizStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // ✅ Carregar steps do CRUD (igual ao QuizFunnelEditorWYSIWYG)
    useEffect(() => {
        const existing = (crud.currentFunnel as any)?.quizSteps as EditableQuizStep[] | undefined;

        console.log('🔍 DEBUG - crud.currentFunnel:', crud.currentFunnel);
        console.log('🔍 DEBUG - quizSteps:', existing);

        if (existing && existing.length) {
            setSteps(existing.map(s => ({ ...s })));
            console.log('✅ Carregou', existing.length, 'steps do banco');
        } else {
            console.warn('⚠️ Nenhum step encontrado em crud.currentFunnel.quizSteps');
        }
    }, [crud.currentFunnel]);

    const currentStep = steps[currentStepIndex];

    // Handlers
    const handleSave = async () => {
        if (!crud.currentFunnel) return;

        try {
            setIsSaving(true);
            const updated = { ...crud.currentFunnel, quizSteps: steps };
            crud.setCurrentFunnel(updated);
            await crud.saveFunnel(updated);
            console.log('✅ Steps salvos com sucesso');
        } catch (error) {
            console.error('❌ Erro ao salvar:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleStepSelect = (stepIndex: number) => {
        setCurrentStepIndex(stepIndex);
        setSelectedBlockId(null);
    };

    const handleBlockSelect = (blockId: string) => {
        setSelectedBlockId(blockId);
    };

    const handlePreview = () => {
        console.log('Preview not implemented yet');
    };

    const handlePublish = async () => {
        console.log('Publish not implemented yet');
    };

    // Loading state
    if (!crud.currentFunnel) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <p className="font-medium">Carregando funil...</p>
                </div>
            </div>
        );
    }

    // Empty state
    if (steps.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <p className="font-medium">Nenhuma etapa encontrada</p>
                    <p className="text-sm mt-2">O funil não possui steps definidos</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full bg-gray-50">
            {/* LEFT SIDEBAR - Steps List */}
            <div className="w-64 border-r bg-white flex flex-col">
                {/* Header */}
                <div className="p-4 border-b">
                    <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Funil 21 Etapas
                    </h2>
                    <p className="text-xs text-gray-500">
                        Selecione uma etapa para editar
                    </p>
                </div>

                {/* Steps List */}
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {STEP_LABELS.map(({ index, label, icon, category }) => {
                            const isActive = index === currentStepIndex;
                            const isCompleted = false; // TODO: Check if step has all required content

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleStepSelect(index)}
                                    className={cn(
                                        "w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors",
                                        isActive
                                            ? "bg-blue-50 text-blue-900 border border-blue-200"
                                            : "hover:bg-gray-100 text-gray-700"
                                    )}
                                >
                                    <span className="text-lg">{icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-medium truncate">
                                            {label}
                                        </div>
                                        <div className="text-[10px] text-gray-500">
                                            Step {index + 1}
                                        </div>
                                    </div>
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    ) : (
                                        <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                                    )}
                                    {isActive && (
                                        <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </ScrollArea>

                {/* Footer Actions */}
                <div className="p-3 border-t bg-gray-50 space-y-2">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        size="sm"
                        className="w-full h-8"
                    >
                        <Save className="w-3 h-3 mr-1" />
                        {isSaving ? 'Salvando...' : 'Salvar'}
                    </Button>

                    <div className="flex gap-2">
                        <Button
                            onClick={handlePreview}
                            size="sm"
                            variant="outline"
                            className="flex-1 h-8"
                        >
                            <Eye className="w-3 h-3 mr-1" />
                            Preview
                        </Button>
                        <Button
                            onClick={handlePublish}
                            size="sm"
                            variant="outline"
                            className="flex-1 h-8"
                        >
                            <Rocket className="w-3 h-3 mr-1" />
                            Publicar
                        </Button>
                    </div>
                </div>
            </div>

            {/* CENTER - Canvas */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="px-6 py-3 border-b bg-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                                {STEP_LABELS[currentStepIndex]?.label || `Step ${currentStepIndex + 1}`}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Clique em um bloco para editar suas propriedades
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                                Step {currentStepIndex + 1} de {steps.length}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 overflow-auto">
                    <StepCanvas
                        stepIndex={currentStepIndex}
                        onSelectBlock={handleBlockSelect}
                        selectedBlockId={selectedBlockId}
                    />
                </div>
            </div>

            {/* RIGHT SIDEBAR - Properties Panel */}
            <PropertiesPanel
                blockId={selectedBlockId}
                stepIndex={currentStepIndex}
                onClose={() => setSelectedBlockId(null)}
            />
        </div>
    );
};

export default ModularEditorLayout;
