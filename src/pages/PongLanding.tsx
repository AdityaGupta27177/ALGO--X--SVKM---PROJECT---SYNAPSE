import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Monitor, Crosshair, Clock, BookOpen, Swords } from "lucide-react";

const concepts = [
  { title: "Game Loop", desc: 'The while() loop that drives every frame: input → update → render', icon: RefreshCw },
  { title: "SFML Rendering", desc: "Drawing shapes, text, and handling the window with SFML", icon: Monitor },
  { title: "Collision Detection", desc: "AABB bounding box overlap using getGlobalBounds().intersects()", icon: Crosshair },
  { title: "Delta Time", desc: "Frame-rate independent movement using sf::Clock", icon: Clock },
];

const tutorialFeatures = ["Step-by-step lessons", "Line-by-line explanations", "Hints available", "Concept recaps"];
const testFeatures = ["Blank editor", "Feature checklist", "Timed", "Certificate on completion"];

export default function PongLanding() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Pong — C++ Game Development</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Pong is the perfect first C++ game. It teaches you the game loop, real-time input, velocity-based movement,
            collision detection, and score tracking — all the fundamentals you will use in every game you build.
          </p>
        </div>

        {/* Concept cards */}
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

        {/* Choose mode */}
        <h2 className="mb-4 text-xl font-semibold text-foreground">Choose Your Mode</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Tutorial */}
          <Card className="glass-card border-l-4 border-l-accent border-border transition-all hover:glow-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BookOpen className="h-5 w-5 text-accent" /> Tutorial Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Guided learning. Every line of code explained. Practice each concept before moving on.</p>
              <ul className="space-y-1.5">
                {tutorialFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/games/pong/tutorial">Start Tutorial</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Test */}
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
              <p className="text-sm text-muted-foreground">No guidance. Build Pong from scratch. Pure coding environment.</p>
              <ul className="space-y-1.5">
                {testFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link to="/games/pong/test">Start Test</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
