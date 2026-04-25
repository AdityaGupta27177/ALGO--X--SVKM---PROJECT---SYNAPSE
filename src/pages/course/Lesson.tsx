import { useState, useMemo } from "react";
import Spline from '@splinetool/react-spline';
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Code2, BookOpen, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cppLessons } from "@/data/cppCourse";
import { useCourseProgress } from "@/lib/useCourseProgress";
import { useToast } from "@/hooks/use-toast";

type Step = "learn" | "practice" | "quiz";

export default function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { markLessonComplete, isLessonComplete } = useCourseProgress();
  
  const [currentStep, setCurrentStep] = useState<Step>("learn");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [isSplineLoading, setIsSplineLoading] = useState(true);

  const lesson = useMemo(() => cppLessons.find((l) => l.id === id), [id]);

  // Reset state when lesson changes without reload
  useEffect(() => {
    setCurrentStep("learn");
    setSelectedOption(null);
    setIsQuizSubmitted(false);
  }, [id]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Lesson not found</h2>
          <Button asChild><Link to="/course/cpp">Back to Roadmap</Link></Button>
        </div>
      </div>
    );
  }

  const steps: { id: Step; label: string; icon: any }[] = [
    { id: "learn", label: "Learn", icon: BookOpen },
    { id: "practice", label: "Practice", icon: Code2 },
    { id: "quiz", label: "Quick Quiz", icon: HelpCircle },
  ];

  const handleQuizSubmit = () => {
    if (selectedOption === null) return;
    
    setIsQuizSubmitted(true);
    if (selectedOption === lesson.quiz.correctIndex) {
      toast({
        title: "Correct!",
        description: "You've mastered this lesson. +100 XP",
      });
      markLessonComplete(lesson.id);
    } else {
      toast({
        variant: "destructive",
        title: "Not quite",
        description: "Try again to unlock the next lesson.",
      });
    }
  };

  const nextStep = () => {
    if (currentStep === "learn") setCurrentStep("practice");
    else if (currentStep === "practice") setCurrentStep("quiz");
  };

  const prevStep = () => {
    if (currentStep === "quiz") setCurrentStep("practice");
    else if (currentStep === "practice") setCurrentStep("learn");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a] text-foreground flex flex-col">
      {/* 3D Spline Background */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none flex items-center justify-center overflow-hidden opacity-30">
        <div className="w-full h-full scale-[1.5] origin-center">
          <Spline 
            onLoad={() => setIsSplineLoading(false)}
            className="w-full h-full" 
            scene="https://prod.spline.design/y-2X8jz-aKmn7u0m/scene.splinecode" 
          />
        </div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isSplineLoading && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center gap-4"
          >
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-primary font-bold tracking-widest uppercase text-xs animate-pulse">Initializing 3D Environment...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Panel: Content */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-12">
            <div className="max-w-3xl mx-auto">
              <Link to="/course/cpp" className="flex items-center text-zinc-500 hover:text-white transition-colors mb-8 w-fit group">
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to Roadmap</span>
              </Link>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === "learn" && (
                  <div className="space-y-6">
                    <h1 className="text-4xl font-bold text-white">{lesson.title}</h1>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-xl text-zinc-300 leading-relaxed">
                        {lesson.theory}
                      </p>
                    </div>
                    <div className="pt-8">
                      <Button onClick={nextStep} className="bg-primary hover:bg-primary/90 text-white px-8 h-12 text-lg">
                        Continue to Practice <ChevronRight className="ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === "practice" && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                      <Code2 className="text-accent drop-shadow-[0_0_10px_rgba(var(--accent),0.5)]" /> Code Lab
                    </h2>
                    <p className="text-zinc-400">Review this example to see the concepts in action.</p>
                    
                    <div className="bg-[#1e1e1e]/60 backdrop-blur-md rounded-xl p-6 border border-white/5 shadow-2xl font-mono text-sm overflow-x-auto">
                      <pre className="text-zinc-300">
                        <code>{lesson.codeSnippet}</code>
                      </pre>
                    </div>

                    <div className="bg-accent/5 border border-accent/20 backdrop-blur-sm rounded-xl p-6">
                      <h4 className="text-accent font-bold mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
                        Pro Tip
                      </h4>
                      <p className="text-zinc-300 text-sm">
                        In C++, every statement usually ends with a semicolon (<code>;</code>). Forgetting this is the most common cause of compiler errors!
                      </p>
                    </div>

                    <div className="pt-8 flex gap-4">
                      <Button variant="outline" onClick={prevStep} className="border-zinc-800 text-zinc-400">
                        Back
                      </Button>
                      <Button onClick={nextStep} className="bg-primary hover:bg-primary/90 text-white px-8 h-12 text-lg">
                        Take the Quiz <ChevronRight className="ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === "quiz" && (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-bold text-white">Check Your Knowledge</h2>
                    
                    <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden relative">
                      <AnimatePresence>
                        {isQuizSubmitted && selectedOption === lesson.quiz.correctIndex && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-green-500/10 backdrop-blur-sm z-20 flex items-center justify-center pointer-events-none"
                          >
                            <motion.div
                              initial={{ scale: 0.5, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="bg-green-500 text-white p-4 rounded-full shadow-[0_0_40px_rgba(34,197,94,0.6)]"
                            >
                              <CheckCircle2 size={48} />
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <CardContent className="pt-6 space-y-6">
                        <p className="text-xl text-white font-medium">{lesson.quiz.question}</p>
                        
                        <div className="space-y-3">
                          {lesson.quiz.options.map((option, idx) => (
                            <motion.button
                              layout
                              key={idx}
                              disabled={isQuizSubmitted && selectedOption === lesson.quiz.correctIndex}
                              onClick={() => !isQuizSubmitted && setSelectedOption(idx)}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between
                                ${selectedOption === idx 
                                  ? 'border-primary bg-primary/10 text-white' 
                                  : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'}
                                ${isQuizSubmitted && idx === lesson.quiz.correctIndex ? 'border-green-500 bg-green-500/10 text-green-500' : ''}
                                ${isQuizSubmitted && selectedOption === idx && idx !== lesson.quiz.correctIndex ? 'border-red-500 bg-red-500/10 text-red-500' : ''}
                              `}
                            >
                              <span>{option}</span>
                              {isQuizSubmitted && idx === lesson.quiz.correctIndex && <CheckCircle2 size={20} />}
                            </motion.button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="pt-4 flex gap-4">
                      {!isQuizSubmitted ? (
                        <Button 
                          onClick={handleQuizSubmit} 
                          disabled={selectedOption === null}
                          className="bg-primary hover:bg-primary/90 text-white px-12 h-12 text-lg"
                        >
                          Submit Answer
                        </Button>
                      ) : selectedOption === lesson.quiz.correctIndex ? (
                        <div className="flex gap-4">
                          <Button 
                            onClick={() => navigate("/course/cpp")}
                            variant="outline"
                            className="border-green-600/50 text-green-500 hover:bg-green-600/10 px-8 h-12"
                          >
                            Roadmap
                          </Button>
                          {cppLessons.findIndex(l => l.id === lesson.id) < cppLessons.length - 1 ? (
                            <Button 
                              onClick={() => {
                                const nextIndex = cppLessons.findIndex(l => l.id === lesson.id) + 1;
                                navigate(`/course/cpp/lesson/${cppLessons[nextIndex].id}`);
                              }}
                              className="bg-green-600 hover:bg-green-500 text-white px-12 h-12 text-lg shadow-[0_0_20px_rgba(22,163,74,0.3)]"
                            >
                              Next Lesson <ChevronRight className="ml-2" />
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => navigate("/course/cpp/assessment")}
                              className="bg-yellow-600 hover:bg-yellow-500 text-white px-12 h-12 text-lg shadow-[0_0_30px_rgba(202,138,4,0.4)]"
                            >
                              Take Final Exam <Trophy className="ml-2" />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <Button 
                          onClick={() => {setIsQuizSubmitted(false); setSelectedOption(null);}}
                          variant="outline"
                          className="border-zinc-700 text-white"
                        >
                          Try Again
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Right Panel: Progress Tracker */}
        <aside className="w-full lg:w-80 bg-zinc-900/20 backdrop-blur-md border-t lg:border-t-0 lg:border-l border-white/5 p-8 hidden md:block pointer-events-auto">
          <div className="sticky top-8 space-y-8">
            <div>
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Lesson Progress</h3>
              <div className="space-y-4">
                {steps.map((step, idx) => {
                  const isActive = currentStep === step.id;
                  const isPast = steps.findIndex(s => s.id === currentStep) > idx;
                  
                  return (
                    <div key={step.id} className="flex items-center gap-4 group">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                        ${isActive ? 'border-primary bg-primary/10 text-primary scale-110 shadow-[0_0_20px_rgba(var(--primary),0.4)]' : 
                          isPast ? 'border-green-500 bg-green-500/10 text-green-500' : 
                          'border-white/5 text-zinc-700'}
                      `}>
                        {isPast ? <CheckCircle2 size={20} /> : <step.icon size={20} />}
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-bold transition-colors ${isActive ? 'text-white' : isPast ? 'text-zinc-400' : 'text-zinc-700'}`}>
                          {step.label}
                        </span>
                        {isActive && <motion.span layoutId="active-step" className="text-[10px] text-primary font-bold uppercase drop-shadow-[0_0_5px_rgba(var(--primary),0.5)]">Current Step</motion.span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/5 shadow-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-zinc-500">Course Completion</span>
                  <span className="text-xs text-primary font-bold">33%</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "33%" }}
                    className="bg-primary h-full shadow-[0_0_10px_rgba(var(--primary),0.8)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
      </div>
    </div>
  );
}
