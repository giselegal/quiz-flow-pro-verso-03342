import { test } from '@playwright/test';

test('DEBUG: Ver o que acontece após clicar no botão', async ({ page }) => {
    await page.goto('/quiz-estilo');
    await page.waitForLoadState('networkidle');

    console.log('\n📍 URL inicial:', page.url());

    // Preenche nome
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('DEBUG TEST');

    // Clica no botão
    const startButton = page.locator('button[type="submit"]').first();
    await startButton.click();

    // Aguarda um pouco
    await page.waitForTimeout(2000);

    console.log('\n📍 URL após clicar:', page.url());

    // Captura TODO o HTML da página
    const html = await page.content();

    // Extrai apenas os textos visíveis
    const bodyText = await page.locator('body').textContent();

    console.log('\n📄 TEXTOS VISÍVEIS (primeiros 1000 caracteres):');
    console.log(bodyText?.substring(0, 1000));

    console.log('\n🔍 Procurando por diferentes seletores:');

    const seletores = [
        'button:not([disabled])',
        '[data-option]',
        '[role="button"]',
        '.option',
        '.quiz-option',
        'input[type="radio"]',
        'input[type="checkbox"]',
        '[data-testid*="option"]'
    ];

    for (const seletor of seletores) {
        const count = await page.locator(seletor).count();
        console.log(`  ${seletor}: ${count} elementos`);
    }

    // Lista todos os botões
    console.log('\n🔘 TODOS OS BOTÕES:');
    const buttons = page.locator('button');
    const btnCount = await buttons.count();
    for (let i = 0; i < Math.min(5, btnCount); i++) {
        const text = await buttons.nth(i).textContent();
        const disabled = await buttons.nth(i).isDisabled();
        console.log(`  ${i + 1}. "${text?.trim()}" (disabled: ${disabled})`);
    }

    // Lista elementos com role="button"
    console.log('\n👆 ELEMENTOS COM ROLE="BUTTON":');
    const roleButtons = page.locator('[role="button"]');
    const roleCount = await roleButtons.count();
    console.log(`  Total: ${roleCount}`);
    for (let i = 0; i < Math.min(3, roleCount); i++) {
        const text = await roleButtons.nth(i).textContent();
        console.log(`  ${i + 1}. "${text?.trim().substring(0, 50)}..."`);
    }

    // Tenta clicar em 3 opções
    console.log('\n🖱️  TENTANDO CLICAR EM 3 OPÇÕES:');
    for (let i = 0; i < 3; i++) {
        await roleButtons.nth(i).click();
        await page.waitForTimeout(300);
        console.log(`  ✓ Clicou na opção ${i + 1}`);
    }

    // Verifica se o botão habilitou
    await page.waitForTimeout(500);
    const continueBtn = page.locator('button:has-text("Selecionar e Continuar")');
    const isEnabled = await continueBtn.isEnabled();
    console.log(`\n✅ Botão "Selecionar e Continuar" habilitado: ${isEnabled}`);
});