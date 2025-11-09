import { test, expect } from '@playwright/test';

test.describe('Saúde do React no bootstrap (DEV)', () => {
    test('APIs essenciais disponíveis: createContext, useState, createElement', async ({ page }) => {
        await page.goto('/');
        const apis = await page.evaluate(() => {
            const w = window as any;
            const R = w.React || {};
            return {
                createContext: typeof R.createContext === 'function',
                useState: typeof R.useState === 'function',
                createElement: typeof R.createElement === 'function',
                version: R.version || null,
            };
        });
        expect(apis.createContext).toBeTruthy();
        expect(apis.useState).toBeTruthy();
        expect(apis.createElement).toBeTruthy();
    });
});
