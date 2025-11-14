import { test, expect } from '@playwright/test'

const base = 'http://localhost:8080'

test.describe('Editor step loading - quiz21StepsComplete', () => {
  test('loads step 1 and then step 2 on demand', async ({ page }) => {
    await page.goto(`${base}/editor?resource=quiz21StepsComplete&step=1`)

    await expect(page.locator('[data-step-id="step-01"]')).toBeVisible({ timeout: 8000 })

    await page.goto(`${base}/editor?resource=quiz21StepsComplete&step=2`)

    await expect(page.locator('[data-step-id="step-02"]')).toBeVisible({ timeout: 8000 })
  })
})

