/**
 * 🚀 HYBRID MODULAR EDITOR PRO - O MELHOR DOS DOIS MUNDOS
 * 
 * Combina:
 * ✅ ModularEditorPro: Layout 4 colunas + APIPropertiesPanel + Performance
 * ✅ ModernUnifiedEditor: IA Assistant + CRUD + Toolbar Moderna + Status Bar
 * 
 * Resultado: Editor definitivo com todas as funcionalidades premium
 */

import React, { useCallback, useMemo, useState, useRef, useContext } from 'react';
import { EditorContext } from '@/context/EditorContext';
// import { useOptimizedScheduler } from '@/hooks/useOptimizedScheduler'; // TODO: Implementar scheduler
import { useNotification } from '@/components/ui/Notification';
import { Block } from '@/types/editor';

// 🎯 BASE: Componentes do ModularEditorPro
import EditorCanvas from './EditorCanvas';
import StepSidebar from '@/components/editor/sidebars/StepSidebar';
import ComponentsSidebar from '@/components/editor/sidebars/ComponentsSidebar';
import RegistryPropertiesPanel from '@/components/universal/RegistryPropertiesPanel';
import APIPropertiesPanel from '@/components/editor/properties/APIPropertiesPanel';

// 🚀 PREMIUM: Funcionalidades do ModernUnifiedEditor
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
    Brain, Target, Save,
    Component, Crown, Eye, Activity,
    Plus, Copy
} from 'lucide-react';

// 🧠 IA e CRUD Integration
// import { useUnifiedCRUD } from '@/context/UnifiedCRUDProvider'; // TODO: Implementar CRUD

// ===== INTERFACES =====

interface HybridModularEditorProProps {
    funnelId?: string;
    showProFeatures?: boolean;
    enableAI?: boolean;
    enableCRUD?: boolean;
    className?: string;
}

type EditorMode = 'visual' | 'builder' | 'funnel' | 'headless';

interface HybridEditorState {
    mode: EditorMode;
    aiAssistantActive: boolean;
    previewMode: boolean;
    showStatusBar: boolean;
}

// ===== HYBRID TOOLBAR COMPONENT =====

interface HybridToolbarProps {
    editorState: HybridEditorState;
    onStateChange: (updates: Partial<HybridEditorState>) => void;
    funnelId?: string;
    onSave?: () => Promise<void>;
    onCreateNew?: () => Promise<void>;
    onDuplicate?: () => Promise<void>;
    onTogglePreview: () => void;
    currentStep: number;
    totalSteps: number;
}

