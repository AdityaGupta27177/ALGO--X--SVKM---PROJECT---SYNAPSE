import { useState, useEffect } from 'react';

export interface CourseProgressState {
  completedLessons: string[];
  xp: number;
  streak: number;
  lastActiveDate: string;
  certificateGenerated: boolean;
}

const DEFAULT_STATE: CourseProgressState = {
  completedLessons: [],
  xp: 0,
  streak: 0,
  lastActiveDate: '',
  certificateGenerated: false,
};

export function useCourseProgress() {
  const [progress, setProgress] = useState<CourseProgressState>(() => {
    const saved = localStorage.getItem('cppCourseProgress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_STATE;
      }
    }
    return DEFAULT_STATE;
  });

  // Save to localStorage whenever progress changes
  useEffect(() => {
    localStorage.setItem('cppCourseProgress', JSON.stringify(progress));
  }, [progress]);

  // Handle streak logic on initial load or custom hook call
  useEffect(() => {
    const today = new Date().toDateString();
    if (progress.lastActiveDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      setProgress(prev => {
        let newStreak = prev.streak;
        if (prev.lastActiveDate === yesterday.toDateString()) {
          newStreak += 1;
        } else if (prev.lastActiveDate !== '') {
          newStreak = 1; // reset streak if missed a day, unless it's their very first day
        } else {
          newStreak = 1;
        }

        return {
          ...prev,
          streak: newStreak,
          lastActiveDate: today,
        };
      });
    }
  }, []);

  const markLessonComplete = (lessonId: string, xpReward: number = 100) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        xp: prev.xp + xpReward,
      };
    });
  };

  const unlockCertificate = () => {
    setProgress(prev => ({
      ...prev,
      certificateGenerated: true,
      xp: prev.xp + 500, // Bonus XP for finishing
    }));
  };

  const isLessonComplete = (lessonId: string) => progress.completedLessons.includes(lessonId);

  return {
    progress,
    markLessonComplete,
    unlockCertificate,
    isLessonComplete,
  };
}
