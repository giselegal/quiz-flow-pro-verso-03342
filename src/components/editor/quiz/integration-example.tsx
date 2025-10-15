/**
 * 🔧 PATCH: Integração do Preview ao Vivo no Editor Principal
 * 
 * Este arquivo mostra como integrar o novo sistema de preview ao vivo
 * no QuizModularProductionEditor existente.
 */

// Exemplo de como modificar o QuizModularProductionEditor.tsx

import { EnhancedCanvasArea } from './components/EnhancedCanvasArea';
import { LivePreviewProvider } from '@/providers/LivePreviewProvider';

// No componente principal, substituir o CanvasArea existente:

const QuizModularProductionEditor = () => {
    // ... resto do código existente ...

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
                    onStepChange={(stepId) => {
                        // Sincronizar mudança de step
                        const targetStep = steps.find(s => s.id === stepId);
                        if (targetStep) {
                            setSelectedStepIndex(steps.indexOf(targetStep));
                        }
                    }}
                    onBlockUpdate={(stepId, blockId, updates) => {
                        // Atualizar bloco específico
                        const stepIndex = steps.findIndex(s => s.id === stepId);
                        if (stepIndex !== -1) {
                            const step = steps[stepIndex];
                            const blockIndex = step.blocks.findIndex(b => b.id === blockId);
                            if (blockIndex !== -1) {
                                const updatedSteps = [...steps];
                                updatedSteps[stepIndex] = {
                                    ...step,
                                    blocks: step.blocks.map((block, idx) => 
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