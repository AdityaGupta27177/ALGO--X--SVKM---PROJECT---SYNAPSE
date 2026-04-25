import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Grid3X3, ArrowUpDown, Apple, Skull, BookOpen, Swords } from "lucide-react";

const concepts = [
  { title: "Grid Movement", desc: "Discrete tile-based movement using a 2D grid coordinate system", icon: Grid3X3 },
  { title: "std::deque", desc: "Double-ended queue for efficient head insertion and tail removal", icon: ArrowUpDown },
  { title: "Food & Growth", desc: "Random spawning, collision detection, and snake growth mechanics", icon: Apple },
  { title: "Game Over Logic", desc: "Wall boundaries and self-collision detection for game state", icon: Skull },
];

const tutorialFeatures = ["Step-by-step lessons", "Line-by-line explanations", "Hints available", "Concept recaps"];
const testFeatures = ["Blank editor", "Feature checklist", "Timed", "Certificate on completion"];

export default function SnakeLanding() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Snake — C++ Game Development</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Build the classic Snake game in C++. Learn grid-based movement, data structures (std::deque),
            food spawning, growth mechanics, and game-over detection — building on the fundamentals from Pong.
          </p>
        </div>

        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {concepts.map((c) => (
            <Card key={c.title} className="glass-card border-border">
              <CardContent className="p-4">
                <c.icon className="mb-2 h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">{c.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="mb-4 text-xl font-semibold text-foreground">Choose Your Mode</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="glass-card border-l-4 border-l-accent border-border transition-all hover:glow-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BookOpen className="h-5 w-5 text-accent" /> Tutorial Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Guided learning. Build Snake step by step with full explanations.</p>
              <ul className="space-y-1.5">
                {tutorialFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/games/snake/tutorial">Start Tutorial</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-l-4 border-l-primary border-border transition-all hover:glow-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Swords className="h-5 w-5 text-primary" /> Test Mode
                </CardTitle>
                <Badge variant="outline" className="border-primary/30 text-primary">Requires Tutorial</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">No guidance. Build Snake from scratch in a pure coding environment.</p>
              <ul className="space-y-1.5">
                {testFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link to="/games/snake/test">Start Test</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
