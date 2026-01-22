
import React, { useMemo } from 'react';

interface RouteMapProps {
  origin: 'SG' | 'JB' | 'KL';
  destination?: string | null;
}

// 1. Define Nodes (Schematic Map Coordinates 0-100)
// Simplified to represent relative positions on the peninsula
const COORDS: Record<string, { x: number; y: number; label: string; align?: string; hidden?: boolean }> = {
  // North
  penang: { x: 20, y: 10, label: 'Penang', align: 'end' },
  taiping: { x: 28, y: 18, label: 'Taiping', align: 'end' },
  ipoh: { x: 35, y: 25, label: 'Ipoh', align: 'end' },
  kuala_kangsar: { x: 32, y: 22, label: '', hidden: true }, // Waypoint
  
  // Perak Surrounds
  kampar: { x: 40, y: 28, label: 'Kampar', align: 'start' },
  setiawan: { x: 25, y: 28, label: 'Setiawan', align: 'end' },
  cameron: { x: 50, y: 25, label: 'Cameron', align: 'start' },
  
  // Central
  genting: { x: 55, y: 40, label: 'Genting', align: 'start' },
  kl: { x: 40, y: 45, label: 'Kuala Lumpur', align: 'end' },
  seremban: { x: 45, y: 55, label: 'Seremban', align: 'end' },
  
  // South - Northern Johor / Melaka
  malacca: { x: 35, y: 65, label: 'Malacca', align: 'end' },
  muar: { x: 30, y: 70, label: 'Muar', align: 'end' },
  segamat: { x: 48, y: 65, label: 'Segamat', align: 'start' },
  
  // South - Central Johor Hubs
  yong_peng: { x: 50, y: 75, label: 'Yong Peng', align: 'start' },
  batu_pahat: { x: 38, y: 78, label: 'Batu Pahat', align: 'end' },
  kluang: { x: 58, y: 72, label: 'Kluang', align: 'start' },
  
  // South - Southern Johor
  kulai: { x: 55, y: 82, label: '', hidden: true }, // Waypoint
  kota_tinggi: { x: 65, y: 80, label: 'Kota Tinggi', align: 'start' },
  mersing: { x: 75, y: 68, label: 'Mersing', align: 'start' },
  desaru: { x: 72, y: 88, label: 'Desaru', align: 'start' },
  jb: { x: 55, y: 88, label: 'Johor Bahru', align: 'start' },
  
  // Singapore
  sg: { x: 55, y: 95, label: 'Singapore', align: 'start' },
};

// 2. Define Connections (The Graph)
const EDGES = [
  // SG -> JB
  ['sg', 'jb'],
  
  // JB Surrounds
  ['jb', 'kulai'], // Northbound Highway
  ['jb', 'desaru'], // Eastbound
  ['jb', 'kota_tinggi'],
  ['kota_tinggi', 'mersing'], // Route to Mersing usually via KT
  
  // Johor Highway Backbone
  ['kulai', 'yong_peng'],
  
  // Yong Peng Hub (Central Johor distribution)
  ['yong_peng', 'batu_pahat'],
  ['yong_peng', 'kluang'],
  ['yong_peng', 'segamat'],
  ['yong_peng', 'malacca'], // Highway continues North to Malacca
  
  // Malacca Region
  ['malacca', 'muar'],
  ['malacca', 'seremban'], // Highway North
  ['segamat', 'seremban'], // Inland route alternative (visual simplification)
  
  // Central Region
  ['seremban', 'kl'],
  ['kl', 'genting'],
  
  // Going North
  ['kl', 'kampar'], // Visual path north
  ['kampar', 'ipoh'],
  ['kl', 'cameron'], // Direct visual link
  ['ipoh', 'cameron'], // Access from Simpang Pulai
  
  // Perak Region
  ['ipoh', 'setiawan'],
  ['ipoh', 'kuala_kangsar'],
  ['kuala_kangsar', 'taiping'],
  ['taiping', 'penang']
];

// Helper: Get unique ID for an edge to track active state
const getEdgeId = (n1: string, n2: string) => [n1, n2].sort().join('-');

// 3. String Normalization
const getNodeID = (loc: string): string => {
  if (!loc) return '';
  const l = loc.toLowerCase();
  
  if (l.includes('singapore')) return 'sg';
  if (l.includes('desaru')) return 'desaru';
  if (l.includes('mersing') || l.includes('tioman')) return 'mersing';
  if (l.includes('kota tinggi')) return 'kota_tinggi';
  if (l.includes('legoland') || l.includes('senai') || l.includes('johor') || l.includes('jb')) return 'jb';
  
  if (l.includes('kluang')) return 'kluang';
  if (l.includes('batu pahat')) return 'batu_pahat';
  if (l.includes('yong peng')) return 'yong_peng';
  if (l.includes('muar')) return 'muar';
  if (l.includes('segamat')) return 'segamat';
  
  if (l.includes('malacca') || l.includes('melaka')) return 'malacca';
  if (l.includes('seremban')) return 'seremban';
  if (l.includes('sepang') || l.includes('klia') || l.includes('airport')) return 'kl'; // KLIA visualizes to KL hub
  if (l.includes('kuala lumpur') || l.includes('kl') || l.includes('city')) return 'kl';
  
  if (l.includes('genting')) return 'genting';
  if (l.includes('cameron')) return 'cameron';
  
  if (l.includes('kampar')) return 'kampar';
  if (l.includes('setiawan') || l.includes('sitiawan')) return 'setiawan';
  if (l.includes('taiping')) return 'taiping';
  if (l.includes('ipoh')) return 'ipoh';
  if (l.includes('penang')) return 'penang';

  return '';
};

