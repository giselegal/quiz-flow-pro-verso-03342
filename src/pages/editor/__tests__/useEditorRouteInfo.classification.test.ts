import { describe, it, expect } from 'vitest';
import { useEditorRouteInfo } from '../modern/hooks/useEditorRouteInfo';
import { renderHook } from '@testing-library/react';

// Util para simular window.location
function withPath(path: string, search: string, cb: () => void) {
    const oldLocation = window.location;
    // @ts-expect-error override somente para teste
    delete window.location;
    // @ts-expect-error redefinindo
    window.location = { pathname: path, search };
    try { cb(); } finally {
        window.location = oldLocation;
    }
}

describe('useEditorRouteInfo classification (strict)', () => {
    it('classifica alias canônico quiz-estilo como quiz-template', () => {
        withPath('/editor/quiz-estilo', '', () => {
            const { result } = renderHook(() => useEditorRouteInfo({}));
            expect(result.current.type).toBe('quiz-template');
            expect(result.current.templateId).toBe('quiz-estilo-21-steps');
        });
    });

    it('classifica alias semantic quiz-estilo-pessoal como quiz-template', () => {
        withPath('/editor/quiz-estilo-pessoal', '', () => {
            const { result } = renderHook(() => useEditorRouteInfo({}));
            expect(result.current.type).toBe('quiz-template');
            expect(result.current.templateId).toBe('quiz-estilo-21-steps');
        });
    });

    it('NÃO promove quiz-estilo-demo para template (trata como funnel)', () => {
        withPath('/editor/quiz-estilo-demo', '', () => {
            const { result } = renderHook(() => useEditorRouteInfo({}));
            expect(result.current.type).toBe('funnel');
            expect(result.current.funnelId).toBe('quiz-estilo-demo');
        });
    });

    it('promove ids com prefix template- para template', () => {
        withPath('/editor/template-land-page-a', '', () => {
            const { result } = renderHook(() => useEditorRouteInfo({}));
            expect(result.current.type).toBe('template');
            expect(result.current.templateId).toBe('template-land-page-a');
        });
    });

    it('mantém funnel query param prioridade sobre path', () => {
        withPath('/editor/quiz-estilo', '?funnel=abc123', () => {
            const { result } = renderHook(() => useEditorRouteInfo({}));
            expect(result.current.type).toBe('funnel');
            expect(result.current.funnelId).toBe('abc123');
        });
    });

    it('promove template query param prioridade sobre path', () => {
        withPath('/editor/qualquer-coisa', '?template=quiz-estilo', () => {
            const { result } = renderHook(() => useEditorRouteInfo({}));
            expect(result.current.type).toBe('quiz-template');
            expect(result.current.templateId).toBe('quiz-estilo-21-steps');
        });
    });
});
