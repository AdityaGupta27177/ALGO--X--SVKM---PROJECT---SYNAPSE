import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import MonacoEditor from "@/components/MonacoEditor";
import ErrorPanel, { type ErrorEntry } from "@/components/ErrorPanel";
import CertificateModal from "@/components/CertificateModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Send, Clock, Trophy } from "lucide-react";

const checklist = [
  "Window opens at 800×600",
  "Left paddle moves with W / S keys",
  "Right paddle moves with Up / Down keys",
  "Ball bounces off top and bottom walls",
  "Ball resets when it goes off left or right edge",
  "Score displayed on screen",
];

const defaultErrors: ErrorEntry[] = [
  { severity: "warning", line: 1, message: "No code detected yet. Start typing to see real-time feedback.", fix: "Begin writing your Pong implementation in the editor." },
];

export default function PongTest() {
  const [code, setCode] = useState("// Build Pong here. Good luck.\n");
  const [checked, setChecked] = useState<boolean[]>(Array(6).fill(false));
  const [certOpen, setCertOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    let i = 0;
    const interval = setInterval(() => {
      setChecked((prev) => {
        const next = [...prev];
        next[i] = true;
        return next;
      });
      i++;
      if (i >= 6) {
        clearInterval(interval);
        setTimeout(() => setCertOpen(true), 400);
      }
    }, 250);
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "#0a0a0a" }}>
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <MonacoEditor
            value={code}
            onChange={setCode}
            readOnly={false}
            height="calc(100vh - 200px)"
          />
          <div className="shrink-0 border-t border-border">
            <ErrorPanel errors={defaultErrors} />
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="w-[280px] shrink-0 overflow-y-auto border-l border-border bg-card/50 p-4">
          <h3 className="text-sm font-semibold text-foreground">Test Requirements</h3>
          <p className="mb-4 text-xs text-muted-foreground">All items must pass to receive your certificate.</p>

          <div className="space-y-2">
            {checklist.map((item, i) => (
              <div key={i} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${checked[i] ? "bg-accent/10" : "bg-muted/30"}`}>
                {checked[i] ? (
                  <CheckCircle className="h-4 w-4 shrink-0 text-accent animate-check-in" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-muted" />
                )}
                <span className={checked[i] ? "text-foreground" : "text-muted-foreground"}>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Time elapsed:</span>
              <span className="font-mono font-medium text-foreground">{formatTime(elapsed)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Reward:</span>
              <Badge className="bg-primary/20 text-primary">+500 XP + Certificate</Badge>
            </div>
          </div>

          <Button onClick={handleSubmit} className="mt-4 w-full bg-primary hover:bg-primary/90">
            <Send className="mr-2 h-4 w-4" /> Submit for evaluation
          </Button>
        </aside>
      </div>

      <CertificateModal open={certOpen} onOpenChange={setCertOpen} />
    </div>
  );
}
