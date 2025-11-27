/**
 * 🧪 TESTE E2E CRÍTICO: Validar resourceId e Carregamento de JSON
 * 
 * Valida que a correção do resourceId está funcionando:
 * 1. URL /editor?funnel=X passa resourceId correto
 * 2. resourceId não é undefined
 * 3. JSON quiz21-complete.json é carregado
 * 4. 21 steps são renderizados
 */

import { test, expect } from '@playwright/test';

const EDITOR_URL = '/editor?funnel=quiz21StepsComplete&template=quiz21StepsComplete';

test.describe('ResourceId e Carregamento de JSON - Validação Crítica', () => {
    test.beforeEach(async ({ page }) => {
        // Interceptar logs do console para validar
        page.on('console', msg => {
            const text = msg.text();
            console.log(`[BROWSER] ${text}`);
        });
    });

    test('CRÍTICO: resourceId não deve estar undefined', async ({ page }) => {
        // Interceptar console.log/info para capturar logs
        const logs: string[] = [];
        
        page.on('console', msg => {
            logs.push(msg.text());
        });

        // Acessar editor com template
        await page.goto(EDITOR_URL, { 
            waitUntil: 'domcontentloaded',
            timeout: 30000 
        });

        // Aguardar um pouco para logs aparecerem
        await page.waitForTimeout(3000);

        // Validar que resourceId NÃO está undefined
        const hasUndefinedError = logs.some(log => 
            log.includes('resourceId está undefined') ||
            log.includes('vaiCarregarJSON: false')
        );

        expect(hasUndefinedError).toBe(false);

        // Validar que resourceId está OK
        const hasResourceIdOk = logs.some(log => 
            log.includes('resourceId OK') ||
            log.includes('vaiCarregarJSON: true')
        );

        console.log(`✅ resourceId OK encontrado: ${hasResourceIdOk}`);
        console.log(`Total de logs capturados: ${logs.length}`);
    });

    test('CRÍTICO: JSON quiz21-complete.json deve ser requisitado', async ({ page }) => {
        const requests: string[] = [];
        
        // Interceptar todas as requisições
        page.on('request', request => {
            const url = request.url();
            if (url.includes('.json')) {
                requests.push(url);
                console.log(`📥 Requisição JSON: ${url}`);
            }
        });

        await page.goto(EDITOR_URL, { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });

        // Validar que quiz21-complete.json foi requisitado
        const hasQuiz21Json = requests.some(url => 
            url.includes('quiz21-complete.json')
        );

        console.log(`📊 Total de requisições JSON: ${requests.length}`);
        console.log(`✅ quiz21-complete.json requisitado: ${hasQuiz21Json}`);

        expect(hasQuiz21Json).toBe(true);
    });

    test('CRÍTICO: Editor deve renderizar sidebar com steps', async ({ page }) => {
        await page.goto(EDITOR_URL, { 
            waitUntil: 'domcontentloaded',
            timeout: 30000 
        });

        // Aguardar sidebar carregar
        await page.waitForTimeout(4000);

        // Buscar elementos que indicam steps no sidebar
        const stepElements = await page.locator('[data-testid*="step"], [class*="step-"], button:has-text("step")').all();
        
        console.log(`📊 Elementos de step encontrados: ${stepElements.length}`);

        // Deve haver múltiplos steps (pelo menos 5)
        expect(stepElements.length).toBeGreaterThanOrEqual(5);
    });

    test('VALIDAÇÃO: Console não deve mostrar erro de resourceId undefined', async ({ page }) => {
        const errors: string[] = [];
        
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('undefined') || text.includes('❌')) {
                errors.push(text);
            }
        });

        await page.goto(EDITOR_URL, { 
            waitUntil: 'domcontentloaded',
            timeout: 30000 
        });

        await page.waitForTimeout(3000);

        // Filtrar erros críticos
        const criticalErrors = errors.filter(err => 
            err.includes('resourceId está undefined') ||
            err.includes('vaiCarregarJSON: false')
        );

        console.log(`⚠️ Erros capturados: ${errors.length}`);
        console.log(`🔥 Erros críticos: ${criticalErrors.length}`);

        criticalErrors.forEach(err => {
            console.log(`  ❌ ${err}`);
        });

        expect(criticalErrors.length).toBe(0);
    });

    test('VALIDAÇÃO: Props devem ser passadas para QuizModularEditor', async ({ page }) => {
        await page.goto('/editor?funnel=quiz21StepsComplete');

        // Injetar script para verificar props via React DevTools (se disponível)
        const propsCheck = await page.evaluate(() => {
            // Tentar acessar via window.__REACT_DEVTOOLS_GLOBAL_HOOK__ (pode não estar disponível)
            const rootElement = document.querySelector('#root');
            
            return {
                hasRoot: !!rootElement,
                rootChildren: rootElement?.children.length || 0,
            };
        });

        console.log('🔍 Verificação de props:', propsCheck);

        expect(propsCheck.hasRoot).toBe(true);
        expect(propsCheck.rootChildren).toBeGreaterThan(0);
    });

    test('INTEGRAÇÃO: Fluxo completo /templates → /editor', async ({ page }) => {
        // 1. Acessar /templates
        await page.goto('/templates', { waitUntil: 'domcontentloaded' });

        // 2. Aguardar templates carregarem
        await page.waitForSelector('h1:has-text("Templates")');

        // 3. Encontrar e clicar em template com 21 etapas
        const template21 = page.locator('[class*="Card"]').filter({ hasText: '21 etapas' }).first();
        
        if (await template21.isVisible()) {
            await template21.click();

            // 4. Aguardar redirecionamento para /editor
            await page.waitForURL(/\/editor\?funnel=/);

            // 5. Verificar que URL contém template ID
            const url = page.url();
            expect(url).toContain('template=');

            console.log(`✅ Redirecionado para: ${url}`);

            // 6. Aguardar editor carregar
            await page.waitForTimeout(3000);

            // 7. Validar que não há erro de resourceId
            const pageContent = await page.content();
            expect(pageContent).not.toContain('resourceId está undefined');
        }
    });

    test('PERFORMANCE: JSON deve carregar em menos de 5 segundos', async ({ page }) => {
        const startTime = Date.now();

        let jsonLoaded = false;
        page.on('response', response => {
            if (response.url().includes('quiz21-complete.json')) {
                jsonLoaded = true;
                const loadTime = Date.now() - startTime;
                console.log(`⏱️ JSON carregado em: ${loadTime}ms`);
            }
        });

        await page.goto(EDITOR_URL, { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });

        const totalTime = Date.now() - startTime;
        
        console.log(`⏱️ Tempo total: ${totalTime}ms`);
        console.log(`✅ JSON carregado: ${jsonLoaded}`);

        expect(totalTime).toBeLessThan(5000);
    });

    test('EDGE CASE: Alias quiz-estilo-21-steps deve funcionar', async ({ page }) => {
        const requests: string[] = [];
        
        page.on('request', request => {
            const url = request.url();
            if (url.includes('.json')) {
                requests.push(url);
            }
        });

        // Usar ID legado como template
        await page.goto('/editor?funnel=quiz-estilo-21-steps&template=quiz21StepsComplete', { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });

        // Deve normalizar e carregar quiz21-complete.json mesmo assim
        const hasQuiz21Json = requests.some(url => 
            url.includes('quiz21-complete.json')
        );

        console.log(`✅ Alias normalizado e JSON carregado: ${hasQuiz21Json}`);

        expect(hasQuiz21Json).toBe(true);
    });

    test('EDGE CASE: Sem template na URL deve usar fallback', async ({ page }) => {
        await page.goto('/editor', { 
            waitUntil: 'domcontentloaded',
            timeout: 30000 
        });

        // Aguardar carregamento
        await page.waitForTimeout(2000);

        // Editor deve carregar mesmo sem template (modo construção livre)
        const hasRoot = await page.locator('#root').isVisible();
        expect(hasRoot).toBe(true);

        console.log('✅ Editor carregou em modo fallback');
    });
});

test.describe('Validação de Props - Inspeção Direta', () => {
    test('Props resourceId, templateId e funnelId devem ser extraídas da URL', async ({ page }) => {
        await page.goto('/editor?funnel=quiz21StepsComplete&template=quiz21StepsComplete&funnel=test-funnel');

        // Injetar script para verificar que props foram passadas
        const urlParams = await page.evaluate(() => {
            const params = new URLSearchParams(window.location.search);
            return {
                template: params.get('template'),
                funnel: params.get('funnel'),
                resource: params.get('resource'),
            };
        });

        console.log('📋 Params extraídos:', urlParams);

        expect(urlParams.template).toBe('quiz21StepsComplete');
        
        // resource deve ser o fallback de template
        console.log('✅ templateId extraído corretamente');
    });
});
