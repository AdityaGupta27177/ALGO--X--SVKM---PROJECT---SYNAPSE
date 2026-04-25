import { Link } from "react-router-dom";
import Spline from '@splinetool/react-spline';
import { motion } from "framer-motion";
import { Check, Lock, Play, BookOpen, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { cppLessons } from "@/data/cppCourse";
import { useCourseProgress } from "@/lib/useCourseProgress";

export default function Roadmap() {
  const { progress } = useCourseProgress();
  const { completedLessons } = progress;

  const isLessonUnlocked = (index: number) => {
    if (index === 0) return true;
    return completedLessons.includes(cppLessons[index - 1].id);
  };

  const allLessonsCompleted = cppLessons.every((l) => completedLessons.includes(l.id));

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a] text-foreground">
      {/* 3D Spline Background - Grid of Cubes (Specific to this page) */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-auto flex items-center justify-center overflow-hidden opacity-40">
        <div className="w-full h-full scale-[1.2] lg:scale-[1.1] origin-center">
          <Spline className="w-full h-full" scene="https://prod.spline.design/PpLxAgGdfM8nQzv2/scene.splinecode" />
        </div>
      </div>

      <div className="relative z-10 pointer-events-none min-h-screen flex flex-col">
        <div className="pointer-events-auto">
          <Navbar />
        </div>
        
        <main className="mx-auto max-w-5xl px-4 py-24 flex-1 relative">
          {/* Header Section */}
          <div className="mb-24 text-center pointer-events-auto">
            <h1 className="text-6xl font-black text-white mb-6 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              C++ <span className="text-primary">CORE</span> ROADMAP
            </h1>
            <p className="text-zinc-400 text-lg max-w-md mx-auto">
              Follow the synchronized path to master C++ systems and earn your certification.
            </p>
            
            <div className="mt-10 flex justify-center gap-4">
              <div className="glass-card px-6 py-3 border-primary/20 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-primary font-black tracking-widest uppercase text-sm">{progress.xp} XP EARNED</span>
              </div>
              <div className="glass-card px-6 py-3 border-orange-500/20 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-orange-400 font-black tracking-widest uppercase text-sm">{progress.streak} DAY STREAK</span>
              </div>
            </div>
          </div>

          {/* Roadmap Visualization */}
          <div className="relative flex flex-col items-center gap-32">
            {/* Background Path Trail (Neon Glow) */}
            <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/40 via-accent/40 to-yellow-500/40 blur-sm pointer-events-none" />

            {cppLessons.map((lesson, index) => {
              const unlocked = isLessonUnlocked(index);
              const completed = completedLessons.includes(lesson.id);

              return (
                <div key={lesson.id} className="relative w-full flex justify-center items-center">
                  {/* Path Connection Line */}
                  {index < cppLessons.length - 1 && (
                    <div className="absolute top-20 w-1 h-32 bg-zinc-900 overflow-hidden">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: completed ? "100%" : "0%" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="w-full bg-primary shadow-[0_0_20px_rgba(var(--primary),0.8)]"
                      />
                    </div>
                  )}

                  <div className="relative flex items-center w-full max-w-4xl">
                    {/* Node Orb */}
                    <div className="flex-1 flex justify-center pointer-events-auto">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={unlocked ? { scale: 1.15 } : {}}
                        className={`relative z-10 flex items-center justify-center w-24 h-24 rounded-full border-2 transition-all duration-500
                          ${completed ? 'border-primary bg-primary/20 text-primary shadow-[0_0_50px_rgba(var(--primary),0.6)]' : 
                            unlocked ? 'border-accent bg-accent/20 text-accent animate-pulse shadow-[0_0_40px_rgba(var(--accent),0.4)] cursor-pointer' : 
                            'border-zinc-800 bg-zinc-900/80 text-zinc-700 backdrop-blur-md'
                          }`}
                      >
                        {completed ? <Check size={36} strokeWidth={3} /> : unlocked ? <Play size={36} className="ml-1 fill-accent" /> : <Lock size={36} />}
                        
                        {unlocked && !completed && (
                          <div className="absolute -inset-4 border-2 border-accent/20 rounded-full animate-slow-spin border-dashed" />
                        )}
                      </motion.div>
                    </div>

                    {/* Lesson Info Card - Aligned Alternately */}
                    <motion.div 
                      initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`absolute top-0 ${index % 2 === 0 ? 'left-[calc(50%+80px)]' : 'right-[calc(50%+80px)]'} w-72 p-6 glass-card border-white/10 pointer-events-auto
                        ${unlocked ? 'opacity-100' : 'opacity-40'}
                      `}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-black tracking-widest text-primary uppercase bg-primary/10 px-2 py-1 rounded">Module 0{index + 1}</span>
                        {completed && <span className="text-[10px] font-black tracking-widest text-green-500 uppercase">Completed</span>}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{lesson.title}</h3>
                      <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                        {lesson.theory.substring(0, 70)}...
                      </p>
                      
                      {unlocked ? (
                        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-10 shadow-lg shadow-primary/20 group">
                          <Link to={`/course/cpp/lesson/${lesson.id}`} className="flex items-center justify-center gap-2">
                            <BookOpen size={16} /> 
                            <span>{completed ? "Review Lesson" : "Start Learning"}</span>
                            <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                              <Play size={12} className="fill-white" />
                            </motion.div>
                          </Link>
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 text-zinc-600 text-xs font-bold uppercase tracking-wider">
                          <Lock size={14} /> Locked Module
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              );
            })}

            {/* Final Assessment Terminal Node */}
            <div className="relative flex flex-col items-center w-full mt-16 mb-24 pointer-events-auto">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "4rem" }}
                className={`absolute -top-16 w-1 ${allLessonsCompleted ? 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-zinc-900'}`}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={allLessonsCompleted ? { scale: 1.1 } : {}}
                className={`relative z-10 flex items-center justify-center w-32 h-32 rounded-3xl border-2 transition-all duration-500
                  ${progress.certificateGenerated ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400 shadow-[0_0_60px_rgba(250,204,21,0.5)]' :
                    allLessonsCompleted ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500 animate-pulse shadow-[0_0_40px_rgba(234,179,8,0.4)] cursor-pointer' : 
                    'border-zinc-800 bg-zinc-900/80 text-zinc-700'
                  }`}
              >
                {progress.certificateGenerated ? <Trophy size={56} /> : allLessonsCompleted ? <Play size={56} className="ml-1 fill-yellow-500" /> : <Lock size={56} />}
              </motion.div>

              <div className="mt-8 text-center max-w-sm">
                <h3 className={`font-black text-3xl tracking-tighter mb-2 ${allLessonsCompleted ? 'text-yellow-400' : 'text-zinc-600'}`}>FINAL EXAM</h3>
                <p className="text-zinc-500 text-sm font-medium">
                  {allLessonsCompleted 
                    ? "Certification assessment is now available. Score 70% to graduate." 
                    : "Complete all modules above to unlock the final certification exam."}
                </p>
                
                {allLessonsCompleted && (
                  <Button asChild className="mt-8 bg-yellow-500 hover:bg-yellow-400 text-black font-black px-10 h-12 rounded-full shadow-2xl shadow-yellow-500/20">
                    <Link to="/course/cpp/assessment">
                      {progress.certificateGenerated ? "VIEW CERTIFICATE" : "TAKE FINAL EXAM"}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
