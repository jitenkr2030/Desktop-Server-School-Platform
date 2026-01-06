const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📖 Creating lessons for Senior Secondary - Science Stream (Class 11-12)...\n');

  const courseId = 'school_senior_science_11_12';
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

  // ==================== PHYSICS ====================
  console.log('⚛️ Creating Physics lessons...');
  const physicsTopics = [
    { title: 'Physical World and Measurement', content: 'Scope of physics, units, and measurement', duration: 45 },
    { title: 'Kinematics', content: 'Motion in straight line and plane', duration: 55 },
    { title: 'Laws of Motion', content: 'Newton\'s laws and applications', duration: 55 },
    { title: 'Work, Energy and Power', content: 'Work done, energy conservation', duration: 55 },
    { title: 'Motion of System of Particles', content: 'Center of mass and rotational motion', duration: 55 },
    { title: 'Gravitation', content: 'Universal gravitation and satellites', duration: 55 },
    { title: 'Properties of Bulk Matter', content: 'Elasticity, fluid mechanics', duration: 55 },
    { title: 'Thermodynamics', content: 'Laws of thermodynamics and heat', duration: 55 },
    { title: 'Kinetic Theory of Gases', content: 'Gas laws and kinetic theory', duration: 50 },
    { title: 'Oscillations and Waves', content: 'SHM, waves, and sound', duration: 55 },
    { title: 'Electrostatics', content: 'Electric charges and fields', duration: 60 },
    { title: 'Current Electricity', content: 'Ohm\'s law, circuits, and resistance', duration: 60 },
    { title: 'Magnetic Effects of Current', content: 'Magnetic field and forces', duration: 60 },
    { title: 'Electromagnetic Induction', content: 'Faraday\'s laws and induction', duration: 60 },
    { title: 'Alternating Current', content: 'AC circuits and transformers', duration: 55 },
    { title: 'Electromagnetic Waves', content: 'EM spectrum and characteristics', duration: 50 },
    { title: 'Optics - Ray Optics', content: 'Reflection, refraction, and lenses', duration: 60 },
    { title: 'Optics - Wave Optics', content: 'Interference, diffraction, and polarization', duration: 60 },
    { title: 'Dual Nature of Matter', content: 'Photoelectric effect and matter waves', duration: 55 },
    { title: 'Atoms and Nuclei', content: 'Atomic structure and radioactivity', duration: 60 },
    { title: 'Electronic Devices', content: 'Semiconductors and diodes', duration: 55 },
    { title: 'Communication Systems', content: 'Communication technology basics', duration: 50 },
  ];

  for (const topic of physicsTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== CHEMISTRY ====================
  console.log('🧪 Creating Chemistry lessons...');
  const chemistryTopics = [
    { title: 'Some Basic Concepts of Chemistry', content: 'Matter, atomic mass, mole concept', duration: 50 },
    { title: 'Structure of Atom', content: 'Atomic models and quantum numbers', duration: 55 },
    { title: 'Classification of Elements', content: 'Periodic table and trends', duration: 55 },
    { title: 'Chemical Bonding', content: 'Ionic, covalent, and metallic bonding', duration: 60 },
    { title: 'States of Matter', content: 'Gas laws and liquid state', duration: 55 },
    { title: 'Thermodynamics', content: 'Enthalpy, entropy, and Gibbs free energy', duration: 60 },
    { title: 'Equilibrium', content: 'Chemical and ionic equilibrium', duration: 60 },
    { title: 'Redox Reactions', content: 'Oxidation, reduction, and balancing', duration: 50 },
    { title: 'Hydrogen', content: 'Properties, preparation, and compounds', duration: 45 },
    { title: 's-Block Elements', content: 'Alkali and alkaline earth metals', duration: 55 },
    { title: 'p-Block Elements', content: 'Boron and carbon family elements', duration: 60 },
    { title: 'Organic Chemistry Basics', content: 'Hydrocarbons and functional groups', duration: 60 },
    { title: 'Hydrocarbons - Alkanes', content: 'Properties and reactions of alkanes', duration: 55 },
    { title: 'Hydrocarbons - Alkenes', content: 'Properties and reactions of alkenes', duration: 55 },
    { title: 'Hydrocarbons - Alkynes', content: 'Properties and reactions of alkynes', duration: 55 },
    { title: 'Environmental Chemistry', content: 'Pollution and green chemistry', duration: 50 },
    { title: 'Solid State', content: 'Crystal structures and properties', duration: 60 },
    { title: 'Solutions', content: 'Concentration terms and colligative properties', duration: 60 },
    { title: 'Electrochemistry', content: 'Redox reactions in electrochemical cells', duration: 60 },
    { title: 'Chemical Kinetics', content: 'Rate of reaction and order', duration: 60 },
    { title: 'Surface Chemistry', content: 'Adsorption and catalysis', duration: 55 },
    { title: 'Isolation of Elements', content: 'Extraction of metals', duration: 55 },
    { title: 'p-Block Elements Advanced', content: 'Noble gases and halogens', duration: 60 },
    { title: 'd and f Block Elements', content: 'Transition and inner transition metals', duration: 60 },
    { title: 'Coordination Compounds', content: 'Nomenclature and bonding', duration: 60 },
    { title: 'Haloalkanes and Haloarenes', content: 'Organohalogen compounds', duration: 60 },
    { title: 'Alcohols, Phenols and Ethers', content: 'Oxygen-containing compounds', duration: 60 },
    { title: 'Aldehydes, Ketones and Carboxylic Acids', content: 'Carbonyl compounds', duration: 60 },
    { title: 'Amines', content: 'Nitrogen-containing compounds', duration: 60 },
    { title: 'Biomolecules', content: 'Carbohydrates, proteins, and nucleic acids', duration: 60 },
    { title: 'Polymers', content: 'Natural and synthetic polymers', duration: 55 },
    { title: 'Chemistry in Everyday Life', content: 'Drugs and detergents', duration: 50 },
  ];

  for (const topic of chemistryTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== MATHEMATICS ====================
  console.log('📐 Creating Mathematics lessons...');
  const mathTopics = [
    { title: 'Sets and Functions', content: 'Set theory and relations', duration: 55 },
    { title: 'Trigonometric Functions', content: 'Trigonometric ratios and identities', duration: 60 },
    { title: 'Principle of Mathematical Induction', content: 'Proof by induction', duration: 45 },
    { title: 'Complex Numbers', content: 'Algebra of complex numbers', duration: 55 },
    { title: 'Linear Inequalities', content: 'Solving inequalities', duration: 50 },
    { title: 'Permutations and Combinations', content: 'Counting principles', duration: 60 },
    { title: 'Binomial Theorem', content: 'Expansion of binomials', duration: 55 },
    { title: 'Sequences and Series', content: 'AP, GP, and HP series', duration: 60 },
    { title: 'Straight Lines', content: '2D coordinate geometry', duration: 55 },
    { title: 'Conic Sections', content: 'Parabola, ellipse, and hyperbola', duration: 65 },
    { title: 'Three Dimensional Geometry', content: '3D coordinate geometry', duration: 60 },
    { title: 'Limits and Derivatives', content: 'Introduction to calculus', duration: 65 },
    { title: 'Statistics', content: 'Variance and standard deviation', duration: 55 },
    { title: 'Probability', content: 'Basic probability concepts', duration: 60 },
    { title: 'Relations and Functions', content: 'Types of functions', duration: 55 },
    { title: 'Inverse Trigonometric Functions', content: 'Arc functions and properties', duration: 55 },
    { title: 'Matrices', content: 'Matrix operations and properties', duration: 60 },
    { title: 'Determinants', content: 'Properties of determinants', duration: 60 },
    { title: 'Continuity and Differentiability', content: 'Calculus fundamentals', duration: 65 },
    { title: 'Application of Derivatives', content: 'Rate of change and extrema', duration: 65 },
    { title: 'Integrals', content: 'Indefinite and definite integrals', duration: 70 },
    { title: 'Application of Integrals', content: 'Area under curves', duration: 60 },
    { title: 'Differential Equations', content: 'Solving differential equations', duration: 65 },
    { title: 'Vector Algebra', content: 'Vector operations', duration: 60 },
    { title: 'Linear Programming', content: 'Optimization problems', duration: 55 },
  ];

  for (const topic of mathTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== BIOLOGY ====================
  console.log('🧬 Creating Biology lessons...');
  const biologyTopics = [
    { title: 'Diversity of Living Organisms', content: 'Classification and taxonomy', duration: 55 },
    { title: 'Structural Organization in Plants', content: 'Plant anatomy and tissues', duration: 55 },
    { title: 'Structural Organization in Animals', content: 'Animal tissues and organs', duration: 55 },
    { title: 'Cell Structure and Function', content: 'Cell organelles and functions', duration: 60 },
    { title: 'Biomolecules', content: 'Carbohydrates, proteins, and lipids', duration: 60 },
    { title: 'Cell Cycle and Division', content: 'Mitosis and meiosis', duration: 55 },
    { title: 'Transport in Plants', content: 'Transpiration and absorption', duration: 55 },
    { title: 'Transport in Animals', content: 'Circulatory system', duration: 55 },
    { title: 'Excretory System', content: 'Kidney function and excretion', duration: 55 },
    { title: 'Locomotion and Movement', content: 'Skeletal and muscular systems', duration: 55 },
    { title: 'Neural Control and Coordination', content: 'Nervous system', duration: 55 },
    { title: 'Chemical Coordination', content: 'Endocrine system and hormones', duration: 55 },
    { title: 'Reproduction in Plants', content: 'Pollination and fertilization', duration: 55 },
    { title: 'Reproduction in Animals', content: 'Human reproductive system', duration: 55 },
    { title: 'Inheritance and Variation', content: 'Mendelian genetics', duration: 60 },
    { title: 'Molecular Basis of Inheritance', content: 'DNA replication and expression', duration: 65 },
    { title: 'Evolution', content: 'Theories of evolution', duration: 60 },
    { title: 'Human Health and Disease', content: 'Pathogens and immunity', duration: 60 },
    { title: 'Strategies for Enhancement', content: 'Animal husbandry and breeding', duration: 55 },
    { title: 'Biotechnology - Principles', content: 'Genetic engineering basics', duration: 60 },
    { title: 'Biotechnology - Applications', content: 'Biotech in agriculture and medicine', duration: 60 },
    { title: 'Ecosystem', content: 'Ecological relationships', duration: 55 },
    { title: 'Environmental Issues', content: 'Pollution and conservation', duration: 60 },
    { title: 'Organisms and Populations', content: 'Population ecology', duration: 55 },
    { title: 'Biodiversity and Conservation', content: 'Wildlife protection', duration: 55 },
  ];

  for (const topic of biologyTopics) {
    await createLesson(topic.title, topic.content, topic.duration, order++);
  }

  // ==================== ASSESSMENTS ====================
  console.log('\n📝 Creating assessments...');
  await createAssessment('Physics Assessment (Class 11-12)', 1);
  await createAssessment('Chemistry Assessment (Class 11-12)', 2);
  await createAssessment('Mathematics Assessment (Class 11-12)', 3);
  await createAssessment('Biology Assessment (Class 11-12)', 4);
  await createAssessment('JEE/NEET Practice Assessment', 5);
  await createAssessment('Board Exam Assessment', 6);
  await createAssessment('Final Assessment (Science Stream)', 7);

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
