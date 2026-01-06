const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📖 Creating lessons for Secondary School (Class 9-10)...\n');

  const courseId = 'school_secondary_9_10';
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

  // ==================== MATHEMATICS ====================
  console.log('📐 Creating Mathematics lessons...');
  const mathTopics = [
    { title: 'Number System - Real Numbers', content: 'Irrational numbers and their properties', duration: 45 },
    { title: 'Polynomials - Basics', content: 'Degree, types, and zeros of polynomials', duration: 50 },
    { title: 'Polynomials - Advanced', content: 'Factorization and algebraic identities', duration: 50 },
    { title: 'Coordinate Geometry', content: 'Cartesian plane and distance formula', duration: 45 },
    { title: 'Linear Equations Two Variables', content: 'Graphs and solutions of linear equations', duration: 50 },
    { title: 'Introduction to Euclid\'s Geometry', content: 'Axioms, postulates, and theorems', duration: 45 },
    { title: 'Lines and Angles', content: 'Angle properties and theorems', duration: 45 },
    { title: 'Triangles - Congruence', content: 'SSS, SAS, ASA, AAS congruence rules', duration: 50 },
    { title: 'Triangles - Properties', content: 'Properties of isosceles and equilateral triangles', duration: 45 },
    { title: 'Quadrilaterals', content: 'Properties of parallelograms and trapeziums', duration: 50 },
    { title: 'Areas of Parallelograms and Triangles', content: 'Area formulas and calculations', duration: 45 },
    { title: 'Circles', content: 'Circle theorems and properties', duration: 50 },
    { title: 'Heron\'s Formula', content: 'Area of triangles using Heron\'s formula', duration: 45 },
    { title: 'Surface Areas and Volumes', content: 'Surface area and volume of 3D shapes', duration: 55 },
    { title: 'Statistics', content: 'Mean, median, mode of grouped data', duration: 50 },
    { title: 'Probability', content: 'Basic probability concepts and calculations', duration: 45 },
    { title: 'Quadratic Equations', content: 'Roots of quadratic equations', duration: 55 },
    { title: 'Arithmetic Progressions', content: 'nth term and sum of AP', duration: 50 },
    { title: 'Coordinate Geometry Advanced', content: 'Section formula and area of triangle', duration: 50 },
    { title: 'Trigonometry Introduction', content: 'Trigonometric ratios and identities', duration: 55 },
  ];

  for (const topic of mathTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== SCIENCE ====================
  console.log('🔬 Creating Science lessons...');
  const scienceTopics = [
    { title: 'Matter - States of Matter', content: 'Solid, liquid, gas properties and molecular arrangement', duration: 45 },
    { title: 'Atoms and Molecules', content: 'Laws of chemical combination, atomic theory', duration: 50 },
    { title: 'Structure of Atom', content: 'Electrons, protons, neutrons, and atomic models', duration: 50 },
    { title: 'Cell - The Fundamental Unit', content: 'Cell structure and functions', duration: 50 },
    { title: 'Tissues - Plant and Animal', content: 'Different types of plant and animal tissues', duration: 50 },
    { title: 'Diversity in Living Organisms', content: 'Classification of living organisms', duration: 50 },
    { title: 'Motion - Kinematics', content: 'Rest, motion, distance, displacement, speed, velocity', duration: 55 },
    { title: 'Force and Laws of Motion', content: 'Newton\'s three laws of motion', duration: 55 },
    { title: 'Gravitation', content: 'Universal gravitation and related problems', duration: 55 },
    { title: 'Work, Energy and Power', content: 'Work done, kinetic and potential energy', duration: 55 },
    { title: 'Sound', content: 'Sound waves, echo, and characteristics', duration: 50 },
    { title: 'Chemical Reactions', content: 'Types of chemical reactions', duration: 50 },
    { title: 'Acids, Bases and Salts', content: 'pH scale, indicators, and neutralization', duration: 50 },
    { title: 'Metals and Non-Metals', content: 'Properties and reactions of metals', duration: 50 },
    { title: 'Carbon and Its Compounds', content: 'Covalent bonding and organic compounds', duration: 55 },
    { title: 'Periodic Classification', content: 'Modern periodic table and trends', duration: 50 },
    { title: 'Life Processes', content: 'Nutrition, respiration, transportation, excretion', duration: 55 },
    { title: 'Control and Coordination', content: 'Nervous system and hormones', duration: 50 },
    { title: 'How Do Organisms Reproduce?', content: 'Asexual and sexual reproduction', duration: 55 },
    { title: 'Heredity and Evolution', content: 'Mendel\'s laws and evolution', duration: 55 },
  ];

  for (const topic of scienceTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== SOCIAL SCIENCE ====================
  console.log('🌍 Creating Social Science lessons...');
  const socialTopics = [
    { title: 'India - Size and Location', content: 'Geographical extent and location of India', duration: 40 },
    { title: 'Physical Features of India', content: 'Mountains, plateaus, plains, and deserts', duration: 45 },
    { title: 'Drainage Systems', content: 'Major rivers and their basins', duration: 45 },
    { title: 'Climate of India', content: 'Monsoon, seasons, and climate patterns', duration: 45 },
    { title: 'Natural Vegetation', content: 'Types of forests in India', duration: 40 },
    { title: 'Wildlife and Conservation', content: 'Wildlife sanctuaries and conservation efforts', duration: 40 },
    { title: 'The French Revolution', content: 'Causes, events, and impact of French Revolution', duration: 50 },
    { title: 'Socialism in Europe', content: 'Rise of socialism and communist movements', duration: 45 },
    { title: 'Nazism and Rise of Hitler', content: 'Nazism, WWII context, and Holocaust', duration: 50 },
    { title: 'Forest and Wildlife Resources', content: 'Deforestation and conservation', duration: 40 },
    { title: 'Water Resources', content: 'Water scarcity and management', duration: 40 },
    { title: 'Agriculture', content: 'Types of farming in India', duration: 45 },
    { title: 'Minerals and Energy Resources', content: 'Types of minerals and energy sources', duration: 45 },
    { title: 'Manufacturing Industries', content: 'Types and location of industries', duration: 45 },
    { title: 'Lifelines of Indian Economy', content: 'Roads, rails, ports, and communication', duration: 45 },
    { title: 'Democratic Politics Part 1', content: 'Features of democracy', duration: 40 },
    { title: 'Democratic Politics Part 2', content: 'Institutions of democracy', duration: 45 },
    { title: 'Economics - Development', content: 'Sustainable development goals', duration: 40 },
    { title: 'Consumer Rights', content: 'Consumer protection and rights', duration: 40 },
    { title: 'Disaster Management', content: 'Natural disasters and safety measures', duration: 45 },
  ];

  for (const topic of socialTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== ENGLISH ====================
  console.log('📚 Creating English lessons...');
  const englishTopics = [
    { title: 'Beehive - Prose Analysis', content: 'Detailed analysis of prose chapters', duration: 50 },
    { title: 'Beehive - Poetry Analysis', content: 'Explanation of poems in Beehive', duration: 45 },
    { title: 'Moments - Story Analysis', content: 'Analysis of supplementary reader stories', duration: 50 },
    { title: 'Grammar - Tenses', content: 'All tenses with examples and exercises', duration: 50 },
    { title: 'Grammar - Reported Speech', content: 'Rules for converting direct to indirect speech', duration: 45 },
    { title: 'Grammar - Modals', content: 'Use of modal verbs in different contexts', duration: 40 },
    { title: 'Grammar - Passive Voice', content: 'Active to passive voice transformation', duration: 45 },
    { title: 'Writing - Notice Writing', content: 'Format and examples of notice writing', duration: 35 },
    { title: 'Writing - Formal Letters', content: 'Letter to editor and application formats', duration: 40 },
    { title: 'Writing - Essay Writing', content: 'Essay types, structure, and practice', duration: 45 },
    { title: 'Writing - Story Writing', content: 'Creative story writing techniques', duration: 40 },
    { title: 'Reading Comprehension', content: 'Passage solving strategies and practice', duration: 50 },
    { title: 'Short Answer Questions', content: 'Chapter-based short answer preparation', duration: 45 },
    { title: 'Long Answer Questions', content: 'Descriptive answer writing techniques', duration: 50 },
    { title: 'Previous Year Papers', content: 'Analysis of CBSE previous year questions', duration: 60 },
    { title: 'Sample Papers Practice', content: 'Full sample paper solving', duration: 90 },
  ];

  for (const topic of englishTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== HINDI ====================
  console.log('हिंदी Creating Hindi lessons...');
  const hindiTopics = [
    { title: 'Kshitij - Prose Analysis', content: 'Detailed analysis of Kshitij prose chapters', duration: 45 },
    { title: 'Kritika - Poetry Analysis', content: 'Explanation of poems in Kritika', duration: 45 },
    { title: 'Sparsh - Literature Analysis', content: 'Analysis of Sparsh literature chapters', duration: 45 },
    { title: 'Maalap - Writing Skills', content: 'Essay and letter writing in Hindi', duration: 40 },
    { title: 'Hindi Varnvichhed', content: 'Paragraph writing in Hindi', duration: 35 },
    { title: 'Hindi Unseen Passage', content: 'Reading comprehension in Hindi', duration: 40 },
    { title: 'Hindi Grammar Revision', content: 'Complete grammar revision for Class 9-10', duration: 50 },
    { title: 'Previous Year Questions', content: 'CBSE board exam questions analysis', duration: 45 },
    { title: 'Sample Papers Hindi', content: 'Practice papers for Hindi', duration: 60 },
  ];

  for (const topic of hindiTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== BOARD-ORIENTED PRACTICE ====================
  console.log('📝 Creating Board-Oriented Practice lessons...');
  const boardTopics = [
    { title: 'CBSE Board Exam Pattern', content: 'Understanding question paper structure', duration: 35 },
    { title: 'ICSE Board Overview', content: 'ICSE specific requirements and pattern', duration: 30 },
    { title: 'State Board Differences', content: 'State board preparation strategy', duration: 25 },
    { title: 'Time Management Strategy', content: 'Allocating time during exams', duration: 35 },
    { title: 'Important Questions Bank - Math', content: 'High-weightage math topics', duration: 50 },
    { title: 'Important Questions Bank - Science', content: 'High-weightage science topics', duration: 50 },
    { title: 'Important Questions Bank - SST', content: 'High-weightage social science topics', duration: 45 },
    { title: 'Previous Year Papers Analysis', content: 'Identifying patterns from PYQs', duration: 50 },
    { title: 'Sample Paper 1 - Full', content: 'Complete practice paper', duration: 90 },
    { title: 'Sample Paper 2 - Full', content: 'Complete practice paper', duration: 90 },
    { title: 'Common Mistakes to Avoid', content: 'Frequent errors in board exams', duration: 40 },
    { title: 'Answer Writing Techniques', content: 'How to write perfect answers', duration: 45 },
    { title: 'Revision Strategy', content: 'Effective last-minute revision', duration: 40 },
    { title: 'Exam Day Guidelines', content: 'Tips for exam day success', duration: 30 },
  ];

  for (const topic of boardTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== ASSESSMENTS ====================
  console.log('\n📝 Creating assessments...');
  await createAssessment('Mathematics Assessment (Class 9-10)', 1);
  await createAssessment('Science Assessment (Class 9-10)', 2);
  await createAssessment('Social Science Assessment (Class 9-10)', 3);
  await createAssessment('English Assessment (Class 9-10)', 4);
  await createAssessment('Hindi Assessment (Class 9-10)', 5);
  await createAssessment('Board Exam Practice Assessment', 6);
  await createAssessment('Final Assessment (Class 9-10)', 7);

  console.log(`\n✅ Completed! Created ${order - 1} lessons and 7 assessments.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
