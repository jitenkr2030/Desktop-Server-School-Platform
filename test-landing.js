const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors = [];
  
  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', err => {
    errors.push(`Page Error: ${err.message}`);
  });
  
  try {
    console.log('Navigating to landing page...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 60000 });
    
    console.log('Page loaded, checking for content...');
    
    // Check for Seven Learning Paths heading
    const sevenPathsHeading = await page.locator('text=Seven Learning Paths').first();
    if (await sevenPathsHeading.isVisible()) {
      console.log('✓ Seven Learning Paths heading found');
    } else {
      errors.push('Seven Learning Paths heading not found');
    }
    
    // Check for Citizen & Law path
    const citizenLawPath = await page.locator('text=Citizen & Law').first();
    if (await citizenLawPath.isVisible()) {
      console.log('✓ Citizen & Law path found');
    } else {
      errors.push('Citizen & Law path not found');
    }
    
    // Check for Flagship ₹99 Courses section
    const flagshipSection = await page.locator('text=Flagship ₹99 Courses').first();
    if (await flagshipSection.isVisible()) {
      console.log('✓ Flagship ₹99 Courses section found');
    } else {
      errors.push('Flagship ₹99 Courses section not found');
    }
    
    // Check for individual courses
    const courses = [
      'English Speaking',
      'Public Speaking',
      'Indian Constitution',
      'Citizen Law'
    ];
    
    for (const course of courses) {
      const courseElement = await page.locator(`text=${course}`).first();
      if (await courseElement.isVisible()) {
        console.log(`✓ ${course} course found`);
      } else {
        errors.push(`${course} course not found`);
      }
    }
    
    // Check for ₹99 price tags
    const priceTags = await page.locator('text=₹99').count();
    console.log(`✓ Found ${priceTags} price tags with ₹99`);
    
    console.log('\n--- Test Results ---');
    if (errors.length === 0) {
      console.log('✓ All tests passed! No errors detected.');
    } else {
      console.log('✗ Errors detected:');
      errors.forEach(err => console.log(`  - ${err}`));
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
    errors.push(error.message);
  } finally {
    await browser.close();
    
    // Exit with error code if there were errors
    process.exit(errors.length > 0 ? 1 : 0);
  }
})();
