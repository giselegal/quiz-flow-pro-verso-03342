import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PublishedTemplateRunner } from '@/components/runtime/PublishedTemplateRunner';

// Integra o hook + service + runner com fetch mockado
// Fluxo: carregar snapshot -> autoStart -> selecionar opção -> avançar question -> alcançar result -> finalizar -> ver outcome

const g: any = globalThis;

function buildSnapshot() {
    return {
        id: 'tpl1',
        slug: 'quiz-demo',
        publishedAt: 'now',
        logic: { branching: [] },
        outcomes: [{ id: 'outLow', conditions: { scoreRange: { min: 0, max: 100 } }, template: 'OUTCOME_TEMPLATE' }],
        stages: [
            { id: 'stage_intro', type: 'intro', order: 0, componentIds: ['c_heading_intro'] },
            { id: 'stage_q1', type: 'question', order: 1, componentIds: ['c_q1_opts'] },
            { id: 'stage_result', type: 'result', order: 2, componentIds: [] }
        ],
        components: {
            c_heading_intro: { id: 'c_heading_intro', type: 'Heading', props: { text: 'Bem-vindo' } },
            c_q1_opts: { id: 'c_q1_opts', type: 'OptionList', props: { options: [{ id: 'opt1', label: 'Opção 1' }, { id: 'opt2', label: 'Opção 2' }] } }
        }
    } as any;
}

describe('PublishedTemplateRunner integration', () => {
    beforeEach(() => {
        g.fetch = vi.fn()
            // snapshot
            .mockResolvedValueOnce(new Response(JSON.stringify(buildSnapshot()), { status: 200 }))
            // start
            .mockResolvedValueOnce(new Response(JSON.stringify({ sessionId: 'sess1', currentStageId: 'stage_intro' }), { status: 200 }))
            // answer intro -> question
            .mockResolvedValueOnce(new Response(JSON.stringify({ nextStageId: 'stage_q1', score: 0, branched: false }), { status: 200 }))
            // answer question -> result
            .mockResolvedValueOnce(new Response(JSON.stringify({ nextStageId: 'stage_result', score: 10, branched: false }), { status: 200 }))
            // complete -> outcome
            .mockResolvedValueOnce(new Response(JSON.stringify({ outcome: { id: 'outLow', template: 'OUTCOME_TEMPLATE', score: 10 } }), { status: 200 }));
        sessionStorage.clear();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('executa fluxo completo com seleção de opção', async () => {
        render(<PublishedTemplateRunner slug="quiz-demo" />);

        const getStageContainer = () => screen.getByText(/Stage Atual:/).parentElement as HTMLElement;

        // Garante que iniciou na intro
        await waitFor(() => {
            expect(getStageContainer().textContent).toMatch(/stage_intro/);
        });

        // Avança intro -> question
        fireEvent.click(screen.getByRole('button', { name: /Avançar/i }));

        await waitFor(() => {
            expect(getStageContainer().textContent).toMatch(/stage_q1/);
        });
        // Seleciona opção
        const opt1 = await screen.findByLabelText('Opção 1');
        fireEvent.click(opt1);

        // Avança para result
        fireEvent.click(screen.getByRole('button', { name: /Avançar/i }));

        await waitFor(() => {
            expect(getStageContainer().textContent).toMatch(/stage_result/);
        });

        // Finaliza
        const botaoFinalizar = screen.getByRole('button', { name: /Finalizar/i });
        fireEvent.click(botaoFinalizar);

        const outcomeHeader = await screen.findByText('Outcome');
        const outcomeContainer = outcomeHeader.parentElement as HTMLElement;
        expect(outcomeContainer.textContent).toMatch(/OUTCOME_TEMPLATE/);

        // Verifica que fetch foi chamado para as 5 etapas
        expect(g.fetch).toHaveBeenCalledTimes(5);
    });
});
