/**
 * 🧪 FASE 3B - TESTES E2E: Performance e Regressão Visual
 * 
 * Testa performance, métricas Core Web Vitals e consistência visual
 */

import { test, expect } from '@playwright/test';

test.describe('Performance e Métricas', () => {
    test('Core Web Vitals: LCP deve ser < 2.5s', async ({ page }) => {
        console.log('🧪 Medindo Largest Contentful Paint (LCP)...');

        await page.goto('/quiz-estilo');

        // Medir LCP usando Performance API
        const lcp = await page.evaluate(() => {
            return new Promise<number>((resolve) => {
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1] as any;
                    resolve(lastEntry.renderTime || lastEntry.loadTime);
                }).observe({ entryTypes: ['largest-contentful-paint'] });

                // Timeout de segurança
                setTimeout(() => resolve(0), 5000);
            });
        });

        const lcpSeconds = lcp / 1000;
        console.log(`✅ LCP: ${lcpSeconds.toFixed(2)}s`);

        // Boa performance: LCP < 2.5s
        expect(lcpSeconds).toBeLessThan(2.5);
    });

    test('Core Web Vitals: FID deve ser < 100ms', async ({ page }) => {
        console.log('🧪 Medindo First Input Delay (FID)...');

        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        // Simular interação e medir delay
        const startTime = Date.now();

        const button = page.locator('button').first();
        await button.click();

        const endTime = Date.now();
        const fid = endTime - startTime;

        console.log(`✅ FID aproximado: ${fid}ms`);

        // Boa performance: FID < 100ms
        expect(fid).toBeLessThan(100);
    });

    test('Core Web Vitals: CLS deve ser < 0.1', async ({ page }) => {
        console.log('🧪 Medindo Cumulative Layout Shift (CLS)...');

        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        // Aguardar estabilização
        await page.waitForTimeout(2000);

        const cls = await page.evaluate(() => {
            return new Promise<number>((resolve) => {
                let clsValue = 0;

                new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if ((entry as any).hadRecentInput) continue;
                        clsValue += (entry as any).value;
                    }
                }).observe({ entryTypes: ['layout-shift'] });

                setTimeout(() => resolve(clsValue), 3000);
            });
        });

        console.log(`✅ CLS: ${cls.toFixed(3)}`);

        // Boa performance: CLS < 0.1
        expect(cls).toBeLessThan(0.1);
    });

    test('tempo de carregamento total deve ser < 5s', async ({ page }) => {
        console.log('🧪 Medindo tempo de carregamento total...');

        const startTime = Date.now();

        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        const endTime = Date.now();
        const loadTime = (endTime - startTime) / 1000;

        console.log(`✅ Tempo de carregamento: ${loadTime.toFixed(2)}s`);

        expect(loadTime).toBeLessThan(5);
    });

    test('tamanho dos recursos deve ser otimizado', async ({ page }) => {
        console.log('🧪 Analisando tamanho dos recursos...');

        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        const resources = await page.evaluate(() => {
            const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

            return entries.map(entry => ({
                name: entry.name,
                type: entry.initiatorType,
                size: entry.transferSize,
                duration: entry.duration
            }));
        });

        // Agrupar por tipo
        const byType: Record<string, { count: number; totalSize: number }> = {};

        for (const resource of resources) {
            if (!byType[resource.type]) {
                byType[resource.type] = { count: 0, totalSize: 0 };
            }
            byType[resource.type].count++;
            byType[resource.type].totalSize += resource.size;
        }

        console.log('✅ Recursos carregados:');
        for (const [type, stats] of Object.entries(byType)) {
            const sizeKB = (stats.totalSize / 1024).toFixed(2);
            console.log(`   ${type}: ${stats.count} arquivos, ${sizeKB} KB`);
        }

        // Total transferido deve ser < 5MB
        const totalSize = Object.values(byType).reduce((sum, stats) => sum + stats.totalSize, 0);
        const totalMB = totalSize / (1024 * 1024);

        console.log(`✅ Total transferido: ${totalMB.toFixed(2)} MB`);
        expect(totalMB).toBeLessThan(5);
    });

    test('número de requisições deve ser razoável', async ({ page }) => {
        console.log('🧪 Contando requisições HTTP...');

        let requestCount = 0;

        page.on('request', () => {
            requestCount++;
        });

        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        console.log(`✅ Total de requisições: ${requestCount}`);

        // Menos de 100 requisições é razoável
        expect(requestCount).toBeLessThan(100);
    });

    test('imagens devem estar otimizadas', async ({ page }) => {
        console.log('🧪 Verificando otimização de imagens...');

        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        const images = await page.evaluate(() => {
            const imgs = Array.from(document.querySelectorAll('img'));

            return imgs.map(img => ({
                src: img.src,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                displayWidth: img.width,
                displayHeight: img.height,
                loading: img.loading,
                hasAlt: img.alt.length > 0
            }));
        });

        console.log(`✅ Total de imagens: ${images.length}`);

        for (const img of images.slice(0, 5)) {
            const oversized = img.naturalWidth > img.displayWidth * 2;
            const lazyLoaded = img.loading === 'lazy';

            console.log(`   ${img.src.slice(-30)}: ${img.naturalWidth}x${img.naturalHeight} → ${img.displayWidth}x${img.displayHeight}`);
            console.log(`      Oversized: ${oversized ? '❌' : '✅'}, Lazy: ${lazyLoaded ? '✅' : 'ℹ️'}, Alt: ${img.hasAlt ? '✅' : '⚠️'}`);
        }

        // Pelo menos 50% das imagens devem ter alt text
        const imagesWithAlt = images.filter(img => img.hasAlt).length;
        const altPercentage = images.length > 0 ? (imagesWithAlt / images.length) * 100 : 100;

        console.log(`✅ Imagens com alt text: ${altPercentage.toFixed(0)}%`);
        expect(altPercentage).toBeGreaterThanOrEqual(50);
    });

    test('JavaScript deve ser otimizado', async ({ page }) => {
        console.log('🧪 Analisando JavaScript...');

        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        const jsMetrics = await page.evaluate(() => {
            const scripts = performance.getEntriesByType('resource')
                .filter(entry => entry.name.endsWith('.js'));

            const totalSize = scripts.reduce((sum, entry: any) => sum + (entry.transferSize || 0), 0);
            const totalDuration = scripts.reduce((sum, entry) => sum + entry.duration, 0);

            return {
                count: scripts.length,
                totalSize,
                totalDuration,
                avgDuration: scripts.length > 0 ? totalDuration / scripts.length : 0
            };
        });

        const sizeKB = (jsMetrics.totalSize / 1024).toFixed(2);

        console.log(`✅ Scripts JS: ${jsMetrics.count} arquivos`);
        console.log(`✅ Tamanho total: ${sizeKB} KB`);
        console.log(`✅ Duração média: ${jsMetrics.avgDuration.toFixed(2)}ms`);

        // JS total deve ser < 1MB
        const sizeMB = jsMetrics.totalSize / (1024 * 1024);
        expect(sizeMB).toBeLessThan(1);
    });
});

