import { lazy, Suspense } from "react";

const Editor = lazy(() => import("@monaco-editor/react").then(mod => ({ default: mod.default })));

interface MonacoEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  onLineClick?: (lineNumber: number) => void;
}

export default function MonacoEditor({ value, onChange, readOnly = false, height = "500px", onLineClick }: MonacoEditorProps) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center bg-[#1e1e1e] text-muted-foreground" style={{ height }}>Loading editor...</div>}>
      <Editor
        height={height}
        language="cpp"
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange?.(v ?? "")}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          renderLineHighlight: "all",
          padding: { top: 12 },
          wordWrap: "on",
        }}
        onMount={(editor) => {
          if (onLineClick) {
            editor.onDidChangeCursorPosition((e) => {
              onLineClick(e.position.lineNumber);
            });
          }
        }}
      />
    </Suspense>
  );
}
