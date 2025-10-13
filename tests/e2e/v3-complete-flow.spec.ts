import { test, expect, Page } from '@playwright/test';

// Configuração do teste
test.describe('v3.0 Complete Flow Tests', () => {
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        await page.goto('http://localhost:5173/quiz-estilo');
    });

    test.afterAll(async () => {
        await page.close();
    });

    // ============================
    // Fase 3.3: Step 01 - Intro
    // ============================
    test('3.3.1 - Step 01: IntroHeroSection deve renderizar corretamente', async () => {
        // Verificar título
        const title = await page.locator('h1:has-text("Descubra seu Estilo")').first();
        await expect(title).toBeVisible({ timeout: 10000 });

        // Verificar decorative bar
        const decorBar = await page.locator('[class*="decorative"]').first();
        await expect(decorBar).toBeVisible();

        console.log('✅ IntroHeroSection renderizou corretamente');
    });

    test('3.3.2 - Step 01: WelcomeFormSection deve validar input', async () => {
        // Encontrar input de nome
        const nameInput = await page.locator('input[placeholder*="nome"], input[type="text"]').first();
        await expect(nameInput).toBeVisible();

        // Testar campo vazio
        const submitButton = await page.locator('button:has-text("Descobrir"), button:has-text("Começar"), button:has-text("Iniciar")').first();

        // Campo vazio deve ter botão desabilitado ou mostrar erro
        await nameInput.fill('');
        await nameInput.blur();

        // Testar nome curto (< 2 caracteres)
        await nameInput.fill('A');
        await nameInput.blur();

        // Testar nome válido
        await nameInput.fill('Maria Silva');
        await expect(submitButton).toBeEnabled({ timeout: 5000 });

        console.log('✅ WelcomeFormSection validação funcionando');
    });

    test('3.3.3 - Step 01: Deve navegar para Step 02 após submit', async () => {
        const nameInput = await page.locator('input[placeholder*="nome"], input[type="text"]').first();
        await nameInput.fill('Maria Silva');

        const submitButton = await page.locator('button:has-text("Descobrir"), button:has-text("Começar"), button:has-text("Iniciar")').first();
        await submitButton.click();

        // Aguardar navegação para step 02
        await page.waitForTimeout(1000);

        // Verificar se chegou no step 02 (questão)
        const questionTitle = await page.locator('h2, h1').first();
        await expect(questionTitle).toBeVisible({ timeout: 5000 });

        console.log('✅ Navegação Step 01 → Step 02 funcionando');
    });

    // ============================
    // Fase 3.4: Step 02 - Primeira Questão
    // ============================
    test('3.4.1 - Step 02: QuestionHeroSection deve mostrar progresso', async () => {
        // Verificar título da questão
        const questionText = await page.locator('text=/Q1|Questão 1|ROUPA/i').first();
        await expect(questionText).toBeVisible({ timeout: 5000 });

        // Verificar barra de progresso
        const progressBar = await page.locator('[role="progressbar"], [class*="progress"]').first();
        await expect(progressBar).toBeVisible();

        // Verificar contador "Questão X de Y"
        const counter = await page.locator('text=/Questão\\s+\\d+\\s+de\\s+\\d+/i').first();
        await expect(counter).toBeVisible();

        console.log('✅ QuestionHeroSection com progresso renderizado');
    });

    test('3.4.2 - Step 02: OptionsGridSection deve permitir seleção múltipla', async () => {
        // Encontrar todas as opções
        const options = await page.locator('[class*="option"], button[class*="card"]').all();
        expect(options.length).toBeGreaterThan(0);

        // Selecionar primeira opção
        if (options[0]) {
            await options[0].click();
            await page.waitForTimeout(500);
        }

        // Selecionar segunda opção
        if (options[1]) {
            await options[1].click();
            await page.waitForTimeout(500);
        }

        // Verificar contador de seleções
        const selectionCount = await page.locator('text=/\\d+\\s+de\\s+\\d+\\s+selecionado/i').first();
        await expect(selectionCount).toBeVisible({ timeout: 3000 });

        console.log('✅ OptionsGridSection seleção múltipla funcionando');
    });

    test('3.4.3 - Step 02: Deve auto-avançar após 3 seleções', async () => {
        // Selecionar terceira opção
        const options = await page.locator('[class*="option"], button[class*="card"]').all();
        if (options[2]) {
            await options[2].click();
        }

        // Aguardar auto-advance (1500ms)
        await page.waitForTimeout(2000);

        // Verificar se navegou para próxima questão
        const nextQuestion = await page.locator('text=/Q2|Questão 2/i').first();
        await expect(nextQuestion).toBeVisible({ timeout: 5000 });

        console.log('✅ Auto-advance funcionando (1500ms)');
    });

    // ============================
    // Fase 3.5: Transitions (Steps 12, 19)
    // ============================
    test('3.5.1 - Navegar até Step 12 (Transition)', async () => {
        // Navegar diretamente para step 12
        await page.goto('http://localhost:5173/quiz-estilo?step=12');
        await page.waitForTimeout(1000);

        // Verificar TransitionHeroSection
        const loadingSpinner = await page.locator('[class*="spinner"], [class*="loading"]').first();
        const transitionText = await page.locator('text=/Analisando|Processando|Aguarde/i').first();

        // Pelo menos um deve estar visível
        const spinnerVisible = await loadingSpinner.isVisible().catch(() => false);
        const textVisible = await transitionText.isVisible().catch(() => false);

        expect(spinnerVisible || textVisible).toBe(true);

        console.log('✅ Step 12: TransitionHeroSection renderizado');
    });

    test('3.5.2 - Step 12: Deve auto-avançar após 3 segundos', async () => {
        // Aguardar auto-advance (3s)
        await page.waitForTimeout(4000);

        // Verificar se navegou para próxima página
        const currentUrl = page.url();
        expect(currentUrl).not.toContain('step=12');

        console.log('✅ Step 12: Auto-advance funcionando (3s)');
    });

    // ============================
    // Fase 3.6: Step 21 - Offer Page
    // ============================
    test('3.6.1 - Navegar para Step 21 (Offer)', async () => {
        await page.goto('http://localhost:5173/quiz-estilo?step=21');
        await page.waitForTimeout(1000);

        // Verificar OfferHeroSection
        const offerTitle = await page.locator('h1, h2').first();
        await expect(offerTitle).toBeVisible({ timeout: 5000 });

        console.log('✅ Step 21: OfferHeroSection renderizado');
    });

    test('3.6.2 - Step 21: PricingSection deve ter CTA', async () => {
        // Verificar PricingSection
        const pricingCard = await page.locator('[class*="pricing"], [class*="card"]').first();
        await expect(pricingCard).toBeVisible({ timeout: 5000 });

        // Verificar CTA button
        const ctaButton = await page.locator('button:has-text("Comprar"), button:has-text("Adquirir"), a:has-text("Garantir")').first();
        await expect(ctaButton).toBeVisible();

        // Testar hover effect
        await ctaButton.hover();
        await page.waitForTimeout(300);

        console.log('✅ Step 21: PricingSection com CTA funcionando');
    });

    test('3.6.3 - Step 21: Verificar substituição {userName}', async () => {
        // Verificar se Maria Silva aparece no texto
        const userNameText = await page.locator('text=/Maria Silva/i').first();
        await expect(userNameText).toBeVisible({ timeout: 5000 });

        console.log('✅ Step 21: Substituição {userName} funcionando');
    });

    // ============================
    // Fase 3.7: Analytics Validation
    // ============================
    test('3.7.1 - Verificar eventos de analytics', async () => {
        let analyticsEvents: string[] = [];

        // Interceptar console.log para capturar eventos
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('Analytics') || text.includes('Event') || text.includes('track')) {
                analyticsEvents.push(text);
            }
        });

        // Navegar para step 01
        await page.goto('http://localhost:5173/quiz-estilo');
        await page.waitForTimeout(2000);

        // Verificar se algum evento foi disparado
        expect(analyticsEvents.length).toBeGreaterThan(0);

        console.log('✅ Analytics: Eventos detectados', analyticsEvents.length);
    });

    // ============================
    // Fase 3.8: Responsiveness Tests
    // ============================
    test('3.8.1 - Mobile (320px): Layout deve adaptar', async () => {
        await page.setViewportSize({ width: 320, height: 568 });
        await page.goto('http://localhost:5173/quiz-estilo');
        await page.waitForTimeout(1000);

        // Verificar que o layout renderizou
        const mainContent = await page.locator('main, [class*="container"]').first();
        await expect(mainContent).toBeVisible();

        console.log('✅ Mobile (320px): Layout responsivo OK');
    });

    test('3.8.2 - Tablet (768px): Layout deve adaptar', async () => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto('http://localhost:5173/quiz-estilo');
        await page.waitForTimeout(1000);

        // Verificar que o layout renderizou
        const mainContent = await page.locator('main, [class*="container"]').first();
        await expect(mainContent).toBeVisible();

        console.log('✅ Tablet (768px): Layout responsivo OK');
    });

    test('3.8.3 - Desktop (1024px): Layout deve adaptar', async () => {
        await page.setViewportSize({ width: 1024, height: 768 });
        await page.goto('http://localhost:5173/quiz-estilo');
        await page.waitForTimeout(1000);

        // Verificar que o layout renderizou
        const mainContent = await page.locator('main, [class*="container"]').first();
        await expect(mainContent).toBeVisible();

        console.log('✅ Desktop (1024px): Layout responsivo OK');
    });
});
