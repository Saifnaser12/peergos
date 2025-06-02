import { test, expect, type Page } from '@playwright/test';

test.describe('Tax Filing Flow', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    // Set a shorter timeout for navigation
    page.setDefaultTimeout(5000);
    await page.goto('/filing');
  });

  // Helper function to fill initial form
  async function fillInitialForm(page: Page, trn = '123456789012345', period = '2024-Q1') {
    const trnInput = page.getByLabel('Tax Registration Number (TRN)');
    const periodSelect = page.getByLabel('Filing Period');
    
    await Promise.all([
      trnInput.fill(trn),
      periodSelect.selectOption(period)
    ]);
    
    return { trnInput, periodSelect };
  }

  test('completes full filing process', async () => {
    // Step 1: Initial Form
    await fillInitialForm(page);
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 2: Revenue Review - Wait for specific content instead of generic text
    await expect(page.getByTestId('revenue-summary-total')).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 3: Expense Review
    await expect(page.getByTestId('expense-summary-total')).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 4: Summary & Declaration
    const declarationCheckbox = page.getByLabel('I declare that the information provided is true and accurate');
    await declarationCheckbox.check();

    // Submit and verify - use Promise.all to wait for both actions
    await Promise.all([
      page.waitForResponse(response => response.url().includes('/api/filing') && response.status() === 200),
      page.getByRole('button', { name: 'Submit Filing' }).click()
    ]);

    await expect(page.getByTestId('success-message')).toBeVisible();
  });

  test('validates form fields', async () => {
    // Click next without filling anything
    await page.getByRole('button', { name: 'Next' }).click();

    // Wait for all validation messages simultaneously
    await Promise.all([
      expect(page.getByText('Filing Period is required')).toBeVisible(),
      expect(page.getByText('TRN is required')).toBeVisible()
    ]);

    // Test invalid TRN
    await fillInitialForm(page, '12345', '');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('TRN must be exactly 15 digits')).toBeVisible();
  });

  test('saves and loads draft', async () => {
    // Fill form and save draft
    const { trnInput, periodSelect } = await fillInitialForm(page);
    
    // Save draft and verify - use Promise.all for efficiency
    await Promise.all([
      page.waitForResponse(response => response.url().includes('/api/draft') && response.status() === 200),
      page.getByRole('button', { name: 'Save Draft' }).click(),
      expect(page.getByTestId('draft-saved-message')).toBeVisible()
    ]);

    // Reload and verify persistence
    await page.reload();
    
    // Verify all values simultaneously
    await Promise.all([
      expect(periodSelect).toHaveValue('2024-Q1'),
      expect(trnInput).toHaveValue('123456789012345')
    ]);
  });
}); 