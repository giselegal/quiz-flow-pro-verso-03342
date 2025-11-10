/**
 * 🏥 SUITE 01 - HEALTH CHECK DA APLICAÇÃO
 * 
 * Testes fundamentais para verificar a saúde da aplicação:
 * - Aplicação inicializa corretamente
 * - Recursos estáticos carregam
 * - Não há erros críticos no console
 * - Tempo de carregamento aceitável
 * 
 * @module tests/e2e/suite-01-app-health
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';
const TIMEOUT = 15000;

test.describe('🏥 Suite 01: Health Check da Aplicação', () => {

    test('deve carregar a aplicação sem erros críticos no console', async ({ page }) => {
        const errors: string[] = [];
        
        // Capturar erros do console
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        // Capturar erros de página
        page.on('pageerror', error => {
            errors.push(error.message);
        });

        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
        
        // Aguardar um pouco para capturar erros assíncronos
        await page.waitForTimeout(2000);

        // Filtrar erros conhecidos/aceitáveis
        const criticalErrors = errors.filter(err => 
            !err.includes('Warning:') && 
            !err.includes('favicon') &&
            !err.includes('DevTools')
        );

        expect(criticalErrors.length).toBe(0);
        console.log('✅ Aplicação carregou sem erros críticos');
    });

    test('deve carregar recursos estáticos (CSS, JS)', async ({ page }) => {
        const failedRequests: string[] = [];

        page.on('requestfailed', request => {
            const url = request.url();
            if (url.includes('.css') || url.includes('.js')) {
                failedRequests.push(url);
            }
        });

        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        expect(failedRequests.length).toBe(0);
        console.log('✅ Todos os recursos estáticos carregaram com sucesso');
    });

    test('deve ter tempo de carregamento aceitável', async ({ page }) => {
        const startTime = Date.now();
        
        await page.goto(BASE_URL);
        await page.waitForLoadState('domcontentloaded');
        
        const loadTime = Date.now() - startTime;

        expect(loadTime).toBeLessThan(TIMEOUT);
        console.log(`✅ Tempo de carregamento: ${loadTime}ms`);
    });

    test('deve ter elementos React montados', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        // Verificar que o React montou a aplicação
        const root = page.locator('#root');
        await expect(root).toBeVisible();
        
        // Aguardar um pouco para garantir que o conteúdo renderizou
        await page.waitForTimeout(1000);
        
        const rootChildren = await root.locator('> *').count();
        expect(rootChildren).toBeGreaterThan(0);

        console.log('✅ Aplicação React montada corretamente');
    });

    test('deve ter meta tags essenciais', async ({ page }) => {
        await page.goto(BASE_URL);

        // Verificar viewport
        const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
        expect(viewport).toContain('width=device-width');

        // Verificar charset
        const charset = await page.evaluate(() => {
            return document.characterSet;
        });
        expect(charset.toLowerCase()).toBe('utf-8');

        console.log('✅ Meta tags essenciais presentes');
    });

    test('deve responder a interações básicas', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        // Verificar que a página responde a cliques
        const clickableElements = await page.locator('button, a[href], [role="button"]').count();
        expect(clickableElements).toBeGreaterThan(0);

        console.log(`✅ Página tem ${clickableElements} elementos interativos`);
    });
});
