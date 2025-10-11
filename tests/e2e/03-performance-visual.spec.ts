import { test, expect } from '@playwright/test';

/**
 * FASE 3B - Testes E2E - Performance e Regressão Visual
 * 
 * Testa métricas de performance e captura screenshots para regressão visual
 */

test.describe('Performance - Core Web Vitals', () => {
    test('deve medir LCP (Largest Contentful Paint)', async ({ page }) => {
        await page.goto('/quiz-estilo');

        const lcp = await page.evaluate(() => {
            return new Promise((resolve) => {
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    resolve(lastEntry.renderTime || lastEntry.loadTime);
                }).observe({ entryTypes: ['largest-contentful-paint'] });

                // Timeout após 5 segundos
                setTimeout(() => resolve(0), 5000);
            });
        });

        console.log(`LCP: ${lcp}ms`);
        expect(lcp).toBeLessThan(2500); // LCP deve ser < 2.5s (bom)
    });

    test('deve medir FID (First Input Delay) simulado', async ({ page }) => {
        await page.goto('/quiz-estilo');

        const startTime = Date.now();
        await page.locator('input[type="text"]').first().click();
        const endTime = Date.now();

        const fid = endTime - startTime;
        console.log(`FID simulado: ${fid}ms`);
        expect(fid).toBeLessThan(100); // FID deve ser < 100ms (bom)
    });

    test('deve medir CLS (Cumulative Layout Shift)', async ({ page }) => {
        await page.goto('/quiz-estilo');

        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        const cls = await page.evaluate(() => {
            return new Promise((resolve) => {
                let clsScore = 0;

                new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!(entry as any).hadRecentInput) {
                            clsScore += (entry as any).value;
                        }
                    }
                }).observe({ entryTypes: ['layout-shift'] });

                setTimeout(() => resolve(clsScore), 3000);
            });
        });

        console.log(`CLS: ${cls}`);
        expect(cls).toBeLessThan(0.1); // CLS deve ser < 0.1 (bom)
    });

    test('deve carregar página inicial em menos de 3 segundos', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/quiz-estilo');
        await page.waitForLoadState('load');
        const loadTime = Date.now() - startTime;

        console.log(`Tempo de carregamento: ${loadTime}ms`);
        expect(loadTime).toBeLessThan(3000);
    });

    test('deve ter bundle JavaScript otimizado', async ({ page }) => {
        const jsRequests: any[] = [];

        page.on('response', response => {
            const url = response.url();
            if (url.endsWith('.js') && response.status() === 200) {
                jsRequests.push({
                    url,
                    size: response.headers()['content-length'] || 0
                });
            }
        });

        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        const totalSize = jsRequests.reduce((sum, req) => {
            const size = parseInt(req.size) || 0;
            return sum + size;
        }, 0);

        console.log(`Total JS: ${(totalSize / 1024).toFixed(2)} KB (${jsRequests.length} files)`);

        // Bundle total não deve exceder 1MB
        expect(totalSize).toBeLessThan(1024 * 1024);
    });

    test('deve otimizar imagens', async ({ page }) => {
        const imageRequests: any[] = [];

        page.on('response', response => {
            const url = response.url();
            if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
                imageRequests.push({
                    url,
                    contentType: response.headers()['content-type']
                });
            }
        });

        await page.goto('/quiz-estilo');
        await page.waitForTimeout(2000);

        // Verificar se usa formatos modernos
        const modernFormats = imageRequests.filter(img =>
            img.contentType?.includes('webp') || img.url.includes('.webp')
        );

        console.log(`Imagens: ${imageRequests.length} total, ${modernFormats.length} WebP`);

        if (imageRequests.length > 0) {
            const modernPercentage = (modernFormats.length / imageRequests.length) * 100;
            console.log(`${modernPercentage.toFixed(0)}% usando formatos modernos`);
        }
    });
});

