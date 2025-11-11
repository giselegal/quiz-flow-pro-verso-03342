/**
 * 🎨 E2E Tests: Editor Canvas v3.2 JSON Loading with Screenshots
 * 
 * Tests loading and rendering of v3.2 JSON templates on the /editor canvas
 * Captures screenshots for visual verification of each step
 * 
 * @requirements Phase 5 - E2E tests with loading screenshots of v3.2 JSON steps
 */

import { test, expect, Page } from '@playwright/test';
import path from 'path';

const EDITOR_URL = 'http://localhost:5173/editor';
const SCREENSHOT_DIR = 'test-results/v32-canvas-screenshots';

// Helper to wait for canvas to be fully loaded
async function waitForCanvasReady(page: Page) {
  // Wait for loading indicators to disappear
  await page.waitForSelector('[data-testid="canvas-loading"]', { 
    state: 'detached', 
    timeout: 10000 
  }).catch(() => {
    // Loading indicator might not exist, that's ok
  });
  
  // Wait for canvas to be visible
  await page.waitForSelector('[data-testid="editor-canvas"], .editor-canvas, [role="main"]', {
    state: 'visible',
    timeout: 10000
  });
  
  // Give React time to finish rendering
  await page.waitForTimeout(1000);
}

// Helper to capture canvas screenshot
async function captureCanvasScreenshot(page: Page, stepNumber: number, description: string) {
  const filename = `step-${String(stepNumber).padStart(2, '0')}-${description}.png`;
  const screenshotPath = path.join(SCREENSHOT_DIR, filename);
  
  // Try to find the canvas element
  const canvas = page.locator('[data-testid="editor-canvas"], .editor-canvas, [role="main"]').first();
  
  await canvas.screenshot({ 
    path: screenshotPath,
    timeout: 5000 
  }).catch(async () => {
    // If canvas not found, take full page screenshot
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
  });
  
  console.log(`📸 Screenshot saved: ${filename}`);
  return screenshotPath;
}

