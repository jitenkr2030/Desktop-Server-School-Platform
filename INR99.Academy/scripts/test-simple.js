const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('Console Error:', msg.text());
  });
  
  // Login first
  console.log('1. Logging in...');
  await page.goto('http://localhost:3000/auth/login');
  await page.fill('input[type="email"]', 'student1@inr99.com');
  await page.fill('input[type="password"]', 'demo123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**', { timeout: 10000 });
  
  // Wait for dashboard to load
  console.log('2. Dashboard loaded, checking tabs...');
  await page.waitForTimeout(2000);
  
  // Check for tabs
  const tabButtons = page.locator('button');
  const count = await tabButtons.count();
  console.log('3. Total buttons found:', count);
  
  // Click each tab
  const tabs = ['📊 My Dashboard', '👤 My Profile', '📚 My Courses', '🎓 Certificates'];
  for (const tabName of tabs) {
    const tab = page.locator('button', { hasText: tabName });
    if (await tab.count() > 0) {
      console.log(`4. Clicking ${tabName}...`);
      await tab.click();
      await page.waitForTimeout(500);
      console.log(`   ✓ ${tabName} clicked successfully`);
    } else {
      console.log(`   ✗ ${tabName} NOT FOUND`);
    }
  }
  
  console.log('\n=== RESULT ===');
  console.log('Errors:', errors.length === 0 ? 'None' : errors.join(', '));
  
  await browser.close();
})();
