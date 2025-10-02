import { describe, it, expect, beforeEach } from 'vitest';
import { parseAndNormalizeParams } from '../useEditorBootstrap';

// Util para mockar window location
function withLocation(url: string, fn: () => void) {
    const old = window.location;
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = new URL(url) as any;
    try { fn(); } finally {
        window.location = old;
    }
}

describe('parseAndNormalizeParams', () => {
    beforeEach(() => {
        // garantir reset
    });

    it('detecta funnelId quando path possui /editor/:id', () => {
        withLocation('http://localhost/editor/abc123', () => {
            const r = parseAndNormalizeParams();
            expect(r.funnelId).toBe('abc123');
            expect(r.templateId).toBeNull();
        });
    });

    it('prioriza query param funnel sobre path', () => {
        withLocation('http://localhost/editor/abc123?funnel=xyz789', () => {
            const r = parseAndNormalizeParams();
            expect(r.funnelId).toBe('xyz789');
        });
    });

    it('identifica template se padrão conhecido em path', () => {
        withLocation('http://localhost/editor/quizTemplateX', () => {
            const r = parseAndNormalizeParams();
            expect(r.templateId).toBe('quizTemplateX');
            expect(r.funnelId).toBeNull();
        });
    });

    it('usa modo quiz quando há funnelId', () => {
        withLocation('http://localhost/editor/abc123', () => {
            const r = parseAndNormalizeParams();
            expect(r.mode).toBe('quiz');
        });
    });

    it('modo explicitamente forçado via query param', () => {
        withLocation('http://localhost/editor/abc123?mode=builder', () => {
            const r = parseAndNormalizeParams();
            expect(r.mode).toBe('builder');
        });
    });
});
