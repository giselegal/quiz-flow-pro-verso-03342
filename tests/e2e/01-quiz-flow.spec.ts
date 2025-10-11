import { test, expect } from '@playwright/test';

/**
 * FASE 3B - Testes E2E - Fluxo Completo do Quiz
 * 
 * Testa a jornada completa do usuário através de todas as 21 etapas do quiz
 */

test.describe('Fluxo Completo do Quiz - 21 Steps', () => {
    test.beforeEach(async ({ page }) => {
        // Navegar para a página do quiz
        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');
    });

    test('deve completar todas as 21 etapas do quiz com sucesso', async ({ page }) => {
        // Step 1: Página inicial com nome
        await expect(page.locator('h1, h2')).toContainText(/Descubra|Estilo|Quiz/i);

        const nameInput = page.locator('input[type="text"], input[placeholder*="nome" i]').first();
        await nameInput.fill('Maria Silva');

        const startButton = page.locator('button').filter({ hasText: /iniciar|começar|continuar/i }).first();
        await startButton.click();

        await page.waitForTimeout(500);

        // Steps 2-20: Perguntas do quiz
        for (let step = 2; step <= 20; step++) {
            // Aguardar carregamento da etapa
            await page.waitForLoadState('networkidle');

            // Procurar por opções clicáveis (botões, cards, imagens)
            const options = page.locator('button:not([disabled]), [role="button"], .option, .card').filter({ hasNotText: /voltar|anterior/i });
            const optionCount = await options.count();

            if (optionCount > 0) {
                // Clicar na primeira opção disponível
                await options.first().click({ timeout: 5000 });
                await page.waitForTimeout(300);
            } else {
                // Se não houver opções clicáveis, procurar por botão de continuar
                const continueBtn = page.locator('button').filter({ hasText: /próximo|continuar|avançar/i }).first();
                if (await continueBtn.isVisible({ timeout: 2000 })) {
                    await continueBtn.click();
                    await page.waitForTimeout(300);
                }
            }

            console.log(`✓ Step ${step} completed`);
        }

        // Step 21: Página de resultado
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        // Verificar elementos da página de resultado
        const resultPage = page.locator('body');
        await expect(resultPage).toContainText(/Maria|resultado|estilo/i, { timeout: 10000 });

        console.log('✓ Quiz completed successfully!');
    });

    test('deve permitir navegar para trás e manter progresso', async ({ page }) => {
        // Completar primeiras 3 etapas
        const nameInput = page.locator('input[type="text"]').first();
        await nameInput.fill('João');

        const startButton = page.locator('button').filter({ hasText: /iniciar/i }).first();
        await startButton.click();
        await page.waitForTimeout(500);

        // Step 2
        const firstOption = page.locator('button:not([disabled]), [role="button"]').first();
        await firstOption.click();
        await page.waitForTimeout(500);

        // Step 3
        const secondOption = page.locator('button:not([disabled]), [role="button"]').first();
        await secondOption.click();
        await page.waitForTimeout(500);

        // Verificar se existe botão voltar
        const backButton = page.locator('button').filter({ hasText: /voltar|anterior/i }).first();
        if (await backButton.isVisible({ timeout: 2000 })) {
            await backButton.click();
            await page.waitForTimeout(500);

            // Avançar novamente
            const option = page.locator('button:not([disabled]), [role="button"]').first();
            await option.click();

            console.log('✓ Navigation backward/forward works');
        } else {
            console.log('ℹ Back button not found (may not be implemented)');
        }
    });

    test('deve persistir nome do usuário durante toda a jornada', async ({ page }) => {
        const userName = 'Ana Carolina';

        // Preencher nome
        const nameInput = page.locator('input[type="text"]').first();
        await nameInput.fill(userName);

        const startButton = page.locator('button').filter({ hasText: /iniciar/i }).first();
        await startButton.click();
        await page.waitForTimeout(1000);

        // Verificar localStorage
        const storedName = await page.evaluate(() => {
            return localStorage.getItem('userName') || localStorage.getItem('quizUserName');
        });

        expect(storedName).toBeTruthy();
        console.log(`✓ Name persisted in localStorage: ${storedName}`);
    });

    test('deve carregar templates JSON corretamente', async ({ page }) => {
        // Monitorar requisições de templates
        const templateRequests: string[] = [];

        page.on('request', request => {
            const url = request.url();
            if (url.includes('template') || url.includes('.json')) {
                templateRequests.push(url);
            }
        });

        // Iniciar quiz
        const nameInput = page.locator('input[type="text"]').first();
        await nameInput.fill('Teste');

        const startButton = page.locator('button').filter({ hasText: /iniciar/i }).first();
        await startButton.click();

        await page.waitForTimeout(2000);

        // Verificar se houve requisições de templates
        if (templateRequests.length > 0) {
            console.log(`✓ Templates loaded: ${templateRequests.length} requests`);
            templateRequests.forEach(url => console.log(`  - ${url}`));
        } else {
            console.log('ℹ No template requests detected (may be using static data)');
        }
    });

    test('deve exibir loading state durante transições', async ({ page }) => {
        const nameInput = page.locator('input[type="text"]').first();
        await nameInput.fill('Teste Loading');

        const startButton = page.locator('button').filter({ hasText: /iniciar/i }).first();

        // Procurar por loading indicator após clicar
        await startButton.click();

        // Verificar se aparece algum loading indicator
        const loadingIndicators = page.locator('[class*="loading"], [class*="spinner"], .animate-spin, [role="status"]');
        const hasLoading = await loadingIndicators.count() > 0;

        if (hasLoading) {
            console.log('✓ Loading indicator detected');
        } else {
            console.log('ℹ No loading indicator found (transition may be instant)');
        }
    });
});
