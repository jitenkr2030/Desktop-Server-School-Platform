// Test script to verify database connection and API logic
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Database Connection and API Logic...\n');

// Test 1: Check if database file exists
const dbPath = './db/custom.db';
console.log('📁 Test 1: Database File Check');
if (fs.existsSync(dbPath)) {
  console.log(`✅ Database file found at: ${dbPath}`);
  const stats = fs.statSync(dbPath);
  console.log(`   File size: ${stats.size} bytes`);
} else {
  console.log(`❌ Database file not found at: ${dbPath}`);
}

// Test 2: Check .env.local
console.log('\n📋 Test 2: Environment Configuration');
const envPath = './.env.local';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log(`✅ Environment file found`);
  console.log(`   DATABASE_URL: ${envContent.match(/DATABASE_URL="([^"]+)"/)?.[1] || 'Not found'}`);
} else {
  console.log(`❌ Environment file not found at: ${envPath}`);
}

// Test 3: Check package.json for Next.js version
console.log('\n📦 Test 3: Package Configuration');
try {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const nextVersion = packageJson.dependencies?.next;
  console.log(`✅ Next.js version: ${nextVersion}`);
} catch (error) {
  console.log(`❌ Error reading package.json: ${error.message}`);
}

// Test 4: Check if Prisma schema exists
console.log('\n🗄️ Test 4: Prisma Schema Check');
const schemaPath = './prisma/schema.prisma';
if (fs.existsSync(schemaPath)) {
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  // Check for learning path categories
  const hasLearningPathCategory = schemaContent.includes('model LearningPathCategory');
  const hasLearningPath = schemaContent.includes('model LearningPath');
  const hasCourse = schemaContent.includes('model Course');
  
  console.log(`✅ Prisma schema found`);
  console.log(`   LearningPathCategory model: ${hasLearningPathCategory ? '✅' : '❌'}`);
  console.log(`   LearningPath model: ${hasLearningPath ? '✅' : '❌'}`);
  console.log(`   Course model: ${hasCourse ? '✅' : '❌'}`);
  
  // Check for categoryId field in LearningPath
  const hasCategoryId = schemaContent.includes('categoryId');
  console.log(`   LearningPath.categoryId field: ${hasCategoryId ? '✅' : '❌'}`);
} else {
  console.log(`❌ Prisma schema not found at: ${schemaPath}`);
}

// Test 5: Check API route files
console.log('\n🔗 Test 5: API Routes Check');
const apiRoutes = [
  './src/app/api/courses/route.ts',
  './src/app/api/learning-path-categories/route.ts',
  './src/app/api/learning-paths/route.ts',
  './src/app/api/stats/route.ts'
];

apiRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    console.log(`✅ ${route} exists`);
  } else {
    console.log(`❌ ${route} missing`);
  }
});

// Test 6: Database content check (using SQLite directly)
console.log('\n🗄️ Test 6: Database Content Verification');
try {
  // Check if sqlite3 is available and run a direct query
  const { execSync } = require('child_process');
  
  console.log('Testing direct database queries...');
  
  // Check learning path categories
  const categoriesQuery = 'SELECT COUNT(*) as count FROM learning_path_categories;';
  const categoriesResult = execSync(`sqlite3 ${dbPath} "${categoriesQuery}"`, { encoding: 'utf8' });
  console.log(`   Learning Path Categories: ${categoriesResult.trim()} records`);
  
  // Check learning paths
  const pathsQuery = 'SELECT COUNT(*) as count FROM learning_paths;';
  const pathsResult = execSync(`sqlite3 ${dbPath} "${pathsQuery}"`, { encoding: 'utf8' });
  console.log(`   Learning Paths: ${pathsResult.trim()} records`);
  
  // Check courses
  const coursesQuery = 'SELECT COUNT(*) as count FROM courses;';
  const coursesResult = execSync(`sqlite3 ${dbPath} "${coursesQuery}"`, { encoding: 'utf8' });
  console.log(`   Courses: ${coursesResult.trim()} records`);
  
  // Check instructors
  const instructorsQuery = 'SELECT COUNT(*) as count FROM instructors;';
  const instructorsResult = execSync(`sqlite3 ${dbPath} "${instructorsQuery}"`, { encoding: 'utf8' });
  console.log(`   Instructors: ${instructorsResult.trim()} records`);
  
  console.log('✅ Direct database queries successful');
  
} catch (error) {
  console.log(`❌ Database query failed: ${error.message}`);
}

console.log('\n🎯 Test Summary:');
console.log('If all tests show ✅, the issue might be:');
console.log('1. Prisma client not properly initialized');
console.log('2. Runtime environment issues');
console.log('3. Next.js server startup problems');
console.log('4. API route execution issues');

console.log('\n💡 Recommended next steps:');
console.log('1. Check if Next.js server starts without errors');
console.log('2. Verify API endpoints respond correctly');
console.log('3. Check browser network tab for API call failures');
console.log('4. Review Next.js logs for any runtime errors');