const HybridToolbar: React.FC<HybridToolbarProps> = ({
    editorState,
    onStateChange,
    funnelId,
    onSave,
    onCreateNew,
    onDuplicate,
    onTogglePreview,
    currentStep,
    totalSteps
}) => {
    const [isOperating, setIsOperating] = useState(false);

    const handleAIToggle = useCallback(() => {
        onStateChange({ aiAssistantActive: !editorState.aiAssistantActive });
    }, [editorState.aiAssistantActive, onStateChange]);

    const handleSave = useCallback(async () => {
        if (!onSave) return;
        setIsOperating(true);
        try {
            await onSave();
        } finally {
            setIsOperating(false);
        }
    }, [onSave]);

    const handleCreateNew = useCallback(async () => {
        if (!onCreateNew) return;
        setIsOperating(true);
        try {
            await onCreateNew();
        } finally {
            setIsOperating(false);
        }
    }, [onCreateNew]);

    const handleDuplicate = useCallback(async () => {
        if (!onDuplicate) return;
        setIsOperating(true);
        try {
            await onDuplicate();
        } finally {
            setIsOperating(false);
        }
    }, [onDuplicate]);

    return (
        <div className="h-14 bg-background border-b border-border flex items-center justify-between px-4 py-2">
            {/* Left: Mode Tabs + Info */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-sm">Hybrid Editor Pro</span>
                    <Badge variant="secondary" className="text-xs">v2.0</Badge>
                </div>

                {/* Mode Tabs - Do ModernUnifiedEditor */}
                <Tabs
                    value={editorState.mode}
                    onValueChange={(mode) => onStateChange({ mode: mode as EditorMode })}
                    className="w-auto"
                >
                    <TabsList className="h-8">
                        <TabsTrigger value="visual" className="text-xs">
                            <Eye className="w-4 h-4 mr-1" />
                            Visual
                        </TabsTrigger>
                        <TabsTrigger value="builder" className="text-xs">
                            <Component className="w-4 h-4 mr-1" />
                            Builder
                        </TabsTrigger>
                        <TabsTrigger value="funnel" className="text-xs">
                            <Target className="w-4 h-4 mr-1" />
                            Funnel
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Step Info */}
                <Badge variant="outline" className="text-xs">
                    Etapa {currentStep} de {totalSteps}
                </Badge>

                {funnelId && (
                    <Badge variant="outline" className="text-xs">
                        ID: {funnelId.substring(0, 8)}...
                    </Badge>
                )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {/* CRUD Actions */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCreateNew}
                    disabled={isOperating}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo
                </Button>

                {funnelId && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDuplicate}
                        disabled={isOperating}
                    >
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicar
                    </Button>
                )}

                <Separator orientation="vertical" className="h-4" />

                {/* IA Assistant - Do ModernUnifiedEditor */}
                <Button
                    variant={editorState.aiAssistantActive ? "default" : "outline"}
                    size="sm"
                    onClick={handleAIToggle}
                    disabled={isOperating}
                >
                    <Brain className="w-4 h-4 mr-2" />
                    IA
                </Button>

                {/* Preview Toggle */}
                <Button
                    variant={editorState.previewMode ? "default" : "outline"}
                    size="sm"
                    onClick={onTogglePreview}
                    disabled={isOperating}
                >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                </Button>

                {/* Save */}
                <Button
                    variant="default"
                    size="sm"
                    onClick={handleSave}
                    disabled={isOperating || !onSave}
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isOperating ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>
        </div>
    );
};

// ===== HYBRID STATUS BAR =====

interface HybridStatusBarProps {
    editorState: HybridEditorState;
    useAPIPanel: boolean;
    selectedBlock?: Block;
    isLoading?: boolean;
    isDirty?: boolean;
    lastSaved?: string;
}

const HybridStatusBar: React.FC<HybridStatusBarProps> = ({
    editorState,
    useAPIPanel,
    selectedBlock,
    isLoading = false,
    isDirty = false,
    lastSaved
}) => {
    return (
        <div className="h-6 bg-muted/30 border-t border-border flex items-center justify-between px-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    <span>Modo: {editorState.mode}</span>
                </div>

                {selectedBlock && (
                    <>
                        <Separator orientation="vertical" className="h-3" />
                        <span>Selecionado: {selectedBlock.type}</span>
                    </>
                )}

                <Separator orientation="vertical" className="h-3" />
                <span>Painel: {useAPIPanel ? 'API (Dados Reais)' : 'Registry'}</span>

                {isLoading && (
                    <>
                        <Separator orientation="vertical" className="h-3" />
                        <span>⏳ Carregando...</span>
                    </>
                )}

                {isDirty && (
                    <>
                        <Separator orientation="vertical" className="h-3" />
                        <span>✏️ Modificado</span>
                    </>
                )}

                {editorState.aiAssistantActive && (
                    <>
                        <Separator orientation="vertical" className="h-3" />
                        <Brain className="w-3 h-3" />
                        <span>IA Ativo</span>
                    </>
                )}
            </div>

            <div className="flex items-center gap-3">
                {lastSaved && (
                    <span>💾 Salvo: {new Date(lastSaved).toLocaleTimeString()}</span>
                )}
                <span>Hybrid Editor Pro v2.0</span>
            </div>
        </div>
    );
};

// ===== RESIZABLE COLUMNS HOOK (do ModularEditorPro) =====

