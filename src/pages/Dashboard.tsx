import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, Flame, Trophy, Award, Lock } from "lucide-react";

const lockedGames = [
  { title: "Space Invaders", desc: "Arcade shooter with enemy waves, projectile physics, and power-ups." },
];

export default function Dashboard() {
  const { profile } = useAuth();

  const stats = [
    { label: "XP Earned", value: (profile?.xp ?? 1240).toLocaleString(), icon: Zap, color: "text-primary" },
    { label: "Current Streak", value: `${profile?.streak_days ?? 7} days`, icon: Flame, color: "text-orange-400" },
    { label: "Games Completed", value: `${profile?.games_completed ?? 0} / 6`, icon: Trophy, color: "text-accent" },
    { label: "Certificates", value: String(profile?.certificates ?? 0), icon: Award, color: "text-yellow-400" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {profile?.display_name?.split(" ")[0] ?? "Student"}</h1>
          <p className="mt-1 text-muted-foreground">Continue where you left off</p>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="glass-card border-border">
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

        <h2 className="mb-4 text-xl font-semibold text-foreground">Game Library</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="glass-card border-border transition-all hover:border-primary/30 hover:glow-primary">
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
          <Card className="glass-card border-border transition-all hover:border-accent/30 hover:glow-accent">
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
            <Card key={g.title} className="glass-card border-border opacity-60">
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
  );
}
