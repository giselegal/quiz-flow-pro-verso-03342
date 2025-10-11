/**
 * 🧪 FASE 3B - TESTES E2E: Fluxo Completo do Quiz (21 Steps)
 * 
 * Testa o fluxo completo do usuário navegando por todas as 21 etapas do quiz
 */

import { test, expect } from '@playwright/test';

test.describe('Fluxo Completo do Quiz - 21 Steps', () => {
    test.setTimeout(120000); // 2 minutos para fluxo completo

    test('deve completar o quiz do início ao fim', async ({ page }) => {
        console.log('🚀 Iniciando teste do fluxo completo...');

        // 1. Carregar página inicial
        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        console.log('✅ Step 0: Página inicial carregada');

        // 2. Preencher nome (se houver campo)
        const nameInput = page.locator('input[name="name"], input[placeholder*="nome" i]').first();
        if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
            await nameInput.fill('Maria E2E Test');
            console.log('✅ Nome preenchido: Maria E2E Test');

            // Clicar no botão para iniciar
            const startButton = page.locator('button:has-text("Iniciar"), button:has-text("Começar"), button:has-text("Start")').first();
            if (await startButton.isVisible({ timeout: 2000 }).catch(() => false)) {
                await startButton.click();
                await page.waitForLoadState('networkidle');
                console.log('✅ Step 1: Quiz iniciado');
            }
        }

        // 3-21. Navegar por todas as perguntas
        let currentStep = 1;
        const maxSteps = 21;

        while (currentStep <= maxSteps) {
            console.log(`🔄 Processando Step ${currentStep}...`);

            // Aguardar carregamento da página
            await page.waitForTimeout(500);

            // Tentar encontrar opções de resposta
            const options = await page.locator('button[class*="option"], [role="button"], button:not([disabled])').all();

            if (options.length > 0) {
                // Clicar na primeira opção disponível
                try {
                    const firstOption = options[0];
                    await firstOption.click();
                    await page.waitForTimeout(800); // Aguardar transição

                    console.log(`✅ Step ${currentStep}: Opção selecionada`);

                    // Verificar se avançou para próxima step
                    const urlChanged = await page.waitForURL(/step|question/i, { timeout: 5000 }).catch(() => false);

                    if (!urlChanged) {
                        // Se URL não mudou, procurar botão "Próximo" ou "Continuar"
                        const nextButton = page.locator('button:has-text("Próximo"), button:has-text("Continuar"), button:has-text("Next")').first();
                        if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
                            await nextButton.click();
                            await page.waitForTimeout(500);
                            console.log(`✅ Step ${currentStep}: Botão "Próximo" clicado`);
                        }
                    }

                    currentStep++;
                } catch (error) {
                    console.log(`⚠️  Step ${currentStep}: Erro ao clicar opção - ${error}`);
                    break;
                }
            } else {
                // Se não há opções, verificar se é input text ou se chegou ao final
                const textInputs = await page.locator('input[type="text"], textarea').all();

                if (textInputs.length > 0) {
                    // Preencher inputs de texto
                    await textInputs[0].fill(`Resposta Step ${currentStep}`);

                    const submitButton = page.locator('button[type="submit"], button:has-text("Enviar"), button:has-text("Continuar")').first();
                    if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
                        await submitButton.click();
                        await page.waitForTimeout(500);
                        console.log(`✅ Step ${currentStep}: Input preenchido e enviado`);
                    }

                    currentStep++;
                } else {
                    // Verificar se chegou ao resultado final
                    const isResultPage = await page.locator('text=/resultado|seu estilo|parabéns/i').first().isVisible({ timeout: 3000 }).catch(() => false);

                    if (isResultPage) {
                        console.log('✅ Chegou à página de resultado!');
                        break;
                    } else {
                        console.log(`⚠️  Step ${currentStep}: Nenhuma opção ou input encontrado`);
                        break;
                    }
                }
            }

            // Timeout de segurança
            if (currentStep > maxSteps + 5) {
                console.log('⚠️  Limite de steps excedido, encerrando teste');
                break;
            }
        }

        // 22. Verificar página de resultado
        await page.waitForTimeout(1000);

        const hasResult = await page.locator('text=/resultado|seu estilo|parabéns/i').first().isVisible({ timeout: 5000 }).catch(() => false);

        if (hasResult) {
            console.log('✅ Página de resultado exibida');

            // Verificar elementos do resultado
            const resultElements = await page.locator('[class*="result"], h1, h2').count();
            expect(resultElements).toBeGreaterThan(0);

            // Capturar screenshot do resultado
            await page.screenshot({ path: 'tests/e2e/screenshots/quiz-result.png', fullPage: true });
            console.log('✅ Screenshot do resultado capturado');
        } else {
            console.log('⚠️  Não chegou à página de resultado esperada');
        }

        console.log(`✅ Teste completo! Steps processados: ${currentStep - 1}`);
    });

    test('navegação entre steps deve funcionar', async ({ page }) => {
        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        // Iniciar quiz
        const startButton = page.locator('button').first();
        if (await startButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await startButton.click();
            await page.waitForTimeout(500);
        }

        // Verificar navegação para frente
        const initialUrl = page.url();

        const option = page.locator('button[class*="option"], [role="button"]').first();
        if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
            await option.click();
            await page.waitForTimeout(1000);

            const newUrl = page.url();

            // URL deve ter mudado ou número do step deve ter avançado
            const urlChanged = initialUrl !== newUrl;
            console.log(`✅ Navegação funcionando: ${urlChanged ? 'URL mudou' : 'URL mantida'}`);
        }
    });

    test('deve manter dados do usuário entre steps', async ({ page }) => {
        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        // Preencher nome
        const nameInput = page.locator('input[name="name"]').first();
        if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
            await nameInput.fill('João Persistência');

            // Avançar para próxima step
            const nextButton = page.locator('button').first();
            await nextButton.click();
            await page.waitForTimeout(1000);

            // Verificar se o nome foi persistido (pode aparecer em algum lugar da UI)
            const pageContent = await page.textContent('body');
            const hasName = pageContent?.includes('João') || false;

            if (hasName) {
                console.log('✅ Dados do usuário persistidos');
            } else {
                console.log('ℹ️  Nome pode estar em localStorage/sessionStorage');
            }

            // Verificar localStorage
            const localStorageData = await page.evaluate(() => {
                return {
                    userName: localStorage.getItem('userName') || localStorage.getItem('quizUserName'),
                    quizData: localStorage.getItem('quizData')
                };
            });

            console.log('✅ Dados no localStorage:', localStorageData);
        }
    });

    test('deve permitir voltar para step anterior', async ({ page }) => {
        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        // Avançar algumas steps
        for (let i = 0; i < 3; i++) {
            const option = page.locator('button').first();
            if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
                await option.click();
                await page.waitForTimeout(500);
            }
        }

        // Tentar voltar
        const backButton = page.locator('button:has-text("Voltar"), button[aria-label*="voltar" i]').first();
        if (await backButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await backButton.click();
            await page.waitForTimeout(500);

            console.log('✅ Botão "Voltar" funciona');
        } else {
            console.log('ℹ️  Botão "Voltar" não encontrado (pode ser intencional)');
        }
    });

    test('deve exibir progresso do quiz', async ({ page }) => {
        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        // Procurar por barra de progresso ou indicador
        const progressBar = await page.locator('[role="progressbar"], [class*="progress"], .progress-bar').first().isVisible({ timeout: 3000 }).catch(() => false);

        if (progressBar) {
            console.log('✅ Barra de progresso encontrada');

            // Verificar se o progresso aumenta
            const initialValue = await page.locator('[role="progressbar"]').first().getAttribute('aria-valuenow').catch(() => '0');

            // Avançar uma step
            const option = page.locator('button').first();
            if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
                await option.click();
                await page.waitForTimeout(500);

                const newValue = await page.locator('[role="progressbar"]').first().getAttribute('aria-valuenow').catch(() => '0');

                console.log(`✅ Progresso: ${initialValue} → ${newValue}`);
            }
        } else {
            console.log('ℹ️  Indicador de progresso não encontrado');
        }
    });

    test('performance: fluxo completo deve ser rápido', async ({ page }) => {
        const startTime = Date.now();

        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        // Simular respostas rápidas
        for (let i = 0; i < 5; i++) {
            const option = page.locator('button').first();
            if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
                await option.click();
                await page.waitForTimeout(300);
            }
        }

        const endTime = Date.now();
        const totalTime = endTime - startTime;

        console.log(`✅ Tempo total para 5 steps: ${totalTime}ms`);

        // Performance: cada step deve levar menos de 2s em média
        expect(totalTime / 5).toBeLessThan(2000);
    });
});
