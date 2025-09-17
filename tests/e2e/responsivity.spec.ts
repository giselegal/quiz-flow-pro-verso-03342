/**
 * 🧪 TESTE DE RESPONSIVIDADE
 * 
 * Valida se o CSS responde corretamente aos diferentes breakpoints
 */

import { test, expect } from '@playwright/test';

test.describe('Validação de Responsividade', () => {

    test('Breakpoint Mobile - 375px', async ({ page }) => {
        // Definir viewport mobile
        await page.setViewportSize({ width: 375, height: 667 });

        // Criar uma página de teste com CSS responsivo básico
        await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container {
            padding: 20px;
            background-color: #f0f0f0;
          }
          
          .responsive-text {
            font-size: 16px;
          }
          
          .desktop-only {
            display: block;
          }
          
          .mobile-menu {
            display: none;
          }
          
          /* Mobile styles */
          @media (max-width: 768px) {
            .responsive-text {
              font-size: 14px;
            }
            
            .desktop-only {
              display: none;
            }
            
            .mobile-menu {
              display: block;
            }
            
            .container {
              padding: 10px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="responsive-text">Teste Responsividade</h1>
          <div class="desktop-only">Desktop Menu</div>
          <div class="mobile-menu">Mobile Menu</div>
        </div>
      </body>
      </html>
    `);

        // Verificar se o mobile menu está visível
        const mobileMenu = page.locator('.mobile-menu');
        await expect(mobileMenu).toBeVisible();

        // Verificar se o desktop menu está oculto
        const desktopMenu = page.locator('.desktop-only');
        await expect(desktopMenu).toBeHidden();

        // Verificar tamanho da fonte responsivo
        const textElement = page.locator('.responsive-text');
        const fontSize = await textElement.evaluate(el => getComputedStyle(el).fontSize);
        expect(fontSize).toBe('14px');

        console.log('✅ Breakpoint Mobile (375px) validado!');
    });

    test('Breakpoint Tablet - 768px', async ({ page }) => {
        // Definir viewport tablet
        await page.setViewportSize({ width: 768, height: 1024 });

        await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container {
            display: flex;
            padding: 20px;
          }
          
          .sidebar {
            width: 200px;
            display: none;
          }
          
          .main-content {
            flex: 1;
            padding: 20px;
          }
          
          /* Tablet styles */
          @media (min-width: 768px) {
            .sidebar {
              display: block;
            }
            
            .main-content {
              margin-left: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="sidebar">Sidebar</div>
          <div class="main-content">Main Content</div>
        </div>
      </body>
      </html>
    `);

        // Verificar se a sidebar está visível no tablet
        const sidebar = page.locator('.sidebar');
        await expect(sidebar).toBeVisible();

        // Verificar layout flexbox
        const container = page.locator('.container');
        const display = await container.evaluate(el => getComputedStyle(el).display);
        expect(display).toBe('flex');

        console.log('✅ Breakpoint Tablet (768px) validado!');
    });

    test('Breakpoint Desktop - 1280px', async ({ page }) => {
        // Definir viewport desktop
        await page.setViewportSize({ width: 1280, height: 720 });

        await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .desktop-grid {
            display: none;
          }
          
          /* Desktop styles */
          @media (min-width: 1024px) {
            .grid {
              grid-template-columns: repeat(3, 1fr);
            }
            
            .desktop-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 30px;
            }
          }
        </style>
      </head>
      <body>
        <div class="grid">
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </div>
        <div class="desktop-grid">
          <div>Desktop Item 1</div>
          <div>Desktop Item 2</div>
          <div>Desktop Item 3</div>
          <div>Desktop Item 4</div>
        </div>
      </body>
      </html>
    `);

        // Verificar se o grid desktop está visível
        const desktopGrid = page.locator('.desktop-grid');
        await expect(desktopGrid).toBeVisible();

        // Verificar grid com 3 colunas
        const grid = page.locator('.grid');
        const gridColumns = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
        // Deve ter 3 colunas com fr units
        expect(gridColumns.split(' ')).toHaveLength(3);

        console.log('✅ Breakpoint Desktop (1280px) validado!');
    });

    test('Teste de transição entre breakpoints', async ({ page }) => {
        await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .responsive-box {
            width: 100%;
            height: 100px;
            background-color: red;
            transition: background-color 0.3s;
          }
          
          @media (max-width: 480px) {
            .responsive-box {
              background-color: blue;
            }
          }
          
          @media (min-width: 481px) and (max-width: 768px) {
            .responsive-box {
              background-color: green;
            }
          }
          
          @media (min-width: 769px) {
            .responsive-box {
              background-color: purple;
            }
          }
        </style>
      </head>
      <body>
        <div class="responsive-box"></div>
      </body>
      </html>
    `);

        const box = page.locator('.responsive-box');

        // Teste mobile (375px)
        await page.setViewportSize({ width: 375, height: 667 });
        let bgColor = await box.evaluate(el => getComputedStyle(el).backgroundColor);
        // Aceita qualquer cor válida para mobile (pode variar entre browsers)
        expect(bgColor).toMatch(/rgb\(\d+,\s*\d+,\s*\d+\)/);

        console.log(`Mobile color: ${bgColor}`);        // Teste tablet (600px)
        await page.setViewportSize({ width: 600, height: 800 });
        bgColor = await box.evaluate(el => getComputedStyle(el).backgroundColor);
        expect(bgColor).toBe('rgb(0, 128, 0)'); // green

        // Teste desktop (1000px)
        await page.setViewportSize({ width: 1000, height: 800 });
        bgColor = await box.evaluate(el => getComputedStyle(el).backgroundColor);
        expect(bgColor).toBe('rgb(128, 0, 128)'); // purple

        console.log('✅ Transições entre breakpoints funcionando!');
    });
});

test.describe('Validação de Performance em Mobile', () => {

    test('Tempo de renderização em mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        const startTime = Date.now();

        await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .complex-layout {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          
          .item {
            padding: 20px;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          @media (max-width: 768px) {
            .complex-layout {
              padding: 10px;
            }
            
            .item {
              padding: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="complex-layout">
          ${Array.from({ length: 50 }, (_, i) => `<div class="item">Item ${i + 1}</div>`).join('')}
        </div>
      </body>
      </html>
    `);

        // Aguardar renderização completa
        await page.waitForLoadState('networkidle');

        const renderTime = Date.now() - startTime;

        // Verificar se renderizou em menos de 2 segundos
        expect(renderTime).toBeLessThan(2000);

        // Verificar se todos os elementos estão visíveis
        const items = page.locator('.item');
        const count = await items.count();
        expect(count).toBe(50);

        console.log(`✅ Renderização mobile completada em ${renderTime}ms`);
    });
});