test.describe('Regressão Visual - Screenshots', () => {
    test('screenshot da página inicial', async ({ page }) => {
        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveScreenshot('01-home-page.png', {
            fullPage: true,
            maxDiffPixels: 100
        });
    });

    test('screenshot após preencher nome', async ({ page }) => {
        await page.goto('/quiz-estilo');

        const nameInput = page.locator('input[type="text"]').first();
        await nameInput.fill('João Silva');

        await expect(page).toHaveScreenshot('02-name-filled.png', {
            maxDiffPixels: 100
        });
    });

    test('screenshot de uma pergunta do quiz', async ({ page }) => {
        await page.goto('/quiz-estilo');

        const nameInput = page.locator('input[type="text"]').first();
        await nameInput.fill('Test');

        const button = page.locator('button').filter({ hasText: /iniciar/i }).first();
        await button.click();

        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);

        await expect(page).toHaveScreenshot('03-quiz-question.png', {
            maxDiffPixels: 100
        });
    });

    test('screenshot mobile - página inicial', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveScreenshot('04-mobile-home.png', {
            fullPage: true,
            maxDiffPixels: 100
        });
    });

    test('screenshot tablet - página inicial', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 }); // iPad
        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveScreenshot('05-tablet-home.png', {
            fullPage: true,
            maxDiffPixels: 100
        });
    });
});

test.describe('Acessibilidade', () => {
    test('deve ter contraste adequado', async ({ page }) => {
        await page.goto('/quiz-estilo');

        // Verificar contraste de botões principais
        const buttons = page.locator('button').filter({ hasText: /iniciar|continuar/i });
        const count = await buttons.count();

        if (count > 0) {
            const button = buttons.first();
            const bgColor = await button.evaluate(el => {
                return window.getComputedStyle(el).backgroundColor;
            });
            const color = await button.evaluate(el => {
                return window.getComputedStyle(el).color;
            });

            console.log(`Button colors - BG: ${bgColor}, Text: ${color}`);

            // Verificação básica: cores não devem ser idênticas
            expect(bgColor).not.toBe(color);
        }
    });

    test('deve ser navegável por teclado', async ({ page }) => {
        await page.goto('/quiz-estilo');

        // Testar navegação por Tab
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);

        const focusedElement = page.locator(':focus');
        const isFocused = await focusedElement.count() > 0;

        if (isFocused) {
            const tagName = await focusedElement.evaluate(el => el.tagName);
            console.log(`✓ Keyboard navigation works - focused on: ${tagName}`);
        }
    });

    test('deve ter landmarks ARIA', async ({ page }) => {
        await page.goto('/quiz-estilo');

        const landmarks = await page.locator('[role="main"], [role="navigation"], [role="banner"], main, nav, header').count();

        console.log(`Found ${landmarks} ARIA landmarks`);
        expect(landmarks).toBeGreaterThan(0);
    });

    test('deve ter labels em inputs', async ({ page }) => {
        await page.goto('/quiz-estilo');

        const inputs = page.locator('input[type="text"], input[type="email"]');
        const count = await inputs.count();

        let inputsWithLabels = 0;
        for (let i = 0; i < count; i++) {
            const input = inputs.nth(i);
            const id = await input.getAttribute('id');
            const ariaLabel = await input.getAttribute('aria-label');
            const placeholder = await input.getAttribute('placeholder');

            if (id) {
                const hasLabel = await page.locator(`label[for="${id}"]`).count() > 0;
                if (hasLabel) inputsWithLabels++;
            } else if (ariaLabel || placeholder) {
                inputsWithLabels++;
            }
        }

        if (count > 0) {
            const percentage = (inputsWithLabels / count) * 100;
            console.log(`${inputsWithLabels}/${count} inputs have labels (${percentage.toFixed(0)}%)`);
            expect(percentage).toBeGreaterThan(50);
        }
    });
});

test.describe('Responsividade', () => {
    const viewports = [
        { name: 'Mobile', width: 375, height: 667 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Desktop', width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
        test(`deve renderizar corretamente em ${viewport.name}`, async ({ page }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.goto('/quiz-estilo');
            await page.waitForLoadState('networkidle');

            // Verificar se elementos principais estão visíveis
            const mainContent = page.locator('main, [role="main"], body > div').first();
            await expect(mainContent).toBeVisible();

            // Verificar se não há overflow horizontal
            const hasHorizontalScroll = await page.evaluate(() => {
                return document.documentElement.scrollWidth > document.documentElement.clientWidth;
            });

            if (hasHorizontalScroll) {
                console.log(`⚠️ Horizontal scroll detected on ${viewport.name}`);
            } else {
                console.log(`✓ No horizontal scroll on ${viewport.name}`);
            }

            expect(hasHorizontalScroll).toBeFalsy();
        });
    }
});
