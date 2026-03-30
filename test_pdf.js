const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err));

  await page.goto('http://localhost:3000');

  // Click on "2. PRÉVIA DO RELATÓRIO"
  await page.click('text="2. PRÉVIA DO RELATÓRIO"');

  // Wait a few seconds for the PDF to attempt rendering
  await page.waitForTimeout(5000);

  await browser.close();
})();
