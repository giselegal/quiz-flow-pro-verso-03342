import { test, expect } from '@playwright/test';

const SELECTORS = [
    '#intro-name-input',
    'input#intro-name-input',
    '[data-testid="intro-name-input"]',
    '#intro-form-input',
    'input#intro-form-input',
    '#name-input',
    'input#name-input',
    '#step-1-fallback-input',
    'input#step-1-fallback-input',
    '#step01-name-input',
    'input#step01-name-input',
    '#name-input-modular',
    'input[name="userName"]',
    'input[name="name"]',
    '[data-name-input]',
    '[data-block-id="intro-form-input"] input',
    '[data-block-type="form-input"] input[name="userName"]',
];

test.describe('🧪 Smoke Step 1 - /quiz', () => {
    test('deve encontrar o campo de nome na etapa 1', async ({ page, baseURL }) => {
        const url = `${baseURL}/quiz`;
        await page.goto(url);

        let found = false;
        for (const sel of SELECTORS) {
            const locator = page.locator(sel);
            if (await locator.first().isVisible().catch(() => false)) {
                found = true;
                break;
            }
            try {
                await locator.first().waitFor({ state: 'visible', timeout: 1500 });
                found = true;
                break;
            } catch { }
        }

        if (!found) {
            // tenta acionar navegação para step 1 via evento custom
            await page.evaluate(() => {
                window.dispatchEvent(new CustomEvent('quiz-navigate-to-step', { detail: { stepId: 1, source: 'smoke-e2e' } }));
            });
            await page.waitForTimeout(800);

            for (const sel of SELECTORS) {
                const locator = page.locator(sel);
                if (await locator.first().isVisible().catch(() => false)) {
                    found = true;
                    break;
                }
                try {
                    await locator.first().waitFor({ state: 'visible', timeout: 1000 });
                    found = true;
                    break;
                } catch { }
            }
        }

        expect(found).toBeTruthy();
    });
});
