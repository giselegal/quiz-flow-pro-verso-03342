import React, { Suspense, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Edit3, Smartphone, Tablet, Monitor } from 'lucide-react';
import { BlockComponent, EditableQuizStep } from '../types';
import { useEditorMode } from '@/contexts/editor/EditorModeContext';
import { UnifiedCanvas } from './UnifiedCanvas';

export interface CanvasAreaProps {
    /**
     * @deprecated Use viewMode from EditorModeContext instead
     */
    activeTab?: string;
    /**
     * @deprecated Use EditorModeContext actions instead
     */
    onTabChange?: (tab: string) => void;
    steps: EditableQuizStep[];
    selectedStep?: EditableQuizStep;
    headerConfig: any;
    liveScores: Record<string, number>;
    topStyle?: string;
    BlockRow: React.ComponentType<any>;
    byBlock: Record<string, any[]>;
    selectedBlockId: string;
    isMultiSelected: (id: string) => boolean;
    /** Handler padronizado: (e, block) */
    handleBlockClick: (e: React.MouseEvent, block: BlockComponent) => void;
    renderBlockPreview: (block: BlockComponent, allBlocks: BlockComponent[]) => React.ReactNode;
    removeBlock: (stepId: string, blockId: string) => void;
    setBlockPendingDuplicate: (block: BlockComponent) => void;
    setTargetStepId: (id: string) => void;
    setDuplicateModalOpen: (open: boolean) => void;
    activeId: string | null; // usado para desativar virtualização durante drag
    previewNode?: React.ReactNode;
    FixedProgressHeader: React.ComponentType<{ config: any; steps: EditableQuizStep[]; currentStepId: string }>;
    StyleResultCard?: React.ComponentType<any>;
    OfferMap?: React.ComponentType<any>;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
    activeTab, // deprecated
    onTabChange, // deprecated
    steps,
    selectedStep,
    headerConfig,
    liveScores,
    topStyle,
    BlockRow,
    byBlock,
    selectedBlockId,
    isMultiSelected,
    handleBlockClick,
    renderBlockPreview,
    removeBlock,
    setBlockPendingDuplicate,
    setTargetStepId,
    setDuplicateModalOpen,
    activeId,
    previewNode,
    FixedProgressHeader,
    StyleResultCard,
    OfferMap,
}) => {
    // 🎯 USAR EDITOR MODE CONTEXT
    const { 
        viewMode, 
        setViewMode, 
        isEditMode, 
        isPreviewMode,
        previewDevice,
        setPreviewDevice,
        previewSessionData,
        updatePreviewSessionData,
        resetPreviewSession
    } = useEditorMode();
    
    console.log('🔍 CanvasArea render - selectedStep:', selectedStep?.id, 'viewMode:', viewMode);
    
    // 🚨 DEPRECATION WARNING para activeTab/onTabChange
    if (activeTab !== undefined && process.env.NODE_ENV === 'development') {
        console.warn(
            '⚠️ DEPRECATION: activeTab/onTabChange estão deprecated.\n' +
            'Use EditorModeContext (viewMode) ao invés.'
        );
    }

    // Criar Set para multiSelectedIds
    const multiSelectedIds = useMemo(() => {
        const ids = new Set<string>();
        selectedStep?.blocks?.forEach(block => {
            if (isMultiSelected(block.id)) {
                ids.add(block.id);
            }
        });
        return ids;
    }, [selectedStep, isMultiSelected]);

    return (
        <div className="flex-1 bg-gray-100 flex flex-col overflow-hidden">
            {/* 🎯 CANVAS HEADER - Controles de modo e device */}
            <div className="px-4 py-2 bg-white border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => setViewMode('edit')}
                        variant={isEditMode() ? 'default' : 'outline'}
                        size="sm"
                        className="gap-2"
                    >
                        <Edit3 className="w-4 h-4" />
                        Editor
                    </Button>
                    <Button
                        onClick={() => setViewMode('preview')}
                        variant={isPreviewMode() ? 'default' : 'outline'}
                        size="sm"
                        className="gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        Preview
                    </Button>
                </div>
                
                {/* 🎯 DEVICE CONTROLS - Apenas em modo preview */}
                {isPreviewMode() && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground mr-2">Device:</span>
                        <Button
                            onClick={() => setPreviewDevice('mobile')}
                            variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                            size="sm"
                            className="gap-1"
                        >
                            <Smartphone className="w-3 h-3" />
                        </Button>
                        <Button
                            onClick={() => setPreviewDevice('tablet')}
                            variant={previewDevice === 'tablet' ? 'default' : 'outline'}
                            size="sm"
                            className="gap-1"
                        >
                            <Tablet className="w-3 h-3" />
                        </Button>
                        <Button
                            onClick={() => setPreviewDevice('desktop')}
                            variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                            size="sm"
                            className="gap-1"
                        >
                            <Monitor className="w-3 h-3" />
                        </Button>
                    </div>
                )}
            </div>

            {/* 🎯 UNIFIED CANVAS - Um canvas para ambos os modos */}
            <UnifiedCanvas
                steps={steps}
                selectedStep={selectedStep}
                mode={viewMode}
                selectedBlockId={selectedBlockId}
                multiSelectedIds={multiSelectedIds}
                onBlockClick={handleBlockClick}
                onBlockDelete={(blockId) => selectedStep && removeBlock(selectedStep.id, blockId)}
                onBlockDuplicate={(block) => {
                    setBlockPendingDuplicate(block);
                    if (selectedStep) setTargetStepId(selectedStep.id);
                    setDuplicateModalOpen(true);
                }}
                sessionData={previewSessionData}
                onUpdateSessionData={updatePreviewSessionData}
                onStepChange={(stepNum) => {
                    // Navegar para próxima etapa
                    const nextStep = steps.find(s => s.order === stepNum);
                    if (nextStep) {
                        console.log('📍 Navegando para step:', nextStep.id);
                        // Aqui você pode adicionar lógica de navegação se necessário
                    }
                }}
                errors={byBlock}
                FixedProgressHeader={FixedProgressHeader}
                headerConfig={headerConfig}
            />
        </div>
    );
};

export default CanvasArea;
