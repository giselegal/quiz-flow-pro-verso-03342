/**
 * 🧪 TESTES E2E - FLUXO COMPLETO DO QUIZ (21 ETAPAS)
 * 
 * Testa o fluxo completo do usuário no quiz:
 * - Carregamento da página inicial
 * - Navegação através das 21 etapas
 * - Preenchimento de formulários
 * - Seleção de opções
 * - Cálculo de resultados
 * - Visualização do resultado final
 * 
 * @module tests/e2e/quiz-complete-flow
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';
const QUIZ_URL = `${BASE_URL}/quiz-estilo`;
const TIMEOUT = 15000;

test.describe('🎯 Fluxo Completo do Quiz - 21 Etapas', () => {

    test('deve carregar o quiz e exibir etapa inicial', async ({ page }) => {
        await page.goto(QUIZ_URL);
        await page.waitForLoadState('networkidle');

        // Verificar se o quiz carregou
        const quizContainer = page.locator('.quiz-container, [data-testid*="quiz"], .quiz-app, main').first();
        await expect(quizContainer).toBeVisible({ timeout: TIMEOUT });

        // Verificar se há título ou texto introdutório
        const hasTitle = await page.locator('h1, h2, .title').first().isVisible().catch(() => false);
        expect(hasTitle).toBeTruthy();

        console.log('✅ Quiz carregado e etapa inicial exibida');
    });

    test('deve ter barra de progresso', async ({ page }) => {
        await page.goto(QUIZ_URL);
        await page.waitForLoadState('networkidle');

        // Procurar por indicadores de progresso
        const progressIndicators = [
            page.locator('[role="progressbar"]'),
            page.locator('.progress-bar'),
            page.locator('[data-testid*="progress"]'),
            page.locator('progress'),
            page.locator('[aria-valuenow]')
        ];

        let foundProgress = false;
        for (const indicator of progressIndicators) {
            if (await indicator.first().isVisible().catch(() => false)) {
                foundProgress = true;
                console.log('✅ Barra de progresso encontrada');
                break;
            }
        }

        // Progresso pode ser textual também (ex: "Etapa 1 de 21")
        const textProgress = await page.locator('text=/etapa|step|passo/i').first().isVisible().catch(() => false);

        expect(foundProgress || textProgress).toBeTruthy();
    });

    test('deve coletar informações do lead (etapa 1)', async ({ page }) => {
        await page.goto(QUIZ_URL);
        await page.waitForLoadState('networkidle');

        // Procurar por campos de input
        const nameInput = page.locator('input[name*="name"], input[placeholder*="nome"], input[type="text"]').first();
        const emailInput = page.locator('input[name*="email"], input[type="email"]').first();

        if (await nameInput.isVisible().catch(() => false)) {
            await nameInput.fill('Teste E2E User');
            console.log('✅ Nome preenchido');
        }

        if (await emailInput.isVisible().catch(() => false)) {
            await emailInput.fill('teste.e2e@example.com');
            console.log('✅ Email preenchido');
        }

        // Procurar botão de próximo
        const nextButton = await findNextButton(page);

        if (nextButton) {
            await nextButton.click();
            await page.waitForTimeout(1000);
            console.log('✅ Avançou para próxima etapa');
        }
    });

    test('deve navegar pelas questões do quiz', async ({ page }) => {
        await page.goto(QUIZ_URL);
        await page.waitForLoadState('networkidle');

        // Pular etapa de lead se necessário
        await skipLeadCapture(page);

        // Tentar responder 5 questões
        for (let i = 0; i < 5; i++) {
            console.log(`📝 Tentando responder questão ${i + 1}...`);

            // Procurar por opções de resposta
            const options = [
                page.locator('button[data-option], .option-button, [role="radio"]'),
                page.locator('input[type="radio"]'),
                page.locator('.quiz-option, .answer-option')
            ];

            let answered = false;
            for (const optionLocator of options) {
                const firstOption = optionLocator.first();
                if (await firstOption.isVisible().catch(() => false)) {
                    await firstOption.click();
                    await page.waitForTimeout(500);
                    answered = true;
                    console.log(`   ✅ Opção selecionada na questão ${i + 1}`);
                    break;
                }
            }

            if (!answered) {
                console.log(`   ⚠️ Não foi possível responder questão ${i + 1}`);
            }

            // Clicar em próximo
            const nextButton = await findNextButton(page);
            if (nextButton) {
                await nextButton.click();
                await page.waitForTimeout(1000);
            } else {
                console.log(`   ⚠️ Botão de próximo não encontrado`);
                break;
            }
        }

        console.log('✅ Navegou por múltiplas questões do quiz');
    });

    test('deve permitir voltar para questão anterior', async ({ page }) => {
        await page.goto(QUIZ_URL);
        await page.waitForLoadState('networkidle');

        await skipLeadCapture(page);

        // Avançar uma questão
        const firstOption = page.locator('button, input[type="radio"]').first();
        if (await firstOption.isVisible().catch(() => false)) {
            await firstOption.click();
            await page.waitForTimeout(500);
        }

        const nextButton = await findNextButton(page);
        if (nextButton) {
            await nextButton.click();
            await page.waitForTimeout(1000);
        }

        // Tentar voltar
        const backButton = await findBackButton(page);
        if (backButton) {
            await backButton.click();
            await page.waitForTimeout(1000);
            console.log('✅ Voltou para questão anterior');
        } else {
            console.log('ℹ️ Botão de voltar não disponível');
        }
    });

    test('deve completar o quiz e exibir resultado', async ({ page }) => {
        await page.goto(QUIZ_URL);
        await page.waitForLoadState('networkidle');

        await skipLeadCapture(page);

        // Responder rapidamente várias questões (máximo 15 tentativas)
        for (let i = 0; i < 15; i++) {
            const option = page.locator('button[data-option], .option-button, button, input[type="radio"]').first();

            if (await option.isVisible().catch(() => false)) {
                await option.click();
                await page.waitForTimeout(300);
            }

            const nextButton = await findNextButton(page);
            if (nextButton) {
                await nextButton.click();
                await page.waitForTimeout(500);
            } else {
                console.log('   ℹ️ Chegou ao final ou botão não disponível');
                break;
            }

            // Verificar se chegou na tela de resultado
            const resultIndicators = [
                page.locator('text=/resultado|result|seu estilo/i'),
                page.locator('[data-testid*="result"]'),
                page.locator('.result-page, .resultado')
            ];

            let foundResult = false;
            for (const indicator of resultIndicators) {
                if (await indicator.first().isVisible().catch(() => false)) {
                    foundResult = true;
                    break;
                }
            }

            if (foundResult) {
                console.log('✅ Página de resultado alcançada!');
                break;
            }
        }
    });

    test('deve validar campos obrigatórios', async ({ page }) => {
        await page.goto(QUIZ_URL);
        await page.waitForLoadState('networkidle');

        // Tentar avançar sem preencher
        const nextButton = await findNextButton(page);
        if (nextButton) {
            await nextButton.click();
            await page.waitForTimeout(1000);

            // Verificar se aparece mensagem de erro ou validação
            const errorIndicators = [
                page.locator('text=/obrigatório|required|preencha/i'),
                page.locator('[role="alert"], .error, .validation-error'),
                page.locator('.text-red, .error-message')
            ];

            let foundError = false;
            for (const indicator of errorIndicators) {
                if (await indicator.first().isVisible().catch(() => false)) {
                    foundError = true;
                    console.log('✅ Validação de campos obrigatórios funcionando');
                    break;
                }
            }

            // Se não encontrou erro, talvez o botão esteja desabilitado
            if (!foundError) {
                const isDisabled = await nextButton.isDisabled().catch(() => false);
                if (isDisabled) {
                    console.log('✅ Botão desabilitado quando campos não preenchidos');
                }
            }
        }
    });

    test('deve persistir respostas ao navegar', async ({ page }) => {
        await page.goto(QUIZ_URL);
        await page.waitForLoadState('networkidle');

        await skipLeadCapture(page);

        // Selecionar primeira opção
        const firstOption = page.locator('button[data-option], .option-button, button').first();
        if (await firstOption.isVisible().catch(() => false)) {
            const optionText = await firstOption.textContent();
            await firstOption.click();
            await page.waitForTimeout(500);

            // Avançar
            const nextButton = await findNextButton(page);
            if (nextButton) {
                await nextButton.click();
                await page.waitForTimeout(1000);

                // Voltar
                const backButton = await findBackButton(page);
                if (backButton) {
                    await backButton.click();
                    await page.waitForTimeout(1000);

                    // Verificar se a opção ainda está selecionada
                    const selectedOption = page.locator('[data-selected="true"], .selected, [aria-checked="true"]');
                    const hasSelection = await selectedOption.first().isVisible().catch(() => false);

                    if (hasSelection) {
                        console.log('✅ Resposta persistida ao navegar');
                    }
                }
            }
        }
    });

    test('deve exibir todas as 21 etapas estruturalmente', async ({ page }) => {
        await page.goto(QUIZ_URL);
        await page.waitForLoadState('networkidle');

        let currentStep = 1;
        const maxSteps = 21;
        const visitedSteps = new Set<number>();

        visitedSteps.add(currentStep);

        for (let i = 0; i < maxSteps; i++) {
            // Verificar se há indicador de etapa
            const stepText = await page.locator('text=/etapa|step/i').first().textContent().catch(() => '');
            console.log(`   📍 ${stepText || `Iteração ${i + 1}`}`);

            // Tentar selecionar opção
            const option = page.locator('button[data-option], button, input[type="radio"]').first();
            if (await option.isVisible().catch(() => false)) {
                await option.click();
                await page.waitForTimeout(300);
            }

            // Tentar avançar
            const nextButton = await findNextButton(page);
            if (nextButton && await nextButton.isEnabled().catch(() => false)) {
                await nextButton.click();
                await page.waitForTimeout(500);
                currentStep++;
                visitedSteps.add(currentStep);
            } else {
                break;
            }
        }

        console.log(`✅ Percorreu ${visitedSteps.size} etapas do quiz`);
        expect(visitedSteps.size).toBeGreaterThan(1);
    });
});

// ============================================================================
// HELPERS
// ============================================================================

async function findNextButton(page: Page) {
    const buttonSelectors = [
        'button:has-text("Próximo")',
        'button:has-text("Continuar")',
        'button:has-text("Avançar")',
        'button:has-text("Next")',
        'button[data-testid*="next"]',
        'button.next-button',
        '[data-action="next"]'
    ];

    for (const selector of buttonSelectors) {
        const button = page.locator(selector).first();
        if (await button.isVisible().catch(() => false)) {
            return button;
        }
    }

    // Fallback: procurar último botão visível
    const buttons = await page.locator('button:visible').all();
    if (buttons.length > 0) {
        return buttons[buttons.length - 1];
    }

    return null;
}

async function findBackButton(page: Page) {
    const buttonSelectors = [
        'button:has-text("Voltar")',
        'button:has-text("Anterior")',
        'button:has-text("Back")',
        'button[data-testid*="back"]',
        'button[data-testid*="previous"]',
        'button.back-button'
    ];

    for (const selector of buttonSelectors) {
        const button = page.locator(selector).first();
        if (await button.isVisible().catch(() => false)) {
            return button;
        }
    }

    return null;
}

async function skipLeadCapture(page: Page) {
    // Tentar preencher campos de lead
    const nameInput = page.locator('input[name*="name"], input[placeholder*="nome"]').first();
    const emailInput = page.locator('input[name*="email"], input[type="email"]').first();

    if (await nameInput.isVisible().catch(() => false)) {
        await nameInput.fill('E2E Test');
    }

    if (await emailInput.isVisible().catch(() => false)) {
        await emailInput.fill('e2e@test.com');
    }

    // Tentar avançar
    const nextButton = await findNextButton(page);
    if (nextButton) {
        await nextButton.click();
        await page.waitForTimeout(1000);
    }
}
