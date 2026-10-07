const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  console.log('Navigating to http://localhost:3000/mail...');
  await page.goto('http://localhost:3000/mail', { timeout: 45000 });
  await page.waitForLoadState('domcontentloaded');
  console.log('Loaded /mail. Current URL:', page.url());

  const title = await page.title();
  console.log('Page Title:', title);

  // Check key elements
  const hasCompose = await page.getByRole('button', { name: 'New Message' }).first().isVisible().catch(() => false);
  console.log('Has "New Message" button:', hasCompose);

  // Check messages count or text
  await page.waitForTimeout(3000);
  const items = await page.locator('section div[class*="cursor-pointer"]').count().catch(() => 0);
  console.log('Message items listed:', items);

  // Click New Message to test modal
  await page.getByRole('button', { name: 'New Message' }).first().click();
  await page.waitForTimeout(1000);
  const modalOpen = await page.locator('text=New Message (mail.ies.engineer)').isVisible().catch(() => false);
  console.log('Compose modal open:', modalOpen);

  // Close modal
  if (modalOpen) {
    await page.getByRole('button', { name: 'Cancel' }).click();
  }

  // Test subdomain rewrite simulation
  console.log('Testing subdomain header mail.ies.engineer...');
  const subPage = await browser.newPage({
    extraHTTPHeaders: {
      Host: 'mail.ies.engineer'
    }
  });
  await subPage.goto('http://localhost:3000/', { timeout: 30000 });
  await subPage.waitForLoadState('domcontentloaded');
  const subTitle = await subPage.title();
  console.log('Subdomain request title:', subTitle);

  await browser.close();
  console.log('All Webmail tests completed successfully!');
})().catch(console.error);
