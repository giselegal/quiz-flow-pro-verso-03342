/**
 * 🔧 PATCH: Integração do Preview ao Vivo no Editor Principal
 * 
 * Este arquivo mostra como integrar o novo sistema de preview ao vivo
 * no QuizModularProductionEditor existente.
 */

import React from 'react';
import { EnhancedCanvasArea } from './components/EnhancedCanvasArea';
import { LivePreviewProvider } from '@/providers/LivePreviewProvider';

// Exemplo de como modificar o QuizModularProductionEditor.tsx

interface IntegrationExampleProps {
    // Props do editor existente
    activeTab: 'canvas' | 'preview';
    setActiveTab: (tab: 'canvas' | 'preview') => void;
    steps: any[];
    selectedStep: any;
    headerConfig: any;
    liveScores: any;
    topStyle: any;
    BlockRow: React.ComponentType<any>;
    byBlock: any;
    selectedBlockId: string;
    isMultiSelected: (id: string) => boolean;
    handleBlockClick: (block: any, event: React.MouseEvent) => void;
    renderBlockPreview: (block: any) => React.ReactNode;
    removeBlock: (id: string) => void;
    setBlockPendingDuplicate: (id: string) => void;
    setTargetStepId: (id: string) => void;
    setDuplicateModalOpen: (open: boolean) => void;
    activeId: string | null;
    previewNode: React.ReactNode;
    FixedProgressHeader: React.ComponentType<any>;
    StyleResultCard: React.ComponentType<any>;
    OfferMap: React.ComponentType<any>;
    funnelId: string;
    setSelectedStepIndex: (index: number) => void;
    setSteps: (steps: any[]) => void;
}

const QuizModularProductionEditor: React.FC<IntegrationExampleProps> = ({
    activeTab,
    setActiveTab,
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
    funnelId,
    setSelectedStepIndex,
    setSteps
}) => {
    return (
        <LivePreviewProvider
            enableDebug={process.env.NODE_ENV === 'development'}
            autoReconnect={true}
            maxReconnectAttempts={5}
            enableHeartbeat={true}
            heartbeatInterval={30000}
        >
            <div className="editor-layout">
                {/* Outras colunas... */}
                
                {/* Substituir CanvasArea por EnhancedCanvasArea */}
                <EnhancedCanvasArea
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    steps={steps}
                    selectedStep={selectedStep}
                    headerConfig={headerConfig}
                    liveScores={liveScores}
                    topStyle={topStyle}
                    BlockRow={BlockRow}
                    byBlock={byBlock}
                    selectedBlockId={selectedBlockId}
                    isMultiSelected={isMultiSelected}
                    handleBlockClick={handleBlockClick}
                    renderBlockPreview={renderBlockPreview}
                    removeBlock={removeBlock}
                    setBlockPendingDuplicate={setBlockPendingDuplicate}
                    setTargetStepId={setTargetStepId}
                    setDuplicateModalOpen={setDuplicateModalOpen}
                    activeId={activeId}
                    previewNode={previewNode}
                    FixedProgressHeader={FixedProgressHeader}
                    StyleResultCard={StyleResultCard}
                    OfferMap={OfferMap}
                    funnelId={funnelId}
                    onStepChange={(stepId: string) => {
                        // Sincronizar mudança de step
                        const targetStep = steps.find((s: any) => s.id === stepId);
                        if (targetStep) {
                            setSelectedStepIndex(steps.indexOf(targetStep));
                        }
                    }}
                    onBlockUpdate={(stepId: string, blockId: string, updates: any) => {
                        // Atualizar bloco específico
                        const stepIndex = steps.findIndex((s: any) => s.id === stepId);
                        if (stepIndex !== -1) {
                            const step = steps[stepIndex];
                            const blockIndex = step.blocks.findIndex((b: any) => b.id === blockId);
                            if (blockIndex !== -1) {
                                const updatedSteps = [...steps];
                                updatedSteps[stepIndex] = {
                                    ...step,
                                    blocks: step.blocks.map((block: any, idx: number) => 
                                        idx === blockIndex ? { ...block, ...updates } : block
                                    )
                                };
                                setSteps(updatedSteps);
                            }
                        }
                    }}
                />
                
                {/* Outras colunas... */}
            </div>
        </LivePreviewProvider>
    );
};

export default QuizModularProductionEditor;