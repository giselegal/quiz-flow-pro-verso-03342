import { test, expect } from '@playwright/test';

// Teste diagnóstico com logging extensivo
test.setTimeout(180_000);

test.describe('Editor modular - diagnóstico de travamento', () => {
  test('investigar travamento no toggle da biblioteca', async ({ page }) => {
    // Captura todos os logs do console
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });

    // Captura erros não tratados
    page.on('pageerror', error => {
      console.error('❌ Page Error:', error);
    });

    console.log('1️⃣ Navegando para o editor...');
    await page.goto('/editor?funnel=quiz21StepsComplete&template=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });

    console.log('2️⃣ Habilitando layout modular...');
    await page.evaluate(() => { 
      try { 
        localStorage.setItem('editor:phase2:modular', '1'); 
        console.log('✅ Flag modular ativada');
      } catch (e) {
        console.error('❌ Erro ao setar flag:', e);
      }
    });

    console.log('3️⃣ Recarregando página...');
    try {
      await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
    } catch {
      await page.goto('/editor?funnel=quiz21StepsComplete&template=quiz21StepsComplete', { 
        waitUntil: 'domcontentloaded',
        timeout: 60000 
      });
    }

    console.log('4️⃣ Aguardando layout modular...');
    await page.waitForSelector('[data-testid="modular-layout"]', { timeout: 90000 });
    await page.screenshot({ path: 'test-results/debug-01-layout-loaded.png', fullPage: true });

    console.log('5️⃣ Verificando presença das colunas...');
    const columns = {
      steps: await page.locator('[data-testid="column-steps"]').isVisible(),
      library: await page.locator('[data-testid="column-library"]').isVisible(),
      canvas: await page.locator('[data-testid="column-canvas"]').isVisible(),
      properties: await page.locator('[data-testid="column-properties"]').isVisible(),
    };
    console.log('Colunas visíveis:', columns);

    console.log('6️⃣ Procurando botão de toggle da biblioteca...');
    const libToggle = page.locator('button[title="Mostrar/ocultar biblioteca de componentes"]');
    const libToggleExists = await libToggle.count();
    console.log('Botões encontrados:', libToggleExists);

    if (libToggleExists > 0) {
      // Captura o estado do botão
      const buttonState = await libToggle.evaluate(el => ({
        disabled: (el as HTMLButtonElement).disabled,
        className: el.className,
        innerText: el.innerText,
        offsetWidth: el.offsetWidth,
        offsetHeight: el.offsetHeight,
      }));
      console.log('Estado do botão:', buttonState);

      await page.screenshot({ path: 'test-results/debug-02-before-click.png', fullPage: true });

      console.log('7️⃣ Tentando clicar no botão...');
      
      // Tenta primeiro com force (bypassa checks de actionability)
      try {
        await libToggle.click({ force: true, timeout: 10000 });
        console.log('✅ Click com force: sucesso');
      } catch (e) {
        console.error('❌ Click com force falhou:', e);
        
        // Tenta com JavaScript
        try {
          await libToggle.evaluate(el => (el as HTMLElement).click());
          console.log('✅ Click via JS: sucesso');
        } catch (e2) {
          console.error('❌ Click via JS falhou:', e2);
        }
      }

      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/debug-03-after-click.png', fullPage: true });

      console.log('8️⃣ Verificando estado da biblioteca após click...');
      const libVisibleAfter = await page.locator('[data-testid="column-library"]').isVisible();
      console.log('Biblioteca visível após click:', libVisibleAfter);
    }

    // Salva console logs
    console.log('\n📋 Console Logs (primeiros 50):');
    consoleLogs.slice(0, 50).forEach(log => console.log(log));

    // Captura estado final do DOM
    const finalState = await page.evaluate(() => {
      return {
        readyState: document.readyState,
        hasModularLayout: !!document.querySelector('[data-testid="modular-layout"]'),
        visibleColumns: {
          steps: !!document.querySelector('[data-testid="column-steps"]'),
          library: !!document.querySelector('[data-testid="column-library"]'),
          canvas: !!document.querySelector('[data-testid="column-canvas"]'),
          properties: !!document.querySelector('[data-testid="column-properties"]'),
        },
        libraryToggleButton: !!document.querySelector('button[title="Mostrar/ocultar biblioteca de componentes"]'),
      };
    });
    console.log('Estado final do DOM:', finalState);

    // Força sucesso para ver os logs
    expect(finalState.hasModularLayout).toBe(true);
  });
});
