import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ZoomIn, ZoomOut, Download, Lightbulb, X, Trash2, Link2, GripVertical, Lock, Unlock, PlayCircle, CheckCircle2, Trophy, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { SkillNode, Edge, NodeGroup, SkillMapState, GRID_SIZE, NODE_W, NODE_H, STATUS_COLORS, GROUP_COLORS, snapToGrid, genId, wouldCreateCycle, getDefaultState } from "@/components/skillmap/types";

const STORAGE_KEY = "skillMapState";

function loadState(): SkillMapState {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : getDefaultState(); }
  catch { return getDefaultState(); }
}

export default function SkillMap() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<SkillMapState>(loadState);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOff, setDragOff] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [edgeMode, setEdgeMode] = useState<string | null>(null);
  const [edgeMouse, setEdgeMouse] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<string | null>(null);
  const [lasso, setLasso] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [lassoStart, setLassoStart] = useState<{ x: number; y: number } | null>(null);
  const [lassoNodes, setLassoNodes] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [gridSnap, setGridSnap] = useState(true);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);

  const completionPct = useMemo(() => {
    if (!state.nodes.length) return 0;
    return Math.round(state.nodes.reduce((s, n) => s + n.progress, 0) / state.nodes.length);
  }, [state.nodes]);

  const suggestNext = useCallback(() => {
    const complete = new Set(state.nodes.filter(n => n.status === "complete").map(n => n.id));
    const candidate = state.nodes.find(n => {
      if (n.status === "complete") return false;
      const deps = state.edges.filter(e => e.to === n.id).map(e => e.from);
      return deps.every(d => complete.has(d));
    });
    if (candidate) {
      toast({ title: "💡 Suggested Next", description: `Focus on "${candidate.title}" — all prerequisites met!` });
      setSelected(candidate.id);
    } else toast({ title: "No suggestion", description: "Complete more nodes first." });
  }, [state, toast]);

  const addNode = useCallback((cx?: number, cy?: number) => {
    const x = snapToGrid((cx ?? 400) / zoom - pan.x);
    const y = snapToGrid((cy ?? 300) / zoom - pan.y);
    const n: SkillNode = { id: genId(), x, y, title: "New Skill", notes: "", timeEstimate: "30 min", resources: [], status: "unlocked", progress: 0, xp: 0 };
    setState(s => ({ ...s, nodes: [...s.nodes, n] }));
  }, [pan, zoom]);

  const updateNode = useCallback((id: string, patch: Partial<SkillNode>) => {
    setState(s => ({ ...s, nodes: s.nodes.map(n => n.id === id ? { ...n, ...patch } : n) }));
  }, []);

  const deleteNode = useCallback((id: string) => {
    setState(s => ({ ...s, nodes: s.nodes.filter(n => n.id !== id), edges: s.edges.filter(e => e.from !== id && e.to !== id) }));
    setSelected(null);
  }, []);

  const addEdge = useCallback((from: string, to: string) => {
    if (from === to || state.edges.some(e => e.from === from && e.to === to)) return;
    if (wouldCreateCycle(state.edges, from, to)) {
      toast({ variant: "destructive", title: "Cycle detected!", description: "This would create a circular dependency." });
      return;
    }
    setState(s => ({ ...s, edges: [...s.edges, { id: genId(), from, to }] }));
  }, [state.edges, toast]);

  const deleteEdge = useCallback((id: string) => {
    setState(s => ({ ...s, edges: s.edges.filter(e => e.id !== id) }));
  }, []);

  const createGroup = useCallback(() => {
    if (lassoNodes.length < 2 || !groupName.trim()) return;
    const g: NodeGroup = { id: genId(), name: groupName.trim(), nodeIds: [...lassoNodes], color: GROUP_COLORS[state.groups.length % GROUP_COLORS.length] };
    setState(s => ({ ...s, groups: [...s.groups, g], nodes: s.nodes.map(n => lassoNodes.includes(n.id) ? { ...n, group: g.id } : n) }));
    setLassoNodes([]); setGroupName(""); setLasso(null);
    toast({ title: "Group created", description: `"${g.name}" with ${g.nodeIds.length} nodes` });
  }, [lassoNodes, groupName, state.groups.length, toast]);

  const exportPNG = useCallback(() => {
    if (!canvasRef.current) return;
    import("html2canvas").then(({ default: h2c }) => {
      h2c(canvasRef.current!, { backgroundColor: "#0a0a0a", scale: 2 }).then(canvas => {
        const a = document.createElement("a");
        a.download = "skillmap.png";
        a.href = canvas.toDataURL("image/png");
        a.click();
        toast({ title: "Exported!", description: "Skill map saved as PNG" });
      });
    });
  }, [toast]);

  // Mouse handlers
  const toCanvas = (cx: number, cy: number) => ({ x: (cx - pan.x * zoom) / zoom, y: (cy - pan.y * zoom) / zoom });

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains("canvas-bg")) {
      if (e.shiftKey) {
        const r = canvasRef.current!.getBoundingClientRect();
        const p = toCanvas(e.clientX - r.left, e.clientY - r.top);
        setLassoStart(p); setLasso({ x: p.x, y: p.y, w: 0, h: 0 });
      } else {
        setPanning(true); setPanStart({ x: e.clientX - pan.x * zoom, y: e.clientY - pan.y * zoom });
      }
      setSelected(null);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (panning) {
      setPan({ x: (e.clientX - panStart.x) / zoom, y: (e.clientY - panStart.y) / zoom });
    }
    if (dragging) {
      const r = canvasRef.current!.getBoundingClientRect();
      const p = toCanvas(e.clientX - r.left, e.clientY - r.top);
      let nx = p.x - dragOff.x, ny = p.y - dragOff.y;
      if (gridSnap) { nx = snapToGrid(nx); ny = snapToGrid(ny); }
      updateNode(dragging, { x: nx, y: ny });
    }
    if (edgeMode) {
      const r = canvasRef.current!.getBoundingClientRect();
      setEdgeMouse(toCanvas(e.clientX - r.left, e.clientY - r.top));
    }
    if (lassoStart && lasso) {
      const r = canvasRef.current!.getBoundingClientRect();
      const p = toCanvas(e.clientX - r.left, e.clientY - r.top);
      const x = Math.min(lassoStart.x, p.x), y = Math.min(lassoStart.y, p.y);
      const w = Math.abs(p.x - lassoStart.x), h = Math.abs(p.y - lassoStart.y);
      setLasso({ x, y, w, h });
      const sel = state.nodes.filter(n => n.x >= x && n.x + NODE_W <= x + w && n.y >= y && n.y + NODE_H <= y + h).map(n => n.id);
      setLassoNodes(sel);
    }
  };

  const onMouseUp = () => {
    setPanning(false); setDragging(null);
    if (lassoStart) setLassoStart(null);
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.min(2, Math.max(0.3, z - e.deltaY * 0.001)));
  };

  const nodeCenter = (n: SkillNode) => ({ x: n.x + NODE_W / 2, y: n.y + NODE_H / 2 });
  const statusIcon = (s: SkillNode["status"]) => {
    switch (s) {
      case "locked": return <Lock size={14} />;
      case "unlocked": return <Unlock size={14} />;
      case "in-progress": return <PlayCircle size={14} />;
      case "complete": return <CheckCircle2 size={14} />;
    }
  };

  const selectedNode = state.nodes.find(n => n.id === selected);

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
      <Navbar />
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-black/50 backdrop-blur-md z-30 flex-shrink-0">
        <Button size="sm" variant="outline" className="gap-1 border-white/10 text-xs" onClick={() => addNode()}>
          <Plus size={14} /> Add Node
        </Button>
        <Button size="sm" variant="outline" className="gap-1 border-white/10 text-xs" onClick={() => setEdgeMode(edgeMode ? null : "__start__")}>
          <Link2 size={14} /> {edgeMode ? "Cancel Edge" : "Draw Edge"}
        </Button>
        <div className="w-px h-6 bg-white/10" />
        <Button size="sm" variant="ghost" className="text-xs" onClick={() => setZoom(z => Math.min(2, z + 0.15))}><ZoomIn size={14} /></Button>
        <span className="text-xs text-zinc-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
        <Button size="sm" variant="ghost" className="text-xs" onClick={() => setZoom(z => Math.max(0.3, z - 0.15))}><ZoomOut size={14} /></Button>
        <div className="w-px h-6 bg-white/10" />
        <label className="flex items-center gap-1 text-xs text-zinc-400 cursor-pointer">
          <input type="checkbox" checked={gridSnap} onChange={e => setGridSnap(e.target.checked)} className="accent-primary" /> Snap
        </label>
        <div className="w-px h-6 bg-white/10" />
        <Button size="sm" variant="outline" className="gap-1 border-white/10 text-xs" onClick={suggestNext}>
          <Lightbulb size={14} /> Suggest Next
        </Button>
        <Button size="sm" variant="outline" className="gap-1 border-white/10 text-xs" onClick={exportPNG}>
          <Download size={14} /> PNG
        </Button>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Trophy size={14} className="text-yellow-500" />
          <span className="text-xs text-yellow-400 font-bold">{state.totalXp + state.nodes.reduce((s, n) => s + n.xp, 0)} XP</span>
        </div>
        <div className="ml-3 bg-white/5 border border-white/10 rounded-full px-3 py-1 flex items-center gap-2">
          <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${completionPct}%` }} className="h-full bg-primary rounded-full" />
          </div>
          <span className="text-xs text-primary font-bold">{completionPct}%</span>
        </div>
        <span className="text-[10px] text-zinc-600 ml-1">SHIFT+drag to lasso</span>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Canvas */}
        <div ref={canvasRef} className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} onWheel={onWheel}
          onDoubleClick={e => { const r = canvasRef.current!.getBoundingClientRect(); addNode(e.clientX - r.left, e.clientY - r.top); }}
        >
          <div className="canvas-bg absolute inset-0" style={{ backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: `${GRID_SIZE * zoom}px ${GRID_SIZE * zoom}px`, backgroundPosition: `${pan.x * zoom}px ${pan.y * zoom}px` }} />

          <div style={{ transform: `translate(${pan.x * zoom}px, ${pan.y * zoom}px) scale(${zoom})`, transformOrigin: "0 0" }}>
            {/* Group backgrounds */}
            {state.groups.map(g => {
              const gNodes = state.nodes.filter(n => g.nodeIds.includes(n.id));
              if (!gNodes.length) return null;
              const minX = Math.min(...gNodes.map(n => n.x)) - 20;
              const minY = Math.min(...gNodes.map(n => n.y)) - 30;
              const maxX = Math.max(...gNodes.map(n => n.x + NODE_W)) + 20;
              const maxY = Math.max(...gNodes.map(n => n.y + NODE_H)) + 20;
              return (
                <div key={g.id} className="absolute rounded-2xl border-2 border-dashed" style={{ left: minX, top: minY, width: maxX - minX, height: maxY - minY, borderColor: g.color + "60", backgroundColor: g.color + "08" }}>
                  <span className="absolute -top-3 left-3 px-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: g.color, backgroundColor: "#0a0a0a" }}>{g.name}</span>
                </div>
              );
            })}

            {/* SVG Edges */}
            <svg className="absolute inset-0 pointer-events-none" style={{ width: 9999, height: 9999, overflow: "visible" }}>
              <defs>
                <marker id="ah" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" /></marker>
              </defs>
              {state.edges.map(e => {
                const fn = state.nodes.find(n => n.id === e.from);
                const tn = state.nodes.find(n => n.id === e.to);
                if (!fn || !tn) return null;
                const f = nodeCenter(fn), t = nodeCenter(tn);
                const mx = (f.x + t.x) / 2, my = (f.y + t.y) / 2 - 40;
                return (
                  <g key={e.id} className="pointer-events-auto cursor-pointer" onClick={() => deleteEdge(e.id)}>
                    <path d={`M${f.x},${f.y} Q${mx},${my} ${t.x},${t.y}`} fill="none" stroke="#6366f1" strokeWidth={2} markerEnd="url(#ah)" opacity={0.7} />
                    <path d={`M${f.x},${f.y} Q${mx},${my} ${t.x},${t.y}`} fill="none" stroke="transparent" strokeWidth={12} />
                    {e.label && <text x={mx} y={my - 5} fill="#888" fontSize={10} textAnchor="middle">{e.label}</text>}
                  </g>
                );
              })}
              {edgeMode && edgeMode !== "__start__" && (
                <line x1={nodeCenter(state.nodes.find(n => n.id === edgeMode)!).x} y1={nodeCenter(state.nodes.find(n => n.id === edgeMode)!).y} x2={edgeMouse.x} y2={edgeMouse.y} stroke="#6366f1" strokeWidth={2} strokeDasharray="6 4" opacity={0.5} />
              )}
            </svg>

            {/* Lasso selection */}
            {lasso && lasso.w > 0 && (
              <div className="absolute border-2 border-dashed border-primary/50 bg-primary/5 rounded-lg pointer-events-none" style={{ left: lasso.x, top: lasso.y, width: lasso.w, height: lasso.h }} />
            )}

            {/* Nodes */}
            {state.nodes.map(node => {
              const sc = STATUS_COLORS[node.status];
              const isLassoed = lassoNodes.includes(node.id);
              return (
                <motion.div key={node.id} layout
                  className={`absolute rounded-xl border-2 cursor-pointer select-none group ${selected === node.id ? "ring-2 ring-primary/50" : ""} ${isLassoed ? "ring-2 ring-accent/50" : ""}`}
                  style={{ left: node.x, top: node.y, width: NODE_W, height: NODE_H, backgroundColor: sc.bg, borderColor: sc.border, boxShadow: sc.glow, color: sc.text }}
                  onMouseDown={e => {
                    e.stopPropagation();
                    if (edgeMode === "__start__") { setEdgeMode(node.id); return; }
                    if (edgeMode && edgeMode !== node.id) { addEdge(edgeMode, node.id); setEdgeMode(null); return; }
                    setDragging(node.id);
                    const r = canvasRef.current!.getBoundingClientRect();
                    const p = toCanvas(e.clientX - r.left, e.clientY - r.top);
                    setDragOff({ x: p.x - node.x, y: p.y - node.y });
                  }}
                  onClick={e => { e.stopPropagation(); if (!dragging) setSelected(node.id); }}
                >
                  <div className="flex items-center gap-2 px-3 pt-2">
                    {statusIcon(node.status)}
                    <span className="text-sm font-bold truncate flex-1">{node.title}</span>
                    <GripVertical size={12} className="opacity-0 group-hover:opacity-40" />
                  </div>
                  {/* Progress bar */}
                  <div className="mx-3 mt-2 h-1 bg-black/30 rounded-full overflow-hidden">
                    <motion.div animate={{ width: `${node.progress}%` }} className="h-full rounded-full" style={{ backgroundColor: sc.border }} />
                  </div>
                  <div className="flex justify-between px-3 mt-1">
                    <span className="text-[9px] opacity-60">{node.timeEstimate}</span>
                    <span className="text-[9px] opacity-60">{node.xp} XP</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Minimap */}
          <div className="absolute bottom-4 right-4 w-48 h-32 bg-black/80 border border-white/10 rounded-lg overflow-hidden z-20 pointer-events-auto">
            <div className="relative w-full h-full">
              {state.nodes.map(n => {
                const sc = STATUS_COLORS[n.status];
                return <div key={n.id} className="absolute rounded-sm" style={{ left: `${(n.x / 30)}%`, top: `${(n.y / 20)}%`, width: 12, height: 5, backgroundColor: sc.border, opacity: 0.8 }} />;
              })}
              <div className="absolute border border-primary/40 rounded-sm" style={{ left: `${(-pan.x / 30)}%`, top: `${(-pan.y / 20)}%`, width: `${(100 / zoom)}%`, height: `${(100 / zoom)}%` }} />
            </div>
          </div>
        </div>

        {/* Lasso group naming bar */}
        <AnimatePresence>
          {lassoNodes.length >= 2 && (
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/90 border border-white/10 rounded-xl px-4 py-2 backdrop-blur-md">
              <span className="text-xs text-zinc-400">{lassoNodes.length} nodes selected</span>
              <Input value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="Group name..." className="h-7 w-40 text-xs bg-white/5 border-white/10" />
              <Button size="sm" className="h-7 text-xs bg-primary" onClick={createGroup} disabled={!groupName.trim()}>Create Group</Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setLassoNodes([]); setLasso(null); }}><X size={12} /></Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Side Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.aside initial={{ x: 320, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 320, opacity: 0 }} transition={{ type: "spring", damping: 25 }}
              className="w-80 bg-zinc-950/95 border-l border-white/10 flex flex-col overflow-y-auto backdrop-blur-xl z-20 flex-shrink-0"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="text-sm font-bold text-white">Node Details</h3>
                <Button size="sm" variant="ghost" onClick={() => setSelected(null)}><X size={14} /></Button>
              </div>
              <div className="p-4 space-y-4 flex-1">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Title</label>
                  <Input value={selectedNode.title} onChange={e => updateNode(selectedNode.id, { title: e.target.value })} className="mt-1 bg-white/5 border-white/10 text-white" />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Status</label>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    {(["locked", "unlocked", "in-progress", "complete"] as const).map(s => (
                      <button key={s} onClick={() => {
                        const xp = s === "complete" ? 100 : s === "in-progress" ? Math.min(selectedNode.xp, 60) : 0;
                        const progress = s === "complete" ? 100 : s === "in-progress" ? Math.max(selectedNode.progress, 10) : 0;
                        updateNode(selectedNode.id, { status: s, xp, progress });
                      }}
                        className={`text-[10px] py-1.5 rounded-lg border font-bold uppercase tracking-wider transition-all ${selectedNode.status === s ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-zinc-500 hover:border-white/20"}`}
                      >{s}</button>
                    ))}
                  </div>
                </div>
                {selectedNode.status === "in-progress" && (
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Progress: {selectedNode.progress}%</label>
                    <input type="range" min={0} max={100} value={selectedNode.progress} onChange={e => updateNode(selectedNode.id, { progress: +e.target.value, xp: Math.round(+e.target.value * 0.6) })} className="w-full mt-1 accent-primary" />
                  </div>
                )}
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Notes</label>
                  <textarea value={selectedNode.notes} onChange={e => updateNode(selectedNode.id, { notes: e.target.value })} rows={3} className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Time Estimate</label>
                  <Input value={selectedNode.timeEstimate} onChange={e => updateNode(selectedNode.id, { timeEstimate: e.target.value })} className="mt-1 bg-white/5 border-white/10 text-white" />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest">Resources</label>
                  {selectedNode.resources.map((r, i) => (
                    <div key={i} className="flex gap-1 mt-1">
                      <Input value={r} onChange={e => { const res = [...selectedNode.resources]; res[i] = e.target.value; updateNode(selectedNode.id, { resources: res }); }} className="bg-white/5 border-white/10 text-white text-xs flex-1" />
                      <Button size="sm" variant="ghost" onClick={() => updateNode(selectedNode.id, { resources: selectedNode.resources.filter((_, j) => j !== i) })}><X size={12} /></Button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" className="mt-1 w-full text-xs border-white/10" onClick={() => updateNode(selectedNode.id, { resources: [...selectedNode.resources, ""] })}>+ Add Link</Button>
                </div>
              </div>
              <div className="p-4 border-t border-white/10">
                <Button variant="destructive" size="sm" className="w-full gap-1" onClick={() => deleteNode(selectedNode.id)}>
                  <Trash2 size={14} /> Delete Node
                </Button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
