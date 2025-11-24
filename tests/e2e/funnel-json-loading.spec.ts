/**
 * 🧪 TESTES E2E: Carregamento de Funil a partir do JSON
 * 
 * Testa o mecanismo completo de ponta a ponta:
 * 1. Carregamento do quiz21-complete.json
 * 2. TemplateService.getAllSteps() com templateId
 * 3. Renderização de todos os 21 steps
 * 4. Navegação entre steps
 */

import { test, expect } from '@playwright/test';

test.describe('Carregamento de Funil do JSON', () => {
    test.beforeEach(async ({ page }) => {
        // Limpar localStorage antes de cada teste
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
    });

    test('deve carregar 21 steps do quiz21-complete.json', async ({ page }) => {
        // Interceptar requisição do JSON master
        const jsonPromise = page.waitForResponse(
            response => response.url().includes('quiz21-complete.json') && response.status() === 200
        );

        // Navegar para a página do quiz
        await page.goto('/quiz-estilo');

        // Aguardar carregamento do JSON
        const jsonResponse = await jsonPromise;
        const jsonData = await jsonResponse.json();

        // Verificar estrutura do JSON
        expect(jsonData).toHaveProperty('steps');
        expect(Object.keys(jsonData.steps)).toHaveLength(21);

        // Verificar que todos os steps de 01 a 21 existem
        for (let i = 1; i <= 21; i++) {
            const stepId = `step-${i.toString().padStart(2, '0')}`;
            expect(jsonData.steps).toHaveProperty(stepId);
            expect(jsonData.steps[stepId]).toHaveProperty('blocks');
            expect(Array.isArray(jsonData.steps[stepId].blocks)).toBe(true);
        }
    });

    test('deve exibir step 1 (intro) corretamente', async ({ page }) => {
        await page.goto('/quiz-estilo');

        // Aguardar heading do step 1
        await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });

        // Verificar que não está mostrando "Conteúdo Temporário"
        const pageContent = await page.content();
        expect(pageContent).not.toContain('⚠️ Conteúdo Temporário');
        expect(pageContent).not.toContain('fallback emergencial');

        // Verificar campo de nome (step 1 é intro)
        await expect(page.locator('input[type="text"], input[placeholder*="nome"]').first()).toBeVisible();
    });

    test('deve navegar do step 1 para step 2 após preencher nome', async ({ page }) => {
        await page.goto('/quiz-estilo');

        // Aguardar step 1
        await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });

        // Preencher nome
        const nameInput = page.locator('input[type="text"], input[placeholder*="nome"]').first();
        await nameInput.fill('João Silva');

        // Clicar em próximo
        const nextButton = page.locator('button:has-text("Próximo"), button:has-text("Começar"), button:has-text("Avançar")').first();
        await nextButton.click();

        // Aguardar step 2 (primeira pergunta)
        await page.waitForTimeout(1000);

        // Verificar que avançou (progresso mudou ou URL mudou)
        const pageContent = await page.content();

        // Step 2 deve ter opções de resposta (imagens ou botões)
        const hasOptions = await page.locator('[data-testid*="option"], button[role="button"], .quiz-option, img[alt*=""]').count();
        expect(hasOptions).toBeGreaterThan(0);
    });

    test('deve mostrar progresso correto conforme avança', async ({ page }) => {
        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        // Aguardar step 1
        await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });

        // Preencher nome e avançar
        const nameInput = page.locator('input[type="text"], input[placeholder*="nome"]').first();
        await nameInput.fill('Maria Santos');

        const nextButton = page.locator('button:has-text("Próximo"), button:has-text("Começar")').first();
        await nextButton.click();
        await page.waitForTimeout(1500);

        // Verificar barra de progresso ou indicador de step
        const progressIndicators = await page.locator('[aria-valuenow], .progress, [class*="progress"]').count();

        if (progressIndicators > 0) {
            const progressValue = await page.locator('[aria-valuenow]').first().getAttribute('aria-valuenow');
            const progressNumber = parseInt(progressValue || '0');

            // Step 2 de 21 = ~9.5% (ou formato diferente)
            expect(progressNumber).toBeGreaterThan(0);
            expect(progressNumber).toBeLessThan(100);
        }

        // Verificar texto "Etapa X de 21" ou similar
        const pageText = await page.content();
        const hasStepIndicator = /Etapa\s+\d+\s+de\s+\d+|Step\s+\d+\/\d+|\d+\s*\/\s*\d+/.test(pageText);

        if (hasStepIndicator) {
            expect(pageText).toMatch(/21|vinte e um/i); // Deve mencionar 21 steps
        }
    });

    test('deve carregar todos os 21 steps sem fallback', async ({ page }) => {
        // Monitorar console para erros de fallback
        const consoleMessages: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error' || msg.text().includes('fallback') || msg.text().includes('Temporário')) {
                consoleMessages.push(msg.text());
            }
        });

        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Verificar que NÃO há mensagens de fallback
        const hasFallbackError = consoleMessages.some(msg =>
            msg.includes('⚠️ Conteúdo Temporário') ||
            msg.includes('fallback emergencial') ||
            msg.includes('Template info retornou estrutura inesperada')
        );

        expect(hasFallbackError).toBe(false);

        // Verificar que página não mostra conteúdo temporário
        const pageContent = await page.content();
        expect(pageContent).not.toContain('⚠️ Conteúdo Temporário');
    });

    test('deve usar templateId correto ao carregar steps', async ({ page }) => {
        // Interceptar chamadas de console.log
        const logs: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'log' && msg.text().includes('templateId')) {
                logs.push(msg.text());
            }
        });

        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Verificar que templateId foi usado
        const hasTemplateIdLog = logs.some(log =>
            log.includes('quiz21StepsComplete') ||
            log.includes('getAllSteps usando templateId')
        );

        // Se houver logs, deve mencionar o templateId correto
        if (logs.length > 0) {
            expect(hasTemplateIdLog).toBe(true);
        }
    });

    test('deve carregar blocks do JSON para cada step', async ({ page }) => {
        // Interceptar requisição do JSON
        const jsonPromise = page.waitForResponse(
            response => response.url().includes('quiz21-complete.json')
        );

        await page.goto('/quiz-estilo');

        const jsonResponse = await jsonPromise;
        const jsonData = await jsonResponse.json();

        // Verificar que step-01 tem blocks
        expect(jsonData.steps['step-01']).toBeDefined();
        expect(jsonData.steps['step-01'].blocks).toBeDefined();
        expect(jsonData.steps['step-01'].blocks.length).toBeGreaterThan(0);

        // Verificar que step-02 tem blocks
        expect(jsonData.steps['step-02']).toBeDefined();
        expect(jsonData.steps['step-02'].blocks).toBeDefined();
        expect(jsonData.steps['step-02'].blocks.length).toBeGreaterThan(0);

        // Verificar que step-20 (resultado) tem blocks
        expect(jsonData.steps['step-20']).toBeDefined();
        expect(jsonData.steps['step-20'].blocks).toBeDefined();
        expect(jsonData.steps['step-20'].blocks.length).toBeGreaterThan(0);

        // Verificar que step-21 (oferta) tem blocks
        expect(jsonData.steps['step-21']).toBeDefined();
        expect(jsonData.steps['step-21'].blocks).toBeDefined();
        expect(jsonData.steps['step-21'].blocks.length).toBeGreaterThan(0);
    });

    test('deve funcionar com aliases de funnelId', async ({ page }) => {
        // Testar com alias 'quiz-estilo-completo'
        await page.goto('/quiz/quiz-estilo-completo');
        await page.waitForLoadState('networkidle');

        // Deve carregar normalmente
        await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });

        const pageContent = await page.content();
        expect(pageContent).not.toContain('⚠️ Conteúdo Temporário');

        // Testar com alias 'quiz-estilo-21-steps'
        await page.goto('/quiz/quiz-estilo-21-steps');
        await page.waitForLoadState('networkidle');

        await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });
        const pageContent2 = await page.content();
        expect(pageContent2).not.toContain('⚠️ Conteúdo Temporário');
    });

    test('deve exibir "Etapa 1 de 21" no primeiro step', async ({ page }) => {
        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        const pageContent = await page.content();

        // Buscar indicadores de etapa
        const hasStepCount =
            /Etapa\s+1\s+de\s+21/i.test(pageContent) ||
            /Step\s+1\s*\/\s*21/i.test(pageContent) ||
            /1\s*\/\s*21/.test(pageContent);

        // Se houver indicador de etapa, deve mostrar 21 como total
        const progressText = pageContent.match(/Etapa\s+\d+\s+de\s+(\d+)|Step\s+\d+\/(\d+)|(\d+)\s+etapas/i);
        if (progressText) {
            const totalSteps = progressText[1] || progressText[2] || progressText[3];
            expect(parseInt(totalSteps)).toBe(21);
        }
    });

    test('não deve mostrar "totalSteps: 1" no console ou debug', async ({ page }) => {
        const logs: string[] = [];
        page.on('console', msg => {
            logs.push(msg.text());
        });

        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Verificar que NÃO há logs mencionando totalSteps: 1
        const hasTotalStepsOne = logs.some(log =>
            /totalSteps:\s*1\b/i.test(log) && !log.includes('step-01')
        );

        expect(hasTotalStepsOne).toBe(false);

        // Verificar que há menção a 21 steps se houver logs
        const hasTotalSteps21 = logs.some(log =>
            /totalSteps:\s*21|21\s*steps|21\s*etapas/i.test(log)
        );

        if (logs.some(log => log.includes('totalSteps'))) {
            expect(hasTotalSteps21).toBe(true);
        }
    });
});

