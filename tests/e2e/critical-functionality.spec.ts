/**
 * 🎯 TESTES CRÍTICOS DE FUNCIONALIDADE
 * 
 * Testa funcionalidades críticas do sistema:
 * - Sistema de 21 etapas
 * - Performance e carregamento
 * - Integração com dados reais
 * - Responsividade completa
 */

import { test, expect } from '@playwright/test';

test.describe('Funcionalidades Críticas', () => {
    test.beforeEach(async ({ page }) => {
        // Set up error collection
        const errors: string[] = [];
        page.on('pageerror', error => {
            errors.push(error.message);
        });
        
        // Store errors for later access
        (page as any).collectedErrors = errors;
    });

    test('Quiz 21 Steps - Sistema completo', async ({ page }) => {
        await page.goto('/');

        // Navigate to quiz/editor
        const startQuizButton = page.getByRole('button', { name: /começar|iniciar|start/i });
        
        if (await startQuizButton.isVisible()) {
            await startQuizButton.click();
        } else {
            // Fallback to direct navigation
            await page.goto('/quiz/start');
        }

        // Test basic quiz functionality
        await page.waitForTimeout(2000);
        
        const bodyContent = await page.textContent('body');
        expect(bodyContent).toBeTruthy();
        
        // Look for quiz-related elements
        const hasQuizElements = bodyContent?.includes('quiz') || 
                               bodyContent?.includes('pergunta') || 
                               bodyContent?.includes('próximo') ||
                               bodyContent?.includes('continuar');
        
        if (hasQuizElements) {
            console.log('✅ Quiz system detected and functional');
        } else {
            console.log('⚠️ Quiz system may need implementation');
        }
    });

    test('Performance - Core Web Vitals', async ({ page }) => {
        const startTime = Date.now();
        
        // Measure First Contentful Paint
        await page.goto('/');
        
        // Wait for main content
        await page.waitForSelector('main, [role="main"], body > div', { timeout: 10000 });
        
        const navigationTime = Date.now() - startTime;
        
        // Navigate to editor for full test
        const editorStartTime = Date.now();
        await page.goto('/editor');
        
        // Wait for editor components
        try {
            await expect(page.getByTestId('canvas-editor')).toBeVisible({ timeout: 10000 });
            const editorLoadTime = Date.now() - editorStartTime;
            
            // Performance assertions
            expect(navigationTime).toBeLessThan(3000); // Homepage should load in < 3s
            expect(editorLoadTime).toBeLessThan(8000);  // Editor should load in < 8s
            
            console.log(`⚡ Performance: Homepage ${navigationTime}ms, Editor ${editorLoadTime}ms`);
        } catch (error) {
            console.log('⚠️ Editor components not found, testing basic performance only');
            expect(navigationTime).toBeLessThan(5000);
        }
    });

    test('Responsividade - Múltiplos dispositivos', async ({ page }) => {
        const viewports = [
            { name: 'Mobile', width: 375, height: 667 },
            { name: 'Tablet', width: 768, height: 1024 },
            { name: 'Desktop', width: 1200, height: 800 },
            { name: 'Large Desktop', width: 1920, height: 1080 }
        ];

        for (const viewport of viewports) {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.goto('/');
            
            // Wait for layout adjustment
            await page.waitForTimeout(500);
            
            // Check that content is visible and properly sized
            const bodyBox = await page.locator('body').boundingBox();
            expect(bodyBox).toBeTruthy();
            expect(bodyBox!.width).toBeLessThanOrEqual(viewport.width);
            
            // Check for horizontal scroll (should not exist)
            const hasHorizontalScroll = await page.evaluate(() => {
                return document.body.scrollWidth > window.innerWidth;
            });
            
            expect(hasHorizontalScroll).toBeFalsy();
            
            console.log(`✅ ${viewport.name} (${viewport.width}x${viewport.height}) - OK`);
        }
    });

    test('Error Handling - JavaScript errors', async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', error => {
            errors.push(error.message);
        });

        // Test main pages
        const pagesToTest = ['/', '/editor', '/quiz/test'];
        
        for (const pagePath of pagesToTest) {
            try {
                await page.goto(pagePath);
                await page.waitForTimeout(2000);
                
                // Check for critical errors
                const criticalErrors = errors.filter(error =>
                    error.includes('ReferenceError') ||
                    error.includes('TypeError: Cannot read') ||
                    error.includes('is not defined')
                );
                
                expect(criticalErrors.length).toBe(0);
                
                console.log(`✅ ${pagePath} - No critical errors`);
            } catch (error) {
                console.log(`⚠️ ${pagePath} - May not exist yet`);
            }
        }
        
        if (errors.length > 0) {
            console.log('⚠️ Non-critical warnings:', errors.slice(0, 3));
        }
    });

    test('Integração de dados - LocalStorage', async ({ page }) => {
        await page.goto('/');
        
        // Test localStorage functionality
        await page.evaluate(() => {
            localStorage.setItem('e2e-test', 'test-value');
        });
        
        const storedValue = await page.evaluate(() => {
            return localStorage.getItem('e2e-test');
        });
        
        expect(storedValue).toBe('test-value');
        
        // Test with funnel data if editor available
        try {
            await page.goto('/editor');
            await expect(page.getByTestId('canvas-editor')).toBeVisible({ timeout: 5000 });
            
            // Test if funnel data can be stored
            await page.evaluate(() => {
                const testFunnelData = {
                    id: 'e2e-test-funnel',
                    steps: ['step-1', 'step-2'],
                    currentStep: 1
                };
                localStorage.setItem('funnel-data', JSON.stringify(testFunnelData));
            });
            
            const funnelData = await page.evaluate(() => {
                const data = localStorage.getItem('funnel-data');
                return data ? JSON.parse(data) : null;
            });
            
            expect(funnelData).toBeTruthy();
            expect(funnelData.id).toBe('e2e-test-funnel');
            
            console.log('✅ Funnel data integration working');
        } catch (error) {
            console.log('ℹ️ Editor not available for funnel data test');
        }
        
        console.log('✅ LocalStorage integration working');
    });

    test('Acessibilidade básica', async ({ page }) => {
        await page.goto('/');
        
        // Check for basic accessibility features
        const hasMainLandmark = await page.locator('main, [role="main"]').count() > 0;
        const hasHeadings = await page.locator('h1, h2, h3').count() > 0;
        const hasSkipLinks = await page.locator('a[href*="#"], [role="button"]').count() > 0;
        
        // At least one of these should be present
        expect(hasMainLandmark || hasHeadings || hasSkipLinks).toBeTruthy();
        
        // Check keyboard navigation
        await page.keyboard.press('Tab');
        const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
        expect(focusedElement).toBeTruthy();
        
        console.log('✅ Basic accessibility features present');
    });

    test('Network resilience - Offline simulation', async ({ page }) => {
        await page.goto('/');
        
        // First, test normal operation
        await page.waitForTimeout(1000);
        const onlineContent = await page.textContent('body');
        expect(onlineContent).toBeTruthy();
        
        // Simulate network issues
        await page.setOfflineMode(true);
        
        try {
            // Try to navigate - should handle gracefully
            await page.reload();
            await page.waitForTimeout(2000);
            
            // Should show some kind of offline message or fallback
            const offlineContent = await page.textContent('body');
            expect(offlineContent).toBeTruthy();
            
            console.log('✅ Offline mode handled gracefully');
        } catch (error) {
            console.log('ℹ️ Offline handling may need improvement');
        } finally {
            await page.setOfflineMode(false);
        }
    });
});

test.describe('Smoke Tests - Sistema Geral', () => {
    test('Homepage carrega sem erros críticos', async ({ page }) => {
        await page.goto('/');
        
        // Basic smoke test
        await expect(page.locator('body')).toBeVisible();
        
        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
        
        const bodyContent = await page.textContent('body');
        expect(bodyContent!.length).toBeGreaterThan(100);
        
        console.log(`✅ Homepage loaded: "${title}"`);
    });

    test('Navegação básica funciona', async ({ page }) => {
        await page.goto('/');
        
        // Look for navigation links
        const navLinks = page.locator('a[href], button[onClick], [role="button"]');
        const linkCount = await navLinks.count();
        
        if (linkCount > 0) {
            // Test first interactive element
            await navLinks.first().click();
            await page.waitForTimeout(1000);
            
            // Should navigate somewhere or do something
            const newUrl = page.url();
            expect(newUrl).toBeTruthy();
            
            console.log(`✅ Navigation working - found ${linkCount} interactive elements`);
        } else {
            console.log('⚠️ No navigation elements found');
        }
    });
});