test.describe('Editor Canvas - v3.2 JSON Loading Tests', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    
    // Set viewport for consistent screenshots
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Navigate to editor
    await page.goto(EDITOR_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    console.log('✅ Editor loaded');
  });

  test.afterAll(async () => {
    await page.close();
  });

  // ==================== STEP 1: Intro/Hero Step ====================
  test('Step 01 - Load and render intro step with v3.2 JSON', async () => {
    console.log('🧪 Testing Step 01 - Intro');
    
    // Navigate to step 1 if not already there
    await page.goto(`${EDITOR_URL}?step=1`, { waitUntil: 'networkidle' });
    
    // Wait for canvas to load
    await waitForCanvasReady(page);
    
    // Verify v3.2 template elements are present
    // Check for headline block
    const headline = page.locator('h1, [data-block-type="headline"]').first();
    await expect(headline).toBeVisible({ timeout: 5000 });
    
    // Check for text content
    const textBlock = page.locator('[data-block-type="text"], p').first();
    await expect(textBlock).toBeVisible({ timeout: 5000 });
    
    // Capture screenshot
    await captureCanvasScreenshot(page, 1, 'intro-hero');
    
    console.log('✅ Step 01 rendered successfully');
  });

  // ==================== STEP 2-5: Question Steps ====================
  test('Steps 02-05 - Load question steps with v3.2 JSON', async () => {
    for (let step = 2; step <= 5; step++) {
      console.log(`🧪 Testing Step ${String(step).padStart(2, '0')} - Question`);
      
      // Navigate to step
      await page.goto(`${EDITOR_URL}?step=${step}`, { waitUntil: 'networkidle' });
      
      // Wait for canvas
      await waitForCanvasReady(page);
      
      // Check for question elements (options-grid, headline, etc)
      const hasOptionsGrid = await page.locator('[data-block-type="options-grid"], [data-block-type="question"]').count() > 0;
      const hasHeadline = await page.locator('h1, h2, [data-block-type="headline"]').count() > 0;
      
      expect(hasOptionsGrid || hasHeadline).toBeTruthy();
      
      // Capture screenshot
      await captureCanvasScreenshot(page, step, 'question');
      
      console.log(`✅ Step ${String(step).padStart(2, '0')} rendered`);
    }
  });

  // ==================== STEP 10: Mid-point Question ====================
  test('Step 10 - Load mid-point question with v3.2 JSON', async () => {
    console.log('🧪 Testing Step 10 - Mid-point Question');
    
    await page.goto(`${EDITOR_URL}?step=10`, { waitUntil: 'networkidle' });
    await waitForCanvasReady(page);
    
    // Verify question blocks
    const questionBlock = page.locator('[data-block-type="options-grid"], [data-block-type="question"]').first();
    await expect(questionBlock).toBeVisible({ timeout: 5000 });
    
    // Capture screenshot
    await captureCanvasScreenshot(page, 10, 'midpoint-question');
    
    console.log('✅ Step 10 rendered successfully');
  });

  // ==================== STEP 15: Transition/Strategic ====================
  test('Step 15 - Load transition/strategic step with v3.2 JSON', async () => {
    console.log('🧪 Testing Step 15 - Transition');
    
    await page.goto(`${EDITOR_URL}?step=15`, { waitUntil: 'networkidle' });
    await waitForCanvasReady(page);
    
    // Check for transition elements
    const hasContent = await page.locator('[data-block-type], h1, h2, p').count() > 0;
    expect(hasContent).toBeTruthy();
    
    // Capture screenshot
    await captureCanvasScreenshot(page, 15, 'transition');
    
    console.log('✅ Step 15 rendered successfully');
  });

  // ==================== STEP 20: Result Step ====================
  test('Step 20 - Load result step with v3.2 JSON', async () => {
    console.log('🧪 Testing Step 20 - Result');
    
    await page.goto(`${EDITOR_URL}?step=20`, { waitUntil: 'networkidle' });
    await waitForCanvasReady(page);
    
    // Check for result-specific blocks
    const resultBlocks = page.locator('[data-block-type="result"], [data-block-type="headline"], h1, h2');
    await expect(resultBlocks.first()).toBeVisible({ timeout: 5000 });
    
    // Capture screenshot
    await captureCanvasScreenshot(page, 20, 'result');
    
    console.log('✅ Step 20 rendered successfully');
  });

  // ==================== STEP 21: Offer/Final Step ====================
  test('Step 21 - Load offer/final step with v3.2 JSON', async () => {
    console.log('🧪 Testing Step 21 - Offer/Final');
    
    await page.goto(`${EDITOR_URL}?step=21`, { waitUntil: 'networkidle' });
    await waitForCanvasReady(page);
    
    // Check for CTA or button blocks
    const hasButtons = await page.locator('button, [data-block-type="button"], [data-block-type="cta"]').count() > 0;
    expect(hasButtons).toBeTruthy();
    
    // Capture screenshot
    await captureCanvasScreenshot(page, 21, 'offer-final');
    
    console.log('✅ Step 21 rendered successfully');
  });

  // ==================== v3.2 Specific Features ====================
  test('Verify v3.2 dynamic variables are processed', async () => {
    console.log('🧪 Testing v3.2 dynamic variables');
    
    // Go to first step
    await page.goto(`${EDITOR_URL}?step=1`, { waitUntil: 'networkidle' });
    await waitForCanvasReady(page);
    
    // Check that {{theme.*}} variables are not visible as raw text
    const rawThemeVars = await page.locator('text=/\\{\\{theme\\./').count();
    expect(rawThemeVars).toBe(0);
    
    // Check that {{assets.*}} variables are not visible as raw text
    const rawAssetVars = await page.locator('text=/\\{\\{assets\\./').count();
    expect(rawAssetVars).toBe(0);
    
    console.log('✅ v3.2 variables processed correctly');
  });

  test('Verify canvas renders all 21 steps without errors', async () => {
    console.log('🧪 Testing all 21 steps load successfully');
    
    const failedSteps: number[] = [];
    
    for (let step = 1; step <= 21; step++) {
      try {
        await page.goto(`${EDITOR_URL}?step=${step}`, { 
          waitUntil: 'networkidle',
          timeout: 15000 
        });
        
        await waitForCanvasReady(page);
        
        // Check for any error messages
        const hasError = await page.locator('[data-testid="error"], .error, [role="alert"]').count() > 0;
        
        if (hasError) {
          failedSteps.push(step);
          console.error(`❌ Step ${step} has errors`);
        } else {
          console.log(`✅ Step ${String(step).padStart(2, '0')} OK`);
        }
      } catch (error) {
        failedSteps.push(step);
        console.error(`❌ Step ${step} failed to load: ${error}`);
      }
    }
    
    // Assert no steps failed
    expect(failedSteps).toEqual([]);
    
    console.log(`✅ All 21 steps loaded successfully`);
  });

  // ==================== Navigation Testing ====================
  test('Navigate between steps and verify canvas updates', async () => {
    console.log('🧪 Testing step navigation');
    
    // Start at step 1
    await page.goto(`${EDITOR_URL}?step=1`, { waitUntil: 'networkidle' });
    await waitForCanvasReady(page);
    
    // Capture initial state
    const step1Text = await page.locator('h1, h2').first().textContent();
    
    // Navigate to step 5
    await page.goto(`${EDITOR_URL}?step=5`, { waitUntil: 'networkidle' });
    await waitForCanvasReady(page);
    
    const step5Text = await page.locator('h1, h2').first().textContent();
    
    // Content should be different
    expect(step1Text).not.toBe(step5Text);
    
    // Navigate back to step 1
    await page.goto(`${EDITOR_URL}?step=1`, { waitUntil: 'networkidle' });
    await waitForCanvasReady(page);
    
    const step1TextAgain = await page.locator('h1, h2').first().textContent();
    
    // Should show same content as before
    expect(step1Text).toBe(step1TextAgain);
    
    console.log('✅ Navigation working correctly');
  });

  // ==================== Performance Testing ====================
  test('Verify canvas loads within acceptable time', async () => {
    console.log('🧪 Testing load performance');
    
    const startTime = Date.now();
    
    await page.goto(`${EDITOR_URL}?step=1`, { waitUntil: 'networkidle' });
    await waitForCanvasReady(page);
    
    const loadTime = Date.now() - startTime;
    
    console.log(`⏱️ Canvas load time: ${loadTime}ms`);
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    console.log('✅ Performance acceptable');
  });
});

// ==================== Visual Comparison Test ====================
test.describe('Visual Regression - Canvas Screenshots', () => {
  test('Generate baseline screenshots for all steps', async ({ page }) => {
    console.log('📸 Generating baseline screenshots');
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Generate screenshots for key steps
    const keySteps = [1, 5, 10, 15, 20, 21];
    
    for (const step of keySteps) {
      await page.goto(`${EDITOR_URL}?step=${step}`, { waitUntil: 'networkidle' });
      await waitForCanvasReady(page);
      await captureCanvasScreenshot(page, step, 'baseline');
    }
    
    console.log('✅ Baseline screenshots generated');
  });
});
