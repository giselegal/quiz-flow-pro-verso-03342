import { test, expect } from '@playwright/test';

/**
 * E2E: Edição no /editor com JSONs v3 (modo JSON-only)
 * - Força flags via localStorage para garantir fonte TEMPLATE_DEFAULT (JSON)
 * - Desativa Supabase e overrides
 * - Valida carregamento de step-01 vindo do v3 e edição refletida no canvas
 */

test.describe('Editor (JSON v3) - edição básica', () => {
  test('carrega step-01 do JSON v3 e edita propriedade de texto', async ({ page }) => {
    // 1) Abrir editor com template indicado
    await page.goto('/editor?template=quiz21StepsComplete', { waitUntil: 'domcontentloaded' });

    // 2) Setar flags para garantir JSON-only e ambiente offline
    await page.evaluate(() => {
      try {
        localStorage.setItem('VITE_TEMPLATE_JSON_ONLY', 'true');
        localStorage.setItem('VITE_DISABLE_SUPABASE', 'true');
        localStorage.setItem('VITE_DISABLE_TEMPLATE_OVERRIDES', 'true');
        localStorage.setItem('VITE_ENABLE_INDEXEDDB_CACHE', 'true');
        // Alguns ambientes usam esta legacy flag
        localStorage.setItem('supabase:disableNetwork', 'true');
        // Garante layout modular (se houver gate)
        localStorage.setItem('editor:phase2:modular', '1');
      } catch {}
    });

    // 3) Recarregar para aplicar flags
    try {
      await page.reload({ waitUntil: 'domcontentloaded' });
    } catch {
      await page.goto('/editor?template=quiz21StepsComplete', { waitUntil: 'domcontentloaded' });
    }

    // 4) Esperar conteúdo conhecido do step-01 v3
    // Conteúdo vindo de public/templates/step-01-v3.json (intro-title / intro-description)
    const possibleIntroText = /Chega|Bem-vindo|Estilo Predominante/i;
    await expect(page.locator('text=/Etapa 1|Navegação|Biblioteca|Propriedades/i')).toBeVisible({ timeout: 60000 });

    // Tentar esperar pelo conteúdo renderizado do step-01
    await expect(page.locator('text=/Chega|Bem-vindo|estilo predominante/i')).toBeVisible({ timeout: 60000 });

    // 5) Selecionar primeiro bloco clicável do canvas
    // Heurística: clicar no primeiro bloco renderizado 
    const canvasBlocks = page.locator('[data-testid="canvas-block"], li:has([data-testid])');
    const hasAny = await canvasBlocks.first().isVisible().catch(() => false);
    if (!hasAny) {
      // Plano B: clicar em algum container do Canvas para forçar seleção e abrir propriedades
      await page.locator('text=Carregando etapa').waitFor({ state: 'detached', timeout: 30000 }).catch(() => {});
    }

    // Se houver blocos, clicar no primeiro
    if (hasAny) {
      await canvasBlocks.first().click({ timeout: 5000 });
    }

    // 6) Encontrar um campo de texto nas propriedades e editar
    // Seleciona qualquer [data-field-key="text"], [data-field-key="title"] ou [data-field-key="subtitle"]
    const candidateFields = [
      '[data-field-key="text"] input, [data-field-key="text"] textarea',
      '[data-field-key="title"] input, [data-field-key="title"] textarea',
      '[data-field-key="subtitle"] input, [data-field-key="subtitle"] textarea',
      '[data-field-key="titleHtml"] textarea',
      '[data-field-key="description"] textarea'
    ];

    let edited = false;
    const newValue = `Texto E2E ${Date.now()}`;
    for (const sel of candidateFields) {
      const input = page.locator(sel).first();
      if (await input.isVisible().catch(() => false)) {
        await input.fill('');
        await input.type(newValue);
        // Validar que canvas reflete texto
        await expect(page.locator(`text=${newValue}`)).toBeVisible({ timeout: 8000 });
        edited = true;
        break;
      }
    }

    expect(edited).toBeTruthy();

    // 7) Validar métrica de fonte TEMPLATE_DEFAULT (JSON) para o step-01
    const metricsOk = await page.evaluate(() => {
      const arr = (window as any).__TEMPLATE_SOURCE_METRICS as Array<{ stepId: string; source: string }>|undefined;
      if (!arr || !Array.isArray(arr)) return false;
      // Procurar step-01 carregado do TEMPLATE_DEFAULT
      return arr.some(x => /step-0?1/i.test(x.stepId) && x.source === 'TEMPLATE_DEFAULT');
    });
    expect(metricsOk).toBeTruthy();
  });
});
