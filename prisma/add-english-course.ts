import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Adding English Communication Mastery course with all 10 modules and 70 lessons...\n')

  // First, find the instructor
  let instructor = await prisma.instructor.findFirst({
    where: { name: { contains: 'Rajesh' } }
  })

  // If not found, create instructor
  if (!instructor) {
    instructor = await prisma.instructor.create({
      data: {
        id: 'inst_english',
        name: 'Prof. Rajesh Kumar',
        bio: 'Prof. Rajesh Kumar is an experienced instructor specializing in English Literature, Communication, Arts. With expertise in multiple domains, they bring practical knowledge and real-world examples to help students succeed.',
        avatar: '/instructors/inst2.jpg',
        expertise: JSON.stringify(['English Literature', 'Communication', 'Arts', 'Humanities', 'Creative Writing']),
      }
    })
    console.log(`Created instructor: ${instructor.name}`)
  } else {
    console.log(`Using existing instructor: ${instructor.name}`)
  }

  // Find or create learning path
  let learningPath = await prisma.learningPath.findFirst({
    where: { title: { contains: 'English' } }
  })

  if (!learningPath) {
    learningPath = await prisma.learningPath.create({
      data: {
        id: 'english-comm',
        title: 'English Communication',
        description: 'Practical English for daily life and work',
        icon: 'MessageSquare',
        color: 'bg-indigo-100',
      }
    })
    console.log(`Created learning path: ${learningPath.title}`)
  }

  // Check if course already exists
  const existingCourse = await prisma.course.findFirst({
    where: { title: { contains: 'English Communication Mastery' } }
  })

  if (existingCourse) {
    console.log('Deleting existing course to recreate with full lessons...')
    await prisma.course.delete({ where: { id: existingCourse.id } })
  }

  // Create the course
  console.log('\nCreating English Communication Mastery course...')
  const course = await prisma.course.create({
    data: {
      id: 'cr_english_mastery',
      title: 'English Communication Mastery',
      description: 'Improve your English speaking, writing, and communication skills with practical exercises and real-life scenarios. Speak English Confidently in 60 Days.',
      thumbnail: '/courses/cr_english_mastery.jpg',
      difficulty: 'BEGINNER',
      duration: 1000, // 16h 40m = 1000 minutes
      instructorId: instructor.id,
      learningPathId: learningPath.id,
      isActive: true,
    }
  })
  console.log(`Created course: ${course.title} (ID: ${course.id})`)

  // Define all 70 lessons
  const lessons = [
    // Module 1: Foundation Building (6 lessons, 100 min)
    { id: 'cr_ecm_101', title: 'Understanding English Fear', duration: 12, order: 1, content: '## Why do people fear speaking English?\nFear comes from feeling judged for "wrong" grammar or pronunciation. But in reality, most people care more about understanding your message than perfect English.\n\n## Why does English matter in India?\nEnglish is a connecting language across India\'s diverse languages. Most professional opportunities, government exams, and higher education require English communication skills.\n\n## Where do people make mistakes?\n1. Waiting to speak "perfect" English before starting conversations\n2. Focusing on grammar more than clarity of message\n3. Avoiding English-speaking situations due to fear\n4. Mixing up formal and informal English in wrong contexts\n\n## What should you do next?\n✅ Start speaking English regardless of mistakes - fluency comes with practice\n✅ Focus on being understood rather than speaking perfectly\n✅ Practice with simple conversations before moving to complex topics\n✅ Watch English content with subtitles to improve understanding' },
    { id: 'cr_ecm_102', title: 'Basic Grammar Refresh', duration: 25, order: 2, content: '## Key Grammar Concepts\nA quick refresh of essential grammar rules that form the foundation of English communication.\n\n## Topics Covered\n- Sentence Structure (Subject + Verb + Object)\n- Common Tenses (Present, Past, Future)\n- Subject-Verb Agreement\n- Articles (A, An, The)\n- Basic Prepositions\n\n## Practice Exercises\nComplete the exercises to reinforce your understanding of these fundamental concepts.' },
    { id: 'cr_ecm_103', title: 'Common Mistakes to Avoid', duration: 20, order: 3, content: '## Common English Mistakes Indians Make\nLearn about the most frequent errors and how to avoid them.\n\n## Mistake 1: Direct Translations\nTranslating directly from Hindi/regional languages to English.\n\n## Mistake 2: Overusing "Very"\nLearning alternatives to make your English more expressive.\n\n## Mistake 3: Wrong Word Order\nUnderstanding the correct order of words in English sentences.\n\n## Mistake 4: Confusion with Singular/Plural\nUsing the correct form of nouns and verbs.' },
    { id: 'cr_ecm_104', title: 'Building Confidence', duration: 18, order: 4, content: '## Building Confidence in Speaking English\nPractical techniques to overcome shyness and speak with confidence.\n\n## Technique 1: Self-Talk\nPositive affirmations and mindset shifts.\n\n## Technique 2: Practice Aloud\nReading and speaking alone before speaking to others.\n\n## Technique 3: Record Yourself\nListening to your own voice to improve.\n\n## Technique 4: Start Small\nBeginning with low-stakes conversations.' },
    { id: 'cr_ecm_105', title: 'Daily Practice Routine', duration: 15, order: 5, content: '## Your Daily English Practice Plan\nA structured 30-minute daily routine to improve your English.\n\n## Morning (10 minutes)\n- Read an English article or news\n- Learn 5 new words\n\n## Afternoon (10 minutes)\n- Watch a short English video\n- Take notes on new phrases\n\n## Evening (10 minutes)\n- Speak aloud for 5 minutes\n- Write 3-5 sentences about your day' },
    { id: 'cr_ecm_106', title: 'Self-Assessment Quiz', duration: 10, order: 6, content: '## Module 1 Assessment\nTest your understanding of the foundational concepts covered in this module.\n\n## Questions\n1. What is the main cause of English fear?\n2. Name 3 common grammar mistakes.\n3. How can you build confidence in speaking?\n\n## Submit your answers and check your progress.' },

    // Module 2: Grammar Mastery (6 lessons, 137 min)
    { id: 'cr_ecm_201', title: 'Tenses Made Easy', duration: 30, order: 7, content: '## Mastering English Tenses\nUnderstanding and using all 12 tenses correctly.\n\n## Present Tenses\n- Simple Present\n- Present Continuous\n- Present Perfect\n\n## Past Tenses\n- Simple Past\n- Past Continuous\n- Past Perfect\n\n## Future Tenses\n- Simple Future\n- Will vs Going to\n- Future Continuous' },
    { id: 'cr_ecm_202', title: 'Subject-Verb Agreement', duration: 25, order: 8, content: '## Subject-Verb Agreement\nEnsuring your verbs match their subjects.\n\n## Rule 1: Singular/Plural\nWhen the subject is singular, use singular verb.\n\n## Rule 2: Compound Subjects\n"and" makes subjects plural, but some exceptions exist.\n\n## Rule 3: Collective Nouns\nTreating groups as single units or multiple individuals.\n\n## Rule 4: Indefinite Pronouns\nEach, every, anyone, everyone - always singular.' },
    { id: 'cr_ecm_203', title: 'Articles: A, An, The', duration: 20, order: 9, content: '## Using Articles Correctly\nWhen to use A, An, and The.\n\n## Indefinite Articles: A and An\n- Use "a" before consonant sounds\n- Use "an" before vowel sounds\n\n## Definite Article: The\n- Use when referring to something specific\n- First mention: no article\n- Second mention: use "the"\n\n## Special Cases\n- Geographical names\n- Proper nouns\n- Abstract nouns' },
    { id: 'cr_ecm_204', title: 'Prepositions Practice', duration: 22, order: 10, content: '## Common Prepositions in English\nMastering prepositions of time, place, and direction.\n\n## Prepositions of Time\n- At, On, In\n- Since, For, During\n\n## Prepositions of Place\n- In, On, At\n- Above, Below, Between\n\n## Prepositions of Direction\n- To, From, Towards\n- Into, Out of, Through' },
    { id: 'cr_ecm_205', title: 'Active vs Passive Voice', duration: 25, order: 11, content: '## Active and Passive Voice\nWhen and how to use each voice effectively.\n\n## Active Voice\n- Subject performs the action\n- More direct and clear\n- Preferred for most writing\n\n## Passive Voice\n- Object becomes the subject\n- Useful when the doer is unknown\n- Common in formal/scientific writing\n\n## Converting Between Voices\nStep-by-step transformation techniques.' },
    { id: 'cr_ecm_206', title: 'Module Quiz: Grammar', duration: 15, order: 12, content: '## Module 2 Grammar Quiz\nTest your grammar mastery.\n\n## Question Types\n- Fill in the blanks\n- Error correction\n- Sentence transformation\n\n## Passing Score: 70%' },

    // Module 3: Speaking Confidence (7 lessons, 120 min)
    { id: 'cr_ecm_301', title: 'Pronunciation Basics', duration: 20, order: 13, content: '## English Pronunciation Fundamentals\nMastering the sounds of English.\n\n## Vowel Sounds\nLong vs short vowels\nDiphthongs\n\n## Consonant Sounds\nCommon problem sounds for Indians\n- TH sounds\n- R vs L\n- V vs W\n\n## Word Stress\nWhere to place stress in words\nSentence stress and rhythm' },
    { id: 'cr_ecm_302', title: 'Intonation & Stress', duration: 18, order: 14, content: '## Intonation and Stress Patterns\nAdding melody and emphasis to your speech.\n\n## Rising Intonation\nQuestions, lists, uncertainty\n\n## Falling Intonation\nStatements, commands, certainty\n\n## Stress in Sentences\nContent words vs function words\nEmphatic stress' },
    { id: 'cr_ecm_303', title: 'Speaking Fluently', duration: 25, order: 15, content: '## Achieving Fluency in English\nTechniques to speak smoothly and naturally.\n\n## Chunking\nGrouping words for natural flow\n\n## Pausing\nStrategic pauses for impact\n\n## Filler Words\nWhen to use and avoid them\n\n## Shadowing\nPractice technique using native speaker audio' },
    { id: 'cr_ecm_304', title: 'Overcoming Hesitation', duration: 15, order: 16, content: '## Stopping Hesitation\nHow to speak without pauses and "ums".\n\n## Think in English\nShift your internal dialogue\n\n## Use Templates\nReady-made phrases for common situations\n\n## Practice Conversations\nLow-pressure speaking exercises\n\n## Build Your Phrase Bank\nCollection of useful expressions' },
    { id: 'cr_ecm_305', title: 'Daily Speaking Exercises', duration: 20, order: 17, content: '## 30-Day Speaking Challenge\nA structured plan to improve your spoken English.\n\n## Week 1: Basics\nSelf-introductions, describing your day\n\n## Week 2: Conversations\nPhone calls, asking for directions\n\n## Week 3: Professional\nMeetings, presentations\n\n## Week 4: Advanced\nDebates, storytelling, negotiations' },
    { id: 'cr_ecm_306', title: 'Tongue Twisters Practice', duration: 12, order: 18, content: '## English Tongue Twisters\nFun exercises to improve articulation.\n\n## Beginner Twisters\n- She sells seashells\n- Peter Piper picked\n\n## Intermediate Twisters\n- Red lorry, yellow lorry\n- How can a clam cram in a clean cream can\n\n## Advanced Twisters\n- The sixth sick sheik\'s sixth sheep is sick\nPractice daily for best results!' },
    { id: 'cr_ecm_307', title: 'Module Assessment', duration: 10, order: 19, content: '## Module 3 Speaking Assessment\nEvaluate your speaking progress.\n\n## Assessment Areas\n- Pronunciation clarity\n- Fluency rating\n- Confidence level\n\n## Record and Submit\nUpload a 2-minute speaking sample.' },

    // Module 4: Vocabulary Building (7 lessons, 158 min)
    { id: 'cr_ecm_401', title: '500 Essential Words', duration: 30, order: 20, content: '## Most Important 500 English Words\nLearn the words you\'ll use 80% of the time.\n\n## Word Categories\n- Common verbs (action words)\n- Essential adjectives\n- Important nouns\n- Frequently used adverbs\n\n## Learning Method\nSpaced repetition technique\nFlashcard exercises\nDaily word challenges' },
    { id: 'cr_ecm_402', title: 'Synonyms & Antonyms', duration: 20, order: 21, content: '## Expanding Your Word Bank\nUsing synonyms and antonyms effectively.\n\n## Synonyms\nWords with similar meanings\n- Big: large, huge, enormous\n- Smart: intelligent, clever, bright\n\n## Antonyms\nWords with opposite meanings\n- Big: small, tiny\n- Smart: stupid, dull\n\n## Usage in Context\nChoosing the right word for the right situation.' },
    { id: 'cr_ecm_403', title: 'Idioms & Phrases', duration: 25, order: 22, content: '## Common English Idioms\nUnderstanding and using figurative language.\n\n## Business Idioms\n- Hit the ground running\n- Get the ball rolling\n- Touch base\n\n## Daily Life Idioms\n- Break a leg\n- Piece of cake\n- Under the weather\n\n## Creating Your Idioms List\nNote idioms you hear and practice using them.' },
    { id: 'cr_ecm_404', title: 'Business Vocabulary', duration: 28, order: 23, content: '## Professional English Words\nEssential vocabulary for the workplace.\n\n## Meeting Vocabulary\n- Agenda, minutes, action items\n- Propose, second, motion\n\n## Email Vocabulary\n- Subject line, attachment, CC\n- Reply, forward, bounce\n\n## Presentation Vocabulary\n- Slides, charts, visuals\n- Q&A, feedback, takeaways' },
    { id: 'cr_ecm_405', title: 'Word Formation', duration: 22, order: 24, content: '## Building Words from Roots\nUnderstanding how English words are formed.\n\n## Prefixes\n- Un-, Re-, Pre-, Dis-\n- Meaning changes with prefixes\n\n## Suffixes\n- -tion, -ness, -ment, -able\n- Changing word types\n\n## Compound Words\nTwo words, one meaning\n- Homepage, keyboard, teamwork' },
    { id: 'cr_ecm_406', title: 'Vocabulary Flashcards', duration: 15, order: 25, content: '## Flashcard Learning System\nEffective technique for vocabulary retention.\n\n## Creating Cards\nFront: Word + Example sentence\nBack: Meaning + Pronunciation\n\n## Review Schedule\nDay 1, Day 3, Day 7, Day 14, Day 30\n\n## Practice Games\nMatch, fill blanks, speed round' },
    { id: 'cr_ecm_407', title: 'Daily Word Practice', duration: 18, order: 26, content: '## Vocabulary Building Routine\nLearn 5 new words every day.\n\n## Morning: Discover\nRead an article, identify 5 new words\n\n## Afternoon: Understand\nLook up meanings, examples\n\n## Evening: Use\nWrite sentences, speak aloud\n\n## Weekly Review\nTest yourself on all 35 words' },

    // Module 5: Professional Writing (6 lessons, 138 min)
    { id: 'cr_ecm_501', title: 'Email Writing Basics', duration: 25, order: 27, content: '## Professional Email Structure\nThe anatomy of a perfect work email.\n\n## Subject Line\nClear, concise, descriptive\n\n## Greeting\nFormal vs informal greetings\n\n## Body\nPurpose, details, call to action\n\n## Closing\nProfessional sign-offs\n\n## Signature\nProfessional email signature format' },
    { id: 'cr_ecm_502', title: 'Formal vs Informal Emails', duration: 20, order: 28, content: '## Knowing Your Audience\nWhen to be formal and when to be casual.\n\n## Formal Emails\n- To managers, clients, seniors\n- Complete sentences, proper grammar\n\n## Informal Emails\n- To colleagues, friends\n- Shorter, more conversational\n\n## Same Email, Different Tone\nExamples of both styles' },
    { id: 'cr_ecm_503', title: 'Professional Report Writing', duration: 30, order: 29, content: '## Business Report Structure\nWriting comprehensive and professional reports.\n\n## Report Components\n- Executive Summary\n- Introduction\n- Findings\n- Recommendations\n\n## Data Presentation\nTables, charts, graphs\n\n## Conclusion\nSummarizing key points\nAction items' },
    { id: 'cr_ecm_504', title: 'Business Letter Format', duration: 25, order: 30, content: '## Traditional Business Letters\nFormat and structure of formal correspondence.\n\n## Components\n- Sender\'s address\n- Date\n- Recipient\'s address\n- Salutation\n- Body\n- Complimentary close\n- Signature\n\n## Sample Letters\nRequest letter, complaint letter, inquiry letter' },
    { id: 'cr_ecm_505', title: 'Writing Memos & Notes', duration: 18, order: 31, content: '## Memos and Internal Notes\nQuick and effective internal communication.\n\n## Memo Format\n- To, From, Date, Subject\n- Purpose statement\n- Key information\n- Action items\n\n## Meeting Notes\n- Attendees, agenda\n- Discussion points\n- Decisions made\n- Next steps\n\n## Effective Communication\nClear, concise, action-oriented' },
    { id: 'cr_ecm_506', title: 'Email Templates Practice', duration: 20, order: 32, content: '## Ready-to-Use Email Templates\nCopy, customize, and send.\n\n## Template Categories\n- Request information\n- Schedule meeting\n- Follow up\n- Apology\n- Appreciation\n\n## Practice Exercises\nComplete 10 email writing exercises.' },

    // Module 6: Interview Skills (6 lessons, 168 min)
    { id: 'cr_ecm_601', title: 'Common Interview Questions', duration: 30, order: 33, content: '## Top 20 Interview Questions\nPrepare winning answers to common questions.\n\n## About Yourself\n- Tell me about yourself\n- Why should we hire you?\n\n## About Experience\n- Describe your experience\n- What are your strengths?\n\n## About Challenges\n- Tell me about a challenge\n- How do you handle stress?\n\n## About Future\n- Where do you see yourself?\n- Why do you want this job?' },
    { id: 'cr_ecm_602', title: 'Tell Me About Yourself', duration: 25, order: 34, content: '## The Perfect Self-Introduction\nCrafting your 2-minute pitch.\n\n## Structure\n- Opening (name, current role)\n- Background (relevant experience)\n- Achievement (one key success)\n- Goal (why this role)\n\n## Do\'s and Don\'ts\n✅ Be concise, relevant, confident\n❌ Don\'t recite your entire resume' },
    { id: 'cr_ecm_603', title: 'STAR Method for Answers', duration: 28, order: 35, content: '## STAR Method for Behavioral Questions\nStructure your answers effectively.\n\n## S - Situation\nSet the context\n\n## T - Task\nDescribe your responsibility\n\n## A - Action\nExplain what you did\n\n## R - Result\nShare the outcome\n\n## Practice Scenarios\nWrite STAR answers for 5 common questions.' },
    { id: 'cr_ecm_604', title: 'Body Language Tips', duration: 20, order: 36, content: '## Non-Verbal Communication\nWhat your body says before you speak.\n\n## Positive Signals\n- Eye contact (60-70%)\n- Firm handshake\n- Good posture\n- Nodding\n\n## Negative Signals\n- Avoiding eye contact\n- Fidgeting\n- Crossing arms\n- Looking down\n\n## Virtual Interview Tips\nCamera positioning, background, lighting' },
    { id: 'cr_ecm_605', title: 'Mock Interview Practice', duration: 35, order: 37, content: '## Practice Makes Perfect\nInteractive mock interview exercises.\n\n## Exercise 1\nRecord yourself answering 5 questions\n\n## Exercise 2\nPractice with a friend or mentor\n\n## Exercise 3\nVirtual interview simulation\n\n## Feedback Checklist\nReview your recordings and improve.' },
    { id: 'cr_ecm_606', title: 'Interview Role Play', duration: 30, order: 38, content: '## Real-World Scenarios\nPractice with common interview situations.\n\n## Scenario 1\nTechnical interview simulation\n\n## Scenario 2\nHR interview simulation\n\n## Scenario 3\nPanel interview simulation\n\n## Scenario 4\nStress interview simulation\n\n## Record and review your performance.' },

    // Module 7: Presentation Skills (6 lessons, 145 min)
    { id: 'cr_ecm_701', title: 'Presentation Structure', duration: 25, order: 39, content: '## Anatomy of a Great Presentation\nPlanning your content for maximum impact.\n\n## Opening\nHook, introduction, agenda\n\n## Body\n3-5 key points\nTransitions between points\n\n## Closing\nSummary\nCall to action\nQ&A\n\n## Timing\nAllocate time for each section.' },
    { id: 'cr_ecm_702', title: 'Opening & Closing Hooks', duration: 20, order: 40, content: '## Capturing Attention\nTechniques for memorable openings and closings.\n\n## Opening Hooks\n- Startling statistic\n- Relevant story\n- Provocative question\n- Powerful quote\n\n## Closing Hooks\n- Call to action\n- Future vision\n- Key takeaway\n- Quote or story\n\n## Practice\nCraft hooks for your presentations.' },
    { id: 'cr_ecm_703', title: 'Visual Aid Usage', duration: 22, order: 41, content: '## PowerPoint and Visuals\nCreating effective presentation slides.\n\n## Slide Design\n- Less text, more visuals\n- Consistent fonts and colors\n- Readable fonts (24pt+)\n\n## Charts and Graphs\nWhen to use what\nData visualization tips\n\n## Images\nQuality, relevance, attribution\n\n## Videos and Audio\nEmbedding media effectively' },
    { id: 'cr_ecm_704', title: 'Handling Q&A Session', duration: 18, order: 42, content: '## Answering Questions Confidently\nNavigating the Q&A portion of presentations.\n\n## Types of Questions\n- Clarifying questions\n- Challenging questions\n- Off-topic questions\n\n## Techniques\n- Listen fully before answering\n- Repeat or rephrase the question\n- Buy time if needed\n- Admit if you don\'t know\n\n## Managing Difficult Audiences' },
    { id: 'cr_ecm_705', title: 'Virtual Presentation Tips', duration: 20, order: 43, content: '## Mastering Online Presentations\nEngaging virtual audiences.\n\n## Technical Setup\n- Stable internet\n- Good microphone\n- Proper lighting\n\n## Engagement Techniques\n- Polls and chat\n- Breakout rooms\n- Interactive questions\n\n## Common Issues\n- Technical glitches\n- Connection problems\n- Audience fatigue' },
    { id: 'cr_ecm_706', title: 'Practice Presentation', duration: 40, order: 44, content: '## Final Presentation Project\nApply everything you\'ve learned.\n\n## Requirements\n- 5-7 minute presentation\n- 3-5 slides minimum\n- Include opening hook\n- Q&A section\n\n## Submission\n- Video recording\n- Self-evaluation\n- Peer feedback form' },

    // Module 8: Conversation Skills (6 lessons, 123 min)
    { id: 'cr_ecm_801', title: 'Starting Conversations', duration: 18, order: 45, content: '## Icebreakers and Openers\nHow to start conversations with anyone.\n\n## With Strangers\n- Context-based opening\n- Compliment + question\n\n## At Events\n- "What brings you here?"\n- "I noticed..." technique\n\n## In Professional Settings\n- Business card exchange\n- Finding common ground\n\n## Practice Exercises\nRole-play different scenarios.' },
    { id: 'cr_ecm_802', title: 'Active Listening', duration: 20, order: 46, content: '## The Art of Listening\nListening is as important as speaking.\n\n## Key Techniques\n- Pay full attention\n- Don\'t interrupt\n- Use verbal cues ("I see", "Go on")\n- Paraphrase to confirm\n\n## Non-Verbal Listening\n- Nodding\n- Eye contact\n- Leaning in\n\n## Overcoming Distractions\nTips for focusing in noisy environments.' },
    { id: 'cr_ecm_803', title: 'Small Talk Mastery', duration: 22, order: 47, content: '## Making Great Small Talk\nThe gateway to deeper conversations.\n\n## Safe Topics\n- Weather\n- Work/School\n- Hobbies\n- Local events\n\n## Topics to Avoid\n- Salary\n- Politics\n- Religion\n- Personal issues\n\n## Extending Conversations\nHow to go from small talk to real talk.' },
    { id: 'cr_ecm_804', title: 'Asking Questions Properly', duration: 18, order: 48, content: '## The Art of Questioning\nOpen vs closed questions.\n\n## Open Questions\n- Start with who, what, where, when, why, how\n- Encourage detailed answers\n\n## Closed Questions\n- Yes/No answers\n- Quick facts\n\n## Follow-Up Questions\n- Digging deeper\n- Showing interest\n\n## Practice\nConversation simulation exercises.' },
    { id: 'cr_ecm_805', title: 'Giving Opinions', duration: 20, order: 49, content: '## Expressing Your Views\nSharing opinions diplomatically.\n\n## Phrases for Opinions\n- "In my opinion..."\n- "From my perspective..."\n- "I believe that..."\n\n## Agreeing/Disagreeing\n- Partial agreement\n- Soft disagreement\n- Asking for others\' views\n\n## Handling Opposing Views\nRespectful debate techniques.' },
    { id: 'cr_ecm_806', title: 'Role Play Scenarios', duration: 25, order: 50, content: '## Conversation Practice\nReal-world conversation simulations.\n\n## Scenario 1\nNetworking at a conference\n\n## Scenario 2\nResolving a customer complaint\n\n## Scenario 3\nAsking for a favor\n\n## Scenario 4\nExpressing disagreement politely\n\n## Record and evaluate your performance.' },

    // Module 9: Business Communication (7 lessons, 155 min)
    { id: 'cr_ecm_901', title: 'Professional Phone Calls', duration: 20, order: 51, content: '## Phone Etiquette 101\nMaking and receiving professional calls.\n\n## Opening\n- Greeting\n- Self-introduction\n- Asking for the person\n\n## During Call\n- Clear speaking\n- Note-taking\n- Confirmation\n\n## Closing\n- Summary\n- Next steps\n- Polite goodbye\n\n## Voicemail\nLeaving effective messages.' },
    { id: 'cr_ecm_902', title: 'Video Conference Etiquette', duration: 18, order: 52, content: '## Virtual Meeting Best Practices\nProfessionalism in video calls.\n\n## Before Meeting\n- Test your equipment\n- Check your background\n- Join 2 minutes early\n\n## During Meeting\n- Camera on\n- Mute when not speaking\n- Participate actively\n\n## After Meeting\n- Follow-up email\n- Action items\n- Thank you notes' },
    { id: 'cr_ecm_903', title: 'Meeting Participation', duration: 22, order: 53, content: '## Contributing Effectively in Meetings\nMaking your voice heard.\n\n## Preparation\n- Review agenda\n- Prepare points\n- Research topics\n\n## During Meeting\n- Listen actively\n- Speak at appropriate times\n- Build on others\' points\n\n## Assertiveness\nHow to speak up without being aggressive.' },
    { id: 'cr_ecm_904', title: 'Negotiation Language', duration: 25, order: 54, content: '## Negotiation Techniques\nGetting what you want while maintaining relationships.\n\n## Opening\n- Setting expectations\n- Understanding the other side\n\n## Bargaining\n- Making the first offer\n- Trade-offs and concessions\n\n## Closing\n- Summarize terms\n- Confirm agreement\n- Next steps\n\n## Phrases for Negotiation' },
    { id: 'cr_ecm_905', title: 'Conflict Resolution', duration: 20, order: 55, content: '## Managing Workplace Conflicts\nTurning disagreements into solutions.\n\n## Understanding Conflict\n- Different perspectives\n- Underlying interests\n\n## Resolution Steps\n1. Identify the problem\n2. Listen to all sides\n3. Find common ground\n4. Generate solutions\n5. Agree on action\n\n## De-escalation Phrases' },
    { id: 'cr_ecm_906', title: 'Writing Proposals', duration: 28, order: 56, content: '## Persuasive Proposal Writing\nGetting your ideas approved.\n\n## Proposal Structure\n- Executive summary\n- Problem statement\n- Solution\n- Benefits\n- Budget\n- Timeline\n\n## Persuasive Language\nStrong verbs\nBenefit-focused language\n\n## Review Checklist\nBefore submitting your proposal.' },
    { id: 'cr_ecm_907', title: 'Client Communication', duration: 22, order: 57, content: '## Client Relationship Management\nMaintaining professional client relationships.\n\n## Communication Channels\n- Email\n- Phone\n- In-person\n- Chat\n\n## Managing Expectations\n- Clear deliverables\n- Timelines\n- Updates\n\n## Handling Complaints\nEmpathy + Solution approach\n\n## Building Long-term Relationships' },

    // Module 10: Advanced Communication (7 lessons, 180 min)
    { id: 'cr_ecm_1001', title: 'Public Speaking Basics', duration: 30, order: 58, content: '## Overcoming Stage Fright\nConquering fear of public speaking.\n\n## Understanding Fear\n- It\'s normal\n- Physical symptoms\n- Mental tricks\n\n## Preparation\n- Know your material\n- Practice extensively\n- Visualize success\n\n## During Speech\n- Power poses\n- Breathing techniques\n- Focus on message\n\n## Audience Connection' },
    { id: 'cr_ecm_1002', title: 'Storytelling in Business', duration: 25, order: 59, content: '## The Power of Stories\nUsing narratives in professional communication.\n\n## Story Structure\n- Beginning (Setup)\n- Middle (Conflict)\n- End (Resolution)\n\n## Types of Stories\n- Personal anecdotes\n- Customer success stories\n- Brand stories\n\n## Crafting Your Story\nFinding and refining your stories.' },
    { id: 'cr_ecm_1003', title: 'Persuasion Techniques', duration: 28, order: 60, content: '## The Art of Persuasion\nInfluencing others ethically.\n\n## persuasion Principles\n- Reciprocity\n- Social proof\n- Authority\n- Consistency\n- Liking\n- Scarcity\n\n## Aristotle\'s Ethos, Pathos, Logos\nCredibility, emotion, logic\n\n## Practice\nPersuade your manager for a project.' },
    { id: 'cr_ecm_1004', title: 'Cross-Cultural Communication', duration: 22, order: 61, content: '## Communicating Across Cultures\nNavigating global business environments.\n\n## Cultural Dimensions\n- High vs Low context\n- Power distance\n- Individual vs Collective\n\n## Regional Differences\n- Western business culture\n- Asian business culture\n- Middle Eastern culture\n\n## Adapting Your Style' },
    { id: 'cr_ecm_1005', title: 'Writing for Social Media', duration: 20, order: 62, content: '## Social Media English\nProfessional yet engaging content.\n\n## Platform Differences\n- LinkedIn (professional)\n- Twitter (concise)\n- Facebook (conversational)\n- Instagram (visual + caption)\n\n## Engagement Techniques\n- Questions\n- Calls to action\n- Hashtags\n\n## Brand Voice\nMaintaining consistency' },
    { id: 'cr_ecm_1006', title: 'Leadership Communication', duration: 25, order: 63, content: '## Communicating as a Leader\nInspiring and motivating teams.\n\n## Key Leadership Qualities\n- Clarity\n- Empathy\n- Consistency\n\n## Communication Styles\n- Vision casting\n- Feedback delivery\n- Recognition\n\n## Motivational Speaking\nInspiring your team.' },
    { id: 'cr_ecm_1007', title: 'Final Assessment', duration: 30, order: 64, content: '## Course Final Assessment\nComprehensive test of all your skills.\n\n## Sections\n1. Grammar (20 questions)\n2. Vocabulary (20 questions)\n3. Writing (2 exercises)\n4. Speaking (recording)\n\n## Passing Score: 70%\n\n## Certificate\nComplete all modules and pass the final to receive your English Communication Mastery certificate!' },
  ]

  console.log(`\nAdding ${lessons.length} lessons across 10 modules...`)

  // Create all lessons
  for (const lesson of lessons) {
    await prisma.lesson.create({
      data: {
        id: lesson.id,
        courseId: course.id,
        title: lesson.title,
        content: lesson.content,
        duration: lesson.duration,
        order: lesson.order,
        isActive: true,
      }
    })
    console.log(`  ✅ Lesson ${lesson.order}: ${lesson.title} (${lesson.duration} min)`)
  }

  // Count lessons
  const lessonCount = await prisma.lesson.count({
    where: { courseId: course.id }
  })

  const totalDuration = await prisma.lesson.aggregate({
    where: { courseId: course.id },
    _sum: { duration: true }
  })

  console.log(`\n✅ Successfully added English Communication Mastery!`)
  console.log(`   Total Lessons: ${lessonCount}`)
  console.log(`   Total Duration: ${totalDuration._sum.duration} minutes (${Math.floor((totalDuration._sum.duration || 0) / 60)}h ${(totalDuration._sum.duration || 0) % 60}m)`)
  console.log(`   Course ID: ${course.id}`)

  await prisma.$disconnect()
}

main().catch(console.error)
