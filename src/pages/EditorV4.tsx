/**
 * 🎯 EDITOR V4 PAGE
 * 
 * Página do editor usando estrutura v4
 * Carrega quiz21-v4.json e valida com Zod
 * 
 * FASE 4: Integração Editor
 */

import React, { useState, useCallback } from 'react';
import { QuizV4Provider, useQuizV4 } from '@/contexts/quiz/QuizV4Provider';
import { BlockRendererV4 } from '@/components/quiz/BlockRendererV4';
import { PropertiesPanelV4 } from '@/components/editor/PropertiesPanelV4';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
    ChevronLeft,
    ChevronRight,
    Save,
    Eye,
    Settings,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// EDITOR LAYOUT
// ============================================================================

function EditorLayoutV4() {
    const context = useQuizV4();
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);

    // Safety check
    if (!context) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                    <p className="text-lg font-semibold">Erro ao carregar contexto</p>
                    <p className="text-sm text-gray-500">QuizV4Provider não encontrado</p>
                </div>
            </div>
        );
    }

    const { state, getAllSteps, goToStep } = context;
    const { currentStep, isLoading, error, quiz } = state;
    const allSteps = getAllSteps();

    /**
     * Handle block selection
     */
    const handleBlockSelect = useCallback((blockId: string) => {
        setSelectedBlockId(blockId);
        setShowPropertiesPanel(true);
    }, []);

    /**
     * Handle block update
     */
    const handleBlockUpdate = useCallback((blockId: string, updates: any) => {
        console.log('Block update:', blockId, updates);
        // Updates are handled by PropertiesPanelV4
    }, []);

    /**
     * Handle block delete
     */
    const handleBlockDelete = useCallback((blockId: string) => {
        console.log('Block delete:', blockId);
        setSelectedBlockId(null);
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
                    <p className="text-gray-600">Carregando editor v4...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="max-w-md p-6 bg-red-50 rounded-lg">
                    <AlertCircle className="h-8 w-8 text-red-600 mb-4" />
                    <h2 className="text-lg font-semibold text-red-900 mb-2">
                        Erro ao carregar editor
                    </h2>
                    <p className="text-sm text-red-700">{error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Top Bar */}
            <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-semibold">Editor v4</h1>
                    <Badge variant="outline" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Zod Validado
                    </Badge>
                    {quiz && (
                        <span className="text-sm text-gray-600">
                            {quiz.metadata.name} v{quiz.version}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                    </Button>
                    <Button size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Steps */}
                <div className="w-64 bg-white border-r flex flex-col">
                    <div className="p-4 border-b">
                        <h2 className="font-semibold text-sm">Steps</h2>
                        <p className="text-xs text-gray-500 mt-1">
                            {allSteps.length} etapas
                        </p>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            {allSteps.map((step) => (
                                <button
                                    key={step.id}
                                    onClick={() => goToStep(step.id)}
                                    className={cn(
                                        'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                                        currentStep?.id === step.id
                                            ? 'bg-indigo-50 text-indigo-900 font-medium'
                                            : 'hover:bg-gray-50'
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{step.id}</span>
                                        <Badge variant="outline" className="text-xs">
                                            {step.blocks.length}
                                        </Badge>
                                    </div>
                                    {step.title && (
                                        <p className="text-xs text-gray-500 mt-1 truncate">
                                            {step.title}
                                        </p>
                                    )}
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Editor Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Step Header */}
                    <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h3 className="font-medium">{currentStep?.id}</h3>
                            <Badge>{currentStep?.type}</Badge>
                            <span className="text-sm text-gray-500">
                                {currentStep?.blocks.length} blocos
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPropertiesPanel(!showPropertiesPanel)}
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Canvas */}
                    <ScrollArea className="flex-1 bg-gray-50">
                        <div className="max-w-4xl mx-auto p-8">
                            {currentStep ? (
                                <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
                                    {currentStep.blocks.map((block) => (
                                        <div
                                            key={block.id}
                                            onClick={() => handleBlockSelect(block.id)}
                                            className={cn(
                                                'relative rounded-lg border-2 transition-all cursor-pointer',
                                                selectedBlockId === block.id
                                                    ? 'border-indigo-500 ring-2 ring-indigo-200'
                                                    : 'border-transparent hover:border-gray-300'
                                            )}
                                        >
                                            <BlockRendererV4
                                                block={block}
                                                stepId={currentStep.id}
                                                isEditable={true}
                                                onUpdate={handleBlockUpdate}
                                                onDelete={handleBlockDelete}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    Selecione um step para editar
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Right Sidebar - Properties */}
                {showPropertiesPanel && (
                    <div className="w-80 bg-white border-l">
                        <PropertiesPanelV4
                            blockId={selectedBlockId}
                            stepId={currentStep?.id || 'step-01'}
                            onClose={() => setShowPropertiesPanel(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT WITH PROVIDER
// ============================================================================

export function EditorV4() {
    return (
        <QuizV4Provider templatePath="/templates/quiz21-v4.json">
            <EditorLayoutV4 />
        </QuizV4Provider>
    );
}
