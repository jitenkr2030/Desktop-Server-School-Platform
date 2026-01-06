const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📖 Creating lessons for Board Exam Crash Prep...\n');

  const courseId = 'school_exam_prep';
  let order = 1;

  async function createLesson(title, content, duration, orderNum) {
    await prisma.lesson.create({
      data: {
        id: `${courseId}_lesson_${orderNum}`,
        title: title,
        content: content,
        duration: duration,
        order: orderNum,
        courseId: courseId,
        isActive: true,
      }
    });
  }

  async function createAssessment(title, orderNum) {
    await prisma.assessment.create({
      data: {
        id: `${courseId}_assessment_${orderNum}`,
        title: title,
        type: 'QUIZ',
        courseId: courseId,
        isActive: true,
      }
    });
  }

  // ==================== BOARD EXAM STRATEGY ====================
  console.log('📅 Creating Board Exam Strategy lessons...');
  const strategyTopics = [
    { title: '30-Day Board Strategy', content: 'Daily study plan for 30 days before exams', duration: 50 },
    { title: '60-Day Board Strategy', content: 'Extended 60-day preparation plan', duration: 50 },
    { title: '90-Day Board Strategy', content: 'Complete 3-month preparation roadmap', duration: 55 },
    { title: 'Week-by-Week Plan', content: 'Weekly targets and milestones', duration: 45 },
    { title: 'Daily Study Routine', content: 'Optimal daily schedule for exam prep', duration: 40 },
    { title: 'Subject-wise Time Allocation', content: 'How to distribute time across subjects', duration: 45 },
    { title: 'Balancing School and Self-Study', content: 'Managing school homework and self-study', duration: 35 },
    { title: 'Weekend Study Strategy', content: 'Maximizing weekend study sessions', duration: 40 },
  ];

  for (const topic of strategyTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== IMPORTANT QUESTIONS ====================
  console.log('⭐ Creating Important Questions lessons...');
  const importantTopics = [
    { title: 'Math - High Weightage Topics', content: 'Most important math chapters for boards', duration: 60 },
    { title: 'Science - High Weightage Topics', content: 'Key physics, chemistry, biology topics', duration: 60 },
    { title: 'Social Science - High Weightage Topics', content: 'Important history and geography chapters', duration: 55 },
    { title: 'English - High Weightage Topics', content: 'Key chapters and grammar sections', duration: 50 },
    { title: 'Hindi - High Weightage Topics', content: 'Important prose and poetry chapters', duration: 50 },
    { title: 'Previous Year Questions Analysis', content: 'Analyzing CBSE PYQ patterns', duration: 60 },
    { title: 'Repeated Questions Bank', content: 'Questions that appear every year', duration: 55 },
    { title: 'Numerical Problem Practice', content: 'Important numerical problems solved', duration: 60 },
    { title: 'Diagram-based Questions', content: 'Important diagrams to practice', duration: 50 },
    { title: 'Map-based Questions', content: 'Important maps for geography and history', duration: 50 },
  ];

  for (const topic of importantTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== REVISION NOTES ====================
  console.log('📝 Creating Revision Notes lessons...');
  const revisionTopics = [
    { title: 'Quick Math Revision Notes', content: 'Formula sheet and key concepts', duration: 60 },
    { title: 'Physics Formula Sheet', content: 'All important physics formulas', duration: 55 },
    { title: 'Chemistry Equations', content: 'Important chemical equations', duration: 55 },
    { title: 'Biology Diagrams List', content: 'Important biology diagrams to remember', duration: 50 },
    { title: 'History Important Dates', content: 'Key dates and events for history', duration: 50 },
    { title: 'Geography Map Work', content: 'Important maps and their features', duration: 50 },
    { title: 'One-Liner Revision', content: 'Important one-liner questions and answers', duration: 55 },
    { title: 'Chapter-wise Summary', content: 'Quick chapter summaries for all subjects', duration: 60 },
  ];

  for (const topic of revisionTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== SAMPLE PAPERS ====================
  console.log('📄 Creating Sample Papers lessons...');
  const sampleTopics = [
    { title: 'Sample Paper 1 - Full', content: 'Complete practice paper with solutions', duration: 90 },
    { title: 'Sample Paper 2 - Full', content: 'Complete practice paper with solutions', duration: 90 },
    { title: 'Sample Paper 3 - Full', content: 'Complete practice paper with solutions', duration: 90 },
    { title: 'Sample Paper 4 - Full', content: 'Complete practice paper with solutions', duration: 90 },
    { title: 'Sample Paper 5 - Full', content: 'Complete practice paper with solutions', duration: 90 },
    { title: 'CBSE Marking Scheme', content: 'Understanding the marking scheme', duration: 45 },
    { title: 'Answer Key Analysis', content: 'How answers are evaluated', duration: 40 },
    { title: 'Time-bound Practice', content: 'Tips for solving papers on time', duration: 35 },
  ];

  for (const topic of sampleTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== TIME MANAGEMENT ====================
  console.log('⏰ Creating Time Management lessons...');
  const timeTopics = [
    { title: 'Time Management in Exams', content: 'How to allocate time per question', duration: 45 },
    { title: 'Section-wise Time Division', content: 'Time allocation for each section', duration: 40 },
    { title: 'First 15 Minutes Strategy', content: 'How to utilize reading time effectively', duration: 35 },
    { title: 'Last 15 Minutes Strategy', content: 'Review and verification strategy', duration: 35 },
    { title: 'Speed Writing Techniques', content: 'Writing fast without losing clarity', duration: 40 },
    { title: 'Question Selection Strategy', content: 'Which questions to attempt first', duration: 35 },
    { title: 'Managing Exam Stress', content: 'Staying calm during exams', duration: 40 },
  ];

  for (const topic of timeTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== DOUBT CLEARING ====================
  console.log('❓ Creating Doubt Clearing lessons...');
  const doubtTopics = [
    { title: 'Common Math Doubts', content: 'Frequently asked math questions clarified', duration: 50 },
    { title: 'Common Science Doubts', content: 'Frequently asked science questions clarified', duration: 50 },
    { title: 'Common SST Doubts', content: 'Frequently asked social science questions', duration: 45 },
    { title: 'Formula Confusion Cleared', content: 'Understanding confusing formulas', duration: 45 },
    { title: 'Concept Clarification', content: 'Difficult concepts simplified', duration: 50 },
    { title: 'Common Mistakes to Avoid', content: 'Errors students make frequently', duration: 45 },
    { title: 'Why This Happens - Physics', content: 'Intuitive physics explanations', duration: 50 },
    { title: 'Why This Happens - Chemistry', content: 'Reasoning for chemical phenomena', duration: 50 },
  ];

  for (const topic of doubtTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== ASSESSMENTS ====================
  console.log('\n📝 Creating assessments...');
  await createAssessment('Full Mock Test 1', 1);
  await createAssessment('Full Mock Test 2', 2);
  await createAssessment('Full Mock Test 3', 3);
  await createAssessment('Chapter-wise Quiz', 4);
  await createAssessment('Board Exam Readiness Test', 5);

  console.log(`\n✅ Completed! Created ${order - 1} lessons and 5 assessments.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
