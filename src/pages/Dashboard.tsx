import { Link } from "react-router-dom";
import Spline from '@splinetool/react-spline';
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, Flame, Trophy, Award, Lock, BookOpen } from "lucide-react";
import { useCourseProgress } from "@/lib/useCourseProgress";
import { cppLessons } from "@/data/cppCourse";

const lockedGames = [
  { title: "Space Invaders", desc: "Arcade shooter with enemy waves, projectile physics, and power-ups." },
];

export default function Dashboard() {
  const { profile } = useAuth();
  const { progress } = useCourseProgress();

  const completionPercentage = Math.round((progress.completedLessons.length / cppLessons.length) * 100);

  const stats = [
    { label: "XP Earned", value: (profile?.xp ?? 1240).toLocaleString(), icon: Zap, color: "text-primary" },
    { label: "Current Streak", value: `${profile?.streak_days ?? 7} days`, icon: Flame, color: "text-orange-400" },
    { label: "Games Completed", value: `${profile?.games_completed ?? 0} / 6`, icon: Trophy, color: "text-accent" },
    { label: "Certificates", value: String(profile?.certificates ?? 0), icon: Award, color: "text-yellow-400" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
      {/* 3D Spline Background */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-auto flex items-center justify-center overflow-hidden">
        <div className="w-full h-full scale-[1.5] md:scale-[1.25] lg:scale-[1.5] origin-center">
          <Spline className="w-full h-full" scene="https://prod.spline.design/y-2X8jz-aKmn7u0m/scene.splinecode" />
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 pointer-events-none flex flex-col min-h-screen">
        <div className="pointer-events-auto">
          <Navbar />
        </div>
        <main className="mx-auto w-full max-w-7xl px-4 py-8 flex-1">
        <div className="mb-8 animate-fade-in pointer-events-auto w-fit">
          <h1 className="text-3xl font-bold text-white">Welcome back, {profile?.display_name?.split(" ")[0] ?? "Student"}</h1>
          <p className="mt-1 text-zinc-400">Continue where you left off</p>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="glass-card border-border pointer-events-auto">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-lg font-bold text-foreground">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="mb-4 text-xl font-semibold text-white pointer-events-auto w-fit">Game Library</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* C++ Course Card */}
          <Card className="glass-card border-primary/20 transition-all hover:border-primary/50 hover:glow-primary pointer-events-auto bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="text-primary h-5 w-5" /> Intro to C++
                </CardTitle>
                <Badge className="bg-primary/20 text-primary border-primary/20">Learning Path</Badge>
              </div>
              <CardDescription className="text-zinc-400">
                Master C++ fundamentals through our interactive roadmap, lessons, and earn an official certificate.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {["Roadmap", "Variables", "Functions", "Certification"].map((t) => (
                  <span key={t} className="rounded-md bg-zinc-800/50 px-2 py-0.5 text-[10px] text-zinc-400 border border-zinc-700/50">{t}</span>
                ))}
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-zinc-500">
                  <span>Course Progress</span><span>{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-1.5 bg-zinc-800" />
              </div>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                <Link to="/course/cpp">Enter Learning Path</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-border transition-all hover:border-primary/30 hover:glow-primary pointer-events-auto">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Pong</CardTitle>
                <Badge className="bg-accent/20 text-accent">Available</Badge>
              </div>
              <CardDescription className="text-muted-foreground">
                Your first C++ game. Learn the game loop, SFML rendering, collision detection, and delta time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {["game loop", "SFML", "collision", "delta time"].map((t) => (
                  <span key={t} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{t}</span>
                ))}
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span><span>0%</span>
                </div>
                <Progress value={0} className="h-1.5" />
              </div>
              <div className="flex gap-2">
                <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
                  <Link to="/games/pong/tutorial">Start Tutorial</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 border-border text-muted-foreground hover:text-foreground">
                  <Link to="/games/pong/test">Take Test</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Snake Card */}
          <Card className="glass-card border-border transition-all hover:border-accent/30 hover:glow-accent pointer-events-auto">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Snake</CardTitle>
                <Badge className="bg-accent/20 text-accent">Available</Badge>
              </div>
              <CardDescription className="text-muted-foreground">
                Classic snake game. Learn grid-based movement, std::deque, food spawning, and self-collision detection.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {["grid movement", "std::deque", "growth", "collision"].map((t) => (
                  <span key={t} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{t}</span>
                ))}
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span><span>0%</span>
                </div>
                <Progress value={0} className="h-1.5" />
              </div>
              <div className="flex gap-2">
                <Button asChild className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/games/snake/tutorial">Start Tutorial</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 border-border text-muted-foreground hover:text-foreground">
                  <Link to="/games/snake/test">Take Test</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {lockedGames.map((g) => (
            <Card key={g.title} className="glass-card border-border opacity-60 pointer-events-auto">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">{g.title}</CardTitle>
                  <Badge variant="outline" className="border-border text-muted-foreground">
                    <Lock className="mr-1 h-3 w-3" /> Coming soon
                  </Badge>
                </div>
                <CardDescription className="text-muted-foreground">{g.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button disabled className="w-full opacity-50">Locked</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      </div>
    </div>
  );
}
