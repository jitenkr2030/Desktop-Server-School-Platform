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
  
  // Categorization - Updated taxonomy
  vertical: 'school' | 'college' | 'pg' | 'professional' | 'competitive' | 'citizen';
  category: string;
  subcategory: string;
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
  { id: "exam-prep", name: "Exam Support", icon: "📚" },
  { id: "confusion-remover", name: "Confusion Removers", icon: "💡" },
  { id: "community-understanding", name: "Community Understanding", icon: "👥" }
];

export const VERTICALS = [
  { id: "school", name: "School Education (Class 1-12)", description: "Primary, Middle, Secondary, and Senior Secondary education" },
  { id: "college", name: "College (UG)", description: "Undergraduate degree programs - Arts, Commerce, Engineering, Medical Sciences" },
  { id: "pg", name: "Post-Graduate (PG)", description: "Master's degrees - MBA, M.Com, M.Sc, MCA, MA, LL.M" },
  { id: "professional", name: "Professional Skills", description: "Career-focused skills - Technology, Business, Design, Marketing, Life Skills" },
  { id: "competitive", name: "Competitive Exams", description: "Government exams and professional certifications" },
  { id: "citizen", name: "Citizen & Life Systems", description: "Personal finance, digital literacy, and community systems" }
];

// ============================================
// New Course Taxonomy Structure
// ============================================