// 4. BFS Pathfinding Algorithm
const findPath = (start: string, end: string): Set<string> => {
  const activeEdges = new Set<string>();
  if (!start || !end || start === end) return activeEdges;
  if (!COORDS[start] || !COORDS[end]) return activeEdges;

  // Build Adjacency List
  const adj: Record<string, string[]> = {};
  EDGES.forEach(([a, b]) => {
    if (!adj[a]) adj[a] = [];
    if (!adj[b]) adj[b] = [];
    adj[a].push(b);
    adj[b].push(a);
  });

  // BFS
  const queue = [start];
  const visited = new Set<string>([start]);
  const parent: Record<string, string> = {};
  let found = false;

  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr === end) {
      found = true;
      break;
    }
    for (const neighbor of (adj[curr] || [])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent[neighbor] = curr;
        queue.push(neighbor);
      }
    }
  }

  // Reconstruct path
  if (found) {
    let curr = end;
    while (curr !== start) {
      const p = parent[curr];
      activeEdges.add(getEdgeId(p, curr));
      curr = p;
    }
  }

  return activeEdges;
};

export const RouteMap: React.FC<RouteMapProps> = ({ origin, destination }) => {
  const originNode = getNodeID(origin === 'SG' ? 'Singapore' : origin === 'JB' ? 'Johor Bahru' : 'Kuala Lumpur');
  const targetNode = getNodeID(destination || '');

  // Calculate active segments dynamically using BFS
  const activeSegments = useMemo(() => {
    return findPath(originNode, targetNode);
  }, [originNode, targetNode]);

  return (
    <div className="w-full h-[360px] md:h-[500px] relative bg-slate-50 rounded-3xl border border-dashed border-slate-200 overflow-hidden flex items-center justify-center mb-8 shadow-inner select-none">
      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0f766e 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Oversized Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] md:text-[200px] font-black text-slate-100 pointer-events-none tracking-tighter leading-none opacity-60">
        MAP
      </div>

      <svg viewBox="0 0 100 100" className="w-full h-full max-w-lg relative z-10" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="activeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
        </defs>

        {/* 1. Render All Connected Lines (Gray Background) */}
        {EDGES.map(([n1, n2]) => {
          const start = COORDS[n1];
          const end = COORDS[n2];
          if (!start || !end) return null;
          return (
            <path
              key={`bg-${n1}-${n2}`}
              d={`M${start.x},${start.y} L${end.x},${end.y}`}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          );
        })}

        {/* 2. Render Active Path (Animated Gradient) */}
        {EDGES.map(([n1, n2]) => {
          const id = getEdgeId(n1, n2);
          if (!activeSegments.has(id)) return null;
          
          const start = COORDS[n1];
          const end = COORDS[n2];
          
          return (
            <path
              key={`active-${id}`}
              d={`M${start.x},${start.y} L${end.x},${end.y}`}
              fill="none"
              stroke="url(#activeGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset="100"
              className="animate-draw drop-shadow-md"
            />
          );
        })}

        {/* 3. Render Nodes */}
        {Object.entries(COORDS).map(([id, pos]) => {
          if (pos.hidden) return null; // Skip rendering hidden waypoints
          
          const isOrigin = id === originNode;
          const isDest = id === targetNode;
          
          // Check if node is part of the active path
          let isActiveInPath = false;
          if (activeSegments.size > 0) {
             // A node is active if any active edge touches it
             isActiveInPath = EDGES.some(([n1, n2]) => activeSegments.has(getEdgeId(n1, n2)) && (n1 === id || n2 === id));
          } else {
             // If no path (e.g. idle), only highlight origin
             if (isOrigin) isActiveInPath = true;
          }

          // Determine visual style
          const r = isOrigin || isDest ? 2.5 : isActiveInPath ? 1.5 : 0.8;
          const fill = isOrigin ? "#0d9488" : isDest ? "#f43f5e" : isActiveInPath ? "#0f766e" : "#cbd5e1";
          const textFill = isOrigin ? "#0d9488" : isDest ? "#f43f5e" : isActiveInPath ? "#334155" : "#94a3b8";
          const fontWeight = isOrigin || isDest ? "900" : isActiveInPath ? "600" : "400";
          const fontSize = isOrigin || isDest ? "3.5" : isActiveInPath ? "2.5" : "2";

          return (
            <g key={id} className="transition-all duration-300">
               {/* Pulse Ring for Origin/Dest */}
               {(isOrigin || isDest) && (
                 <circle cx={pos.x} cy={pos.y} r="6" fill={fill} opacity="0.2">
                    <animate attributeName="r" values="3;8;3" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                 </circle>
               )}
               
               {/* Node Dot */}
               <circle cx={pos.x} cy={pos.y} r={r} fill={fill} className="transition-colors duration-300" />
               
               {/* Label */}
               {pos.label && (
                 <text 
                    x={pos.x + (pos.align === 'end' ? -3 : 3)} 
                    y={pos.y + 0.8} 
                    fontSize={fontSize} 
                    textAnchor={pos.align === 'end' ? 'end' : 'start'}
                    fill={textFill} 
                    fontWeight={fontWeight}
                    className="transition-all duration-300 select-none font-sans"
                    style={{ textShadow: isOrigin || isDest || isActiveInPath ? '0 1px 3px rgba(255,255,255,1)' : 'none' }}
                 >
                   {pos.label}
                 </text>
               )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
