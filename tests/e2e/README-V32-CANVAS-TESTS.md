# 🎨 E2E Tests: v3.2 JSON Canvas Loading

## Overview

Comprehensive E2E tests for verifying v3.2 JSON template loading and rendering on the `/editor` canvas, with automatic screenshot capture for visual verification.

---

## 🎯 Test Coverage

### Test Suite: `editor-v32-canvas-loading.spec.ts`

#### Individual Step Tests
- ✅ **Step 01** - Intro/Hero step with v3.2 JSON
- ✅ **Steps 02-05** - Question steps with v3.2 JSON
- ✅ **Step 10** - Mid-point question
- ✅ **Step 15** - Transition/Strategic step
- ✅ **Step 20** - Result step
- ✅ **Step 21** - Offer/Final step

#### Feature Tests
- ✅ **v3.2 Dynamic Variables** - Verify `{{theme.*}}` and `{{assets.*}}` are processed
- ✅ **All 21 Steps** - Verify all steps load without errors
- ✅ **Navigation** - Test step-to-step navigation
- ✅ **Performance** - Verify load times are acceptable
- ✅ **Visual Regression** - Generate baseline screenshots

#### Screenshot Coverage
- 📸 Key steps: 1, 5, 10, 15, 20, 21
- 📸 All steps on error detection
- 📸 Baseline screenshots for visual comparison

---

## 🚀 Running the Tests

### Prerequisites

1. **Install Dependencies**
   ```bash
   npm install
   npx playwright install chromium
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   # Server should be running on http://localhost:5173
   ```

### Run Tests

#### Option 1: Using the Specialized Config (Recommended)

```bash
# Run all v3.2 canvas tests with screenshots
npx playwright test --config=playwright.v32-canvas.config.ts

# Run with UI mode for debugging
npx playwright test --config=playwright.v32-canvas.config.ts --ui

# Run specific test
npx playwright test --config=playwright.v32-canvas.config.ts -g "Step 01"
```

#### Option 2: Using Default Config

```bash
# Run the v3.2 canvas test file
npx playwright test tests/e2e/editor-v32-canvas-loading.spec.ts

# With headed browser (see what's happening)
npx playwright test tests/e2e/editor-v32-canvas-loading.spec.ts --headed

# Debug mode
npx playwright test tests/e2e/editor-v32-canvas-loading.spec.ts --debug
```

### View Results

```bash
# Open HTML report
npx playwright show-report test-results/v32-canvas-html

# Open screenshots folder
open test-results/v32-canvas-screenshots
# or
xdg-open test-results/v32-canvas-screenshots  # Linux
```

---

## 📁 Output Structure

```
test-results/
├── v32-canvas-html/              # HTML test report
├── v32-canvas-screenshots/        # Captured screenshots
│   ├── step-01-intro-hero.png
│   ├── step-02-question.png
│   ├── step-05-question.png
│   ├── step-10-midpoint-question.png
│   ├── step-15-transition.png
│   ├── step-20-result.png
│   ├── step-21-offer-final.png
│   └── step-XX-baseline.png
├── v32-canvas-results.json       # JSON results for CI/CD
└── v32-canvas-junit.xml          # JUnit format for CI/CD
```

---

## 🔍 Test Details

### What Each Test Verifies

#### Step 01 - Intro
- Headline block is visible
- Text block is visible
- Canvas renders without errors
- Screenshot captured

#### Steps 02-05 - Questions
- Options grid or question blocks present
- Headline elements exist
- Multiple steps tested in sequence
- Screenshots for each step

#### Step 10 - Mid-point
- Question block visible
- Mid-funnel content renders correctly

#### Step 15 - Transition
- Transition content loads
- Strategic elements present

#### Step 20 - Result
- Result-specific blocks visible
- Result page layout correct

#### Step 21 - Offer/Final
- CTA/button blocks present
- Final step renders completely

#### v3.2 Features
- **Dynamic Variables**: Ensures `{{theme.*}}` and `{{assets.*}}` are processed, not shown as raw text
- **Error Detection**: Checks for error messages on canvas
- **Load Performance**: Verifies canvas loads within 5 seconds

---

## 🎨 Screenshot Analysis