export const COURSE_TAXONOMY = {
  // Vertical: SCHOOL EDUCATION
  school: {
    name: "School Education (Class 1-12)",
    categories: {
      "primary-school": "Primary School (Class 1-5)",
      "middle-school": "Middle School (Class 6-8)",
      "secondary-school": "Secondary School (Class 9-10)",
      "senior-secondary": "Senior Secondary (Class 11-12)"
    },
    subcategories: {
      // Primary School
      "english-grammar": "English Grammar",
      "mathematics": "Mathematics",
      "science-fundamentals": "Science Fundamentals",
      // Middle School
      "mathematics-middle": "Mathematics",
      "science-middle": "Science",
      "english-literature": "English Literature",
      // Secondary School
      "mathematics-secondary": "Mathematics",
      "physics-secondary": "Physics",
      "chemistry-secondary": "Chemistry",
      "biology-secondary": "Biology",
      // Senior Secondary
      "physics-senior": "Physics",
      "chemistry-senior": "Chemistry",
      "biology-senior": "Biology",
      "advanced-mathematics": "Advanced Mathematics"
    }
  },
  // Vertical: COLLEGE (UG)
  college: {
    name: "College (UG)",
    categories: {
      "arts-humanities": "Arts & Humanities",
      "commerce-business": "Commerce & Business",
      "engineering-technology": "Engineering & Technology",
      "medical-sciences": "Medical Sciences"
    },
    subcategories: {
      // Arts & Humanities
      "communication-skills": "Communication Skills",
      "philosophy-basics": "Philosophy Basics",
      "history-of-art": "History of Art",
      "world-literature": "World Literature",
      // Commerce & Business
      "accounting-principles": "Accounting Principles",
      "business-economics": "Business Economics",
      "business-statistics": "Business Statistics",
      "marketing-fundamentals": "Marketing Fundamentals",
      "bcom-financial-accounting": "B.Com Financial Accounting",
      // Engineering & Technology
      "programming-fundamentals": "Programming Fundamentals",
      "engineering-mathematics": "Engineering Mathematics",
      "engineering-physics": "Engineering Physics",
      "digital-electronics": "Digital Electronics",
      // Medical Sciences
      "human-anatomy": "Human Anatomy",
      "physiology": "Physiology",
      "biochemistry": "Biochemistry",
      "medical-research": "Medical Research Methods"
    }
  },
  // Vertical: POST-GRADUATE (PG)
  pg: {
    name: "Post-Graduate (PG)",
    categories: {
      "mba": "Management (MBA)",
      "mcom": "Commerce",
      "msc-mca": "Technology & Science",
      "ma-llm": "Economics & Law"
    },
    subcategories: {
      // MBA
      "mba-finance": "MBA in Finance",
      "mba-marketing": "MBA in Marketing Management",
      "mba-hr": "MBA in Human Resources",
      // M.Com
      "mcom-accounting": "M.Com Advanced Accounting",
      "mcom-taxation": "M.Com Taxation & Tax Planning",
      // M.Sc & MCA
      "msc-data-science": "M.Sc Data Science & Analytics",
      "msc-cyber-security": "M.Sc Cyber Security & Digital Forensics",
      "mca-cloud": "MCA Cloud Computing & DevOps",
      // MA & LL.M
      "ma-economics": "M.A. Economics & Data Analysis",
      "llm-corporate": "LL.M Corporate Law & Governance",
      "llm-ip": "LL.M Intellectual Property Rights"
    }
  },
  // Vertical: PROFESSIONAL
  professional: {
    name: "Professional Skills",
    categories: {
      "technology-programming": "Technology & Programming",
      "business-entrepreneurship": "Business & Entrepreneurship",
      "design-creative": "Design & Creative",
      "marketing-communication": "Marketing & Communication",
      "workplace-life-skills": "Workplace & Life Skills"
    },
    subcategories: {
      // Technology & Programming
      "python-programming": "Python Programming",
      "web-development": "Web Development Bootcamp",
      "fullstack-development": "Full-Stack Development",
      "mobile-development": "Mobile App Development",
      "data-science-fundamentals": "Data Science Fundamentals",
      // Business & Entrepreneurship
      "entrepreneurship-essentials": "Entrepreneurship Essentials",
      "business-strategy": "Business Strategy",
      "project-management": "Project Management",
      "financial-management": "Financial Management",
      "startup-foundation": "Startup Foundation",
      // Design & Creative
      "ui-ux-design": "UI/UX Design",
      "graphic-design": "Graphic Design",
      "photography": "Photography & Digital Art",
      "video-editing": "Content Creation & Video Editing",
      // Marketing & Communication
      "digital-marketing": "Digital Marketing",
      "social-media": "Social Media Management",
      "brand-strategy": "Brand Strategy",
      "public-speaking": "Public Speaking",
      // Workplace & Life Skills
      "advanced-excel": "Advanced Excel",
      "english-communication": "English Communication",
      "job-preparation": "Job Preparation",
      "cyber-safety": "Cyber Safety",
      "mental-health": "Mental Health & Wellness",
      "fitness-nutrition": "Fitness & Nutrition"
    }
  },
  // Vertical: COMPETITIVE EXAMS
  competitive: {
    name: "Competitive Exams",
    categories: {
      "professional-certifications": "Professional Certifications",
      "government-exams": "Government & Entrance Exams"
    },
    subcategories: {
      // Professional Certifications
      "ca": "CA (Chartered Accountancy)",
      "cs": "CS (Company Secretary)",
      "cma": "CMA (Cost Management)",
      "cfa": "CFA (Chartered Financial Analyst)",
      "frm": "FRM (Financial Risk Management)",
      "acca": "ACCA",
      "actuarial-science": "Actuarial Science",
      // Government & Entrance Exams
      "upsc": "UPSC Civil Services",
      "ssc": "SSC Exams",
      "state-police": "State Police",
      "tet": "TET (Teacher Eligibility)"
    }
  },
  // Vertical: CITIZEN & LIFE SYSTEMS
  citizen: {
    name: "Citizen & Life Systems",
    categories: {
      "personal-finance": "Personal Finance Basics",
      "digital-literacy": "Digital Literacy",
      "community-systems": "Community Systems"
    },
    subcategories: {
      // Personal Finance
      "tax-planning": "Tax Planning & Insurance",
      "stock-market": "Stock Market & Mutual Funds",
      // Digital Literacy
      "digital-money-banking": "Digital Money & Banking (UPI)",
      "government-portals": "Government Portals & Certificates",
      "online-safety": "Online Safety & Fraud Awareness",
      // Community Systems
      "food-work": "Food-for-Work Model",
      "community-buying": "Community Bulk Buying"
    }
  }
};

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
    thumbnail: "/assets/courses/python-masterclass.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 99,
    originalPrice: 1999,
    currency: "INR",
    
    category: "technology-programming",
    subcategory: "python-programming",
    vertical: "professional",
    targetAudience: ["students", "professionals", "career-changers"],
    tags: ["python", "programming", "coding", "beginner-friendly", "automation", "Technology & Programming", "Python Programming", "Professional / Career Skills", "Technology & Programming"],
    
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
    thumbnail: "/assets/courses/web-development-bootcamp.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 299,
    originalPrice: 4999,
    currency: "INR",
    
    category: "technology-programming",
    subcategory: "web-development",
    vertical: "professional",
    targetAudience: ["students", "career-changers", "professionals"],
    tags: ["html", "css", "javascript", "react", "nodejs", "fullstack", "Technology & Programming", "Web Development Bootcamp", "Professional / Career Skills", "Technology & Programming"],
    
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
    thumbnail: "/assets/courses/personal-finance-mastery.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 99,
    originalPrice: 1499,
    currency: "INR",
    
    category: "Personal Finance",
    subcategory: "Personal Finance Basics",
    vertical: "citizen",
    targetAudience: ["working-professionals", "students", "families"],
    tags: ["finance", "money-management", "investing", "tax", "budgeting", "Citizen & Life Systems", "Personal Finance", "Personal Finance Basics"],
    
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
    thumbnail: "/assets/courses/stock-market-fundamentals.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 149,
    originalPrice: 2499,
    currency: "INR",
    
    category: "Personal Finance",
    subcategory: "Investment Planning",
    vertical: "citizen",
    targetAudience: ["beginners", "working-professionals", "students"],
    tags: ["stocks", "investing", "stock-market", "wealth", "trading", "Citizen & Life Systems", "Personal Finance", "Investment Planning"],
    
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
    thumbnail: "/assets/courses/digital-marketing-complete.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 199,
    originalPrice: 3999,
    currency: "INR",
    
    category: "marketing-communication",
    subcategory: "digital-marketing",
    vertical: "professional",
    targetAudience: ["entrepreneurs", "marketing-professionals", "students"],
    tags: ["digital-marketing", "seo", "social-media", "google-ads", "analytics", "Marketing & Communication", "Digital Marketing", "Professional / Career Skills", "Marketing & Communication"],
    
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
    thumbnail: "/assets/courses/ui-ux-design-masterclass.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 199,
    originalPrice: 3499,
    currency: "INR",
    
    category: "design-creative",
    subcategory: "ui-ux-design",
    vertical: "professional",
    targetAudience: ["design-beginners", "developers", "entrepreneurs"],
    tags: ["ui-design", "ux-design", "figma", "design-thinking", "prototyping", "Design & Creative", "UI/UX Design", "Professional / Career Skills", "Design & Creative"],
    
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
    thumbnail: "/assets/courses/job-prep-complete.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 99,
    originalPrice: 1999,
    currency: "INR",
    
    category: "workplace-life-skills",
    subcategory: "job-preparation",
    vertical: "professional",
    targetAudience: ["job-seekers", "freshers", "professionals"],
    tags: ["resume", "interview", "linkedin", "job-search", "career", "Workplace & Life Skills", "Job Preparation"],
    
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
    thumbnail: "/assets/courses/startup-foundation.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 249,
    originalPrice: 3999,
    currency: "INR",
    
    category: "business-entrepreneurship",
    subcategory: "startup-foundation",
    vertical: "professional",
    targetAudience: ["aspiring-entrepreneurs", "working-professionals", "students"],
    tags: ["startup", "entrepreneurship", "business-plan", "funding", "mvp", "Business & Entrepreneurship", "Startup Foundation"],
    
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
    thumbnail: "/assets/courses/data-science-python.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 249,
    originalPrice: 4999,
    currency: "INR",
    
    category: "technology-programming",
    subcategory: "data-science-fundamentals",
    vertical: "professional",
    targetAudience: ["programmers", "analysts", "students"],
    tags: ["data-science", "machine-learning", "python", "ai", "analytics", "Technology & Programming", "Data Science Fundamentals", "Professional / Career Skills", "Technology & Programming"],
    
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
    thumbnail: "/assets/courses/class10-mathematics.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 149,
    originalPrice: 999,
    currency: "INR",
    
    category: "secondary-school",
    subcategory: "mathematics-secondary",
    vertical: "school",
    targetAudience: ["class10-students"],
    tags: ["class10", "mathematics", "cbse", "board-exam", "icse", "School Education", "Secondary School", "Mathematics"],
    
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
    thumbnail: "/assets/courses/bcom-financial-accounting.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 199,
    originalPrice: 1999,
    currency: "INR",
    
    category: "commerce-business",
    subcategory: "bcom-financial-accounting",
    vertical: "college",
    targetAudience: ["bcom-students", "ca-foundation-students"],
    tags: ["bcom", "accounting", "financial-accounting", "commerce", "ca-foundation", "College (UG)", "Commerce & Business", "B.Com Financial Accounting"],
    
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
    thumbnail: "/assets/courses/excel-mastery.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 99,
    originalPrice: 1499,
    currency: "INR",
    
    category: "tools",
    subcategory: "Office Tools",
    vertical: "professional",
    targetAudience: ["professionals", "students", "entrepreneurs"],
    tags: ["excel", "microsoft", "spreadsheet", "data-analysis", "office", "Professional / Career Skills", "Office Tools"],
    
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
    thumbnail: "/assets/courses/english-communication.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
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
    thumbnail: "/assets/courses/cyber-safety-awareness.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
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
    thumbnail: "/assets/courses/meditation-mindfulness.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
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
    thumbnail: "/assets/courses/indian-constitution.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
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
  },

  // ==================== CONFUSION REMOVERS - LIFE ESSENTIALS ====================
  {
    id: "cr_digital",
    slug: "digital-smartphone-basics",
    title: "Digital & Smartphone Basics",
    tagline: "Understand your phone without fear",
    description: "Learn smartphones, apps, and everyday digital tools without confusion. Perfect for beginners who want to use technology confidently.",
    longDescription: `This course removes the fear from technology by explaining how smartphones and apps actually work. You'll learn to use your phone confidently, install useful apps, and avoid common mistakes.

What you'll learn:
- Understanding smartphone basics
- Installing and managing apps safely
- Using everyday digital tools
- Avoiding common mistakes and scams`,
    thumbnail: "/assets/courses/cr_digital.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 0,
    originalPrice: 0,
    currency: "INR",
    
    category: "confusion-remover",
    subcategory: "Digital Basics",
    vertical: "general",
    targetAudience: ["beginners", "senior-citizens", "anyone-scared-of-technology"],
    tags: ["smartphone", "digital", "basics", "apps", "technology-for-all"],
    
    difficulty: "beginner",
    language: "Hindi",
    totalDuration: 180,
    lessonCount: 12,
    moduleCount: 3,
    rating: 4.8,
    reviewCount: 150,
    enrollmentCount: 500,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cr-digital-1",
        title: "Getting Started with Smartphone",
        order: 1,
        lessons: [
          { id: "les-cr-digital-1", title: "What is a Smartphone?", type: "video", duration: 12, content: "", isFree: true, order: 1 },
          { id: "les-cr-digital-2", title: "Parts of Your Phone", type: "video", duration: 15, content: "", isFree: true, order: 2 },
          { id: "les-cr-digital-3", title: "Turning On/Off and Basic Gestures", type: "video", duration: 12, content: "", isFree: true, order: 3 },
          { id: "les-cr-digital-4", title: "Understanding the Home Screen", type: "video", duration: 15, content: "", isFree: false, order: 4 }
        ]
      },
      {
        id: "mod-cr-digital-2",
        title: "Apps and Installation",
        order: 2,
        lessons: [
          { id: "les-cr-digital-5", title: "What Are Apps?", type: "video", duration: 12, content: "", isFree: false, order: 1 },
          { id: "les-cr-digital-6", title: "Apps & Installation Safety", type: "video", duration: 18, content: "", isFree: false, order: 2 },
          { id: "les-cr-digital-7", title: "How to Download Apps Safely", type: "video", duration: 15, content: "", isFree: false, order: 3 },
          { id: "les-cr-digital-8", title: "Managing and Organizing Apps", type: "video", duration: 15, content: "", isFree: false, order: 4 }
        ]
      },
      {
        id: "mod-cr-digital-3",
        title: "Essential Phone Skills",
        order: 3,
        lessons: [
          { id: "les-cr-digital-9", title: "Making Calls and Sending Messages", type: "video", duration: 15, content: "", isFree: false, order: 1 },
          { id: "les-cr-digital-10", title: "Using Camera and Gallery", type: "video", duration: 15, content: "", isFree: false, order: 2 },
          { id: "les-cr-digital-11", title: "Connecting to WiFi and Internet", type: "video", duration: 18, content: "", isFree: false, order: 3 },
          { id: "les-cr-digital-12", title: "Phone Security and Privacy Basics", type: "video", duration: 18, content: "", isFree: false, order: 4 }
        ]
      }
    ],
    
    instructor: instructors[2],
    
    outcomes: [
      "Use smartphone confidently",
      "Install and manage apps safely",
      "Understand basic phone settings",
      "Avoid common digital mistakes"
    ],
    requirements: [
      "A smartphone (any type)",
      "Willingness to learn",
      "No prior experience needed"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "cr_upi",
    slug: "upi-banking-digital-money",
    title: "UPI, Banking & Digital Money",
    tagline: "Stop fearing failed transactions",
    description: "Understand how digital payments actually work. Learn UPI, banking, and digital money without confusion or fear.",
    longDescription: `Fear of failed transactions and lost money prevents many from using digital payments. This course explains exactly how UPI and digital banking work, what happens during failed transactions, and how to stay safe.

What you'll learn:
- How UPI transactions work
- Understanding failed transactions
- Banking basics everyone should know
- Staying safe from payment fraud`,
    thumbnail: "/assets/courses/cr_upi.svg",
    previewVideo: "https://www.youtube.com/embed/Qc38r-w1e1E",
    price: 0,
    originalPrice: 0,
    currency: "INR",
    
    category: "confusion-remover",
    subcategory: "Digital Money",
    vertical: "general",
    targetAudience: ["everyone", "people-scared-of-digital-payments"],
    tags: ["upi", "banking", "digital-payments", "money", "financial-literacy"],
    
    difficulty: "beginner",
    language: "Hindi",
    totalDuration: 180,
    lessonCount: 12,
    moduleCount: 3,
    rating: 4.9,
    reviewCount: 200,
    enrollmentCount: 750,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cr-upi-1",
        title: "Understanding UPI",
        order: 1,
        lessons: [
          { id: "les-cr-upi-1", title: "What is UPI?", type: "video", duration: 15, content: "", isFree: true, order: 1 },
          { id: "les-cr-upi-2", title: "How UPI Transactions Work", type: "video", duration: 18, content: "", isFree: true, order: 2 },
          { id: "les-cr-upi-3", title: "Setting Up UPI App", type: "video", duration: 18, content: "", isFree: false, order: 3 },
          { id: "les-cr-upi-4", title: "Creating UPI PIN", type: "video", duration: 12, content: "", isFree: false, order: 4 }
        ]
      },
      {
        id: "mod-cr-upi-2",
        title: "Banking Basics",
        order: 2,
        lessons: [
          { id: "les-cr-upi-5", title: "Bank Account Types", type: "video", duration: 15, content: "", isFree: false, order: 1 },
          { id: "les-cr-upi-6", title: "Online Banking Safety", type: "video", duration: 18, content: "", isFree: false, order: 2 },
          { id: "les-cr-upi-7", title: "Understanding Bank Statements", type: "video", duration: 15, content: "", isFree: false, order: 3 },
          { id: "les-cr-upi-8", title: "Linking Bank Accounts to UPI", type: "video", duration: 15, content: "", isFree: false, order: 4 }
        ]
      },
      {
        id: "mod-cr-upi-3",
        title: "Safe Digital Payments",
        order: 3,
        lessons: [
          { id: "les-cr-upi-9", title: "Scanning QR Codes Correctly", type: "video", duration: 12, content: "", isFree: false, order: 1 },
          { id: "les-cr-upi-10", title: "What to Do If Transaction Fails", type: "video", duration: 18, content: "", isFree: false, order: 2 },
          { id: "les-cr-upi-11", title: "Common UPI Scams to Avoid", type: "video", duration: 20, content: "", isFree: false, order: 3 },
          { id: "les-cr-upi-12", title: "Digital Payment Receipts and Records", type: "video", duration: 14, content: "", isFree: false, order: 4 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Use UPI confidently",
      "Understand banking terminology",
      "Handle failed transactions properly",
      "Protect yourself from payment fraud"
    ],
    requirements: [
      "A bank account",
      "A smartphone",
      "Willingness to learn digital payments"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "cr_gov",
    slug: "government-portals-certificates",
    title: "Government Portals & Certificates",
    tagline: "Aadhaar, PAN, DigiLocker made simple",
    description: "Understand government documents and portals - why they exist and how to use them correctly without confusion.",
    longDescription: `Government documents and portals can be confusing. This course explains Aadhaar, PAN, DigiLocker, and other important government services in simple terms.

What you'll learn:
- Purpose of Aadhaar, PAN, and other documents
- How to use DigiLocker correctly
- Common mistakes to avoid
- Official processes explained simply`,
    thumbnail: "/assets/courses/cr_gov.svg",
    previewVideo: "https://www.youtube.com/embed/w8g7p6jTz_o",
    price: 0,
    originalPrice: 0,
    currency: "INR",
    
    category: "confusion-remover",
    subcategory: "Government Documents",
    vertical: "general",
    targetAudience: ["everyone", "people-struggling-with-govt-docs"],
    tags: ["aadhaar", "pan", "digilocker", "government", "documents"],
    
    difficulty: "beginner",
    language: "Hindi",
    totalDuration: 180,
    lessonCount: 12,
    moduleCount: 3,
    rating: 4.7,
    reviewCount: 180,
    enrollmentCount: 600,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cr-gov-1",
        title: "Aadhaar - Your Identity Proof",
        order: 1,
        lessons: [
          { id: "les-cr-gov-1", title: "What is Aadhaar?", type: "video", duration: 12, content: "", isFree: true, order: 1 },
          { id: "les-cr-gov-2", title: "Why Do You Need Aadhaar?", type: "video", duration: 15, content: "", isFree: true, order: 2 },
          { id: "les-cr-gov-3", title: "Aadhaar Card vs Number", type: "video", duration: 12, content: "", isFree: false, order: 3 },
          { id: "les-cr-gov-4", title: "Updating Aadhaar Details", type: "video", duration: 18, content: "", isFree: false, order: 4 }
        ]
      },
      {
        id: "mod-cr-gov-2",
        title: "PAN and Financial Identity",
        order: 2,
        lessons: [
          { id: "les-cr-gov-5", title: "What is PAN Card?", type: "video", duration: 15, content: "", isFree: false, order: 1 },
          { id: "les-cr-gov-6", title: "PAN vs Aadhaar - When to Use What", type: "video", duration: 18, content: "", isFree: false, order: 2 },
          { id: "les-cr-gov-7", title: "Linking PAN with Aadhaar", type: "video", duration: 15, content: "", isFree: false, order: 3 },
          { id: "les-cr-gov-8", title: "PAN Card Mistakes to Avoid", type: "video", duration: 15, content: "", isFree: false, order: 4 }
        ]
      },
      {
        id: "mod-cr-gov-3",
        title: "Digital Government Services",
        order: 3,
        lessons: [
          { id: "les-cr-gov-9", title: "What is DigiLocker?", type: "video", duration: 15, content: "", isFree: false, order: 1 },
          { id: "les-cr-gov-10", title: "Setting Up DigiLocker Account", type: "video", duration: 18, content: "", isFree: false, order: 2 },
          { id: "les-cr-gov-11", title: "Accessing Your Documents", type: "video", duration: 15, content: "", isFree: false, order: 3 },
          { id: "les-cr-gov-12", title: "Other Important Government Portals", type: "video", duration: 12, content: "", isFree: false, order: 4 }
        ]
      }
    ],
    
    instructor: instructors[6],
    
    outcomes: [
      "Understand government documents",
      "Use DigiLocker effectively",
      "Complete government tasks confidently",
      "Avoid document-related mistakes"
    ],
    requirements: [
      "Basic understanding of documents",
      "Aadhaar number (if available)",
      "Willingness to learn"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "cr_fraud",
    slug: "online-safety-fraud-awareness",
    title: "Online Safety & Fraud Awareness",
    tagline: "Protect yourself from online scams",
    description: "Learn how fraud happens, common scams to watch for, and how to protect yourself and your money online.",
    longDescription: `Online fraud is a real threat, but knowing how it works is your best protection. This course explains common scams, how fraudsters operate, and practical steps to stay safe.

What you'll learn:
- How OTP fraud works
- Common online scams to avoid
- Protecting your personal data
- What to do if you're scammed`,
    thumbnail: "/assets/courses/cr_fraud.svg",
    previewVideo: "https://www.youtube.com/embed/z5nc9MDd-hY",
    price: 0,
    originalPrice: 0,
    currency: "INR",
    
    category: "confusion-remover",
    subcategory: "Online Safety",
    vertical: "general",
    targetAudience: ["everyone", "people-worried-about-online-fraud"],
    tags: ["fraud", "online-safety", "otp", "scams", "cyber-security"],
    
    difficulty: "beginner",
    language: "Hindi",
    totalDuration: 180,
    lessonCount: 12,
    moduleCount: 3,
    rating: 4.9,
    reviewCount: 300,
    enrollmentCount: 1000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cr-fraud-1",
        title: "Understanding Common Frauds",
        order: 1,
        lessons: [
          { id: "les-cr-fraud-1", title: "How OTP Fraud Works", type: "video", duration: 20, content: "", isFree: true, order: 1 },
          { id: "les-cr-fraud-2", title: "UPI Payment Frauds", type: "video", duration: 18, content: "", isFree: true, order: 2 },
          { id: "les-cr-fraud-3", title: "Investment Scams", type: "video", duration: 20, content: "", isFree: false, order: 3 },
          { id: "les-cr-fraud-4", title: "Fake Calls and Messages", type: "video", duration: 15, content: "", isFree: false, order: 4 }
        ]
      },
      {
        id: "mod-cr-fraud-2",
        title: "Protecting Yourself Online",
        order: 2,
        lessons: [
          { id: "les-cr-fraud-5", title: "Creating Strong Passwords", type: "video", duration: 15, content: "", isFree: false, order: 1 },
          { id: "les-cr-fraud-6", title: "Two-Factor Authentication", type: "video", duration: 15, content: "", isFree: false, order: 2 },
          { id: "les-cr-fraud-7", title: "Safe Browsing Habits", type: "video", duration: 18, content: "", isFree: false, order: 3 },
          { id: "les-cr-fraud-8", title: "Recognizing Phishing Attempts", type: "video", duration: 15, content: "", isFree: false, order: 4 }
        ]
      },
      {
        id: "mod-cr-fraud-3",
        title: "Responding to Fraud",
        order: 3,
        lessons: [
          { id: "les-cr-fraud-9", title: "Personal Data Protection", type: "video", duration: 18, content: "", isFree: false, order: 1 },
          { id: "les-cr-fraud-10", title: "What to Do If You're Scammed", type: "video", duration: 18, content: "", isFree: false, order: 2 },
          { id: "les-cr-fraud-11", title: "Reporting Fraud to Authorities", type: "video", duration: 15, content: "", isFree: false, order: 3 },
          { id: "les-cr-fraud-12", title: "Protecting Your Family", type: "video", duration: 18, content: "", isFree: false, order: 4 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Recognize common scams",
      "Protect personal information",
      "Respond properly to suspicious calls/messages",
      "Report fraud effectively"
    ],
    requirements: [
      "A phone (mobile or smartphone)",
      "Basic awareness of using phone calls/messages",
      "Willingness to learn safety practices"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "cr_money",
    slug: "personal-money-basics",
    title: "Personal Money Basics",
    tagline: "Income, savings, and financial clarity",
    description: "Understand income, savings, EMI, and loans - the simple system of personal money explained clearly.",
    longDescription: `Money management doesn't have to be complicated. This course breaks down personal finance into simple concepts anyone can understand and apply.

What you'll learn:
- Understanding your income
- Smart saving strategies
- How EMI and loans work
- Budgeting made simple`,
    thumbnail: "/assets/courses/cr_money.svg",
    previewVideo: "https://www.youtube.com/embed/4j2emMn7UaI",
    price: 0,
    originalPrice: 0,
    currency: "INR",
    
    category: "confusion-remover",
    subcategory: "Personal Money",
    vertical: "general",
    targetAudience: ["everyone", "people-struggling-with-money-management"],
    tags: ["money", "savings", "budget", "emi", "personal-finance"],
    
    difficulty: "beginner",
    language: "Hindi",
    totalDuration: 180,
    lessonCount: 12,
    moduleCount: 3,
    rating: 4.8,
    reviewCount: 220,
    enrollmentCount: 800,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cr-money-1",
        title: "Understanding Your Income",
        order: 1,
        lessons: [
          { id: "les-cr-money-1", title: "Types of Income", type: "video", duration: 12, content: "", isFree: true, order: 1 },
          { id: "les-cr-money-2", title: "Take-Home vs Gross Salary", type: "video", duration: 15, content: "", isFree: true, order: 2 },
          { id: "les-cr-money-3", title: "Deductions Explained", type: "video", duration: 15, content: "", isFree: false, order: 3 },
          { id: "les-cr-money-4", title: "Side Income Possibilities", type: "video", duration: 15, content: "", isFree: false, order: 4 }
        ]
      },
      {
        id: "mod-cr-money-2",
        title: "Credit, Loans, and EMI",
        order: 2,
        lessons: [
          { id: "les-cr-money-5", title: "Credit Cards Explained", type: "video", duration: 18, content: "", isFree: false, order: 1 },
          { id: "les-cr-money-6", title: "How EMI Works", type: "video", duration: 15, content: "", isFree: false, order: 2 },
          { id: "les-cr-money-7", title: "Types of Loans", type: "video", duration: 15, content: "", isFree: false, order: 3 },
          { id: "les-cr-money-8", title: "Good Debt vs Bad Debt", type: "video", duration: 15, content: "", isFree: false, order: 4 }
        ]
      },
      {
        id: "mod-cr-money-3",
        title: "Saving and Budgeting",
        order: 3,
        lessons: [
          { id: "les-cr-money-9", title: "Budgeting Methods", type: "video", duration: 15, content: "", isFree: false, order: 1 },
          { id: "les-cr-money-10", title: "Savings Strategies", type: "video", duration: 15, content: "", isFree: false, order: 2 },
          { id: "les-cr-money-11", title: "Emergency Fund Basics", type: "video", duration: 15, content: "", isFree: false, order: 3 },
          { id: "les-cr-money-12", title: "Tracking Your Expenses", type: "video", duration: 15, content: "", isFree: false, order: 4 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Track income and expenses",
      "Make smart saving decisions",
      "Understand loans and EMI",
      "Build better money habits"
    ],
    requirements: [
      "Any income source (job, business, etc.)",
      "Desire to manage money better",
      "No prior financial knowledge needed"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "cr_english",
    slug: "english-communication",
    title: "English & Communication",
    tagline: "Remove the fear from English",
    description: "Practical English communication for daily life and work. Build confidence in speaking and understanding English.",
    longDescription: `English fear is common, but it shouldn't hold you back. This course focuses on practical English skills for everyday situations - conversations, phone calls, and work communication.

What you'll learn:
- Overcoming English fear
- Phone conversation basics
- Professional email writing
- Practical speaking scenarios`,
    thumbnail: "/assets/courses/cr_english.svg",
    previewVideo: "https://www.youtube.com/embed/JuJi9w8_v1o",
    price: 0,
    originalPrice: 0,
    currency: "INR",
    
    category: "confusion-remover",
    subcategory: "English Communication",
    vertical: "general",
    targetAudience: ["people-scared-of-english", "working-professionals", "students"],
    tags: ["english", "communication", "speaking", "confidence", "language"],
    
    difficulty: "beginner",
    language: "Hindi",
    totalDuration: 180,
    lessonCount: 12,
    moduleCount: 3,
    rating: 4.7,
    reviewCount: 250,
    enrollmentCount: 900,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cr-english-1",
        title: "Overcoming English Fear",
        order: 1,
        lessons: [
          { id: "les-cr-english-1", title: "Removing Fear from English", type: "video", duration: 15, content: "", isFree: true, order: 1 },
          { id: "les-cr-english-2", title: "Why We Fear English", type: "video", duration: 12, content: "", isFree: true, order: 2 },
          { id: "les-cr-english-3", title: "Small Steps to Build Confidence", type: "video", duration: 15, content: "", isFree: false, order: 3 },
          { id: "les-cr-english-4", title: "Practice Methods That Work", type: "video", duration: 15, content: "", isFree: false, order: 4 }
        ]
      },
      {
        id: "mod-cr-english-2",
        title: "Speaking and Listening",
        order: 2,
        lessons: [
          { id: "les-cr-english-5", title: "Phone Etiquette", type: "video", duration: 15, content: "", isFree: false, order: 1 },
          { id: "les-cr-english-6", title: "Introduce Yourself Confidently", type: "video", duration: 12, content: "", isFree: false, order: 2 },
          { id: "les-cr-english-7", title: "Common Phrases for Daily Use", type: "video", duration: 15, content: "", isFree: false, order: 3 },
          { id: "les-cr-english-8", title: "Listening Practice", type: "video", duration: 15, content: "", isFree: false, order: 4 }
        ]
      },
      {
        id: "mod-cr-english-3",
        title: "Reading and Writing",
        order: 3,
        lessons: [
          { id: "les-cr-english-9", title: "Reading Skills for Understanding", type: "video", duration: 15, content: "", isFree: false, order: 1 },
          { id: "les-cr-english-10", title: "Professional Email Writing", type: "video", duration: 18, content: "", isFree: false, order: 2 },
          { id: "les-cr-english-11", title: "Message Writing Basics", type: "video", duration: 12, content: "", isFree: false, order: 3 },
          { id: "les-cr-english-12", title: "Document Reading Practice", type: "video", duration: 15, content: "", isFree: false, order: 4 }
        ]
      }
    ],
    
    instructor: instructors[4],
    
    outcomes: [
      "Speak English with confidence",
      "Handle phone conversations",
      "Write professional messages",
      "Overcome language anxiety"
    ],
    requirements: [
      "Basic understanding of English alphabet",
      "Willingness to practice",
      "No pressure - learn at your pace"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  // ==================== CONFUSION REMOVERS - COMMUNITY UNDERSTANDING ====================
  {
    id: "cr_bulk",
    slug: "community-bulk-buying",
    title: "Community Bulk Buying Model",
    tagline: "Understanding pooling and community purchasing",
    description: "Learn how community bulk buying works, the benefits of pooling, and how to participate safely.",
    longDescription: `Bulk buying through community groups is becoming popular, but understanding how it works helps you participate safely and get real benefits.

What you'll learn:
- How bulk buying groups work
- Real cost calculation
- Building trust in groups
- Common pitfalls to avoid`,
    thumbnail: "/assets/courses/cr_bulk.svg",
    previewVideo: "https://www.youtube.com/embed/tyjZ2t6w4O0",
    price: 0,
    originalPrice: 0,
    currency: "INR",
    
    category: "community-understanding",
    subcategory: "Bulk Buying",
    vertical: "general",
    targetAudience: ["community-members", "anyone-interested-in-pooling"],
    tags: ["bulk-buying", "community", "pooling", "savings", "collective-purchasing"],
    
    difficulty: "beginner",
    language: "Hindi",
    totalDuration: 135,
    lessonCount: 12,
    moduleCount: 3,
    rating: 4.6,
    reviewCount: 100,
    enrollmentCount: 400,
    isActive: true,
    isFeatured: false,
    
    modules: [
      {
        id: "mod-cr-bulk-1",
        title: "Understanding Community Buying",
        order: 1,
        lessons: [
          { id: "les-cr-bulk-1", title: "What is Community Buying?", type: "video", duration: 10, content: "", isFree: true, order: 1 },
          { id: "les-cr-bulk-2", title: "How Bulk Buying Groups Form", type: "video", duration: 12, content: "", isFree: true, order: 2 },
          { id: "les-cr-bulk-3", title: "Types of Community Buying Models", type: "video", duration: 11, content: "", isFree: false, order: 3 },
          { id: "les-cr-bulk-4", title: "Benefits of Community Purchasing", type: "video", duration: 10, content: "", isFree: false, order: 4 }
        ]
      },
      {
        id: "mod-cr-bulk-2",
        title: "Economics and Calculations",
        order: 2,
        lessons: [
          { id: "les-cr-bulk-5", title: "Real Cost Calculation", type: "video", duration: 12, content: "", isFree: false, order: 1 },
          { id: "les-cr-bulk-6", title: "Hidden Costs to Consider", type: "video", duration: 10, content: "", isFree: false, order: 2 },
          { id: "les-cr-bulk-7", title: "Savings Breakdown Examples", type: "video", duration: 12, content: "", isFree: false, order: 3 },
          { id: "les-cr-bulk-8", title: "When Bulk Buying Makes Sense", type: "video", duration: 11, content: "", isFree: false, order: 4 }
        ]
      },
      {
        id: "mod-cr-bulk-3",
        title: "Safety and Trust Building",
        order: 3,
        lessons: [
          { id: "les-cr-bulk-9", title: "Building Trust", type: "video", duration: 11, content: "", isFree: false, order: 1 },
          { id: "les-cr-bulk-10", title: "Safety in Groups", type: "video", duration: 12, content: "", isFree: false, order: 2 },
          { id: "les-cr-bulk-11", title: "Common Scams to Watch", type: "video", duration: 12, content: "", isFree: false, order: 3 },
          { id: "les-cr-bulk-12", title: "Successful Participation Tips", type: "video", duration: 10, content: "", isFree: false, order: 4 }
        ]
      }
    ],
    
    instructor: instructors[6],
    
    outcomes: [
      "Understand bulk buying economics",
      "Calculate real savings",
      "Participate safely in groups",
      "Build community connections"
    ],
    requirements: [
      "Interest in community activities",
      "Basic math skills",
      "Community mindset"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "cr_foodwork",
    slug: "food-for-work-model",
    title: "Food-for-Work Model",
    tagline: "Dignity-based community support",
    description: "Understand food-for-work programs, how they function, and how to access dignity-based community support.",
    longDescription: `Food-for-work programs provide dignity-based support to communities. Understanding how these programs work helps you access benefits and support others.

What you'll learn:
- How food-for-work programs work
- Finding legitimate programs
- Your rights and benefits
- Participating with dignity`,
    thumbnail: "/assets/courses/cr_foodwork.svg",
    previewVideo: "https://www.youtube.com/embed/7FvF9qz8z4g",
    price: 0,
    originalPrice: 0,
    currency: "INR",
    
    category: "community-understanding",
    subcategory: "Food for Work",
    vertical: "general",
    targetAudience: ["community-members", "people-seeking-support", "social-workers"],
    tags: ["food-work", "community-support", "mgnrega", "dignity", "welfare"],
    
    difficulty: "beginner",
    language: "Hindi",
    totalDuration: 135,
    lessonCount: 12,
    moduleCount: 3,
    rating: 4.7,
    reviewCount: 120,
    enrollmentCount: 450,
    isActive: true,
    isFeatured: false,
    
    modules: [
      {
        id: "mod-cr-foodwork-1",
        title: "Understanding Food-for-Work",
        order: 1,
        lessons: [
          { id: "les-cr-foodwork-1", title: "What is Food-for-Work?", type: "video", duration: 10, content: "", isFree: true, order: 1 },
          { id: "les-cr-foodwork-2", title: "How Food-for-Work Programs Work", type: "video", duration: 12, content: "", isFree: true, order: 2 },
          { id: "les-cr-foodwork-3", title: "History and Evolution", type: "video", duration: 11, content: "", isFree: false, order: 3 },
          { id: "les-cr-foodwork-4", title: "Who Benefits from These Programs", type: "video", duration: 10, content: "", isFree: false, order: 4 }
        ]
      },
      {
        id: "mod-cr-foodwork-2",
        title: "Finding and Accessing Programs",
        order: 2,
        lessons: [
          { id: "les-cr-foodwork-5", title: "Finding Programs Near You", type: "video", duration: 12, content: "", isFree: false, order: 1 },
          { id: "les-cr-foodwork-6", title: "Eligibility Requirements", type: "video", duration: 11, content: "", isFree: false, order: 2 },
          { id: "les-cr-foodwork-7", title: "Application Process", type: "video", duration: 12, content: "", isFree: false, order: 3 },
          { id: "les-cr-foodwork-8", title: "Documentation Needed", type: "video", duration: 10, content: "", isFree: false, order: 4 }
        ]
      },
      {
        id: "mod-cr-foodwork-3",
        title: "Rights, Benefits, and Participation",
        order: 3,
        lessons: [
          { id: "les-cr-foodwork-9", title: "Your Rights and Benefits", type: "video", duration: 12, content: "", isFree: false, order: 1 },
          { id: "les-cr-foodwork-10", title: "Participating with Dignity", type: "video", duration: 11, content: "", isFree: false, order: 2 },
          { id: "les-cr-foodwork-11", title: "Common Problems and Solutions", type: "video", duration: 12, content: "", isFree: false, order: 3 },
          { id: "les-cr-foodwork-12", title: "Supporting Others in Need", type: "video", duration: 10, content: "", isFree: false, order: 4 }
        ]
      }
    ],
    
    instructor: instructors[6],
    
    outcomes: [
      "Understand food-for-work programs",
      "Find legitimate programs",
      "Know your rights",
      "Participate with dignity"
    ],
    requirements: [
      "Interest in community programs",
      "Basic awareness of local programs",
      "Respect for community processes"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "cr_community",
    slug: "how-community-systems-work",
    title: "How Community Systems Work",
    tagline: "NGOs, Panchayats, CSR made clear",
    description: "Understand how NGOs, Panchayats, CSR, and community systems work to organize and support communities.",
    longDescription: `Community systems can seem complex, but understanding them helps you access support and participate in community development.

What you'll learn:
- How Panchayats function
- Understanding NGOs and their work
- CSR programs and how to access them
- Government welfare schemes`,
    thumbnail: "/assets/courses/cr_community.svg",
    previewVideo: "https://www.youtube.com/embed/1fJ_g4-D3jY",
    price: 0,
    originalPrice: 0,
    currency: "INR",
    
    category: "community-understanding",
    subcategory: "Community Systems",
    vertical: "general",
    targetAudience: ["community-members", "social-workers", "citizens"],
    tags: ["ngos", "panchayat", "csr", "community", "government-schemes"],
    
    difficulty: "beginner",
    language: "Hindi",
    totalDuration: 135,
    lessonCount: 12,
    moduleCount: 3,
    rating: 4.6,
    reviewCount: 130,
    enrollmentCount: 500,
    isActive: true,
    isFeatured: false,
    
    modules: [
      {
        id: "mod-cr-community-1",
        title: "Local Government and Panchayats",
        order: 1,
        lessons: [
          { id: "les-cr-community-1", title: "How Panchayats Work", type: "video", duration: 10, content: "", isFree: true, order: 1 },
          { id: "les-cr-community-2", title: "Panchayat Structure Explained", type: "video", duration: 12, content: "", isFree: true, order: 2 },
          { id: "les-cr-community-3", title: "Your Sarpanch and Ward Member", type: "video", duration: 11, content: "", isFree: false, order: 3 },
          { id: "les-cr-community-4", title: "Gram Sabha and Your Voice", type: "video", duration: 10, content: "", isFree: false, order: 4 }
        ]
      },
      {
        id: "mod-cr-community-2",
        title: "NGOs and Civil Society",
        order: 2,
        lessons: [
          { id: "les-cr-community-5", title: "Understanding NGOs", type: "video", duration: 12, content: "", isFree: false, order: 1 },
          { id: "les-cr-community-6", title: "Types of NGOs", type: "video", duration: 11, content: "", isFree: false, order: 2 },
          { id: "les-cr-community-7", title: "Verifying Legitimate NGOs", type: "video", duration: 12, content: "", isFree: false, order: 3 },
          { id: "les-cr-community-8", title: "Working with NGOs", type: "video", duration: 10, content: "", isFree: false, order: 4 }
        ]
      },
      {
        id: "mod-cr-community-3",
        title: "CSR and Government Schemes",
        order: 3,
        lessons: [
          { id: "les-cr-community-9", title: "CSR Programs Explained", type: "video", duration: 11, content: "", isFree: false, order: 1 },
          { id: "les-cr-community-10", title: "Government Welfare Schemes", type: "video", duration: 12, content: "", isFree: false, order: 2 },
          { id: "les-cr-community-11", title: "Accessing Community Benefits", type: "video", duration: 11, content: "", isFree: false, order: 3 },
          { id: "les-cr-community-12", title: "Participating in Community Development", type: "video", duration: 10, content: "", isFree: false, order: 4 }
        ]
      }
    ],
    
    instructor: instructors[6],
    
    outcomes: [
      "Understand local government",
      "Work with NGOs effectively",
      "Access CSR benefits",
      "Utilize government schemes"
    ],
    requirements: [
      "Interest in community affairs",
      "Basic awareness of local systems",
      "Desire to participate in community"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  // ==================== POSTGRADUATE COURSES (PG) ====================
  
  // ==================== MBA COURSES ====================
  {
    id: "pg_mba_finance",
    slug: "pg-mba-finance",
    title: "MBA in Finance - Advanced Program",
    tagline: "Master Financial Management & Investment Strategies",
    description: "Advanced MBA program focusing on financial management, investment analysis, and corporate finance strategies for career advancement.",
    longDescription: `Advance your career with our comprehensive MBA in Finance program. This course covers advanced financial concepts, investment strategies, and corporate finance practices that are essential for managerial roles.

What you'll learn:
- Advanced Financial Analysis & Modeling
- Investment Portfolio Management
- Corporate Finance Strategies
- Risk Management & Derivatives
- Financial Markets & Institutions`,
    thumbnail: "/assets/courses/pg-mba-finance.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 499,
    originalPrice: 9999,
    currency: "INR",
    
    category: "Management (MBA)",
    subcategory: "MBA in Finance",
    vertical: "pg",
    targetAudience: ["bba-graduates", "bcom-graduates", "working-professionals"],
    tags: ["mba", "finance", "investment", "corporate-finance", "management", "Post-Graduate (PG)", "Management (MBA)", "MBA in Finance"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 3000,
    lessonCount: 150,
    moduleCount: 12,
    rating: 4.9,
    reviewCount: 850,
    enrollmentCount: 5000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-mba-fin-1",
        title: "Advanced Financial Analysis",
        order: 1,
        lessons: [
          { id: "les-mba-fin-1", title: "Financial Statement Analysis Deep Dive", type: "video", duration: 45, content: "", isFree: true, order: 1 },
          { id: "les-mba-fin-2", title: "Ratio Analysis & Interpretation", type: "video", duration: 40, content: "", isFree: false, order: 2 },
          { id: "les-mba-fin-3", title: "Cash Flow Analysis", type: "video", duration: 35, content: "", isFree: false, order: 3 },
          { id: "les-mba-fin-4", title: "Working Capital Management", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-mba-fin-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-mba-fin-2",
        title: "Investment Analysis & Portfolio Management",
        order: 2,
        lessons: [
          { id: "les-mba-fin-6", title: "Equity Analysis Frameworks", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-mba-fin-7", title: "Valuation Methods (DCF, Comparable)", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-mba-fin-8", title: "Portfolio Theory & Asset Allocation", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-mba-fin-9", title: "Modern Portfolio Management", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-mba-fin-10", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-mba-fin-3",
        title: "Corporate Finance Strategies",
        order: 3,
        lessons: [
          { id: "les-mba-fin-11", title: "Capital Structure Decisions", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-mba-fin-12", title: "Dividend Policy & Payout", type: "video", duration: 35, content: "", isFree: false, order: 2 },
          { id: "les-mba-fin-13", title: "Merger & Acquisition Basics", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-mba-fin-14", title: "Corporate Restructuring", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-mba-fin-15", title: "Final Project", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Analyze complex financial statements",
      "Build and manage investment portfolios",
      "Make strategic corporate finance decisions",
      "Understand financial markets and instruments"
    ],
    requirements: [
      "Bachelor's degree in any discipline",
      "Basic understanding of accounting and finance",
      "Willingness to learn advanced concepts"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },
  
  {
    id: "pg_mba_marketing",
    slug: "pg-mba-marketing",
    title: "MBA in Marketing Management",
    tagline: "Digital Marketing & Brand Strategy Mastery",
    description: "Comprehensive MBA program covering digital marketing strategies, brand management, and consumer behavior analysis.",
    longDescription: `Transform your marketing career with our advanced MBA in Marketing program. Learn cutting-edge digital marketing techniques, brand strategies, and consumer insights that drive business growth.

What you'll learn:
- Digital Marketing Strategy & Execution
- Brand Management & Positioning
- Consumer Behavior Analysis
- Marketing Analytics & ROI
- Omnichannel Marketing`,
    thumbnail: "/assets/courses/pg-mba-marketing.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 499,
    originalPrice: 9999,
    currency: "INR",
    
    category: "Management (MBA)",
    subcategory: "MBA in Marketing Management",
    vertical: "pg",
    targetAudience: ["bba-graduates", "communications-graduates", "working-professionals"],
    tags: ["mba", "marketing", "digital-marketing", "brand-management", "strategy", "Post-Graduate (PG)", "Management (MBA)", "MBA in Marketing Management"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 2800,
    lessonCount: 140,
    moduleCount: 10,
    rating: 4.8,
    reviewCount: 720,
    enrollmentCount: 4500,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-mba-mkt-1",
        title: "Digital Marketing Foundation",
        order: 1,
        lessons: [
          { id: "les-mba-mkt-1", title: "Digital Marketing Landscape", type: "video", duration: 40, content: "", isFree: true, order: 1 },
          { id: "les-mba-mkt-2", title: "SEO & Content Strategy", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-mba-mkt-3", title: "Social Media Marketing", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-mba-mkt-4", title: "PPC & Performance Marketing", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-mba-mkt-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-mba-mkt-2",
        title: "Brand Strategy",
        order: 2,
        lessons: [
          { id: "les-mba-mkt-6", title: "Brand Positioning & Identity", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-mba-mkt-7", title: "Brand Architecture", type: "video", duration: 35, content: "", isFree: false, order: 2 },
          { id: "les-mba-mkt-8", title: "Consumer Decision Journey", type: "video", duration: 40, content: "", isFree: false, order: 3 },
          { id: "les-mba-mkt-9", title: "Marketing Analytics", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-mba-mkt-10", title: "Capstone Project", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[2],
    
    outcomes: [
      "Create comprehensive digital marketing strategies",
      "Build and manage strong brands",
      "Analyze consumer behavior patterns",
      "Measure and optimize marketing ROI"
    ],
    requirements: [
      "Bachelor's degree in any discipline",
      "Basic understanding of marketing concepts",
      "Interest in digital marketing"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },
  
  {
    id: "pg_mba_hr",
    slug: "pg-mba-hr",
    title: "MBA in Human Resources Management",
    tagline: "People Strategy & Organizational Development",
    description: "Advanced HR management program covering talent acquisition, organizational behavior, and HR analytics.",
    longDescription: `Build expertise in human resources with our comprehensive MBA in HR program. Learn strategic HR practices, talent management, and organizational development that drive business success.

What you'll learn:
- Strategic Talent Management
- Organizational Development
- HR Analytics & Metrics
- Employee Relations & Engagement
- Labor Laws & Compliance`,
    thumbnail: "/assets/courses/pg-mba-hr.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 499,
    originalPrice: 9999,
    currency: "INR",
    
    category: "Management (MBA)",
    subcategory: "MBA in Human Resource Management",
    vertical: "pg",
    targetAudience: ["bba-graduates", "psychology-graduates", "working-professionals"],
    tags: ["mba", "human-resources", "talent-management", "organizational-behavior", "hr-analytics", "Post-Graduate (PG)", "Management (MBA)", "MBA in Human Resource Management"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 2600,
    lessonCount: 130,
    moduleCount: 10,
    rating: 4.7,
    reviewCount: 580,
    enrollmentCount: 3800,
    isActive: true,
    isFeatured: false,
    
    modules: [
      {
        id: "mod-mba-hr-1",
        title: "Strategic HR Management",
        order: 1,
        lessons: [
          { id: "les-mba-hr-1", title: "HR Strategy & Business Alignment", type: "video", duration: 40, content: "", isFree: true, order: 1 },
          { id: "les-mba-hr-2", title: "Talent Acquisition Strategy", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-mba-hr-3", title: "Performance Management Systems", type: "video", duration: 40, content: "", isFree: false, order: 3 },
          { id: "les-mba-hr-4", title: "Learning & Development", type: "video", duration: 35, content: "", isFree: false, order: 4 },
          { id: "les-mba-hr-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-mba-hr-2",
        title: "Organizational Development",
        order: 2,
        lessons: [
          { id: "les-mba-hr-6", title: "Organizational Behavior", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-mba-hr-7", title: "Change Management", type: "video", duration: 40, content: "", isFree: false, order: 2 },
          { id: "les-mba-hr-8", title: "HR Analytics", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-mba-hr-9", title: "Employee Engagement", type: "video", duration: 35, content: "", isFree: false, order: 4 },
          { id: "les-mba-hr-10", title: "Final Project", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[4],
    
    outcomes: [
      "Develop strategic HR practices",
      "Manage talent acquisition and development",
      "Analyze HR metrics and analytics",
      "Lead organizational change initiatives"
    ],
    requirements: [
      "Bachelor's degree in any discipline",
      "Interest in people management",
      "Basic understanding of business operations"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  // ==================== M.COM COURSES ====================
  {
    id: "pg_mcom_accounting",
    slug: "pg-mcom-accounting",
    title: "M.Com Advanced Accounting",
    tagline: "Master Corporate Accounting & Financial Reporting",
    description: "Advanced accounting program covering corporate accounting, accounting standards, and financial reporting for M.Com students.",
    longDescription: `Enhance your accounting expertise with our M.Com in Advanced Accounting program. Learn sophisticated accounting techniques, corporate reporting standards, and financial analysis methods used in modern businesses.

What you'll learn:
- Advanced Financial Accounting
- Accounting Standards (Indian & International)
- Corporate Accounting Practices
- Advanced Cost Accounting
- Auditing & Assurance`,
    thumbnail: "/assets/courses/pg-mcom-accounting.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 349,
    originalPrice: 7999,
    currency: "INR",
    
    category: "M.Com",
    subcategory: "M.Com in Accounting",
    vertical: "pg",
    targetAudience: ["bcom-graduates", "ca-foundation", "working-accountants"],
    tags: ["mcom", "accounting", "financial-reporting", "auditing", "corporate-finance", "Post-Graduate (PG)", "M.Com", "M.Com in Accounting"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 2400,
    lessonCount: 120,
    moduleCount: 10,
    rating: 4.8,
    reviewCount: 650,
    enrollmentCount: 4200,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-mcom-acc-1",
        title: "Advanced Financial Accounting",
        order: 1,
        lessons: [
          { id: "les-mcom-acc-1", title: "Advanced Account Concepts", type: "video", duration: 45, content: "", isFree: true, order: 1 },
          { id: "les-mcom-acc-2", title: "Partnership Accounting", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-mcom-acc-3", title: "Company Accounts - Issue of Shares", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-mcom-acc-4", title: "Company Accounts - Debentures", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-mcom-acc-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-mcom-acc-2",
        title: "Accounting Standards & Practices",
        order: 2,
        lessons: [
          { id: "les-mcom-acc-6", title: "Indian Accounting Standards", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-mcom-acc-7", title: "IFRS Overview", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-mcom-acc-8", title: "Consolidated Financial Statements", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-mcom-acc-9", title: "Advanced Cost Accounting", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-mcom-acc-10", title: "Final Project", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Master advanced accounting concepts",
      "Apply accounting standards professionally",
      "Prepare corporate financial statements",
      "Conduct cost analysis and auditing"
    ],
    requirements: [
      "B.Com degree or equivalent",
      "Basic accounting knowledge",
      "Understanding of financial statements"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },
  
  {
    id: "pg_mcom_taxation",
    slug: "pg-mcom-taxation",
    title: "M.Com Taxation & Tax Planning",
    tagline: "Comprehensive Tax Management & Planning",
    description: "Advanced taxation program covering direct tax, GST, and tax planning strategies for financial professionals.",
    longDescription: `Master Indian taxation with our comprehensive M.Com in Taxation program. Learn income tax laws, GST implementation, and strategic tax planning that saves money for individuals and corporations.

What you'll learn:
- Income Tax Law & Planning
- GST (Goods & Services Tax)
- International Taxation
- Tax Compliance & Filing
- Tax Planning Strategies`,
    thumbnail: "/assets/courses/pg-mcom-taxation.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 349,
    originalPrice: 7999,
    currency: "INR",
    
    category: "M.Com",
    subcategory: "M.Com in Taxation",
    vertical: "pg",
    targetAudience: ["bcom-graduates", "tax-professionals", "ca-foundation"],
    tags: ["mcom", "taxation", "income-tax", "gst", "tax-planning", "Post-Graduate (PG)", "M.Com", "M.Com in Taxation"],
    
    difficulty: "advanced",
    language: "Hindi",
    totalDuration: 2200,
    lessonCount: 110,
    moduleCount: 9,
    rating: 4.9,
    reviewCount: 780,
    enrollmentCount: 5100,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-mcom-tax-1",
        title: "Direct Taxation",
        order: 1,
        lessons: [
          { id: "les-mcom-tax-1", title: "Income Tax Fundamentals", type: "video", duration: 45, content: "", isFree: true, order: 1 },
          { id: "les-mcom-tax-2", title: "Heads of Income", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-mcom-tax-3", title: "Deductions & Exemptions", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-mcom-tax-4", title: "Tax Filing Procedures", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-mcom-tax-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-mcom-tax-2",
        title: "Indirect Taxation (GST)",
        order: 2,
        lessons: [
          { id: "les-mcom-tax-6", title: "GST Framework in India", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-mcom-tax-7", title: "GST Registration & Compliance", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-mcom-tax-8", title: "Input Tax Credit", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-mcom-tax-9", title: "Tax Planning Strategies", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-mcom-tax-10", title: "Final Project", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Understand comprehensive tax laws",
      "File tax returns accurately",
      "Implement GST compliance",
      "Create effective tax planning strategies"
    ],
    requirements: [
      "B.Com degree or equivalent",
      "Basic tax knowledge",
      "Interest in taxation profession"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  // ==================== M.SC DATA SCIENCE ====================
  {
    id: "pg_msc_data_science",
    slug: "pg-msc-data-science",
    title: "M.Sc Data Science & Analytics",
    tagline: "Master Data Science, Machine Learning & AI",
    description: "Comprehensive data science program covering Python, machine learning, deep learning, and AI for advanced career opportunities.",
    longDescription: `Launch your career in data science with our advanced M.Sc program. Learn Python, machine learning algorithms, deep learning, and AI techniques that are in high demand across industries.

What you'll learn:
- Python Programming for Data Science
- Statistics & Probability
- Machine Learning Algorithms
- Deep Learning & Neural Networks
- Data Visualization & Big Data`,
    thumbnail: "/assets/courses/pg-msc-data-science.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 599,
    originalPrice: 14999,
    currency: "INR",
    
    category: "M.Sc",
    subcategory: "M.Sc in Data Science",
    vertical: "pg",
    targetAudience: ["bsc-graduates", "engineering-graduates", "working-professionals"],
    tags: ["data-science", "machine-learning", "python", "ai", "analytics", "Post-Graduate (PG)", "M.Sc", "M.Sc in Data Science"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 3600,
    lessonCount: 180,
    moduleCount: 15,
    rating: 4.9,
    reviewCount: 1200,
    enrollmentCount: 8500,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-ds-1",
        title: "Python for Data Science",
        order: 1,
        lessons: [
          { id: "les-ds-1", title: "Python Fundamentals Refresher", type: "video", duration: 40, content: "", isFree: true, order: 1 },
          { id: "les-ds-2", title: "NumPy for Numerical Computing", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-ds-3", title: "Pandas for Data Analysis", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-ds-4", title: "Data Visualization with Matplotlib", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-ds-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ds-2",
        title: "Statistics & Machine Learning",
        order: 2,
        lessons: [
          { id: "les-ds-6", title: "Descriptive & Inferential Statistics", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-ds-7", title: "Supervised Learning Algorithms", type: "video", duration: 60, content: "", isFree: false, order: 2 },
          { id: "les-ds-8", title: "Unsupervised Learning", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-ds-9", title: "Model Evaluation & Tuning", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-ds-10", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ds-3",
        title: "Deep Learning & AI",
        order: 3,
        lessons: [
          { id: "les-ds-11", title: "Neural Networks Fundamentals", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-ds-12", title: "TensorFlow/Keras Deep Learning", type: "video", duration: 60, content: "", isFree: false, order: 2 },
          { id: "les-ds-13", title: "Computer Vision Applications", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-ds-14", title: "NLP & Text Analytics", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-ds-15", title: "Capstone Project", type: "assignment", duration: 180, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[5],
    
    outcomes: [
      "Master Python for data science",
      "Build machine learning models",
      "Develop deep learning applications",
      "Analyze large datasets effectively"
    ],
    requirements: [
      "Bachelor's degree in any science stream",
      "Basic programming knowledge",
      "Mathematics fundamentals"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  // ==================== M.SC CYBER SECURITY ====================
  {
    id: "pg_msc_cyber_security",
    slug: "pg-msc-cyber-security",
    title: "M.Sc Cyber Security & Digital Forensics",
    tagline: "Advanced Security, Ethical Hacking & Forensics",
    description: "Comprehensive cyber security program covering network security, ethical hacking, and digital forensics for IT professionals.",
    longDescription: `Protect digital assets and advance your career in cyber security with our advanced M.Sc program. Learn network security, ethical hacking techniques, and digital forensics that organizations need.

What you'll learn:
- Network Security Fundamentals
- Ethical Hacking & Penetration Testing
- Cyber Threat Intelligence
- Digital Forensics & Investigation
- Security Compliance & Governance`,
    thumbnail: "/assets/courses/pg-msc-cyber-security.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 599,
    originalPrice: 14999,
    currency: "INR",
    
    category: "M.Sc",
    subcategory: "M.Sc in Cyber Security",
    vertical: "pg",
    targetAudience: ["bsc-graduates", "engineering-graduates", "it-professionals"],
    tags: ["cyber-security", "ethical-hacking", "forensics", "network-security", "information-security", "Post-Graduate (PG)", "M.Sc", "M.Sc in Cyber Security"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 3400,
    lessonCount: 170,
    moduleCount: 14,
    rating: 4.8,
    reviewCount: 920,
    enrollmentCount: 6200,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cyber-1",
        title: "Security Fundamentals",
        order: 1,
        lessons: [
          { id: "les-cyber-1", title: "Cyber Security Overview", type: "video", duration: 40, content: "", isFree: true, order: 1 },
          { id: "les-cyber-2", title: "Network Security Essentials", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cyber-3", title: "Operating System Security", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-cyber-4", title: "Cryptography Basics", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cyber-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cyber-2",
        title: "Ethical Hacking",
        order: 2,
        lessons: [
          { id: "les-cyber-6", title: "Penetration Testing Methodologies", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cyber-7", title: "Vulnerability Assessment", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cyber-8", title: "Web Application Security", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cyber-9", title: "Social Engineering Attacks", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-cyber-10", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cyber-3",
        title: "Digital Forensics",
        order: 3,
        lessons: [
          { id: "les-cyber-11", title: "Forensics Fundamentals", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-cyber-12", title: "Evidence Collection & Preservation", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cyber-13", title: "Incident Response", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-cyber-14", title: "Security Compliance (ISO 27001)", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-cyber-15", title: "Capstone Project", type: "assignment", duration: 180, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[0],
    
    outcomes: [
      "Understand cyber security fundamentals",
      "Perform ethical hacking and penetration testing",
      "Conduct digital investigations",
      "Implement security compliance frameworks"
    ],
    requirements: [
      "Bachelor's degree in any stream",
      "Basic IT/networking knowledge",
      "Interest in security domain"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  // ==================== MCA COURSES ====================
  {
    id: "pg_mca_cloud",
    slug: "pg-mca-cloud-computing",
    title: "MCA Cloud Computing & DevOps",
    tagline: "Master Cloud Platforms & DevOps Practices",
    description: "Advanced MCA program covering AWS, Azure, cloud architecture, and DevOps practices for IT professionals.",
    longDescription: `Build expertise in cloud computing with our comprehensive MCA program. Learn AWS, Azure, cloud architecture design, and DevOps practices that modern enterprises need.

What you'll learn:
- Cloud Computing Fundamentals
- AWS & Azure Platforms
- Cloud Architecture Design
- DevOps & CI/CD Pipelines
- Containerization (Docker/Kubernetes)`,
    thumbnail: "/assets/courses/pg-mca-cloud.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 549,
    originalPrice: 12999,
    currency: "INR",
    
    category: "MCA",
    subcategory: "MCA in Cloud Computing",
    vertical: "pg",
    targetAudience: ["bcsc-graduates", "engineering-graduates", "it-professionals"],
    tags: ["mca", "cloud-computing", "aws", "devops", "docker", "Post-Graduate (PG)", "MCA", "MCA in Cloud Computing"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 3200,
    lessonCount: 160,
    moduleCount: 13,
    rating: 4.8,
    reviewCount: 780,
    enrollmentCount: 5500,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-mca-cloud-1",
        title: "Cloud Fundamentals",
        order: 1,
        lessons: [
          { id: "les-mca-cloud-1", title: "Cloud Computing Models", type: "video", duration: 45, content: "", isFree: true, order: 1 },
          { id: "les-mca-cloud-2", title: "Cloud Service Models (IaaS, PaaS, SaaS)", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-mca-cloud-3", title: "AWS Core Services", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-mca-cloud-4", title: "Azure Fundamentals", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-mca-cloud-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-mca-cloud-2",
        title: "Cloud Architecture & DevOps",
        order: 2,
        lessons: [
          { id: "les-mca-cloud-6", title: "Cloud Architecture Design", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-mca-cloud-7", title: "Introduction to DevOps", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-mca-cloud-8", title: "CI/CD Pipelines", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-mca-cloud-9", title: "Docker Containerization", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-mca-cloud-10", title: "Kubernetes Orchestration", type: "video", duration: 50, content: "", isFree: false, order: 5 },
          { id: "les-mca-cloud-11", title: "Capstone Project", type: "assignment", duration: 150, content: "", isFree: false, order: 6 }
        ]
      }
    ],
    
    instructor: instructors[0],
    
    outcomes: [
      "Master cloud platforms (AWS, Azure)",
      "Design cloud architectures",
      "Implement DevOps practices",
      "Deploy containerized applications"
    ],
    requirements: [
      "BCS/BCA/B.Tech degree or equivalent",
      "Basic programming knowledge",
      "Understanding of IT infrastructure"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  // ==================== M.A. COURSES ====================
  {
    id: "pg_ma_economics",
    slug: "pg-ma-economics",
    title: "M.A. Economics & Data Analysis",
    tagline: "Advanced Economics & Econometrics",
    description: "Comprehensive economics program covering microeconomics, macroeconomics, and econometrics for analytical careers.",
    longDescription: `Deepen your understanding of economic theories and develop analytical skills with our M.A. in Economics program. Learn advanced economic concepts and data analysis techniques.

What you'll learn:
- Advanced Microeconomic Theory
- Macroeconomic Policy Analysis
- Econometrics & Statistical Methods
- Financial Economics
- Public Policy Evaluation`,
    thumbnail: "/assets/courses/pg-ma-economics.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 299,
    originalPrice: 6999,
    currency: "INR",
    
    category: "M.A.",
    subcategory: "M.A. in Economics",
    vertical: "pg",
    targetAudience: ["ba-economics-graduates", "commerce-graduates", "research-aspirants"],
    tags: ["economics", "econometrics", "data-analysis", "policy", "research", "Post-Graduate (PG)", "M.A.", "M.A. in Economics"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 2000,
    lessonCount: 100,
    moduleCount: 8,
    rating: 4.7,
    reviewCount: 420,
    enrollmentCount: 2800,
    isActive: true,
    isFeatured: false,
    
    modules: [
      {
        id: "mod-ma-eco-1",
        title: "Advanced Economic Theory",
        order: 1,
        lessons: [
          { id: "les-ma-eco-1", title: "Advanced Microeconomics", type: "video", duration: 50, content: "", isFree: true, order: 1 },
          { id: "les-ma-eco-2", title: "Macroeconomic Frameworks", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-ma-eco-3", title: "International Trade Theory", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-ma-eco-4", title: "Economic Growth Models", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-ma-eco-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ma-eco-2",
        title: "Econometrics & Data Analysis",
        order: 2,
        lessons: [
          { id: "les-ma-eco-6", title: "Statistical Methods for Economics", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-ma-eco-7", title: "Regression Analysis", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-ma-eco-8", title: "Time Series Analysis", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-ma-eco-9", title: "Policy Impact Evaluation", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-ma-eco-10", title: "Research Project", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Analyze complex economic problems",
      "Apply econometric methods",
      "Evaluate policy impacts",
      "Conduct economic research"
    ],
    requirements: [
      "B.A. Economics or related degree",
      "Basic statistics knowledge",
      "Interest in economic research"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  // ==================== LL.M COURSES ====================
  {
    id: "pg_llm_corporate",
    slug: "pg-llm-corporate-law",
    title: "LL.M Corporate Law & Governance",
    tagline: "Master Corporate Law & Business Regulations",
    description: "Advanced law program covering corporate law, mergers & acquisitions, and business governance for legal professionals.",
    longDescription: `Advance your legal career with our comprehensive LL.M in Corporate Law program. Learn corporate governance, M&A regulations, and business laws that shape modern enterprises.

What you'll learn:
- Corporate Law Fundamentals
- Mergers & Acquisitions
- Corporate Governance
- Securities & Capital Markets Law
- Business Restructuring`,
    thumbnail: "/assets/courses/pg-llm-corporate.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 449,
    originalPrice: 9999,
    currency: "INR",
    
    category: "LL.M",
    subcategory: "LL.M in Corporate Law",
    vertical: "pg",
    targetAudience: ["llb-graduates", "law-professionals", "company-secretaries"],
    tags: ["llm", "corporate-law", "mergers", "governance", "legal-compliance", "Post-Graduate (PG)", "LL.M", "LL.M in Corporate Law"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 2400,
    lessonCount: 120,
    moduleCount: 10,
    rating: 4.8,
    reviewCount: 380,
    enrollmentCount: 2500,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-llm-corp-1",
        title: "Corporate Law Framework",
        order: 1,
        lessons: [
          { id: "les-llm-corp-1", title: "Companies Act 2013 - Advanced", type: "video", duration: 50, content: "", isFree: true, order: 1 },
          { id: "les-llm-corp-2", title: "Corporate Governance Principles", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-llm-corp-3", title: "Board Structures & Responsibilities", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-llm-corp-4", title: "Shareholders & Rights", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-llm-corp-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-llm-corp-2",
        title: "M&A and Business Laws",
        order: 2,
        lessons: [
          { id: "les-llm-corp-6", title: "M&A Legal Framework", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-llm-corp-7", title: "Due Diligence Processes", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-llm-corp-8", title: "SEBI Regulations", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-llm-corp-9", title: "Corporate Restructuring", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-llm-corp-10", title: "Case Study Project", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[6],
    
    outcomes: [
      "Understand corporate legal frameworks",
      "Handle M&A transactions",
      "Advise on corporate governance",
      "Navigate SEBI regulations"
    ],
    requirements: [
      "LL.B. degree from recognized university",
      "Basic corporate law knowledge",
      "Interest in corporate legal practice"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "pg_llm_ip",
    slug: "pg-llm-intellectual-property",
    title: "LL.M Intellectual Property Rights",
    tagline: "Master Patents, Trademarks & Copyright Law",
    description: "Specialized law program covering intellectual property rights, patent law, and IP litigation for legal professionals.",
    longDescription: `Specialize in intellectual property law with our advanced LL.M program. Learn patent filing, trademark registration, copyright protection, and IP litigation strategies.

What you'll learn:
- IP Law Fundamentals
- Patent Filing & Prosecution
- Trademark Registration & Protection
- Copyright & Trade Secrets
- IP Litigation & Enforcement`,
    thumbnail: "/assets/courses/pg-llm-ip.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 449,
    originalPrice: 9999,
    currency: "INR",
    
    category: "LL.M",
    subcategory: "LL.M in Intellectual Property Law",
    vertical: "pg",
    targetAudience: ["llb-graduates", "patent-agents", "legal-professionals"],
    tags: ["llm", "intellectual-property", "patents", "trademarks", "copyright", "Post-Graduate (PG)", "LL.M", "LL.M in Intellectual Property Law"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 2200,
    lessonCount: 110,
    moduleCount: 9,
    rating: 4.7,
    reviewCount: 340,
    enrollmentCount: 2200,
    isActive: true,
    isFeatured: false,
    
    modules: [
      {
        id: "mod-llm-ip-1",
        title: "IP Law Foundations",
        order: 1,
        lessons: [
          { id: "les-llm-ip-1", title: "Introduction to Intellectual Property", type: "video", duration: 45, content: "", isFree: true, order: 1 },
          { id: "les-llm-ip-2", title: "Indian IP Regime", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-llm-ip-3", title: "International IP Treaties", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-llm-ip-4", title: "IP Registration Processes", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-llm-ip-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-llm-ip-2",
        title: "Advanced IP Specializations",
        order: 2,
        lessons: [
          { id: "les-llm-ip-6", title: "Patent Law & Filing", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-llm-ip-7", title: "Trademark Practice", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-llm-ip-8", title: "Copyright & Digital IP", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-llm-ip-9", title: "IP Enforcement & Litigation", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-llm-ip-10", title: "Final Project", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[6],
    
    outcomes: [
      "Understand IP legal frameworks",
      "File patents and trademarks",
      "Protect copyrights and trade secrets",
      "Handle IP litigation matters"
    ],
    requirements: [
      "LL.B. degree from recognized university",
      "Basic understanding of law",
      "Interest in IP practice"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  // ==================== COMPETITIVE EXAMS ====================

  {
    id: "upsc-civil-services",
    slug: "upsc-civil-services",
    title: "UPSC Civil Services Foundation",
    tagline: "Your Complete Guide to IAS, IPS, IFS Preparation",
    description: "Comprehensive foundation course for UPSC Civil Services exam covering Prelims, Mains, and Interview preparation.",
    longDescription: `Start your journey to become an IAS, IPS, or IFS officer with this comprehensive UPSC Civil Services Foundation course. Covering the complete syllabus from General Studies to Current Affairs, this course provides everything you need for Prelims and Mains success.

What you'll learn:
- Indian Polity & Governance
- History & Culture of India
- Geography & Environment
- Economic Development
- Science & Technology
- Current Affairs & Ethics`,
    thumbnail: "/assets/courses/upsc-civil-services.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 999,
    originalPrice: 24999,
    currency: "INR",
    
    category: "Government & Entrance Exams",
    subcategory: "UPSC Civil Services",
    vertical: "competitive",
    targetAudience: ["graduates", "working-professionals", "career-changers"],
    tags: ["upsc", "ias", "ips", "ifs", "civil-services", "government-jobs", "Competitive Exams", "Government & Entrance Exams", "UPSC Civil Services"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 5000,
    lessonCount: 250,
    moduleCount: 20,
    rating: 4.9,
    reviewCount: 3500,
    enrollmentCount: 25000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-upsc-1",
        title: "Indian Polity & Governance",
        order: 1,
        lessons: [
          { id: "les-upsc-1", title: "Constitution of India - Overview", type: "video", duration: 60, content: "", isFree: true, order: 1 },
          { id: "les-upsc-2", title: "Preamble & Basic Structure", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-upsc-3", title: "Fundamental Rights & Duties", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-upsc-4", title: "Union & State Government", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-upsc-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-upsc-2",
        title: "Indian History & Culture",
        order: 2,
        lessons: [
          { id: "les-upsc-6", title: "Ancient India - Harappan to Maurya", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-upsc-7", title: "Medieval India - Sultanate & Mughals", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-upsc-8", title: "Modern India - British to Independence", type: "video", duration: 60, content: "", isFree: false, order: 3 },
          { id: "les-upsc-9", title: "Indian Art & Culture", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-upsc-10", title: "Prelims Practice Test", type: "quiz", duration: 60, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[4],
    
    outcomes: [
      "Understand Indian Constitution and governance",
      "Master Indian history and cultural heritage",
      "Develop analytical thinking for exam",
      "Stay updated with current affairs"
    ],
    requirements: [
      "Bachelor's degree in any discipline",
      "Dedication and consistency",
      "Basic awareness of current events"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "ssc-cgl-complete",
    slug: "ssc-cgl-complete",
    title: "SSC CGL Complete Preparation",
    tagline: "Crack SSC CGL Tier I & Tier II with Confidence",
    description: "Complete preparation course for SSC Combined Graduate Level exam covering Quantitative Aptitude, English, and General Awareness.",
    longDescription: `Achieve your dream of a government job with our comprehensive SSC CGL preparation course. Covering all sections - Quantitative Aptitude, English Language, General Intelligence & Reasoning, and General Awareness - this course ensures complete exam readiness.

What you'll master:
- Quantitative Aptitude shortcuts & tricks
- English grammar and comprehension
- Logical reasoning and analytical ability
- Current affairs and general awareness
- Previous year paper solving strategies`,
    thumbnail: "/assets/courses/ssc-cgl-complete.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 599,
    originalPrice: 12999,
    currency: "INR",
    
    category: "Government & Entrance Exams",
    subcategory: "SSC CGL",
    vertical: "competitive",
    targetAudience: ["graduates", "final-year-students", "job-seekers"],
    tags: ["ssc", "cgl", "government-exam", "sarkari-naukri", " Competitive Exams", "Government & Entrance Exams", "SSC CGL"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 4000,
    lessonCount: 200,
    moduleCount: 16,
    rating: 4.8,
    reviewCount: 4200,
    enrollmentCount: 35000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-ssc-1",
        title: "Quantitative Aptitude",
        order: 1,
        lessons: [
          { id: "les-ssc-1", title: "Number System Fundamentals", type: "video", duration: 45, content: "", isFree: true, order: 1 },
          { id: "les-ssc-2", title: "Percentage & Profit/Loss", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-ssc-3", title: "Ratio & Proportion", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-ssc-4", title: "Time & Work", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-ssc-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ssc-2",
        title: "English Language",
        order: 2,
        lessons: [
          { id: "les-ssc-6", title: "Grammar Essentials", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-ssc-7", title: "Vocabulary Building", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-ssc-8", title: "Reading Comprehension", type: "video", duration: 40, content: "", isFree: false, order: 3 },
          { id: "les-ssc-9", title: "Error Spotting", type: "video", duration: 35, content: "", isFree: false, order: 4 },
          { id: "les-ssc-10", title: "Practice Paper", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Master quantitative aptitude concepts",
      "Improve English language skills",
      "Develop reasoning abilities",
      "Score high in all sections"
    ],
    requirements: [
      "Graduate in any discipline",
      "Basic math and English knowledge",
      "Consistent practice commitment"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "banking-ibps-po",
    slug: "banking-ibps-po",
    title: "Banking & IBPS PO Complete Course",
    tagline: "Crack IBPS PO, SBI PO & Other Bank Exams",
    description: "Complete preparation for banking exams covering IBPS PO, SBI PO, Clerk, and RBI exams with focus on all sections.",
    longDescription: `Launch your banking career with our comprehensive IBPS PO and banking exams preparation course. Covering Reasoning, Quantitative Aptitude, English, and General Awareness, this course provides everything you need to crack these competitive exams.

Course highlights:
- Financial Awareness preparation
- Computer Knowledge basics
- Interview preparation included
- Mock tests and practice papers
- Current affairs updates`,
    thumbnail: "/assets/courses/banking-ibps-po.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 799,
    originalPrice: 15999,
    currency: "INR",
    
    category: "Government & Entrance Exams",
    subcategory: "Banking",
    vertical: "competitive",
    targetAudience: ["graduates", "job-seekers", "working-professionals"],
    tags: ["banking", "ibps", "sbi", "po", "clerk", "government-jobs", "Competitive Exams", "Government & Entrance Exams", "Banking"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 3500,
    lessonCount: 175,
    moduleCount: 14,
    rating: 4.8,
    reviewCount: 3800,
    enrollmentCount: 30000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-bank-1",
        title: "Reasoning Ability",
        order: 1,
        lessons: [
          { id: "les-bank-1", title: "Logical Reasoning Basics", type: "video", duration: 45, content: "", isFree: true, order: 1 },
          { id: "les-bank-2", title: "Seating Arrangement", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-bank-3", title: "Puzzles & Syllogisms", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-bank-4", title: "Blood Relations", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-bank-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-bank-2",
        title: "Financial Awareness",
        order: 2,
        lessons: [
          { id: "les-bank-6", title: "Indian Banking System", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-bank-7", title: "RBI & Monetary Policy", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-bank-8", title: "Current Affairs - BFSI", type: "video", duration: 40, content: "", isFree: false, order: 3 },
          { id: "les-bank-9", title: "Banking Terminology", type: "video", duration: 35, content: "", isFree: false, order: 4 },
          { id: "les-bank-10", title: "Mock Test", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Master all exam sections",
      "Understand banking concepts",
      "Build speed and accuracy",
      "ClearPrelims and Mains"
    ],
    requirements: [
      "Graduate in any discipline",
      "Basic numerical ability",
      "Willingness to learn banking sector"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "railways-rrb-alp",
    slug: "railways-rrb-alp",
    title: "Railways RRB ALP & Technician",
    tagline: "Complete Preparation for Railway Recruitment",
    description: "Comprehensive course for RRB ALP, Technician, and Group D exams covering technical and non-technical sections.",
    longDescription: `Join Indian Railways with our complete RRB ALP and Technician preparation course. Covering Mathematics, General Science, General Awareness, and Technical subjects, this course prepares you for all stages of the recruitment process.

What you'll learn:
- Mathematics shortcuts and formulas
- General Science concepts
- Current affairs for railway exams
- Technical subjects for ALP
- Computer fundamentals`,
    thumbnail: "/assets/courses/railways-rrb-alp.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 449,
    originalPrice: 9999,
    currency: "INR",
    
    category: "Government & Entrance Exams",
    subcategory: "Railways",
    vertical: "competitive",
    targetAudience: ["10th-pass", "12th-pass", "diploma-holders"],
    tags: ["railways", "rrb", "alp", "technician", "sarkari-naukri", "Competitive Exams", "Government & Entrance Exams", "Railways"],
    
    difficulty: "beginner",
    language: "Hindi",
    totalDuration: 2500,
    lessonCount: 125,
    moduleCount: 10,
    rating: 4.7,
    reviewCount: 2800,
    enrollmentCount: 45000,
    isActive: true,
    isFeatured: false,
    
    modules: [
      {
        id: "mod-rrb-1",
        title: "Mathematics",
        order: 1,
        lessons: [
          { id: "les-rrb-1", title: "Number System", type: "video", duration: 40, content: "", isFree: true, order: 1 },
          { id: "les-rrb-2", title: "Simplification Tricks", type: "video", duration: 35, content: "", isFree: false, order: 2 },
          { id: "les-rrb-3", title: "Algebra Basics", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-rrb-4", title: "Geometry Fundamentals", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-rrb-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-rrb-2",
        title: "General Science",
        order: 2,
        lessons: [
          { id: "les-rrb-6", title: "Physics Fundamentals", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-rrb-7", title: "Chemistry Basics", type: "video", duration: 40, content: "", isFree: false, order: 2 },
          { id: "les-rrb-8", title: "Biology Essentials", type: "video", duration: 35, content: "", isFree: false, order: 3 },
          { id: "les-rrb-9", title: "Environmental Science", type: "video", duration: 30, content: "", isFree: false, order: 4 },
          { id: "les-rrb-10", title: "Practice Test", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[0],
    
    outcomes: [
      "Master mathematics for railway exams",
      "Understand general science concepts",
      "Clear all exam stages",
      "Secure railway job"
    ],
    requirements: [
      "10th/12th pass or equivalent",
      "Basic math and science knowledge",
      "Dedication for exam preparation"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "cat-mba-prep",
    slug: "cat-mba-prep",
    title: "CAT & MBA Entrance Preparation",
    tagline: "Crack CAT, XAT, CMAT, MAT with Expert Guidance",
    description: "Complete preparation course for CAT and other MBA entrance exams covering Quantitative Ability, Verbal Ability, Data Interpretation, and Logical Reasoning.",
    longDescription: `Get into top IIMs and MBA colleges with our comprehensive CAT and MBA entrance preparation course. Covering all sections - QA, VA, DI, and LR - this course provides strategies, shortcuts, and extensive practice.

What you'll master:
- Quantitative Ability shortcuts
- Verbal Ability and Reading Comprehension
- Data Interpretation techniques
- Logical Reasoning puzzles
- Mock tests and performance analysis`,
    thumbnail: "/assets/courses/cat-mba-prep.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 899,
    originalPrice: 19999,
    currency: "INR",
    
    category: "Government & Entrance Exams",
    subcategory: "CAT/CMAT/MAT",
    vertical: "competitive",
    targetAudience: ["graduates", "working-professionals", "mba-aspirants"],
    tags: ["cat", "xat", "cmat", "mat", "iim", "mba-entrance", "Competitive Exams", "Government & Entrance Exams", "CAT/CMAT/MAT"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 4500,
    lessonCount: 225,
    moduleCount: 18,
    rating: 4.9,
    reviewCount: 2200,
    enrollmentCount: 18000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cat-1",
        title: "Quantitative Ability",
        order: 1,
        lessons: [
          { id: "les-cat-1", title: "Number System Advanced", type: "video", duration: 55, content: "", isFree: true, order: 1 },
          { id: "les-cat-2", title: "Arithmetic Mastery", type: "video", duration: 60, content: "", isFree: false, order: 2 },
          { id: "les-cat-3", title: "Algebra Crash Course", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cat-4", title: "Geometry & Mensuration", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cat-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cat-2",
        title: "Verbal Ability & Reading Comprehension",
        order: 2,
        lessons: [
          { id: "les-cat-6", title: "RC Strategies", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cat-7", title: "Grammar Refresher", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-cat-8", title: "Para Jumbles & Summary", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cat-9", title: "Vocabulary Building", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-cat-10", title: "Full Length Mock", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[2],
    
    outcomes: [
      "Score 95+ percentile in CAT",
      "Master all exam sections",
      "Develop test-taking strategies",
      "Get into top MBA colleges"
    ],
    requirements: [
      "Graduate or final year student",
      "Basic quantitative ability",
      "Willingness to practice extensively"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  // ==================== PROFESSIONAL CERTIFICATIONS ====================

  {
    id: "course-ca-foundation",
    slug: "ca-foundation",
    title: "CA Foundation Course",
    tagline: "Your Gateway to Chartered Accountancy",
    description: "Complete preparation for CA Foundation exam covering all four papers - Accounting, Business Laws, Mathematics, and General Economics.",
    longDescription: `Start your journey to become a Chartered Accountant with our comprehensive CA Foundation course. This course covers all four papers required for the ICAI CA Foundation exam.

What you'll learn:
- Principles and Practice of Accounting
- Business Laws & Business Correspondence
- Business Mathematics & Statistics
- General Economics & Business Environment`,
    thumbnail: "/assets/courses/ca-foundation.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 499,
    originalPrice: 9999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "CA",
    vertical: "professional",
    targetAudience: ["12th-pass-students", "ca-aspirants", "commerce-students"],
    tags: ["ca", "chartered-accountant", "icai", "foundation", "accounting", "Professional / Career Skills", "Professional Certifications", "CA"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 3500,
    lessonCount: 180,
    moduleCount: 14,
    rating: 4.9,
    reviewCount: 4500,
    enrollmentCount: 35000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-ca-f1",
        title: "Principles of Accounting",
        order: 1,
        lessons: [
          { id: "les-ca-f1-1", title: "Accounting Standards Overview", type: "video", duration: 45, content: "", isFree: true, order: 1 },
          { id: "les-ca-f1-2", title: "Bank Reconciliation Statement", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-ca-f1-3", title: "Depreciation Accounting", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-ca-f1-4", title: "Inventory Valuation", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-ca-f1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ca-f2",
        title: "Business Laws",
        order: 2,
        lessons: [
          { id: "les-ca-f2-1", title: "Indian Contract Act Overview", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-ca-f2-2", title: "Sale of Goods Act", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-ca-f2-3", title: "Partnership Laws", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-ca-f2-4", title: "Company Law Basics", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-ca-f2-5", title: "Business Correspondence", type: "video", duration: 40, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ca-f3",
        title: "Business Mathematics",
        order: 3,
        lessons: [
          { id: "les-ca-f3-1", title: "Ratio & Proportion", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-ca-f3-2", title: "Time Value of Money", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-ca-f3-3", title: "Permutations & Combinations", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-ca-f3-4", title: "Statistical Analysis", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-ca-f3-5", title: "Probability Basics", type: "video", duration: 45, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ca-f4",
        title: "General Economics",
        order: 4,
        lessons: [
          { id: "les-ca-f4-1", title: "Indian Economy Overview", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-ca-f4-2", title: "Economic Reforms", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-ca-f4-3", title: "Money & Banking", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-ca-f4-4", title: "Fiscal Policy", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-ca-f4-5", title: "Practice Papers", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear CA Foundation in first attempt",
      "Master all four papers",
      "Understand accounting principles",
      "Develop analytical skills"
    ],
    requirements: [
      "12th pass from recognized board",
      "Basic mathematics knowledge",
      "Dedication for regular study"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "course-ca-intermediate",
    slug: "ca-intermediate",
    title: "CA Intermediate Course",
    tagline: "Advanced Level Chartered Accountancy",
    description: "Comprehensive CA Intermediate preparation covering Advanced Accounting, Taxation, Costing, and Auditing as per ICAI syllabus.",
    longDescription: `Progress to the second level of Chartered Accountancy with our detailed CA Intermediate course. Covering advanced topics in accounting, taxation, cost management, and auditing.

What you'll master:
- Advanced Accounting Standards
- Corporate Tax Planning
- Cost Management Techniques
- Auditing Standards & Practices`,
    thumbnail: "/assets/courses/ca-intermediate.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 799,
    originalPrice: 15999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "CA",
    vertical: "professional",
    targetAudience: ["ca-foundation-passed", "ca-aspirants", "commerce-graduates"],
    tags: ["ca", "chartered-accountant", "icai", "intermediate", "accounting", "tax", "audit", "Professional / Career Skills", "Professional Certifications", "CA"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 4500,
    lessonCount: 225,
    moduleCount: 18,
    rating: 4.8,
    reviewCount: 3200,
    enrollmentCount: 25000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-ca-i1",
        title: "Advanced Accounting",
        order: 1,
        lessons: [
          { id: "les-ca-i1-1", title: "AS 12, 14, 16 Complex Cases", type: "video", duration: 60, content: "", isFree: true, order: 1 },
          { id: "les-ca-i1-2", title: "Company Accounts - Advanced", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-ca-i1-3", title: "Accounting for Branches", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-ca-i1-4", title: "Amalgamation & Reconstruction", type: "video", duration: 60, content: "", isFree: false, order: 4 },
          { id: "les-ca-i1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ca-i2",
        title: "Corporate Tax",
        order: 2,
        lessons: [
          { id: "les-ca-i2-1", title: "Income Tax Provisions", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-ca-i2-2", title: "Tax Planning Strategies", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-ca-i2-3", title: "International Taxation", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-ca-i2-4", title: "Deduction Planning", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-ca-i2-5", title: "Tax Return Filing", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ca-i3",
        title: "Cost Management",
        order: 3,
        lessons: [
          { id: "les-ca-i3-1", title: "Cost Accounting Standards", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-ca-i3-2", title: "Activity Based Costing", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-ca-i3-3", title: "Budgetary Control", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-ca-i3-4", title: "Standard Costing", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-ca-i3-5", title: "Cost Audit", type: "video", duration: 45, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ca-i4",
        title: "Auditing",
        order: 4,
        lessons: [
          { id: "les-ca-i4-1", title: "Auditing Standards", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-ca-i4-2", title: "Audit Procedures", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-ca-i4-3", title: "Internal Audit", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-ca-i4-4", title: "Audit Reports", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-ca-i4-5", title: "Case Study", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear CA Intermediate successfully",
      "Master advanced accounting",
      "Understand tax planning",
      "Develop audit expertise"
    ],
    requirements: [
      "CA Foundation cleared",
      "Strong accounting basics",
      "Regular study commitment"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "course-ca-final",
    slug: "ca-final",
    title: "CA Final Course",
    tagline: "Complete Preparation for CA Final",
    description: "Expert-level CA Final preparation covering Advanced Management Accounting, Financial Reporting, Direct Tax, Indirect Tax, and Strategic Management.",
    longDescription: `Achieve the highest level of Chartered Accountancy with our comprehensive CA Final course. Covering advanced topics required for the final level examination.

What you'll master:
- Advanced Financial Reporting
- Strategic Financial Management
- Direct & Indirect Tax Management
- Advanced Auditing & Professional Ethics`,
    thumbnail: "/assets/courses/ca-final.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 999,
    originalPrice: 24999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "CA",
    vertical: "professional",
    targetAudience: ["ca-intermediate-passed", "ca-final-aspirants", "ca-professionals"],
    tags: ["ca", "chartered-accountant", "icai", "final", "financial-reporting", "tax-management", "Professional / Career Skills", "Professional Certifications", "CA"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 5500,
    lessonCount: 275,
    moduleCount: 22,
    rating: 4.9,
    reviewCount: 2800,
    enrollmentCount: 18000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-ca-final1",
        title: "Financial Reporting",
        order: 1,
        lessons: [
          { id: "les-ca-final1-1", title: "Ind AS Implementation", type: "video", duration: 60, content: "", isFree: true, order: 1 },
          { id: "les-ca-final1-2", title: "Group Accounting Complex", type: "video", duration: 65, content: "", isFree: false, order: 2 },
          { id: "les-ca-final1-3", title: "Financial Instruments", type: "video", duration: 60, content: "", isFree: false, order: 3 },
          { id: "les-ca-final1-4", title: "Business Combinations", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-ca-final1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ca-final2",
        title: "Strategic Financial Management",
        order: 2,
        lessons: [
          { id: "les-ca-final2-1", title: "Capital Budgeting", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-ca-final2-2", title: "Working Capital Management", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-ca-final2-3", title: "Merger & Acquisition", type: "video", duration: 60, content: "", isFree: false, order: 3 },
          { id: "les-ca-final2-4", title: "Valuation Methods", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-ca-final2-5", title: "Project Finance", type: "video", duration: 50, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ca-final3",
        title: "Direct Tax",
        order: 3,
        lessons: [
          { id: "les-ca-final3-1", title: "Advanced Tax Planning", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-ca-final3-2", title: "International Tax Planning", type: "video", duration: 60, content: "", isFree: false, order: 2 },
          { id: "les-ca-final3-3", title: "Transfer Pricing", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-ca-final3-4", title: "Tax Avoidance vs Evasion", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-ca-final3-5", title: "Case Studies", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ca-final4",
        title: "Indirect Tax",
        order: 4,
        lessons: [
          { id: "les-ca-final4-1", title: "GST Comprehensive", type: "video", duration: 60, content: "", isFree: false, order: 1 },
          { id: "les-ca-final4-2", title: "Customs Duty", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-ca-final4-3", title: "Input Tax Credit", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-ca-final4-4", title: "GST Returns & Audit", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-ca-final4-5", title: "Practice Papers", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Become a Chartered Accountant",
      "Master financial reporting",
      "Expert in tax planning",
      "Strategic management skills"
    ],
    requirements: [
      "CA Intermediate cleared",
      "Strong analytical skills",
      "Full dedication required"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "cs_foundation",
    slug: "cs-foundation",
    title: "CS Foundation Course",
    tagline: "Company Secretary Foundation Program",
    description: "Complete CS Foundation preparation covering Company Law, Company Secretaryship, Financial Accounting, and Business Management.",
    longDescription: `Begin your journey as a Company Secretary with our comprehensive CS Foundation course. This program covers the fundamentals required for the ICSI Foundation examination.

What you'll learn:
- Company Law Fundamentals
- Company Secretaryship Role
- Financial Accounting Basics
- Business Management Principles`,
    thumbnail: "/assets/courses/cs-foundation.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 349,
    originalPrice: 7999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "Company Secretary",
    vertical: "professional",
    targetAudience: ["12th-pass-students", "cs-aspirants", "commerce-students"],
    tags: ["cs", "company-secretary", "icsi", "foundation", "corporate-law", "Professional / Career Skills", "Professional Certifications", "Company Secretary"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 2500,
    lessonCount: 125,
    moduleCount: 10,
    rating: 4.7,
    reviewCount: 1800,
    enrollmentCount: 12000,
    isActive: true,
    isFeatured: false,
    
    modules: [
      {
        id: "mod-cs-f1",
        title: "Company Law",
        order: 1,
        lessons: [
          { id: "les-cs-f1-1", title: "Companies Act 2013 Overview", type: "video", duration: 45, content: "", isFree: true, order: 1 },
          { id: "les-cs-f1-2", title: "Types of Companies", type: "video", duration: 40, content: "", isFree: false, order: 2 },
          { id: "les-cs-f1-3", title: "Company Formation", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cs-f1-4", title: "Board of Directors", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-cs-f1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cs-f2",
        title: "Company Secretaryship",
        order: 2,
        lessons: [
          { id: "les-cs-f2-1", title: "Role of Company Secretary", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-cs-f2-2", title: "Meetings & Resolutions", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cs-f2-3", title: "Statutory Registers", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-cs-f2-4", title: "Annual Returns", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-cs-f2-5", title: "Practice Exercise", type: "assignment", duration: 45, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cs-f3",
        title: "Financial Accounting",
        order: 3,
        lessons: [
          { id: "les-cs-f3-1", title: "Accounting Fundamentals", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-cs-f3-2", title: "Journal & Ledger", type: "video", duration: 40, content: "", isFree: false, order: 2 },
          { id: "les-cs-f3-3", title: "Trial Balance", type: "video", duration: 35, content: "", isFree: false, order: 3 },
          { id: "les-cs-f3-4", title: "Final Accounts", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cs-f3-5", title: "Accounting Standards", type: "video", duration: 40, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cs-f4",
        title: "Business Management",
        order: 4,
        lessons: [
          { id: "les-cs-f4-1", title: "Management Principles", type: "video", duration: 40, content: "", isFree: false, order: 1 },
          { id: "les-cs-f4-2", title: "Organizational Behavior", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-cs-f4-3", title: "Business Communication", type: "video", duration: 40, content: "", isFree: false, order: 3 },
          { id: "les-cs-f4-4", title: "Corporate Governance", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-cs-f4-5", title: "Full Mock Test", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[6],
    
    outcomes: [
      "Clear CS Foundation exam",
      "Understand company law",
      "Master corporate procedures",
      "Build career foundation"
    ],
    requirements: [
      "12th pass from recognized board",
      "Basic business awareness",
      "Dedication to studies"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "cs_executive",
    slug: "cs-executive",
    title: "CS Executive Course",
    tagline: "Intermediate Level Company Secretary",
    description: "Advanced CS Executive preparation covering Company Law, Corporate Secretarial Practice, Financial Management, and Tax Laws.",
    longDescription: `Progress to the executive level of Company Secretary with our detailed CS Executive course. Covering advanced topics in corporate law, secretarial practice, and financial management.

What you'll master:
- Corporate Secretarial Practice
- Company Law Advanced
- Financial Management
- Tax Compliance`,
    thumbnail: "/assets/courses/cs-executive.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 549,
    originalPrice: 12999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "Company Secretary",
    vertical: "professional",
    targetAudience: ["cs-foundation-passed", "cs-executive-aspirants", "legal-professionals"],
    tags: ["cs", "company-secretary", "icsi", "executive", "corporate-law", "secretarial-practice", "Professional / Career Skills", "Professional Certifications", "Company Secretary"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 3500,
    lessonCount: 175,
    moduleCount: 14,
    rating: 4.8,
    reviewCount: 1500,
    enrollmentCount: 10000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cs-e1",
        title: "Corporate Secretarial Practice",
        order: 1,
        lessons: [
          { id: "les-cs-e1-1", title: "Secretarial Audit", type: "video", duration: 50, content: "", isFree: true, order: 1 },
          { id: "les-cs-e1-2", title: "Due Diligence", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cs-e1-3", title: "Corporate Governance", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cs-e1-4", title: "Compliance Management", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-cs-e1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cs-e2",
        title: "Company Law Advanced",
        order: 2,
        lessons: [
          { id: "les-cs-e2-1", title: "Share Capital & Debentures", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cs-e2-2", title: "Dividend & Distribution", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cs-e2-3", title: "Oppression & Mismanagement", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cs-e2-4", title: "Winding Up", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cs-e2-5", title: "Case Studies", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cs-e3",
        title: "Financial Management",
        order: 3,
        lessons: [
          { id: "les-cs-e3-1", title: "Capital Structure", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cs-e3-2", title: "Working Capital", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-cs-e3-3", title: "Cash Flow Analysis", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cs-e3-4", title: "Financial Statement Analysis", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-cs-e3-5", title: "Investment Decisions", type: "video", duration: 50, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cs-e4",
        title: "Tax Laws",
        order: 4,
        lessons: [
          { id: "les-cs-e4-1", title: "Income Tax Overview", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cs-e4-2", title: "Corporate Tax Planning", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cs-e4-3", title: "GST Compliance", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cs-e4-4", title: "Tax Returns", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-cs-e4-5", title: "Practice Papers", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[6],
    
    outcomes: [
      "Clear CS Executive exam",
      "Expert in secretarial practice",
      "Corporate law proficiency",
      "Financial management skills"
    ],
    requirements: [
      "CS Foundation cleared",
      "Strong legal aptitude",
      "Regular study required"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "cs_professional",
    slug: "cs-professional",
    title: "CS Professional Course",
    tagline: "Advanced Level Company Secretary",
    description: "Expert-level CS Professional preparation covering Corporate Governance, Secretarial Audit, Due Diligence, and Corporate Restructuring.",
    longDescription: `Achieve the highest level as a Company Secretary with our comprehensive CS Professional course. Covering advanced topics required for the professional level examination.

What you'll master:
- Corporate Governance & Ethics
- Secretarial Audit & Due Diligence
- Corporate Restructuring
- Insolvency & Bankruptcy`,
    thumbnail: "/assets/courses/cs-professional.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 799,
    originalPrice: 17999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "Company Secretary",
    vertical: "professional",
    targetAudience: ["cs-executive-passed", "cs-professional-aspirants", "cs-practitioners"],
    tags: ["cs", "company-secretary", "icsi", "professional", "corporate-governance", "secretarial-audit", "Professional / Career Skills", "Professional Certifications", "Company Secretary"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 4000,
    lessonCount: 200,
    moduleCount: 16,
    rating: 4.8,
    reviewCount: 1200,
    enrollmentCount: 8000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cs-p1",
        title: "Corporate Governance",
        order: 1,
        lessons: [
          { id: "les-cs-p1-1", title: "Governance Frameworks", type: "video", duration: 55, content: "", isFree: true, order: 1 },
          { id: "les-cs-p1-2", title: "Board Composition", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cs-p1-3", title: "Audit Committee", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cs-p1-4", title: "SEBI Regulations", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cs-p1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cs-p2",
        title: "Secretarial Audit",
        order: 2,
        lessons: [
          { id: "les-cs-p2-1", title: "Audit Methodology", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cs-p2-2", title: "Compliance Audit", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cs-p2-3", title: "Reporting Standards", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-cs-p2-4", title: "Best Practices", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cs-p2-5", title: "Case Study", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cs-p3",
        title: "Due Diligence",
        order: 3,
        lessons: [
          { id: "les-cs-p3-1", title: "Due Diligence Process", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cs-p3-2", title: "Legal Due Diligence", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cs-p3-3", title: "Financial Due Diligence", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cs-p3-4", title: "Regulatory Due Diligence", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cs-p3-5", title: "Documentation", type: "video", duration: 45, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cs-p4",
        title: "Corporate Restructuring",
        order: 4,
        lessons: [
          { id: "les-cs-p4-1", title: "Merger & Acquisition", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cs-p4-2", title: "Amalgamation Process", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cs-p4-3", title: "Insolvency Framework", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cs-p4-4", title: "Bankruptcy Code", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cs-p4-5", title: "Mock Exam", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[6],
    
    outcomes: [
      "Become a qualified CS",
      "Expert in corporate governance",
      "Master secretarial audit",
      "Corporate restructuring skills"
    ],
    requirements: [
      "CS Executive cleared",
      "Extensive knowledge required",
      "Professional commitment"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "cma_foundation",
    slug: "cma-foundation",
    title: "CMA Foundation Course",
    tagline: "Cost Management Accounting Foundation",
    description: "Complete CMA Foundation preparation covering Fundamentals of Financial Accounting, Cost Accounting, Laws, and Statistics.",
    longDescription: `Begin your journey in Cost and Management Accounting with our comprehensive CMA Foundation course. This program covers the fundamentals required for the ICWAI CMA Foundation examination.

What you'll learn:
- Fundamentals of Financial Accounting
- Cost Accounting Basics
- Mercantile Law
- Statistics & Mathematics`,
    thumbnail: "/assets/courses/cma-foundation.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 349,
    originalPrice: 7999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "CMA",
    vertical: "professional",
    targetAudience: ["12th-pass-students", "cma-aspirants", "commerce-students"],
    tags: ["cma", "cost-management", "accounting", "icwai", "foundation", "Professional / Career Skills", "Professional Certifications", "CMA"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 2500,
    lessonCount: 125,
    moduleCount: 10,
    rating: 4.7,
    reviewCount: 1600,
    enrollmentCount: 11000,
    isActive: true,
    isFeatured: false,
    
    modules: [
      {
        id: "mod-cma-f1",
        title: "Fundamentals of Financial Accounting",
        order: 1,
        lessons: [
          { id: "les-cma-f1-1", title: "Accounting Basics", type: "video", duration: 45, content: "", isFree: true, order: 1 },
          { id: "les-cma-f1-2", title: "Journal Entries", type: "video", duration: 40, content: "", isFree: false, order: 2 },
          { id: "les-cma-f1-3", title: "Ledger & Trial Balance", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-cma-f1-4", title: "Final Accounts", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cma-f1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cma-f2",
        title: "Cost Accounting",
        order: 2,
        lessons: [
          { id: "les-cma-f2-1", title: "Cost Concepts", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-cma-f2-2", title: "Materials Costing", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cma-f2-3", title: "Labor Costing", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-cma-f2-4", title: "Overhead Allocation", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cma-f2-5", title: "Cost Sheet", type: "assignment", duration: 45, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cma-f3",
        title: "Mercantile Law",
        order: 3,
        lessons: [
          { id: "les-cma-f3-1", title: "Indian Contract Act", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-cma-f3-2", title: "Sale of Goods Act", type: "video", duration: 40, content: "", isFree: false, order: 2 },
          { id: "les-cma-f3-3", title: "Partnership Act", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-cma-f3-4", title: "Companies Act Basics", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-cma-f3-5", title: "Practice Questions", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cma-f4",
        title: "Statistics & Mathematics",
        order: 4,
        lessons: [
          { id: "les-cma-f4-1", title: "Statistical Methods", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-cma-f4-2", title: "Probability Basics", type: "video", duration: 40, content: "", isFree: false, order: 2 },
          { id: "les-cma-f4-3", title: "Correlation & Regression", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cma-f4-4", title: "Time Series Analysis", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-cma-f4-5", title: "Full Mock Test", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear CMA Foundation",
      "Master accounting fundamentals",
      "Understand cost concepts",
      "Statistical analysis skills"
    ],
    requirements: [
      "12th pass from recognized board",
      "Basic mathematics knowledge",
      "Regular study commitment"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "cma_intermediate",
    slug: "cma-intermediate",
    title: "CMA Intermediate Course",
    tagline: "Intermediate Cost Management Accounting",
    description: "Advanced CMA Intermediate preparation covering Financial Accounting, Cost Accounting, Laws, and Direct & Indirect Taxation.",
    longDescription: `Progress to the intermediate level of Cost and Management Accounting with our detailed CMA Intermediate course. Covering advanced topics in financial management and taxation.

What you'll master:
- Advanced Financial Accounting
- Cost Management Techniques
- Tax Laws & Returns
- Financial Management`,
    thumbnail: "/assets/courses/cma-intermediate.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 549,
    originalPrice: 12999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "CMA",
    vertical: "professional",
    targetAudience: ["cma-foundation-passed", "cma-intermediate-aspirants", "accountants"],
    tags: ["cma", "cost-management", "accounting", "icwai", "intermediate", "taxation", "financial-management", "Professional / Career Skills", "Professional Certifications", "CMA"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 3500,
    lessonCount: 175,
    moduleCount: 14,
    rating: 4.8,
    reviewCount: 1400,
    enrollmentCount: 9000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cma-i1",
        title: "Financial Accounting",
        order: 1,
        lessons: [
          { id: "les-cma-i1-1", title: "Advanced Accounting Standards", type: "video", duration: 50, content: "", isFree: true, order: 1 },
          { id: "les-cma-i1-2", title: "Company Accounts", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cma-i1-3", title: "Accounting for Special Transactions", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cma-i1-4", title: "Financial Statement Analysis", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-cma-i1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cma-i2",
        title: "Cost Accounting",
        order: 2,
        lessons: [
          { id: "les-cma-i2-1", title: "Job & Batch Costing", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cma-i2-2", title: "Process Costing", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cma-i2-3", title: "Operation Costing", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cma-i2-4", title: "Standard Costing", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-cma-i2-5", title: "Cost Audit", type: "video", duration: 45, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cma-i3",
        title: "Direct Tax",
        order: 3,
        lessons: [
          { id: "les-cma-i3-1", title: "Income Tax Computation", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cma-i3-2", title: "Tax Planning", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cma-i3-3", title: "Deductions & Exemptions", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cma-i3-4", title: "TDS & TCS", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-cma-i3-5", title: "Tax Returns", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cma-i4",
        title: "Indirect Tax",
        order: 4,
        lessons: [
          { id: "les-cma-i4-1", title: "GST Comprehensive", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cma-i4-2", title: "Input Tax Credit", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cma-i4-3", title: "GST Returns", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-cma-i4-4", title: "Customs Duty", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cma-i4-5", title: "Practice Papers", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear CMA Intermediate",
      "Advanced accounting skills",
      "Cost management expertise",
      "Taxation knowledge"
    ],
    requirements: [
      "CMA Foundation cleared",
      "Strong accounting background",
      "Regular study required"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "cma_final",
    slug: "cma-final",
    title: "CMA Final Course",
    tagline: "Advanced Cost Management Accounting",
    description: "Expert-level CMA Final preparation covering Strategic Financial Management, Corporate Finance, and Strategic Cost Management.",
    longDescription: `Achieve the highest level in Cost and Management Accounting with our comprehensive CMA Final course. Covering strategic financial management and advanced costing techniques.

What you'll master:
- Strategic Financial Management
- Corporate Restructuring
- Strategic Cost Management
- Financial Analysis & Decisions`,
    thumbnail: "/assets/courses/cma-final.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 799,
    originalPrice: 19999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "CMA",
    vertical: "professional",
    targetAudience: ["cma-intermediate-passed", "cma-final-aspirants", "finance-managers"],
    tags: ["cma", "cost-management", "accounting", "icwai", "final", "financial-management", "strategic-costing", "Professional / Career Skills", "Professional Certifications", "CMA"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 4500,
    lessonCount: 225,
    moduleCount: 18,
    rating: 4.9,
    reviewCount: 1100,
    enrollmentCount: 7000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cma-final1",
        title: "Strategic Financial Management",
        order: 1,
        lessons: [
          { id: "les-cma-final1-1", title: "Financial Strategy", type: "video", duration: 55, content: "", isFree: true, order: 1 },
          { id: "les-cma-final1-2", title: "Capital Budgeting Advanced", type: "video", duration: 60, content: "", isFree: false, order: 2 },
          { id: "les-cma-final1-3", title: "Working Capital Strategy", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cma-final1-4", title: "Dividend Policy", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cma-final1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cma-final2",
        title: "Corporate Finance",
        order: 2,
        lessons: [
          { id: "les-cma-final2-1", title: "Corporate Valuation", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cma-final2-2", title: "Mergers & Acquisitions", type: "video", duration: 60, content: "", isFree: false, order: 2 },
          { id: "les-cma-final2-3", title: "Corporate Restructuring", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cma-final2-4", title: "Project Finance", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cma-final2-5", title: "Case Studies", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cma-final3",
        title: "Strategic Cost Management",
        order: 3,
        lessons: [
          { id: "les-cma-final3-1", title: "ABC Costing", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cma-final3-2", title: "Target Costing", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cma-final3-3", title: "Life Cycle Costing", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cma-final3-4", title: "Kaizen Costing", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cma-final3-5", title: "Cost Optimization", type: "video", duration: 55, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cma-final4",
        title: "Financial Analysis",
        order: 4,
        lessons: [
          { id: "les-cma-final4-1", title: "Advanced Ratio Analysis", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cma-final4-2", title: "Cash Flow Analysis", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cma-final4-3", title: "Risk Analysis", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cma-final4-4", title: "Decision Making", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-cma-final4-5", title: "Final Mock Test", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Become a qualified CMA",
      "Strategic financial skills",
      "Corporate finance expertise",
      "Cost management mastery"
    ],
    requirements: [
      "CMA Intermediate cleared",
      "Advanced knowledge required",
      "Professional dedication"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "cfa_level1",
    slug: "cfa-level1",
    title: "CFA Level 1 Course",
    tagline: "Chartered Financial Analyst Level 1",
    description: "Comprehensive CFA Level 1 preparation covering Financial Analysis, Ethics, Quantitative Methods, and Portfolio Management.",
    longDescription: `Start your journey to become a Chartered Financial Analyst with our detailed CFA Level 1 course. Covering the fundamental knowledge required for the CFA exam.

What you'll master:
- Ethical & Professional Standards
- Quantitative Methods
- Financial Statement Analysis
- Economics & Portfolio Management`,
    thumbnail: "/assets/courses/cfa-level1.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 899,
    originalPrice: 24999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "CFA",
    vertical: "professional",
    targetAudience: ["graduates", "cfa-aspirants", "finance-professionals"],
    tags: ["cfa", "chartered-financial-analyst", "cfa-institute", "level1", "financial-analysis", "portfolio-management", "Professional / Career Skills", "Professional Certifications", "CFA"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 4000,
    lessonCount: 200,
    moduleCount: 16,
    rating: 4.9,
    reviewCount: 3500,
    enrollmentCount: 25000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cfa1-1",
        title: "Ethical & Professional Standards",
        order: 1,
        lessons: [
          { id: "les-cfa1-1-1", title: "Code of Ethics Overview", type: "video", duration: 50, content: "", isFree: true, order: 1 },
          { id: "les-cfa1-1-2", title: "Standards of Professional Conduct", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cfa1-1-3", title: "GIPS Standards", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cfa1-1-4", title: "Ethics Case Studies", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-cfa1-1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cfa1-2",
        title: "Quantitative Methods",
        order: 2,
        lessons: [
          { id: "les-cfa1-2-1", title: "Time Value of Money", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cfa1-2-2", title: "Statistical Concepts", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cfa1-2-3", title: "Probability Distributions", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cfa1-2-4", title: "Hypothesis Testing", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cfa1-2-5", title: "Regression Analysis", type: "video", duration: 55, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cfa1-3",
        title: "Financial Statement Analysis",
        order: 3,
        lessons: [
          { id: "les-cfa1-3-1", title: "Financial Statement Overview", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cfa1-3-2", title: "Revenue Recognition", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cfa1-3-3", title: "Asset Analysis", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cfa1-3-4", title: "Liability Analysis", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-cfa1-3-5", title: "Ratio Analysis", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cfa1-4",
        title: "Economics & Portfolio",
        order: 4,
        lessons: [
          { id: "les-cfa1-4-1", title: "Microeconomics", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cfa1-4-2", title: "Macroeconomics", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cfa1-4-3", title: "Portfolio Management Basics", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cfa1-4-4", title: "Capital Market Theory", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-cfa1-4-5", title: "Full Mock Exam", type: "assignment", duration: 180, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear CFA Level 1 exam",
      "Master financial analysis",
      "Understand ethical standards",
      "Portfolio management foundation"
    ],
    requirements: [
      "Bachelor's degree or final year student",
      "Basic mathematics knowledge",
      "Strong English proficiency",
      "300+ hours of study"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "cfa_level2",
    slug: "cfa-level2",
    title: "CFA Level 2 Course",
    tagline: "Intermediate Chartered Financial Analyst",
    description: "Advanced CFA Level 2 preparation covering Asset Valuation, Derivatives, Fixed Income, and Equity Analysis.",
    longDescription: `Progress to Level 2 of the CFA program with our detailed course focusing on valuation analysis and advanced financial concepts.

What you'll master:
- Equity Valuation
- Fixed Income Analysis
- Derivatives & Alternative Investments
- Financial Reporting Analysis Advanced`,
    thumbnail: "/assets/courses/cfa-level2.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 999,
    originalPrice: 29999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "CFA",
    vertical: "professional",
    targetAudience: ["cfa-level1-passed", "cfa-level2-aspirants", "investment-analysts"],
    tags: ["cfa", "chartered-financial-analyst", "cfa-institute", "level2", "equity-analysis", "fixed-income", "derivatives", "Professional / Career Skills", "Professional Certifications", "CFA"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 4500,
    lessonCount: 225,
    moduleCount: 18,
    rating: 4.9,
    reviewCount: 2800,
    enrollmentCount: 18000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cfa2-1",
        title: "Equity Valuation",
        order: 1,
        lessons: [
          { id: "les-cfa2-1-1", title: "Valuation Models Overview", type: "video", duration: 55, content: "", isFree: true, order: 1 },
          { id: "les-cfa2-1-2", title: "Discounted Cash Flow", type: "video", duration: 60, content: "", isFree: false, order: 2 },
          { id: "les-cfa2-1-3", title: "Comparable Company Analysis", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cfa2-1-4", title: "Precedent Transaction Analysis", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cfa2-1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cfa2-2",
        title: "Fixed Income",
        order: 2,
        lessons: [
          { id: "les-cfa2-2-1", title: "Bond Valuation", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cfa2-2-2", title: "Yield Curves & Term Structure", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cfa2-2-3", title: "Credit Analysis", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cfa2-2-4", title: "Mortgage-Backed Securities", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cfa2-2-5", title: "Interest Rate Derivatives", type: "video", duration: 55, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cfa2-3",
        title: "Derivatives",
        order: 3,
        lessons: [
          { id: "les-cfa2-3-1", title: "Forward Contracts", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cfa2-3-2", title: "Futures Markets", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cfa2-3-3", title: "Options Strategies", type: "video", duration: 60, content: "", isFree: false, order: 3 },
          { id: "les-cfa2-3-4", title: "Option Pricing Models", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-cfa2-3-5", title: "Swaps & Hedging", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cfa2-4",
        title: "Alternative Investments",
        order: 4,
        lessons: [
          { id: "les-cfa2-4-1", title: "Private Equity", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cfa2-4-2", title: "Real Estate Valuation", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cfa2-4-3", title: "Hedge Fund Strategies", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cfa2-4-4", title: "Commodity Markets", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-cfa2-4-5", title: "Practice Exam", type: "assignment", duration: 180, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear CFA Level 2 exam",
      "Advanced valuation skills",
      "Fixed income expertise",
      "Derivatives knowledge"
    ],
    requirements: [
      "CFA Level 1 cleared",
      "Strong financial analysis skills",
      "500+ hours of study",
      "English proficiency"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "cfa_level3",
    slug: "cfa-level3",
    title: "CFA Level 3 Course",
    tagline: "Advanced Chartered Financial Analyst",
    description: "Expert-level CFA Level 3 preparation covering Wealth Management, Portfolio Strategy, and Advanced Ethics.",
    longDescription: `Complete your CFA journey with our comprehensive Level 3 course focusing on portfolio management and wealth planning strategies.

What you'll master:
- Portfolio Management
- Wealth Planning
- Advanced Asset Allocation
- Performance Attribution`,
    thumbnail: "/assets/courses/cfa-level3.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 1199,
    originalPrice: 34999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "CFA",
    vertical: "professional",
    targetAudience: ["cfa-level2-passed", "cfa-level3-aspirants", "portfolio-managers"],
    tags: ["cfa", "chartered-financial-analyst", "cfa-institute", "level3", "portfolio-management", "wealth-planning", "asset-allocation", "Professional / Career Skills", "Professional Certifications", "CFA"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 5000,
    lessonCount: 250,
    moduleCount: 20,
    rating: 4.9,
    reviewCount: 2200,
    enrollmentCount: 15000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cfa3-1",
        title: "Portfolio Management",
        order: 1,
        lessons: [
          { id: "les-cfa3-1-1", title: "IPS Development", type: "video", duration: 55, content: "", isFree: true, order: 1 },
          { id: "les-cfa3-1-2", title: "Risk Management Framework", type: "video", duration: 60, content: "", isFree: false, order: 2 },
          { id: "les-cfa3-1-3", title: "Strategic Asset Allocation", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cfa3-1-4", title: "Tactical Asset Allocation", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cfa3-1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cfa3-2",
        title: "Wealth Planning",
        order: 2,
        lessons: [
          { id: "les-cfa3-2-1", title: "Personal Financial Planning", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cfa3-2-2", title: "Retirement Planning", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cfa3-2-3", title: "Tax-Efficient Investing", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cfa3-2-4", title: "Estate Planning", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cfa3-2-5", title: "Comprehensive Case Study", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cfa3-3",
        title: "Advanced Ethics",
        order: 3,
        lessons: [
          { id: "les-cfa3-3-1", title: "GIPS Compliance", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cfa3-3-2", title: "Soft Dollar Standards", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-cfa3-3-3", title: "Trading Ethics", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cfa3-3-4", title: "Corporate Governance", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-cfa3-3-5", title: "Ethics Workshop", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cfa3-4",
        title: "Alternative Investments",
        order: 4,
        lessons: [
          { id: "les-cfa3-4-1", title: "Hedge Fund Strategies", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cfa3-4-2", title: "Private Equity Structures", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cfa3-4-3", title: "Real Estate Analysis", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cfa3-4-4", title: "Infrastructure Investing", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cfa3-4-5", title: "Final Mock Exam", type: "assignment", duration: 180, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear CFA Level 3 exam",
      "Become CFA Charterholder",
      "Portfolio management expertise",
      "Wealth planning skills"
    ],
    requirements: [
      "CFA Level 2 cleared",
      "4 years work experience",
      "Strong analytical writing",
      "Professional commitment"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "acca_fa",
    slug: "acca-fa",
    title: "ACCA FA Course",
    tagline: "ACCA Accountant in Business",
    description: "Complete ACCA FA (F1) preparation covering Business & Technology, Accounting Principles, and Organization Management.",
    longDescription: `Begin your ACCA journey with our comprehensive FA (F1) course. This paper provides foundational knowledge of business environments and accounting principles.

What you'll master:
- Business Organization Environment
- Accounting Fundamentals
- Management Information Systems
- Leading and Managing Teams`,
    thumbnail: "/assets/courses/acca-fa.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 299,
    originalPrice: 6999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "ACCA",
    vertical: "professional",
    targetAudience: ["12th-pass-students", "acca-aspirants", "accountants"],
    tags: ["acca", "chartered-certified-accountant", "accounting", "business-technology", "fa", "accountant-in-business", "Professional / Career Skills", "Professional Certifications", "ACCA"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 2000,
    lessonCount: 100,
    moduleCount: 8,
    rating: 4.7,
    reviewCount: 2000,
    enrollmentCount: 15000,
    isActive: true,
    isFeatured: false,
    
    modules: [
      {
        id: "mod-acca-fa1",
        title: "Business Organization",
        order: 1,
        lessons: [
          { id: "les-acca-fa1-1", title: "Types of Business Entities", type: "video", duration: 45, content: "", isFree: true, order: 1 },
          { id: "les-acca-fa1-2", title: "Stakeholders and Governance", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-acca-fa1-3", title: "Business Ethics", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-acca-fa1-4", title: "Macro Economic Environment", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-acca-fa1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca-fa2",
        title: "Accounting Principles",
        order: 2,
        lessons: [
          { id: "les-acca-fa2-1", title: "Double Entry System", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-acca-fa2-2", title: "Ledger and Journals", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-acca-fa2-3", title: "Trial Balance", type: "video", duration: 40, content: "", isFree: false, order: 3 },
          { id: "les-acca-fa2-4", title: "Basic Financial Statements", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-acca-fa2-5", title: "Practice Exercise", type: "assignment", duration: 45, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca-fa3",
        title: "Management Information",
        order: 3,
        lessons: [
          { id: "les-acca-fa3-1", title: "Role of Accounting", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-acca-fa3-2", title: "Cost Classification", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-acca-fa3-3", title: "Budgeting Basics", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-acca-fa3-4", title: "Performance Measurement", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-acca-fa3-5", title: "Practice Quiz", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca-fa4",
        title: "Leading and Managing",
        order: 4,
        lessons: [
          { id: "les-acca-fa4-1", title: "Leadership Theories", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-acca-fa4-2", title: "Team Development", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-acca-fa4-3", title: "Communication Skills", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-acca-fa4-4", title: "Conflict Management", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-acca-fa4-5", title: "Full Mock Test", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear ACCA FA exam",
      "Understand business environment",
      "Master accounting basics",
      "Management skills foundation"
    ],
    requirements: [
      "10+2 or equivalent",
      "Basic English proficiency",
      "Dedication to study",
      "No prior accounting required"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "acca_ma",
    slug: "acca-ma",
    title: "ACCA MA Course",
    tagline: "ACCA Managing Finance",
    description: "Advanced ACCA MA (F2) preparation covering Costing Techniques, Budgeting, and Variance Analysis.",
    longDescription: `Progress with our detailed MA (F2) course covering management accounting techniques essential for financial decision-making.

What you'll master:
- Cost Accounting Systems
- Budgeting Techniques
- Variance Analysis
- Performance Measurement`,
    thumbnail: "/assets/courses/acca-ma.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 399,
    originalPrice: 8999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "ACCA",
    vertical: "professional",
    targetAudience: ["acca-fa-passed", "acca-ma-aspirants", "accountants"],
    tags: ["acca", "chartered-certified-accountant", "management-accounting", "ma", "budgeting", "variance-analysis", "Professional / Career Skills", "Professional Certifications", "ACCA"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 2500,
    lessonCount: 125,
    moduleCount: 10,
    rating: 4.8,
    reviewCount: 1800,
    enrollmentCount: 12000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-acca-ma1",
        title: "Costing Techniques",
        order: 1,
        lessons: [
          { id: "les-acca-ma1-1", title: "Absorption Costing", type: "video", duration: 50, content: "", isFree: true, order: 1 },
          { id: "les-acca-ma1-2", title: "Marginal Costing", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-acca-ma1-3", title: "Activity Based Costing", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-acca-ma1-4", title: "Job and Batch Costing", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-acca-ma1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca-ma2",
        title: "Budgeting",
        order: 2,
        lessons: [
          { id: "les-acca-ma2-1", title: "Nature of Budgeting", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-acca-ma2-2", title: "Functional Budgets", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-acca-ma2-3", title: "Cash Budgeting", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-acca-ma2-4", title: "Zero-Based Budgeting", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-acca-ma2-5", title: "Budget Case Study", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca-ma3",
        title: "Variance Analysis",
        order: 3,
        lessons: [
          { id: "les-acca-ma3-1", title: "Material Variances", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-acca-ma3-2", title: "Labor Variances", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-acca-ma3-3", title: "Overhead Variances", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-acca-ma3-4", title: "Sales Variances", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-acca-ma3-5", title: "Variance Investigation", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca-ma4",
        title: "Performance Measurement",
        order: 4,
        lessons: [
          { id: "les-acca-ma4-1", title: "ROI and RI", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-acca-ma4-2", title: "Balanced Scorecard", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-acca-ma4-3", title: "Benchmarking", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-acca-ma4-4", title: "Non-Financial Measures", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-acca-ma4-5", title: "Comprehensive Mock", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear ACCA MA exam",
      "Master cost accounting",
      "Advanced budgeting skills",
      "Performance analysis expertise"
    ],
    requirements: [
      "ACCA FA cleared",
      "Basic mathematics",
      "Analytical thinking",
      "Regular practice"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "acca_fa_int",
    slug: "acca-fa-int",
    title: "ACCA FA (INTL) Course",
    tagline: "ACCA Financial Accounting International",
    description: "ACCA FA (F3) preparation covering Financial Statement Preparation, Accounting for Partnerships, and Incomplete Records.",
    longDescription: `Advance your ACCA journey with our comprehensive FA (F3) course covering financial accounting from preparation to analysis.

What you'll master:
- Financial Statement Preparation
- Accounting for Partnerships
- Incomplete Records
- Consolidated Financial Statements`,
    thumbnail: "/assets/courses/acca-fa-int.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 449,
    originalPrice: 9999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "ACCA",
    vertical: "professional",
    targetAudience: ["acca-ma-passed", "acca-fa-int-aspirants", "accountants"],
    tags: ["acca", "chartered-certified-accountant", "financial-accounting", "fa-intl", "financial-statements", "partnerships", "Professional / Career Skills", "Professional Certifications", "ACCA"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 3000,
    lessonCount: 150,
    moduleCount: 12,
    rating: 4.8,
    reviewCount: 1600,
    enrollmentCount: 10000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-acca-fai1",
        title: "Financial Statements",
        order: 1,
        lessons: [
          { id: "les-acca-fai1-1", title: "Statement of Financial Position", type: "video", duration: 50, content: "", isFree: true, order: 1 },
          { id: "les-acca-fai1-2", title: "Statement of Profit or Loss", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-acca-fai1-3", title: "Statement of Changes in Equity", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-acca-fai1-4", title: "Cash Flow Statement", type: "video", duration: 60, content: "", isFree: false, order: 4 },
          { id: "les-acca-fai1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca-fai2",
        title: "Accounting for Partnerships",
        order: 2,
        lessons: [
          { id: "les-acca-fai2-1", title: "Partnership Formation", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-acca-fai2-2", title: "Profit Sharing Ratio", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-acca-fai2-3", title: "Partner Remuneration", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-acca-fai2-4", title: "Partnership Dissolution", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-acca-fai2-5", title: "Practice Exercise", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca-fai3",
        title: "Incomplete Records",
        order: 3,
        lessons: [
          { id: "les-acca-fai3-1", title: "Restoring Records", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-acca-fai3-2", title: "Markov Analysis", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-acca-fai3-3", title: "Missing Invoice Method", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-acca-fai3-4", title: "Bank Reconciliation", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-acca-fai3-5", title: "Case Study", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca-fai4",
        title: "Groups and Consolidations",
        order: 4,
        lessons: [
          { id: "les-acca-fai4-1", title: "Subsidiary Accounting", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-acca-fai4-2", title: "Non-Controlling Interest", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-acca-fai4-3", title: "Goodwill Calculation", type: "video", duration: 60, content: "", isFree: false, order: 3 },
          { id: "les-acca-fai4-4", title: "Associate Accounting", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-acca-fai4-5", title: "Full Mock Exam", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear ACCA FA (INTL)",
      "Advanced financial statements",
      "Partnership accounting",
      "Consolidation skills"
    ],
    requirements: [
      "ACCA MA cleared",
      "Strong accounting basics",
      "Attention to detail",
      "Practice orientation"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "acca_applied_skills",
    slug: "acca-applied-skills",
    title: "ACCA Applied Skills Course",
    tagline: "ACCA Strategic Professional Foundation",
    description: "Comprehensive ACCA Applied Skills preparation covering Corporate & Business Law, Performance Management, and Taxation.",
    longDescription: `Complete the Applied Skills level with our integrated course covering LW, PM, TX, FR, AA, and FM papers essential for strategic professional level.

What you'll master:
- Corporate and Business Law
- Performance Management
- Taxation Systems
- Audit and Assurance`,
    thumbnail: "/assets/courses/acca-applied-skills.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 699,
    originalPrice: 17999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "ACCA",
    vertical: "professional",
    targetAudience: ["acca-fa-int-passed", "acca-applied-skills-aspirants", "accountants"],
    tags: ["acca", "chartered-certified-accountant", "applied-skills", "strategic-professional", "law", "performance-management", "taxation", "Professional / Career Skills", "Professional Certifications", "ACCA"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 4000,
    lessonCount: 200,
    moduleCount: 16,
    rating: 4.9,
    reviewCount: 2000,
    enrollmentCount: 14000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-acca-as1",
        title: "Corporate & Business Law",
        order: 1,
        lessons: [
          { id: "les-acca-as1-1", title: "Legal Systems", type: "video", duration: 55, content: "", isFree: true, order: 1 },
          { id: "les-acca-as1-2", title: "Company Law Fundamentals", type: "video", duration: 60, content: "", isFree: false, order: 2 },
          { id: "les-acca-as1-3", title: "Employment Law", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-acca-as1-4", title: "Contract Law", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-acca-as1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca-as2",
        title: "Performance Management",
        order: 2,
        lessons: [
          { id: "les-acca-as2-1", title: "Decision-Making Techniques", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-acca-as2-2", title: "Pricing Decisions", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-acca-as2-3", title: "Risk Management", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-acca-as2-4", title: "Performance Analysis", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-acca-as2-5", title: "Case Study", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca-as3",
        title: "Taxation",
        order: 3,
        lessons: [
          { id: "les-acca-as3-1", title: "Income Tax Computation", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-acca-as3-2", title: "Corporation Tax", type: "video", duration: 60, content: "", isFree: false, order: 2 },
          { id: "les-acca-as3-3", title: "VAT and Customs", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-acca-as3-4", title: "International Taxation", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-acca-as3-5", title: "Tax Planning", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca-as4",
        title: "Audit and Assurance",
        order: 4,
        lessons: [
          { id: "les-acca-as4-1", title: "Audit Framework", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-acca-as4-2", title: "Audit Planning", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-acca-as4-3", title: "Audit Evidence", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-acca-as4-4", title: "Audit Reports", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-acca-as4-5", title: "Mock Audit", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Complete Applied Skills level",
      "Legal compliance knowledge",
      "Advanced performance management",
      "Taxation expertise"
    ],
    requirements: [
      "ACCA FA (INTL) passed",
      "Strong analytical skills",
      "3 years relevant experience",
      "Professional commitment"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "acca_strategic_professional",
    slug: "acca-strategic-professional",
    title: "ACCA Strategic Professional Course",
    tagline: "ACCA Strategic Professional Complete",
    description: "Expert-level ACCA Strategic Professional preparation covering Advanced Financial Reporting, Advanced Audit and Assurance, and Strategic Business Leadership.",
    longDescription: `Complete your ACCA qualification with our comprehensive Strategic Professional course covering essential advanced papers for becoming a Chartered Certified Accountant.

What you'll master:
- Advanced Financial Reporting
- Advanced Audit and Assurance
- Strategic Business Leadership
- Advanced Performance Management`,
    thumbnail: "/assets/courses/acca-strategic-professional.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 899,
    originalPrice: 24999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "ACCA",
    vertical: "professional",
    targetAudience: ["acca-applied-skills-passed", "acca-strategic-aspirants", "finance-managers"],
    tags: ["acca", "chartered-certified-accountant", "accounting", "strategic-professional", "advanced-audit", "financial-reporting", "Professional / Career Skills", "Professional Certifications", "ACCA"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 5000,
    lessonCount: 250,
    moduleCount: 20,
    rating: 4.9,
    reviewCount: 1500,
    enrollmentCount: 10000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-acca3-1",
        title: "Advanced Financial Reporting",
        order: 1,
        lessons: [
          { id: "les-acca3-1-1", title: "IFRS Advanced", type: "video", duration: 55, content: "", isFree: true, order: 1 },
          { id: "les-acca3-1-2", title: "Group Accounting Complex", type: "video", duration: 60, content: "", isFree: false, order: 2 },
          { id: "les-acca3-1-3", title: "Financial Instruments", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-acca3-1-4", title: "Impairment Testing", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-acca3-1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca3-2",
        title: "Advanced Audit and Assurance",
        order: 2,
        lessons: [
          { id: "les-acca3-2-1", title: "Audit Risk Assessment", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-acca3-2-2", title: "Group Audits", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-acca3-2-3", title: "Forensic Auditing", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-acca3-2-4", title: "Professional Ethics", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-acca3-2-5", title: "Audit Case Study", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca3-3",
        title: "Strategic Business Leader",
        order: 3,
        lessons: [
          { id: "les-acca3-3-1", title: "Strategic Analysis", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-acca3-3-2", title: "Leadership and Management", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-acca3-3-3", title: "Governance and Risk", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-acca3-3-4", title: "Technology and Data", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-acca3-3-5", title: "Business Simulation", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca3-4",
        title: "Advanced Performance Management",
        order: 4,
        lessons: [
          { id: "les-acca3-4-1", title: "Strategic Performance Management", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-acca3-4-2", title: "Performance Measurement", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-acca3-4-3", title: "Variance Analysis Advanced", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-acca3-4-4", title: "Decision Making", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-acca3-4-5", title: "Final Mock Exam", type: "assignment", duration: 240, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Complete ACCA qualification",
      "Advanced financial reporting",
      "Audit expertise",
      "Strategic leadership skills"
    ],
    requirements: [
      "ACCA Applied Skills passed",
      "3 years relevant experience",
      "Strong analytical skills",
      "Professional commitment"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "frm_part1",
    slug: "frm-part1",
    title: "FRM Part 1 Course",
    tagline: "Financial Risk Manager Part 1",
    description: "Comprehensive FRM Part 1 preparation covering Financial Risk Foundations, Quantitative Analysis, and Market Risk.",
    longDescription: `Begin your journey to become a Financial Risk Manager with our detailed FRM Part 1 course. Covering foundational risk management concepts.

What you'll master:
- Foundations of Risk Management
- Quantitative Analysis
- Financial Markets and Products
- Value at Risk Methods`,
    thumbnail: "/assets/courses/frm-part1.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 799,
    originalPrice: 19999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "FRM",
    vertical: "professional",
    targetAudience: ["graduates", "frm-aspirants", "risk-analysts"],
    tags: ["frm", "financial-risk-manager", "garp", "risk-management", "quantitative-analysis", "market-risk", "Professional / Career Skills", "Professional Certifications", "FRM"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 3500,
    lessonCount: 175,
    moduleCount: 14,
    rating: 4.8,
    reviewCount: 2500,
    enrollmentCount: 18000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-frm1-1",
        title: "Foundations of Risk Management",
        order: 1,
        lessons: [
          { id: "les-frm1-1-1", title: "Risk Management Overview", type: "video", duration: 50, content: "", isFree: true, order: 1 },
          { id: "les-frm1-1-2", title: "Corporate Governance", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-frm1-1-3", title: "Risk Culture", type: "video", duration: 40, content: "", isFree: false, order: 3 },
          { id: "les-frm1-1-4", title: "Model Risk", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-frm1-1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-frm1-2",
        title: "Quantitative Analysis",
        order: 2,
        lessons: [
          { id: "les-frm1-2-1", title: "Probability Theory", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-frm1-2-2", title: "Statistical Methods", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-frm1-2-3", title: "Regression Analysis", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-frm1-2-4", title: "Monte Carlo Simulation", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-frm1-2-5", title: "Extreme Value Theory", type: "video", duration: 50, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-frm1-3",
        title: "Financial Markets",
        order: 3,
        lessons: [
          { id: "les-frm1-3-1", title: "Bonds and Fixed Income", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-frm1-3-2", title: "Equities and Derivatives", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-frm1-3-3", title: "Foreign Exchange", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-frm1-3-4", title: "Commodities", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-frm1-3-5", title: "Structured Products", type: "video", duration: 50, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-frm1-4",
        title: "Value at Risk",
        order: 4,
        lessons: [
          { id: "les-frm1-4-1", title: "VaR Methods", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-frm1-4-2", title: "Backtesting VaR", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-frm1-4-3", title: "Stress Testing", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-frm1-4-4", title: "Expected Shortfall", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-frm1-4-5", title: "Full Mock Exam", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear FRM Part 1 exam",
      "Foundational risk knowledge",
      "Quantitative skills",
      "Market risk understanding"
    ],
    requirements: [
      "2 years work experience waiver available",
      "Strong mathematics",
      "English proficiency",
      "200+ hours of study"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "frm_part2",
    slug: "frm-part2",
    title: "FRM Part 2 Course",
    tagline: "Financial Risk Manager Part 2",
    description: "Advanced FRM Part 2 preparation covering Market Risk, Credit Risk, Operational Risk, and Integrated Risk Management.",
    longDescription: `Complete your FRM journey with our detailed Part 2 course covering advanced risk management topics and real-world applications.

What you'll master:
- Market Risk Management
- Credit Risk Management
- Operational Risk Management
- Current Issues in Risk Management`,
    thumbnail: "/assets/courses/frm-part2.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 999,
    originalPrice: 24999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "FRM",
    vertical: "professional",
    targetAudience: ["frm-part1-passed", "frm-part2-aspirants", "risk-managers"],
    tags: ["frm", "financial-risk-manager", "garp", "risk-management", "credit-risk", "operational-risk", "Professional / Career Skills", "Professional Certifications", "FRM"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 4500,
    lessonCount: 225,
    moduleCount: 18,
    rating: 4.9,
    reviewCount: 2000,
    enrollmentCount: 14000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-frm2-1",
        title: "Market Risk",
        order: 1,
        lessons: [
          { id: "les-frm2-1-1", title: "VaR and Volatility", type: "video", duration: 55, content: "", isFree: true, order: 1 },
          { id: "les-frm2-1-2", title: "Interest Rate Risk", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-frm2-1-3", title: "Option Pricing Models", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-frm2-1-4", title: "Exotic Options", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-frm2-1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-frm2-2",
        title: "Credit Risk",
        order: 2,
        lessons: [
          { id: "les-frm2-2-1", title: "Credit Risk Modeling", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-frm2-2-2", title: "Default Probability", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-frm2-2-3", title: "Credit Derivatives", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-frm2-2-4", title: "Counterparty Risk", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-frm2-2-5", title: "CVA and DVA", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-frm2-3",
        title: "Operational Risk",
        order: 3,
        lessons: [
          { id: "les-frm2-3-1", title: "Operational Risk Framework", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-frm2-3-2", title: "Basel Accords", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-frm2-3-3", title: "Model Validation", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-frm2-3-4", title: "Liquidity Risk", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-frm2-3-5", title: "Case Studies", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-frm2-4",
        title: "Current Issues",
        order: 4,
        lessons: [
          { id: "les-frm2-4-1", title: "FinTech Risk", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-frm2-4-2", title: "Climate Risk", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-frm2-4-3", title: "Cyber Security Risk", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-frm2-4-4", title: "Regulatory Changes", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-frm2-4-5", title: "Final Mock Exam", type: "assignment", duration: 180, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear FRM Part 2 exam",
      "Become FRM Certified",
      "Advanced risk management",
      "Career advancement"
    ],
    requirements: [
      "FRM Part 1 cleared",
      "2 years work experience",
      "Advanced quantitative skills",
      "300+ hours of study"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  // ==================== PROFESSIONAL CERTIFICATIONS ====================

  {
    id: "course-ca-foundation",
    slug: "ca-foundation",
    title: "CA Foundation Course",
    tagline: "Your Gateway to Chartered Accountancy",
    description: "Complete preparation for CA Foundation exam covering all four papers - Accounting, Business Laws, Mathematics, and General Economics.",
    longDescription: `Start your journey to become a Chartered Accountant with our comprehensive CA Foundation course. This course covers all four papers required for the ICAI CA Foundation exam.

What you'll learn:
- Principles and Practice of Accounting
- Business Laws & Business Correspondence
- Business Mathematics & Statistics
- General Economics & Business Environment`,
    thumbnail: "/assets/courses/ca-foundation.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 499,
    originalPrice: 9999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "CA",
    vertical: "professional",
    targetAudience: ["12th-pass-students", "ca-aspirants", "commerce-students"],
    tags: ["ca", "chartered-accountant", "icai", "foundation", "accounting", "Professional / Career Skills", "Professional Certifications", "CA"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 3500,
    lessonCount: 180,
    moduleCount: 14,
    rating: 4.9,
    reviewCount: 4500,
    enrollmentCount: 35000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-ca-f1",
        title: "Principles of Accounting",
        order: 1,
        lessons: [
          { id: "les-ca-f1-1", title: "Accounting Standards Overview", type: "video", duration: 45, content: "", isFree: true, order: 1 },
          { id: "les-ca-f1-2", title: "Bank Reconciliation Statement", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-ca-f1-3", title: "Depreciation Accounting", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-ca-f1-4", title: "Inventory Valuation", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-ca-f1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ca-f2",
        title: "Business Laws",
        order: 2,
        lessons: [
          { id: "les-ca-f2-1", title: "Indian Contract Act Overview", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-ca-f2-2", title: "Sale of Goods Act", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-ca-f2-3", title: "Partnership Laws", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-ca-f2-4", title: "Company Law Basics", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-ca-f2-5", title: "Business Correspondence", type: "video", duration: 40, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ca-f3",
        title: "Business Mathematics",
        order: 3,
        lessons: [
          { id: "les-ca-f3-1", title: "Ratio & Proportion", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-ca-f3-2", title: "Time Value of Money", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-ca-f3-3", title: "Permutations & Combinations", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-ca-f3-4", title: "Statistical Analysis", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-ca-f3-5", title: "Probability Basics", type: "video", duration: 45, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ca-f4",
        title: "General Economics",
        order: 4,
        lessons: [
          { id: "les-ca-f4-1", title: "Indian Economy Overview", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-ca-f4-2", title: "Economic Reforms", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-ca-f4-3", title: "Money & Banking", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-ca-f4-4", title: "Fiscal Policy", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-ca-f4-5", title: "Practice Papers", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear CA Foundation in first attempt",
      "Master all four papers",
      "Understand accounting principles",
      "Develop analytical skills"
    ],
    requirements: [
      "12th pass from recognized board",
      "Basic mathematics knowledge",
      "Dedication for regular study"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "course-ca-intermediate",
    slug: "ca-intermediate",
    title: "CA Intermediate Course",
    tagline: "Advanced Level Chartered Accountancy",
    description: "Comprehensive CA Intermediate preparation covering Advanced Accounting, Taxation, Costing, and Auditing as per ICAI syllabus.",
    longDescription: `Progress to the second level of Chartered Accountancy with our detailed CA Intermediate course. Covering advanced topics in accounting, taxation, cost management, and auditing.

What you'll master:
- Advanced Accounting Standards
- Corporate Tax Planning
- Cost Management Techniques
- Auditing Standards & Practices`,
    thumbnail: "/assets/courses/ca-intermediate.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 799,
    originalPrice: 15999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "CA",
    vertical: "professional",
    targetAudience: ["ca-foundation-passed", "ca-aspirants", "commerce-graduates"],
    tags: ["ca", "chartered-accountant", "icai", "intermediate", "accounting", "tax", "audit", "Professional / Career Skills", "Professional Certifications", "CA"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 4500,
    lessonCount: 225,
    moduleCount: 18,
    rating: 4.8,
    reviewCount: 3200,
    enrollmentCount: 25000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-ca-i1",
        title: "Advanced Accounting",
        order: 1,
        lessons: [
          { id: "les-ca-i1-1", title: "AS 12, 14, 16 Complex Cases", type: "video", duration: 60, content: "", isFree: true, order: 1 },
          { id: "les-ca-i1-2", title: "Company Accounts - Advanced", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-ca-i1-3", title: "Accounting for Branches", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-ca-i1-4", title: "Amalgamation & Reconstruction", type: "video", duration: 60, content: "", isFree: false, order: 4 },
          { id: "les-ca-i1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ca-i2",
        title: "Corporate Tax",
        order: 2,
        lessons: [
          { id: "les-ca-i2-1", title: "Income Tax Provisions", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-ca-i2-2", title: "Tax Planning Strategies", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-ca-i2-3", title: "International Taxation", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-ca-i2-4", title: "Deduction Planning", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-ca-i2-5", title: "Tax Return Filing", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ca-i3",
        title: "Cost Management",
        order: 3,
        lessons: [
          { id: "les-ca-i3-1", title: "Cost Accounting Standards", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-ca-i3-2", title: "Activity Based Costing", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-ca-i3-3", title: "Budgetary Control", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-ca-i3-4", title: "Standard Costing", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-ca-i3-5", title: "Cost Audit", type: "video", duration: 45, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ca-i4",
        title: "Auditing",
        order: 4,
        lessons: [
          { id: "les-ca-i4-1", title: "Auditing Standards", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-ca-i4-2", title: "Audit Procedures", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-ca-i4-3", title: "Internal Audit", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-ca-i4-4", title: "Audit Reports", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-ca-i4-5", title: "Case Study", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear CA Intermediate successfully",
      "Master advanced accounting",
      "Understand tax planning",
      "Develop audit expertise"
    ],
    requirements: [
      "CA Foundation cleared",
      "Strong accounting basics",
      "Regular study commitment"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "course-ca-final",
    slug: "ca-final",
    title: "CA Final Course",
    tagline: "Complete Preparation for CA Final",
    description: "Expert-level CA Final preparation covering Advanced Management Accounting, Financial Reporting, Direct Tax, Indirect Tax, and Strategic Management.",
    longDescription: `Achieve the highest level of Chartered Accountancy with our comprehensive CA Final course. Covering advanced topics required for the final level examination.

What you'll master:
- Advanced Financial Reporting
- Strategic Financial Management
- Direct & Indirect Tax Management
- Advanced Auditing & Professional Ethics`,
    thumbnail: "/assets/courses/ca-final.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 999,
    originalPrice: 24999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "CA",
    vertical: "professional",
    targetAudience: ["ca-intermediate-passed", "ca-final-aspirants", "ca-professionals"],
    tags: ["ca", "chartered-accountant", "icai", "final", "financial-reporting", "tax-management", "Professional / Career Skills", "Professional Certifications", "CA"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 5500,
    lessonCount: 275,
    moduleCount: 22,
    rating: 4.9,
    reviewCount: 2800,
    enrollmentCount: 18000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-ca-final1",
        title: "Financial Reporting",
        order: 1,
        lessons: [
          { id: "les-ca-final1-1", title: "Ind AS Implementation", type: "video", duration: 60, content: "", isFree: true, order: 1 },
          { id: "les-ca-final1-2", title: "Group Accounting Complex", type: "video", duration: 65, content: "", isFree: false, order: 2 },
          { id: "les-ca-final1-3", title: "Financial Instruments", type: "video", duration: 60, content: "", isFree: false, order: 3 },
          { id: "les-ca-final1-4", title: "Business Combinations", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-ca-final1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ca-final2",
        title: "Strategic Financial Management",
        order: 2,
        lessons: [
          { id: "les-ca-final2-1", title: "Capital Budgeting", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-ca-final2-2", title: "Working Capital Management", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-ca-final2-3", title: "Merger & Acquisition", type: "video", duration: 60, content: "", isFree: false, order: 3 },
          { id: "les-ca-final2-4", title: "Valuation Methods", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-ca-final2-5", title: "Project Finance", type: "video", duration: 50, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ca-final3",
        title: "Direct Tax",
        order: 3,
        lessons: [
          { id: "les-ca-final3-1", title: "Advanced Tax Planning", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-ca-final3-2", title: "International Tax Planning", type: "video", duration: 60, content: "", isFree: false, order: 2 },
          { id: "les-ca-final3-3", title: "Transfer Pricing", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-ca-final3-4", title: "Tax Avoidance vs Evasion", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-ca-final3-5", title: "Case Studies", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-ca-final4",
        title: "Indirect Tax",
        order: 4,
        lessons: [
          { id: "les-ca-final4-1", title: "GST Comprehensive", type: "video", duration: 60, content: "", isFree: false, order: 1 },
          { id: "les-ca-final4-2", title: "Customs Duty", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-ca-final4-3", title: "Input Tax Credit", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-ca-final4-4", title: "GST Returns & Audit", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-ca-final4-5", title: "Practice Papers", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Become a Chartered Accountant",
      "Master financial reporting",
      "Expert in tax planning",
      "Strategic management skills"
    ],
    requirements: [
      "CA Intermediate cleared",
      "Strong analytical skills",
      "Full dedication required"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "cs_foundation",
    slug: "cs-foundation",
    title: "CS Foundation Course",
    tagline: "Company Secretary Foundation Program",
    description: "Complete CS Foundation preparation covering Company Law, Company Secretaryship, Financial Accounting, and Business Management.",
    longDescription: `Begin your journey as a Company Secretary with our comprehensive CS Foundation course. This program covers the fundamentals required for the ICSI Foundation examination.

What you'll learn:
- Company Law Fundamentals
- Company Secretaryship Role
- Financial Accounting Basics
- Business Management Principles`,
    thumbnail: "/assets/courses/cs-foundation.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 349,
    originalPrice: 7999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "Company Secretary",
    vertical: "professional",
    targetAudience: ["12th-pass-students", "cs-aspirants", "commerce-students"],
    tags: ["cs", "company-secretary", "icsi", "foundation", "corporate-law", "Professional / Career Skills", "Professional Certifications", "Company Secretary"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 2500,
    lessonCount: 125,
    moduleCount: 10,
    rating: 4.7,
    reviewCount: 1800,
    enrollmentCount: 12000,
    isActive: true,
    isFeatured: false,
    
    modules: [
      {
        id: "mod-cs-f1",
        title: "Company Law",
        order: 1,
        lessons: [
          { id: "les-cs-f1-1", title: "Companies Act 2013 Overview", type: "video", duration: 45, content: "", isFree: true, order: 1 },
          { id: "les-cs-f1-2", title: "Types of Companies", type: "video", duration: 40, content: "", isFree: false, order: 2 },
          { id: "les-cs-f1-3", title: "Company Formation", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cs-f1-4", title: "Board of Directors", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-cs-f1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cs-f2",
        title: "Company Secretaryship",
        order: 2,
        lessons: [
          { id: "les-cs-f2-1", title: "Role of Company Secretary", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-cs-f2-2", title: "Meetings & Resolutions", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cs-f2-3", title: "Statutory Registers", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-cs-f2-4", title: "Annual Returns", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-cs-f2-5", title: "Practice Exercise", type: "assignment", duration: 45, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cs-f3",
        title: "Financial Accounting",
        order: 3,
        lessons: [
          { id: "les-cs-f3-1", title: "Accounting Fundamentals", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-cs-f3-2", title: "Journal & Ledger", type: "video", duration: 40, content: "", isFree: false, order: 2 },
          { id: "les-cs-f3-3", title: "Trial Balance", type: "video", duration: 35, content: "", isFree: false, order: 3 },
          { id: "les-cs-f3-4", title: "Final Accounts", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cs-f3-5", title: "Accounting Standards", type: "video", duration: 40, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cs-f4",
        title: "Business Management",
        order: 4,
        lessons: [
          { id: "les-cs-f4-1", title: "Management Principles", type: "video", duration: 40, content: "", isFree: false, order: 1 },
          { id: "les-cs-f4-2", title: "Organizational Behavior", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-cs-f4-3", title: "Business Communication", type: "video", duration: 40, content: "", isFree: false, order: 3 },
          { id: "les-cs-f4-4", title: "Corporate Governance", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-cs-f4-5", title: "Full Mock Test", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[6],
    
    outcomes: [
      "Clear CS Foundation exam",
      "Understand company law",
      "Master corporate procedures",
      "Build career foundation"
    ],
    requirements: [
      "12th pass from recognized board",
      "Basic business awareness",
      "Dedication to studies"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "cs_executive",
    slug: "cs-executive",
    title: "CS Executive Course",
    tagline: "Intermediate Level Company Secretary",
    description: "Advanced CS Executive preparation covering Company Law, Corporate Secretarial Practice, Financial Management, and Tax Laws.",
    longDescription: `Progress to the executive level of Company Secretary with our detailed CS Executive course. Covering advanced topics in corporate law, secretarial practice, and financial management.

What you'll master:
- Corporate Secretarial Practice
- Company Law Advanced
- Financial Management
- Tax Compliance`,
    thumbnail: "/assets/courses/cs-executive.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 549,
    originalPrice: 12999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "Company Secretary",
    vertical: "professional",
    targetAudience: ["cs-foundation-passed", "cs-executive-aspirants", "legal-professionals"],
    tags: ["cs", "company-secretary", "icsi", "executive", "corporate-law", "secretarial-practice", "Professional / Career Skills", "Professional Certifications", "Company Secretary"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 3500,
    lessonCount: 175,
    moduleCount: 14,
    rating: 4.8,
    reviewCount: 1500,
    enrollmentCount: 10000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cs-e1",
        title: "Corporate Secretarial Practice",
        order: 1,
        lessons: [
          { id: "les-cs-e1-1", title: "Secretarial Audit", type: "video", duration: 50, content: "", isFree: true, order: 1 },
          { id: "les-cs-e1-2", title: "Due Diligence", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cs-e1-3", title: "Corporate Governance", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cs-e1-4", title: "Compliance Management", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-cs-e1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cs-e2",
        title: "Company Law Advanced",
        order: 2,
        lessons: [
          { id: "les-cs-e2-1", title: "Share Capital & Debentures", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cs-e2-2", title: "Dividend & Distribution", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cs-e2-3", title: "Oppression & Mismanagement", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cs-e2-4", title: "Winding Up", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cs-e2-5", title: "Case Studies", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cs-e3",
        title: "Financial Management",
        order: 3,
        lessons: [
          { id: "les-cs-e3-1", title: "Capital Structure", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cs-e3-2", title: "Working Capital", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-cs-e3-3", title: "Cash Flow Analysis", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cs-e3-4", title: "Financial Statement Analysis", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-cs-e3-5", title: "Investment Decisions", type: "video", duration: 50, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cs-e4",
        title: "Tax Laws",
        order: 4,
        lessons: [
          { id: "les-cs-e4-1", title: "Income Tax Overview", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cs-e4-2", title: "Corporate Tax Planning", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cs-e4-3", title: "GST Compliance", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cs-e4-4", title: "Tax Returns", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-cs-e4-5", title: "Practice Papers", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[6],
    
    outcomes: [
      "Clear CS Executive exam",
      "Expert in secretarial practice",
      "Corporate law proficiency",
      "Financial management skills"
    ],
    requirements: [
      "CS Foundation cleared",
      "Strong legal aptitude",
      "Regular study required"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "cs_professional",
    slug: "cs-professional",
    title: "CS Professional Course",
    tagline: "Advanced Level Company Secretary",
    description: "Expert-level CS Professional preparation covering Corporate Governance, Secretarial Audit, Due Diligence, and Corporate Restructuring.",
    longDescription: `Achieve the highest level as a Company Secretary with our comprehensive CS Professional course. Covering advanced topics required for the professional level examination.

What you'll master:
- Corporate Governance & Ethics
- Secretarial Audit & Due Diligence
- Corporate Restructuring
- Insolvency & Bankruptcy`,
    thumbnail: "/assets/courses/cs-professional.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 799,
    originalPrice: 17999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "Company Secretary",
    vertical: "professional",
    targetAudience: ["cs-executive-passed", "cs-professional-aspirants", "cs-practitioners"],
    tags: ["cs", "company-secretary", "icsi", "professional", "corporate-governance", "secretarial-audit", "Professional / Career Skills", "Professional Certifications", "Company Secretary"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 4000,
    lessonCount: 200,
    moduleCount: 16,
    rating: 4.8,
    reviewCount: 1200,
    enrollmentCount: 8000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cs-p1",
        title: "Corporate Governance",
        order: 1,
        lessons: [
          { id: "les-cs-p1-1", title: "Governance Frameworks", type: "video", duration: 55, content: "", isFree: true, order: 1 },
          { id: "les-cs-p1-2", title: "Board Composition", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cs-p1-3", title: "Audit Committee", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cs-p1-4", title: "SEBI Regulations", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cs-p1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cs-p2",
        title: "Secretarial Audit",
        order: 2,
        lessons: [
          { id: "les-cs-p2-1", title: "Audit Methodology", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cs-p2-2", title: "Compliance Audit", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cs-p2-3", title: "Reporting Standards", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-cs-p2-4", title: "Best Practices", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cs-p2-5", title: "Case Study", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cs-p3",
        title: "Due Diligence",
        order: 3,
        lessons: [
          { id: "les-cs-p3-1", title: "Due Diligence Process", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cs-p3-2", title: "Legal Due Diligence", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cs-p3-3", title: "Financial Due Diligence", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cs-p3-4", title: "Regulatory Due Diligence", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cs-p3-5", title: "Documentation", type: "video", duration: 45, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cs-p4",
        title: "Corporate Restructuring",
        order: 4,
        lessons: [
          { id: "les-cs-p4-1", title: "Merger & Acquisition", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cs-p4-2", title: "Amalgamation Process", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cs-p4-3", title: "Insolvency Framework", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cs-p4-4", title: "Bankruptcy Code", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cs-p4-5", title: "Mock Exam", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[6],
    
    outcomes: [
      "Become a qualified CS",
      "Expert in corporate governance",
      "Master secretarial audit",
      "Corporate restructuring skills"
    ],
    requirements: [
      "CS Executive cleared",
      "Extensive knowledge required",
      "Professional commitment"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "cma_foundation",
    slug: "cma-foundation",
    title: "CMA Foundation Course",
    tagline: "Cost Management Accounting Foundation",
    description: "Complete CMA Foundation preparation covering Fundamentals of Financial Accounting, Cost Accounting, Laws, and Statistics.",
    longDescription: `Begin your journey in Cost and Management Accounting with our comprehensive CMA Foundation course. This program covers the fundamentals required for the ICWAI CMA Foundation examination.

What you'll learn:
- Fundamentals of Financial Accounting
- Cost Accounting Basics
- Mercantile Law
- Statistics & Mathematics`,
    thumbnail: "/assets/courses/cma-foundation.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 349,
    originalPrice: 7999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "CMA",
    vertical: "professional",
    targetAudience: ["12th-pass-students", "cma-aspirants", "commerce-students"],
    tags: ["cma", "cost-management", "accounting", "icwai", "foundation", "Professional / Career Skills", "Professional Certifications", "CMA"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 2500,
    lessonCount: 125,
    moduleCount: 10,
    rating: 4.7,
    reviewCount: 1600,
    enrollmentCount: 11000,
    isActive: true,
    isFeatured: false,
    
    modules: [
      {
        id: "mod-cma-f1",
        title: "Fundamentals of Financial Accounting",
        order: 1,
        lessons: [
          { id: "les-cma-f1-1", title: "Accounting Basics", type: "video", duration: 45, content: "", isFree: true, order: 1 },
          { id: "les-cma-f1-2", title: "Journal Entries", type: "video", duration: 40, content: "", isFree: false, order: 2 },
          { id: "les-cma-f1-3", title: "Ledger & Trial Balance", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-cma-f1-4", title: "Final Accounts", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cma-f1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cma-f2",
        title: "Cost Accounting",
        order: 2,
        lessons: [
          { id: "les-cma-f2-1", title: "Cost Concepts", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-cma-f2-2", title: "Materials Costing", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cma-f2-3", title: "Labor Costing", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-cma-f2-4", title: "Overhead Allocation", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cma-f2-5", title: "Cost Sheet", type: "assignment", duration: 45, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cma-f3",
        title: "Mercantile Law",
        order: 3,
        lessons: [
          { id: "les-cma-f3-1", title: "Indian Contract Act", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-cma-f3-2", title: "Sale of Goods Act", type: "video", duration: 40, content: "", isFree: false, order: 2 },
          { id: "les-cma-f3-3", title: "Partnership Act", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-cma-f3-4", title: "Companies Act Basics", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-cma-f3-5", title: "Practice Questions", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cma-f4",
        title: "Statistics & Mathematics",
        order: 4,
        lessons: [
          { id: "les-cma-f4-1", title: "Statistical Methods", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-cma-f4-2", title: "Probability Basics", type: "video", duration: 40, content: "", isFree: false, order: 2 },
          { id: "les-cma-f4-3", title: "Correlation & Regression", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cma-f4-4", title: "Time Series Analysis", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-cma-f4-5", title: "Full Mock Test", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear CMA Foundation",
      "Master accounting fundamentals",
      "Understand cost concepts",
      "Statistical analysis skills"
    ],
    requirements: [
      "12th pass from recognized board",
      "Basic mathematics knowledge",
      "Regular study commitment"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "cma_intermediate",
    slug: "cma-intermediate",
    title: "CMA Intermediate Course",
    tagline: "Intermediate Cost Management Accounting",
    description: "Advanced CMA Intermediate preparation covering Financial Accounting, Cost Accounting, Laws, and Direct & Indirect Taxation.",
    longDescription: `Progress to the intermediate level of Cost and Management Accounting with our detailed CMA Intermediate course. Covering advanced topics in financial management and taxation.

What you'll master:
- Advanced Financial Accounting
- Cost Management Techniques
- Tax Laws & Returns
- Financial Management`,
    thumbnail: "/assets/courses/cma-intermediate.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 549,
    originalPrice: 12999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "CMA",
    vertical: "professional",
    targetAudience: ["cma-foundation-passed", "cma-intermediate-aspirants", "accountants"],
    tags: ["cma", "cost-management", "accounting", "icwai", "intermediate", "taxation", "financial-management", "Professional / Career Skills", "Professional Certifications", "CMA"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 3500,
    lessonCount: 175,
    moduleCount: 14,
    rating: 4.8,
    reviewCount: 1400,
    enrollmentCount: 9000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cma-i1",
        title: "Financial Accounting",
        order: 1,
        lessons: [
          { id: "les-cma-i1-1", title: "Advanced Accounting Standards", type: "video", duration: 50, content: "", isFree: true, order: 1 },
          { id: "les-cma-i1-2", title: "Company Accounts", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cma-i1-3", title: "Accounting for Special Transactions", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cma-i1-4", title: "Financial Statement Analysis", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-cma-i1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cma-i2",
        title: "Cost Accounting",
        order: 2,
        lessons: [
          { id: "les-cma-i2-1", title: "Job & Batch Costing", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cma-i2-2", title: "Process Costing", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cma-i2-3", title: "Operation Costing", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cma-i2-4", title: "Standard Costing", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-cma-i2-5", title: "Cost Audit", type: "video", duration: 45, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cma-i3",
        title: "Direct Tax",
        order: 3,
        lessons: [
          { id: "les-cma-i3-1", title: "Income Tax Computation", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cma-i3-2", title: "Tax Planning", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cma-i3-3", title: "Deductions & Exemptions", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cma-i3-4", title: "TDS & TCS", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-cma-i3-5", title: "Tax Returns", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cma-i4",
        title: "Indirect Tax",
        order: 4,
        lessons: [
          { id: "les-cma-i4-1", title: "GST Comprehensive", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cma-i4-2", title: "Input Tax Credit", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cma-i4-3", title: "GST Returns", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-cma-i4-4", title: "Customs Duty", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cma-i4-5", title: "Practice Papers", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear CMA Intermediate",
      "Advanced accounting skills",
      "Cost management expertise",
      "Taxation knowledge"
    ],
    requirements: [
      "CMA Foundation cleared",
      "Strong accounting background",
      "Regular study required"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "cma_final",
    slug: "cma-final",
    title: "CMA Final Course",
    tagline: "Advanced Cost Management Accounting",
    description: "Expert-level CMA Final preparation covering Strategic Financial Management, Corporate Finance, and Strategic Cost Management.",
    longDescription: `Achieve the highest level in Cost and Management Accounting with our comprehensive CMA Final course. Covering strategic financial management and advanced costing techniques.

What you'll master:
- Strategic Financial Management
- Corporate Restructuring
- Strategic Cost Management
- Financial Analysis & Decisions`,
    thumbnail: "/assets/courses/cma-final.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 799,
    originalPrice: 19999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "CMA",
    vertical: "professional",
    targetAudience: ["cma-intermediate-passed", "cma-final-aspirants", "finance-managers"],
    tags: ["cma", "cost-management", "accounting", "icwai", "final", "financial-management", "strategic-costing", "Professional / Career Skills", "Professional Certifications", "CMA"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 4500,
    lessonCount: 225,
    moduleCount: 18,
    rating: 4.9,
    reviewCount: 1100,
    enrollmentCount: 7000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cma-final1",
        title: "Strategic Financial Management",
        order: 1,
        lessons: [
          { id: "les-cma-final1-1", title: "Financial Strategy", type: "video", duration: 55, content: "", isFree: true, order: 1 },
          { id: "les-cma-final1-2", title: "Capital Budgeting Advanced", type: "video", duration: 60, content: "", isFree: false, order: 2 },
          { id: "les-cma-final1-3", title: "Working Capital Strategy", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cma-final1-4", title: "Dividend Policy", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cma-final1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cma-final2",
        title: "Corporate Finance",
        order: 2,
        lessons: [
          { id: "les-cma-final2-1", title: "Corporate Valuation", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cma-final2-2", title: "Mergers & Acquisitions", type: "video", duration: 60, content: "", isFree: false, order: 2 },
          { id: "les-cma-final2-3", title: "Corporate Restructuring", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cma-final2-4", title: "Project Finance", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cma-final2-5", title: "Case Studies", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cma-final3",
        title: "Strategic Cost Management",
        order: 3,
        lessons: [
          { id: "les-cma-final3-1", title: "ABC Costing", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cma-final3-2", title: "Target Costing", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cma-final3-3", title: "Life Cycle Costing", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cma-final3-4", title: "Kaizen Costing", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cma-final3-5", title: "Cost Optimization", type: "video", duration: 55, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cma-final4",
        title: "Financial Analysis",
        order: 4,
        lessons: [
          { id: "les-cma-final4-1", title: "Advanced Ratio Analysis", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cma-final4-2", title: "Cash Flow Analysis", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cma-final4-3", title: "Risk Analysis", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cma-final4-4", title: "Decision Making", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-cma-final4-5", title: "Final Mock Test", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Become a qualified CMA",
      "Strategic financial skills",
      "Corporate finance expertise",
      "Cost management mastery"
    ],
    requirements: [
      "CMA Intermediate cleared",
      "Advanced knowledge required",
      "Professional dedication"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "cfa_level1",
    slug: "cfa-level1",
    title: "CFA Level 1 Course",
    tagline: "Chartered Financial Analyst Level 1",
    description: "Comprehensive CFA Level 1 preparation covering Financial Analysis, Ethics, Quantitative Methods, and Portfolio Management.",
    longDescription: `Start your journey to become a Chartered Financial Analyst with our detailed CFA Level 1 course. Covering the fundamental knowledge required for the CFA exam.

What you'll master:
- Ethical & Professional Standards
- Quantitative Methods
- Financial Statement Analysis
- Economics & Portfolio Management`,
    thumbnail: "/assets/courses/cfa-level1.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 899,
    originalPrice: 24999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "CFA",
    vertical: "professional",
    targetAudience: ["graduates", "cfa-aspirants", "finance-professionals"],
    tags: ["cfa", "chartered-financial-analyst", "cfa-institute", "level1", "financial-analysis", "portfolio-management", "Professional / Career Skills", "Professional Certifications", "CFA"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 4000,
    lessonCount: 200,
    moduleCount: 16,
    rating: 4.9,
    reviewCount: 3500,
    enrollmentCount: 25000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cfa1-1",
        title: "Ethical & Professional Standards",
        order: 1,
        lessons: [
          { id: "les-cfa1-1-1", title: "Code of Ethics Overview", type: "video", duration: 50, content: "", isFree: true, order: 1 },
          { id: "les-cfa1-1-2", title: "Standards of Professional Conduct", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cfa1-1-3", title: "GIPS Standards", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cfa1-1-4", title: "Ethics Case Studies", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-cfa1-1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cfa1-2",
        title: "Quantitative Methods",
        order: 2,
        lessons: [
          { id: "les-cfa1-2-1", title: "Time Value of Money", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cfa1-2-2", title: "Statistical Concepts", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cfa1-2-3", title: "Probability Distributions", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cfa1-2-4", title: "Hypothesis Testing", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cfa1-2-5", title: "Regression Analysis", type: "video", duration: 55, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cfa1-3",
        title: "Financial Statement Analysis",
        order: 3,
        lessons: [
          { id: "les-cfa1-3-1", title: "Financial Statement Overview", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cfa1-3-2", title: "Revenue Recognition", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cfa1-3-3", title: "Asset Analysis", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cfa1-3-4", title: "Liability Analysis", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-cfa1-3-5", title: "Ratio Analysis", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cfa1-4",
        title: "Economics & Portfolio",
        order: 4,
        lessons: [
          { id: "les-cfa1-4-1", title: "Microeconomics", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cfa1-4-2", title: "Macroeconomics", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cfa1-4-3", title: "Portfolio Management Basics", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cfa1-4-4", title: "Capital Market Theory", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-cfa1-4-5", title: "Full Mock Exam", type: "assignment", duration: 180, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear CFA Level 1 exam",
      "Master financial analysis",
      "Understand ethical standards",
      "Portfolio management foundation"
    ],
    requirements: [
      "Bachelor's degree or final year student",
      "Basic mathematics knowledge",
      "Strong English proficiency",
      "300+ hours of study"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "cfa_level2",
    slug: "cfa-level2",
    title: "CFA Level 2 Course",
    tagline: "Intermediate Chartered Financial Analyst",
    description: "Advanced CFA Level 2 preparation covering Asset Valuation, Derivatives, Fixed Income, and Equity Analysis.",
    longDescription: `Progress to Level 2 of the CFA program with our detailed course focusing on valuation analysis and advanced financial concepts.

What you'll master:
- Equity Valuation
- Fixed Income Analysis
- Derivatives & Alternative Investments
- Financial Reporting Analysis Advanced`,
    thumbnail: "/assets/courses/cfa-level2.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 999,
    originalPrice: 29999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "CFA",
    vertical: "professional",
    targetAudience: ["cfa-level1-passed", "cfa-level2-aspirants", "investment-analysts"],
    tags: ["cfa", "chartered-financial-analyst", "cfa-institute", "level2", "equity-analysis", "fixed-income", "derivatives", "Professional / Career Skills", "Professional Certifications", "CFA"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 4500,
    lessonCount: 225,
    moduleCount: 18,
    rating: 4.9,
    reviewCount: 2800,
    enrollmentCount: 18000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cfa2-1",
        title: "Equity Valuation",
        order: 1,
        lessons: [
          { id: "les-cfa2-1-1", title: "Valuation Models Overview", type: "video", duration: 55, content: "", isFree: true, order: 1 },
          { id: "les-cfa2-1-2", title: "Discounted Cash Flow", type: "video", duration: 60, content: "", isFree: false, order: 2 },
          { id: "les-cfa2-1-3", title: "Comparable Company Analysis", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cfa2-1-4", title: "Precedent Transaction Analysis", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cfa2-1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cfa2-2",
        title: "Fixed Income",
        order: 2,
        lessons: [
          { id: "les-cfa2-2-1", title: "Bond Valuation", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cfa2-2-2", title: "Yield Curves & Term Structure", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cfa2-2-3", title: "Credit Analysis", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cfa2-2-4", title: "Mortgage-Backed Securities", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cfa2-2-5", title: "Interest Rate Derivatives", type: "video", duration: 55, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cfa2-3",
        title: "Derivatives",
        order: 3,
        lessons: [
          { id: "les-cfa2-3-1", title: "Forward Contracts", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cfa2-3-2", title: "Futures Markets", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cfa2-3-3", title: "Options Strategies", type: "video", duration: 60, content: "", isFree: false, order: 3 },
          { id: "les-cfa2-3-4", title: "Option Pricing Models", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-cfa2-3-5", title: "Swaps & Hedging", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cfa2-4",
        title: "Alternative Investments",
        order: 4,
        lessons: [
          { id: "les-cfa2-4-1", title: "Private Equity", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cfa2-4-2", title: "Real Estate Valuation", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cfa2-4-3", title: "Hedge Fund Strategies", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cfa2-4-4", title: "Commodity Markets", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-cfa2-4-5", title: "Practice Exam", type: "assignment", duration: 180, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear CFA Level 2 exam",
      "Advanced valuation skills",
      "Fixed income expertise",
      "Derivatives knowledge"
    ],
    requirements: [
      "CFA Level 1 cleared",
      "Strong financial analysis skills",
      "500+ hours of study",
      "English proficiency"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "cfa_level3",
    slug: "cfa-level3",
    title: "CFA Level 3 Course",
    tagline: "Advanced Chartered Financial Analyst",
    description: "Expert-level CFA Level 3 preparation covering Wealth Management, Portfolio Strategy, and Advanced Ethics.",
    longDescription: `Complete your CFA journey with our comprehensive Level 3 course focusing on portfolio management and wealth planning strategies.

What you'll master:
- Portfolio Management
- Wealth Planning
- Advanced Asset Allocation
- Performance Attribution`,
    thumbnail: "/assets/courses/cfa-level3.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 1199,
    originalPrice: 34999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "CFA",
    vertical: "professional",
    targetAudience: ["cfa-level2-passed", "cfa-level3-aspirants", "portfolio-managers"],
    tags: ["cfa", "chartered-financial-analyst", "cfa-institute", "level3", "portfolio-management", "wealth-planning", "asset-allocation", "Professional / Career Skills", "Professional Certifications", "CFA"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 5000,
    lessonCount: 250,
    moduleCount: 20,
    rating: 4.9,
    reviewCount: 2200,
    enrollmentCount: 15000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-cfa3-1",
        title: "Portfolio Management",
        order: 1,
        lessons: [
          { id: "les-cfa3-1-1", title: "IPS Development", type: "video", duration: 55, content: "", isFree: true, order: 1 },
          { id: "les-cfa3-1-2", title: "Risk Management Framework", type: "video", duration: 60, content: "", isFree: false, order: 2 },
          { id: "les-cfa3-1-3", title: "Strategic Asset Allocation", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cfa3-1-4", title: "Tactical Asset Allocation", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cfa3-1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cfa3-2",
        title: "Wealth Planning",
        order: 2,
        lessons: [
          { id: "les-cfa3-2-1", title: "Personal Financial Planning", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cfa3-2-2", title: "Retirement Planning", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cfa3-2-3", title: "Tax-Efficient Investing", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-cfa3-2-4", title: "Estate Planning", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cfa3-2-5", title: "Client Communication", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cfa3-3",
        title: "Advanced Economics",
        order: 3,
        lessons: [
          { id: "les-cfa3-3-1", title: "Economic Cycles", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-cfa3-3-2", title: "Global Economic Analysis", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-cfa3-3-3", title: "Currency Management", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-cfa3-3-4", title: "Emerging Markets", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-cfa3-3-5", title: "Case Studies", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-cfa3-4",
        title: "Ethics & Regulation",
        order: 4,
        lessons: [
          { id: "les-cfa3-4-1", title: "Advanced Ethics Cases", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-cfa3-4-2", title: "GIPS Compliance", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-cfa3-4-3", title: "Soft Dollars", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-cfa3-4-4", title: "Trading Ethics", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-cfa3-4-5", title: "Final Mock Exam", type: "assignment", duration: 240, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Become a CFA Charterholder",
      "Portfolio management expertise",
      "Wealth planning skills",
      "Advanced analytical abilities"
    ],
    requirements: [
      "CFA Level 2 cleared",
      "4 years qualified work experience",
      "Strong ethics understanding",
      "500+ hours of study"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "acca_level1",
    slug: "acca-level1",
    title: "ACCA Level 1 (Applied Knowledge)",
    tagline: "ACCA Applied Knowledge Level",
    description: "Complete ACCA Applied Knowledge preparation covering Business and Technology, Management Accounting, and Financial Accounting.",
    longDescription: `Begin your ACCA journey with our comprehensive Applied Knowledge level course. This is the first step towards becoming an ACCA Chartered Certified Accountant.

What you'll master:
- Business and Technology
- Management Accounting Fundamentals
- Financial Accounting Basics
- Corporate Governance`,
    thumbnail: "/assets/courses/acca-level1.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 599,
    originalPrice: 14999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "ACCA",
    vertical: "professional",
    targetAudience: ["12th-pass-students", "acca-aspirants", "accounting-students"],
    tags: ["acca", "chartered-certified-accountant", "accounting", "applied-knowledge", "business-technology", "Professional / Career Skills", "Professional Certifications", "ACCA"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 3000,
    lessonCount: 150,
    moduleCount: 12,
    rating: 4.7,
    reviewCount: 2000,
    enrollmentCount: 15000,
    isActive: true,
    isFeatured: false,
    
    modules: [
      {
        id: "mod-acca1-1",
        title: "Business and Technology",
        order: 1,
        lessons: [
          { id: "les-acca1-1-1", title: "Business Organizations", type: "video", duration: 45, content: "", isFree: true, order: 1 },
          { id: "les-acca1-1-2", title: "Accounting Functions", type: "video", duration: 40, content: "", isFree: false, order: 2 },
          { id: "les-acca1-1-3", title: "IT Systems", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-acca1-1-4", title: "Ethics in Business", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-acca1-1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca1-2",
        title: "Management Accounting",
        order: 2,
        lessons: [
          { id: "les-acca1-2-1", title: "Cost Classification", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-acca1-2-2", title: "Absorption Costing", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-acca1-2-3", title: "Marginal Costing", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-acca1-2-4", title: "Budgeting", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-acca1-2-5", title: "Variance Analysis", type: "assignment", duration: 45, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca1-3",
        title: "Financial Accounting",
        order: 3,
        lessons: [
          { id: "les-acca1-3-1", title: "Double Entry System", type: "video", duration: 45, content: "", isFree: false, order: 1 },
          { id: "les-acca1-3-2", title: " ledger & Journals", type: "video", duration: 40, content: "", isFree: false, order: 2 },
          { id: "les-acca1-3-3", title: "Trial Balance", type: "video", duration: 35, content: "", isFree: false, order: 3 },
          { id: "les-acca1-3-4", title: "Final Accounts", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-acca1-3-5", title: "Incomplete Records", type: "video", duration: 45, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca1-4",
        title: "Practice & Revision",
        order: 4,
        lessons: [
          { id: "les-acca1-4-1", title: "Practice Questions", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-acca1-4-2", title: "Mock Test 1", type: "assignment", duration: 90, content: "", isFree: false, order: 2 },
          { id: "les-acca1-4-3", title: "Mock Test 2", type: "assignment", duration: 90, content: "", isFree: false, order: 3 },
          { id: "les-acca1-4-4", title: "Exam Techniques", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-acca1-4-5", title: "Final Review", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear ACCA Applied Knowledge",
      "Understand business environment",
      "Master management accounting",
      "Financial accounting basics"
    ],
    requirements: [
      "10+2 from recognized board",
      "Basic mathematics",
      "English proficiency",
      "Regular study commitment"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "acca_level2",
    slug: "acca-level2",
    title: "ACCA Level 2 (Applied Skills)",
    tagline: "ACCA Applied Skills Level",
    description: "Advanced ACCA Applied Skills preparation covering Corporate Law, Audit, Tax, and Financial Management.",
    longDescription: `Progress to the Applied Skills level of ACCA with our comprehensive course covering essential professional accounting skills.

What you'll master:
- Corporate and Business Law
- Audit and Assurance
- Taxation
- Financial Management`,
    thumbnail: "/assets/courses/acca-level2.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 799,
    originalPrice: 19999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "ACCA",
    vertical: "professional",
    targetAudience: ["acca-applied-knowledge-passed", "acca-applied-skills-aspirants", "accountants"],
    tags: ["acca", "chartered-certified-accountant", "accounting", "applied-skills", "audit", "tax", "financial-management", "Professional / Career Skills", "Professional Certifications", "ACCA"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 4000,
    lessonCount: 200,
    moduleCount: 16,
    rating: 4.8,
    reviewCount: 1800,
    enrollmentCount: 12000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-acca2-1",
        title: "Corporate and Business Law",
        order: 1,
        lessons: [
          { id: "les-acca2-1-1", title: "Legal Systems", type: "video", duration: 45, content: "", isFree: true, order: 1 },
          { id: "les-acca2-1-2", title: "Contract Law", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-acca2-1-3", title: "Company Law", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-acca2-1-4", title: "Employment Law", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-acca2-1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca2-2",
        title: "Audit and Assurance",
        order: 2,
        lessons: [
          { id: "les-acca2-2-1", title: "Audit Framework", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-acca2-2-2", title: "Audit Planning", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-acca2-2-3", title: "Audit Evidence", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-acca2-2-4", title: "Audit Reports", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-acca2-2-5", title: "Audit Case Study", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca2-3",
        title: "Taxation",
        order: 3,
        lessons: [
          { id: "les-acca2-3-1", title: "Income Tax Overview", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-acca2-3-2", title: "Corporate Tax", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-acca2-3-3", title: "Individual Tax", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-acca2-3-4", title: "VAT and Customs", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-acca2-3-5", title: "Tax Planning", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca2-4",
        title: "Financial Management",
        order: 4,
        lessons: [
          { id: "les-acca2-4-1", title: "Financial Management Functions", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-acca2-4-2", title: "Investment Appraisal", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-acca2-4-3", title: "Working Capital Management", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-acca2-4-4", title: "Finance Sources", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-acca2-4-5", title: "Full Mock Exam", type: "assignment", duration: 180, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear ACCA Applied Skills",
      "Corporate law understanding",
      "Audit and assurance skills",
      "Taxation knowledge"
    ],
    requirements: [
      "ACCA Applied Knowledge passed",
      "Strong accounting background",
      "English proficiency",
      "Dedicated study"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "acca_level3",
    slug: "acca-level3",
    title: "ACCA Level 3 (Strategic Professional)",
    tagline: "ACCA Strategic Professional Level",
    description: "Expert-level ACCA Strategic Professional preparation covering Advanced Audit, Financial Reporting, and Business Analysis.",
    longDescription: `Complete your ACCA journey with our Strategic Professional level course covering advanced audit, reporting, and business strategies.

What you'll master:
- Advanced Financial Reporting
- Advanced Audit and Assurance
- Strategic Business Leader
- Advanced Performance Management`,
    thumbnail: "/assets/courses/acca-level3.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 999,
    originalPrice: 29999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "ACCA",
    vertical: "professional",
    targetAudience: ["acca-applied-skills-passed", "acca-strategic-aspirants", "finance-managers"],
    tags: ["acca", "chartered-certified-accountant", "accounting", "strategic-professional", "advanced-audit", "financial-reporting", "Professional / Career Skills", "Professional Certifications", "ACCA"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 5000,
    lessonCount: 250,
    moduleCount: 20,
    rating: 4.9,
    reviewCount: 1500,
    enrollmentCount: 10000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-acca3-1",
        title: "Advanced Financial Reporting",
        order: 1,
        lessons: [
          { id: "les-acca3-1-1", title: "IFRS Advanced", type: "video", duration: 55, content: "", isFree: true, order: 1 },
          { id: "les-acca3-1-2", title: "Group Accounting Complex", type: "video", duration: 60, content: "", isFree: false, order: 2 },
          { id: "les-acca3-1-3", title: "Financial Instruments", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-acca3-1-4", title: "Impairment Testing", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-acca3-1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca3-2",
        title: "Advanced Audit and Assurance",
        order: 2,
        lessons: [
          { id: "les-acca3-2-1", title: "Audit Risk Assessment", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-acca3-2-2", title: "Group Audits", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-acca3-2-3", title: "Forensic Auditing", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-acca3-2-4", title: "Professional Ethics", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-acca3-2-5", title: "Audit Case Study", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca3-3",
        title: "Strategic Business Leader",
        order: 3,
        lessons: [
          { id: "les-acca3-3-1", title: "Strategic Analysis", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-acca3-3-2", title: "Leadership and Management", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-acca3-3-3", title: "Governance and Risk", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-acca3-3-4", title: "Technology and Data", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-acca3-3-5", title: "Business Simulation", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-acca3-4",
        title: "Advanced Performance Management",
        order: 4,
        lessons: [
          { id: "les-acca3-4-1", title: "Strategic Performance Management", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-acca3-4-2", title: "Performance Measurement", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-acca3-4-3", title: "Variance Analysis Advanced", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-acca3-4-4", title: "Decision Making", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-acca3-4-5", title: "Final Mock Exam", type: "assignment", duration: 240, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Complete ACCA qualification",
      "Advanced financial reporting",
      "Audit expertise",
      "Strategic leadership skills"
    ],
    requirements: [
      "ACCA Applied Skills passed",
      "3 years relevant experience",
      "Strong analytical skills",
      "Professional commitment"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "frm_part1",
    slug: "frm-part1",
    title: "FRM Part 1 Course",
    tagline: "Financial Risk Manager Part 1",
    description: "Comprehensive FRM Part 1 preparation covering Financial Risk Foundations, Quantitative Analysis, and Market Risk.",
    longDescription: `Begin your journey to become a Financial Risk Manager with our detailed FRM Part 1 course. Covering foundational risk management concepts.

What you'll master:
- Foundations of Risk Management
- Quantitative Analysis
- Financial Markets and Products
- Value at Risk Methods`,
    thumbnail: "/assets/courses/frm-part1.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 799,
    originalPrice: 19999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "FRM",
    vertical: "professional",
    targetAudience: ["graduates", "frm-aspirants", "risk-analysts"],
    tags: ["frm", "financial-risk-manager", "garp", "risk-management", "quantitative-analysis", "market-risk", "Professional / Career Skills", "Professional Certifications", "FRM"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 3500,
    lessonCount: 175,
    moduleCount: 14,
    rating: 4.8,
    reviewCount: 2500,
    enrollmentCount: 18000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-frm1-1",
        title: "Foundations of Risk Management",
        order: 1,
        lessons: [
          { id: "les-frm1-1-1", title: "Risk Management Overview", type: "video", duration: 50, content: "", isFree: true, order: 1 },
          { id: "les-frm1-1-2", title: "Corporate Governance", type: "video", duration: 45, content: "", isFree: false, order: 2 },
          { id: "les-frm1-1-3", title: "Risk Culture", type: "video", duration: 40, content: "", isFree: false, order: 3 },
          { id: "les-frm1-1-4", title: "Model Risk", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-frm1-1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-frm1-2",
        title: "Quantitative Analysis",
        order: 2,
        lessons: [
          { id: "les-frm1-2-1", title: "Probability Theory", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-frm1-2-2", title: "Statistical Methods", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-frm1-2-3", title: "Regression Analysis", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-frm1-2-4", title: "Monte Carlo Simulation", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-frm1-2-5", title: "Extreme Value Theory", type: "video", duration: 50, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-frm1-3",
        title: "Financial Markets",
        order: 3,
        lessons: [
          { id: "les-frm1-3-1", title: "Bonds and Fixed Income", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-frm1-3-2", title: "Equities and Derivatives", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-frm1-3-3", title: "Foreign Exchange", type: "video", duration: 45, content: "", isFree: false, order: 3 },
          { id: "les-frm1-3-4", title: "Commodities", type: "video", duration: 40, content: "", isFree: false, order: 4 },
          { id: "les-frm1-3-5", title: "Structured Products", type: "video", duration: 50, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-frm1-4",
        title: "Value at Risk",
        order: 4,
        lessons: [
          { id: "les-frm1-4-1", title: "VaR Methods", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-frm1-4-2", title: "Backtesting VaR", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-frm1-4-3", title: "Stress Testing", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-frm1-4-4", title: "Expected Shortfall", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-frm1-4-5", title: "Full Mock Exam", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear FRM Part 1 exam",
      "Foundational risk knowledge",
      "Quantitative skills",
      "Market risk understanding"
    ],
    requirements: [
      "2 years work experience waiver available",
      "Strong mathematics",
      "English proficiency",
      "200+ hours of study"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "frm_part2",
    slug: "frm-part2",
    title: "FRM Part 2 Course",
    tagline: "Financial Risk Manager Part 2",
    description: "Advanced FRM Part 2 preparation covering Market Risk, Credit Risk, Operational Risk, and Integrated Risk Management.",
    longDescription: `Complete your FRM journey with our detailed Part 2 course covering advanced risk management topics and real-world applications.

What you'll master:
- Market Risk Management
- Credit Risk Management
- Operational Risk Management
- Current Issues in Risk Management`,
    thumbnail: "/assets/courses/frm-part2.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 999,
    originalPrice: 24999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "FRM",
    vertical: "professional",
    targetAudience: ["frm-part1-passed", "frm-part2-aspirants", "risk-managers"],
    tags: ["frm", "financial-risk-manager", "garp", "risk-management", "credit-risk", "operational-risk", "Professional / Career Skills", "Professional Certifications", "FRM"],
    
    difficulty: "advanced",
    language: "Hindi-English",
    totalDuration: 4500,
    lessonCount: 225,
    moduleCount: 18,
    rating: 4.9,
    reviewCount: 2000,
    enrollmentCount: 14000,
    isActive: true,
    isFeatured: true,
    
    modules: [
      {
        id: "mod-frm2-1",
        title: "Market Risk",
        order: 1,
        lessons: [
          { id: "les-frm2-1-1", title: "VaR and Volatility", type: "video", duration: 55, content: "", isFree: true, order: 1 },
          { id: "les-frm2-1-2", title: "Interest Rate Risk", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-frm2-1-3", title: "Option Pricing Models", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-frm2-1-4", title: "Exotic Options", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-frm2-1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-frm2-2",
        title: "Credit Risk",
        order: 2,
        lessons: [
          { id: "les-frm2-2-1", title: "Credit Risk Modeling", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-frm2-2-2", title: "Default Probability", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-frm2-2-3", title: "Credit Derivatives", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-frm2-2-4", title: "Counterparty Risk", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-frm2-2-5", title: "CVA and DVA", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-frm2-3",
        title: "Operational Risk",
        order: 3,
        lessons: [
          { id: "les-frm2-3-1", title: "Operational Risk Framework", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-frm2-3-2", title: "Basel Accords", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-frm2-3-3", title: "Model Validation", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-frm2-3-4", title: "Liquidity Risk", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-frm2-3-5", title: "Case Studies", type: "assignment", duration: 90, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-frm2-4",
        title: "Current Issues",
        order: 4,
        lessons: [
          { id: "les-frm2-4-1", title: "FinTech Risk", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-frm2-4-2", title: "Climate Risk", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-frm2-4-3", title: "Cyber Security Risk", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-frm2-4-4", title: "Regulatory Changes", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-frm2-4-5", title: "Final Mock Exam", type: "assignment", duration: 180, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[1],
    
    outcomes: [
      "Clear FRM Part 2 exam",
      "Become FRM Certified",
      "Advanced risk management",
      "Career advancement"
    ],
    requirements: [
      "FRM Part 1 cleared",
      "2 years work experience",
      "Advanced quantitative skills",
      "300+ hours of study"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
  },

  {
    id: "course-actuarial-science",
    slug: "actuarial-science",
    title: "Actuarial Science Foundation",
    tagline: "Foundation to Actuarial Profession",
    description: "Complete Actuarial Science preparation covering Mathematics, Statistics, Economics, and Financial Mathematics.",
    longDescription: `Begin your journey to become an Actuary with our comprehensive foundation course covering essential mathematical and statistical concepts.

What you'll master:
- Mathematical Methods
- Statistical Analysis
- Economic Principles
- Financial Mathematics`,
    thumbnail: "/assets/courses/actuarial.svg",
    previewVideo: "https://www.youtube.com/embed/UxTPtQ8c80c",
    price: 699,
    originalPrice: 17999,
    currency: "INR",
    
    category: "Professional Certifications",
    subcategory: "Actuarial Science",
    vertical: "professional",
    targetAudience: ["12th-pass-students", "actuarial-aspirants", "mathematics-students"],
    tags: ["actuarial", "actuary", "statistics", "mathematics", "financial-mathematics", "risk-analysis", "Professional / Career Skills", "Professional Certifications", "Actuarial Science"],
    
    difficulty: "intermediate",
    language: "Hindi-English",
    totalDuration: 3500,
    lessonCount: 175,
    moduleCount: 14,
    rating: 4.8,
    reviewCount: 1500,
    enrollmentCount: 10000,
    isActive: true,
    isFeatured: false,
    
    modules: [
      {
        id: "mod-act-1",
        title: "Mathematical Methods",
        order: 1,
        lessons: [
          { id: "les-act-1-1", title: "Calculus", type: "video", duration: 55, content: "", isFree: true, order: 1 },
          { id: "les-act-1-2", title: "Linear Algebra", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-act-1-3", title: "Differential Equations", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-act-1-4", title: "Numerical Methods", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-act-1-5", title: "Module Assessment", type: "quiz", duration: 30, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-act-2",
        title: "Statistical Analysis",
        order: 2,
        lessons: [
          { id: "les-act-2-1", title: "Probability Theory", type: "video", duration: 55, content: "", isFree: false, order: 1 },
          { id: "les-act-2-2", title: "Distributions", type: "video", duration: 50, content: "", isFree: false, order: 2 },
          { id: "les-act-2-3", title: "Hypothesis Testing", type: "video", duration: 55, content: "", isFree: false, order: 3 },
          { id: "les-act-2-4", title: "Regression Analysis", type: "video", duration: 50, content: "", isFree: false, order: 4 },
          { id: "les-act-2-5", title: "Statistical Modeling", type: "assignment", duration: 60, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-act-3",
        title: "Economics",
        order: 3,
        lessons: [
          { id: "les-act-3-1", title: "Microeconomics", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-act-3-2", title: "Macroeconomics", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-act-3-3", title: "Economic Indicators", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-act-3-4", title: "Market Dynamics", type: "video", duration: 45, content: "", isFree: false, order: 4 },
          { id: "les-act-3-5", title: "Economic Analysis", type: "video", duration: 50, content: "", isFree: false, order: 5 }
        ]
      },
      {
        id: "mod-act-4",
        title: "Financial Mathematics",
        order: 4,
        lessons: [
          { id: "les-act-4-1", title: "Time Value of Money", type: "video", duration: 50, content: "", isFree: false, order: 1 },
          { id: "les-act-4-2", title: "Annuities and Sinking Funds", type: "video", duration: 55, content: "", isFree: false, order: 2 },
          { id: "les-act-4-3", title: "Amortization Schedules", type: "video", duration: 50, content: "", isFree: false, order: 3 },
          { id: "les-act-4-4", title: "Bond Valuation", type: "video", duration: 55, content: "", isFree: false, order: 4 },
          { id: "les-act-4-5", title: "Full Mock Exam", type: "assignment", duration: 120, content: "", isFree: false, order: 5 }
        ]
      }
    ],
    
    instructor: instructors[0],
    
    outcomes: [
      "Clear initial actuarial exams",
      "Strong mathematical foundation",
      "Statistical analysis skills",
      "Financial mathematics knowledge"
    ],
    requirements: [
      "10+2 with mathematics",
      "Strong analytical skills",
      "Passion for numbers",
      "Regular practice required"
    ],
    
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01"
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
