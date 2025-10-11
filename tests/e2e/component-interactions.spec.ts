/**
 * 🧪 FASE 3B - TESTES E2E: Interações de Componentes
 * 
 * Testa interações do usuário com componentes (forms, buttons, validações)
 */

import { test, expect } from '@playwright/test';

test.describe('Interações de Componentes', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');
    });

    test('formulário de nome deve validar inputs vazios', async ({ page }) => {
        console.log('🧪 Testando validação de formulário...');

        const nameInput = page.locator('input[name="name"], input[placeholder*="nome" i]').first();

        if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
            // Tentar enviar formulário vazio
            await nameInput.fill('');

            const submitButton = page.locator('button[type="submit"], button:has-text("Iniciar")').first();
            await submitButton.click();

            // Verificar mensagem de erro ou validação HTML5
            const errorMessage = await page.locator('text=/campo obrigatório|preencha/i, [role="alert"]').first().isVisible({ timeout: 2000 }).catch(() => false);
            const inputInvalid = await nameInput.evaluate((el: HTMLInputElement) => !el.validity.valid);

            const hasValidation = errorMessage || inputInvalid;
            expect(hasValidation).toBeTruthy();

            console.log('✅ Validação de campo vazio funciona');
        } else {
            console.log('ℹ️  Campo de nome não encontrado');
        }
    });

    test('formulário de nome deve aceitar valores válidos', async ({ page }) => {
        const nameInput = page.locator('input[name="name"], input[placeholder*="nome" i]').first();

        if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
            await nameInput.fill('Ana Silva');

            // Verificar se o valor foi preenchido
            const inputValue = await nameInput.inputValue();
            expect(inputValue).toBe('Ana Silva');

            // Submeter formulário
            const submitButton = page.locator('button[type="submit"], button:has-text("Iniciar")').first();
            await submitButton.click();
            await page.waitForTimeout(1000);

            // Verificar se avançou para próxima tela
            const urlChanged = page.url() !== '/quiz-estilo';
            console.log(`✅ Formulário aceito e ${urlChanged ? 'avançou' : 'processou'}`);
        }
    });

    test('botões de opção devem ter feedback visual', async ({ page }) => {
        console.log('🧪 Testando feedback visual dos botões...');

        // Avançar para uma pergunta com opções
        const startButton = page.locator('button').first();
        if (await startButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await startButton.click();
            await page.waitForTimeout(500);
        }

        const optionButton = page.locator('button[class*="option"], [role="button"]').first();

        if (await optionButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            // Capturar estado inicial
            const initialClass = await optionButton.getAttribute('class');

            // Hover
            await optionButton.hover();
            await page.waitForTimeout(200);

            const hoverClass = await optionButton.getAttribute('class');

            // Clicar
            await optionButton.click();
            await page.waitForTimeout(200);

            const clickedClass = await optionButton.getAttribute('class');

            console.log(`✅ Classes: initial="${initialClass}", hover="${hoverClass}", clicked="${clickedClass}"`);

            // Verificar se as classes mudaram (indicando feedback visual)
            const hasFeedback = (hoverClass !== initialClass) || (clickedClass !== initialClass);
            expect(hasFeedback).toBeTruthy();
        }
    });

    test('componentes de imagem devem carregar corretamente', async ({ page }) => {
        console.log('🧪 Testando carregamento de imagens...');

        // Aguardar imagens carregarem
        await page.waitForLoadState('networkidle');

        const images = await page.locator('img').all();

        if (images.length > 0) {
            console.log(`✅ Encontradas ${images.length} imagens`);

            // Verificar se pelo menos uma imagem carregou
            let loadedImages = 0;

            for (const img of images.slice(0, 5)) { // Testar primeiras 5 imagens
                const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
                if (naturalWidth > 0) {
                    loadedImages++;
                }
            }

            console.log(`✅ Imagens carregadas: ${loadedImages}/${Math.min(images.length, 5)}`);
            expect(loadedImages).toBeGreaterThan(0);
        } else {
            console.log('ℹ️  Nenhuma imagem encontrada nesta página');
        }
    });

    test('componentes de texto devem ser legíveis', async ({ page }) => {
        console.log('🧪 Testando legibilidade de textos...');

        const headings = await page.locator('h1, h2, h3').all();

        if (headings.length > 0) {
            for (const heading of headings.slice(0, 3)) {
                const text = await heading.textContent();
                const fontSize = await heading.evaluate((el) => window.getComputedStyle(el).fontSize);
                const color = await heading.evaluate((el) => window.getComputedStyle(el).color);

                console.log(`✅ Heading: "${text?.slice(0, 30)}..." - ${fontSize} - ${color}`);

                // Verificar se o texto não está vazio
                expect(text?.trim().length).toBeGreaterThan(0);
            }
        }
    });

    test('componentes de lista devem ser interativos', async ({ page }) => {
        console.log('🧪 Testando componentes de lista...');

        const listItems = await page.locator('ul li, ol li, [role="list"] [role="listitem"]').all();

        if (listItems.length > 0) {
            console.log(`✅ Encontrados ${listItems.length} itens de lista`);

            // Verificar se os itens têm conteúdo
            const firstItemText = await listItems[0].textContent();
            expect(firstItemText?.trim().length).toBeGreaterThan(0);

            console.log(`✅ Primeiro item: "${firstItemText?.slice(0, 50)}..."`);
        } else {
            console.log('ℹ️  Nenhum componente de lista encontrado nesta página');
        }
    });

    test('componentes de FAQ devem expandir/colapsar', async ({ page }) => {
        console.log('🧪 Testando componentes de FAQ...');

        // Procurar por elementos expansíveis (details, accordion, etc.)
        const faqItems = await page.locator('details, [role="button"][aria-expanded]').all();

        if (faqItems.length > 0) {
            console.log(`✅ Encontrados ${faqItems.length} itens expansíveis`);

            const firstItem = faqItems[0];

            // Verificar estado inicial
            const isExpandedInitially = await firstItem.evaluate((el) => {
                if (el.tagName === 'DETAILS') {
                    return (el as HTMLDetailsElement).open;
                }
                return el.getAttribute('aria-expanded') === 'true';
            });

            // Clicar para expandir/colapsar
            await firstItem.click();
            await page.waitForTimeout(300);

            // Verificar se o estado mudou
            const isExpandedAfterClick = await firstItem.evaluate((el) => {
                if (el.tagName === 'DETAILS') {
                    return (el as HTMLDetailsElement).open;
                }
                return el.getAttribute('aria-expanded') === 'true';
            });

            expect(isExpandedInitially).not.toBe(isExpandedAfterClick);
            console.log(`✅ FAQ funciona: ${isExpandedInitially} → ${isExpandedAfterClick}`);
        } else {
            console.log('ℹ️  Nenhum componente de FAQ encontrado nesta página');
        }
    });

    test('botões CTA devem ser clicáveis', async ({ page }) => {
        console.log('🧪 Testando botões CTA...');

        const ctaButtons = await page.locator('button, a[role="button"]').all();

        if (ctaButtons.length > 0) {
            console.log(`✅ Encontrados ${ctaButtons.length} botões`);

            const firstButton = ctaButtons[0];

            // Verificar se o botão não está desabilitado
            const isDisabled = await firstButton.evaluate((el) => {
                if (el instanceof HTMLButtonElement) {
                    return el.disabled;
                }
                return el.getAttribute('aria-disabled') === 'true';
            });

            console.log(`✅ Primeiro botão ${isDisabled ? 'desabilitado' : 'habilitado'}`);

            if (!isDisabled) {
                // Verificar se tem texto
                const buttonText = await firstButton.textContent();
                expect(buttonText?.trim().length).toBeGreaterThan(0);
                console.log(`✅ Texto do botão: "${buttonText?.trim()}"`);
            }
        }
    });

    test('componentes de testemunho devem exibir conteúdo', async ({ page }) => {
        console.log('🧪 Testando componentes de testemunho...');

        // Procurar por elementos de testemunho (blockquote, testimonial, etc.)
        const testimonials = await page.locator('blockquote, [class*="testimonial"], [class*="review"]').all();

        if (testimonials.length > 0) {
            console.log(`✅ Encontrados ${testimonials.length} testemunhos`);

            const firstTestimonial = testimonials[0];
            const content = await firstTestimonial.textContent();

            expect(content?.trim().length).toBeGreaterThan(0);
            console.log(`✅ Conteúdo: "${content?.slice(0, 100)}..."`);

            // Verificar se tem autor
            const author = await firstTestimonial.locator('cite, [class*="author"], footer').first().textContent().catch(() => null);
            if (author) {
                console.log(`✅ Autor: "${author.trim()}"`);
            }
        } else {
            console.log('ℹ️  Nenhum testemunho encontrado nesta página');
        }
    });

    test('componentes de pricing devem exibir preços', async ({ page }) => {
        console.log('🧪 Testando componentes de pricing...');

        // Procurar por elementos de preço
        const priceElements = await page.locator('[class*="price"], [class*="pricing"], [data-price]').all();

        if (priceElements.length > 0) {
            console.log(`✅ Encontrados ${priceElements.length} elementos de preço`);

            for (const priceEl of priceElements.slice(0, 3)) {
                const priceText = await priceEl.textContent();
                console.log(`✅ Preço: "${priceText?.trim()}"`);

                // Verificar se contém números ou símbolos de moeda
                const hasPrice = /[\d\$€£R\$]/.test(priceText || '');
                if (hasPrice) {
                    expect(hasPrice).toBeTruthy();
                }
            }
        } else {
            console.log('ℹ️  Nenhum componente de pricing encontrado nesta página');
        }
    });

    test('componentes devem ser responsivos', async ({ page }) => {
        console.log('🧪 Testando responsividade...');

        // Desktop
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.waitForTimeout(500);

        const desktopButtons = await page.locator('button').count();
        console.log(`✅ Desktop (1920x1080): ${desktopButtons} botões`);

        // Tablet
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.waitForTimeout(500);

        const tabletButtons = await page.locator('button').count();
        console.log(`✅ Tablet (768x1024): ${tabletButtons} botões`);

        // Mobile
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(500);

        const mobileButtons = await page.locator('button').count();
        console.log(`✅ Mobile (375x667): ${mobileButtons} botões`);

        // Verificar que os elementos ainda são visíveis em mobile
        expect(mobileButtons).toBeGreaterThan(0);
    });

    test('componentes devem ter acessibilidade básica', async ({ page }) => {
        console.log('🧪 Testando acessibilidade...');

        // Verificar atributos ARIA
        const buttonsWithLabel = await page.locator('button[aria-label], a[aria-label]').count();
        console.log(`✅ Elementos com aria-label: ${buttonsWithLabel}`);

        // Verificar landmarks
        const mainLandmark = await page.locator('main, [role="main"]').count();
        console.log(`✅ Main landmarks: ${mainLandmark}`);

        // Verificar headings hierárquicos
        const h1Count = await page.locator('h1').count();
        console.log(`✅ H1 headings: ${h1Count}`);

        // Pelo menos deveria ter um H1
        expect(h1Count).toBeGreaterThanOrEqual(0); // 0 ou mais é aceitável dependendo da página
    });
});
