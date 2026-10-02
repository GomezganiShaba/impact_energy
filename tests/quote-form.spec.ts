import { test, expect } from "@playwright/test";

test.describe("Quote Form and Inquiry Submission", () => {
  test("loads quote page and validates required fields", async ({ page }) => {
    await page.goto("/quote");

    // Verify main elements exist
    await expect(page.getByRole("heading", { name: /Get a free site quote/i })).toBeVisible();

    // Fill form fields
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="phone"]', "+265881682589");
    await page.fill('input[name="email"]', "test@example.com");
    await page.selectOption('select[name="service"]', "standalone-hybrid-solar");
    await page.selectOption('select[name="locationArea"]', "Area 23");
    await page.selectOption('select[name="propertyType"]', "Home");
    await page.check('input[name="consent"]');

    // Mock API response
    await page.route("**/api/inquiries", async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, id: "mock-inquiry-123" }),
      });
    });

    // Wait 3.5 seconds to pass anti-spam minimum submission time check
    await page.waitForTimeout(3500);

    // Submit
    await page.click('button[type="submit"]');

    // Verify success message
    await expect(page.getByText(/Thank you/i)).toBeVisible({ timeout: 10000 });
  });

  test("loads homepage and navigates to quote page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Impact Energy Solution/i);
    const quoteBtn = page.getByRole("link", { name: /Get a quote/i }).first();
    await quoteBtn.click();
    await expect(page).toHaveURL(/.*quote/);
  });
});
