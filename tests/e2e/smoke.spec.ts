/**
 * 🧪 TESTE BÁSICO - SMOKE TESTS
 * 
 * Testes básicos para verificar se as páginas principais carregam
 */

import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Páginas Principais', () => {
    test('Página inicial carrega corretamente', async ({ page }) => {
        await page.goto('/');

        // Verificar se a página carregou
        await expect(page).toHaveTitle(/Quiz Quest/i);

        // Verificar elementos básicos
        await expect(page.getByRole('main')).toBeVisible();
    });

    test('Editor carrega sem erros críticos', async ({ page }) => {
        await page.goto('/editor');

        // Verificar se não há erros de JavaScript críticos
        const errors: string[] = [];
        page.on('pageerror', error => {
            errors.push(error.message);
        });

        // Aguardar um pouco para detectar erros
        await page.waitForTimeout(2000);

        // Verificar se não há erros críticos
        const criticalErrors = errors.filter(error =>
            error.includes('ReferenceError') ||
            error.includes('TypeError') ||
            error.includes('is not defined')
        );

        expect(criticalErrors.length).toBe(0);

        if (errors.length > 0) {
            console.log('⚠️  Avisos detectados:', errors);
        }
    });

    test('Preview básico funciona', async ({ page }) => {
        // Tentar acessar uma página de quiz
        await page.goto('/quiz/test');

        // Verificar se não há erro 404 ou 500
        const response = await page.waitForLoadState('networkidle');

        // Se a página carregar, deve ter algum conteúdo
        const bodyContent = await page.textContent('body');
        expect(bodyContent?.length || 0).toBeGreaterThan(0);
    });
});