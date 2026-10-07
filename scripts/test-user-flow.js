const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  page.on('request', req => {
    if (req.url().includes('/api/inquiries')) {
      console.log('NETWORK REQ:', req.method(), req.url(), req.postData());
    }
  });
  page.on('response', async res => {
    if (res.url().includes('/api/inquiries')) {
      console.log('NETWORK RES:', res.status(), await res.text());
    }
  });

  console.log('--- 1. Testing /quote page ---');
  await page.goto('http://localhost:3000/quote');
  await page.waitForLoadState('domcontentloaded');

  console.log('Filling Quote form:');
  await page.fill('input#name', 'Gomezgani Shaba');
  await page.fill('input#phone', '0881682589');
  await page.fill('input#email', 'user@example.com');
  // Check scroll before click
  console.log('ScrollY before submit:', await page.evaluate(() => window.scrollY));

  // What happens if consent is NOT checked?
  console.log('Clicking Submit without checking consent...');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  console.log('ScrollY after submit without consent:', await page.evaluate(() => window.scrollY));
  let errorElements = await page.locator('[role="alert"]').allTextContents();
  console.log('Errors shown:', errorElements);

  // Now check consent
  console.log('Checking consent checkbox and clicking Submit...');
  await page.check('input#consent');
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(4000);
  console.log('ScrollY after valid submit:', await page.evaluate(() => window.scrollY));
  const successVisible = await page.getByText('Request Sent!').isVisible();
  console.log('Quote Request Sent! visible:', successVisible);

  console.log('\n--- 2. Testing Homepage CTA form ---');
  await page.goto('http://localhost:3000/');
  await page.waitForLoadState('domcontentloaded');

  console.log('Scrolling to CTA form...');
  const ctaSection = page.locator('section:has(#cta-name)');
  await ctaSection.scrollIntoViewIfNeeded();
  console.log('ScrollY before CTA fill:', await page.evaluate(() => window.scrollY));

  await page.fill('input#cta-name', 'Gomezgani Shaba');
  await page.fill('input#cta-phone', '+265 881 682 589');
  console.log('Clicking CTA Request a callback button...');
  await page.click('button:has-text("Request a callback")');

  await page.waitForTimeout(4000);
  console.log('ScrollY after CTA submit:', await page.evaluate(() => window.scrollY));
  const ctaSuccessVisible = await page.getByText('Request Sent!').isVisible();
  console.log('CTA Request Sent! visible:', ctaSuccessVisible);

  await browser.close();
})().catch(console.error);
