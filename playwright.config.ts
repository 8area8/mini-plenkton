import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

// fix ts error: https://github.com/microsoft/playwright/issues/7121#issuecomment-878795543
import appModulePath from "app-module-path"

appModulePath.addPath(__dirname)

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {

  testDir: './tests/e2e',

  /* Maximum time one test can run for. */
  timeout: 30 * 1000,

  expect: {
    timeout: 5000
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  use: {
    actionTimeout: 0,
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    /* Test against branded browsers. */
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     channel: 'chrome',
    //   },
    // },
  ],
  outputDir: 'test-results/',
  /* Run your local dev server before starting the tests */
  webServer: process.env.CI ? {
    command: 'npm run start',
    port: 3000,
  } : undefined,
};
export default config;