### Baseline Comparison

Screenshots are saved with descriptive names for easy comparison:

```
step-01-intro-hero.png        ← Initial load
step-01-baseline.png          ← Baseline for comparison
```

### Visual Verification Points

When reviewing screenshots, check for:
1. ✅ All blocks are visible
2. ✅ Proper spacing and layout
3. ✅ No loading spinners visible
4. ✅ Images loaded correctly
5. ✅ Text is readable and styled
6. ✅ No console errors in browser
7. ✅ Theme colors applied (not raw `{{theme.*}}`)
8. ✅ Asset URLs resolved (not raw `{{assets.*}}`)

---

## 🐛 Troubleshooting

### Common Issues

#### Test Timeout
```
Error: Timeout 30000ms exceeded
```
**Solution:** Increase timeout or check if dev server is running
```bash
# Check if server is accessible
curl http://localhost:5173/editor

# Increase timeout in test
await page.goto(url, { timeout: 60000 });
```

#### Canvas Not Found
```
Error: Locator not found
```
**Solution:** Verify canvas has correct data attributes
- Add `data-testid="editor-canvas"` to main canvas element
- Or update selectors in test

#### Screenshots Failed
```
Error: Failed to save screenshot
```
**Solution:** Ensure output directory exists and has write permissions
```bash
mkdir -p test-results/v32-canvas-screenshots
chmod 755 test-results/v32-canvas-screenshots
```

#### Server Not Starting
```
Error: webServer process exited
```
**Solution:** Check if port 5173 is available
```bash
# Kill existing process on port
lsof -ti:5173 | xargs kill -9

# Or use different port
VITE_PORT=3000 npm run dev
```

---

## 📊 CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E v3.2 Canvas Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps chromium
      
      - name: Run v3.2 Canvas Tests
        run: npx playwright test --config=playwright.v32-canvas.config.ts
      
      - name: Upload Screenshots
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: v32-canvas-screenshots
          path: test-results/v32-canvas-screenshots/
          
      - name: Upload HTML Report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: test-results/v32-canvas-html/
```

---

## 🔧 Customization

### Adding More Steps

To test additional steps, add to the test file:

```typescript
test('Step XX - Load custom step', async () => {
  await page.goto(`${EDITOR_URL}?step=XX`, { waitUntil: 'networkidle' });
  await waitForCanvasReady(page);
  
  // Your assertions here
  
  await captureCanvasScreenshot(page, XX, 'custom-description');
});
```

### Custom Selectors

Update selectors if canvas structure changes:

```typescript
// In waitForCanvasReady()
await page.waitForSelector(
  '[data-testid="editor-canvas"], .your-canvas-class', 
  { state: 'visible' }
);
```

### Screenshot Options

Customize screenshot behavior:

```typescript
await canvas.screenshot({ 
  path: screenshotPath,
  fullPage: true,           // Capture entire scrollable area
  animations: 'disabled',   // Disable animations for consistency
  scale: 'device',          // Use device pixel ratio
  timeout: 5000
});
```

---

## 📈 Success Metrics

### Expected Results

- ✅ All 21 steps load successfully (0 failures)
- ✅ Canvas load time < 5 seconds per step
- ✅ Zero raw `{{theme.*}}` or `{{assets.*}}` variables visible
- ✅ Zero error messages on canvas
- ✅ All screenshots captured successfully
- ✅ Visual consistency across steps

### Performance Benchmarks

| Metric | Target | Measured |
|--------|--------|----------|
| Initial Load | < 3s | TBD |
| Step Navigation | < 2s | TBD |
| Canvas Render | < 1s | TBD |
| Screenshot Time | < 500ms | TBD |

---

## 📞 Support

For issues or questions:
1. Check this README first
2. Review test output and screenshots
3. Check Playwright documentation: https://playwright.dev
4. Consult the team

---

## 📝 Change Log

### v1.0.0 - Initial Implementation
- Created comprehensive v3.2 canvas loading tests
- Added screenshot capture for all key steps
- Added dynamic variable verification
- Added performance benchmarks
- Added visual regression baselines

---

**Last Updated:** 2025-11-11  
**Test Suite Version:** 1.0.0  
**Playwright Version:** Check package.json
