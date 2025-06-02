# Test info

- Name: Tax Filing Flow >> saves and loads draft
- Location: /Users/saif/Desktop/peergos/e2e/filing.spec.ts:68:7

# Error details

```
TimeoutError: locator.fill: Timeout 5000ms exceeded.
Call log:
  - waiting for getByLabel('Tax Registration Number (TRN)')

    at fillInitialForm (/Users/saif/Desktop/peergos/e2e/filing.spec.ts:19:16)
    at /Users/saif/Desktop/peergos/e2e/filing.spec.ts:70:46
```

# Page snapshot

```yaml
- text: "[plugin:vite:react-babel] /Users/saif/Desktop/peergos/src/pages/Filing.tsx: Identifier 'state' has already been declared. (92:9) 95 | trn: '', /Users/saif/Desktop/peergos/src/pages/Filing.tsx:92:9 90 | const { t } = useTranslation(); 91 | 92 | const [state, setState] = useState<FilingState>({ | ^ 93 | step: 1, 94 | period: '', at constructor (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:363:19) at TypeScriptParserMixin.raise (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:6609:19) at TypeScriptScopeHandler.checkRedeclarationInScope (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:1626:19) at TypeScriptScopeHandler.declareName (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:1592:12) at TypeScriptScopeHandler.declareName (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:4892:11) at TypeScriptParserMixin.declareNameFromIdentifier (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:7538:16) at TypeScriptParserMixin.checkIdentifier (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:7534:12) at TypeScriptParserMixin.checkLVal (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:7475:12) at TypeScriptParserMixin.checkLVal (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:7511:16) at TypeScriptParserMixin.parseVarId (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:13300:10) at TypeScriptParserMixin.parseVarId (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:9693:11) at TypeScriptParserMixin.parseVar (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:13275:12) at TypeScriptParserMixin.parseVarStatement (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:13122:10) at TypeScriptParserMixin.parseVarStatement (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:9423:31) at TypeScriptParserMixin.parseStatementContent (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:12743:23) at TypeScriptParserMixin.parseStatementContent (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:9453:18) at TypeScriptParserMixin.parseStatementLike (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:12658:17) at TypeScriptParserMixin.parseStatementListItem (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:12638:17) at TypeScriptParserMixin.parseBlockOrModuleBlockBody (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:13208:61) at TypeScriptParserMixin.parseBlockBody (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:13201:10) at TypeScriptParserMixin.parseBlock (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:13189:10) at TypeScriptParserMixin.parseFunctionBody (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:12019:24) at TypeScriptParserMixin.parseArrowExpression (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:11994:10) at TypeScriptParserMixin.parseParenAndDistinguishExpression (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:11604:12) at TypeScriptParserMixin.parseExprAtom (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:11246:23) at TypeScriptParserMixin.parseExprAtom (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:4776:20) at TypeScriptParserMixin.parseExprSubscripts (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:10996:23) at TypeScriptParserMixin.parseUpdate (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:10981:21) at TypeScriptParserMixin.parseMaybeUnary (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:10961:23) at TypeScriptParserMixin.parseMaybeUnary (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:9778:18) at TypeScriptParserMixin.parseMaybeUnaryOrPrivate (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:10814:61) at TypeScriptParserMixin.parseExprOps (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:10819:23) at TypeScriptParserMixin.parseMaybeConditional (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:10796:23) at TypeScriptParserMixin.parseMaybeAssign (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:10749:21) at TypeScriptParserMixin.parseMaybeAssign (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:9727:20) at /Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:10718:39 at TypeScriptParserMixin.allowInAnd (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:12340:16) at TypeScriptParserMixin.parseMaybeAssignAllowIn (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:10718:17) at TypeScriptParserMixin.parseVar (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:13276:91) at TypeScriptParserMixin.parseVarStatement (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:13122:10) at TypeScriptParserMixin.parseVarStatement (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:9423:31) at TypeScriptParserMixin.parseStatementContent (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:12743:23) at TypeScriptParserMixin.parseStatementContent (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:9453:18) at TypeScriptParserMixin.parseStatementLike (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:12658:17) at TypeScriptParserMixin.parseModuleItem (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:12635:17) at TypeScriptParserMixin.parseBlockOrModuleBlockBody (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:13208:36) at TypeScriptParserMixin.parseBlockBody (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:13201:10) at TypeScriptParserMixin.parseProgram (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:12525:10) at TypeScriptParserMixin.parseTopLevel (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:12515:25) at TypeScriptParserMixin.parse (/Users/saif/Desktop/peergos/node_modules/@babel/parser/lib/index.js:14381:10 Click outside, press Esc key, or fix the code to dismiss. You can also disable this overlay by setting"
- code: server.hmr.overlay
- text: to
- code: "false"
- text: in
- code: vite.config.ts
- text: .
```

