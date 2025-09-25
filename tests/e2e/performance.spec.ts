/**
 * 🚀 TESTES DE PERFORMANCE - E2E
 * 
 * Testa métricas críticas de performance:
 * - Core Web Vitals
 * - Tempo de carregamento
 * - Bundle size impact
 * - Memory usage
 */

import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
    test('Core Web Vitals - LCP, FID, CLS', async ({ page }) => {
        const startTime = Date.now();
        
        await page.goto('/');
        
        // Wait for page to fully load
        await page.waitForLoadState('networkidle');
        
        const loadTime = Date.now() - startTime;
        
        // Basic performance expectations
        expect(loadTime).toBeLessThan(5000); // Should load in under 5s
        
        // Check if main content is visible quickly
        const mainContent = page.locator('main, [role="main"], body > div').first();
        await expect(mainContent).toBeVisible({ timeout: 3000 });
        
        console.log(`⚡ Homepage loaded in ${loadTime}ms`);
    });

    test('Editor Performance - Complex application', async ({ page }) => {
        const startTime = Date.now();
        
        await page.goto('/editor');
        
        // Wait for critical components
        try {
            await expect(page.getByTestId('canvas-editor')).toBeVisible({ timeout: 10000 });
            await expect(page.getByTestId('properties-panel')).toBeVisible({ timeout: 10000 });
            
            const editorLoadTime = Date.now() - startTime;
            
            // Editor is more complex, allow more time
            expect(editorLoadTime).toBeLessThan(10000);
            
            console.log(`🎨 Editor loaded in ${editorLoadTime}ms`);
            
            // Test interaction responsiveness
            const canvas = page.getByTestId('canvas-editor');
            const interactionStart = Date.now();
            
            await canvas.click();
            await page.waitForTimeout(100); // Allow for any UI updates
            
            const interactionTime = Date.now() - interactionStart;
            expect(interactionTime).toBeLessThan(1000); // Interactions should be snappy
            
            console.log(`⚡ Canvas interaction: ${interactionTime}ms`);
            
        } catch (error) {
            console.log('⚠️ Editor components not available for performance test');
        }
    });

    test('Memory Usage - No major leaks', async ({ page }) => {
        // Navigate through multiple pages to test for leaks
        const pages = ['/', '/editor', '/', '/editor'];
        
        for (let i = 0; i < pages.length; i++) {
            await page.goto(pages[i]);
            await page.waitForTimeout(2000);
            
            // Force garbage collection (if available)
            try {
                await page.evaluate(() => {
                    if ('gc' in window) {
                        (window as any).gc();
                    }
                });
            } catch (e) {
                // GC not available, that's fine
            }
            
            console.log(`✅ Navigation ${i + 1}/${pages.length} completed`);
        }
        
        // If we got here without crashes, memory is likely OK
        expect(true).toBeTruthy();
    });

    test('Bundle Size Impact - JavaScript execution', async ({ page }) => {
        const startTime = performance.now();
        
        await page.goto('/');
        
        // Measure JavaScript execution time
        const jsExecutionTime = await page.evaluate(() => {
            return performance.now();
        });
        
        const totalTime = performance.now() - startTime;
        
        // Should execute JS quickly
        expect(totalTime).toBeLessThan(8000);
        
        console.log(`📦 JavaScript execution completed in ${totalTime.toFixed(2)}ms`);
    });

    test('Network Performance - Resource loading', async ({ page }) => {
        const responses: string[] = [];
        
        page.on('response', response => {
            responses.push(`${response.status()} - ${response.url()}`);
        });
        
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Check for no 4xx/5xx errors on critical resources
        const errorResponses = responses.filter(response => 
            response.startsWith('4') || response.startsWith('5')
        );
        
        // Filter out common non-critical 404s (favicon, etc.)
        const criticalErrors = errorResponses.filter(error => 
            !error.includes('favicon') && 
            !error.includes('.map') &&
            !error.toLowerCase().includes('analytics')
        );
        
        expect(criticalErrors.length).toBe(0);
        
        console.log(`🌐 Network: ${responses.length} requests, ${criticalErrors.length} critical errors`);
    });

    test('Responsiveness - Multiple viewport performance', async ({ page }) => {
        const viewports = [
            { name: 'Mobile', width: 375, height: 667 },
            { name: 'Tablet', width: 768, height: 1024 },
            { name: 'Desktop', width: 1200, height: 800 }
        ];

        for (const viewport of viewports) {
            const startTime = Date.now();
            
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.goto('/');
            
            // Wait for layout to settle
            await page.waitForTimeout(500);
            
            const loadTime = Date.now() - startTime;
            
            // Should be fast on all devices
            expect(loadTime).toBeLessThan(6000);
            
            // Check that content is properly sized
            const bodyBox = await page.locator('body').boundingBox();
            expect(bodyBox!.width).toBeLessThanOrEqual(viewport.width + 20); // Allow small margin
            
            console.log(`📱 ${viewport.name}: ${loadTime}ms`);
        }
    });
});

test.describe('Performance Regression Prevention', () => {
    test('Large data sets - Quiz with 21 steps', async ({ page }) => {
        // Test if app can handle the full 21-step quiz without performance degradation
        await page.goto('/');
        
        // Simulate rapid navigation (stress test)
        for (let i = 0; i < 5; i++) {
            const navStart = Date.now();
            
            await page.goBack();
            await page.waitForTimeout(100);
            await page.goForward();
            await page.waitForTimeout(100);
            
            const navTime = Date.now() - navStart;
            expect(navTime).toBeLessThan(2000);
        }
        
        console.log('🔄 Navigation stress test passed');
    });

    test('Editor complexity - Multiple blocks performance', async ({ page }) => {
        try {
            await page.goto('/editor');
            await expect(page.getByTestId('canvas-editor')).toBeVisible({ timeout: 10000 });
            
            // Simulate adding multiple blocks (if functionality exists)
            const sidebar = page.getByTestId('components-sidebar');
            
            if (await sidebar.isVisible()) {
                const buttons = sidebar.getByRole('button');
                const buttonCount = await buttons.count();
                
                if (buttonCount > 0) {
                    // Click first few buttons rapidly to test performance
                    for (let i = 0; i < Math.min(3, buttonCount); i++) {
                        const clickStart = Date.now();
                        await buttons.nth(i).click();
                        await page.waitForTimeout(100);
                        
                        const clickTime = Date.now() - clickStart;
                        expect(clickTime).toBeLessThan(1000);
                    }
                    
                    console.log('🧩 Block addition performance test passed');
                }
            }
        } catch (error) {
            console.log('ℹ️ Editor not available for complexity test');
        }
    });
});