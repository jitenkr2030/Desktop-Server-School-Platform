const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📖 Creating lessons for Skill Add-ons for School Students...\n');

  const courseId = 'school_skills';
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

  // ==================== ENGLISH SPEAKING ====================
  console.log('🗣️ Creating English Speaking lessons...');
  const speakingTopics = [
    { title: 'Pronunciation Basics', content: 'Correct pronunciation of English sounds', duration: 30 },
    { title: 'Fluency Development', content: 'Speaking without hesitation', duration: 35 },
    { title: 'Vocabulary for Daily Use', content: 'Common English words and phrases', duration: 30 },
    { title: 'Sentence Formation', content: 'Speaking in complete sentences', duration: 30 },
    { title: 'Conversation Practice', content: 'Daily conversation scenarios', duration: 40 },
    { title: 'Public Speaking Intro', content: 'Speaking in front of others', duration: 35 },
    { title: 'Presentation Skills', content: 'School presentation tips', duration: 40 },
    { title: 'Debate Basics', content: 'How to participate in debates', duration: 35 },
    { title: 'Extempore Speaking', content: 'Speaking without preparation', duration: 30 },
    { title: 'Interview Preparation', content: 'School interview tips', duration: 35 },
  ];

  for (const topic of speakingTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== HANDWRITING IMPROVEMENT ====================
  console.log('✏️ Creating Handwriting Improvement lessons...');
  const handwritingTopics = [
    { title: 'Grip and Posture', content: 'Correct holding of pen', duration: 20 },
    { title: 'Letter Formation Basics', content: 'Proper letter shapes', duration: 30 },
    { title: 'Cursive Writing', content: 'Connecting letters smoothly', duration: 35 },
    { title: 'Spacing Between Words', content: 'Proper word spacing', duration: 25 },
    { title: 'Speed Writing', content: 'Writing faster legibly', duration: 30 },
    { title: 'Neatness Tips', content: 'Making writing look professional', duration: 25 },
    { title: 'Legibility Exercises', content: 'Improving readability', duration: 25 },
    { title: 'Practice Sheets Guide', content: 'Using practice sheets effectively', duration: 20 },
    { title: 'Exam Handwriting Strategy', content: 'Writing fast in exams', duration: 30 },
    { title: 'Common Handwriting Mistakes', content: 'Mistakes to avoid', duration: 25 },
  ];

  for (const topic of handwritingTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== MENTAL MATH ====================
  console.log('🧮 Creating Mental Math lessons...');
  const mathTopics = [
    { title: 'Addition Tricks', content: 'Fast addition methods', duration: 25 },
    { title: 'Subtraction Tricks', content: 'Fast subtraction methods', duration: 25 },
    { title: 'Multiplication Shortcuts', content: 'Vedic math multiplication', duration: 35 },
    { title: 'Division Techniques', content: 'Fast division methods', duration: 30 },
    { title: 'Percentage Calculations', content: 'Quick percentage tricks', duration: 30 },
    { title: 'Square and Cube Roots', content: 'Finding roots mentally', duration: 35 },
    { title: 'Calendar Calculations', content: 'Day of week calculations', duration: 30 },
    { title: 'Square Numbers', content: 'Memorizing squares up to 30', duration: 25 },
    { title: 'Cube Numbers', content: 'Memorizing cubes', duration: 25 },
    { title: 'Mixed Operations', content: 'Combined calculations', duration: 35 },
  ];

  for (const topic of mathTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== STUDY TECHNIQUES ====================
  console.log('📚 Creating Study Techniques lessons...');
  const studyTopics = [
    { title: 'Active Reading', content: 'How to read effectively', duration: 30 },
    { title: 'Note-Taking Methods', content: 'Cornell method and more', duration: 35 },
    { title: 'Mind Mapping', content: 'Visual note organization', duration: 35 },
    { title: 'Spaced Repetition', content: 'Memory technique', duration: 30 },
    { title: 'Pomodoro Technique', content: 'Focused study sessions', duration: 25 },
    { title: 'Chunking Method', content: 'Breaking down information', duration: 30 },
    { title: 'Active Recall', content: 'Testing yourself', duration: 30 },
    { title: 'Interleaving Practice', content: 'Mixing subjects', duration: 30 },
    { title: 'Study Environment', content: 'Optimizing study space', duration: 25 },
    { title: 'Digital Tools for Study', content: 'Apps and resources', duration: 35 },
  ];

  for (const topic of studyTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== MEMORY & FOCUS TRAINING ====================
  console.log('🧠 Creating Memory & Focus Training lessons...');
  const memoryTopics = [
    { title: 'Memory Palace Technique', content: 'Ancient memory method', duration: 35 },
    { title: 'Visual Memory', content: 'Improving visual recall', duration: 30 },
    { title: 'Auditory Memory', content: 'Remembering what you hear', duration: 25 },
    { title: 'Focus Exercises', content: 'Concentration building', duration: 30 },
    { title: 'Meditation for Students', content: 'Simple meditation techniques', duration: 35 },
    { title: 'Attention Span Building', content: 'Increasing focus duration', duration: 30 },
    { title: 'Mnemonics', content: 'Memory aids and tricks', duration: 35 },
    { title: 'Association Techniques', content: 'Linking information', duration: 30 },
    { title: 'Sleep and Memory', content: 'Sleep for better retention', duration: 25 },
    { title: 'Brain Foods', content: 'Nutrition for brain power', duration: 25 },
  ];

  for (const topic of memoryTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== EXAM FEAR REDUCTION ====================
  console.log('😰 Creating Exam Fear Reduction lessons...');
  const fearTopics = [
    { title: 'Understanding Exam Anxiety', content: 'Why fear happens', duration: 25 },
    { title: 'Breathing Techniques', content: 'Calming exercises', duration: 30 },
    { title: 'Positive Self-Talk', content: 'Building confidence', duration: 30 },
    { title: 'Visualization', content: 'Mental rehearsal', duration: 30 },
    { title: 'Preparation Strategies', content: 'Reducing fear through prep', duration: 35 },
    { title: 'Day Before Exam', content: 'Optimal preparation', duration: 30 },
    { title: 'Morning of Exam', content: 'Exam day routine', duration: 25 },
    { title: 'During Exam Tips', content: 'Staying calm while solving', duration: 30 },
    { title: 'Handling Difficult Questions', content: 'What to do when stuck', duration: 25 },
    { title: 'Post-Exam Recovery', content: 'Dealing with results', duration: 25 },
  ];

  for (const topic of fearTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== ASSESSMENTS ====================
  console.log('\n📝 Creating assessments...');
  await createAssessment('English Speaking Assessment', 1);
  await createAssessment('Handwriting Assessment', 2);
  await createAssessment('Mental Math Assessment', 3);
  await createAssessment('Study Skills Assessment', 4);
  await createAssessment('Overall Skills Assessment', 5);

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
