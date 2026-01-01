// Test script to verify courses fetch
const testCoursesFetch = async () => {
  console.log('Testing courses API...');
  
  try {
    const response = await fetch('http://localhost:3000/api/courses?limit=100');
    const data = await response.json();
    
    console.log('API Response:', JSON.stringify({
      success: data.success,
      coursesCount: data.courses?.length || 0,
      totalCourses: data.pagination?.total || 0
    }, null, 2));
    
    if (data.success && data.courses && data.courses.length > 0) {
      console.log('\n✅ API is working correctly!');
      console.log('Sample course:', data.courses[0].title);
    } else {
      console.log('\n❌ API returned no courses');
    }
  } catch (error) {
    console.error('❌ Fetch failed:', error.message);
  }
};

testCoursesFetch();
