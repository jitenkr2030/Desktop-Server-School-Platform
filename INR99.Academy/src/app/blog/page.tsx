import { NewNavigation } from "@/components/new-navigation"

export default function BlogPage() {
  const articles = [
    {
      id: 1,
      title: "Getting Started with Web Development in 2025",
      excerpt: "A comprehensive guide for beginners looking to start their journey in web development.",
      author: "Dr. Sarah Johnson",
      date: "December 20, 2025",
      category: "Web Development",
      readTime: "8 min read"
    },
    {
      id: 2,
      title: "The Future of AI in Education",
      excerpt: "How artificial intelligence is transforming the way we learn and teach.",
      author: "Prof. Michael Chen",
      date: "December 18, 2025",
      category: "AI & Machine Learning",
      readTime: "6 min read"
    },
    {
      id: 3,
      title: "Mastering Python: Tips from Industry Experts",
      excerpt: "Proven strategies and best practices for learning Python efficiently.",
      author: "Emily Rodriguez",
      date: "December 15, 2025",
      category: "Programming",
      readTime: "5 min read"
    },
    {
      id: 4,
      title: "Building a Successful Career in Tech",
      excerpt: "Essential skills and strategies for landing your dream job in technology.",
      author: "James Wilson",
      date: "December 12, 2025",
      category: "Career Advice",
      readTime: "7 min read"
    },
    {
      id: 5,
      title: "Understanding Cloud Computing Fundamentals",
      excerpt: "A beginner-friendly introduction to cloud services and infrastructure.",
      author: "Dr. Lisa Park",
      date: "December 10, 2025",
      category: "Cloud Computing",
      readTime: "6 min read"
    },
    {
      id: 6,
      title: "Mobile App Development Trends to Watch",
      excerpt: "The latest trends and technologies shaping the future of mobile development.",
      author: "Robert Martinez",
      date: "December 8, 2025",
      category: "Mobile Development",
      readTime: "5 min read"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Insights, tips, and stories from our community of learners and educators.
          </p>
        </div>
      </div>

      {/* Featured Article */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="md:flex">
            <div className="md:w-1/2 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center p-12">
              <span className="text-8xl">📚</span>
            </div>
            <div className="md:w-1/2 p-8">
              <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
                Featured
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{articles[0].title}</h2>
              <p className="text-gray-600 mb-4">{articles[0].excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{articles[0].author}</span>
                <span>•</span>
                <span>{articles[0].date}</span>
                <span>•</span>
                <span>{articles[0].readTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(1).map((article) => (
            <div key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                <span className="text-5xl">📝</span>
              </div>
              <div className="p-6">
                <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  {article.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{article.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{article.author}</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
