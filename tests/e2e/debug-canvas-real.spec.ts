import { test, expect } from '@playwright/test';

test('🔥 DEBUG REAL: O que está acontecendo no Canvas?', async ({ page }) => {
    const logs: string[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];
    
    page.on('console', msg => {
        const text = msg.text();
        const type = msg.type();
        
        if (type === 'error') errors.push(text);
        else if (type === 'warning') warnings.push(text);
        else logs.push(text);
        
        // Log tudo em tempo real
        if (text.includes('QuizModularEditor') || 
            text.includes('resourceId') ||
            text.includes('getStep') ||
            text.includes('blocks') ||
            text.includes('CanvasColumn') ||
            text.includes('vaiCarregar') ||
            text.includes('JSON')) {
            console.log(`📍 ${type.toUpperCase()}: ${text}`);
        }
    });
    
    page.on('pageerror', error => {
        console.error(`❌ PAGE ERROR: ${error.message}`);
        errors.push(error.message);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔥 ABRINDO EDITOR NO NAVEGADOR');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await page.goto('http://localhost:8080/editor?funnel=quiz21StepsComplete');
    
    console.log('⏳ Aguardando carregamento inicial...\n');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Verificar estrutura da página
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 ESTRUTURA DA PÁGINA');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const hasCanvas = await page.locator('[class*="canvas"]').count() > 0;
    console.log(`Canvas presente: ${hasCanvas ? '✅ SIM' : '❌ NÃO'}`);

    const blockCount = await page.locator('[data-block-id]').count();
    console.log(`Blocos renderizados: ${blockCount}`);

    const hasLoader = await page.locator('[class*="loading"], [class*="skeleton"]').count() > 0;
    console.log(`Loader visível: ${hasLoader ? '⏳ SIM' : '✅ NÃO'}`);

    const hasModoLivre = await page.locator('text=Modo Construção Livre').count() > 0;
    console.log(`Modo Construção Livre: ${hasModoLivre ? '⚠️ SIM (PROBLEMA!)' : '✅ NÃO'}`);

    // Verificar steps
    const stepButtons = await page.locator('button[data-step-id]').count();
    console.log(`Steps na sidebar: ${stepButtons}`);

    // Capturar estado via evaluate
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 ESTADO DO EDITOR (JavaScript)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const editorState = await page.evaluate(() => {
        const params = new URLSearchParams(window.location.search);
        return {
            url: window.location.href,
            templateParam: params.get('template'),
            resourceParam: params.get('resource'),
            funnelParam: params.get('funnelId'),
            canvasElements: document.querySelectorAll('[data-block-id]').length,
            hasRoot: !!document.getElementById('root'),
            bodyClasses: document.body.className,
        };
    });

    console.log('URL:', editorState.url);
    console.log('template=', editorState.templateParam);
    console.log('resource=', editorState.resourceParam);
    console.log('funnelId=', editorState.funnelParam);
    console.log('Blocos no DOM:', editorState.canvasElements);
    console.log('Root presente:', editorState.hasRoot ? '✅' : '❌');

    // Screenshot
    await page.screenshot({ path: '/tmp/editor-debug.png', fullPage: true });
    console.log('\n📸 Screenshot salvo: /tmp/editor-debug.png');

    // Filtrar logs relevantes
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 LOGS RELEVANTES DO CONSOLE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const relevantLogs = logs.filter(l => 
        l.includes('QuizModularEditor') || 
        l.includes('CanvasColumn') ||
        l.includes('resourceId') ||
        l.includes('blocks') ||
        l.includes('getStep') ||
        l.includes('vaiCarregar')
    );

    if (relevantLogs.length > 0) {
        relevantLogs.slice(0, 30).forEach(log => console.log(`  ${log}`));
        if (relevantLogs.length > 30) {
            console.log(`  ... e mais ${relevantLogs.length - 30} logs`);
        }
    } else {
        console.log('  ⚠️ Nenhum log relevante capturado');
    }

    // Erros
    if (errors.length > 0) {
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('❌ ERROS DETECTADOS');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        errors.forEach(err => console.log(`  ${err}`));
    }

    // Warnings
    if (warnings.length > 0) {
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️ WARNINGS');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        warnings.slice(0, 10).forEach(warn => console.log(`  ${warn}`));
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 DIAGNÓSTICO');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (blockCount === 0) {
        console.log('❌ PROBLEMA: Canvas vazio (0 blocos renderizados)');
        if (hasModoLivre) {
            console.log('   → Editor entrou em "Modo Construção Livre"');
            console.log('   → resourceId ou templateId não foi passado corretamente');
        }
    } else {
        console.log(`✅ Canvas renderizou ${blockCount} blocos`);
    }

    if (errors.length > 0) {
        console.log(`❌ ${errors.length} erros JavaScript detectados`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Assertions
    expect(editorState.templateParam).toBe('quiz21StepsComplete');
    expect(blockCount).toBeGreaterThan(0);
});
