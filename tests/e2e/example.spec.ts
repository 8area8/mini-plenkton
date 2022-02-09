import { test, expect, Page } from '@playwright/test';

test.describe('Home page', () => {
  test('Should diplay the Header.', async ({ page }) => {
    await page.goto("/")
    await page.waitForNavigation()
    await page.waitForSelector("text=Plenkton")
  });
})

test.describe('Articles in home', () => {
  test('Should display 4 article images and 4 articles titles.', async ({ page }) => {
    await page.goto("/")
    await page.waitForNavigation()
    const imgs = await page.$$("img")
    expect(imgs).toHaveLength(4)
    const articles = await page.$$("article")
    expect(articles).toHaveLength(4)
  });
})
