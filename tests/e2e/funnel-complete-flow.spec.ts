/**
 * 🎭 TESTE E2E: Fluxo Completo Dashboard → Editor → Salvamento
 * 
 * Teste end-to-end que simula a jornada completa do usuário:
 * 1. Acessa o dashboard
 * 2. Seleciona funil de 21 etapas
 * 3. Edita propriedades no editor
 * 4. Salva e valida persistência
 */

import { test, expect, Browser, Page } from '@playwright/test';

// Permite sobrepor a URL base dos testes via env; default para a porta do Vite (5173)
const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:5173';

test.describe('🎯 Fluxo Completo: Dashboard → Editor → Supabase', () => {
    let page: Page;
    let funnelId: string;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        // Configurar interceptadores para monitorar requests
        await page.route('**/supabase.co/**', async (route) => {
            console.log(`📡 Request Supabase: ${route.request().method()} ${route.request().url()}`);
            await route.continue();
        });

        await page.route('**/api/**', async (route) => {
            console.log(`🔧 Request API: ${route.request().method()} ${route.request().url()}`);
            await route.continue();
        });
    });

    test('1️⃣ Dashboard: Acessar e listar funis', async () => {
        console.log('📊 Teste 1: Acessando dashboard...');

        // Acessar o dashboard
    await page.goto(`${BASE_URL}/dashboard`);

        // Aguardar carregamento
        await page.waitForSelector('[data-testid="dashboard-container"]', { timeout: 10000 });

        // Verificar se o dashboard carregou
        await expect(page).toHaveTitle(/Quiz Quest/);

        // Procurar por funis disponíveis
        const funnelCards = await page.locator('[data-testid="funnel-card"]');
        const funnelCount = await funnelCards.count();

        console.log(`✅ Dashboard carregado com ${funnelCount} funis`);

        if (funnelCount === 0) {
            console.log('🆕 Nenhum funil encontrado, criando funil de teste...');
            await createTestFunnel();
        }
    });

    test('2️⃣ Dashboard: Selecionar funil de 21 etapas', async () => {
        console.log('🎯 Teste 2: Selecionando funil de 21 etapas...');

        // Procurar pelo funil de 21 etapas
        const quiz21Card = await page.locator('[data-testid="funnel-card"]')
            .filter({ hasText: /21.*etapas|21.*steps|quiz.*21/i })
            .first();

        if (await quiz21Card.count() === 0) {
            // Se não encontrou, criar um funil de 21 etapas
            console.log('🆕 Criando funil de 21 etapas...');
            await page.click('[data-testid="create-funnel-btn"]');
            await page.selectOption('[data-testid="template-select"]', 'quiz21StepsComplete');
            await page.fill('[data-testid="funnel-name"]', 'Quiz de 21 Etapas - Teste E2E');
            await page.click('[data-testid="create-confirm-btn"]');

            await page.waitForSelector('[data-testid="funnel-created-success"]');
            console.log('✅ Funil de 21 etapas criado');
        }

        // Clicar no funil para editá-lo
        await quiz21Card.click();

        // Aguardar redirecionamento para o editor
        await page.waitForURL('**/editor/**');

        // Extrair funnelId da URL
        const url = page.url();
        const urlMatch = url.match(/\/editor\/(.+)/);
        if (urlMatch) {
            funnelId = urlMatch[1];
            console.log(`🆔 Funil ID extraído: ${funnelId}`);
        }

        expect(page.url()).toContain('/editor/');
    });

    test('3️⃣ Editor: Carregar e visualizar funil', async () => {
        console.log('🎨 Teste 3: Carregando funil no editor...');

        // Aguardar carregamento completo do editor
        await page.waitForSelector('[data-testid="modern-unified-editor"]', { timeout: 15000 });

        // Verificar se o toolbar está visível
        await expect(page.locator('[data-testid="editor-toolbar"]')).toBeVisible();

        // Verificar se o canvas está carregado
        await expect(page.locator('[data-testid="editor-canvas"]')).toBeVisible();

        // Verificar se o painel de propriedades está presente
        await expect(page.locator('[data-testid="properties-panel"]')).toBeVisible();

        console.log('✅ Editor carregado completamente');

        // Tirar screenshot para documentação
        await page.screenshot({
            path: './test-results/editor-loaded.png',
            fullPage: true
        });
    });

    test('4️⃣ Editor: Editar propriedades do componente', async () => {
        console.log('✏️ Teste 4: Editando propriedades...');

        // Selecionar um componente no canvas
        const quizComponent = await page.locator('[data-component-type="quiz-app-connected"]').first();

        if (await quizComponent.count() > 0) {
            await quizComponent.click();
            console.log('🎯 Componente quiz selecionado');
        } else {
            // Se não há componente, adicionar um
            console.log('🆕 Adicionando componente quiz...');
            await page.click('[data-testid="add-component-btn"]');
            await page.click('[data-testid="component-quiz-app-connected"]');
        }

        // Aguardar o painel de propriedades carregar
        await page.waitForSelector('[data-testid="dynamic-properties-panel"]');

        // Editar propriedades específicas
        const titleInput = page.locator('[data-testid="property-title"]');
        if (await titleInput.count() > 0) {
            await titleInput.clear();
            await titleInput.fill('Quiz de Estilo Pessoal - EDITADO E2E');
            console.log('📝 Título alterado');
        }

        const colorPicker = page.locator('[data-testid="property-primaryColor"]');
        if (await colorPicker.count() > 0) {
            await colorPicker.fill('#FF6B6B');
            console.log('🎨 Cor primária alterada');
        }

        const progressToggle = page.locator('[data-testid="property-showProgressBar"]');
        if (await progressToggle.count() > 0) {
            await progressToggle.check();
            console.log('📊 Barra de progresso ativada');
        }

        // Aguardar um pouco para as mudanças serem processadas
        await page.waitForTimeout(1000);

        console.log('✅ Propriedades editadas com sucesso');
    });

    test('5️⃣ Editor: Salvar alterações', async () => {
        console.log('💾 Teste 5: Salvando alterações...');

        // Monitorar requests de salvamento
        let saveRequestSent = false;
        page.on('response', response => {
            if (response.url().includes('/api/') && response.request().method() === 'POST') {
                console.log(`💾 Request de salvamento detectado: ${response.url()}`);
                saveRequestSent = true;
            }
        });

        // Clicar no botão salvar
        const saveButton = page.locator('[data-testid="save-button"]');
        await expect(saveButton).toBeVisible();
        await saveButton.click();

        // Aguardar confirmação de salvamento
        await page.waitForSelector('[data-testid="save-success-notification"]', { timeout: 10000 });

        const notification = await page.locator('[data-testid="save-success-notification"]').textContent();
        console.log(`📢 Notificação: ${notification}`);

        // Verificar se o estado "salvo" está ativo
        await expect(page.locator('[data-testid="unsaved-changes"]')).not.toBeVisible();

        console.log('✅ Alterações salvas com sucesso');
    });

    test('6️⃣ Validação: Verificar persistência no Supabase', async () => {
        console.log('🔍 Teste 6: Validando persistência...');

        // Recarregar a página para verificar se os dados persistiram
        await page.reload();

        // Aguardar recarregamento completo
        await page.waitForSelector('[data-testid="modern-unified-editor"]', { timeout: 15000 });

        // Selecionar o mesmo componente novamente
        const quizComponent = await page.locator('[data-component-type="quiz-app-connected"]').first();
        if (await quizComponent.count() > 0) {
            await quizComponent.click();
        }

        // Verificar se as alterações foram mantidas
        const titleInput = page.locator('[data-testid="property-title"]');
        if (await titleInput.count() > 0) {
            const titleValue = await titleInput.inputValue();
            expect(titleValue).toContain('EDITADO E2E');
            console.log(`✅ Título persistido: "${titleValue}"`);
        }

        const colorInput = page.locator('[data-testid="property-primaryColor"]');
        if (await colorInput.count() > 0) {
            const colorValue = await colorInput.inputValue();
            expect(colorValue).toBe('#FF6B6B');
            console.log(`✅ Cor persistida: ${colorValue}`);
        }

        const progressToggle = page.locator('[data-testid="property-showProgressBar"]');
        if (await progressToggle.count() > 0) {
            const isChecked = await progressToggle.isChecked();
            expect(isChecked).toBe(true);
            console.log(`✅ Barra de progresso persistida: ${isChecked}`);
        }

        console.log('✅ Dados persistidos corretamente no Supabase');
    });

    test('7️⃣ Performance: Verificar tempo de carregamento', async () => {
        console.log('⚡ Teste 7: Verificando performance...');

        const startTime = Date.now();

        // Navegar para uma nova instância do editor
    await page.goto(`${BASE_URL}/editor/${funnelId}`);

        // Aguardar carregamento completo
        await page.waitForSelector('[data-testid="modern-unified-editor"]');
        await page.waitForLoadState('networkidle');

        const loadTime = Date.now() - startTime;

        console.log(`⏱️ Tempo de carregamento: ${loadTime}ms`);

        // Verificar se o carregamento foi rápido (menos de 5 segundos)
        expect(loadTime).toBeLessThan(5000);

        // Verificar métricas de performance
        const performanceMetrics = await page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            return {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
                firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
            };
        });

        console.log('📊 Métricas de Performance:', performanceMetrics);

        // Validar métricas básicas
        expect(performanceMetrics.domContentLoaded).toBeGreaterThan(0);

        console.log('✅ Performance validada');
    });

    // Função auxiliar para criar funil de teste
    async function createTestFunnel() {
        console.log('🆕 Criando funil de teste...');

        await page.click('[data-testid="create-new-funnel"]');

        await page.fill('[data-testid="funnel-name-input"]', 'Quiz de 21 Etapas - Teste E2E');
        await page.fill('[data-testid="funnel-description-input"]', 'Funil criado automaticamente para teste E2E');

        await page.selectOption('[data-testid="funnel-template-select"]', 'quiz21StepsComplete');

        await page.click('[data-testid="create-funnel-submit"]');

        await page.waitForSelector('[data-testid="funnel-created-notification"]');

        console.log('✅ Funil de teste criado');
    }
});

// Configuração específica para este teste
test.use({
    viewport: { width: 1920, height: 1080 },
    video: 'retain-on-failure',
    screenshot: 'only-on-failure'
});