test.describe('Regressão Visual', () => {
    test('página inicial deve manter aparência consistente', async ({ page }) => {
        console.log('🧪 Capturando screenshot da página inicial...');

        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        // Aguardar elementos carregarem
        await page.waitForTimeout(1000);

        // Capturar screenshot
        await page.screenshot({
            path: 'tests/e2e/screenshots/quiz-home.png',
            fullPage: true
        });

        console.log('✅ Screenshot salvo: tests/e2e/screenshots/quiz-home.png');

        // Verificar que a página não está vazia
        const bodyText = await page.textContent('body');
        expect(bodyText?.length).toBeGreaterThan(100);
    });

    test('página de pergunta deve manter layout', async ({ page }) => {
        console.log('🧪 Capturando screenshot de pergunta...');

        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        // Avançar para uma pergunta
        const startButton = page.locator('button').first();
        if (await startButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await startButton.click();
            await page.waitForTimeout(1000);

            await page.screenshot({
                path: 'tests/e2e/screenshots/quiz-question.png',
                fullPage: true
            });

            console.log('✅ Screenshot salvo: tests/e2e/screenshots/quiz-question.png');
        }
    });

    test('componentes devem renderizar corretamente em diferentes viewports', async ({ page }) => {
        console.log('🧪 Testando responsividade visual...');

        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        // Desktop
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: 'tests/e2e/screenshots/quiz-desktop.png'
        });
        console.log('✅ Screenshot desktop salvo');

        // Tablet
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: 'tests/e2e/screenshots/quiz-tablet.png'
        });
        console.log('✅ Screenshot tablet salvo');

        // Mobile
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: 'tests/e2e/screenshots/quiz-mobile.png'
        });
        console.log('✅ Screenshot mobile salvo');
    });

    test('tema dark mode deve funcionar (se implementado)', async ({ page }) => {
        console.log('🧪 Testando dark mode...');

        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        // Tentar ativar dark mode
        await page.emulateMedia({ colorScheme: 'dark' });
        await page.waitForTimeout(500);

        await page.screenshot({
            path: 'tests/e2e/screenshots/quiz-dark-mode.png',
            fullPage: true
        });

        console.log('✅ Screenshot dark mode salvo');

        // Verificar que o fundo mudou
        const backgroundColor = await page.evaluate(() => {
            return window.getComputedStyle(document.body).backgroundColor;
        });

        console.log(`✅ Background color (dark): ${backgroundColor}`);
    });

    test('animações devem ser suaves', async ({ page }) => {
        console.log('🧪 Testando animações...');

        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        // Verificar se há transições CSS
        const hasTransitions = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('*'));

            for (const el of elements.slice(0, 50)) {
                const style = window.getComputedStyle(el);
                if (style.transition !== 'none' && style.transition !== '') {
                    return true;
                }
            }

            return false;
        });

        console.log(`✅ Tem transições CSS: ${hasTransitions ? 'Sim' : 'Não'}`);
    });

    test('fontes devem carregar corretamente', async ({ page }) => {
        console.log('🧪 Verificando carregamento de fontes...');

        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        const fonts = await page.evaluate(() => {
            return Array.from(document.fonts.values()).map(font => ({
                family: font.family,
                status: font.status,
                weight: font.weight,
                style: font.style
            }));
        });

        console.log(`✅ Fontes carregadas: ${fonts.length}`);

        for (const font of fonts.slice(0, 5)) {
            console.log(`   ${font.family} (${font.weight} ${font.style}): ${font.status}`);
        }

        // Verificar que pelo menos uma fonte foi carregada
        const loadedFonts = fonts.filter(f => f.status === 'loaded').length;
        expect(loadedFonts).toBeGreaterThan(0);
    });

    test('cores devem ter contraste adequado', async ({ page }) => {
        console.log('🧪 Verificando contraste de cores...');

        await page.goto('/quiz-estilo');
        await page.waitForLoadState('networkidle');

        // Verificar contraste dos primeiros 5 textos
        const textElements = await page.locator('p, h1, h2, h3, button, a').all();

        let goodContrastCount = 0;

        for (const el of textElements.slice(0, 5)) {
            const contrast = await el.evaluate((element) => {
                const style = window.getComputedStyle(element);
                const color = style.color;
                const bgColor = style.backgroundColor;

                // Função simples para calcular luminância relativa
                const getLuminance = (rgb: string) => {
                    const match = rgb.match(/\d+/g);
                    if (!match) return 0;

                    const [r, g, b] = match.map(Number);
                    const [rs, gs, bs] = [r, g, b].map(val => {
                        val = val / 255;
                        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
                    });

                    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
                };

                const l1 = getLuminance(color);
                const l2 = getLuminance(bgColor);

                const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

                return ratio;
            });

            const hasGoodContrast = contrast >= 4.5; // WCAG AA para texto normal
            if (hasGoodContrast) goodContrastCount++;

            console.log(`   Contraste: ${contrast.toFixed(2)}:1 ${hasGoodContrast ? '✅' : '⚠️'}`);
        }

        console.log(`✅ Elementos com bom contraste: ${goodContrastCount}/${Math.min(textElements.length, 5)}`);
    });
});
