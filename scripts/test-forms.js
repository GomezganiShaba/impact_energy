const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('=== TESTING HOMEPAGE CTA FORM ===');
  await page.goto('http://localhost:3000/', { timeout: 60000 });
  await page.waitForLoadState('domcontentloaded');

  const ctaBtn = page.getByRole('button', { name: /request a callback/i });
  console.log('CTA button visible:', await ctaBtn.isVisible());
  console.log('CTA button enabled:', await ctaBtn.isEnabled());

  // Click while empty
  await ctaBtn.click();
  await page.waitForTimeout(500);
  let ctaErrors = await page.locator('.text-gold-hi').allTextContents();
  console.log('CTA errors when empty:', ctaErrors);

  // Fill CTA form
  await page.fill('input#cta-name', 'Steve Banda');
  await page.fill('input#cta-phone', '0881682589');
  console.log('Filled name & phone, clicking CTA button...');
  await ctaBtn.click();
  
  // Check if button changed to loading
  const loadingVisible = await page.getByText(/Sending your request/i).isVisible().catch(() => false);
  console.log('Loading state visible immediately after click:', loadingVisible);

  // Wait for success message to appear (up to 30s)
  await page.waitForSelector('text=Request Sent!', { timeout: 30000 });
  const ctaSuccess = await page.getByText('Request Sent!').isVisible();
  console.log('CTA Success visible:', ctaSuccess);

  console.log('\n=== TESTING QUOTE PAGE FORM ===');
  await page.goto('http://localhost:3000/quote', { timeout: 60000 });
  await page.waitForLoadState('domcontentloaded');

  const quoteBtn = page.getByRole('button', { name: /submit request/i });
  console.log('Quote button visible:', await quoteBtn.isVisible());
  console.log('Quote button enabled:', await quoteBtn.isEnabled());

  // Click while empty
  await quoteBtn.click();
  await page.waitForTimeout(500);
  let quoteErrors = await page.locator('[role="alert"]').allTextContents();
  console.log('Quote errors when empty:', quoteErrors);

  // Fill quote form
  await page.fill('input#name', 'Steve Banda');
  await page.fill('input#phone', '0881682589');
  await page.check('input#consent');
  console.log('Filled name, phone, consent. Clicking Quote button...');
  await quoteBtn.click();

  // Check if button changed to loading
  const quoteLoading = await page.getByText(/Submitting your request/i).isVisible().catch(() => false);
  console.log('Quote loading state visible immediately after click:', quoteLoading);

  await page.waitForTimeout(4000);
  quoteErrors = await page.locator('[role="alert"]').allTextContents();
  console.log('Quote errors after fill:', quoteErrors);
  const quoteSuccess = await page.getByText('Request Sent!').isVisible();
  console.log('Quote Success visible:', quoteSuccess);

  await browser.close();
})().catch(console.error);
