import { test } from '@playwright/test';
import * as fs from 'fs';

/**
 * TESTE DE DEBUG - Tela de Resultados
 * Captura o HTML completo da tela de resultados para análise
 */

test('DEBUG: Capturar estrutura HTML da tela de resultados', async ({ page }) => {
    await page.goto('/quiz-estilo');
    await page.waitForLoadState('networkidle');

    // Preenche nome
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('Maria Silva');

    // Inicia quiz
    const startButton = page.locator('button[type="submit"]').first();
    await startButton.click();
    await page.waitForTimeout(1500);

    // Responde todas as perguntas até chegar nos resultados
    for (let i = 0; i < 20; i++) {
        const clickableElements = page.locator('button:not([disabled])').or(
            page.locator('[role="button"]')
        ).or(
            page.locator('div[class*="option"]')
        );

        const count = await clickableElements.count();
        console.log(`Step ${i + 2}: Encontrados ${count} elementos clicáveis`);

        if (count > 0) {
            await clickableElements.first().click({ timeout: 5000 });
            await page.waitForTimeout(1000);
        } else {
            console.log(`Nenhum elemento clicável no step ${i + 2}`);
            break;
        }
    }

    // Aguarda a tela de resultados carregar
    await page.waitForTimeout(2000);

    // Captura o HTML completo
    const htmlContent = await page.content();

    // Salva em arquivo para análise
    fs.writeFileSync('debug-results-page.html', htmlContent);
    console.log('✓ HTML salvo em: debug-results-page.html');

    // Captura informações específicas
    const bodyText = await page.locator('body').textContent();
    console.log('\n=== CONTEÚDO DA PÁGINA ===');
    console.log(bodyText?.substring(0, 1000));

    // Conta elementos
    const h1Count = await page.locator('h1').count();
    const h2Count = await page.locator('h2').count();
    const h3Count = await page.locator('h3').count();
    const imgCount = await page.locator('img').count();
    const percentCount = await page.locator('text=/%/').count();

    console.log('\n=== CONTAGEM DE ELEMENTOS ===');
    console.log(`H1: ${h1Count}`);
    console.log(`H2: ${h2Count}`);
    console.log(`H3: ${h3Count}`);
    console.log(`Imagens: ${imgCount}`);
    console.log(`Porcentagens (%): ${percentCount}`);

    // Captura todos os textos dos headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    console.log('\n=== TÍTULOS ENCONTRADOS ===');
    headings.forEach((heading, idx) => {
        console.log(`${idx + 1}. ${heading}`);
    });

    // Captura URLs das imagens
    const images = await page.locator('img').evaluateAll(imgs =>
        imgs.map(img => ({
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            class: img.getAttribute('class')
        }))
    );
    console.log('\n=== IMAGENS ENCONTRADAS ===');
    console.log(JSON.stringify(images, null, 2));

    // Procura por porcentagens
    const percentages = await page.locator('text=/%/').allTextContents();
    console.log('\n=== PORCENTAGENS ENCONTRADAS ===');
    console.log(percentages);

    // Screenshot para referência visual
    await page.screenshot({ path: 'debug-results-screenshot.png', fullPage: true });
    console.log('✓ Screenshot salvo em: debug-results-screenshot.png');
});
