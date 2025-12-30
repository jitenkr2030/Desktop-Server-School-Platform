// ============================================
// INR99 Academy - Unified Course Data
// Single source of truth for all course content
// Eliminates database dependency
// ============================================

export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  expertise: string[];
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration: number; // in minutes
  content: string; // Video URL or text content
  isFree: boolean;
  order: number;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  order: number;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  previewVideo: string;
  price: number;
  originalPrice: number;
  currency: string;
  
  // Categorization
  category: string;
  subcategory: string;
  vertical: 'school' | 'college' | 'professional' | 'general';
  targetAudience: string[];
  tags: string[];
  
  // Metadata
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all';
  language: string;
  totalDuration: number; // in minutes
  lessonCount: number;
  moduleCount: number;
  rating: number;
  reviewCount: number;
  enrollmentCount: number;
  isActive: boolean;
  isFeatured: boolean;
  
  // Content Structure
  modules: Module[];
  
  // Instructor
  instructor: Instructor;
  
  // Learning Outcomes
  outcomes: string[];
  requirements: string[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Instructors Data
// ============================================

const instructors: Instructor[] = [
  {
    id: "instructor-1",
    name: "Dr. Rajesh Kumar",
    title: "Senior Software Architect",
    avatar: "/instructors/rajesh.jpg",
    bio: "15+ years of experience in software development with expertise in Python, Machine Learning, and System Design. Former Tech Lead at Amazon.",
    expertise: ["Python", "Machine Learning", "System Design", "AWS"]
  },
  {
    id: "instructor-2",
    name: "Priya Sharma",
    title: "Finance Expert & Investment Advisor",
    avatar: "/instructors/priya.jpg",
    bio: "CFA charterholder with 12 years of experience in wealth management. Specializes in Indian financial markets and personal finance.",
    expertise: ["Personal Finance", "Investing", "Taxation", "Portfolio Management"]
  },
  {
    id: "instructor-3",
    name: "Amit Patel",
    title: "Digital Marketing Strategist",
    avatar: "/instructors/amit.jpg",
    bio: "Helped 500+ businesses grow their online presence. Certified Google & Facebook Ads expert with 8+ years in digital marketing.",
    expertise: ["SEO", "Google Ads", "Social Media Marketing", "Analytics"]
  },
  {
    id: "instructor-4",
    name: "Sneha Reddy",
    title: "UX Design Lead",
    avatar: "/instructors/sneha.jpg",
    bio: "10 years designing experiences for Fortune 500 companies. Product Design lead at a leading fintech startup.",
    expertise: ["UI Design", "UX Research", "Figma", "Design Systems"]
  },
  {
    id: "instructor-5",
    name: "Vikram Singh",
    title: "Career Coach & HR Consultant",
    avatar: "/instructors/vikram.jpg",
    bio: "Former HR Director at TCS with 18 years of experience in talent acquisition and career development.",
    expertise: ["Resume Building", "Interview Preparation", "LinkedIn Optimization", "Career Strategy"]
  },
  {
    id: "instructor-6",
    name: "Ananya Iyer",
    title: "Data Science Consultant",
    avatar: "/instructors/ananya.jpg",
    bio: "PhD in Data Science from IIT Bombay. Worked with top consulting firms on AI and analytics projects.",
    expertise: ["Python", "Data Science", "Machine Learning", "SQL"]
  },
  {
    id: "instructor-7",
    name: "Rahul Mehta",
    title: "Entrepreneurship Coach",
    avatar: "/instructors/rahul.jpg",
    bio: "Serial entrepreneur with 3 successful exits. Currently running a startup incubator helping new entrepreneurs.",
    expertise: ["Startup Strategy", "Business Planning", "Fundraising", "Growth Hacking"]
  },
  {
    id: "instructor-8",
    name: "Dr. Meera Krishnan",
    title: "Physics Professor",
    avatar: "/instructors/meera.jpg",
    bio: "PhD from Cambridge University. 20 years of teaching experience with expertise in making complex concepts simple.",
    expertise: ["Physics", "Mathematics", "Exam Preparation", "Competitive Exams"]
  }
];

// ============================================
// Course Categories
// ============================================

export const CATEGORIES = [
  { id: "foundational", name: "Foundational Learning", icon: "🧠" },
  { id: "finance", name: "Money, Finance & Economics", icon: "💰" },
  { id: "business", name: "Business, Commerce & Entrepreneurship", icon: "🧾" },
  { id: "technology", name: "Technology & Computer Science", icon: "💻" },
  { id: "design", name: "Design, Creative & Media", icon: "🎨" },
  { id: "marketing", name: "Marketing, Sales & Growth", icon: "📢" },
  { id: "career", name: "Career, Jobs & Professional Development", icon: "🧑‍💼" },
  { id: "science", name: "Science, Engineering & Research", icon: "🧪" },
  { id: "health", name: "Health, Fitness & Well-being", icon: "🧬" },
  { id: "language", name: "Language & Communication", icon: "🌍" },
  { id: "civics", name: "Government, Civics & Awareness", icon: "🏛" },
  { id: "ecommerce", name: "E-commerce & Online Business", icon: "🛍" },
  { id: "gaming", name: "Gaming, Esports & New-age Careers", icon: "🎮" },
  { id: "lifeskills", name: "Life Skills & Practical Knowledge", icon: "🏠" },
  { id: "tools", name: "DIY, Tools & Practical Skills", icon: "🧰" },
  { id: "spirituality", name: "Spirituality, Philosophy & Thinking", icon: "🧭" },
  { id: "safety", name: "Safety, Law & Awareness", icon: "🔒" },
  { id: "community", name: "Community-led Learning", icon: "🧑‍🤝‍🧑" },
  { id: "exam-prep", name: "Exam Support", icon: "📚" }
];

export const VERTICALS = [
  { id: "school", name: "School Learning (Class 1-12)", description: "CBSE, ICSE, and State Board curriculum coverage" },
  { id: "college", name: "College Learning", description: "Degree programs and professional courses" },
  { id: "professional", name: "Professional Development", description: "Career skills and upskilling" },
  { id: "general", name: "General Learning", description: "Skills for everyone" }
];

// ============================================
// Courses Data
// ============================================

export const courses: Course[] = [
  // ==================== TECHNOLOGY ====================
  {
    id: "python-masterclass",
    slug: "python-masterclass",
    title: "Complete Python Programming Masterclass",
    tagline: "From Zero to Python Developer in 2025",
    description: "Master Python programming from scratch with hands-on projects, real-world examples, and expert guidance.",
    longDescription: `This comprehensive Python course takes you from absolute beginner to confident Python developer. You'll learn Python fundamentals, object-oriented programming, data structures, file handling, and more.

Through 12 real-world projects including a URL shortener, portfolio website, data analyzer, and automation tools, you'll gain practical experience that employers value.

Perfect for:
- Complete beginners with no programming experience
- Anyone wanting to switch to a tech career
- Professionals looking to automate tasks
- Students preparing for coding interviews`,
    thumbnail: "/courses/python-masterclass/thumbnail.jpg",
    previewVideo: "https://youtube.com/watch?v=python-preview",
    price: 99,
    originalPrice: 1999,
    currency: "INR",
    
    category: "technology",
    subcategory: "Programming",
    vertical: "professional",
    targetAudience: ["students", "professionals", "career-changers"],
    tags: ["python", "programming", "coding", "beginner-friendly", "automation"],
    
    difficulty: "beginner",
    language: "Hindi-English",
    totalDuration: 2400,
    lessonCount: 180,
    moduleCount: 12,
    rating: 4.8,
    reviewCount: 2450,
    enrollmentCount: 15000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-python-1",
        title: "Getting Started with Python",
        order: 1,
        lessons: [
          { id: "les-1", title: "Welcome to the Course", type: "video", duration: 5, content: "", isFree: true, order: 1 },
          { id: "les-2", title: "Installing Python & Setting Up Environment", type: "video", duration: 15, content: "", isFree: true, order: 2 },
          { id: "les-3", title: "Your First Python Program", type: "video", duration: 12, content: "", isFree: false, order: 3 },
          { id: "les-4", title: "Understanding Python Syntax", type: "video", duration: 20, content: "", isFree: false, order: 4 },
          { id: "les-5", title: "Python Comments & Best Practices", type: "video", duration: 10, content: "", isFree: false, order: 5 },
          { id: "les-6", title: "Module Quiz", type: "quiz", duration: 10, content: "", isFree: false, order: 6 }
        ]
      },
      {
        id: "mod-python-2",
        title: "Variables & Data Types",
        order: 2,
        lessons: [
          { id: "les-7", title: "Understanding Variables", type: "video", duration: 18, content: "", isFree: false, order: 1 },
          { id: "les-8", title: "Numbers & Arithmetic Operations", type: "video", duration: 22, content: "", isFree: false, order: 2 },
          { id: "les-9", title: "Strings in Depth", type: "video", duration: 25, content: "", isFree: false, order: 3 },
          { id: "les-10", title: "Lists & Arrays", type: "video", duration: 28, content: "", isFree: false, order: 4 },
          { id: "les-11", title: "Tuples & Sets", type: "video", duration: 20, content: "", isFree: false, order: 5 },
          { id: "les-12", title: "Dictionaries & Maps", type: "video", duration: 25, content: "", isFree: false, order: 6 }
        ]
      },
      {
        id: "mod-python-3",
        title: "Control Flow & Logic",
        order: 3,
        lessons: [
          { id: "les-13", title: "If-Else Statements", type: "video", duration: 20, content: "", isFree: false, order: 1 },
          { id: "les-14", title: "Logical Operators", type: "video", duration: 15, content: "", isFree: false, order: 2 },
          { id: "les-15", title: "For Loops", type: "video", duration: 22, content: "", isFree: false, order: 3 },
          { id: "les-16", title: "While Loops", type: "video", duration: 18, content: "", isFree: false, order: 4 },
          { id: "les-17", title: "Break & Continue", type: "video", duration: 12, content: "", isFree: false, order: 5 },
          { id: "les-18", title: "Project: Number Guessing Game", type: "assignment", duration: 30, content: "", isFree: false, order: 6 }
        ]
      },
      {
        id: "mod-python-4",
        title: "Functions & Modules",
        order: 4,
        lessons: [
          { id: "les-19", title: "Defining Functions", type: "video", duration: 25, content: "", isFree: false, order: 1 },
          { id: "les-20", title: "Parameters & Return Values", type: "video", duration: 20, content: "", isFree: false, order: 2 },
          { id: "les-21", title: "Default Arguments & Keyword Args", type: "video", duration: 18, content: "", isFree: false, order: 3 },
          { id: "les-22", title: "Lambda Functions", type: "video", duration: 15, content: "", isFree: false, order: 4 },
          { id: "les-23", title: "Modules & Import System", type: "video", duration: 22, content: "", isFree: false, order: 5 },
          { id: "les-24", title: "Project: Calculator App", type: "assignment", duration: 45, content: "", isFree: false, order: 6 }
        ]
      },
      {
        id: "mod-python-5",
        title: "Object-Oriented Programming",
        order: 5,
        lessons: [
          { id: "les-25", title: "Introduction to OOP", type: "video", duration: 20, content: "", isFree: false, order: 1 },
          { id: "les-26", title: "Classes & Objects", type: "video", duration: 25, content: "", isFree: false, order: 2 },
          { id: "les-27", title: "Constructor & Self", type: "video", duration: 22, content: "", isFree: false, order: 3 },
          { id: "les-28", title: "Inheritance", type: "video", duration: 28, content: "", isFree: false, order: 4 },
          { id: "les-29", title: "Polymorphism", type: "video", duration: 20, content: "", isFree: false, order: 5 },
          { id: "les-30", title: "Project: Library Management System", type: "assignment", duration: 60, content: "", isFree: false, order: 6 }
        ]
      }
    ],
    
    instructor: instructors[0],
    
    outcomes: [
      "Write Python code confidently",
      "Understand OOP concepts",
      "Build real-world projects",
      "Automate repetitive tasks",
      "Prepare for Python developer jobs"
    ],
    requirements: [
      "No prior programming experience needed",
      "A computer with internet connection",
      "Willingness to learn and practice"
    ],
    
    createdAt: "2024-01-15",
    updatedAt: "2024-12-01"
  },
  
  {
    id: "web-development-bootcamp",
    slug: "web-development-bootcamp",
    title: "Full Stack Web Development Bootcamp",
    tagline: "Become a Complete Web Developer in 12 Weeks",
    description: "Master HTML, CSS, JavaScript, React, Node.js, and databases to build full-stack web applications.",
    longDescription: `This intensive bootcamp takes you from zero to a job-ready full-stack web developer. You'll learn modern web technologies including React for frontend and Node.js for backend, with deployment on cloud platforms.

What you'll build:
- 10+ real-world projects
- Portfolio website
- E-commerce platform
- Social media clone
- REST APIs and more`,
    thumbnail: "/courses/web-development-bootcamp/thumbnail.jpg",
    previewVideo: "https://youtube.com/watch?v=webdev-preview",
    price: 299,
    originalPrice: 4999,
    currency: "INR",
    
    category: "technology",
    subcategory: "Web Development",
    vertical: "professional",
    targetAudience: ["students", "career-changers", "professionals"],
    tags: ["html", "css", "javascript", "react", "nodejs", "fullstack"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 4800,
    lessonCount: 320,
    moduleCount: 16,
    rating: 4.9,
    reviewCount: 4200,
    enrollmentCount: 28000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-web-1",
        title: "HTML Fundamentals",
        order: 1,
        lessons: [
          { id: "les-web-1", title: "Introduction to Web Development", type: "video", duration: 10, content: "", isFree: true, order: 1 },
          { id: "les-web-2", title: "HTML Document Structure", type: "video", duration: 20, content: "", isFree: true, order: 2 },
          { id: "les-web-3", title: "Text Elements & Formatting", type: "video", duration: 18, content: "", isFree: false, order: 3 },
          { id: "les-web-4", title: "Links & Navigation", type: "video", duration: 15, content: "", isFree: false, order: 4 },
          { id: "les-web-5", title: "Images & Media", type: "video", duration: 20, content: "", isFree: false, order: 5 },
          { id: "les-web-6", title: "Forms & Input Elements", type: "video", duration: 25, content: "", isFree: false, order: 6 }
        ]
      },
      {
        id: "mod-web-2",
        title: "CSS Styling",
        order: 2,
        lessons: [
          { id: "les-web-7", title: "CSS Basics & Selectors", type: "video", duration: 22, content: "", isFree: false, order: 1 },
          { id: "les-web-8", title: "Box Model & Layout", type: "video", duration: 28, content: "", isFree: false, order: 2 },
          { id: "les-web-9", title: "Flexbox Mastery", type: "video", duration: 35, content: "", isFree: false, order: 3 },
          { id: "les-web-10", title: "CSS Grid", type: "video", duration: 30, content: "", isFree: false, order: 4 },
          { id: "les-web-11", title: "Responsive Design", type: "video", duration: 25, content: "", isFree: false, order: 5 },
          { id: "les-web-12", title: "Animations & Transitions", type: "video", duration: 22, content: "", isFree: false, order: 6 }
        ]
      },
      {
        id: "mod-web-3",
        title: "JavaScript Essentials",
        order: 3,
        lessons: [
          { id: "les-web-13", title: "JavaScript Basics", type: "video", duration: 25, content: "", isFree: false, order: 1 },
          { id: "les-web-14", title: "DOM Manipulation", type: "video", duration: 30, content: "", isFree: false, order: 2 },
          { id: "les-web-15", title: "Events & Event Handling", type: "video", duration: 25, content: "", isFree: false, order: 3 },
          { id: "les-web-16", title: "Async JavaScript & APIs", type: "video", duration: 35, content: "", isFree: false, order: 4 },
          { id: "les-web-17", title: "ES6+ Features", type: "video", duration: 30, content: "", isFree: false, order: 5 },
          { id: "les-web-18", title: "Project: Interactive Website", type: "assignment", duration: 60, content: "", isFree: false, order: 6 }
        ]
      }
    ],
    
    instructor: instructors[0],
    
    outcomes: [
      "Build responsive websites",
      "Create interactive web applications",
      "Work with React.js",
      "Build REST APIs with Node.js",
      "Deploy applications to the cloud"
    ],
    requirements: [
      "Basic computer skills",
      "A computer with 8GB+ RAM",
      "No prior coding experience required"
    ],
    
    createdAt: "2024-02-01",
    updatedAt: "2024-11-15"
  },
  
  // ==================== FINANCE ====================
  {
    id: "personal-finance-mastery",
    slug: "personal-finance-mastery",
    title: "Personal Finance & Money Management",
    tagline: "Master Your Money, Secure Your Future",
    description: "Learn to budget, save, invest, and build wealth with this comprehensive personal finance course designed for Indians.",
    longDescription: `Take control of your financial future with this practical, India-focused personal finance course. From creating your first budget to building a diversified investment portfolio, this course covers everything you need to know.

What you'll learn:
- Tracking and optimizing expenses
- Building an emergency fund
- Understanding Indian tax system
- Investment options for every budget
- Insurance planning
- Retirement planning`,
    thumbnail: "/courses/personal-finance-mastery/thumbnail.jpg",
    previewVideo: "https://youtube.com/watch?v=finance-preview",
    price: 99,
    originalPrice: 1499,
    currency: "INR",
    
    category: "finance",
    subcategory: "Personal Finance",
    vertical: "general",
    targetAudience: ["working-professionals", "students", "families"],
    tags: ["finance", "money-management", "investing", "tax", "budgeting"],
    
    difficulty: "beginner",
    language: "Hindi",
    totalDuration: 1200,
    lessonCount: 80,
    moduleCount: 10,
    rating: 4.7,
    reviewCount: 3800,
    enrollmentCount: 45000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-finance-1",
        title: "Understanding Your Money",
        order: 1,
        lessons: [
          { id: "les-fin-1", title: "Why Personal Finance Matters", type: "video", duration: 12, content: "", isFree: true, order: 1 },
          { id: "les-fin-2", title: "Income vs Expenses", type: "video", duration: 20, content: "", isFree: true, order: 2 },
          { id: "les-fin-3", title: "Tracking Your Spending", type: "video", duration: 18, content: "", isFree: false, order: 3 },
          { id: "les-fin-4", title: "Creating Your First Budget", type: "video", duration: 25, content: "", isFree: false, order: 4 },
          { id: "les-fin-5", title: "Identifying Expense Leaks", type: "video", duration: 15, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-finance-2",
        title: "Saving Strategies",
        order: 2,
        lessons: [
          { id: "les-fin-6", title: "The 50-30-20 Rule", type: "video", duration: 22, content: "", isFree: false, order: 1 },
          { id: "les-fin-7", title: "Building Your Emergency Fund", type: "video", duration: 28, content: "", isFree: false, order: 2 },
          { id: "les-fin-8", title: "Automating Your Savings", type: "video", duration: 15, content: "", isFree: false, order: 3 },
          { id: "les-fin-9", title: "High-Yield Savings Options", type: "video", duration: 20, content: "", isFree: false, order: 4 }
        ]
      },
      {
        id: "mod-finance-3",
        title: "Indian Tax System",
        order: 3,
        lessons: [
          { id: "les-fin-10", title: "Understanding Indian Taxes", type: "video", duration: 30, content: "", isFree: false, order: 1 },
          { id: "les-fin-11", title: "Income Tax Slabs FY 2024-25", type: "video", duration: 25, content: "", isFree: false, order: 2 },
          { id: "les-fin-12", title: "Deductions & Exemptions", type: "video", duration: 35, content: "", isFree: false, order: 3 },
          { id: "les-fin-13", title: "Section 80C Investments", type: "video", duration: 30, content: "", isFree: false, order: 4 },
          { id: "les-fin-14", title: "Tax Filing Basics", type: "video", duration: 28, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Create and maintain a budget",
      "Build an emergency fund",
      "Understand Indian tax system",
      "Make informed investment decisions",
      "Plan for financial goals"
    ],
    requirements: [
      "Basic understanding of math",
      "Willingness to implement what you learn",
      "No prior finance knowledge needed"
    ],
    
    createdAt: "2024-01-01",
    updatedAt: "2024-12-01"
  },
  
  {
    id: "stock-market-fundamentals",
    slug: "stock-market-fundamentals",
    title: "Stock Market Investing for Beginners",
    tagline: "Start Building Wealth in the Stock Market Today",
    description: "Learn stock market basics, fundamental analysis, and practical investing strategies with real Indian market examples.",
    longDescription: `Dive into the world of stock market investing with this beginner-friendly course. Understand how the stock market works, learn to analyze companies, and build a profitable investment portfolio.

Course highlights:
- Demat account setup explained
- Reading stock charts & financial statements
- Value investing strategies
- Risk management techniques
- Portfolio building basics`,
    thumbnail: "/courses/stock-market-fundamentals/thumbnail.jpg",
    previewVideo: "https://youtube.com/watch?v=stocks-preview",
    price: 149,
    originalPrice: 2499,
    currency: "INR",
    
    category: "finance",
    subcategory: "Investing",
    vertical: "general",
    targetAudience: ["beginners", "working-professionals", "students"],
    tags: ["stocks", "investing", "stock-market", "wealth", "trading"],
    
    difficulty: "beginner",
    language: "Hindi-English",
    totalDuration: 1500,
    lessonCount: 100,
    moduleCount: 12,
    rating: 4.6,
    reviewCount: 5200,
    enrollmentCount: 62000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-stock-1",
        title: "Stock Market Basics",
        order: 1,
        lessons: [
          { id: "les-stock-1", title: "What is the Stock Market?", type: "video", duration: 15, content: "", isFree: true, order: 1 },
          { id: "les-stock-2", title: "How Stock Exchanges Work", type: "video", duration: 20, content: "", isFree: true, order: 2 },
          { id: "les-stock-3", title: "Types of Stocks", type: "video", duration: 22, content: "", isFree: false, order: 3 },
          { id: "les-stock-4", title: "Opening a Demat Account", type: "video", duration: 18, content: "", isFree: false, order: 4 },
          { id: "les-stock-5", title: "Key Market Indices", type: "video", duration: 15, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Understand stock market mechanics",
      "Read and analyze stock charts",
      "Perform basic fundamental analysis",
      "Build a diversified portfolio",
      "Manage investment risks"
    ],
    requirements: [
      "Interest in investing",
      "Willingness to learn",
      "No prior market experience needed"
    ],
    
    createdAt: "2024-03-01",
    updatedAt: "2024-11-20"
  },
  
  // ==================== MARKETING ====================
  {
    id: "digital-marketing-complete",
    slug: "digital-marketing-complete",
    title: "Complete Digital Marketing Mastery",
    tagline: "Master All Digital Marketing Channels in 2025",
    description: "Learn SEO, Social Media Marketing, Google Ads, Email Marketing, and Analytics to become a complete digital marketer.",
    longDescription: `Become a certified digital marketer with this comprehensive course covering all major online marketing channels. From organic SEO to paid advertising, you'll learn strategies that deliver real business results.

What you'll master:
- Search Engine Optimization (SEO)
- Social Media Marketing (SMM)
- Google Ads & Paid Advertising
- Email Marketing
- Google Analytics
- Content Marketing`,
    thumbnail: "/courses/digital-marketing-complete/thumbnail.jpg",
    previewVideo: "https://youtube.com/watch?v=dm-preview",
    price: 199,
    originalPrice: 3999,
    currency: "INR",
    
    category: "marketing",
    subcategory: "Digital Marketing",
    vertical: "professional",
    targetAudience: ["entrepreneurs", "marketing-professionals", "students"],
    tags: ["digital-marketing", "seo", "social-media", "google-ads", "analytics"],
    
    difficulty: "intermediate",
    language: "Hindi",
    totalDuration: 1800,
    lessonCount: 120,
    moduleCount: 10,
    rating: 4.8,
    reviewCount: 3100,
    enrollmentCount: 38000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-dm-1",
        title: "Digital Marketing Foundation",
        order: 1,
        lessons: [
          { id: "les-dm-1", title: "Digital Marketing Landscape", type: "video", duration: 15, content: "", isFree: true, order: 1 },
          { id: "les-dm-2", title: "Customer Journey Mapping", type: "video", duration: 20, content: "", isFree: true, order: 2 },
          { id: "les-dm-3", title: "Setting Up Business Goals", type: "video", duration: 18, content: "", isFree: false, order: 3 },
          { id: "les-dm-4", title: "Understanding KPIs & Metrics", type: "video", duration: 22, content: "", isFree: false, order: 4 },
          { id: "les-dm-5", title: "Creating Your Marketing Plan", type: "video", duration: 25, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[2],
    
    outcomes: [
      "Create effective SEO strategies",
      "Run profitable ad campaigns",
      "Build social media presence",
      "Analyze marketing performance",
      "Become job-ready digital marketer"
    ],
    requirements: [
      "Basic internet skills",
      "A computer for practical work",
      "No prior marketing experience needed"
    ],
    
    createdAt: "2024-02-15",
    updatedAt: "2024-12-10"
  },
  
  // ==================== DESIGN ====================
  {
    id: "ui-ux-design-masterclass",
    slug: "ui-ux-design-masterclass",
    title: "UI/UX Design Masterclass",
    tagline: "Design Beautiful User Interfaces & Experiences",
    description: "Master Figma, design principles, user research, and create stunning interfaces that users love.",
    longDescription: `Launch your career in UI/UX design with this comprehensive course. Learn to use Figma like a pro, understand design psychology, conduct user research, and create portfolio-worthy projects.

Course projects:
- Mobile app design
- Website redesign
- Design system creation
- User research project
- Complete portfolio`,
    thumbnail: "/courses/ui-ux-design-masterclass/thumbnail.jpg",
    previewVideo: "https://youtube.com/watch?v=uiux-preview",
    price: 199,
    originalPrice: 3499,
    currency: "INR",
    
    category: "design",
    subcategory: "UI/UX Design",
    vertical: "professional",
    targetAudience: ["design-beginners", "developers", "entrepreneurs"],
    tags: ["ui-design", "ux-design", "figma", "design-thinking", "prototyping"],
    
    difficulty: "beginner",
    language: "Hindi-English",
    totalDuration: 1600,
    lessonCount: 110,
    moduleCount: 8,
    rating: 4.9,
    reviewCount: 2800,
    enrollmentCount: 32000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-ui-1",
        title: "Design Fundamentals",
        order: 1,
        lessons: [
          { id: "les-ui-1", title: "Introduction to UI/UX", type: "video", duration: 12, content: "", isFree: true, order: 1 },
          { id: "les-ui-2", title: "Design Principles", type: "video", duration: 25, content: "", isFree: true, order: 2 },
          { id: "les-ui-3", title: "Color Theory", type: "video", duration: 22, content: "", isFree: false, order: 3 },
          { id: "les-ui-4", title: "Typography Basics", type: "video", duration: 18, content: "", isFree: false, order: 4 },
          { id: "les-ui-5", title: "Layout & Spacing", type: "video", duration: 20, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[3],
    
    outcomes: [
      "Master Figma for design",
      "Create stunning UI designs",
      "Conduct user research",
      "Build a professional portfolio",
      "Ready for junior designer roles"
    ],
    requirements: [
      "A computer with internet",
      "No prior design experience",
      "Willingness to practice"
    ],
    
    createdAt: "2024-01-20",
    updatedAt: "2024-11-25"
  },
  
  // ==================== CAREER ====================
  {
    id: "job-prep-complete",
    slug: "job-prep-complete",
    title: "Complete Job Preparation Course",
    tagline: "Get Your Dream Job with Proven Strategies",
    description: "Master resume writing, interview skills, LinkedIn optimization, and career planning to land your ideal job.",
    longDescription: `Stop struggling with job applications. Learn the exact strategies that hiring managers look for and transform your job search. From crafting the perfect resume to acing technical interviews, this course covers it all.

Includes:
- ATS-optimized resume templates
- 50+ interview Q&A with sample answers
- LinkedIn profile optimization
- Salary negotiation tactics
- Networking strategies`,
    thumbnail: "/courses/job-prep-complete/thumbnail.jpg",
    previewVideo: "https://youtube.com/watch?v=jobprep-preview",
    price: 99,
    originalPrice: 1999,
    currency: "INR",
    
    category: "career",
    subcategory: "Job Preparation",
    vertical: "professional",
    targetAudience: ["job-seekers", "freshers", "professionals"],
    tags: ["resume", "interview", "linkedin", "job-search", "career"],
    
    difficulty: "beginner",
    language: "Hindi",
    totalDuration: 900,
    lessonCount: 60,
    moduleCount: 8,
    rating: 4.7,
    reviewCount: 6500,
    enrollmentCount: 85000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-job-1",
        title: "Resume Excellence",
        order: 1,
        lessons: [
          { id: "les-job-1", title: "Resume Mistakes That Kill Your Chances", type: "video", duration: 15, content: "", isFree: true, order: 1 },
          { id: "les-job-2", title: "ATS-Optimized Resume Format", type: "video", duration: 25, content: "", isFree: true, order: 2 },
          { id: "les-job-3", title: "Writing Impactful Bullet Points", type: "video", duration: 20, content: "", isFree: false, order: 3 },
          { id: "les-job-4", title: "Tailoring Resume for Each Job", type: "video", duration: 18, content: "", isFree: false, order: 4 },
          { id: "les-job-5", title: "Resume Templates & Examples", type: "video", duration: 22, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[4],
    
    outcomes: [
      "Create ATS-winning resumes",
      "Ace job interviews",
      "Optimize LinkedIn profile",
      "Negotiate better salaries",
      "Speed up job search"
    ],
    requirements: [
      "Basic English writing skills",
      "Willingness to implement changes",
      "No prerequisites"
    ],
    
    createdAt: "2024-01-10",
    updatedAt: "2024-12-05"
  },
  
  // ==================== BUSINESS ====================
  {
    id: "startup-foundation",
    slug: "startup-foundation",
    title: "Startup Foundation: From Idea to Business",
    tagline: "Launch Your Startup with Confidence",
    description: "Learn to validate your business idea, create a solid plan, and launch your startup the right way.",
    longDescription: `Transform your business idea into a profitable venture. This course covers everything from ideation to launch, helping you avoid common startup pitfalls and build a sustainable business.

What you'll learn:
- Idea validation techniques
- Business model canvas
- Writing a business plan
- Funding strategies
- MVP development
- Growth strategies`,
    thumbnail: "/courses/startup-foundation/thumbnail.jpg",
    previewVideo: "https://youtube.com/watch?v=startup-preview",
    price: 249,
    originalPrice: 3999,
    currency: "INR",
    
    category: "business",
    subcategory: "Entrepreneurship",
    vertical: "professional",
    targetAudience: ["aspiring-entrepreneurs", "working-professionals", "students"],
    tags: ["startup", "entrepreneurship", "business-plan", "funding", "mvp"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 1400,
    lessonCount: 90,
    moduleCount: 10,
    rating: 4.6,
    reviewCount: 1800,
    enrollmentCount: 22000,
    isActive: true,
    isFeatured: false,
    
    modules: [
      {
        id: "mod-start-1",
        title: "Finding Your Idea",
        order: 1,
        lessons: [
          { id: "les-start-1", title: "Identifying Opportunities", type: "video", duration: 20, content: "", isFree: true, order: 1 },
          { id: "les-start-2", title: "Problem Validation", type: "video", duration: 25, content: "", isFree: true, order: 2 },
          { id: "les-start-3", title: "Market Research Basics", type: "video", duration: 22, content: "", isFree: false, order: 3 },
          { id: "les-start-4", title: "Competitive Analysis", type: "video", duration: 20, content: "", isFree: false, order: 4 },
          { id: "les-start-5", title: "Unique Value Proposition", type: "video", duration: 18, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[6],
    
    outcomes: [
      "Validate business ideas",
      "Create a solid business plan",
      "Build an MVP",
      "Pitch to investors",
      "Launch successfully"
    ],
    requirements: [
      "A business idea (or willingness to find one)",
      "Basic business understanding",
      "Commitment to complete the course"
    ],
    
    createdAt: "2024-04-01",
    updatedAt: "2024-11-01"
  },
  
  // ==================== DATA SCIENCE ====================
  {
    id: "data-science-python",
    slug: "data-science-python",
    title: "Data Science with Python",
    tagline: "Master Data Science, ML & AI in 2025",
    description: "Learn data analysis, visualization, machine learning, and AI with Python. Perfect for beginners and professionals.",
    longDescription: `Dive into the exciting world of data science. Learn to analyze data, create visualizations, build machine learning models, and understand AI fundamentals using Python.

Tools you'll master:
- Python & Pandas
- NumPy & Matplotlib
- Scikit-learn
- TensorFlow basics
- SQL for data analysis`,
    thumbnail: "/courses/data-science-python/thumbnail.jpg",
    previewVideo: "https://youtube.com/watch?v=ds-preview",
    price: 249,
    originalPrice: 4999,
    currency: "INR",
    
    category: "science",
    subcategory: "Data Science",
    vertical: "professional",
    targetAudience: ["programmers", "analysts", "students"],
    tags: ["data-science", "machine-learning", "python", "ai", "analytics"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 2400,
    lessonCount: 160,
    moduleCount: 14,
    rating: 4.8,
    reviewCount: 3600,
    enrollmentCount: 42000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-ds-1",
        title: "Python for Data Science",
        order: 1,
        lessons: [
          { id: "les-ds-1", title: "Python Data Science Environment", type: "video", duration: 15, content: "", isFree: true, order: 1 },
          { id: "les-ds-2", title: "NumPy Fundamentals", type: "video", duration: 30, content: "", isFree: true, order: 2 },
          { id: "les-ds-3", title: "Pandas Mastery", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-ds-4", title: "Data Cleaning Techniques", type: "video", duration: 35, content: "", isFree: false, order: 4 },
          { id: "les-ds-5", title: "Data Aggregation", type: "video", duration: 30, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[5],
    
    outcomes: [
      "Analyze complex datasets",
      "Create stunning visualizations",
      "Build ML models",
      "Perform data-driven analysis",
      "Ready for data science roles"
    ],
    requirements: [
      "Basic Python knowledge recommended",
      "Mathematics basics",
      "A computer for practice"
    ],
    
    createdAt: "2024-02-10",
    updatedAt: "2024-12-01"
  },
  
  // ==================== SCHOOL (Class 10) ====================
  {
    id: "class10-mathematics",
    slug: "class10-mathematics",
    title: "Class 10 Mathematics Complete Course",
    tagline: "Score 95+ in CBSE Class 10 Maths",
    description: "Complete Class 10 Mathematics covering all chapters with explanations, examples, and practice questions.",
    longDescription: `Ace your Class 10 Mathematics board exams with this comprehensive course. Every chapter is explained in detail with visual examples, step-by-step problem solving, and chapter-wise practice tests.

Chapters covered:
- Real Numbers
- Polynomials
- Pair of Linear Equations
- Quadratic Equations
- Arithmetic Progressions
- Triangles
- Coordinate Geometry
- Introduction to Trigonometry
- Some Applications of Trigonometry
- Circles
- Constructions
- Areas Related to Circles
- Surface Areas and Volumes
- Statistics
- Probability`,
    thumbnail: "/courses/class10-mathematics/thumbnail.jpg",
    previewVideo: "https://youtube.com/watch?v=class10-math-preview",
    price: 149,
    originalPrice: 999,
    currency: "INR",
    
    category: "technology",
    subcategory: "Mathematics",
    vertical: "school",
    targetAudience: ["class10-students"],
    tags: ["class10", "mathematics", "cbse", "board-exam", "icse"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 3000,
    lessonCount: 200,
    moduleCount: 15,
    rating: 4.9,
    reviewCount: 8500,
    enrollmentCount: 120000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-c10-1",
        title: "Real Numbers",
        order: 1,
        lessons: [
          { id: "les-c10-1", title: "Introduction to Real Numbers", type: "video", duration: 15, content: "", isFree: true, order: 1 },
          { id: "les-c10-2", title: "Euclid's Division Lemma", type: "video", duration: 25, content: "", isFree: true, order: 2 },
          { id: "les-c10-3", title: "Fundamental Theorem of Arithmetic", type: "video", duration: 25, content: "", isFree: false, order: 3 },
          { id: "les-c10-4", title: "Revisiting Irrational Numbers", type: "video", duration: 20, content: "", isFree: false, order: 4 },
          { id: "les-c10-5", title: "Chapter Practice Test", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-c10-2",
        title: "Polynomials",
        order: 2,
        lessons: [
          { id: "les-c10-6", title: "Introduction to Polynomials", type: "video", duration: 18, content: "", isFree: false, order: 1 },
          { id: "les-c10-7", title: "Geometrical Meaning of Zeros", type: "video", duration: 22, content: "", isFree: false, order: 2 },
          { id: "les-c10-8", title: "Relationship Between Zeros", type: "video", duration: 25, content: "", isFree: false, order: 3 },
          { id: "les-c10-9", title: "Division Algorithm for Polynomials", type: "video", duration: 25, content: "", isFree: false, order: 4 },
          { id: "les-c10-10", title: "Chapter Practice Test", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-c10-3",
        title: "Pair of Linear Equations",
        order: 3,
        lessons: [
          { id: "les-c10-11", title: "Pair of Linear Equations in Two Variables", type: "video", duration: 20, content: "", isFree: false, order: 1 },
          { id: "les-c10-12", title: "Graphical Method of Solution", type: "video", duration: 22, content: "", isFree: false, order: 2 },
          { id: "les-c10-13", title: "Algebraic Methods of Solution", type: "video", duration: 30, content: "", isFree: false, order: 3 },
          { id: "les-c10-14", title: "Elimination Method", type: "video", duration: 25, content: "", isFree: false, order: 4 },
          { id: "les-c10-15", title: "Substitution Method", type: "video", duration: 20, content: "", isFree: false, order: 5 },
          { id: "les-c10-16", title: "Cross-Multiplication Method", type: "video", duration: 25, content: "", isFree: false, order: 6 },
          { id: "les-c10-17", title: "Equation Reducible to Linear Form", type: "video", duration: 22, content: "", isFree: false, order: 7 },
          { id: "les-c10-18", title: "Chapter Practice Test", type: "quiz", duration: 40, content: "", isFree: false, order: 8 }
        ]
      }
    ],
    
    instructor: instructors[7],
    
    outcomes: [
      "Score 90+ in board exams",
      "Understand concepts deeply",
      "Solve all types of problems",
      "Build strong math foundation",
      "Prepare for competitive exams"
    ],
    requirements: [
      "Class 9 mathematics knowledge",
      "NCERT Class 10 textbook",
      "Practice notebook"
    ],
    
    createdAt: "2024-01-01",
    updatedAt: "2024-12-01"
  },
  
  // ==================== COLLEGE (B.Com) ====================
  {
    id: "bcom-financial-accounting",
    slug: "bcom-financial-accounting",
    title: "B.Com Financial Accounting Course",
    tagline: "Master Financial Accounting for B.Com Students",
    description: "Complete financial accounting course covering all B.Com syllabus topics with practical examples.",
    longDescription: `This course is specifically designed for B.Com students, covering all essential financial accounting topics as per university syllabus. Learn accounting principles, journal entries, ledger posting, trial balance, final accounts, and more.

Topics covered:
- Accounting Principles & Concepts
- Journal & Ledger
- Cash Book & Bank Reconciliation
- Trial Balance
- Final Accounts
- Depreciation Accounting
- Consignment Accounts
- Joint Venture
- Partnership Accounts
- Company Accounts`,
    thumbnail: "/courses/bcom-financial-accounting/thumbnail.jpg",
    previewVideo: "https://youtube.com/watch?v=bcom-accounting-preview",
    price: 199,
    originalPrice: 1999,
    currency: "INR",
    
    category: "business",
    subcategory: "Accounting",
    vertical: "college",
    targetAudience: ["bcom-students", "ca-foundation-students"],
    tags: ["bcom", "accounting", "financial-accounting", "commerce", "ca-foundation"],
    
    difficulty: "intermediate",
    language: "Hindi",
    totalDuration: 2000,
    lessonCount: 140,
    moduleCount: 12,
    rating: 4.7,
    reviewCount: 4200,
    enrollmentCount: 55000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-bcom-1",
        title: "Accounting Fundamentals",
        order: 1,
        lessons: [
          { id: "les-bcom-1", title: "Introduction to Accounting", type: "video", duration: 20, content: "", isFree: true, order: 1 },
          { id: "les-bcom-2", title: "Accounting Principles", type: "video", duration: 30, content: "", isFree: true, order: 2 },
          { id: "les-bcom-3", title: "Accounting Concepts", type: "video", duration: 25, content: "", isFree: false, order: 3 },
          { id: "les-bcom-4", title: "Accounting Conventions", type: "video", duration: 20, content: "", isFree: false, order: 4 },
          { id: "les-bcom-5", title: "Types of Accounts", type: "video", duration: 25, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Understand accounting principles",
      "Prepare journal entries",
      "Create final accounts",
      "Score good marks in exams",
      "Build foundation for CA/CPA"
    ],
    requirements: [
      "Basic commerce knowledge",
      "Willingness to practice problems",
      "B.Com or similar course enrollment"
    ],
    
    createdAt: "2024-02-01",
    updatedAt: "2024-11-15"
  },
  
  // ==================== ADDITIONAL COURSES ====================
  
  {
    id: "excel-mastery",
    slug: "excel-mastery",
    title: "Complete Microsoft Excel Mastery",
    tagline: "Become an Excel Expert in 30 Days",
    description: "Master Excel from basics to advanced including formulas, pivot tables, charts, and automation with macros.",
    longDescription: `Transform your data skills with comprehensive Excel training. From cell formatting to advanced macros, this course covers everything you need to become an Excel expert at work.

What you'll learn:
- Excel interface & navigation
- Formulas & functions (100+)
- Data analysis tools
- Pivot Tables & Charts
- Excel VBA & Macros
- Power Query basics`,
    thumbnail: "/courses/excel-mastery/thumbnail.jpg",
    previewVideo: "https://youtube.com/watch?v=excel-preview",
    price: 99,
    originalPrice: 1499,
    currency: "INR",
    
    category: "tools",
    subcategory: "Office Tools",
    vertical: "professional",
    targetAudience: ["professionals", "students", "entrepreneurs"],
    tags: ["excel", "microsoft", "spreadsheet", "data-analysis", "office"],
    
    difficulty: "beginner",
    language: "Hindi-English",
    totalDuration: 1200,
    lessonCount: 85,
    moduleCount: 8,
    rating: 4.8,
    reviewCount: 9800,
    enrollmentCount: 125000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-excel-1",
        title: "Excel Basics",
        order: 1,
        lessons: [
          { id: "les-excel-1", title: "Excel Interface Tour", type: "video", duration: 15, content: "", isFree: true, order: 1 },
          { id: "les-excel-2", title: "Cell Formatting & Styles", type: "video", duration: 20, content: "", isFree: true, order: 2 },
          { id: "les-excel-3", title: "Data Entry & Autofill", type: "video", duration: 18, content: "", isFree: false, order: 3 },
          { id: "les-excel-4", title: "Basic Formulas", type: "video", duration: 25, content: "", isFree: false, order: 4 },
          { id: "les-excel-5", title: "Relative & Absolute References", type: "video", duration: 20, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[0],
    
    outcomes: [
      "Navigate Excel confidently",
      "Write complex formulas",
      "Create Pivot Tables",
      "Automate tasks with macros",
      "Analyze data professionally"
    ],
    requirements: [
      "Microsoft Excel installed",
      "Basic computer skills",
      "No prior Excel experience needed"
    ],
    
    createdAt: "2024-01-05",
    updatedAt: "2024-12-01"
  },
  
  {
    id: "communication-english",
    slug: "communication-english",
    title: "English Communication Mastery",
    tagline: "Speak English Confidently in 60 Days",
    description: "Improve your English speaking, writing, and communication skills with practical exercises and real-life scenarios.",
    longDescription: `Overcome your fear of English and communicate with confidence. This course covers everything from basic grammar to advanced communication skills for professional success.

What you'll improve:
- English speaking fluency
- Grammar & sentence structure
- Professional writing
- Presentation skills
- Interview communication
- Email writing`,
    thumbnail: "/courses/communication-english/thumbnail.jpg",
    previewVideo: "https://youtube.com/watch?v=english-preview",
    price: 99,
    originalPrice: 1999,
    currency: "INR",
    
    category: "language",
    subcategory: "English",
    vertical: "general",
    targetAudience: ["professionals", "students", "job-seekers"],
    tags: ["english", "communication", "speaking", "grammar", "presentation"],
    
    difficulty: "beginner",
    language: "Hindi-English",
    totalDuration: 1000,
    lessonCount: 70,
    moduleCount: 10,
    rating: 4.6,
    reviewCount: 11200,
    enrollmentCount: 145000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-eng-1",
        title: "Foundation Building",
        order: 1,
        lessons: [
          { id: "les-eng-1", title: "Understanding English Fear", type: "video", duration: 12, content: "", isFree: true, order: 1 },
          { id: "les-eng-2", title: "Basic Grammar Refresh", type: "video", duration: 25, content: "", isFree: true, order: 2 },
          { id: "les-eng-3", title: "Common Mistakes to Avoid", type: "video", duration: 20, content: "", isFree: false, order: 3 },
          { id: "les-eng-4", title: "Building Confidence", type: "video", duration: 18, content: "", isFree: false, order: 4 },
          { id: "les-eng-5", title: "Daily Practice Routine", type: "video", duration: 15, content: "", isFree: false, order: 5 },
          { id: "les-eng-6", title: "Self-Assessment Quiz", type: "quiz", duration: 10, content: "", isFree: false, order: 6 }
        ]
      },
      {
        id: "mod-eng-2",
        title: "Grammar Mastery",
        order: 2,
        lessons: [
          { id: "les-eng-7", title: "Tenses Made Easy", type: "video", duration: 30, content: "", isFree: false, order: 1 },
          { id: "les-eng-8", title: "Subject-Verb Agreement", type: "video", duration: 25, content: "", isFree: false, order: 2 },
          { id: "les-eng-9", title: "Articles: A, An, The", type: "video", duration: 20, content: "", isFree: false, order: 3 },
          { id: "les-eng-10", title: "Prepositions Practice", type: "video", duration: 22, content: "", isFree: false, order: 4 },
          { id: "les-eng-11", title: "Active vs Passive Voice", type: "video", duration: 25, content: "", isFree: false, order: 5 },
          { id: "les-eng-12", title: "Module Quiz: Grammar", type: "quiz", duration: 15, content: "", isFree: false, order: 6 }
        ]
      },
      {
        id: "mod-eng-3",
        title: "Speaking Confidence",
        order: 3,
        lessons: [
          { id: "les-eng-13", title: "Pronunciation Basics", type: "video", duration: 20, content: "", isFree: false, order: 1 },
          { id: "les-eng-14", title: "Intonation & Stress", type: "video", duration: 18, content: "", isFree: false, order: 2 },
          { id: "les-eng-15", title: "Speaking Fluently", type: "video", duration: 25, content: "", isFree: false, order: 3 },
          { id: "les-eng-16", title: "Overcoming Hesitation", type: "video", duration: 15, content: "", isFree: false, order: 4 },
          { id: "les-eng-17", title: "Daily Speaking Exercises", type: "video", duration: 20, content: "", isFree: false, order: 5 },
          { id: "les-eng-18", title: "Tongue Twisters Practice", type: "video", duration: 12, content: "", isFree: false, order: 6 },
          { id: "les-eng-19", title: "Module Assessment", type: "quiz", duration: 10, content: "", isFree: false, order: 7 }
        ]
      },
      {
        id: "mod-eng-4",
        title: "Vocabulary Building",
        order: 4,
        lessons: [
          { id: "les-eng-20", title: "500 Essential Words", type: "video", duration: 30, content: "", isFree: false, order: 1 },
          { id: "les-eng-21", title: "Synonyms & Antonyms", type: "video", duration: 20, content: "", isFree: false, order: 2 },
          { id: "les-eng-22", title: "Idioms & Phrases", type: "video", duration: 25, content: "", isFree: false, order: 3 },
          { id: "les-eng-23", title: "Business Vocabulary", type: "video", duration: 28, content: "", isFree: false, order: 4 },
          { id: "les-eng-24", title: "Word Formation", type: "video", duration: 22, content: "", isFree: false, order: 5 },
          { id: "les-eng-25", title: "Vocabulary Flashcards", type: "assignment", duration: 15, content: "", isFree: false, order: 6 },
          { id: "les-eng-26", title: "Daily Word Practice", type: "video", duration: 18, content: "", isFree: false, order: 7 }
        ]
      },
      {
        id: "mod-eng-5",
        title: "Professional Writing",
        order: 5,
        lessons: [
          { id: "les-eng-27", title: "Email Writing Basics", type: "video", duration: 25, content: "", isFree: false, order: 1 },
          { id: "les-eng-28", title: "Formal vs Informal Emails", type: "video", duration: 20, content: "", isFree: false, order: 2 },
          { id: "les-eng-29", title: "Professional Report Writing", type: "video", duration: 30, content: "", isFree: false, order: 3 },
          { id: "les-eng-30", title: "Business Letter Format", type: "video", duration: 25, content: "", isFree: false, order: 4 },
          { id: "les-eng-31", title: "Writing Memos & Notes", type: "video", duration: 18, content: "", isFree: false, order: 5 },
          { id: "les-eng-32", title: "Email Templates Practice", type: "assignment", duration: 20, content: "", isFree: false, order: 6 }
        ]
      },
      {
        id: "mod-eng-6",
        title: "Interview Skills",
        order: 6,
        lessons: [
          { id: "les-eng-33", title: "Common Interview Questions", type: "video", duration: 30, content: "", isFree: false, order: 1 },
          { id: "les-eng-34", title: "Tell Me About Yourself", type: "video", duration: 25, content: "", isFree: false, order: 2 },
          { id: "les-eng-35", title: "STAR Method for Answers", type: "video", duration: 28, content: "", isFree: false, order: 3 },
          { id: "les-eng-36", title: "Body Language Tips", type: "video", duration: 20, content: "", isFree: false, order: 4 },
          { id: "les-eng-37", title: "Mock Interview Practice", type: "video", duration: 35, content: "", isFree: false, order: 5 },
          { id: "les-eng-38", title: "Interview Role Play", type: "assignment", duration: 30, content: "", isFree: false, order: 6 }
        ]
      },
      {
        id: "mod-eng-7",
        title: "Presentation Skills",
        order: 7,
        lessons: [
          { id: "les-eng-39", title: "Presentation Structure", type: "video", duration: 25, content: "", isFree: false, order: 1 },
          { id: "les-eng-40", title: "Opening & Closing Hooks", type: "video", duration: 20, content: "", isFree: false, order: 2 },
          { id: "les-eng-41", title: "Visual Aid Usage", type: "video", duration: 22, content: "", isFree: false, order: 3 },
          { id: "les-eng-42", title: "Handling Q&A Session", type: "video", duration: 18, content: "", isFree: false, order: 4 },
          { id: "les-eng-43", title: "Virtual Presentation Tips", type: "video", duration: 20, content: "", isFree: false, order: 5 },
          { id: "les-eng-44", title: "Practice Presentation", type: "assignment", duration: 40, content: "", isFree: false, order: 6 }
        ]
      },
      {
        id: "mod-eng-8",
        title: "Conversation Skills",
        order: 8,
        lessons: [
          { id: "les-eng-45", title: "Starting Conversations", type: "video", duration: 18, content: "", isFree: false, order: 1 },
          { id: "les-eng-46", title: "Active Listening", type: "video", duration: 20, content: "", isFree: false, order: 2 },
          { id: "les-eng-47", title: "Small Talk Mastery", type: "video", duration: 22, content: "", isFree: false, order: 3 },
          { id: "les-eng-48", title: "Asking Questions Properly", type: "video", duration: 18, content: "", isFree: false, order: 4 },
          { id: "les-eng-49", title: "Giving Opinions", type: "video", duration: 20, content: "", isFree: false, order: 5 },
          { id: "les-eng-50", title: "Role Play Scenarios", type: "assignment", duration: 25, content: "", isFree: false, order: 6 }
        ]
      },
      {
        id: "mod-eng-9",
        title: "Business Communication",
        order: 9,
        lessons: [
          { id: "les-eng-51", title: "Professional Phone Calls", type: "video", duration: 20, content: "", isFree: false, order: 1 },
          { id: "les-eng-52", title: "Video Conference Etiquette", type: "video", duration: 18, content: "", isFree: false, order: 2 },
          { id: "les-eng-53", title: "Meeting Participation", type: "video", duration: 22, content: "", isFree: false, order: 3 },
          { id: "les-eng-54", title: "Negotiation Language", type: "video", duration: 25, content: "", isFree: false, order: 4 },
          { id: "les-eng-55", title: "Conflict Resolution", type: "video", duration: 20, content: "", isFree: false, order: 5 },
          { id: "les-eng-56", title: "Writing Proposals", type: "video", duration: 28, content: "", isFree: false, order: 6 },
          { id: "les-eng-57", title: "Client Communication", type: "video", duration: 22, content: "", isFree: false, order: 7 }
        ]
      },
      {
        id: "mod-eng-10",
        title: "Advanced Communication",
        order: 10,
        lessons: [
          { id: "les-eng-58", title: "Public Speaking Basics", type: "video", duration: 30, content: "", isFree: false, order: 1 },
          { id: "les-eng-59", title: "Storytelling in Business", type: "video", duration: 25, content: "", isFree: false, order: 2 },
          { id: "les-eng-60", title: "Persuasion Techniques", type: "video", duration: 28, content: "", isFree: false, order: 3 },
          { id: "les-eng-61", title: "Cross-Cultural Communication", type: "video", duration: 22, content: "", isFree: false, order: 4 },
          { id: "les-eng-62", title: "Writing for Social Media", type: "video", duration: 20, content: "", isFree: false, order: 5 },
          { id: "les-eng-63", title: "Leadership Communication", type: "video", duration: 25, content: "", isFree: false, order: 6 },
          { id: "les-eng-64", title: "Final Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 7 }
        ]
      }
    ],
    
    instructor: instructors[4],
    
    outcomes: [
      "Speak English confidently",
      "Write professional emails",
      "Ace English interviews",
      "Improve presentation skills",
      "Overcome stage fright"
    ],
    requirements: [
      "Basic English understanding",
      "Willingness to practice daily",
      "No prerequisites"
    ],
    
    createdAt: "2024-01-15",
    updatedAt: "2024-12-01"
  },
  
  {
    id: "cyber-safety-awareness",
    slug: "cyber-safety-awareness",
    title: "Cyber Safety & Digital Security",
    tagline: "Protect Yourself Online in 2025",
    description: "Learn to stay safe online, protect your data, and avoid cyber fraud with practical security tips.",
    longDescription: `In an increasingly digital world, cyber safety is essential. This course teaches you how to protect your personal information, recognize online threats, and stay secure in your digital life.

Topics covered:
- Password security
- Phishing identification
- Social media safety
- Online privacy protection
- Safe banking practices
- Mobile security
- Wi-Fi security
- Data backup strategies`,
    thumbnail: "/courses/cyber-safety-awareness/thumbnail.jpg",
    previewVideo: "https://youtube.com/watch?v=cyber-preview",
    price: 49,
    originalPrice: 499,
    currency: "INR",
    
    category: "safety",
    subcategory: "Cyber Security",
    vertical: "general",
    targetAudience: ["everyone", "professionals", "families"],
    tags: ["cyber-safety", "security", "online-safety", "privacy", "fraud-prevention"],
    
    difficulty: "beginner",
    language: "Hindi",
    totalDuration: 400,
    lessonCount: 30,
    moduleCount: 6,
    rating: 4.8,
    reviewCount: 15600,
    enrollmentCount: 200000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cyber-1",
        title: "Understanding Cyber Threats",
        order: 1,
        lessons: [
          { id: "les-cyber-1", title: "Cyber Threat Landscape", type: "video", duration: 15, content: "", isFree: true, order: 1 },
          { id: "les-cyber-2", title: "Types of Cyber Attacks", type: "video", duration: 20, content: "", isFree: true, order: 2 },
          { id: "les-cyber-3", title: "Who is at Risk?", type: "video", duration: 12, content: "", isFree: false, order: 3 },
          { id: "les-cyber-4", title: "Real-Life Cyber Fraud Cases", type: "video", duration: 25, content: "", isFree: false, order: 4 },
          { id: "les-cyber-5", title: "Module Quiz", type: "quiz", duration: 10, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cyber-2",
        title: "Password Security",
        order: 2,
        lessons: [
          { id: "les-cyber-6", title: "Creating Strong Passwords", type: "video", duration: 15, content: "", isFree: false, order: 1 },
          { id: "les-cyber-7", title: "Password Managers Explained", type: "video", duration: 18, content: "", isFree: false, order: 2 },
          { id: "les-cyber-8", title: "Two-Factor Authentication", type: "video", duration: 15, content: "", isFree: false, order: 3 },
          { id: "les-cyber-9", title: "Avoiding Password Mistakes", type: "video", duration: 12, content: "", isFree: false, order: 4 }
        ]
      }
    ],
    
    instructor: instructors[0],
    
    outcomes: [
      "Create strong passwords",
      "Identify phishing attempts",
      "Protect personal data",
      "Stay safe on social media",
      "Teach family about cyber safety"
    ],
    requirements: [
      "Basic internet usage",
      "A smartphone or computer",
      "No technical background needed"
    ],
    
    createdAt: "2024-03-01",
    updatedAt: "2024-11-20"
  },
  
  {
    id: "meditation-mindfulness",
    slug: "meditation-mindfulness",
    title: "Meditation & Mindfulness Course",
    tagline: "Find Peace in a Chaotic World",
    description: "Learn meditation techniques, mindfulness practices, and stress management for a balanced life.",
    longDescription: `Discover inner peace and mental clarity with this comprehensive meditation course. Learn various meditation techniques, breathing exercises, and mindfulness practices to reduce stress and improve well-being.

What you'll learn:
- Various meditation techniques
- Breathing exercises
- Mindfulness practices
- Stress management
- Better sleep habits
- Focus improvement`,
    thumbnail: "/courses/meditation-mindfulness/thumbnail.jpg",
    previewVideo: "https://youtube.com/watch?v=meditation-preview",
    price: 99,
    originalPrice: 1499,
    currency: "INR",
    
    category: "health",
    subcategory: "Mental Wellness",
    vertical: "general",
    targetAudience: ["everyone", "professionals", "students"],
    tags: ["meditation", "mindfulness", "stress-relief", "mental-health", "wellness"],
    
    difficulty: "beginner",
    language: "Hindi",
    totalDuration: 600,
    lessonCount: 45,
    moduleCount: 8,
    rating: 4.7,
    reviewCount: 8900,
    enrollmentCount: 110000,
    isActive: true,
    isFeatured: false,
    
    modules: [
      {
        id: "mod-med-1",
        title: "Getting Started with Meditation",
        order: 1,
        lessons: [
          { id: "les-med-1", title: "What is Meditation?", type: "video", duration: 15, content: "", isFree: true, order: 1 },
          { id: "les-med-2", title: "Benefits of Meditation", type: "video", duration: 12, content: "", isFree: true, order: 2 },
          { id: "les-med-3", title: "Common Meditation Myths", type: "video", duration: 10, content: "", isFree: false, order: 3 },
          { id: "les-med-4", title: "Setting Up Your Practice Space", type: "video", duration: 8, content: "", isFree: false, order: 4 },
          { id: "les-med-5", title: "Your First Meditation Session", type: "video", duration: 15, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[6],
    
    outcomes: [
      "Practice meditation daily",
      "Reduce stress and anxiety",
      "Improve focus and concentration",
      "Better sleep quality",
      "Enhanced emotional well-being"
    ],
    requirements: [
      "Willingness to practice",
      "Quiet space for meditation",
      "Open mind"
    ],
    
    createdAt: "2024-04-01",
    updatedAt: "2024-10-15"
  },
  
  {
    id: "indian-constitution",
    slug: "indian-constitution",
    title: "Indian Constitution & Civics",
    tagline: "Understand Your Rights & Duties",
    description: "Learn about the Indian Constitution, fundamental rights, governance, and your role as a citizen.",
    longDescription: `Develop a comprehensive understanding of the Indian Constitution and your rights as a citizen. This course covers the structure of government, fundamental rights, duties, and the working of Indian democracy.

Topics covered:
- Making of the Indian Constitution
- Preamble & Features
- Fundamental Rights
- Fundamental Duties
- Union, State & Local Governance
- Electoral Process
- Constitutional Bodies`,
    thumbnail: "/courses/indian-constitution/thumbnail.jpg",
    previewVideo: "https://youtube.com/watch?v=constitution-preview",
    price: 99,
    originalPrice: 999,
    currency: "INR",
    
    category: "civics",
    subcategory: "Constitution",
    vertical: "general",
    targetAudience: ["students", "citizens", "exam-prep"],
    tags: ["constitution", "civics", "rights", "government", "india"],
    
    difficulty: "beginner",
    language: "Hindi",
    totalDuration: 800,
    lessonCount: 55,
    moduleCount: 10,
    rating: 4.6,
    reviewCount: 6200,
    enrollmentCount: 78000,
    isActive: true,
    isFeatured: false,
    
    modules: [
      {
        id: "mod-const-1",
        title: "Introduction to Indian Constitution",
        order: 1,
        lessons: [
          { id: "les-const-1", title: "What is a Constitution?", type: "video", duration: 15, content: "", isFree: true, order: 1 },
          { id: "les-const-2", title: "Making of Indian Constitution", type: "video", duration: 25, content: "", isFree: true, order: 2 },
          { id: "les-const-3", title: "Salient Features", type: "video", duration: 22, content: "", isFree: false, order: 3 },
          { id: "les-const-4", title: "The Preamble", type: "video", duration: 18, content: "", isFree: false, order: 4 },
          { id: "les-const-5", title: "Module Quiz", type: "quiz", duration: 15, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-const-2",
        title: "Fundamental Rights",
        order: 2,
        lessons: [
          { id: "les-const-6", title: "Understanding Fundamental Rights", type: "video", duration: 20, content: "", isFree: false, order: 1 },
          { id: "les-const-7", title: "Right to Equality", type: "video", duration: 22, content: "", isFree: false, order: 2 },
          { id: "les-const-8", title: "Right to Freedom", type: "video", duration: 20, content: "", isFree: false, order: 3 },
          { id: "les-const-9", title: "Right Against Exploitation", type: "video", duration: 18, content: "", isFree: false, order: 4 },
          { id: "les-const-10", title: "Right to Education", type: "video", duration: 15, content: "", isFree: false, order: 5 },
          { id: "les-const-11", title: "Cultural & Educational Rights", type: "video", duration: 16, content: "", isFree: false, order: 6 }
        ]
      },
      {
        id: "mod-const-3",
        title: "Fundamental Duties",
        order: 3,
        lessons: [
          { id: "les-const-12", title: "What are Fundamental Duties?", type: "video", duration: 15, content: "", isFree: false, order: 1 },
          { id: "les-const-13", title: "List of Fundamental Duties", type: "video", duration: 25, content: "", isFree: false, order: 2 },
          { id: "les-const-14", title: "Rights vs Duties Balance", type: "video", duration: 18, content: "", isFree: false, order: 3 },
          { id: "les-const-15", title: "Citizens' Responsibility", type: "video", duration: 16, content: "", isFree: false, order: 4 },
          { id: "les-const-16", title: "Module Quiz", type: "quiz", duration: 15, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-const-4",
        title: "Union Government",
        order: 4,
        lessons: [
          { id: "les-const-17", title: "President of India", type: "video", duration: 22, content: "", isFree: false, order: 1 },
          { id: "les-const-18", title: "Prime Minister & Cabinet", type: "video", duration: 25, content: "", isFree: false, order: 2 },
          { id: "les-const-19", title: "Parliament Structure", type: "video", duration: 22, content: "", isFree: false, order: 3 },
          { id: "les-const-20", title: "Lok Sabha vs Rajya Sabha", type: "video", duration: 20, content: "", isFree: false, order: 4 },
          { id: "les-const-21", title: "Legislative Process", type: "video", duration: 20, content: "", isFree: false, order: 5 },
          { id: "les-const-22", title: "Vice President Role", type: "video", duration: 15, content: "", isFree: false, order: 6 }
        ]
      },
      {
        id: "mod-const-5",
        title: "State & Local Governance",
        order: 5,
        lessons: [
          { id: "les-const-23", title: "Governor & Chief Minister", type: "video", duration: 20, content: "", isFree: false, order: 1 },
          { id: "les-const-24", title: "State Legislature", type: "video", duration: 18, content: "", isFree: false, order: 2 },
          { id: "les-const-25", title: "Panchayati Raj System", type: "video", duration: 25, content: "", isFree: false, order: 3 },
          { id: "les-const-26", title: "Municipalities & Corporations", type: "video", duration: 20, content: "", isFree: false, order: 4 },
          { id: "les-const-27", title: "73rd & 74th Amendments", type: "video", duration: 22, content: "", isFree: false, order: 5 },
          { id: "les-const-28", title: "Module Quiz", type: "quiz", duration: 15, content: "", isFree: false, order: 6 }
        ]
      },
      {
        id: "mod-const-6",
        title: "Electoral Process",
        order: 6,
        lessons: [
          { id: "les-const-29", title: "Election Commission of India", type: "video", duration: 20, content: "", isFree: false, order: 1 },
          { id: "les-const-30", title: "Voting Process Explained", type: "video", duration: 18, content: "", isFree: false, order: 2 },
          { id: "les-const-31", title: "Electoral Reforms", type: "video", duration: 22, content: "", isFree: false, order: 3 },
          { id: "les-const-32", title: "Voter Registration", type: "video", duration: 15, content: "", isFree: false, order: 4 },
          { id: "les-const-33", title: "Model Code of Conduct", type: "video", duration: 16, content: "", isFree: false, order: 5 },
          { id: "les-const-34", title: "Module Quiz", type: "quiz", duration: 15, content: "", isFree: false, order: 6 }
        ]
      },
      {
        id: "mod-const-7",
        title: "Judicial System",
        order: 7,
        lessons: [
          { id: "les-const-35", title: "Supreme Court of India", type: "video", duration: 25, content: "", isFree: false, order: 1 },
          { id: "les-const-36", title: "High Courts & Subordinate Courts", type: "video", duration: 22, content: "", isFree: false, order: 2 },
          { id: "les-const-37", title: "Judicial Review Power", type: "video", duration: 20, content: "", isFree: false, order: 3 },
          { id: "les-const-38", title: "Public Interest Litigation", type: "video", duration: 18, content: "", isFree: false, order: 4 },
          { id: "les-const-39", title: "Judicial Appointments", type: "video", duration: 15, content: "", isFree: false, order: 5 },
          { id: "les-const-40", title: "Module Quiz", type: "quiz", duration: 15, content: "", isFree: false, order: 6 }
        ]
      },
      {
        id: "mod-const-8",
        title: "Constitutional Bodies",
        order: 8,
        lessons: [
          { id: "les-const-35", title: "Union Public Service Commission", type: "video", duration: 18, content: "", isFree: false, order: 1 },
          { id: "les-const-36", title: "Finance Commission", type: "video", duration: 18, content: "", isFree: false, order: 2 },
          { id: "les-const-37", title: "Election Commission", type: "video", duration: 20, content: "", isFree: false, order: 3 },
          { id: "les-const-38", title: "Comptroller & Auditor General", type: "video", duration: 15, content: "", isFree: false, order: 4 },
          { id: "les-const-39", title: "Module Quiz", type: "quiz", duration: 15, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-const-9",
        title: "Citizens' Rights & Responsibilities",
        order: 9,
        lessons: [
          { id: "les-const-40", title: "RTI - Right to Information", type: "video", duration: 25, content: "", isFree: false, order: 1 },
          { id: "les-const-41", title: "Consumer Rights", type: "video", duration: 18, content: "", isFree: false, order: 2 },
          { id: "les-const-42", title: "Women & Child Rights", type: "video", duration: 22, content: "", isFree: false, order: 3 },
          { id: "les-const-43", title: "Environmental Duties", type: "video", duration: 16, content: "", isFree: false, order: 4 },
          { id: "les-const-44", title: "Module Quiz", type: "quiz", duration: 15, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-const-10",
        title: "India & International Relations",
        order: 10,
        lessons: [
          { id: "les-const-45", title: "India's Foreign Policy", type: "video", duration: 22, content: "", isFree: false, order: 1 },
          { id: "les-const-46", title: "India & United Nations", type: "video", duration: 20, content: "", isFree: false, order: 2 },
          { id: "les-const-47", title: "Neighborhood Relations", type: "video", duration: 18, content: "", isFree: false, order: 3 },
          { id: "les-const-48", title: "Trade & Economic Diplomacy", type: "video", duration: 16, content: "", isFree: false, order: 4 },
          { id: "les-const-49", title: "Final Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[7],
    
    outcomes: [
      "Understand Indian Constitution",
      "Know your fundamental rights",
      "Understand governance structure",
      "Make informed voting decisions",
      "Prepare for competitive exams"
    ],
    requirements: [
      "Interest in civics",
      "Willingness to learn",
      "No prerequisites"
    ],
    
    createdAt: "2024-02-15",
    updatedAt: "2024-11-10"
  }
];

// ============================================
// Utility Functions
// ============================================

export function getCourseById(id: string): Course | undefined {
  return courses.find(course => course.id === id);
}

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find(course => course.slug === slug);
}

export function getCoursesByCategory(categoryId: string): Course[] {
  return courses.filter(course => 
    course.category === categoryId && course.isActive
  );
}

export function getCoursesByVertical(vertical: string): Course[] {
  return courses.filter(course => 
    course.vertical === vertical && course.isActive
  );
}

export function getCoursesByInstructor(instructorId: string): Course[] {
  return courses.filter(course => 
    course.instructor.id === instructorId && course.isActive
  );
}

export function getFeaturedCourses(): Course[] {
  return courses.filter(course => 
    course.isFeatured && course.isActive
  );
}

export function getAllCategories(): typeof CATEGORIES {
  return CATEGORIES;
}

export function getAllVerticals(): typeof VERTICALS;
export function getAllVerticals(): typeof VERTICALS {
  return VERTICALS;
}

export function searchCourses(query: string): Course[] {
  const lowerQuery = query.toLowerCase();
  return courses.filter(course => 
    course.isActive && (
      course.title.toLowerCase().includes(lowerQuery) ||
      course.description.toLowerCase().includes(lowerQuery) ||
      course.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      course.category.toLowerCase().includes(lowerQuery) ||
      course.subcategory.toLowerCase().includes(lowerQuery)
    )
  );
}

export function filterCourses(filters: {
  category?: string;
  vertical?: string;
  difficulty?: string;
  minPrice?: number;
  maxPrice?: number;
  instructorId?: string;
  isFeatured?: boolean;
}): Course[] {
  return courses.filter(course => {
    if (!course.isActive) return false;
    
    if (filters.category && course.category !== filters.category) return false;
    if (filters.vertical && course.vertical !== filters.vertical) return false;
    if (filters.difficulty && course.difficulty !== filters.difficulty) return false;
    if (filters.instructorId && course.instructor.id !== filters.instructorId) return false;
    if (filters.isFeatured && !course.isFeatured) return false;
    if (filters.minPrice && course.price < filters.minPrice) return false;
    if (filters.maxPrice && course.price > filters.maxPrice) return false;
    
    return true;
  });
}

export function getTotalCourseCount(): number {
  return courses.filter(c => c.isActive).length;
}

export function getTotalLessonCount(): number {
  return courses.reduce((total, course) => total + course.lessonCount, 0);
}
