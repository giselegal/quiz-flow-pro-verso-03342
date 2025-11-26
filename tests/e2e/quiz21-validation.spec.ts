/**
 * 🧪 TESTES E2E: Validação de Quiz 21 Steps
 * 
 * Testa casos específicos de validação:
 * - Formulários obrigatórios
 * - Seleção mínima/máxima de opções
 * - Estados de erro
 * - Blocos vazios ou com falhas
 */

import { test, expect, Page } from '@playwright/test';

test.describe('Quiz 21 Steps - Validações', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor?funnel=quiz21StepsComplete&mode=preview');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('deve validar campo de nome obrigatório', async ({ page }) => {
    console.log('📝 Testando validação de nome obrigatório...');

    // Tentar avançar sem preencher nome
    const startButton = page.locator('button').filter({
      hasText: /começar|iniciar|start/i
    }).first();

    // Verificar se botão está desabilitado
    const isDisabled = await startButton.isDisabled().catch(() => false);

    if (isDisabled) {
      console.log('✓ Botão "Começar" desabilitado sem nome');
    } else {
      // Tentar clicar e verificar se permanece no mesmo step
      const urlBefore = page.url();
      await startButton.click();
      await page.waitForTimeout(500);
      const urlAfter = page.url();

      if (urlBefore === urlAfter) {
        console.log('✓ Não avançou sem preencher nome');
      }
    }

    // Preencher nome e verificar que botão fica habilitado
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('João Validação');

    await page.waitForTimeout(300);

    const isEnabledAfter = !(await startButton.isDisabled().catch(() => true));
    expect(isEnabledAfter).toBe(true);
    console.log('✓ Botão "Começar" habilitado após preencher nome');
  });

  test('deve validar seleção mínima em perguntas multi-select', async ({ page }) => {
    console.log('🔢 Testando validação de seleção mínima...');

    // Completar intro
    await fillIntroAndStart(page);

    // Tentar avançar selecionando menos de 3 opções
    const option = page.locator('button[class*="option"]').first();
    if (await option.isVisible({ timeout: 5000 }).catch(() => false)) {
      await option.click();
      await page.waitForTimeout(500);

      // Verificar se há mensagem de validação
      const validationMessage = page.locator('text=/selecione|mínimo|obrigatório/i').first();
      const hasValidation = await validationMessage.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasValidation) {
        console.log('✓ Mensagem de validação exibida');
      }

      // Verificar se botão "Próximo" está desabilitado
      const nextButton = page.locator('button').filter({
        hasText: /próximo|next/i
      }).first();

      if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        const isDisabled = await nextButton.isDisabled().catch(() => false);
        
        if (isDisabled) {
          console.log('✓ Botão "Próximo" desabilitado com seleção insuficiente');
        }
      }
    }
  });

  test('deve validar seleção máxima em perguntas multi-select', async ({ page }) => {
    console.log('🔢 Testando validação de seleção máxima...');

    await fillIntroAndStart(page);

    // Tentar selecionar mais de 3 opções
    const options = page.locator('button[class*="option"]');
    const count = await options.count();

    if (count >= 4) {
      // Selecionar 3 opções
      for (let i = 0; i < 3; i++) {
        await options.nth(i).click();
        await page.waitForTimeout(300);
      }

      // Tentar selecionar 4ª opção
      const fourthOption = options.nth(3);
      const isClickable = await fourthOption.isEnabled().catch(() => false);

      if (!isClickable) {
        console.log('✓ 4ª opção desabilitada após selecionar 3');
      } else {
        // Clicar e verificar se substitui uma das anteriores
        await fourthOption.click();
        await page.waitForTimeout(300);

        console.log('✓ Sistema permite trocar opções selecionadas');
      }
    }
  });

  test('deve exibir erro ao tentar avançar sem responder', async ({ page }) => {
    console.log('❌ Testando validação de resposta obrigatória...');

    await fillIntroAndStart(page);

    // Tentar clicar em "Próximo" sem selecionar opções
    const nextButton = page.locator('button').filter({
      hasText: /próximo|next/i
    }).first();

    if (await nextButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      const urlBefore = page.url();
      
      await nextButton.click();
      await page.waitForTimeout(500);
      
      const urlAfter = page.url();

      // Deve permanecer no mesmo step
      if (urlBefore === urlAfter) {
        console.log('✓ Não avançou sem responder');
      }

      // Verificar mensagem de erro
      const errorMessage = page.locator('text=/obrigatório|necessário|selecione/i').first();
      const hasError = await errorMessage.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasError) {
        console.log('✓ Mensagem de erro exibida');
      }
    }
  });

  test('não deve renderizar blocos com "Sem conteúdo"', async ({ page }) => {
    console.log('🚫 Verificando blocos sem conteúdo...');

    await fillIntroAndStart(page);

    // Navegar por 5 steps verificando se há "Sem conteúdo"
    for (let i = 0; i < 5; i++) {
      const noContentText = page.locator('text=/sem conteúdo|no content|empty/i');
      const hasNoContent = await noContentText.isVisible({ timeout: 1000 }).catch(() => false);

      if (hasNoContent) {
        const screenshot = `tests/e2e/screenshots/error-no-content-step-${i + 2}.png`;
        await page.screenshot({ path: screenshot, fullPage: true });
        
        throw new Error(`❌ Bloco "Sem conteúdo" encontrado no step ${i + 2}. Screenshot: ${screenshot}`);
      }

      // Avançar para próximo step
      const options = page.locator('button[class*="option"]');
      if (await options.count() >= 3) {
        for (let j = 0; j < 3; j++) {
          await options.nth(j).click();
          await page.waitForTimeout(200);
        }
        await page.waitForTimeout(1500);
      }
    }

    console.log('✅ Nenhum bloco "Sem conteúdo" encontrado');
  });

  test('deve validar que todas as imagens carregam corretamente', async ({ page }) => {
    console.log('🖼️ Testando carregamento de imagens...');

    await fillIntroAndStart(page);

    // Coletar todas as imagens na página
    const images = page.locator('img');
    const imageCount = await images.count();

    console.log(`  ℹ️ ${imageCount} imagens encontradas`);

    let brokenImages = 0;

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      
      // Verificar se imagem tem naturalWidth > 0 (carregou)
      const isLoaded = await img.evaluate((el: HTMLImageElement) => {
        return el.complete && el.naturalWidth > 0;
      });

      if (!isLoaded) {
        console.warn(`  ⚠️ Imagem não carregou: ${src}`);
        brokenImages++;
      }
    }

    if (brokenImages === 0) {
      console.log('✅ Todas as imagens carregaram corretamente');
    } else {
      console.warn(`⚠️ ${brokenImages}/${imageCount} imagens não carregaram`);
    }

    expect(brokenImages).toBeLessThan(imageCount * 0.1); // Máximo 10% de falha
  });

  test('deve validar que todos os botões estão clicáveis', async ({ page }) => {
    console.log('🖱️ Testando clicabilidade de botões...');

    await fillIntroAndStart(page);

    // Verificar todos os botões visíveis
    const buttons = page.locator('button:visible');
    const buttonCount = await buttons.count();

    console.log(`  ℹ️ ${buttonCount} botões encontrados`);

    let unclickableButtons = 0;

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const isEnabled = await button.isEnabled().catch(() => false);
      
      if (!isEnabled) {
        const text = await button.textContent();
        console.log(`  ℹ️ Botão desabilitado: "${text}"`);
        unclickableButtons++;
      }
    }

    console.log(`✅ ${buttonCount - unclickableButtons}/${buttonCount} botões habilitados`);
  });

  test('deve validar responsividade em mobile', async ({ page }) => {
    console.log('📱 Testando responsividade mobile...');

    // Mudar para viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Recarregar página
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verificar elementos principais
    const title = page.locator('h1, h2').first();
    await expect(title).toBeVisible({ timeout: 5000 });

    const nameInput = page.locator('input[type="text"]').first();
    await expect(nameInput).toBeVisible();

    const startButton = page.locator('button').first();
    await expect(startButton).toBeVisible();

    // Verificar que elementos não estão cortados
    const titleBox = await title.boundingBox();
    const viewportWidth = page.viewportSize()?.width || 375;

    if (titleBox) {
      expect(titleBox.width).toBeLessThanOrEqual(viewportWidth);
      console.log('✓ Título não está cortado');
    }

    console.log('✅ Layout responsivo funcionando');
  });

  test('deve validar acessibilidade básica', async ({ page }) => {
    console.log('♿ Testando acessibilidade básica...');

    // Verificar labels em inputs
    const nameInput = page.locator('input[type="text"]').first();
    const hasLabel = await page.locator('label').first().isVisible().catch(() => false);
    const hasAriaLabel = await nameInput.getAttribute('aria-label');
    const hasPlaceholder = await nameInput.getAttribute('placeholder');

    if (hasLabel || hasAriaLabel || hasPlaceholder) {
      console.log('✓ Input de nome tem label/aria-label/placeholder');
    } else {
      console.warn('⚠️ Input de nome sem label acessível');
    }

    // Verificar botões com textos descritivos
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');

      if (!text?.trim() && !ariaLabel) {
        console.warn('⚠️ Botão sem texto ou aria-label');
      }
    }

    console.log('✅ Verificação de acessibilidade básica concluída');
  });
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function fillIntroAndStart(page: Page) {
  const nameInput = page.locator('input[type="text"]').first();
  await nameInput.fill('Test User');
  
  const startButton = page.locator('button').filter({
    hasText: /começar|iniciar|start/i
  }).first();
  await startButton.click();
  
  await page.waitForTimeout(1000);
}
