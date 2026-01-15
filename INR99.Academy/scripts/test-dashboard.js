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
    // Navigate to the student dashboard
    console.log('Navigating to /dashboard/student...');
    await page.goto('http://localhost:3000/dashboard/student', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for the page to load
    await page.waitForTimeout(2000);
    
    // Check if the page loaded correctly
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check for the presence of key elements
    const tabs = await page.locator('button').count();
    console.log('Number of buttons on page:', tabs);
    
    // Try to find and click on tabs
    const tabButtons = page.locator('button').filter({ hasText: /📊|👤|📚|🎓/ });
    const tabCount = await tabButtons.count();
    console.log('Tab buttons found:', tabCount);
    
    if (tabCount > 0) {
      console.log('Clicking on Profile tab...');
      await tabButtons.filter({ hasText: '👤' }).first().click();
      await page.waitForTimeout(1000);
      
      // Check if content changed
      const profileContent = await page.locator('text=My Profile').count();
      console.log('Profile content visible:', profileContent > 0);
    }
    
    // Report console messages
    console.log('\n--- Console Messages ---');
    consoleMessages.forEach(msg => {
      console.log(`[${msg.type}] ${msg.text}`);
    });
    
    // Report errors
    console.log('\n--- Page Errors ---');
    if (errors.length === 0) {
      console.log('No JavaScript errors detected!');
    } else {
      errors.forEach(err => console.log('ERROR:', err));
    }
    
  } catch (e) {
    console.error('Test failed:', e.message);
  } finally {
    await browser.close();
  }
})();
