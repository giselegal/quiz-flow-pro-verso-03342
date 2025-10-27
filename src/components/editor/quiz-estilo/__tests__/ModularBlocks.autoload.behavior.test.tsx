import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

// Mocks utilitários antes dos imports dos componentes
vi.mock('@/utils/templateConverter', async (orig) => {
    const actual = await (orig as any)();
    return {
        ...actual,
        safeGetTemplateBlocks: vi.fn(() => []),
        blockComponentsToBlocks: vi.fn(() => []),
    };
});

// Mock simples para UniversalBlockRenderer/BlockTypeRenderer quando usados
vi.mock('@/components/editor/blocks/UniversalBlockRenderer', () => ({
    default: ({ block }: any) => <div data-testid="universal-block" data-type={block?.type || 'unknown'} />,
}));

vi.mock('@/components/editor/quiz/renderers/BlockTypeRenderer', () => ({
    BlockTypeRenderer: ({ block }: any) => <div data-testid="block-type" data-type={block?.type || 'unknown'} />,
}));

// Importar após mocks
import ModularTransitionStep from '../ModularTransitionStep';
import ModularResultStep from '../ModularResultStep';
import ModularIntroStep from '../ModularIntroStep';
import ModularQuestionStep from '../ModularQuestionStep';
import ModularStrategicQuestionStep from '../ModularStrategicQuestionStep';

import { safeGetTemplateBlocks } from '@/utils/templateConverter';

const mkBlock = (id: string, type = 'debug-block') => ({
    id,
    type: type as any,
    order: 0,
    content: {},
    properties: {},
});

describe('Modular Components autoload behavior', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('ModularTransitionStep: does NOT autoload when props.blocks provided', async () => {
        const ensureStepLoaded = vi.fn();
        const editor = { state: { stepBlocks: {} }, actions: { ensureStepLoaded } };

        render(
            <ModularTransitionStep
                data={{ id: 'step-12' }}
                blocks={[mkBlock('b1', 'transition-title')] as any}
                editor={editor}
                isEditable
            />,
        );

        expect(ensureStepLoaded).not.toHaveBeenCalled();
        // Deve renderizar bloco fornecido
        expect(await screen.findAllByTestId('universal-block')).toHaveLength(1);
    });

    it('ModularTransitionStep: autoloads when props.blocks empty', async () => {
        const ensureStepLoaded = vi.fn().mockResolvedValue(undefined);
        const editor = { state: { stepBlocks: {} }, actions: { ensureStepLoaded } };

        render(
            <ModularTransitionStep
                data={{ id: 'step-12' }}
                blocks={[]}
                editor={editor}
            />,
        );

        await waitFor(() => {
            expect(ensureStepLoaded).toHaveBeenCalledWith('step-12');
        });
    });

    it('ModularResultStep: does NOT autoload when props.blocks provided', async () => {
        const ensureStepLoaded = vi.fn().mockResolvedValue(undefined);
        const editor = { state: { stepBlocks: {} }, actions: { ensureStepLoaded } };

        render(
            <ModularResultStep
                data={{ id: 'step-20' }}
                blocks={[mkBlock('r1', 'result-congrats')] as any}
                editor={editor}
                isEditable
                userProfile={{ userName: 'Teste', resultStyle: 'natural' }}
            />,
        );

        expect(ensureStepLoaded).not.toHaveBeenCalled();
        expect(await screen.findAllByTestId('universal-block')).toHaveLength(1);
    });

    it('ModularResultStep: autoloads when props.blocks empty', async () => {
        const ensureStepLoaded = vi.fn().mockResolvedValue(undefined);
        const editor = { state: { stepBlocks: {} }, actions: { ensureStepLoaded } };

        render(
            <ModularResultStep
                data={{ id: 'step-20' }}
                blocks={[]}
                editor={editor}
                userProfile={{ userName: 'Teste', resultStyle: 'natural' }}
            />,
        );

        await waitFor(() => {
            expect(ensureStepLoaded).toHaveBeenCalledWith('step-20');
        });
    });

    it('Intro/Question/Strategic: do NOT call safeGetTemplateBlocks when props.blocks provided', async () => {
        const spy = safeGetTemplateBlocks as unknown as ReturnType<typeof vi.fn>;

        render(<ModularIntroStep data={{ id: 'step-01' }} blocks={[mkBlock('i1', 'intro-title')] as any} />);
        render(<ModularQuestionStep data={{ id: 'step-02' }} blocks={[mkBlock('q1', 'question-text')] as any} />);
        render(<ModularStrategicQuestionStep data={{ id: 'step-13' }} blocks={[mkBlock('s1', 'question-text')] as any} />);

        expect(spy).not.toHaveBeenCalled();
    });
});
