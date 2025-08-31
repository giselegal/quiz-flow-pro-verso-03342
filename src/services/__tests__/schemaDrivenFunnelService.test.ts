import { describe, it, expect, vi, beforeEach } from 'vitest';
import schemaDrivenFunnelService from '../schemaDrivenFunnelService';

// Mock do supabase client usado pelo serviço
vi.mock('@/integrations/supabase/client', () => {
    const rows: any[] = [];
    const singleOk = { data: { id: '11111111-1111-1111-1111-111111111111', funnel_id: '22222222-2222-2222-2222-222222222222', page_type: 'question', page_order: 0, title: 'Nova Página', blocks: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString(), user_id: '00000000-0000-0000-0000-000000000001' }, error: null };
    return {
        supabase: {
            auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: '00000000-0000-0000-0000-000000000001' } } }) },
            from: vi.fn().mockImplementation(() => {
                return {
                    insert: vi.fn().mockReturnValue({
                        select: vi.fn().mockReturnValue({
                            single: vi.fn().mockResolvedValue(singleOk),
                        }),
                    }),
                    update: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue(singleOk) }) }) }),
                    delete: vi.fn().mockReturnValue({ eq: vi.fn() }),
                    select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ order: vi.fn().mockResolvedValue({ data: rows, error: null }) }) }),
                    eq: vi.fn(),
                    order: vi.fn(),
                } as any;
            }),
        },
    };
});

describe('schemaDrivenFunnelService', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('createPage normaliza page_type inválido para QUESTION e garante UUID em id', async () => {
        const created = await schemaDrivenFunnelService.createPage('22222222-2222-2222-2222-222222222222', {
            title: 'Teste',
            type: 'coisa-qualquer' as any,
            order: 0,
            blocks: [{} as any],
        });
        expect(created).toBeTruthy();
        expect(created!.type).toBe('question');
        // formato UUID
        expect(created!.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
});
