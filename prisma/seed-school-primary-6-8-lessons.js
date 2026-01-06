const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📖 Creating lessons for Primary & Middle School (Class 6-8)...\n');

  const courseId = 'school_primary_6_8';
  let order = 1;

  // Helper functions
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
    { title: 'Knowing Our Numbers', content: 'Large numbers, place value, and comparison', duration: 35 },
    { title: 'Whole Numbers', content: 'Properties and operations on whole numbers', duration: 35 },
    { title: 'Integers', content: 'Positive and negative integers on number line', duration: 40 },
    { title: 'Fractions and Decimals', content: 'Operations with fractions and decimals', duration: 45 },
    { title: 'Algebra Introduction', content: 'Variables, constants, and simple expressions', duration: 40 },
    { title: 'Simple Equations', content: 'Forming and solving simple equations', duration: 40 },
    { title: 'Ratio and Proportion', content: 'Understanding ratios and proportions', duration: 40 },
    { title: 'Percentage', content: 'Converting between percent, fraction, and decimal', duration: 40 },
    { title: 'Profit and Loss', content: 'Basic commercial mathematics concepts', duration: 40 },
    { title: 'Geometry Basics', content: 'Lines, angles, and their properties', duration: 40 },
    { title: 'Triangles and Quadrilaterals', content: 'Properties of triangles and quadrilaterals', duration: 45 },
    { title: 'Perimeter and Area', content: 'Calculating perimeter and area of shapes', duration: 40 },
    { title: 'Data Handling', content: 'Collection, organization, and representation of data', duration: 40 },
    { title: 'Symmetry', content: 'Line symmetry and rotational symmetry', duration: 35 },
    { title: 'Practical Geometry', content: 'Construction of geometric figures', duration: 40 },
  ];

  for (const topic of mathTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== SCIENCE ====================
  console.log('🔬 Creating Science lessons...');
  const scienceTopics = [
    { title: 'Food: Where Does It Come From?', content: 'Sources of food and food groups', duration: 40 },
    { title: 'Components of Food', content: 'Nutrients and their importance', duration: 40 },
    { title: 'Fiber to Fabric', content: 'Fibers and the process of making fabric', duration: 40 },
    { title: 'Sorting Materials into Groups', content: 'Properties and classification of materials', duration: 40 },
    { title: 'Separation of Substances', content: 'Methods of separating mixtures', duration: 45 },
    { title: 'Changes Around Us', content: 'Physical and chemical changes', duration: 40 },
    { title: 'Getting to Know Plants', content: 'Parts of plants and their functions', duration: 40 },
    { title: 'Body Movements', content: 'Skeleton system and types of movements', duration: 40 },
    { title: 'The Living Organisms', content: 'Characteristics of living things', duration: 40 },
    { title: 'Motion and Measurement', content: 'Types of motion and units of measurement', duration: 45 },
    { title: 'Light, Shadows and Reflection', content: 'Formation of shadows and reflection', duration: 45 },
    { title: 'Electricity and Circuits', content: 'Electric circuits and conductors', duration: 45 },
    { title: 'Water', content: 'Properties and importance of water', duration: 40 },
    { title: 'Air Around Us', content: 'Composition and importance of air', duration: 40 },
    { title: 'Waste Management', content: 'Proper disposal and recycling of waste', duration: 40 },
  ];

  for (const topic of scienceTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== SOCIAL SCIENCE ====================
  console.log('🌍 Creating Social Science lessons...');
  const socialTopics = [
    { title: 'What, Where, How and When?', content: 'Introduction to history and time concepts', duration: 40 },
    { title: 'On the Trail of Early Settlements', content: 'Early human settlements and civilizations', duration: 40 },
    { title: 'From Gathering to Growing Food', content: 'Evolution of agriculture and farming', duration: 40 },
    { title: 'In the Earliest Cities', content: 'Features of ancient cities', duration: 40 },
    { title: 'What Books and Burials Tell Us', content: 'Importance of written records and archaeology', duration: 40 },
    { title: 'Kingdoms, Kings and an Early Republic', content: 'Ancient Indian kingdoms and republics', duration: 45 },
    { title: 'New Empires and Kingdoms', content: 'Gupta and Harsha periods', duration: 40 },
    { title: 'Maps and Globe', content: 'Reading maps and understanding globes', duration: 40 },
    { title: 'Major Landforms', content: 'Mountains, plateaus, and plains', duration: 40 },
    { title: 'India: Size and Location', content: 'Geographical features of India', duration: 40 },
    { title: 'India: Climate and Vegetation', content: 'Climate zones and natural vegetation', duration: 40 },
    { title: 'Democracy and Diversity', content: 'Democratic values and cultural diversity', duration: 40 },
    { title: 'Panchayati Raj', content: 'Local self-government system', duration: 40 },
    { title: 'Rural Administration', content: 'Revenue and police administration', duration: 40 },
    { title: 'Urban Livelihoods', content: 'Different occupations in urban areas', duration: 40 },
  ];

  for (const topic of socialTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== ENGLISH GRAMMAR ====================
  console.log('📚 Creating English Grammar lessons...');
  const englishTopics = [
    { title: 'Nouns: Types and Functions', content: 'Common, proper, collective, and material nouns', duration: 35 },
    { title: 'Pronouns and Their Uses', content: 'Personal, demonstrative, and relative pronouns', duration: 35 },
    { title: 'Verbs: Types and Tenses', content: 'Linking, helping verbs, and tense forms', duration: 40 },
    { title: 'Adjectives and Their Degrees', content: 'Degrees of comparison of adjectives', duration: 35 },
    { title: 'Prepositions', content: 'Common prepositions and their usage', duration: 35 },
    { title: 'Conjunctions', content: 'Coordinating and subordinating conjunctions', duration: 35 },
    { title: 'Subject-Verb Agreement', content: 'Rules for subject-verb agreement', duration: 35 },
    { title: 'Tenses: Present, Past, Future', content: 'All tenses with examples and exercises', duration: 45 },
    { title: 'Active and Passive Voice', content: 'Transforming sentences between voices', duration: 40 },
    { title: 'Direct and Indirect Speech', content: 'Converting between direct and indirect speech', duration: 40 },
    { title: 'Sentence Transformation', content: 'Assertive to interrogative, affirmative to negative', duration: 40 },
    { title: 'Passages for Comprehension', content: 'Reading passages and answering questions', duration: 40 },
    { title: 'Letter Writing', content: 'Formal and informal letter formats', duration: 35 },
    { title: 'Essay Writing', content: 'Structure and techniques for essay writing', duration: 40 },
    { title: 'Notice and Paragraph Writing', content: 'Writing effective notices and paragraphs', duration: 35 },
  ];

  for (const topic of englishTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== HINDI / REGIONAL LANGUAGE ====================
  console.log('हिंदी Creating Hindi lessons...');
  const hindiTopics = [
    { title: 'Hindi Varnamala Complete', content: 'Complete review of Hindi alphabet', duration: 30 },
    { title: 'Hindi Grammar - Sangya', content: 'Nouns (संज्ञा) - types and examples', duration: 35 },
    { title: 'Hindi Grammar - Visheshan', content: 'Adjectives (विशेषण) - types and usage', duration: 35 },
    { title: 'Hindi Grammar - Sarvanam', content: 'Pronouns (सर्वनाम) - types and rules', duration: 35 },
    { title: 'Hindi Grammar - Kriya', content: 'Verbs (क्रिया) - types and conjugation', duration: 40 },
    { title: 'Hindi Kriya Vishesh', content: 'Verb forms and tense usage in Hindi', duration: 40 },
    { title: 'Hindi Ukti Pratyay and Prefix', content: 'Word formation techniques', duration: 35 },
    { title: 'Hindi Alankar', content: 'Poetic devices like अनुप्रास, यमक', duration: 35 },
    { title: 'Hindi Chhand', content: 'Types of meters (छंद) in Hindi poetry', duration: 35 },
    { title: 'Hindi Pathya Pustak - गद्य', content: 'Prose (गद्य) reading and analysis', duration: 40 },
    { title: 'Hindi Pathya Pustak - पद्य', content: 'Poetry (पद्य) reading and explanation', duration: 40 },
    { title: 'Hindi Unseen Passage', content: 'Reading comprehension in Hindi', duration: 35 },
    { title: 'Hindi Essay Writing', content: 'Essay formats and topics in Hindi', duration: 40 },
    { title: 'Hindi Letter Writing', content: 'Official and personal letters in Hindi', duration: 35 },
    { title: 'Hindi Revision Course', content: 'Complete revision of Class 6-8 Hindi', duration: 50 },
  ];

  for (const topic of hindiTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== ASSESSMENTS ====================
  console.log('\n📝 Creating assessments...');
  await createAssessment('Mathematics Assessment (Class 6-8)', 1);
  await createAssessment('Science Assessment (Class 6-8)', 2);
  await createAssessment('Social Science Assessment (Class 6-8)', 3);
  await createAssessment('English Assessment (Class 6-8)', 4);
  await createAssessment('Hindi Assessment (Class 6-8)', 5);
  await createAssessment('Final Assessment (Class 6-8)', 6);

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
