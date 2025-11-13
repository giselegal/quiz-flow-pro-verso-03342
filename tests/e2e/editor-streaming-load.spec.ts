import { test, expect } from '@playwright/test'

test.describe('Editor streaming loads all steps', () => {
  test('loads 21 steps progressively with progress bar', async ({ page }) => {
    await page.goto('/editor?resource=quiz21StepsComplete')

    const progressBar = page.locator('div.fixed.top-0.left-0 >> div.bg-primary')
    await progressBar.waitFor({ state: 'visible' })

    await expect(async () => {
      const stats = await page.evaluate(() => (window as any).__UNIFIED_EDITOR_STATS__)
      expect(stats?.stepsCount || 0).toBeGreaterThanOrEqual(21)
    }).toPass({ intervals: [500, 1000, 1500], timeout: 10000 })

    const width = await progressBar.evaluate((el: HTMLElement) => el.style.width)
    expect(width).toMatch(/100%/) // finalizado
  })
})

