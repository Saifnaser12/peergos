
# 🧪 Peergos UAE Compliance Engine - QA Checklist

## Pre-Launch Validation Checklist

### 🔐 Role-Based Access Control
- [ ] **CIT Page Access Control**
  - [ ] Admin role can access CIT page
  - [ ] Accountant role can access CIT page  
  - [ ] Assistant role cannot access CIT page
  - [ ] Viewer role cannot access CIT page
  - [ ] Unauthorized users redirected to `/unauthorized`

- [ ] **VAT Page Access Control**
  - [ ] Admin role can access VAT page
  - [ ] Accountant role can access VAT page
  - [ ] Assistant role cannot access VAT page
  - [ ] Viewer role cannot access VAT page
  - [ ] Unauthorized users redirected to `/unauthorized`

- [ ] **Financials Page Access Control**
  - [ ] Admin role can access Financials page
  - [ ] Accountant role can access Financials page
  - [ ] Assistant role can access Financials page (read-only)
  - [ ] Viewer role can access Financials page (read-only)

- [ ] **Transfer Pricing Access Control**
  - [ ] All roles (admin, accountant, assistant, viewer) can access Transfer Pricing
  - [ ] Proper permission-based UI restrictions applied

### 📊 Dashboard Integration
- [ ] **Dashboard-Accounting Sync**
  - [ ] Adding revenue in Accounting updates Dashboard revenue card
  - [ ] Adding expenses in Accounting updates Dashboard expenses card
  - [ ] Net income calculation updates automatically
  - [ ] Tax due calculations reflect current data

- [ ] **Dashboard Cards Current Values**
  - [ ] Total Revenue shows current year-to-date sum
  - [ ] Total Expenses shows current year-to-date sum
  - [ ] Net Income calculates correctly (Revenue - Expenses)
  - [ ] Tax Due shows accurate CIT + VAT calculations
  - [ ] All currency formats display as AED with proper formatting

### 🎨 Theme & UI Validation
- [ ] **Dark/Light Mode Toggle**
  - [ ] Theme toggle button visible in navbar
  - [ ] Dark mode applies to all pages consistently
  - [ ] Light mode applies to all pages consistently
  - [ ] Theme preference persists across sessions
  - [ ] All text remains readable in both modes
  - [ ] Button colors adapt properly in both themes

### 🏷️ Translation & Labels
- [ ] **No Placeholder Labels**
  - [ ] No "Title" or "Subtitle" placeholder text visible
  - [ ] All navigation menu items have proper labels
  - [ ] All button labels are translated
  - [ ] All form field labels are translated
  - [ ] All error messages are translated

- [ ] **Arabic Translation Fallback**
  - [ ] Switch to Arabic language works
  - [ ] Missing Arabic translations fall back to English
  - [ ] RTL layout applies correctly for Arabic
  - [ ] Arabic text displays properly without breaking UI
  - [ ] Language toggle switches between EN/AR smoothly

### 📤 Export Functionality
- [ ] **PDF Export**
  - [ ] Financials PDF export generates successfully
  - [ ] VAT PDF export generates successfully
  - [ ] CIT PDF export generates successfully
  - [ ] PDF files download with correct naming
  - [ ] PDF content includes all required data

- [ ] **Excel Export**
  - [ ] Financials Excel export generates successfully
  - [ ] VAT Excel export generates successfully
  - [ ] Excel files download with correct naming
  - [ ] Excel data includes all columns and rows

- [ ] **XML Export (E-invoicing)**
  - [ ] XML invoice generation works
  - [ ] XML format complies with UAE Phase 2 requirements
  - [ ] XML files download with correct naming
  - [ ] XML validation passes FTA standards

### 🎭 Simulation Mode
- [ ] **Simulation Mode Visibility**
  - [ ] "Simulation Mode - Demo Only" banner visible on FTA integration
  - [ ] Simulation tooltip shows "Simulation only – not connected to FTA"
  - [ ] All submission buttons are disabled in simulation mode
  - [ ] Mock data displays correctly in simulation mode

- [ ] **Submission Prevention**
  - [ ] VAT submission blocked in simulation mode
  - [ ] CIT submission blocked in simulation mode
  - [ ] FTA integration shows as disconnected
  - [ ] Warning messages display for submission attempts

### 🔍 TRN Lookup Functionality
- [ ] **TRN Lookup Field**
  - [ ] TRN input field accepts 15-digit format
  - [ ] TRN validation shows error for invalid format
  - [ ] TRN lookup returns mock company data
  - [ ] TRN field clears and resets properly
  - [ ] Error handling for invalid TRN numbers

### 📱 Responsive Design
- [ ] **Mobile Compatibility**
  - [ ] All pages render correctly on mobile devices
  - [ ] Navigation menu works on mobile
  - [ ] Forms are usable on mobile screens
  - [ ] Export buttons function on mobile

- [ ] **Cross-Browser Testing**
  - [ ] Chrome compatibility verified
  - [ ] Firefox compatibility verified
  - [ ] Safari compatibility verified
  - [ ] Edge compatibility verified

### 🚨 Error Handling
- [ ] **Error States**
  - [ ] 404 pages display properly
  - [ ] Unauthorized access shows proper error page
  - [ ] Network errors display user-friendly messages
  - [ ] Form validation errors are clear and helpful

### 📋 Final Pre-Launch Checks
- [ ] All console errors resolved
- [ ] No broken links or navigation issues
- [ ] All images and assets load properly
- [ ] Performance is acceptable (< 3s load time)
- [ ] All critical user flows tested end-to-end

---

## Sign-off

**QA Tester:** _________________ **Date:** _________

**Technical Lead:** _________________ **Date:** _________

**Project Manager:** _________________ **Date:** _________

---

**Notes:**
- [ ] All critical issues resolved
- [ ] All medium priority issues documented
- [ ] Launch approved
