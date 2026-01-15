const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleMessages = [];
  const errors = [];
  
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  try {
    console.log('Step 1: Navigating to login page...');
    await page.goto('http://localhost:3000/auth/login', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    
    console.log('Step 2: Filling login form...');
    // Fill in the email
    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.count() > 0) {
      await emailInput.fill('student1@inr99.com');
    }
    
    // Fill in the password
    const passwordInput = page.locator('input[type="password"]');
    if (await passwordInput.count() > 0) {
      await passwordInput.fill('demo123');
    }
    
    // Click login button
    const loginButton = page.locator('button[type="submit"]');
    if (await loginButton.count() > 0) {
      await loginButton.click();
      console.log('Step 3: Clicked login button, waiting for redirect...');
      await page.waitForTimeout(3000);
    }
    
    // Check current URL
    const currentUrl = page.url();
    console.log('Current URL after login:', currentUrl);
    
    // Navigate to dashboard
    console.log('Step 4: Navigating to dashboard...');
    await page.goto('http://localhost:3000/dashboard/student', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    // Check current URL
    console.log('URL after dashboard navigation:', page.url());
    
    // Check for dashboard elements
    const welcomeText = await page.locator('text=Welcome back').count();
    console.log('Welcome message visible:', welcomeText > 0);
    
    // Count all interactive elements
    const allButtons = await page.locator('button').count();
    console.log('Total buttons on page:', allButtons);
    
    // Look for tabs specifically
    const tabsContainer = page.locator('text=📊 My Dashboard');
    const dashboardTabCount = await tabsContainer.count();
    console.log('Dashboard tab found:', dashboardTabCount > 0);
    
    // Try clicking on different tabs
    const profileTab = page.locator('button', { hasText: '👤 My Profile' });
    if (await profileTab.count() > 0) {
      console.log('Clicking Profile tab...');
      await profileTab.click();
      await page.waitForTimeout(1000);
      
      const profileContent = await page.locator('text=My Profile').count();
      console.log('Profile content visible after click:', profileContent > 0);
    }
    
    // Check for any overlay or modal
    const overlay = page.locator('[style*="z-index"]').count();
    console.log('Elements with z-index:', overlay);
    
    // Report results
    console.log('\n=== RESULTS ===');
    console.log('Console messages:', consoleMessages.length);
    consoleMessages.forEach(msg => {
      if (msg.type === 'error' || msg.type === 'warning') {
        console.log(`  [${msg.type}] ${msg.text}`);
      }
    });
    
    console.log('Page errors:', errors.length);
    errors.forEach(err => console.log(`  ERROR: ${err}`));
    
  } catch (e) {
    console.error('Test failed:', e.message);
  } finally {
    await browser.close();
  }
})();
