const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📖 Creating lessons for Primary & Middle School (Class 1-5)...\n');

  const courseId = 'school_primary_1_5';
  let order = 1;

  // Helper function to create a lesson
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

  // Helper function to create an assessment
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

  // ==================== BASICS OF MATH ====================
  console.log('📐 Creating Basics of Math lessons...');
  const mathTopics = [
    { title: 'Numbers 1 to 100', content: 'Learning counting and number recognition from 1 to 100', duration: 25 },
    { title: 'Addition Basics', content: 'Simple addition concepts and methods for young learners', duration: 25 },
    { title: 'Subtraction Basics', content: 'Basic subtraction understanding and techniques', duration: 25 },
    { title: 'Multiplication Tables 1-5', content: 'Memorizing multiplication tables from 1 to 5', duration: 30 },
    { title: 'Multiplication Tables 6-10', content: 'Memorizing multiplication tables from 6 to 10', duration: 30 },
    { title: 'Simple Division', content: 'Basic division concepts and sharing equally', duration: 25 },
    { title: 'Shapes and Patterns', content: 'Identifying geometric shapes and completing patterns', duration: 25 },
    { title: 'Measurement Basics', content: 'Understanding length, weight, and volume', duration: 25 },
    { title: 'Time and Clock', content: 'Reading time and understanding hours', duration: 25 },
    { title: 'Money and Currency', content: 'Indian currency recognition and basic transactions', duration: 25 },
    { title: 'Fractions Introduction', content: 'Simple fractions like half and quarter explained', duration: 25 },
    { title: 'Data Handling', content: 'Basic pictographs and simple data interpretation', duration: 20 },
  ];

  for (const topic of mathTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== ENGLISH READING & WRITING ====================
  console.log('📖 Creating English Reading & Writing lessons...');
  const englishTopics = [
    { title: 'Alphabet Recognition A-Z', content: 'Learning alphabet with sounds and pronunciation', duration: 25 },
    { title: 'Small Letters Practice', content: 'Writing small letters correctly', duration: 25 },
    { title: 'Capital Letters Practice', content: 'Writing capital letters correctly', duration: 25 },
    { title: 'Cursive Writing Basics', content: 'Introduction to cursive letter formation', duration: 30 },
    { title: 'Sight Words Part 1', content: 'Commonly used words for instant recognition', duration: 25 },
    { title: 'Sight Words Part 2', content: 'More commonly used words for instant recognition', duration: 25 },
    { title: 'Reading Simple Sentences', content: 'Reading and understanding simple sentences', duration: 25 },
    { title: 'Reading Comprehension', content: 'Understanding short paragraphs and stories', duration: 30 },
    { title: 'Sentence Formation', content: 'Building proper sentences with correct structure', duration: 25 },
    { title: 'Nouns and Verbs', content: 'Introduction to nouns (naming words) and verbs (action words)', duration: 25 },
    { title: 'Punctuation Marks', content: 'Using period, comma, and question mark correctly', duration: 20 },
    { title: 'Creative Writing', content: 'Writing short stories and paragraphs', duration: 35 },
  ];

  for (const topic of englishTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== EVS (ENVIRONMENTAL STUDIES) ====================
  console.log('🌿 Creating EVS lessons...');
  const evsTopics = [
    { title: 'Living and Non-Living Things', content: 'Basic characteristics that distinguish living from non-living things', duration: 25 },
    { title: 'Plants and Their Parts', content: 'Learning about roots, stems, leaves, and flowers', duration: 25 },
    { title: 'Animals and Their Homes', content: 'Different animals and where they live', duration: 25 },
    { title: 'Human Body Basics', content: 'Body parts and five senses explained', duration: 25 },
    { title: 'Food and Nutrition', content: 'Healthy eating habits and food groups', duration: 25 },
    { title: 'Weather and Seasons', content: 'Understanding weather changes and seasons', duration: 25 },
    { title: 'Our Surroundings', content: 'Neighborhood, community places, and helpers', duration: 25 },
    { title: 'Water and Its Uses', content: 'Importance of water and how we use it', duration: 25 },
    { title: 'Air and Its Importance', content: 'Understanding air and why we need it', duration: 25 },
    { title: 'Safety Rules', content: 'Road safety, home safety, and school safety', duration: 25 },
    { title: 'Our Family and Friends', content: 'Understanding family relationships and friendship', duration: 20 },
    { title: 'India - Our Country', content: 'Introduction to Indian geography and landmarks', duration: 30 },
  ];

  for (const topic of evsTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== HINDI / REGIONAL LANGUAGE ====================
  console.log('हिंदी Creating Hindi lessons...');
  const hindiTopics = [
    { title: 'Hindi Swar (स्वर) - Vowels', content: 'Learning Hindi vowels (अ to औ) with pronunciation', duration: 25 },
    { title: 'Hindi Vyanjan (व्यंजन) - Consonants Part 1', content: 'Learning first set of Hindi consonants', duration: 25 },
    { title: 'Hindi Vyanjan (व्यंजन) - Consonants Part 2', content: 'Learning remaining Hindi consonants', duration: 25 },
    { title: 'Hindi Matra (मात्रा) Introduction', content: 'Dependent signs (matras) introduction', duration: 30 },
    { title: 'Hindi Matra Practice', content: 'Practice with matras in words', duration: 30 },
    { title: 'Hindi Shabd Banaye', content: 'Forming words in Hindi using letters', duration: 25 },
    { title: 'Hindi Pad (कविताएं)', content: 'Memorizing Hindi poems for Class 1-5', duration: 25 },
    { title: 'Hindi Story Reading', content: 'Simple Hindi stories with moral values', duration: 30 },
    { title: 'Hindi Grammar - Sangya', content: 'Nouns (संज्ञा) in Hindi', duration: 25 },
    { title: 'Hindi Grammar - Kriya', content: 'Verbs (क्रिया) in Hindi', duration: 25 },
    { title: 'Hindi Letter Writing', content: 'Writing informal letters in Hindi', duration: 25 },
    { title: 'Hindi Paragraph Writing', content: 'Writing small paragraphs in Hindi', duration: 30 },
  ];

  for (const topic of hindiTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== CONCEPT BUILDING (FOUNDATIONS) ====================
  console.log('🧠 Creating Concept Building lessons...');
  const conceptTopics = [
    { title: 'Logical Reasoning', content: 'Pattern recognition and simple reasoning exercises', duration: 25 },
    { title: 'Observation Skills', content: 'Visual discrimination and attention to detail', duration: 20 },
    { title: 'Memory Techniques', content: 'Fun memory games and exercises for kids', duration: 25 },
    { title: 'Critical Thinking', content: 'Simple problem-solving and thinking activities', duration: 25 },
    { title: 'Study Habits', content: 'Effective learning techniques for young students', duration: 25 },
    { title: 'Time Management for Kids', content: 'Planning daily activities and homework', duration: 20 },
    { title: 'Goal Setting', content: 'Setting simple learning goals and targets', duration: 20 },
    { title: 'Self-Assessment', content: 'Understanding personal progress and improvement', duration: 20 },
    { title: 'Collaboration Skills', content: 'Working in groups and teamwork', duration: 25 },
    { title: 'Digital Basics', content: 'Introduction to computers and basic usage', duration: 30 },
    { title: 'General Knowledge', content: 'Interesting facts about India and the world', duration: 25 },
    { title: 'Environmental Awareness', content: 'Keeping our environment clean and green', duration: 25 },
  ];

  for (const topic of conceptTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== ASSESSMENTS ====================
  console.log('\n📝 Creating assessments...');
  await createAssessment('Math Assessment (Class 1-5)', 1);
  await createAssessment('English Assessment (Class 1-5)', 2);
  await createAssessment('EVS Assessment (Class 1-5)', 3);
  await createAssessment('Hindi Assessment (Class 1-5)', 4);
  await createAssessment('Final Assessment (Class 1-5)', 5);

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
