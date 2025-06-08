import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './e2e',
  timeout: 10000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 5000,
    navigationTimeout: 5000,
    testIdAttribute: 'data-testid',
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        launchOptions: {
          firefoxUserPrefs: {
            'browser.cache.disk.enable': false,
            'browser.cache.memory.enable': false
          }
        }
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        launchOptions: {
          args: ['--no-startup-window']
        }
      },
    },
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        launchOptions: {
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        launchOptions: {
          args: ['--no-startup-window']
        }
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    port: 5000,
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
};

export default config; 