'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { courses } from '@/lib/course-data';
import { ProgressProvider, useProgress } from '@/components/confusion/ProgressContext';
import { ProgressBar, LessonProgressBadge } from '@/components/confusion/ProgressBar';
import { CertificateDisplay, CertificateBadge } from '@/components/confusion/Certificate';

// Collect all lesson IDs from modules
function getAllLessonIds(course: any): string[] {
  const lessonIds: string[] = [];
  course.modules?.forEach((module: any) => {
    module.lessons?.forEach((lesson: any) => {
      lessonIds.push(lesson.id);
    });
  });
  return lessonIds;
}

function CourseContent() {
  const params = useParams();
  const courseId = params.id as string;
  const { progress, markLessonComplete, isLessonComplete, getCourseProgress, isCourseComplete } = useProgress();
  
  const course = courses.find(c => c.id === courseId);
  
  const [showCertificate, setShowCertificate] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    if (course) {
      const allLessonIds = getAllLessonIds(course);
      const completed = allLessonIds.filter(id => isLessonComplete(courseId, id));
      setCompletedLessons(completed);
    }
  }, [course, courseId, progress]);

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Course Not Found</h1>
          <p className="text-slate-600 mb-6">The course you are looking for does not exist.</p>
          <Link href="/confusion-removers" className="text-indigo-600 hover:text-indigo-700">
            ← Back to Confusion Removers
          </Link>
        </div>
      </div>
    );
  }

  const allLessonIds = getAllLessonIds(course);
  const totalLessons = allLessonIds.length;
  const { percentage } = getCourseProgress(courseId, totalLessons);
  const courseComplete = isCourseComplete(courseId, totalLessons);

  const certificateData = {
    userName: 'Valued Learner',
    courseName: course.title,
    completionDate: new Date().toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    certificateId: `CR-${courseId.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-indigo-600">INR99</span>
              <span className="text-xl font-semibold text-slate-800">Academy</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/courses" className="text-slate-600 hover:text-indigo-600 transition-colors">Courses</Link>
              <Link href="/confusion-removers" className="text-indigo-600 font-medium">Confusion Removers</Link>
            </div>
            <Link href="/auth/login" className="text-slate-600 hover:text-indigo-600 transition-colors">Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-violet-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/confusion-removers" className="inline-flex items-center text-indigo-200 hover:text-white mb-6 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Confusion Removers
          </Link>
          
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <div className="inline-flex items-center bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                <span className="mr-1">💡</span>
                Confusion Remover
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{course.title}</h1>
              <p className="text-xl text-indigo-100 mb-6">{course.tagline}</p>
              <p className="text-indigo-200 mb-6">{course.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-indigo-200">
                <span className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.totalDuration} minutes
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {totalLessons} lessons
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {course.enrollmentCount} enrolled
                </span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
              
              <div className="mb-4">
                <ProgressBar percentage={percentage} />
                <p className="text-sm text-slate-500 mt-1 text-center">
                  {completedLessons.length} of {totalLessons} lessons completed
                </p>
              </div>

              {courseComplete ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center mb-2">
                    <CertificateBadge onClick={() => setShowCertificate(true)} />
                  </div>
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 font-semibold rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg"
                  >
                    View Certificate
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-amber-600">₹{course.price || 99}</span>
                  <span className="text-slate-400 line-through text-lg">₹{course.originalPrice || 499}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Content</h2>
          
          <div className="space-y-6">
            {course.modules?.map((module, moduleIndex) => (
              <div key={module.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900">
                    Module {moduleIndex + 1}: {module.title}
                  </h3>
                </div>
                
                <div className="divide-y divide-slate-100">
                  {module.lessons?.map((lesson, lessonIndex) => {
                    const isComplete = isLessonComplete(courseId, lesson.id);
                    const isLast = moduleIndex === course.modules.length - 1 && lessonIndex === module.lessons!.length - 1;
                    const allPreviousComplete = module.lessons!.slice(0, lessonIndex).every(l => isLessonComplete(courseId, l.id));
                    const isAccessible = lessonIndex === 0 || allPreviousComplete || isComplete;
                    
                    return (
                      <div 
                        key={lesson.id}
                        className={`px-6 py-4 flex items-center justify-between transition-colors ${
                          isComplete ? 'bg-green-50/50' : isAccessible ? 'hover:bg-slate-50' : 'opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <LessonProgressBadge isComplete={isComplete} />
                          <div>
                            <h4 className={`font-medium ${isComplete ? 'text-green-800' : 'text-slate-900'}`}>
                              {lesson.title}
                            </h4>
                            <p className="text-sm text-slate-500">
                              {lesson.duration} min • {lesson.isFree ? 'Free' : 'Premium'}
                            </p>
                          </div>
                        </div>
                        
                        {isAccessible && (
                          <button
                            onClick={() => {
                              if (isComplete) {
                                markLessonComplete(courseId, lesson.id);
                              }
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isComplete 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                            }`}
                          >
                            {isComplete ? 'Completed ✓' : 'Mark Complete'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">What You'll Learn</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {course.outcomes?.map((outcome, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-slate-700">{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2026 INR99 Academy. All rights reserved.</p>
        </div>
      </footer>

      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateDisplay
          data={certificateData}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
}

export default function CoursePage() {
  return (
    <ProgressProvider>
      <CourseContent />
    </ProgressProvider>
  );
}
