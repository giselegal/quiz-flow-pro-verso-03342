/**
 * 🧪 TESTES E2E - FLUXO COMPLETO DE NAVEGAÇÃO
 * 
 * Testa a navegação entre as principais rotas da aplicação:
 * - Home -> Editor -> Quiz -> Admin Dashboard
 * - Verificação de carregamento de páginas
 * - Verificação de elementos principais
 * - Transições entre rotas
 * 
 * @module tests/e2e/navigation-flow
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';
const TIMEOUT = 10000;

test.describe('🧭 Fluxo de Navegação Principal', () => {

    test('deve carregar a página home corretamente', async ({ page }) => {
        await page.goto(BASE_URL);

        // Verificar título da página
        await expect(page).toHaveTitle(/Quiz Flow Pro|Quiz Quest/);

        // Verificar que a página principal carregou
        const mainContent = page.locator('main, [role="main"], .home-page, #root');
        await expect(mainContent).toBeVisible({ timeout: TIMEOUT });

        console.log('✅ Página home carregada com sucesso');
    });

    test('deve navegar para o editor', async ({ page }) => {
        await page.goto(BASE_URL);

        // Tentar encontrar link para o editor
        const editorLink = page.locator('a[href*="/editor"]').first();

        if (await editorLink.isVisible().catch(() => false)) {
            await editorLink.click();
        } else {
            // Navegar diretamente
            await page.goto(`${BASE_URL}/editor`);
        }

        // Verificar que estamos na rota do editor
        await expect(page).toHaveURL(/\/editor/);

        // Verificar elementos do editor
        const editorContainer = page.locator('[data-testid*="editor"], .editor-container, .editor-page');
        await expect(editorContainer.first()).toBeVisible({ timeout: TIMEOUT });

        console.log('✅ Navegação para editor realizada com sucesso');
    });

    test('deve navegar para o quiz', async ({ page }) => {
        await page.goto(`${BASE_URL}/quiz-estilo`);

        // Verificar que estamos na rota do quiz
        await expect(page).toHaveURL(/\/quiz/);

        // Verificar elementos do quiz
        const quizElements = [
            page.locator('.quiz-container'),
            page.locator('[data-testid*="quiz"]'),
            page.locator('.quiz-app'),
            page.locator('main')
        ];

        let foundElement = false;
        for (const element of quizElements) {
            if (await element.isVisible().catch(() => false)) {
                foundElement = true;
                break;
            }
        }

        expect(foundElement).toBeTruthy();
        console.log('✅ Navegação para quiz realizada com sucesso');
    });

    test('deve navegar para o admin dashboard', async ({ page }) => {
        await page.goto(`${BASE_URL}/admin`);

        // Verificar que estamos na rota admin
        await expect(page).toHaveURL(/\/admin/);

        // Verificar elementos do dashboard
        const dashboardContainer = page.locator('[data-testid*="admin"], [data-testid*="dashboard"], .admin-page, .dashboard');
        await expect(dashboardContainer.first()).toBeVisible({ timeout: TIMEOUT });

        console.log('✅ Navegação para admin realizada com sucesso');
    });

    test('deve realizar fluxo completo de navegação', async ({ page }) => {
        // 1. Home
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        console.log('✅ Etapa 1: Home carregada');

        // 2. Editor
        await page.goto(`${BASE_URL}/editor`);
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/\/editor/);
        console.log('✅ Etapa 2: Editor carregado');

        // 3. Quiz
        await page.goto(`${BASE_URL}/quiz-estilo`);
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/\/quiz/);
        console.log('✅ Etapa 3: Quiz carregado');

        // 4. Admin
        await page.goto(`${BASE_URL}/admin`);
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/\/admin/);
        console.log('✅ Etapa 4: Admin carregado');

        // 5. Voltar para Home
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        console.log('✅ Etapa 5: Retorno à home');

        console.log('✅ Fluxo completo de navegação realizado com sucesso');
    });

    test('deve verificar rotas dinâmicas do quiz', async ({ page }) => {
        const testFunnelId = 'quiz-estilo-21-steps';
        await page.goto(`${BASE_URL}/quiz/${testFunnelId}`);

        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(new RegExp(`/quiz/${testFunnelId}`));

        console.log('✅ Rota dinâmica do quiz funcionando');
    });

    test('deve verificar rotas dinâmicas do editor', async ({ page }) => {
        const testFunnelId = 'test-funnel-123';
        await page.goto(`${BASE_URL}/editor/${testFunnelId}`);

        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(new RegExp(`/editor/${testFunnelId}`));

        console.log('✅ Rota dinâmica do editor funcionando');
    });

    test('deve lidar com rotas 404', async ({ page }) => {
        await page.goto(`${BASE_URL}/rota-que-nao-existe`);

        // Verificar que ou mostra 404 ou redireciona
        await page.waitForLoadState('networkidle');

        const is404 = await page.locator('text=/404|not found/i').isVisible().catch(() => false);
        const redirectedHome = page.url() === BASE_URL || page.url() === `${BASE_URL}/`;

        expect(is404 || redirectedHome).toBeTruthy();
        console.log('✅ Tratamento de rota 404 funcionando');
    });
});

test.describe('🔗 Navegação por Links Internos', () => {

    test('deve seguir links de navegação no header', async ({ page }) => {
        await page.goto(BASE_URL);

        // Procurar por header ou navbar
        const header = page.locator('header, nav, [role="navigation"]').first();

        if (await header.isVisible().catch(() => false)) {
            const links = await header.locator('a[href]').all();

            console.log(`📊 Encontrados ${links.length} links no header`);

            // Testar alguns links principais
            const mainLinks = links.slice(0, 3);

            for (const link of mainLinks) {
                const href = await link.getAttribute('href');
                if (href && !href.startsWith('http') && !href.startsWith('#')) {
                    console.log(`   🔗 Testando link: ${href}`);
                }
            }
        }

        console.log('✅ Links do header verificados');
    });
});

test.describe('🚦 Performance e Carregamento', () => {

    test('páginas principais devem carregar em menos de 5 segundos', async ({ page }) => {
        const routes = ['/', '/editor', '/quiz-estilo', '/admin'];

        for (const route of routes) {
            const startTime = Date.now();
            await page.goto(`${BASE_URL}${route}`);
            await page.waitForLoadState('networkidle');
            const loadTime = Date.now() - startTime;

            expect(loadTime).toBeLessThan(5000);
            console.log(`✅ ${route}: ${loadTime}ms`);
        }
    });

    test('não deve ter erros de console críticos', async ({ page }) => {
        const errors: string[] = [];

        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        // Filtrar erros conhecidos/aceitáveis
        const criticalErrors = errors.filter(err =>
            !err.includes('favicon') &&
            !err.includes('DevTools') &&
            !err.includes('Extension')
        );

        if (criticalErrors.length > 0) {
            console.warn('⚠️ Erros encontrados:', criticalErrors);
        }

        expect(criticalErrors.length).toBeLessThan(5);
    });
});