const useResizableColumns = () => {
    const [columnWidths, setColumnWidths] = useState(() => {
        const saved = localStorage.getItem('hybrid-editor-column-widths');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return {
                    steps: Math.max(200, Math.min(400, parsed.steps || 256)),
                    components: Math.max(280, Math.min(500, parsed.components || 320)),
                    properties: Math.max(280, Math.min(500, parsed.properties || 320))
                };
            } catch {
                // Fallback
            }
        }
        return {
            steps: 256,
            components: 320,
            properties: 320
        };
    });

    const handleResize = useCallback((column: 'steps' | 'components' | 'properties', width: number) => {
        const minWidths = { steps: 200, components: 280, properties: 280 };
        const maxWidths = { steps: 400, components: 500, properties: 500 };

        const clampedWidth = Math.max(minWidths[column], Math.min(maxWidths[column], width));
        setColumnWidths(prev => {
            const newWidths = { ...prev, [column]: clampedWidth };
            localStorage.setItem('hybrid-editor-column-widths', JSON.stringify(newWidths));
            return newWidths;
        });
    }, []);

    return { columnWidths, handleResize };
};

// ===== RESIZE HANDLE COMPONENT =====

const ResizeHandle: React.FC<{
    onResize: (width: number) => void;
    label?: string;
}> = ({ onResize, label }) => {
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const startWidth = useRef(0);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
        startX.current = e.clientX;
        const parent = (e.currentTarget as HTMLElement).previousElementSibling as HTMLElement;
        if (parent) {
            startWidth.current = parent.getBoundingClientRect().width;
        }
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX.current;
        const newWidth = startWidth.current + deltaX;
        onResize(newWidth);
    }, [isDragging, onResize]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }, []);

    React.useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
        <div
            className={`relative w-1 bg-border hover:bg-primary cursor-col-resize transition-colors duration-200 ${isDragging ? 'bg-primary' : ''
                }`}
            onMouseDown={handleMouseDown}
            title={label ? `Redimensionar ${label}` : 'Redimensionar coluna'}
        />
    );
};

// ===== MAIN HYBRID COMPONENT =====

