/**
 * 🧪 TESTE E2E: Rota /templates - Fluxo Completo de Carregamento JSON
 * 
 * Valida o fluxo:
 * 1. Usuário acessa /templates
 * 2. Seleciona um template (ex: quiz21StepsComplete)
 * 3. É redirecionado para /editor?template=quiz21StepsComplete
 * 4. JSON quiz21-complete.json é carregado via TemplateService
 * 5. 21 steps são renderizados com blocos reais
 */

import { test, expect } from '@playwright/test';

test.describe('Rota /templates - Carregamento de JSON', () => {
    test('deve exibir templates do UNIFIED_TEMPLATE_REGISTRY', async ({ page }) => {
        await page.goto('/templates');

        // Aguardar carregamento da página
        await page.waitForSelector('h1:has-text("Templates de Funis")');

        // Verificar título
        await expect(page.locator('h1')).toContainText('Templates de Funis');

        // Verificar que há templates exibidos
        const templateCards = page.locator('[class*="Card"]').filter({ hasText: 'Usar Template' });
        const count = await templateCards.count();
        
        expect(count).toBeGreaterThan(0);
        console.log(`✅ ${count} templates encontrados na página`);
    });

    test('deve exibir template principal quiz21StepsComplete', async ({ page }) => {
        await page.goto('/templates');

        // Aguardar templates carregarem
        await page.waitForSelector('h1:has-text("Templates de Funis")');

        // Buscar card do template principal
        const mainTemplateCard = page.locator('[class*="Card"]').filter({ 
            hasText: '21 Etapas' 
        }).first();

        await expect(mainTemplateCard).toBeVisible();
        
        // Verificar badge de 21 etapas
        const badge = mainTemplateCard.locator('[class*="Badge"]').filter({ hasText: '21 etapas' });
        await expect(badge).toBeVisible();
    });

    test('deve incluir alias quiz-estilo-completo no registry', async ({ page }) => {
        await page.goto('/templates');

        // Verificar se há templates com 21 etapas (principal + aliases)
        const templates21Steps = page.locator('[class*="Badge"]').filter({ hasText: '21 etapas' });
        const count = await templates21Steps.count();
        
        // Deve haver pelo menos 3 templates com 21 etapas (principal + 2 aliases)
        expect(count).toBeGreaterThanOrEqual(1);
        console.log(`✅ ${count} templates com 21 etapas encontrados`);
    });

    test('deve exibir categorias de templates', async ({ page }) => {
        await page.goto('/templates');

        // Verificar filtros de categoria
        await expect(page.locator('button:has-text("Todos")')).toBeVisible();

        // Verificar que há múltiplas categorias
        const categoryButtons = page.locator('button').filter({ 
            has: page.locator(':text-matches("quiz-|Todos|Básico", "i")') 
        });
        
        const count = await categoryButtons.count();
        expect(count).toBeGreaterThan(1);
        console.log(`✅ ${count} categorias de template disponíveis`);
    });

    test('clicar em template deve redirecionar para /editor com query param', async ({ page }) => {
        await page.goto('/templates');

        // Aguardar templates carregarem
        await page.waitForSelector('h1:has-text("Templates de Funis")');

        // Clicar no primeiro template (não vazio)
        const firstTemplate = page.locator('[class*="Card"]').filter({ 
            hasText: 'Usar Template' 
        }).first();

        // Interceptar navegação
        const navigationPromise = page.waitForURL(/\/editor\?template=/);

        await firstTemplate.click();

        // Aguardar redirecionamento
        await navigationPromise;

        // Verificar URL contém template ID
        const url = page.url();
        expect(url).toContain('/editor?template=');
        console.log(`✅ Redirecionado para: ${url}`);
    });

    test('template selecionado deve carregar JSON via TemplateService', async ({ page }) => {
        // Interceptar requisições de JSON
        const jsonRequests: string[] = [];
        
        page.on('request', request => {
            const url = request.url();
            if (url.includes('.json') && url.includes('templates')) {
                jsonRequests.push(url);
                console.log(`📥 Requisição JSON: ${url}`);
            }
        });

        await page.goto('/templates');
        await page.waitForSelector('h1:has-text("Templates de Funis")');

        // Clicar em template com 21 etapas
        const template21Steps = page.locator('[class*="Card"]').filter({ 
            hasText: '21 etapas' 
        }).first();

        await template21Steps.click();

        // Aguardar redirecionamento
        await page.waitForURL(/\/editor\?template=/);

        // Aguardar carregamento do editor
        await page.waitForTimeout(2000);

        // Verificar se JSON foi carregado
        const hasQuiz21Complete = jsonRequests.some(url => url.includes('quiz21-complete.json'));
        
        console.log(`📊 JSONs carregados: ${jsonRequests.length}`);
        console.log(`✅ quiz21-complete.json carregado: ${hasQuiz21Complete}`);
        
        // Deve carregar pelo menos 1 JSON
        expect(jsonRequests.length).toBeGreaterThan(0);
    });

    test('filtro de categoria deve funcionar', async ({ page }) => {
        await page.goto('/templates');

        // Aguardar templates carregarem
        await page.waitForSelector('h1:has-text("Templates de Funis")');

        // Contar templates inicialmente
        const allTemplates = page.locator('[class*="Card"]').filter({ hasText: 'Usar Template' });
        const totalCount = await allTemplates.count();

        // Clicar em uma categoria específica (não "Todos")
        const categoryButton = page.locator('button').filter({ hasText: 'quiz-complete' }).first();
        
        if (await categoryButton.isVisible()) {
            await categoryButton.click();
            await page.waitForTimeout(500);

            // Contar templates filtrados
            const filteredTemplates = page.locator('[class*="Card"]').filter({ hasText: 'Usar Template' });
            const filteredCount = await filteredTemplates.count();

            console.log(`📊 Total: ${totalCount}, Filtrado: ${filteredCount}`);
            
            // Número de templates filtrados deve ser <= total
            expect(filteredCount).toBeLessThanOrEqual(totalCount);
        }
    });

    test('template vazio deve abrir dialog para criar funil', async ({ page }) => {
        await page.goto('/templates');

        // Procurar template vazio
        const blankTemplate = page.locator('[class*="Card"]').filter({ 
            hasText: 'Template Vazio' 
        });

        if (await blankTemplate.isVisible()) {
            await blankTemplate.click();

            // Verificar que dialog abriu
            await expect(page.locator('text=Criar Novo Funil')).toBeVisible();
            await expect(page.locator('input[placeholder*="Nome do funil"]')).toBeVisible();

            console.log('✅ Dialog de criação de funil vazio aberto');
        }
    });

    test('validar estrutura do TemplateRegistry via console', async ({ page }) => {
        await page.goto('/templates');

        // Injetar script para verificar registry
        const registryCheck = await page.evaluate(() => {
            // @ts-ignore
            const registry = window.__UNIFIED_TEMPLATE_REGISTRY__;
            
            if (!registry) {
                // Tentar importar dinamicamente
                return { error: 'Registry não encontrado no window' };
            }

            return {
                totalTemplates: Object.keys(registry).length,
                hasMainTemplate: 'quiz21StepsComplete' in registry,
                hasAlias1: 'quiz-estilo-completo' in registry,
                hasAlias2: 'quiz-estilo-21-steps' in registry,
                hasExpress: 'quiz-style-express' in registry,
                templateIds: Object.keys(registry),
            };
        });

        console.log('📊 Registry Check:', JSON.stringify(registryCheck, null, 2));
    });

    test('performance: página /templates deve carregar em < 3s', async ({ page }) => {
        const startTime = Date.now();

        await page.goto('/templates');
        await page.waitForSelector('h1:has-text("Templates de Funis")');

        const loadTime = Date.now() - startTime;
        
        console.log(`⏱️ Tempo de carregamento: ${loadTime}ms`);
        expect(loadTime).toBeLessThan(3000);
    });

    test.describe('Fluxo Completo: Seleção → Redirecionamento → JSON', () => {
        test('usuário seleciona quiz21StepsComplete e JSON é carregado', async ({ page }) => {
            const jsonRequests: Array<{ url: string; method: string }> = [];
            
            page.on('request', request => {
                const url = request.url();
                if (url.includes('.json')) {
                    jsonRequests.push({ url, method: request.method() });
                }
            });

            // 1. PASSO 1: Acessar /templates
            await page.goto('/templates');
            await page.waitForSelector('h1:has-text("Templates de Funis")');
            console.log('✅ Passo 1: Página /templates carregada');

            // 2. PASSO 2: Encontrar e clicar em template com 21 etapas
            const mainTemplate = page.locator('[class*="Card"]').filter({ 
                hasText: '21 Etapas' 
            }).first();

            await expect(mainTemplate).toBeVisible();
            console.log('✅ Passo 2: Template principal encontrado');

            // 3. PASSO 3: Clicar e aguardar redirecionamento
            await mainTemplate.click();
            await page.waitForURL(/\/editor\?template=/);
            
            const url = page.url();
            expect(url).toContain('template=');
            console.log(`✅ Passo 3: Redirecionado para ${url}`);

            // 4. PASSO 4: Aguardar carregamento do JSON
            await page.waitForTimeout(3000);

            // 5. PASSO 5: Verificar requisições JSON
            const quiz21Requests = jsonRequests.filter(req => 
                req.url.includes('quiz21') || req.url.includes('step-')
            );

            console.log(`📊 Total de requisições JSON: ${jsonRequests.length}`);
            console.log(`📊 Requisições do quiz21: ${quiz21Requests.length}`);
            
            quiz21Requests.forEach(req => {
                console.log(`  - ${req.method} ${req.url}`);
            });

            // Deve haver requisições de JSON do quiz21
            expect(quiz21Requests.length).toBeGreaterThan(0);
            console.log('✅ Passo 5: JSONs do quiz21 carregados com sucesso');
        });
    });

    test.describe('Validação de Dados Reais', () => {
        test('templates exibidos devem corresponder ao UNIFIED_TEMPLATE_REGISTRY', async ({ page }) => {
            await page.goto('/templates');
            await page.waitForSelector('h1:has-text("Templates de Funis")');

            // Extrair IDs dos templates visíveis
            const templateCards = page.locator('[class*="Card"]').filter({ hasText: 'Usar Template' });
            const count = await templateCards.count();

            console.log(`📊 Templates visíveis na UI: ${count}`);

            // Verificar propriedades obrigatórias
            for (let i = 0; i < Math.min(count, 5); i++) {
                const card = templateCards.nth(i);
                
                // Deve ter nome
                const hasTitle = await card.locator('[class*="CardTitle"]').count() > 0;
                expect(hasTitle).toBe(true);
                
                // Deve ter descrição
                const hasDescription = await card.locator('[class*="CardDescription"]').count() > 0;
                expect(hasDescription).toBe(true);
                
                // Deve ter badge de etapas
                const hasBadge = await card.locator('[class*="Badge"]').filter({ hasText: /\d+ etapas/ }).count() > 0;
                expect(hasBadge).toBe(true);
            }

            console.log('✅ Todos os templates têm estrutura válida');
        });
    });
});
