import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CanvasArea } from '../components/CanvasArea';

describe('CanvasArea - Preview Tab behavior', () => {
    it('deve renderizar o preview somente ao selecionar a aba Preview e não montar quando Canvas está ativo', async () => {
        const user = userEvent.setup();

        // Estado local para simular alternância de abas
        const Wrapper = () => {
            const [activeTab, setActiveTab] = (require('react') as typeof import('react')).useState<'canvas' | 'preview'>('canvas');

            const steps = [
                { id: 'step-1', type: 'question', order: 1, blocks: [] as any[] },
            ];
            const selectedStep = steps[0] as any;

            return (
                <CanvasArea
                    activeTab={activeTab}
                    onTabChange={(v) => setActiveTab(v as 'canvas' | 'preview')}
                    steps={steps as any}
                    selectedStep={selectedStep}
                    headerConfig={{ showLogo: false, progressEnabled: false }}
                    liveScores={{}}
                    BlockRow={() => null as any}
                    byBlock={{}}
                    selectedBlockId=""
                    isMultiSelected={() => false}
                    handleBlockClick={() => { }}
                    renderBlockPreview={() => null}
                    removeBlock={() => { }}
                    setBlockPendingDuplicate={() => { }}
                    setTargetStepId={() => { }}
                    setDuplicateModalOpen={() => { }}
                    activeId={null}
                    previewNode={<div data-testid="test-preview">PreviewContent</div>}
                    FixedProgressHeader={() => null as any}
                    StyleResultCard={() => null as any}
                    OfferMap={() => null as any}
                    topStyle={undefined}
                />
            );
        };

        render(<Wrapper />);

        // Inicialmente na aba Canvas: preview NÃO deve estar no DOM
        expect(screen.queryByTestId('test-preview')).toBeNull();

        // Alternar para a aba Preview
        const previewTrigger = screen.getByTestId('tab-trigger-preview');
        await user.click(previewTrigger);

        // Preview deve aparecer sem travar
        expect(await screen.findByTestId('test-preview')).toBeInTheDocument();
    });
});
