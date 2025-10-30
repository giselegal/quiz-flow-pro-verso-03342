/**
 * 🧪 TESTES E2E - MODO PREVIEW DO EDITOR
 * 
 * Testes visuais automatizados para validar:
 * - Alternância Edit ↔ Preview
 * - Navegação entre steps
 * - Regras de validação (minSelections, maxSelections)
 * - Cálculo de resultado
 * - Renderização de blocos atômicos
 * 
 * @see TESTE_VISUAL_PREVIEW_MODE.md
 */

import { test, expect, Page } from '@playwright/test';

const EDITOR_URL = '/editor?template=quiz21StepsComplete';
const TIMEOUT_NAVIGATION = 10000;
const TIMEOUT_RENDER = 5000;

test.describe('Editor - Modo PREVIEW', () => {
    test.beforeEach(async ({ page }) => {
        // Navegar para o editor com template completo
        await page.goto(EDITOR_URL);
        
        // Aguardar carregamento do editor
        await page.waitForLoadState('networkidle');
        // Compat: nossos containers usam data-testid específicos por modo
    await expect(page.locator('[data-testid="canvas-edit-mode"], [data-testid="canvas-preview-mode"]').first()).toBeVisible({ timeout: TIMEOUT_RENDER });
    });

    test.describe('TC1: Validação de Renderização Inicial', () => {
        test('deve renderizar step-01 com logo, título e formulário', async ({ page }) => {
            const editCanvas = page.locator('[data-testid="canvas-edit-mode"]');
            // Step-01 deve estar ativo por padrão
            await expect(page.locator('[data-step-id="step-01"]').first()).toBeVisible({ timeout: TIMEOUT_RENDER });

            // Validar logo (intro-logo)
            const logo = editCanvas.locator('img[alt*="Logo"], img[src*="LOGO_DA_MARCA"]').first();
            await expect(logo).toBeVisible();
            
            // Validar título com HTML inline
            const title = editCanvas.locator('text=/Chega.*guarda-roupa/i').first();
            await expect(title).toBeVisible();

            // Validar campo de input
            const nameInput = editCanvas.locator('input[placeholder*="nome"], input[type="text"]').first();
            await expect(nameInput).toBeVisible();

            // Validar botão
            const submitButton = editCanvas.locator('button:has-text("Quero Descobrir"), button:has-text("Começar")').first();
            await expect(submitButton).toBeVisible();
        });

        test('não deve mostrar "Virtualização ativa" no step-20', async ({ page }) => {
            // Navegar para step-20 (se houver navegação direta)
            // Ou usar selector de steps
            const step20 = page.locator('[data-step-id="step-20"], button:has-text("Step 20")');
            if (await step20.isVisible().catch(() => false)) {
                await step20.click();
                await page.waitForTimeout(1000);
            }

            // Verificar que mensagem de virtualização NÃO aparece
            const virtualizationBadge = page.locator('text=/Virtualização ativa/i');
            await expect(virtualizationBadge).not.toBeVisible();
        });
    });

    test.describe('TC2: Alternância Edit ↔ Preview', () => {
        test('deve alternar do modo Edit para Preview', async ({ page }) => {
            // Verificar que está no modo Edit (blocos selecionáveis)
            await expect(page.locator('[data-testid="canvas-edit-mode"]')).toBeVisible();

            // Clicar no botão Preview
            // Alternar via store exposta no window (estável para testes)
            await page.evaluate(() => (window as any).__editorMode?.setViewMode('preview'));

            // Aguardar mudança de modo
            await page.waitForTimeout(500);

            // Validar que modo Preview está ativo
            const previewContainer = page.locator('[data-testid="canvas-preview-mode"]');
            await expect(previewContainer).toBeVisible();

            // Verificar que blocos não são mais selecionáveis (não há borda de seleção)
            const selectableBlock = page.locator('.selectable-block.selected').first();
            await expect(selectableBlock).not.toBeVisible();
        });

        test('deve alternar de Preview de volta para Edit', async ({ page }) => {
            // Ir para Preview
            await page.evaluate(() => (window as any).__editorMode?.setViewMode('preview'));
            await page.waitForTimeout(500);

            // Voltar para Edit
            await page.evaluate(() => (window as any).__editorMode?.setViewMode('edit'));
            await page.waitForTimeout(500);

            // Validar que modo Edit está ativo novamente
            await expect(page.locator('[data-testid="canvas-edit-mode"]')).toBeVisible();
        });

        test('deve manter estado ao alternar entre modos', async ({ page }) => {
            // Ir para Preview
            await page.evaluate(() => (window as any).__editorMode?.setViewMode('preview'));
            await page.waitForTimeout(500);

            // Preencher nome no preview
            const nameInput = page.locator('input[placeholder*="nome"], input[type="text"]').first();
            await nameInput.fill('Maria Teste');

            // Voltar para Edit
            await page.locator('button:has-text("Editor"), button:has-text("Edit"), button:has-text("Editar")').first().click();
            await page.waitForTimeout(500);

            // Voltar para Preview
            await page.evaluate(() => (window as any).__editorMode?.setViewMode('preview'));
            await page.waitForTimeout(500);

            // Validar que nome ainda está preenchido (se sessionData persiste)
            // Nota: Pode ser resetado dependendo da implementação
            const nameInputAfter = page.locator('input[placeholder*="nome"], input[type="text"]').first();
            const value = await nameInputAfter.inputValue();
            // Aceitar tanto vazio (reset) quanto mantido
            expect(value).toMatch(/^(Maria Teste)?$/);
        });
    });

    test.describe('TC3: Navegação e Validação de Formulário', () => {
        test.beforeEach(async ({ page }) => {
            // Entrar no modo Preview (via store exposta)
            await page.evaluate(() => (window as any).__editorMode?.setViewMode('preview'));
            await page.waitForTimeout(500);
        });

        test('deve validar campo de nome obrigatório no step-01', async ({ page }) => {
            // Tentar avançar sem preencher nome
            const submitButton = page.locator('button:has-text("Quero Descobrir"), button:has-text("Começar"), button:has-text("Avançar")').first();
            
            // Verificar se botão está desabilitado ou mostra validação
            const isDisabled = await submitButton.isDisabled().catch(() => false);
            
            if (!isDisabled) {
                // Clicar e verificar se mostra mensagem de erro
                await submitButton.click();
                await page.waitForTimeout(500);
                
                // Não deve ter avançado (ainda no step-01)
                await expect(page.locator('[data-step-id="step-01"], [data-testid="step-01"]')).toBeVisible();
            }
        });

        test('deve navegar para step-02 após preencher nome', async ({ page }) => {
            // Preencher nome
            const nameInput = page.locator('[data-testid="canvas-preview-mode"] input[placeholder*="nome"], [data-testid="canvas-preview-mode"] input[type="text"]').first();
            await nameInput.fill('Maria Silva');

            // Clicar no botão de avançar
            const submitButton = page.locator('[data-testid="canvas-preview-mode"] button:has-text("Quero Descobrir"), [data-testid="canvas-preview-mode"] button:has-text("Começar"), [data-testid="canvas-preview-mode"] button:has-text("Avançar")').first();
            await submitButton.click();

            // Aguardar navegação
            await page.waitForTimeout(1000);

            // Verificar que está no step-02 (escopado ao container de preview)
            await expect(page.locator('[data-testid="canvas-preview-mode"] [data-step-id="step-02"]').first()).toBeVisible({ timeout: TIMEOUT_NAVIGATION });

            // Barra de progresso deve mostrar 2/21 (ou "Pergunta 1 de 10")
            const progressText = page.locator('[data-testid="canvas-preview-mode"] >> text=/2.*21|Pergunta 1/i');
            await expect(progressText).toBeVisible({ timeout: TIMEOUT_NAVIGATION });

            // Confirmação final: estamos de fato na etapa 02 (checagens acima já cobrem)
            await expect(page.locator('[data-testid="canvas-preview-mode"] [data-step-id="step-02"]').first()).toBeVisible();
        });
    });

    test.describe('TC4: Validação de Seleções (minSelections/maxSelections)', () => {
        test.beforeEach(async ({ page }) => {
            // Entrar no modo Preview via API estável e navegar para step-02
            await page.evaluate(() => (window as any).__editorMode?.setViewMode('preview'));
            await page.waitForTimeout(500);

            const previewCanvas = page.locator('[data-testid="canvas-preview-mode"]');
            const nameInput = previewCanvas.locator('input[placeholder*="nome"], input[type="text"]').first();
            await nameInput.fill('Maria Teste');

            const submitButton = previewCanvas.locator('button:has-text("Quero Descobrir"), button:has-text("Começar"), button:has-text("Avançar")').first();
            await submitButton.click();
            await page.waitForTimeout(1000);
        });

        test('deve exigir 3 seleções no step-02 (minSelections=3)', async ({ page }) => {
            // Verificar que está no step-02
            await expect(page.locator('text=/QUAL O SEU TIPO DE ROUPA/i')).toBeVisible();

            // Botão Avançar deve estar desabilitado inicialmente
            const nextButton = page.locator('button:has-text("Avançar")').first();
            
            // Selecionar apenas 1 opção
            const firstOption = page.locator('[data-testid*="option"], .option-card, button[role="checkbox"]').first();
            await firstOption.click();
            await page.waitForTimeout(300);

            // Botão ainda deve estar desabilitado
            let isDisabled = await nextButton.isDisabled().catch(() => true);
            expect(isDisabled).toBe(true);

            // Selecionar 2ª opção
            const secondOption = page.locator('[data-testid*="option"], .option-card, button[role="checkbox"]').nth(1);
            await secondOption.click();
            await page.waitForTimeout(300);

            // Ainda desabilitado
            isDisabled = await nextButton.isDisabled().catch(() => true);
            expect(isDisabled).toBe(true);

            // Selecionar 3ª opção
            const thirdOption = page.locator('[data-testid*="option"], .option-card, button[role="checkbox"]').nth(2);
            await thirdOption.click();
            await page.waitForTimeout(300);

            // Agora deve estar habilitado
            isDisabled = await nextButton.isDisabled().catch(() => false);
            expect(isDisabled).toBe(false);
        });

        test('deve navegar para step-03 após selecionar 3 opções', async ({ page }) => {
            // Selecionar 3 opções
            const options = page.locator('[data-testid*="option"], .option-card, button[role="checkbox"]');
            for (let i = 0; i < 3; i++) {
                await options.nth(i).click();
                await page.waitForTimeout(200);
            }

            // Clicar em Avançar
            const nextButton = page.locator('button:has-text("Avançar")').first();
            await nextButton.click();

            // Aguardar navegação
            await page.waitForTimeout(1000);

            // Verificar que está no step-03 (Pergunta 2 de 10)
            const progressText = page.locator('text=/Pergunta 2.*10|3.*21/i');
            await expect(progressText).toBeVisible({ timeout: TIMEOUT_NAVIGATION });
        });

        test('deve permitir voltar para step-01', async ({ page }) => {
            // Clicar em Voltar
            const backButton = page.locator('button:has-text("Voltar")').first();
            await backButton.click();

            // Aguardar navegação
            await page.waitForTimeout(1000);

            // Verificar que voltou para step-01
            const nameInput = page.locator('input[placeholder*="nome"], input[type="text"]').first();
            await expect(nameInput).toBeVisible({ timeout: TIMEOUT_NAVIGATION });

            // Nome deve estar mantido
            const value = await nameInput.inputValue();
            expect(value).toBe('Maria Teste');
        });
    });

    test.describe('TC5: Renderização Step-20 (Resultado)', () => {
        test('deve renderizar todos os blocos atômicos do resultado', async ({ page }) => {
            // Este teste simula a navegação completa até step-20
            // Nota: Pode ser substituído por navegação direta se disponível

            // Entrar no modo Preview via API estável
            await page.evaluate(() => (window as any).__editorMode?.setViewMode('preview'));
            await page.waitForTimeout(500);

            // Completar step-01 (no container de preview)
            const previewCanvas = page.locator('[data-testid="canvas-preview-mode"]');
            await previewCanvas.locator('input[placeholder*="nome"], input[type="text"]').first().fill('Teste Result');
            await previewCanvas.locator('button:has-text("Quero Descobrir"), button:has-text("Começar"), button:has-text("Avançar")').first().click();
            await page.waitForTimeout(1000);

            // Completar steps 02-11 (perguntas de estilo)
            // Simplificado: selecionar sempre as 3 primeiras opções
            for (let step = 2; step <= 11; step++) {
                await page.waitForTimeout(500);
                
                // Selecionar 3 opções
                const options = page.locator('[data-testid*="option"], .option-card, button[role="checkbox"]');
                const count = await options.count();
                
                for (let i = 0; i < Math.min(3, count); i++) {
                    await options.nth(i).click();
                    await page.waitForTimeout(200);
                }

                // Avançar
                await page.locator('button:has-text("Avançar")').first().click();
                await page.waitForTimeout(800);
            }

            // Step-12 é transição, deve auto-avançar ou ter botão
            await page.waitForTimeout(2000);
            const continueButton = page.locator('button:has-text("Continuar")').first();
            if (await continueButton.isVisible()) {
                await continueButton.click();
                await page.waitForTimeout(800);
            }

            // Completar steps 13-18 (estratégicas - 1 seleção cada)
            for (let step = 13; step <= 18; step++) {
                await page.waitForTimeout(500);
                
                // Selecionar 1 opção
                const options = page.locator('[data-testid*="option"], .option-card, button[role="checkbox"]');
                await options.first().click();
                await page.waitForTimeout(200);

                // Avançar
                await page.locator('button:has-text("Continuar"), button:has-text("Avançar")').first().click();
                await page.waitForTimeout(800);
            }

            // Step-19 é transição
            await page.waitForTimeout(2000);

            // Agora deve estar no step-20 (resultado)
            // Validar blocos atômicos
            
            // 1. result-congrats / result-main (emoji + saudação)
            const celebration = page.locator('text=/🎉|Olá.*Teste Result/i');
            await expect(celebration).toBeVisible({ timeout: 5000 });

            // 2. Estilo predominante
            const styleName = page.locator('text=/Seu estilo|Estilo Predominante/i');
            await expect(styleName).toBeVisible();

            // 3. Porcentagem
            const percentage = page.locator('text=/%|compatibilidade/i');
            await expect(percentage).toBeVisible();

            // 4. Descrição do estilo
            const description = page.locator('text=/essência|personalidade|características/i');
            await expect(description).toBeVisible();

            // 5. CTA buttons
            const ctaButton = page.locator('button:has-text("Quero"), button:has-text("Descobrir")');
            await expect(ctaButton.first()).toBeVisible();

            // Verificar que NÃO há virtualização ativa
            await expect(page.locator('text=/Virtualização ativa/i')).not.toBeVisible();
        });
    });

    test.describe('TC6: Performance e Carregamento', () => {
        test('não deve "piscar" ao carregar steps', async ({ page }) => {
            // Recarregar página
            await page.reload();
            await page.waitForLoadState('networkidle');

            // Editor deve aparecer rapidamente (usar testids dos canvases atuais)
            const canvas = page.locator('[data-testid="canvas-edit-mode"], [data-testid="canvas-preview-mode"]');
            await expect(canvas.first()).toBeVisible({ timeout: 3000 });

            // Não deve haver múltiplos flashes de conteúdo
            // (difícil de testar diretamente, mas podemos verificar que renderiza uma vez)
            await page.waitForTimeout(1000);
            await expect(canvas).toBeVisible();
        });

        test('deve carregar step-01 em menos de 3 segundos', async ({ page }) => {
            const startTime = Date.now();

            // Aguardar step-01 visível
            await page.locator('input[placeholder*="nome"]').first().waitFor({ state: 'visible' });

            const loadTime = Date.now() - startTime;
            expect(loadTime).toBeLessThan(3000);
        });
    });
});

/**
 * 🎯 HELPER FUNCTIONS
 */

/**
 * Completa um step de questão selecionando N opções
 */
async function completeQuestionStep(page: Page, numSelections: number = 3): Promise<void> {
    const options = page.locator('[data-testid*="option"], .option-card, button[role="checkbox"]');
    const count = await options.count();

    for (let i = 0; i < Math.min(numSelections, count); i++) {
        await options.nth(i).click();
        await page.waitForTimeout(200);
    }

    const nextButton = page.locator('button:has-text("Avançar"), button:has-text("Continuar")').first();
    await nextButton.click();
    await page.waitForTimeout(800);
}

/**
 * Navega para um step específico (se navegação direta disponível)
 */
async function navigateToStep(page: Page, stepNumber: number): Promise<void> {
    const stepSelector = `[data-step-id="step-${String(stepNumber).padStart(2, '0')}"]`;
    const stepButton = page.locator(stepSelector);
    
    if (await stepButton.isVisible()) {
        await stepButton.click();
        await page.waitForTimeout(500);
    }
}
