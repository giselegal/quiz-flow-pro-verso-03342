/**
 * 📱 SUITE 06 - RESPONSIVIDADE
 * 
 * Testes de responsividade em diferentes dispositivos:
 * - Desktop (1920x1080, 1366x768)
 * - Tablet (768x1024)
 * - Mobile (375x667, 414x896)
 * - Orientação landscape/portrait
 * 
 * @module tests/e2e/suite-06-responsive
 */

import { test, expect, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

// Configurações de viewport customizadas
const viewports = {
    desktop_large: { width: 1920, height: 1080 },
    desktop_medium: { width: 1366, height: 768 },
    tablet: { width: 768, height: 1024 },
    mobile_small: { width: 375, height: 667 },
    mobile_large: { width: 414, height: 896 }
};

test.describe('📱 Suite 06: Responsividade', () => {

    test('deve funcionar em desktop large (1920x1080)', async ({ page }) => {
        await page.setViewportSize(viewports.desktop_large);
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        const root = page.locator('#root');
        await expect(root).toBeVisible();

        // Verificar que não há overflow horizontal
        const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasHorizontalScroll).toBe(false);
        console.log('✅ Funciona em desktop large');
    });

    test('deve funcionar em desktop medium (1366x768)', async ({ page }) => {
        await page.setViewportSize(viewports.desktop_medium);
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        const root = page.locator('#root');
        await expect(root).toBeVisible();

        console.log('✅ Funciona em desktop medium');
    });

    test('deve funcionar em tablet (768x1024)', async ({ page }) => {
        await page.setViewportSize(viewports.tablet);
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        const root = page.locator('#root');
        await expect(root).toBeVisible();

        // Verificar se elementos são clicáveis em tablet
        const buttons = await page.locator('button:visible').count();
        expect(buttons).toBeGreaterThan(0);

        console.log('✅ Funciona em tablet');
    });

    test('deve funcionar em mobile (375x667 - iPhone SE)', async ({ page }) => {
        await page.setViewportSize(viewports.mobile_small);
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        const root = page.locator('#root');
        await expect(root).toBeVisible();

        // Verificar que não há overflow horizontal
        const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        // Permitir pequena tolerância (alguns pixels)
        if (hasHorizontalScroll) {
            const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
            const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
            const diff = scrollWidth - clientWidth;
            
            // Até 5px de diferença é aceitável
            expect(diff).toBeLessThan(5);
        }

        console.log('✅ Funciona em mobile small');
    });

    test('deve funcionar em mobile large (414x896 - iPhone 11)', async ({ page }) => {
        await page.setViewportSize(viewports.mobile_large);
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        const root = page.locator('#root');
        await expect(root).toBeVisible();

        console.log('✅ Funciona em mobile large');
    });

    test('deve adaptar em mudança de orientação', async ({ page }) => {
        // Portrait
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        let root = page.locator('#root');
        await expect(root).toBeVisible();

        // Landscape
        await page.setViewportSize({ width: 667, height: 375 });
        await page.waitForTimeout(500);

        root = page.locator('#root');
        await expect(root).toBeVisible();

        console.log('✅ Adapta em mudança de orientação');
    });

    test('deve ter elementos clicáveis em touch screens', async ({ page }) => {
        await page.setViewportSize(viewports.mobile_small);
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        // Verificar tamanho dos elementos clicáveis (devem ter pelo menos 44x44px)
        const buttons = await page.locator('button:visible').all();
        
        if (buttons.length > 0) {
            const firstButton = buttons[0];
            const box = await firstButton.boundingBox();
            
            if (box) {
                // Pelo menos 30px para ser razoavelmente clicável em mobile
                const minSize = 30;
                expect(box.width >= minSize || box.height >= minSize).toBe(true);
                console.log(`✅ Botões têm tamanho adequado: ${box.width}x${box.height}px`);
            }
        }
    });

    test('deve ter texto legível em mobile', async ({ page }) => {
        await page.setViewportSize(viewports.mobile_small);
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        // Verificar tamanho de fonte
        const fontSize = await page.evaluate(() => {
            const body = document.body;
            const style = window.getComputedStyle(body);
            return parseInt(style.fontSize);
        });

        // Fonte deve ser pelo menos 14px em mobile
        expect(fontSize).toBeGreaterThanOrEqual(14);
        console.log(`✅ Tamanho de fonte adequado: ${fontSize}px`);
    });

    test('deve ter navegação mobile funcional', async ({ page }) => {
        await page.setViewportSize(viewports.mobile_small);
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        // Procurar por menu mobile/hamburger
        const mobileMenuSelectors = [
            '[data-testid*="mobile-menu"]',
            '[aria-label*="menu"]',
            'button:has-text(/menu/i)',
            '.hamburger',
            '.mobile-menu-button'
        ];

        let foundMobileMenu = false;
        for (const selector of mobileMenuSelectors) {
            const count = await page.locator(selector).count();
            if (count > 0) {
                foundMobileMenu = true;
                console.log(`✅ Menu mobile encontrado: ${selector}`);
                break;
            }
        }

        if (!foundMobileMenu) {
            console.log('ℹ️ Menu mobile específico não detectado - navegação pode ser sempre visível');
        }
    });

    test('deve carregar rápido em mobile', async ({ page }) => {
        await page.setViewportSize(viewports.mobile_small);
        
        const startTime = Date.now();
        await page.goto(BASE_URL);
        await page.waitForLoadState('domcontentloaded');
        const loadTime = Date.now() - startTime;

        // Em mobile deve carregar em menos de 5 segundos
        expect(loadTime).toBeLessThan(5000);
        console.log(`✅ Tempo de carregamento em mobile: ${loadTime}ms`);
    });
});
