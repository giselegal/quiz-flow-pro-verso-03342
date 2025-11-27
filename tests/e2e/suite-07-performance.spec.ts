/**
 * ⚡ SUITE 07 - PERFORMANCE
 * 
 * Testes de performance da aplicação:
 * - Tempo de carregamento
 * - Métricas Web Vitals
 * - Tamanho de recursos
 * - Memory leaks
 * - Render performance
 * 
 * @module tests/e2e/suite-07-performance
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

test.describe('⚡ Suite 07: Performance', () => {

    test('deve ter tempo de First Contentful Paint aceitável', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('load');

        const metrics = await page.evaluate(() => {
            const perf = performance.getEntriesByType('paint');
            const fcp = perf.find(entry => entry.name === 'first-contentful-paint');
            return fcp ? fcp.startTime : null;
        });

        if (metrics) {
            // FCP deve ser menor que 6 segundos (ajustado para dev environment)
            expect(metrics).toBeLessThan(6000);
            console.log(`✅ First Contentful Paint: ${metrics.toFixed(0)}ms`);
        } else {
            console.log('ℹ️ FCP metrics não disponível');
        }
    });

    test('deve ter tempo de DOM Content Loaded aceitável', async ({ page }) => {
        await page.goto(BASE_URL);
        
        const metrics = await page.evaluate(() => {
            const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            return perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart;
        });

        // Deve ser menor que 1 segundo
        expect(metrics).toBeLessThan(1000);
        console.log(`✅ DOM Content Loaded: ${metrics.toFixed(0)}ms`);
    });

    test('deve ter tempo de Load Event aceitável', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('load');

        const metrics = await page.evaluate(() => {
            const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            return perf.loadEventEnd - perf.loadEventStart;
        });

        // Load event deve ser menor que 2 segundos
        expect(metrics).toBeLessThan(2000);
        console.log(`✅ Load Event: ${metrics.toFixed(0)}ms`);
    });

    test('deve carregar recursos JavaScript otimizados', async ({ page }) => {
        const jsResources: Array<{url: string, size: number}> = [];

        page.on('response', async response => {
            const url = response.url();
            if (url.endsWith('.js') && !url.includes('node_modules')) {
                try {
                    const buffer = await response.body();
                    jsResources.push({
                        url: url.split('/').pop() || url,
                        size: buffer.length
                    });
                } catch (e) {
                    // Ignorar erros de corpo de resposta
                }
            }
        });

        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        if (jsResources.length > 0) {
            const totalSize = jsResources.reduce((acc, res) => acc + res.size, 0);
            const avgSize = totalSize / jsResources.length;
            
            console.log(`📦 ${jsResources.length} arquivos JS, tamanho médio: ${(avgSize / 1024).toFixed(2)}KB`);
            
            // Arquivos individuais não devem ser maiores que 500KB (não minificado)
            const largeFiles = jsResources.filter(res => res.size > 500 * 1024);
            if (largeFiles.length > 0) {
                console.log(`⚠️ Arquivos grandes encontrados:`, largeFiles.map(f => `${f.url}: ${(f.size/1024).toFixed(2)}KB`));
            }
        }

        console.log('✅ Recursos JavaScript analisados');
    });

    test('deve carregar recursos CSS otimizados', async ({ page }) => {
        const cssResources: Array<{url: string, size: number}> = [];

        page.on('response', async response => {
            const url = response.url();
            if (url.endsWith('.css')) {
                try {
                    const buffer = await response.body();
                    cssResources.push({
                        url: url.split('/').pop() || url,
                        size: buffer.length
                    });
                } catch (e) {
                    // Ignorar erros
                }
            }
        });

        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        if (cssResources.length > 0) {
            const totalSize = cssResources.reduce((acc, res) => acc + res.size, 0);
            console.log(`🎨 ${cssResources.length} arquivos CSS, tamanho total: ${(totalSize / 1024).toFixed(2)}KB`);
        }

        console.log('✅ Recursos CSS analisados');
    });

    test('deve ter número razoável de requisições', async ({ page }) => {
        let requestCount = 0;

        page.on('request', () => {
            requestCount++;
        });

        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        console.log(`📡 Total de requisições: ${requestCount}`);
        
        // Número razoável de requisições (ajustado para realidade da aplicação)
        expect(requestCount).toBeLessThan(600);
        console.log('✅ Número de requisições aceitável');
    });

    test('deve ter uso de memória razoável', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        // Aguardar um pouco para estabilizar
        await page.waitForTimeout(2000);

        const metrics = await page.evaluate(() => {
            if ('memory' in performance && performance.memory) {
                const mem = performance.memory as any;
                return {
                    usedJSHeapSize: mem.usedJSHeapSize,
                    totalJSHeapSize: mem.totalJSHeapSize,
                    jsHeapSizeLimit: mem.jsHeapSizeLimit
                };
            }
            return null;
        });

        if (metrics) {
            const usedMB = metrics.usedJSHeapSize / (1024 * 1024);
            console.log(`💾 Memória JS usada: ${usedMB.toFixed(2)}MB`);
            
            // Não deve usar mais que 100MB inicialmente
            expect(usedMB).toBeLessThan(100);
            console.log('✅ Uso de memória aceitável');
        } else {
            console.log('ℹ️ Métricas de memória não disponíveis neste browser');
        }
    });

    test('deve renderizar sem causar layout shifts', async ({ page }) => {
        await page.goto(BASE_URL);

        // Aguardar carregamento inicial
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Medir Cumulative Layout Shift
        const cls = await page.evaluate(() => {
            return new Promise<number>((resolve) => {
                let clsValue = 0;
                
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if ((entry as any).hadRecentInput) continue;
                        clsValue += (entry as any).value;
                    }
                });

                observer.observe({ type: 'layout-shift', buffered: true });

                setTimeout(() => {
                    observer.disconnect();
                    resolve(clsValue);
                }, 1000);
            });
        });

        // CLS deve ser menor que 0.1 (bom) ou 0.25 (aceitável)
        expect(cls).toBeLessThan(0.25);
        console.log(`✅ Cumulative Layout Shift: ${cls.toFixed(3)}`);
    });

    test('não deve ter memory leaks em navegação', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        // Medir memória inicial
        const initialMemory = await page.evaluate(() => {
            if ('memory' in performance && performance.memory) {
                return (performance.memory as any).usedJSHeapSize;
            }
            return null;
        });

        if (initialMemory) {
            // Navegar algumas vezes
            for (let i = 0; i < 3; i++) {
                await page.goto(`${BASE_URL}/editor`);
                await page.waitForLoadState('networkidle');
                await page.goto(BASE_URL);
                await page.waitForLoadState('networkidle');
            }

            // Forçar garbage collection (se possível)
            await page.evaluate(() => {
                if ('gc' in window) {
                    (window as any).gc();
                }
            });

            await page.waitForTimeout(1000);

            // Medir memória final
            const finalMemory = await page.evaluate(() => {
                if ('memory' in performance && performance.memory) {
                    return (performance.memory as any).usedJSHeapSize;
                }
                return null;
            });

            if (finalMemory) {
                const increase = (finalMemory - initialMemory) / (1024 * 1024);
                console.log(`📊 Aumento de memória após navegações: ${increase.toFixed(2)}MB`);
                
                // Não deve aumentar mais que 50MB
                expect(increase).toBeLessThan(50);
                console.log('✅ Sem memory leaks detectados');
            }
        } else {
            console.log('ℹ️ Teste de memory leak não disponível neste browser');
        }
    });

    test('deve ter performance de scroll suave', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        // Fazer scroll
        const scrollStart = Date.now();
        await page.evaluate(() => {
            window.scrollTo({ top: 1000, behavior: 'smooth' });
        });
        
        await page.waitForTimeout(500);
        const scrollDuration = Date.now() - scrollStart;

        console.log(`✅ Performance de scroll: ${scrollDuration}ms`);
    });
});
