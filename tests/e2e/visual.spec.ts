import { expect, test } from "@playwright/test";

const viewports = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 }
];

const pages = ["/", "/packages", "/contact", "/faq", "/preview", "/sign-in"];

test.describe("visual QA matrix", () => {
  for (const viewport of viewports) {
    for (const route of pages) {
      test(`${route} has no horizontal overflow at ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
        if (route === "/") {
          testInfo.setTimeout(120_000);
        }

        await page.setViewportSize(viewport);
        await page.addInitScript(() => {
          localStorage.setItem("twc-cookie-consent", "saved");
        });
        await page.goto(route);
        await expect(page.locator("body")).toBeVisible();

        const overflow = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        }));

        expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
        await page.screenshot({
          fullPage: true,
          path: testInfo.outputPath(`${route.replace(/\W+/g, "_")}-${viewport.width}x${viewport.height}.png`)
        });
      });
    }
  }
});
