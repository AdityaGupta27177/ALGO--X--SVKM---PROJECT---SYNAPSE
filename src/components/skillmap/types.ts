export interface SkillNode {
  id: string;
  x: number;
  y: number;
  title: string;
  notes: string;
  timeEstimate: string;
  resources: string[];
  status: 'locked' | 'unlocked' | 'in-progress' | 'complete';
  progress: number;
  group?: string;
  xp: number;
}

export interface Edge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export interface NodeGroup {
  id: string;
  name: string;
  nodeIds: string[];
  color: string;
}

export interface SkillMapState {
  nodes: SkillNode[];
  edges: Edge[];
  groups: NodeGroup[];
  totalXp: number;
}

export const GRID_SIZE = 20;
export const NODE_W = 200;
export const NODE_H = 80;

export const STATUS_COLORS: Record<SkillNode['status'], { bg: string; border: string; text: string; glow: string }> = {
  locked:      { bg: '#1a1a2e', border: '#2a2a3e', text: '#555', glow: 'none' },
  unlocked:    { bg: '#1a1a3e', border: '#6366f1', text: '#c4b5fd', glow: '0 0 20px rgba(99,102,241,0.3)' },
  'in-progress': { bg: '#1a2e1a', border: '#22c55e', text: '#86efac', glow: '0 0 20px rgba(34,197,94,0.3)' },
  complete:    { bg: '#2e2a1a', border: '#eab308', text: '#fde047', glow: '0 0 20px rgba(234,179,8,0.3)' },
};

export const GROUP_COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#06b6d4'];

export function snapToGrid(val: number): number {
  return Math.round(val / GRID_SIZE) * GRID_SIZE;
}

export function genId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// O(V+E) DAG cycle detection using DFS
export function wouldCreateCycle(edges: Edge[], fromId: string, toId: string): boolean {
  if (fromId === toId) return true;
  const adj: Record<string, string[]> = {};
  for (const e of edges) {
    if (!adj[e.from]) adj[e.from] = [];
    adj[e.from].push(e.to);
  }
  // Add proposed edge
  if (!adj[fromId]) adj[fromId] = [];
  adj[fromId].push(toId);

  const visited = new Set<string>();
  const stack = new Set<string>();

  function dfs(node: string): boolean {
    if (stack.has(node)) return true;
    if (visited.has(node)) return false;
    visited.add(node);
    stack.add(node);
    for (const neighbor of (adj[node] || [])) {
      if (dfs(neighbor)) return true;
    }
    stack.delete(node);
    return false;
  }

  return dfs(fromId);
}

// Automatically calculates the correct status for all nodes based on progress and DAG edges
export function propagateStatus(nodes: SkillNode[], edges: Edge[]): SkillNode[] {
  let changed = false;
  const newNodes = nodes.map(node => {
    let targetStatus: SkillNode['status'] = 'locked';
    
    if (node.progress === 100) {
      targetStatus = 'complete';
    } else if (node.progress > 0) {
      targetStatus = 'in-progress';
    } else {
      const incomingEdges = edges.filter(e => e.to === node.id);
      let allComplete = true;
      for (const e of incomingEdges) {
        const parent = nodes.find(n => n.id === e.from);
        // Progress must be 100 to be complete
        if (!parent || parent.progress !== 100) {
          allComplete = false;
          break;
        }
      }
      targetStatus = allComplete ? 'unlocked' : 'locked';
    }

    if (node.status !== targetStatus) {
      changed = true;
      return { ...node, status: targetStatus };
    }
    return node;
  });

  return changed ? newNodes : nodes;
}

export function getDefaultState(): SkillMapState {
  return {
    nodes: [
      { id: 'n1', x: 200, y: 100, title: 'Variables & Types', notes: 'Learn C++ data types', timeEstimate: '30 min', resources: [], status: 'complete', progress: 100, xp: 100 },
      { id: 'n2', x: 500, y: 100, title: 'Control Flow', notes: 'If/else and loops', timeEstimate: '45 min', resources: [], status: 'complete', progress: 100, xp: 100 },
      { id: 'n3', x: 350, y: 280, title: 'Functions', notes: 'Reusable code blocks', timeEstimate: '40 min', resources: [], status: 'in-progress', progress: 60, xp: 60 },
      { id: 'n4', x: 150, y: 440, title: 'Arrays', notes: 'Data collections', timeEstimate: '35 min', resources: [], status: 'unlocked', progress: 0, xp: 0 },
      { id: 'n5', x: 550, y: 440, title: 'Pointers', notes: 'Memory addresses', timeEstimate: '60 min', resources: [], status: 'locked', progress: 0, xp: 0 },
    ],
    edges: [
      { id: 'e1', from: 'n1', to: 'n3' },
      { id: 'e2', from: 'n2', to: 'n3' },
      { id: 'e3', from: 'n3', to: 'n4' },
      { id: 'e4', from: 'n3', to: 'n5' },
    ],
    groups: [],
    totalXp: 360,
  };
}
