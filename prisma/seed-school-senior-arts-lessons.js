const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📖 Creating lessons for Senior Secondary - Arts/Humanities (Class 11-12)...\n');

  const courseId = 'school_senior_arts_11_12';
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

  // ==================== HISTORY ====================
  console.log('📜 Creating History lessons...');
  const historyTopics = [
    { title: 'Early Societies', content: 'Prehistoric civilizations and cultures', duration: 55 },
    { title: 'Empires and Kingdoms', content: 'Ancient empires of the world', duration: 60 },
    { title: 'Religious Systems', content: 'Major world religions', duration: 55 },
    { title: 'Medieval World', content: 'Feudalism and crusades', duration: 60 },
    { title: 'Revolutions', content: 'Industrial and political revolutions', duration: 60 },
    { title: 'Colonialism', content: 'European colonialism worldwide', duration: 60 },
    { title: 'Nationalism', content: 'Rise of nationalist movements', duration: 55 },
    { title: 'World Wars', content: 'Causes and effects of WWI and WWII', duration: 65 },
    { title: 'Cold War Era', content: 'Post-war politics and conflicts', duration: 60 },
    { title: 'Contemporary World', content: 'Modern era developments', duration: 55 },
  ];

  for (const topic of historyTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== POLITICAL SCIENCE ====================
  console.log('🏛️ Creating Political Science lessons...');
  const politicalTopics = [
    { title: 'Political Theory Concepts', content: 'Freedom, equality, and justice', duration: 55 },
    { title: 'Rights and Duties', content: 'Fundamental rights and duties', duration: 55 },
    { title: 'Concept of Citizenship', content: 'Citizenship and nationality', duration: 50 },
    { title: 'Electoral Politics', content: 'Elections and voting systems', duration: 55 },
    { title: 'Executive and Legislature', content: 'Government branches in India', duration: 60 },
    { title: 'Judiciary', content: 'Supreme Court and judicial system', duration: 60 },
    { title: 'Constitutional Design', content: 'Indian Constitution features', duration: 65 },
    { title: 'Federalism', content: 'Center-state relations in India', duration: 60 },
    { title: 'Democracy and Diversity', content: 'Social diversity in India', duration: 55 },
    { title: 'Gender, Religion, Caste', content: 'Social categories in politics', duration: 60 },
    { title: 'Popular Struggles', content: 'Social movements in India', duration: 55 },
    { title: 'International Organizations', content: 'UN and global institutions', duration: 60 },
    { title: 'Globalization', content: 'Global political and economic changes', duration: 55 },
  ];

  for (const topic of politicalTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== GEOGRAPHY ====================
  console.log('🌍 Creating Geography lessons...');
  const geographyTopics = [
    { title: 'Geography as a Discipline', content: 'Physical geography basics', duration: 55 },
    { title: 'The Earth', content: 'Interior and structure of Earth', duration: 60 },
    { title: 'Landforms', content: 'Mountains, plateaus, and plains', duration: 60 },
    { title: 'Climate and Weather', content: 'Atmospheric circulation patterns', duration: 60 },
    { title: 'Water Resources', content: 'Oceans, rivers, and groundwater', duration: 60 },
    { title: 'Natural Vegetation', content: 'Biomes and ecosystems worldwide', duration: 55 },
    { title: 'Soils and Agriculture', content: 'Soil types and farming practices', duration: 60 },
    { title: 'Human Geography', content: 'Population and settlement patterns', duration: 60 },
    { title: 'Economic Activities', content: 'Primary, secondary, and tertiary sectors', duration: 60 },
    { title: 'Resources and Development', content: 'Resource management', duration: 55 },
    { title: 'India - Physical Environment', content: 'Physical features of India', duration: 65 },
    { title: 'India - Economic Geography', content: 'Resources and industries in India', duration: 60 },
    { title: 'India - Population', content: 'Demographic patterns in India', duration: 55 },
  ];

  for (const topic of geographyTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== ECONOMICS ====================
  console.log('💰 Creating Economics lessons...');
  const economicsTopics = [
    { title: 'Introduction to Economics', content: 'Basic economic concepts', duration: 50 },
    { title: 'Consumer Equilibrium', content: 'Utility maximization', duration: 55 },
    { title: 'Demand and Supply', content: 'Market equilibrium', duration: 55 },
    { title: 'Elasticity', content: 'Price, income, and cross elasticity', duration: 55 },
    { title: 'Production and Cost', content: 'Production function and cost curves', duration: 55 },
    { title: 'Market Structures', content: 'Perfect and imperfect competition', duration: 60 },
    { title: 'National Income', content: 'GDP and national income accounting', duration: 60 },
    { title: 'Money and Banking', content: 'Monetary system', duration: 55 },
    { title: 'Fiscal Policy', content: 'Government budget and taxation', duration: 55 },
    { title: 'Balance of Payments', content: 'International trade', duration: 55 },
    { title: 'Indian Economy', content: 'Post-independence development', duration: 60 },
    { title: 'Poverty and Unemployment', content: 'Major economic challenges', duration: 55 },
  ];

  for (const topic of economicsTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== SOCIOLOGY ====================
  console.log('👥 Creating Sociology lessons...');
  const sociologyTopics = [
    { title: 'Sociology - Introduction', content: 'Society and social interaction', duration: 55 },
    { title: 'Social Institutions', content: 'Family, religion, and education', duration: 60 },
    { title: 'Social Stratification', content: 'Class, caste, and gender', duration: 60 },
    { title: 'Social Change', content: 'Modernization and development', duration: 55 },
    { title: 'Environment and Society', content: 'Environmental sociology', duration: 50 },
    { title: 'Western Social Thinkers', content: 'Durkheim, Weber, and Marx', duration: 60 },
    { title: 'Indian Thinkers', content: 'Gandhi, Ambedkar, and Tagore', duration: 60 },
    { title: 'Research Methods', content: 'Qualitative and quantitative methods', duration: 55 },
    { title: 'Practical in Sociology', content: 'Fieldwork and data collection', duration: 50 },
  ];

  for (const topic of sociologyTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== PSYCHOLOGY ====================
  console.log('🧠 Creating Psychology lessons...');
  const psychologyTopics = [
    { title: 'Introduction to Psychology', content: 'Science of mind and behavior', duration: 55 },
    { title: 'Methods of Psychology', content: 'Research methods in psychology', duration: 55 },
    { title: 'Sensation and Perception', content: 'Sensory processes', duration: 60 },
    { title: 'Learning', content: 'Learning theories and types', duration: 60 },
    { title: 'Memory', content: 'Memory processes and strategies', duration: 60 },
    { title: 'Thinking', content: 'Cognitive processes', duration: 55 },
    { title: 'Intelligence', content: 'Theories and measurement of intelligence', duration: 60 },
    { title: 'Personality', content: 'Personality theories and assessment', duration: 65 },
    { title: 'Development', content: 'Life span development', duration: 60 },
    { title: 'Psychological Disorders', content: 'Types of mental disorders', duration: 65 },
    { title: 'Therapeutic Approaches', content: 'Different therapy types', duration: 60 },
    { title: 'Social Psychology', content: 'Group behavior and attitudes', duration: 60 },
  ];

  for (const topic of psychologyTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== ASSESSMENTS ====================
  console.log('\n📝 Creating assessments...');
  await createAssessment('History Assessment (Class 11-12)', 1);
  await createAssessment('Political Science Assessment (Class 11-12)', 2);
  await createAssessment('Geography Assessment (Class 11-12)', 3);
  await createAssessment('Economics Assessment (Class 11-12)', 4);
  await createAssessment('Sociology/Psychology Assessment', 5);
  await createAssessment('Final Assessment (Arts Stream)', 6);

  console.log(`\n✅ Completed! Created ${order - 1} lessons and 6 assessments.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
