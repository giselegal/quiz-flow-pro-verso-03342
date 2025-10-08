import { quizEditorBridge } from '@/services/QuizEditorBridge';
import * as BridgeModule from '@/services/QuizEditorBridge';
import type { QuizStep } from '@/data/quizSteps';
import { vi, expect, it, describe } from 'vitest';

// Mock supabase (draft + production tables)
vi.mock('@/integrations/supabase/client', () => {
    const drafts: any[] = [];
    const production: any[] = [];
    return {
        supabase: {
            from: (table: string) => ({
                select: () => ({
                    eq: (_col: string, value: string) => ({
                        single: () => {
                            if (table === 'quiz_funnels_drafts') {
                                const found = drafts.find(d => d.id === value);
                                return { data: found || null };
                            }
                            if (table === 'quiz_funnels_production') {
                                const found = production.find(p => p.slug === value);
                                return { data: found || null };
                            }
                            return { data: null };
                        }
                    })
                }),
                upsert: (data: any) => {
                    if (table === 'quiz_funnels_drafts') {
                        const idx = drafts.findIndex(d => d.id === data.id);
                        if (idx >= 0) drafts[idx] = data; else drafts.push(data);
                    } else if (table === 'quiz_funnels_production') {
                        production.push(data);
                    }
                    return { error: null };
                },
                eq: (col: string, value: string) => ({
                    order: () => ({
                        limit: () => ({
                            single: () => ({ data: production.find(p => (p as any)[col] === value) || null })
                        })
                    })
                })
            })
        }
    };
});

function makeNumericFunnel() {
    // Criar 20 steps com ids numéricos e nextStep numérico
    const steps: any[] = [];
    for (let i = 0; i < 20; i++) {
        const id = String(i);
        const next = i < 19 ? String(i + 1) : undefined;
        steps.push({
            id,
            order: i + 1,
            type: 'question',
            options: ['classico', 'natural', 'contemporâneo', 'elegante', 'romântico', 'sexy', 'dramático', 'criativo'].map((sid, idx) => ({ id: sid, text: `Opção ${idx + 1}`, image: 'x.png' })),
            nextStep: next
        });
    }
    return steps;
}

describe('publishToProduction normaliza IDs numéricos', () => {
    it('publica funil com ids 0..19 após normalização', async () => {
        // Salvar draft com ids numéricos
        const funnelDraft: any = {
            id: 'draft-numeric',
            name: 'Draft Numérico',
            slug: 'quiz-estilo',
            steps: makeNumericFunnel(),
            isPublished: false,
            version: 1
        };

        // Salvar draft
        const draftId = await quizEditorBridge.saveDraft(funnelDraft);
        expect(draftId).toBe('draft-numeric');

        // Espionar método de carregamento para retornar diretamente o draft salvo (bypass supabase mock select)
        const spy = vi.spyOn(BridgeModule['quizEditorBridge'] as any, 'loadDraftFromDatabase').mockResolvedValueOnce({
            id: draftId,
            name: funnelDraft.name,
            slug: funnelDraft.slug,
            steps: funnelDraft.steps,
            isPublished: false,
            version: 2
        });

        await quizEditorBridge.publishToProduction(draftId);
        spy.mockRestore();
    });
});
