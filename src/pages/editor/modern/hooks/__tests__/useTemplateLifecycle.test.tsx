import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTemplateLifecycle } from '../useTemplateLifecycle';
import { quizEstiloLoaderGateway } from '@/domain/quiz/gateway';

vi.mock('@/domain/quiz/gateway', async (orig) => {
    const actual = await (orig as any).default?.() || await orig;
    return {
        ...actual,
        quizEstiloLoaderGateway: {
            load: vi.fn().mockResolvedValue({
                templateId: 'quiz-estilo',
                steps: [{ id: 'step-1', kind: 'intro', title: 'Intro' }],
                progress: { countedStepIds: [] },
                version: '1.0.0',
                source: 'published'
            }),
            invalidate: vi.fn()
        }
    };
});

describe('useTemplateLifecycle', () => {
    it('carrega e cria funil para templateId canônico', async () => {
        const createFunnel = vi.fn().mockResolvedValue({ id: 'f1' });
        const { result } = renderHook(() => useTemplateLifecycle({
            extractedInfo: { type: 'template', templateId: 'quiz-estilo', funnelId: null },
            crudContext: { createFunnel }
        }));

        await waitFor(() => {
            expect(createFunnel).toHaveBeenCalledTimes(1);
        });

        expect(result.current.isLoadingTemplate).toBe(false);
        expect(result.current.templateError).toBeNull();
    });
});
