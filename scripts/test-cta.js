const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:3000/');
  await page.waitForLoadState('networkidle');

  await page.fill('input#cta-name', 'Steve Banda');
  await page.fill('input#cta-phone', '0881682589');

  const ctaBtn = page.getByRole('button', { name: /request a callback/i });
  console.log('Clicking CTA button...');
  await ctaBtn.click();

  for (let i = 1; i <= 6; i++) {
    await page.waitForTimeout(1000);
    const hasReceived = await page.getByText('Received!').isVisible();
    const hasSending = await page.getByText('Sending...').isVisible();
    const alerts = await page.locator('[role="alert"]').allTextContents();
    console.log(`After ${i}s: Received=${hasReceived}, Sending=${hasSending}, Alerts=${JSON.stringify(alerts)}`);
    if (hasReceived) break;
  }

  await browser.close();
})().catch(console.error);
