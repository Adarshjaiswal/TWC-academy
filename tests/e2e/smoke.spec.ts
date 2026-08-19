import { expect, test } from "@playwright/test";

test("visitor can browse packages and open FAQ", async ({ page }) => {
  test.setTimeout(60_000);
  await page.addInitScript(() => {
    localStorage.setItem("twc-cookie-consent", "saved");
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Trade Wave Capital", exact: true })).toBeVisible();
  await expect(page.getByRole("main").getByRole("link", { name: /Enroll Today/i }).first()).toHaveAttribute("href", "/packages");
  await page.goto("/packages", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /Compare TWC Academy programs/i })).toBeVisible();
  await page.goto("/faq", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Is TWC a broker/i }).click();
  await expect(page.getByText(/not a broker/i)).toBeVisible();
});

test("normal visitor is redirected away from admin", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/sign-in/);
});
