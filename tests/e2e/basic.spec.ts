/**
 * 🧪 TESTE BÁSICO INDEPENDENTE
 * 
 * Teste que não depende do servidor local
 */

import { test, expect } from '@playwright/test';

test.describe('Funcionalidade Básica do Playwright', () => {
    test('Playwright está funcionando', async ({ page }) => {
        // Testar uma página pública conhecida
        await page.goto('https://example.com');

        // Verificar se carregou corretamente
        await expect(page).toHaveTitle(/Example/i);

        // Verificar se há conteúdo básico
        const content = await page.textContent('body');
        expect(content).toContain('Example Domain');

        console.log('✅ Playwright está funcionando corretamente!');
    });

    test('Browser está respondendo', async ({ page }) => {
        // Testar JavaScript básico
        const userAgent = await page.evaluate(() => navigator.userAgent);
        expect(userAgent).toContain('Chrome'); // Ajustado para aceitar qualquer Chrome

        // Testar manipulação DOM básica
        await page.setContent(`
      <div id="test">Teste E2E</div>
      <button onclick="document.getElementById('test').innerText = 'Clicado!'">Clique</button>
    `);

        await page.click('button');
        const text = await page.textContent('#test');
        expect(text).toBe('Clicado!');

        console.log('✅ Browser está respondendo corretamente!');
    });
});