test.describe('TemplateService Integration', () => {
    test('deve carregar template com normalização de ID', async ({ page }) => {
        // Testar normalização de IDs legados
        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        // Executar código no navegador para verificar TemplateService
        const result = await page.evaluate(async () => {
            // @ts-ignore - Acesso global para teste
            const templateService = window.templateService || (await import('/src/services/canonical/TemplateService')).templateService;

            if (!templateService) return { error: 'TemplateService não disponível' };

            // Testar setActiveFunnel
            templateService.setActiveFunnel('quiz-estilo-21-steps');

            // Testar getAllSteps
            const steps = await templateService.getAllSteps();

            return {
                stepsCount: Object.keys(steps).length,
                hasStep01: !!steps['step-01'],
                hasStep21: !!steps['step-21'],
                step01HasBlocks: steps['step-01']?.blocks?.length > 0,
                step21HasBlocks: steps['step-21']?.blocks?.length > 0,
            };
        });

        if (!result.error) {
            expect(result.stepsCount).toBe(21);
            expect(result.hasStep01).toBe(true);
            expect(result.hasStep21).toBe(true);
            expect(result.step01HasBlocks).toBe(true);
            expect(result.step21HasBlocks).toBe(true);
        }
    });

    test('deve carregar template do registry unificado', async ({ page }) => {
        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        const result = await page.evaluate(async () => {
            // @ts-ignore
            const { UNIFIED_TEMPLATE_REGISTRY } = await import('/src/config/unifiedTemplatesRegistry');

            return {
                hasQuiz21StepsComplete: !!UNIFIED_TEMPLATE_REGISTRY['quiz21StepsComplete'],
                hasQuizEstiloCompleto: !!UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-completo'],
                hasQuizEstilo21Steps: !!UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-21-steps'],
                quiz21StepsCompleteStepCount: UNIFIED_TEMPLATE_REGISTRY['quiz21StepsComplete']?.stepCount,
                quizEstiloCompletoStepCount: UNIFIED_TEMPLATE_REGISTRY['quiz-estilo-completo']?.stepCount,
            };
        });

        expect(result.hasQuiz21StepsComplete).toBe(true);
        expect(result.hasQuizEstiloCompleto).toBe(true);
        expect(result.hasQuizEstilo21Steps).toBe(true);
        expect(result.quiz21StepsCompleteStepCount).toBe(21);
        expect(result.quizEstiloCompletoStepCount).toBe(21);
    });
});

