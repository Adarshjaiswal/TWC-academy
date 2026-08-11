import { expect, test } from "@playwright/test";

test("visitor can browse packages and open FAQ", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "TWC Academy", exact: true })).toBeVisible();
  await page.getByRole("link", { name: /Enroll Today/i }).first().click();
  await expect(page.getByRole("heading", { name: /Compare TWC Academy programs/i })).toBeVisible();
  await page.goto("/faq");
  await page.getByRole("button", { name: /Is TWC a broker/i }).click();
  await expect(page.getByText(/not a broker/i)).toBeVisible();
});

test("normal visitor is redirected away from admin", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/sign-in/);
});
