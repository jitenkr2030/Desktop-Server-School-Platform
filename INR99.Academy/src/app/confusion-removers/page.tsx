import { courses } from '@/lib/course-data';
import Link from 'next/link';
import Image from 'next/image';

// Filter confusion remover courses
const confusionCourses = courses.filter(
  course => course.category === 'confusion-remover' || course.category === 'community-understanding'
);

const lifeEssentialsCourses = confusionCourses.filter(
  course => course.category === 'confusion-remover'
);

const communityCourses = confusionCourses.filter(
  course => course.category === 'community-understanding'
);

export default function ConfusionRemoversPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Placeholder - In production, wrap with Navbar component */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-indigo-600">INR99</span>
              <span className="text-xl font-semibold text-slate-800">Academy</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/courses" className="text-slate-600 hover:text-indigo-600 transition-colors">Courses</Link>
              <Link href="/learning-paths" className="text-slate-600 hover:text-indigo-600 transition-colors">Learning Paths</Link>
              <Link href="/confusion-removers" className="text-indigo-600 font-medium">Confusion Removers</Link>
              <Link href="/about" className="text-slate-600 hover:text-indigo-600 transition-colors">About</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-slate-600 hover:text-indigo-600 transition-colors">Login</Link>
              <Link href="/auth/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="mr-2">💡</span>
              Clarity in 60 Minutes or Less
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Clear the Fog.<br />
              <span className="text-amber-300">Master the Basics.</span>
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-10">
              Bite-sized courses designed to untangle complex topics instantly. 
              No fluff, no jargon—just clear, practical understanding for everyday life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#courses" className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-amber-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Browse Confusion Removers
              </a>
              <a href="#how-it-works" className="text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all">
                How It Works
              </a>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-8 text-indigo-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">9</div>
                <div className="text-sm">Courses</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div class className="text-3xl font-bold text-white">108</div>
                <div className="text-sm">Lessons</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">₹99</div>
                <div className="text-sm">Per Course</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      {/* Value Proposition Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Confusion Removers?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Traditional courses are too long, too expensive, and too confusing. 
              We built Confusion Removers specifically for people who need answers now.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Laser Focused</h3>
              <p className="text-slate-600">
                No fluff, no filler content. Each course answers one specific question 
                with practical, actionable insights you can use immediately.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Access</h3>
              <p className="text-slate-600">
                Start learning immediately. Finish in one sitting. 
                Get clarity fast without committing to weeks or months of study.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Unbeatable Value</h3>
              <p className="text-slate-600">
                Premium education at the price of a cup of coffee. 
                Clear understanding shouldn't cost your entire savings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Life Essentials Section */}
      <section id="courses" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span className="mr-1">💡</span>
                Life Essentials
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Essential Skills for Daily Life
              </h2>
              <p className="text-slate-600 mt-2">
                Master the tools and concepts you encounter every day
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lifeEssentialsCourses.map((course) => (
              <Link 
                key={course.id}
                href={`/confusion/course/${course.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 transform hover:-translate-y-1"
              >
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block bg-white/90 backdrop-blur-sm text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                      {course.totalDuration} min course
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-amber-600 font-bold">
                      <span className="text-lg">₹</span>
                      <span className="text-2xl">{course.price || 99}</span>
                    </div>
                    <span className="text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition-transform inline-flex items-center">
                      Start Learning →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community Understanding Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span className="mr-1">👥</span>
                Community Understanding
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Understand How Communities Work
              </h2>
              <p className="text-slate-600 mt-2">
                Navigate local systems, NGOs, and community programs with confidence
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityCourses.map((course) => (
              <Link 
                key={course.id}
                href={`/confusion/course/${course.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 transform hover:-translate-y-1"
              >
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block bg-white/90 backdrop-blur-sm text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                      {course.totalDuration} min course
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-amber-600 font-bold">
                      <span className="text-lg">₹</span>
                      <span className="text-2xl">{course.price || 99}</span>
                    </div>
                    <span className="text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition-transform inline-flex items-center">
                      Start Learning →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Getting clarity is simple. No complicated signup, no long commitment.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Choose Your Topic</h3>
              <p className="text-slate-400 text-sm">
                Browse our collection and pick the confusion you want to clear
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Enroll Instantly</h3>
              <p className="text-slate-400 text-sm">
                One-click enrollment. No lengthy forms or payment processing
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Learn in 60 Minutes</h3>
              <p className="text-slate-400 text-sm">
                Watch short, focused lessons that get straight to the point
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Gain Clarity</h3>
              <p className="text-slate-400 text-sm">
                Apply what you learned and clear your confusion forever
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-violet-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Clear Your Confusion?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of learners who have gained clarity through our focused, affordable courses.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/auth/register"
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-amber-50 transition-all shadow-lg hover:shadow-xl"
            >
              Start Learning for Free
            </Link>
            <Link 
              href="/courses"
              className="text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Browse All Courses
            </Link>
          </div>
          <p className="mt-6 text-indigo-200 text-sm">
            No credit card required • Access free lessons immediately
          </p>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl font-bold text-indigo-400">INR99</span>
                <span className="text-xl font-semibold text-white">Academy</span>
              </div>
              <p className="text-sm">
                Making quality education accessible and affordable for everyone in India.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Courses</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/courses" className="hover:text-white transition-colors">All Courses</Link></li>
                <li><Link href="/learning-paths" className="hover:text-white transition-colors">Learning Paths</Link></li>
                <li><Link href="/confusion-removers" className="hover:text-white transition-colors">Confusion Removers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm">
            <p>© 2026 INR99 Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
