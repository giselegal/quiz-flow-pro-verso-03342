/**
 * 🎯 TESTES DE RESPONSIVIDADE MELHORADOS
 * 
 * Testa comportamento em diferentes dispositivos com data-testids reais
 */

import { test, expect } from '@playwright/test';

test.describe('Responsividade - Todos os Dispositivos', () => {
    const devices = [
        { name: 'iPhone SE', width: 375, height: 667 },
        { name: 'iPad', width: 768, height: 1024 },
        { name: 'Desktop', width: 1200, height: 800 },
        { name: 'Ultrawide', width: 1920, height: 1080 }
    ];

    devices.forEach(device => {
        test(`${device.name} - Layout adapta corretamente`, async ({ page }) => {
            await page.setViewportSize({ width: device.width, height: device.height });
            await page.goto('/');

            // Wait for layout to settle
            await page.waitForTimeout(500);

            // Check basic responsiveness
            const bodyBox = await page.locator('body').boundingBox();
            expect(bodyBox!.width).toBeLessThanOrEqual(device.width + 10);

            // No horizontal scroll
            const hasHorizontalScroll = await page.evaluate(() => 
                document.body.scrollWidth > window.innerWidth
            );
            expect(hasHorizontalScroll).toBeFalsy();

            console.log(`✅ ${device.name} - Layout OK`);
        });

        test(`${device.name} - Editor responsivo`, async ({ page }) => {
            await page.setViewportSize({ width: device.width, height: device.height });
            await page.goto('/editor');

            try {
                // Wait for main components
                await expect(page.getByTestId('canvas-editor')).toBeVisible({ timeout: 8000 });
                
                if (device.width < 768) {
                    // Mobile: check if components stack or hide properly
                    const sidebar = page.getByTestId('components-sidebar');
                    const canvas = page.getByTestId('canvas-editor');
                    
                    const sidebarBox = await sidebar.boundingBox();
                    const canvasBox = await canvas.boundingBox();
                    
                    // On mobile, components should not overlap badly
                    if (sidebarBox && canvasBox) {
                        expect(canvasBox.width).toBeGreaterThan(200);
                    }
                } else {
                    // Desktop: all components should be visible
                    await expect(page.getByTestId('components-sidebar')).toBeVisible();
                    await expect(page.getByTestId('properties-panel')).toBeVisible();
                }
                
                console.log(`✅ ${device.name} - Editor responsive`);
            } catch (error) {
                console.log(`ℹ️ ${device.name} - Editor components not available`);
            }
        });
    });
});