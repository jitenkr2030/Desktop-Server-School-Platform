'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ProgressData {
  [courseId: string]: {
    completedLessons: string[];
    startedAt: string;
    lastAccess: string;
  };
}

interface ProgressContextType {
  progress: ProgressData;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  markLessonIncomplete: (courseId: string, lessonId: string) => void;
  isLessonComplete: (courseId: string, lessonId: string) => boolean;
  getCourseProgress: (courseId: string, totalLessons: number) => { completed: number; percentage: number };
  resetProgress: (courseId: string) => void;
  isCourseComplete: (courseId: string, totalLessons: number) => boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const STORAGE_KEY = 'inr99_confusion_progress';

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressData>({});

  // Load progress from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setProgress(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse progress data:', e);
        }
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(progress).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress]);

  const markLessonComplete = (courseId: string, lessonId: string) => {
    setProgress(prev => {
      const courseData = prev[courseId] || { completedLessons: [], startedAt: new Date().toISOString(), lastAccess: new Date().toISOString() };
      if (!courseData.completedLessons.includes(lessonId)) {
        return {
          ...prev,
          [courseId]: {
            ...courseData,
            completedLessons: [...courseData.completedLessons, lessonId],
            lastAccess: new Date().toISOString()
          }
        };
      }
      return prev;
    });
  };

  const markLessonIncomplete = (courseId: string, lessonId: string) => {
    setProgress(prev => {
      const courseData = prev[courseId];
      if (courseData && courseData.completedLessons.includes(lessonId)) {
        return {
          ...prev,
          [courseId]: {
            ...courseData,
            completedLessons: courseData.completedLessons.filter(id => id !== lessonId),
            lastAccess: new Date().toISOString()
          }
        };
      }
      return prev;
    });
  };

  const isLessonComplete = (courseId: string, lessonId: string): boolean => {
    const courseData = progress[courseId];
    return courseData?.completedLessons.includes(lessonId) || false;
  };

  const getCourseProgress = (courseId: string, totalLessons: number) => {
    const courseData = progress[courseId];
    const completed = courseData?.completedLessons.length || 0;
    const percentage = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
    return { completed, percentage };
  };

  const isCourseComplete = (courseId: string, totalLessons: number): boolean => {
    const { percentage } = getCourseProgress(courseId, totalLessons);
    return percentage === 100;
  };

  const resetProgress = (courseId: string) => {
    setProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[courseId];
      return newProgress;
    });
  };

  return (
    <ProgressContext.Provider value={{
      progress,
      markLessonComplete,
      markLessonIncomplete,
      isLessonComplete,
      getCourseProgress,
      resetProgress,
      isCourseComplete
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
