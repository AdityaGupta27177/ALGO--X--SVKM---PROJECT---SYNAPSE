import { useState, useEffect } from "react";
import Spline from '@splinetool/react-spline';
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Timer, CheckCircle, XCircle, ChevronRight, Download, Share2, RefreshCw, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { finalAssessment } from "@/data/cppCourse";
import { useCourseProgress } from "@/lib/useCourseProgress";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import CertificateGenerator from "@/components/course/CertificateGenerator";

export default function Assessment() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { progress, unlockCertificate } = useCourseProgress();
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(progress.certificateGenerated);
  const [score, setScore] = useState(progress.certificateGenerated ? 85 : 0); // Default pass score for revisit
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isSplineLoading, setIsSplineLoading] = useState(true);

  useEffect(() => {
    if (isFinished || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isFinished, timeLeft]);

  const handleAnswerSelect = (optionIdx: number) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIdx] = optionIdx;
    setUserAnswers(newUserAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < finalAssessment.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    try {
      let correctCount = 0;
      finalAssessment.forEach((q, idx) => {
        if (userAnswers[idx] === q.correctIndex) correctCount++;
      });
      
      const finalScore = Math.round((correctCount / finalAssessment.length) * 100);
      setScore(finalScore);
      setIsFinished(true);

      if (finalScore >= 70) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#EAB308', '#FFFFFF', '#3B82F6']
        });
        unlockCertificate();
        toast({
          title: "Assessment Passed!",
          description: `Score: ${finalScore}%. Your certificate is ready for download.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Assessment Failed",
          description: `Score: ${finalScore}%. You need 70% to pass. Try again!`,
        });
      }
    } catch (err) {
      console.error("Calculation error:", err);
      toast({
        variant: "destructive",
        title: "Evaluation Error",
        description: "Something went wrong while grading. Please refresh and try again.",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isFinished) {
    const passed = score >= 70;
    return (
      <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a] text-white">
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
              <p className="text-primary font-bold tracking-widest uppercase text-xs animate-pulse">Initializing Assessment...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="max-w-3xl mx-auto px-4 py-20 text-center flex-1">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-8"
            >
              <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${passed ? 'bg-yellow-500/20 text-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.3)]' : 'bg-red-500/20 text-red-500 shadow-[0_0_50px_rgba(239,68,68,0.3)]'}`}>
                {passed ? <Trophy size={48} className="animate-bounce" /> : <XCircle size={48} />}
              </div>
              
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">{passed ? "EXAM PASSED" : "EXAM FAILED"}</h1>
                <p className="text-zinc-400 text-lg">Final Score Assessment: <span className={passed ? 'text-yellow-500' : 'text-red-500'}>{score}%</span></p>
              </div>

              <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50" />
                <div className="relative z-10 flex justify-center gap-12 text-center">
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest">Correct</p>
                  <p className="text-2xl font-bold text-green-500">{Math.round(score * finalAssessment.length / 100)} / {finalAssessment.length}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest">Time Used</p>
                  <p className="text-2xl font-bold text-white">{formatTime(600 - timeLeft)}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest">Status</p>
                  <p className={`text-2xl font-bold ${passed ? 'text-yellow-500' : 'text-red-500'}`}>{passed ? 'PASS' : 'FAIL'}</p>
                </div>
              </div>
            </Card>

            <div className="flex flex-col gap-6 items-center">
              {passed ? (
                <div className="w-full space-y-6">
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6 flex flex-col items-center gap-4">
                    <Award size={48} className="text-yellow-500" />
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Certificate Earned!</h3>
                      <p className="text-sm text-zinc-400">Your achievement has been recorded and your certificate is ready.</p>
                    </div>
                    <CertificateGenerator score={score} />
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                    <Button variant="outline" className="border-zinc-800 text-white gap-2">
                      <Share2 size={18} /> Share Result
                    </Button>
                    <Button asChild variant="link" className="text-zinc-500 hover:text-white">
                      <Link to="/course/cpp">Back to Roadmap</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 px-8">
                    <RefreshCw size={18} /> Retry Assessment
                  </Button>
                  <Button asChild variant="link" className="text-zinc-500 hover:text-white block">
                    <Link to="/course/cpp">Review Roadmap</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
      </div>
    );
  }

  const currentQuestion = finalAssessment[currentQuestionIdx];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a] text-white flex flex-col">
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
            <p className="text-primary font-bold tracking-widest uppercase text-xs animate-pulse">Initializing Lab Environment...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-12 pointer-events-none">
          <div className="flex justify-between items-center mb-8 pointer-events-auto">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-primary uppercase tracking-widest drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">Final Assessment</h2>
              <p className="text-zinc-500">Question {currentQuestionIdx + 1} of {finalAssessment.length}</p>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl shadow-lg">
              <Timer size={18} className="text-zinc-400" />
              <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-zinc-300'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div className="pointer-events-auto">
            <Progress value={(currentQuestionIdx / finalAssessment.length) * 100} className="h-1.5 mb-12 bg-white/5" />
          </div>

          <div className="flex-1 pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h3 className="text-2xl font-bold leading-tight">{currentQuestion.question}</h3>
              
              <div className="grid gap-4">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`text-left p-6 rounded-2xl border transition-all group flex items-center justify-between backdrop-blur-sm
                      ${userAnswers[currentQuestionIdx] === idx 
                        ? 'border-primary bg-primary/10 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)] ring-1 ring-primary/30' 
                        : 'border-white/5 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10'}
                    `}
                  >
                    <span className="text-lg font-medium">{option}</span>
                    <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center
                      ${userAnswers[currentQuestionIdx] === idx ? 'border-primary bg-primary' : 'border-zinc-700 group-hover:border-zinc-500'}
                    `}>
                      {userAnswers[currentQuestionIdx] === idx && <CheckCircle size={14} className="text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex justify-between items-center border-t border-white/10 pt-8 pointer-events-auto">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIdx === 0}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            Previous
          </Button>
          <Button 
            onClick={nextQuestion} 
            disabled={userAnswers[currentQuestionIdx] === undefined}
            className="bg-primary hover:bg-primary/90 text-white px-10 h-12 text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all"
          >
            {currentQuestionIdx === finalAssessment.length - 1 ? 'Finish Exam' : 'Next Question'}
            <ChevronRight className="ml-2" />
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}