# Test source

```ts
   1 | import { test, expect, type Page } from '@playwright/test';
   2 |
   3 | test.describe('Tax Filing Flow', () => {
   4 |   let page: Page;
   5 |
   6 |   test.beforeEach(async ({ page: testPage }) => {
   7 |     page = testPage;
   8 |     // Set a shorter timeout for navigation
   9 |     page.setDefaultTimeout(5000);
  10 |     await page.goto('/filing');
  11 |   });
  12 |
  13 |   // Helper function to fill initial form
  14 |   async function fillInitialForm(page: Page, trn = '123456789012345', period = '2024-Q1') {
  15 |     const trnInput = page.getByLabel('Tax Registration Number (TRN)');
  16 |     const periodSelect = page.getByLabel('Filing Period');
  17 |     
  18 |     await Promise.all([
> 19 |       trnInput.fill(trn),
     |                ^ TimeoutError: locator.fill: Timeout 5000ms exceeded.
  20 |       periodSelect.selectOption(period)
  21 |     ]);
  22 |     
  23 |     return { trnInput, periodSelect };
  24 |   }
  25 |
  26 |   test('completes full filing process', async () => {
  27 |     // Step 1: Initial Form
  28 |     await fillInitialForm(page);
  29 |     await page.getByRole('button', { name: 'Next' }).click();
  30 |
  31 |     // Step 2: Revenue Review - Wait for specific content instead of generic text
  32 |     await expect(page.getByTestId('revenue-summary-total')).toBeVisible();
  33 |     await page.getByRole('button', { name: 'Next' }).click();
  34 |
  35 |     // Step 3: Expense Review
  36 |     await expect(page.getByTestId('expense-summary-total')).toBeVisible();
  37 |     await page.getByRole('button', { name: 'Next' }).click();
  38 |
  39 |     // Step 4: Summary & Declaration
  40 |     const declarationCheckbox = page.getByLabel('I declare that the information provided is true and accurate');
  41 |     await declarationCheckbox.check();
  42 |
  43 |     // Submit and verify - use Promise.all to wait for both actions
  44 |     await Promise.all([
  45 |       page.waitForResponse(response => response.url().includes('/api/filing') && response.status() === 200),
  46 |       page.getByRole('button', { name: 'Submit Filing' }).click()
  47 |     ]);
  48 |
  49 |     await expect(page.getByTestId('success-message')).toBeVisible();
  50 |   });
  51 |
  52 |   test('validates form fields', async () => {
  53 |     // Click next without filling anything
  54 |     await page.getByRole('button', { name: 'Next' }).click();
  55 |
  56 |     // Wait for all validation messages simultaneously
  57 |     await Promise.all([
  58 |       expect(page.getByText('Filing Period is required')).toBeVisible(),
  59 |       expect(page.getByText('TRN is required')).toBeVisible()
  60 |     ]);
  61 |
  62 |     // Test invalid TRN
  63 |     await fillInitialForm(page, '12345', '');
  64 |     await page.getByRole('button', { name: 'Next' }).click();
  65 |     await expect(page.getByText('TRN must be exactly 15 digits')).toBeVisible();
  66 |   });
  67 |
  68 |   test('saves and loads draft', async () => {
  69 |     // Fill form and save draft
  70 |     const { trnInput, periodSelect } = await fillInitialForm(page);
  71 |     
  72 |     // Save draft and verify - use Promise.all for efficiency
  73 |     await Promise.all([
  74 |       page.waitForResponse(response => response.url().includes('/api/draft') && response.status() === 200),
  75 |       page.getByRole('button', { name: 'Save Draft' }).click(),
  76 |       expect(page.getByTestId('draft-saved-message')).toBeVisible()
  77 |     ]);
  78 |
  79 |     // Reload and verify persistence
  80 |     await page.reload();
  81 |     
  82 |     // Verify all values simultaneously
  83 |     await Promise.all([
  84 |       expect(periodSelect).toHaveValue('2024-Q1'),
  85 |       expect(trnInput).toHaveValue('123456789012345')
  86 |     ]);
  87 |   });
  88 | }); 
```