const HybridModularEditorPro: React.FC<HybridModularEditorProProps> = ({
    funnelId,
    // showProFeatures = true, // TODO: Implementar features pro
    // enableAI = true, // TODO: Implementar controle de IA
    enableCRUD = true,
    className = ''
}) => {
    // 🎯 Context do ModularEditorPro
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('HybridModularEditorPro must be used within EditorProvider');
    }

    // 🚀 CRUD Context do ModernUnifiedEditor (opcional)
    // const crudContext = enableCRUD ? useUnifiedCRUD() : null; // TODO: Implementar CRUD

    // const { schedule } = useOptimizedScheduler(); // TODO: Usar scheduler
    const { addNotification } = useNotification();
    const { columnWidths, handleResize } = useResizableColumns();

    // 🧠 Estados híbridos
    const [editorState, setEditorState] = useState<HybridEditorState>({
        mode: 'visual',
        aiAssistantActive: false,
        previewMode: false,
        showStatusBar: true
    });

    const [useAPIPanel, setUseAPIPanel] = useState(true); // ✅ API Panel por padrão

    // 📊 Estados computados do ModularEditorPro
    const currentStepBlocks = useMemo(() => context.computed.currentBlocks, [context.computed.currentBlocks]);
    const selectedBlock = useMemo(() => context.computed.selectedBlock, [context.computed.selectedBlock]);

    // 🔄 Handlers do ModularEditorPro
    const handleSelectBlock = useCallback((blockId: string) => {
        context.setSelectedBlockId(blockId);
    }, [context]);

    const handleUpdateBlock = useCallback(async (blockId: string, updates: Partial<Block>) => {
        await context.updateBlock(blockId, updates);
    }, [context]);

    const handleDeleteBlock = useCallback(async (blockId: string) => {
        await context.deleteBlock(blockId);
        if (context.selectedBlockId === blockId) {
            context.setSelectedBlockId(null);
        }
        addNotification('Componente removido');
    }, [context, addNotification]);

    // 🚀 Handlers premium do ModernUnifiedEditor
    const handleTogglePreview = useCallback(() => {
        setEditorState(prev => ({ ...prev, previewMode: !prev.previewMode }));
        context.togglePreview();
    }, [context]);

    const handleSave = useCallback(async () => {
        await context.save();
        addNotification('Salvo com sucesso');
    }, [context, addNotification]);

    const handleCreateNew = useCallback(async () => {
        console.log('🆕 Criar novo funil');
        // if (crudContext?.createNew) {
        //   await crudContext.createNew();
        //   addNotification('Novo funil criado');
        // }
    }, [addNotification]);

    const handleDuplicate = useCallback(async () => {
        console.log('📋 Duplicar funil');
        // if (crudContext?.duplicate) {
        //   await crudContext.duplicate();
        //   addNotification('Funil duplicado');
        // }
    }, [addNotification]);

    const handleStateChange = useCallback((updates: Partial<HybridEditorState>) => {
        setEditorState(prev => ({ ...prev, ...updates }));
    }, []);

    // 🎯 Step navigation
    const handleStepChange = useCallback((step: number) => {
        const stageId = `step-${step}`;
        context.stageActions.setActiveStage(stageId);
    }, [context]);

    // 📊 Dados para componentes
    const currentStep = parseInt(context.activeStageId.replace('step-', '')) || 1;
    const totalSteps = Math.max(21, context.stages.length);

    const groupedComponents = useMemo(() => ({
        'Conteúdo': [
            { type: 'headline', name: 'Título', icon: 'note', category: 'Conteúdo', description: 'Título principal' },
            { type: 'text', name: 'Texto', icon: 'doc', category: 'Conteúdo', description: 'Parágrafo de texto' },
            { type: 'image', name: 'Imagem', icon: 'image', category: 'Conteúdo', description: 'Inserir imagem' },
        ],
        'Social Proof': [
            { type: 'mentor-section-inline', name: 'Seção da Mentora', icon: 'user', category: 'Social Proof', description: 'Seção com informações da Gisele Galvão' },
            { type: 'testimonial-card-inline', name: 'Depoimento', icon: 'quote', category: 'Social Proof', description: 'Depoimento individual de cliente' },
        ],
        'Quiz': [
            { type: 'quiz-question', name: 'Pergunta', icon: 'help', category: 'Quiz', description: 'Pergunta do quiz' },
            { type: 'options-grid', name: 'Grade de Opções', icon: 'flash', category: 'Quiz', description: 'Grade interativa de opções' },
        ]
    }), []);

    return (
        <div className={`h-full w-full flex flex-col bg-background ${className}`}>
            {/* 🚀 HYBRID TOOLBAR - Combina funcionalidades dos dois editores */}
            <HybridToolbar
                editorState={editorState}
                onStateChange={handleStateChange}
                funnelId={funnelId}
                onSave={enableCRUD ? handleSave : undefined}
                onCreateNew={enableCRUD ? handleCreateNew : undefined}
                onDuplicate={enableCRUD ? handleDuplicate : undefined}
                onTogglePreview={handleTogglePreview}
                currentStep={currentStep}
                totalSteps={totalSteps}
            />

            {/* 🎨 LAYOUT 4 COLUNAS - Base do ModularEditorPro */}
            <div className="flex-1 flex min-h-0 bg-background text-foreground overflow-hidden">

                {/* 📋 COLUNA 1: ETAPAS */}
                <aside
                    className="bg-card border-r border-border flex-shrink-0 overflow-hidden"
                    style={{ width: `${columnWidths.steps}px` }}
                >
                    <StepSidebar
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                        stepHasBlocks={{}} // Será implementado
                        onSelectStep={handleStepChange}
                        getStepAnalysis={(step: number) => ({
                            icon: 'info',
                            label: `Etapa ${step}`,
                            desc: `Configuração da etapa ${step}`
                        })}
                        renderIcon={() => null}
                    />
                </aside>

                <ResizeHandle
                    onResize={(width) => handleResize('steps', width)}
                    label="Etapas"
                />

                {/* 🧩 COLUNA 2: COMPONENTES */}
                <aside
                    className="bg-card/50 border-r border-border flex-shrink-0 overflow-hidden"
                    style={{ width: `${columnWidths.components}px` }}
                >
                    <ComponentsSidebar
                        groupedComponents={groupedComponents}
                        renderIcon={() => null}
                    />
                </aside>

                <ResizeHandle
                    onResize={(width) => handleResize('components', width)}
                    label="Componentes"
                />

                {/* 🎨 COLUNA 3: CANVAS */}
                <main className="flex-1 min-h-0 bg-muted/30 flex flex-col overflow-hidden">
                    <EditorCanvas
                        blocks={currentStepBlocks}
                        selectedBlock={selectedBlock}
                        currentStep={currentStep}
                        onSelectBlock={handleSelectBlock}
                        onUpdateBlock={handleUpdateBlock}
                        onDeleteBlock={handleDeleteBlock}
                        isPreviewMode={editorState.previewMode}
                    />
                </main>

                <ResizeHandle
                    onResize={(width) => handleResize('properties', width)}
                    label="Propriedades"
                />

                {/* ⚙️ COLUNA 4: PROPRIEDADES - APIPropertiesPanel garantido */}
                <aside
                    className="bg-card border-l border-border flex-shrink-0 overflow-hidden"
                    style={{ width: `${columnWidths.properties}px` }}
                >
                    {useAPIPanel && selectedBlock ? (
                        <APIPropertiesPanel
                            blockId={selectedBlock.id}
                            blockType={selectedBlock.type}
                            initialProperties={selectedBlock.content || {}}
                            onPropertyChange={(key: string, value: any, isValid: boolean) => {
                                if (isValid) {
                                    handleUpdateBlock(selectedBlock.id, {
                                        content: { ...selectedBlock.content, [key]: value }
                                    });
                                }
                            }}
                            onClose={() => context.setSelectedBlockId(null)}
                            onDelete={() => handleDeleteBlock(selectedBlock.id)}
                        />
                    ) : useAPIPanel && !selectedBlock ? (
                        <div className="p-4 text-center text-muted-foreground">
                            <div className="space-y-3">
                                <Brain className="w-8 h-8 mx-auto text-primary" />
                                <p>Selecione um componente</p>
                                <p className="text-xs">API Panel com dados reais ativo</p>
                            </div>
                        </div>
                    ) : (
                        <RegistryPropertiesPanel
                            selectedBlock={selectedBlock}
                            onUpdate={(blockId: string, updates: Record<string, any>) => {
                                handleUpdateBlock(blockId, updates);
                            }}
                            onClose={() => context.setSelectedBlockId(null)}
                            onDelete={(blockId: string) => handleDeleteBlock(blockId)}
                        />
                    )}

                    {/* Toggle API/Registry - Preservado do ModularEditorPro */}
                    <div className="p-2 border-t border-border">
                        <button
                            onClick={() => setUseAPIPanel(!useAPIPanel)}
                            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1"
                        >
                            <Brain className="w-3 h-3" />
                            {useAPIPanel ? 'Usar Registry Panel' : 'Usar API Panel'}
                        </button>
                    </div>
                </aside>
            </div>

            {/* 📊 HYBRID STATUS BAR - Do ModernUnifiedEditor */}
            {editorState.showStatusBar && (
                <HybridStatusBar
                    editorState={editorState}
                    useAPIPanel={useAPIPanel}
                    selectedBlock={selectedBlock || undefined}
                    isLoading={context.isLoading}
                />
            )}
        </div>
    );
};

export default HybridModularEditorPro;