const { chromium } = require('playwright');

(async () => {
  const url = process.env.TEST_URL || 'http://localhost:8080/editor?funnel=quiz21StepsComplete&template=quiz21StepsComplete';
  console.log('DEBUG: navigating to', url);
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  const hasCanvas = await page.$('[data-testid="canvas-column"], .canvas-column');
  console.log('Has canvas selector?', !!hasCanvas);

  const bodyHTML = await page.evaluate(() => document.querySelector('#root')?.innerHTML || document.body.innerHTML);
  console.log('ROOT HTML SNIPPET:\n', bodyHTML.substring(0, 2000));

  await browser.close();
})();
