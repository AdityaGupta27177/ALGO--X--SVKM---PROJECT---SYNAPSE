import { useState } from "react";
import Navbar from "@/components/Navbar";
import MonacoEditor from "@/components/MonacoEditor";
import ErrorPanel, { type ErrorEntry } from "@/components/ErrorPanel";
import { tutorialSteps } from "@/lib/tutorial-data";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";

const errors: ErrorEntry[] = [
  { severity: "warning", line: 3, message: "Variable 'dt' is used before assignment on first frame. Consider initializing to 0.016f.", fix: "Add a default value: float dt = 0.016f; before the game loop, or handle the first-frame edge case." },
  { severity: "error", line: 14, message: "Implicit conversion from 'float' to 'int' may lose precision. Use static_cast<int>().", fix: "Wrap the float expression with static_cast<int>() to make the conversion explicit." },
];

export default function PongTutorial() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedLine, setSelectedLine] = useState<number | null>(1);

  const step = tutorialSteps[activeStep];
  const explanation = selectedLine ? step.explanations[selectedLine] : null;

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "#0a0a0a" }}>
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - steps */}
        <aside className="w-60 shrink-0 overflow-y-auto border-r border-border bg-card/50 p-3">
          <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lesson Steps</p>
          {tutorialSteps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setActiveStep(i); setSelectedLine(1); }}
              className={`mb-1 flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                i === activeStep ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              {i < activeStep ? (
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              ) : (
                <Circle className={`mt-0.5 h-4 w-4 shrink-0 ${i === activeStep ? "text-primary" : "text-muted"}`} />
              )}
              <div>
                <p className="font-medium">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.subtitle}</p>
              </div>
            </button>
          ))}
        </aside>

        {/* Center - editor */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <MonacoEditor
            value={step.code}
            readOnly={false}
            height="calc(100vh - 260px)"
            onLineClick={(line) => setSelectedLine(line)}
          />
          <div className="shrink-0 border-t border-border">
            <ErrorPanel errors={errors} />
          </div>
        </div>

        {/* Right sidebar - explanations */}
        <aside className="w-[300px] shrink-0 overflow-y-auto border-l border-border bg-card/50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Line Explanation</p>
          {explanation ? (
            <div className="animate-fade-in space-y-3">
              <Badge className="bg-primary/20 text-primary">Line {selectedLine}</Badge>
              <pre className="overflow-x-auto rounded-lg bg-muted p-3 font-mono text-xs text-foreground">{explanation.code}</pre>
              <p className="text-sm leading-relaxed text-muted-foreground">{explanation.text}</p>
              <Badge variant="outline" className="border-accent/30 text-accent">{explanation.concept}</Badge>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Click on a line in the editor to see its explanation.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
