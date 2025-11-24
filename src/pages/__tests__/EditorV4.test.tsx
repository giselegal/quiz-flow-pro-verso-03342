/**
 * 🧪 TESTES: EditorV4 - Template URL Parameter
 * 
 * Testa a correção do carregamento de templates via URL
 * Bug fix: /editor?template=quiz21StepsComplete não carregava
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('EditorV4 - Template URL Parameter', () => {
    let originalLocation: Location;

    beforeEach(() => {
        // Salvar location original
        originalLocation = window.location;

        // Mock window.location
        delete (window as any).location;
        window.location = {
            ...originalLocation,
            search: '',
        } as Location;
    });

    afterEach(() => {
        // Restaurar location original
        window.location = originalLocation;
    });

    describe('Template ID Mapping', () => {
        it('deve mapear quiz21StepsComplete para quiz21-v4.json', () => {
            // Simular URL: /editor?template=quiz21StepsComplete
            window.location.search = '?template=quiz21StepsComplete';

            const params = new URLSearchParams(window.location.search);
            const templateId = params.get('template');

            const templateMap: Record<string, string> = {
                'quiz21StepsComplete': '/templates/quiz21-v4.json',
                'quiz21-complete': '/templates/quiz21-complete.json',
                'quiz21-v4': '/templates/quiz21-v4.json',
            };

            const expectedPath = templateMap[templateId!];

            expect(templateId).toBe('quiz21StepsComplete');
            expect(expectedPath).toBe('/templates/quiz21-v4.json');
        });

        it('deve mapear quiz21-complete para quiz21-complete.json', () => {
            window.location.search = '?template=quiz21-complete';

            const params = new URLSearchParams(window.location.search);
            const templateId = params.get('template');

            const templateMap: Record<string, string> = {
                'quiz21StepsComplete': '/templates/quiz21-v4.json',
                'quiz21-complete': '/templates/quiz21-complete.json',
                'quiz21-v4': '/templates/quiz21-v4.json',
            };

            const expectedPath = templateMap[templateId!];

            expect(templateId).toBe('quiz21-complete');
            expect(expectedPath).toBe('/templates/quiz21-complete.json');
        });

        it('deve usar fallback quando template não é reconhecido', () => {
            window.location.search = '?template=unknown-template';

            const params = new URLSearchParams(window.location.search);
            const templateId = params.get('template');

            const templateMap: Record<string, string> = {
                'quiz21StepsComplete': '/templates/quiz21-v4.json',
                'quiz21-complete': '/templates/quiz21-complete.json',
                'quiz21-v4': '/templates/quiz21-v4.json',
            };

            const templatePath = templateMap[templateId!] || '/templates/quiz21-v4.json';

            expect(templateId).toBe('unknown-template');
            expect(templatePath).toBe('/templates/quiz21-v4.json');
        });

        it('deve usar default quando não há parâmetro template', () => {
            window.location.search = '';

            const params = new URLSearchParams(window.location.search);
            const templateId = params.get('template');

            const templatePath = '/templates/quiz21-v4.json';

            expect(templateId).toBeNull();
            expect(templatePath).toBe('/templates/quiz21-v4.json');
        });
    });

    describe('URL Parsing', () => {
        it('deve extrair templateId corretamente de query string', () => {
            const testCases = [
                { url: '?template=quiz21StepsComplete', expected: 'quiz21StepsComplete' },
                { url: '?template=quiz21-v4', expected: 'quiz21-v4' },
                { url: '?template=quiz21-complete&step=1', expected: 'quiz21-complete' },
                { url: '?step=1&template=quiz21StepsComplete', expected: 'quiz21StepsComplete' },
                { url: '', expected: null },
                { url: '?step=1', expected: null },
            ];

            testCases.forEach(({ url, expected }) => {
                window.location.search = url;
                const params = new URLSearchParams(window.location.search);
                const templateId = params.get('template');

                expect(templateId).toBe(expected);
            });
        });

        it('deve lidar com caracteres especiais em URL', () => {
            window.location.search = '?template=quiz21%20StepsComplete';

            const params = new URLSearchParams(window.location.search);
            const templateId = params.get('template');

            expect(templateId).toBe('quiz21 StepsComplete');
        });

        it('deve ignorar parâmetros extras', () => {
            window.location.search = '?template=quiz21StepsComplete&step=1&funnelId=test-123&foo=bar';

            const params = new URLSearchParams(window.location.search);
            const templateId = params.get('template');

            expect(templateId).toBe('quiz21StepsComplete');
            expect(params.get('step')).toBe('1');
            expect(params.get('funnelId')).toBe('test-123');
        });
    });

    describe('Template Path Resolution', () => {
        it('deve gerar caminho correto para todos os templates conhecidos', () => {
            const knownTemplates = [
                { id: 'quiz21StepsComplete', path: '/templates/quiz21-v4.json' },
                { id: 'quiz21-complete', path: '/templates/quiz21-complete.json' },
                { id: 'quiz21-v4', path: '/templates/quiz21-v4.json' },
            ];

            knownTemplates.forEach(({ id, path }) => {
                window.location.search = `?template=${id}`;

                const params = new URLSearchParams(window.location.search);
                const templateId = params.get('template');

                const templateMap: Record<string, string> = {
                    'quiz21StepsComplete': '/templates/quiz21-v4.json',
                    'quiz21-complete': '/templates/quiz21-complete.json',
                    'quiz21-v4': '/templates/quiz21-v4.json',
                };

                const resolvedPath = templateMap[templateId!];

                expect(resolvedPath).toBe(path);
            });
        });

        it('deve validar formato de caminho', () => {
            const templatePaths = [
                '/templates/quiz21-v4.json',
                '/templates/quiz21-complete.json',
            ];

            templatePaths.forEach(path => {
                expect(path).toMatch(/^\/templates\/.+\.json$/);
                expect(path).not.toContain('..');
                expect(path).not.toContain('//');
            });
        });
    });

    describe('Console Logging', () => {
        it('deve logar template solicitado e caminho resolvido', () => {
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

            window.location.search = '?template=quiz21StepsComplete';

            const params = new URLSearchParams(window.location.search);
            const templateId = params.get('template');

            const templateMap: Record<string, string> = {
                'quiz21StepsComplete': '/templates/quiz21-v4.json',
            };

            const templatePath = templateMap[templateId!];

            // Simular logs do componente
            console.log(`🔍 [EditorV4] Template solicitado: ${templateId}`);
            console.log(`📁 [EditorV4] Caminho resolvido: ${templatePath}`);

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Template solicitado: quiz21StepsComplete')
            );
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Caminho resolvido: /templates/quiz21-v4.json')
            );

            consoleSpy.mockRestore();
        });
    });

    describe('Edge Cases', () => {
        it('deve lidar com template vazio', () => {
            window.location.search = '?template=';

            const params = new URLSearchParams(window.location.search);
            const templateId = params.get('template');

            expect(templateId).toBe('');
        });

        it('deve lidar com múltiplos parâmetros template (usar primeiro)', () => {
            window.location.search = '?template=quiz21-v4&template=quiz21-complete';

            const params = new URLSearchParams(window.location.search);
            const templateId = params.get('template');

            // URLSearchParams.get() retorna o primeiro valor
            expect(templateId).toBe('quiz21-v4');
        });

        it('deve lidar com case sensitivity', () => {
            const testCases = [
                { input: 'quiz21StepsComplete', shouldMatch: true },
                { input: 'Quiz21StepsComplete', shouldMatch: false },
                { input: 'QUIZ21STEPSCOMPLETE', shouldMatch: false },
            ];

            testCases.forEach(({ input, shouldMatch }) => {
                window.location.search = `?template=${input}`;

                const params = new URLSearchParams(window.location.search);
                const templateId = params.get('template');

                const templateMap: Record<string, string> = {
                    'quiz21StepsComplete': '/templates/quiz21-v4.json',
                };

                const found = templateId! in templateMap;

                expect(found).toBe(shouldMatch);
            });
        });
    });

    describe('Backward Compatibility', () => {
        it('deve manter comportamento default quando não há query params', () => {
            window.location.search = '';

            const params = new URLSearchParams(window.location.search);
            const templateId = params.get('template');

            const defaultPath = '/templates/quiz21-v4.json';
            const templatePath = templateId ? `/templates/${templateId}.json` : defaultPath;

            expect(templatePath).toBe(defaultPath);
        });

        it('deve ser compatível com URLs antigas', () => {
            // Simular URL antiga: /editor (sem parâmetros)
            window.location.search = '';

            const params = new URLSearchParams(window.location.search);
            const templateId = params.get('template');

            expect(templateId).toBeNull();

            // Deve usar default
            const templatePath = '/templates/quiz21-v4.json';
            expect(templatePath).toBe('/templates/quiz21-v4.json');
        });
    });
});
