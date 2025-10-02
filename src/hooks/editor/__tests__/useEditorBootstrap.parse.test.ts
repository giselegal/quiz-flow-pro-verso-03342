import { describe, it, expect, beforeEach } from 'vitest';
import { parseAndNormalizeParams } from '../useEditorBootstrap';

// Util para mockar window location
function withLocation(url: string, fn: () => void) {
    const oldHref = window.location.href;
    const newUrl = new URL(url);
    // @ts-ignore sobrescrevendo propriedades específicas
    Object.assign(window.location, {
        href: newUrl.href,
        pathname: newUrl.pathname,
        search: newUrl.search,
        hash: newUrl.hash
    });
    try { fn(); } finally {
        // @ts-ignore revert
        Object.assign(window.location, { href: oldHref });
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
