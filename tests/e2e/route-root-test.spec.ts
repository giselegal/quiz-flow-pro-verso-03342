/**
 * Teste automatizado do carregamento da rota "/"
 * 
 * Verifica:
 * - Página carrega sem erros
 * - Providers renderizam corretamente
 * - Componente Home é montado
 * - Não há erros de console
 */

import { test, expect } from '@playwright/test';

test.describe('Rota Raiz "/" - Carregamento e Erros', () => {
    let consoleErrors: string[] = [];
    let consoleWarnings: string[] = [];
    let networkErrors: string[] = [];

    test.beforeEach(async ({ page }) => {
        // Capturar erros de console
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            } else if (msg.type() === 'warning') {
                consoleWarnings.push(msg.text());
            }
        });

        // Capturar erros de rede
        page.on('requestfailed', (request) => {
            networkErrors.push(`${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
        });

        // Capturar erros não tratados
        page.on('pageerror', (error) => {
            consoleErrors.push(`Uncaught: ${error.message}`);
        });
    });

    test.afterEach(async () => {
        // Resetar arrays
        consoleErrors = [];
        consoleWarnings = [];
        networkErrors = [];
    });

    test('deve carregar a rota "/" sem erros de JavaScript', async ({ page }) => {
        await page.goto('http://localhost:8080/', { 
            waitUntil: 'networkidle',
            timeout: 30000
        });

        // Verificar se não há erros críticos
        const criticalErrors = consoleErrors.filter(err => 
            !err.includes('WebSocket') && // Ignorar erros de WebSocket (dev server)
            !err.includes('Failed to load resource') && // Ignorar recursos externos
            !err.includes('[HMR]') // Ignorar mensagens do HMR
        );

        if (criticalErrors.length > 0) {
            console.error('❌ ERROS DE CONSOLE ENCONTRADOS:');
            criticalErrors.forEach((err, i) => console.error(`  ${i + 1}. ${err}`));
        }

        expect(criticalErrors).toHaveLength(0);
    });

    test('deve renderizar o componente Home', async ({ page }) => {
        await page.goto('http://localhost:8080/');

        // Aguardar o loading desaparecer
        await page.waitForSelector('[data-testid="index-page"]', { 
            timeout: 15000,
            state: 'visible'
        });

        // Verificar se o componente foi renderizado
        const homePage = await page.locator('[data-testid="index-page"]');
        await expect(homePage).toBeVisible();
    });

    test('deve ter título da página configurado', async ({ page }) => {
        await page.goto('http://localhost:8080/');
        await page.waitForLoadState('domcontentloaded');

        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);
    });

    test('deve carregar sem erros de rede críticos', async ({ page }) => {
        await page.goto('http://localhost:8080/', { 
            waitUntil: 'networkidle',
            timeout: 30000
        });

        // Filtrar erros de rede críticos (ignorar fontes externas e recursos opcionais)
        const criticalNetworkErrors = networkErrors.filter(err =>
            !err.includes('fonts.googleapis.com') &&
            !err.includes('fonts.gstatic.com') &&
            !err.includes('.woff2') &&
            !err.includes('favicon')
        );

        if (criticalNetworkErrors.length > 0) {
            console.error('❌ ERROS DE REDE ENCONTRADOS:');
            criticalNetworkErrors.forEach((err, i) => console.error(`  ${i + 1}. ${err}`));
        }

        expect(criticalNetworkErrors).toHaveLength(0);
    });

    test('deve inicializar providers sem erros', async ({ page }) => {
        await page.goto('http://localhost:8080/');

        // Aguardar providers carregarem
        await page.waitForTimeout(2000);

        // Verificar se há erros relacionados a Context/Providers
        const providerErrors = consoleErrors.filter(err =>
            err.includes('Context') ||
            err.includes('Provider') ||
            err.includes('useContext') ||
            err.includes('must be used within')
        );

        if (providerErrors.length > 0) {
            console.error('❌ ERROS DE PROVIDER ENCONTRADOS:');
            providerErrors.forEach((err, i) => console.error(`  ${i + 1}. ${err}`));
        }

        expect(providerErrors).toHaveLength(0);
    });

    test('deve carregar estilos corretamente', async ({ page }) => {
        await page.goto('http://localhost:8080/');
        await page.waitForLoadState('domcontentloaded');

        // Verificar se o body tem estilos aplicados
        const body = await page.locator('body');
        const backgroundColor = await body.evaluate((el) => 
            window.getComputedStyle(el).backgroundColor
        );

        // Verificar que não está com cor padrão do navegador (branco puro)
        expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    });

    test('deve ter meta tags básicas', async ({ page }) => {
        await page.goto('http://localhost:8080/');

        // Verificar viewport
        const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
        expect(viewport).toContain('width=device-width');

        // Verificar charset
        const charset = await page.locator('meta[charset]').count();
        expect(charset).toBeGreaterThan(0);
    });

    test('relatório de erros e avisos', async ({ page }) => {
        await page.goto('http://localhost:8080/', { 
            waitUntil: 'networkidle',
            timeout: 30000
        });

        console.log('\n📊 RELATÓRIO DE DIAGNÓSTICO DA ROTA "/":\n');
        console.log(`✅ Total de erros de console: ${consoleErrors.length}`);
        console.log(`⚠️  Total de avisos: ${consoleWarnings.length}`);
        console.log(`🌐 Total de erros de rede: ${networkErrors.length}`);

        if (consoleErrors.length > 0) {
            console.log('\n❌ ERROS DE CONSOLE:');
            consoleErrors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
        }

        if (consoleWarnings.length > 0 && consoleWarnings.length <= 10) {
            console.log('\n⚠️  AVISOS (primeiros 10):');
            consoleWarnings.slice(0, 10).forEach((warn, i) => console.log(`  ${i + 1}. ${warn}`));
        }

        if (networkErrors.length > 0) {
            console.log('\n🌐 ERROS DE REDE:');
            networkErrors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
        }
    });
});
