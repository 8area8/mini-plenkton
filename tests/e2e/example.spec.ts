import { test, expect, Page } from '@playwright/test';

test.describe('Home page', () => {
  test('Should diplay the Header.', async ({ page }) => {
    await page.goto("/")
    await page.waitForNavigation()
    await page.waitForSelector("text=Plenkton")
  });
})
