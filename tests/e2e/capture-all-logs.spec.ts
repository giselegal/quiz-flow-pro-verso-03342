import { test } from '@playwright/test';

test('🔍 CAPTURAR CONSOLE LOGS REAIS', async ({ page }) => {
    const allLogs: any[] = [];
    
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        allLogs.push({ type, text });
        console.log(`[${type.toUpperCase()}] ${text}`);
    });
    
    page.on('pageerror', error => {
        console.error(`[PAGE ERROR] ${error.message}\n${error.stack}`);
    });

    await page.goto('http://localhost:8081/editor?funnel=quiz21StepsComplete');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);

    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`TOTAL DE LOGS: ${allLogs.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Verificar se QuizModularEditor está logando
    const editorLogs = allLogs.filter(l => l.text.includes('QuizModularEditor'));
    console.log(`\n📦 QuizModularEditor logs: ${editorLogs.length}`);
    editorLogs.forEach(l => console.log(`  ${l.text}`));

    // Verificar se CanvasColumn está logando
    const canvasLogs = allLogs.filter(l => l.text.includes('CanvasColumn'));
    console.log(`\n🎨 CanvasColumn logs: ${canvasLogs.length}`);
    canvasLogs.forEach(l => console.log(`  ${l.text}`));

    // Verificar se getStep está sendo chamado
    const getStepLogs = allLogs.filter(l => l.text.includes('getStep'));
    console.log(`\n📥 getStep logs: ${getStepLogs.length}`);
    getStepLogs.forEach(l => console.log(`  ${l.text}`));

    // Buscar por "vaiCarregar"
    const vaiCarregarLogs = allLogs.filter(l => l.text.includes('vaiCarregar'));
    console.log(`\n🔍 vaiCarregar logs: ${vaiCarregarLogs.length}`);
    vaiCarregarLogs.forEach(l => console.log(`  ${l.text}`));

    // Verificar blocos
    const blocksLogs = allLogs.filter(l => l.text.includes('blocks') || l.text.includes('Blocos'));
    console.log(`\n📦 Logs sobre blocos: ${blocksLogs.length}`);
    blocksLogs.slice(0, 20).forEach(l => console.log(`  ${l.text}`));
});
