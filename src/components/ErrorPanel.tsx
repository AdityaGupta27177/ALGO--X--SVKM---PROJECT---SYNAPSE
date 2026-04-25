import { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ErrorEntry {
  severity: "error" | "warning";
  line: number;
  message: string;
  fix: string;
}

interface ErrorPanelProps {
  errors: ErrorEntry[];
}

export default function ErrorPanel({ errors }: ErrorPanelProps) {
  const [expanded, setExpanded] = useState(true);

  const errorCount = errors.filter(e => e.severity === "error").length;
  const warningCount = errors.filter(e => e.severity === "warning").length;

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-2">
          <span>Errors & Warnings</span>
          {errorCount > 0 && <Badge variant="destructive" className="h-5 px-1.5 text-xs">{errorCount}</Badge>}
          {warningCount > 0 && <Badge className="h-5 bg-warning px-1.5 text-xs text-warning-foreground">{warningCount}</Badge>}
        </div>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {expanded && (
        <div className="border-t border-border">
          {errors.map((err, i) => (
            <div
              key={i}
              className={`border-l-2 px-4 py-3 ${
                err.severity === "error" ? "border-l-destructive" : "border-l-warning"
              } ${i < errors.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="flex items-start gap-2">
                {err.severity === "error" ? (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant={err.severity === "error" ? "destructive" : "outline"} className={`text-xs ${err.severity === "warning" ? "border-warning text-warning" : ""}`}>
                      {err.severity.toUpperCase()}
                    </Badge>
                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">line {err.line}</span>
                  </div>
                  <p className="mt-1 text-sm text-foreground">{err.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">💡 {err.fix}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export type { ErrorEntry };