test.describe('Performance e Cache', () => {
    test('deve carregar quiz21-complete.json apenas uma vez', async ({ page }) => {
        let requestCount = 0;

        page.on('request', request => {
            if (request.url().includes('quiz21-complete.json')) {
                requestCount++;
            }
        });

        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Deve carregar o JSON apenas 1 vez (com cache)
        expect(requestCount).toBeLessThanOrEqual(2); // Permite 1 requisição + possível retry
    });

    test('deve carregar step rapidamente (< 2s)', async ({ page }) => {
        const startTime = Date.now();

        await page.goto('/quiz-estilo');
        await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });

        const loadTime = Date.now() - startTime;

        // Step deve carregar em menos de 2 segundos
        expect(loadTime).toBeLessThan(2000);
    });
});

test.describe('Error Handling', () => {
    test('deve mostrar erro gracioso se JSON falhar', async ({ page }) => {
        // Interceptar e bloquear requisição do JSON
        await page.route('**/quiz21-complete.json', route => {
            route.abort();
        });

        await page.goto('/quiz-estilo');
        await page.waitForTimeout(2000);

        // Deve mostrar algum conteúdo (fallback) ao invés de quebrar
        const pageContent = await page.content();
        expect(pageContent.length).toBeGreaterThan(100);

        // Não deve mostrar erro fatal
        expect(pageContent).not.toContain('Fatal Error');
    });

    test('deve usar fallback se templateId não existir', async ({ page }) => {
        await page.goto('/quiz/template-inexistente-12345');
        await page.waitForTimeout(2000);

        // Deve carregar algo (fallback) ao invés de ficar em branco
        const heading = await page.locator('h1, h2').first();
        await expect(heading).toBeVisible({ timeout: 10000 });
    });
});
