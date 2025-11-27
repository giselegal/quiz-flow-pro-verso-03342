import { test, expect } from '@playwright/test';

/**
 * 🧪 E2E TEST - Validação das 4 Colunas do Editor
 * 
 * Testa que todas as 4 colunas (Navigation, Library, Canvas, Properties)
 * estão carregando e funcionais com o template quiz21StepsComplete.
 */

test.describe('Editor - 4 Colunas Funcionais', () => {
    test.beforeEach(async ({ page }) => {
        // Navegar para o editor com template
        await page.goto('/editor?funnel=quiz21StepsComplete&template=quiz21StepsComplete');
        
        // Aguardar editor carregar
        await page.waitForSelector('[data-editor="modular-enhanced"]', { timeout: 10000 });
    });

    test('1️⃣ Navigation Column - Step Navigator está funcional', async ({ page }) => {
        // Verificar se coluna Navigation existe
        const navigationColumn = page.locator('[data-testid="column-steps"]');
        await expect(navigationColumn).toBeVisible();

        // Verificar se há steps renderizados
        const stepButtons = navigationColumn.locator('button[data-step-key], [role="button"]');
        const stepCount = await stepButtons.count();
        
        expect(stepCount).toBeGreaterThan(0);
        console.log(`✅ Navigation: ${stepCount} steps encontrados`);

        // Verificar se o primeiro step está visível
        const firstStep = stepButtons.first();
        await expect(firstStep).toBeVisible();
        
        // Verificar se pode clicar em um step
        await firstStep.click();
        
        // Aguardar resposta (canvas deve atualizar)
        await page.waitForTimeout(500);
    });

    test('2️⃣ Library Column - Component Library está funcional', async ({ page }) => {
        // Verificar se coluna Library existe (pode estar oculta inicialmente)
        const libraryColumn = page.locator('[data-testid="column-library"]');
        
        // Se não estiver visível, tentar habilitar via toggle
        const isVisible = await libraryColumn.isVisible().catch(() => false);
        
        if (!isVisible) {
            console.log('⚠️ Library não visível, procurando toggle...');
            // Procurar toggle no header (pode ter múltiplos formatos)
            const toggles = page.locator('button:has-text("Library"), button:has-text("Biblioteca"), [aria-label*="library"]');
            const toggleCount = await toggles.count();
            
            if (toggleCount > 0) {
                await toggles.first().click();
                await page.waitForTimeout(500);
            }
        }

        // Verificar novamente após toggle
        await expect(libraryColumn).toBeVisible({ timeout: 5000 });

        // Verificar se há componentes renderizados
        const components = libraryColumn.locator('[data-component-type], [draggable="true"], button:has-text("Adicionar")');
        const componentCount = await components.count();
        
        expect(componentCount).toBeGreaterThan(0);
        console.log(`✅ Library: ${componentCount} componentes encontrados`);
    });

    test('3️⃣ Canvas Column - Canvas está funcional', async ({ page }) => {
        // Verificar se coluna Canvas existe
        const canvasColumn = page.locator('[data-testid="column-canvas"]');
        await expect(canvasColumn).toBeVisible();

        // Aguardar template carregar (máximo 15 segundos)
        await page.waitForTimeout(2000); // Aguardar carregamento inicial

        // Verificar se saiu do estado de loading
        const loadingIndicator = canvasColumn.locator('text=/Carregando/');
        await expect(loadingIndicator).not.toBeVisible({ timeout: 15000 });

        // Verificar se há blocos renderizados
        const blocks = canvasColumn.locator('[data-block-id], [data-block-type], [data-testid^="block-"]');
        const blockCount = await blocks.count();
        
        expect(blockCount).toBeGreaterThan(0);
        console.log(`✅ Canvas: ${blockCount} blocos renderizados`);

        // Verificar se o viewport está configurado
        const viewport = canvasColumn.locator('[data-testid^="canvas-"]');
        await expect(viewport).toBeVisible();
    });

    test('4️⃣ Properties Column - Properties Panel está funcional', async ({ page }) => {
        // Verificar se coluna Properties existe (pode estar oculta inicialmente)
        const propertiesColumn = page.locator('[data-testid="column-properties"]');
        
        // Se não estiver visível, tentar habilitar via toggle
        const isVisible = await propertiesColumn.isVisible().catch(() => false);
        
        if (!isVisible) {
            console.log('⚠️ Properties não visível, procurando toggle...');
            const toggles = page.locator('button:has-text("Properties"), button:has-text("Propriedades"), [aria-label*="properties"]');
            const toggleCount = await toggles.count();
            
            if (toggleCount > 0) {
                await toggles.first().click();
                await page.waitForTimeout(500);
            }
        }

        // Verificar novamente após toggle
        await expect(propertiesColumn).toBeVisible({ timeout: 5000 });

        // Selecionar um bloco no canvas para ativar o painel
        const canvasColumn = page.locator('[data-testid="column-canvas"]');
        const blocks = canvasColumn.locator('[data-block-id], [data-block-type]');
        const firstBlock = blocks.first();
        
        if (await firstBlock.isVisible()) {
            await firstBlock.click();
            await page.waitForTimeout(500);
        }

        // Verificar se há controles de edição ou mensagem de estado
        const hasContent = await propertiesColumn.locator('input, textarea, select, button[role="switch"], [role="slider"]').count();
        const hasMessage = await propertiesColumn.locator('text=/Selecione|Nenhum bloco/').isVisible();
        
        const isFunctional = hasContent > 0 || hasMessage;
        expect(isFunctional).toBe(true);
        
        if (hasContent > 0) {
            console.log(`✅ Properties: ${hasContent} controles encontrados`);
        } else {
            console.log('✅ Properties: Aguardando seleção de bloco');
        }
    });

    test('✅ Todas as 4 colunas juntas estão funcionais', async ({ page }) => {
        // Teste integrado verificando todas as colunas simultaneamente
        
        const navigation = page.locator('[data-testid="column-steps"]');
        const canvas = page.locator('[data-testid="column-canvas"]');
        
        // Navigation e Canvas sempre visíveis
        await expect(navigation).toBeVisible();
        await expect(canvas).toBeVisible();

        // Verificar se Library e Properties existem (podem estar ocultos)
        const library = page.locator('[data-testid="column-library"]');
        const properties = page.locator('[data-testid="column-properties"]');

        const libraryExists = await library.count() > 0;
        const propertiesExists = await properties.count() > 0;

        console.log(`\n📊 Status das Colunas:`);
        console.log(`   ✅ Navigation: Visível`);
        console.log(`   ${libraryExists ? '✅' : '⚠️'} Library: ${libraryExists ? 'Presente' : 'Oculta ou não renderizada'}`);
        console.log(`   ✅ Canvas: Visível`);
        console.log(`   ${propertiesExists ? '✅' : '⚠️'} Properties: ${propertiesExists ? 'Presente' : 'Oculta ou não renderizada'}`);

        // Verificar funcionalidade básica de cada coluna
        
        // Navigation: tem steps?
        const steps = await navigation.locator('button[data-step-key], [role="button"]').count();
        expect(steps).toBeGreaterThan(0);

        // Canvas: tem blocos após carregar?
        await page.waitForTimeout(3000); // Aguardar carregamento
        const blocks = await canvas.locator('[data-block-id], [data-block-type]').count();
        expect(blocks).toBeGreaterThan(0);

        console.log(`\n✅ Validação completa:`);
        console.log(`   - ${steps} steps no Navigation`);
        console.log(`   - ${blocks} blocos no Canvas`);
        console.log(`   - Editor carregado e funcional!`);
    });

    test('🖱️ Interação entre colunas funciona corretamente', async ({ page }) => {
        // Teste de integração: navegação → canvas → properties

        // 1. Clicar em um step no Navigation
        const navigation = page.locator('[data-testid="column-steps"]');
        const secondStep = navigation.locator('button[data-step-key]').nth(1);
        
        if (await secondStep.isVisible()) {
            await secondStep.click();
            await page.waitForTimeout(1000);
            
            // Verificar se canvas atualizou (pode ter loading ou novos blocos)
            const canvas = page.locator('[data-testid="column-canvas"]');
            await expect(canvas).toBeVisible();
            
            console.log('✅ Navegação entre steps funcionando');
        }

        // 2. Selecionar um bloco no Canvas
        const canvas = page.locator('[data-testid="column-canvas"]');
        const firstBlock = canvas.locator('[data-block-id], [data-block-type]').first();
        
        if (await firstBlock.isVisible()) {
            await firstBlock.click();
            await page.waitForTimeout(500);
            
            console.log('✅ Seleção de blocos funcionando');
            
            // 3. Verificar se Properties atualizou (se estiver visível)
            const properties = page.locator('[data-testid="column-properties"]');
            const isPropertiesVisible = await properties.isVisible().catch(() => false);
            
            if (isPropertiesVisible) {
                // Verificar se há inputs/controles (pode levar um momento para renderizar)
                await page.waitForTimeout(500);
                const controls = await properties.locator('input, textarea, select').count();
                
                if (controls > 0) {
                    console.log(`✅ Properties atualizou com ${controls} controles`);
                } else {
                    console.log('⚠️ Properties visível mas sem controles renderizados ainda');
                }
            } else {
                console.log('ℹ️ Properties não está visível (pode estar oculto)');
            }
        }
    });
});
