import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Info,
  ArrowRight,
  Shield,
  Database,
  Server,
  Layers,
  Compass,
  FileCode,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Project, WorkflowView, WorkflowNode, WorkflowEdge } from '../types';
import { NodeDetailPanel } from '../components/NodeDetailPanel';

interface WhiteboardViewProps {
  project: Project;
}

const VIEW_METADATA: Record<
  WorkflowView,
  { label: string; description: string; icon: any; accentColor: string; badgeClass: string }
> = {
  system_architecture: {
    label: 'System Architecture',
    description: 'High-level component topology: Browser -> API Routes -> Controllers -> Services -> Database.',
    icon: Layers,
    accentColor: '#6366f1',
    badgeClass: 'badge-blue'
  },
  request_lifecycle: {
    label: 'Request Lifecycle',
    description: 'Traces how user actions trigger HTTP dispatches, route middleware, and response renders.',
    icon: ArrowRight,
    accentColor: '#06b6d4',
    badgeClass: 'badge-cyan'
  },
  data_lifecycle: {
    label: 'Data Lifecycle',
    description: 'Follows data from user form input, sanitization, hashing, to disk persistence.',
    icon: Database,
    accentColor: '#f59e0b',
    badgeClass: 'badge-amber'
  },
  auth_lifecycle: {
    label: 'Auth & Security Lifecycle',
    description: 'Credentials transmission, timing-safe bcrypt hash check, JWT minting, and route guards.',
    icon: Shield,
    accentColor: '#10b981',
    badgeClass: 'badge-green'
  },
  error_handling: {
    label: 'Error Recovery Flow',
    description: 'How exceptions are caught by global error middleware without leaking credentials to client.',
    icon: Server,
    accentColor: '#f43f5e',
    badgeClass: 'badge-red'
  },
  deployment: {
    label: 'Deployment Workflow',
    description: 'Build artifacts, Docker containerization, environment injection, and reverse proxy runtime.',
    icon: Compass,
    accentColor: '#a855f7',
    badgeClass: 'badge-purple'
  }
};

export const WhiteboardView: React.FC<WhiteboardViewProps> = ({ project }) => {
  const [currentView, setCurrentView] = useState<WorkflowView>('system_architecture');
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const analysis = project.currentAnalysis;
  const workflow = analysis?.workflows[currentView] || { nodes: [], edges: [], viewType: currentView };
  const currentMeta = VIEW_METADATA[currentView];

  // Mouse pan handlers for engineering whiteboard
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.whiteboard-node')) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.5), 1.8));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getNodeStyle = (type: string) => {
    switch (type) {
      case 'user_interaction':
      case 'ui_component':
        return {
          border: 'border-cyan-500/40 hover:border-cyan-400',
          glow: 'hover:shadow-[0_0_24px_rgba(6,182,212,0.25)]',
          badge: 'badge-cyan',
          accent: '#06b6d4',
          tag: 'UI Component'
        };
      case 'api_request':
      case 'backend_route':
        return {
          border: 'border-emerald-500/40 hover:border-emerald-400',
          glow: 'hover:shadow-[0_0_24px_rgba(16,185,129,0.25)]',
          badge: 'badge-green',
          accent: '#10b981',
          tag: 'API Route'
        };
      case 'controller':
      case 'service':
        return {
          border: 'border-indigo-500/40 hover:border-indigo-400',
          glow: 'hover:shadow-[0_0_24px_rgba(99,102,241,0.25)]',
          badge: 'badge-blue',
          accent: '#6366f1',
          tag: 'Core Service'
        };
      case 'db_operation':
        return {
          border: 'border-amber-500/40 hover:border-amber-400',
          glow: 'hover:shadow-[0_0_24px_rgba(245,158,11,0.25)]',
          badge: 'badge-amber',
          accent: '#f59e0b',
          tag: 'Database Layer'
        };
      case 'auth_step':
        return {
          border: 'border-purple-500/40 hover:border-purple-400',
          glow: 'hover:shadow-[0_0_24px_rgba(168,85,247,0.25)]',
          badge: 'badge-purple',
          accent: '#a855f7',
          tag: 'Security Guard'
        };
      case 'error_handler':
        return {
          border: 'border-rose-500/40 hover:border-rose-400',
          glow: 'hover:shadow-[0_0_24px_rgba(244,63,94,0.25)]',
          badge: 'badge-red',
          accent: '#f43f5e',
          tag: 'Error Handler'
        };
      default:
        return {
          border: 'border-slate-700 hover:border-slate-500',
          glow: 'hover:shadow-[0_0_20px_rgba(148,163,184,0.15)]',
          badge: 'badge-blue',
          accent: '#94a3b8',
          tag: 'Runtime Node'
        };
    }
  };

  return (
    <div className="whiteboard-container bg-[#070a12] text-slate-100 overflow-hidden">
      {/* Top Workflow Control Bar */}
      <div className="px-5 py-2.5 bg-[#0a0f1d]/90 backdrop-blur-md border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 shrink-0 z-20 shadow-md">
        {/* Workflow View Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-1.5 pr-2">
            <Filter size={13} className="text-cyan-400" />
            <span>Workflow:</span>
          </span>
          {(Object.keys(VIEW_METADATA) as WorkflowView[]).map((viewKey) => {
            const meta = VIEW_METADATA[viewKey];
            const Icon = meta.icon;
            const isActive = currentView === viewKey;
            return (
              <button
                key={viewKey}
                onClick={() => {
                  setCurrentView(viewKey);
                  setSelectedNode(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-cyan-400/40 font-bold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/60'
                }`}
              >
                <Icon size={13} className={isActive ? 'text-cyan-200' : 'text-slate-400'} />
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>

        {/* Canvas Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline px-2 py-1 rounded bg-slate-900/60 border border-slate-800/60">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => handleZoom(0.15)}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => handleZoom(-0.15)}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors"
            title="Reset Pan & Zoom"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* View Explanatory Sub-banner */}
      <div className="bg-[#0b1222]/80 backdrop-blur-sm border-b border-slate-800/60 px-5 py-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info size={14} className="text-cyan-400 shrink-0" />
          <span className="font-sans text-slate-300">{currentMeta.description}</span>
        </div>
        <div className="flex items-center gap-2 hidden md:flex font-mono text-[11px] text-cyan-400/90">
          <Sparkles size={13} className="text-cyan-400" />
          <span>Click any component node to inspect 15 viva defense parameters</span>
        </div>
      </div>

      {/* Whiteboard Interactive Canvas with Dark Cyber Grid */}
      <div
        className="flex-1 whiteboard-canvas relative cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Render Graph Container with Transform */}
        <div
          className="absolute inset-0 transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {/* SVG Connector Lines Layer */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ width: '3600px', height: '2400px' }}
          >
            <defs>
              {/* Luminous Glowing Marker */}
              <marker
                id="cyan-glow-arrow"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#06b6d4" />
              </marker>
              <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#06b6d4" floodOpacity="0.4" />
              </filter>
            </defs>

            {workflow.edges.map((edge) => {
              const srcNode = workflow.nodes.find((n) => n.id === edge.source);
              const tgtNode = workflow.nodes.find((n) => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              const x1 = (srcNode.x || 100) + 260;
              const y1 = (srcNode.y || 200) + 75;
              const x2 = tgtNode.x || 420;
              const y2 = (tgtNode.y || 200) + 75;
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              return (
                <g key={edge.id}>
                  {/* Subtle Neon Line Connector */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#06b6d4"
                    strokeWidth="2"
                    strokeOpacity="0.65"
                    strokeDasharray={edge.confidence === 'inferred' ? '5 4' : undefined}
                    markerEnd="url(#cyan-glow-arrow)"
                    filter="url(#neon-glow)"
                  />
                  {/* Connector Label Pill */}
                  {edge.label && (
                    <g transform={`translate(${midX}, ${midY - 14})`}>
                      <rect
                        x="-70"
                        y="-11"
                        width="140"
                        height="22"
                        fill="#0b1329"
                        stroke="#1e293b"
                        strokeWidth="1"
                        rx="6"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fontFamily="var(--font-mono)"
                        fontSize="10"
                        fill="#94a3b8"
                        fontWeight="600"
                      >
                        {edge.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Whiteboard Nodes Layer */}
          {workflow.nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const style = getNodeStyle(node.nodeType);
            const posX = node.x || 100;
            const posY = node.y || 200;

            return (
              <div
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(node);
                }}
                className={`whiteboard-node glass-card p-4 rounded-xl border ${style.border} ${style.glow} ${
                  isSelected ? 'whiteboard-node-selected ring-2 ring-cyan-400' : ''
                }`}
                style={{
                  left: `${posX}px`,
                  top: `${posY}px`
                }}
              >
                {/* Node Top Header */}
                <div className="flex items-center justify-between gap-1 mb-2.5">
                  <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                    {style.tag}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    {node.confidence}
                  </span>
                </div>

                {/* Node Label */}
                <h4 className="font-mono font-bold text-sm text-white leading-snug mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: style.accent }} />
                  <span className="truncate">{node.label}</span>
                </h4>

                {/* Purpose Brief */}
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3 font-sans">
                  {node.purpose}
                </p>

                {/* File Path & Inspect Callout */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-400 flex items-center justify-between group">
                  <div className="flex items-center gap-1.5 truncate">
                    <FileCode size={12} className="text-cyan-400 shrink-0" />
                    <span className="truncate">{node.filePath}</span>
                  </div>
                  <span className="text-cyan-400 font-semibold text-[10px] ml-1 shrink-0 flex items-center gap-0.5">
                    Inspect <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Whiteboard Legend Floating Glass Box */}
        <div className="absolute left-5 bottom-5 z-20 hidden md:block">
          <div className="glass-card p-4 rounded-xl text-xs font-mono max-w-xs border border-slate-800/80 shadow-2xl">
            <span className="font-bold text-white block mb-2 tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Workflow Node Legend
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                <span>UI Component</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span>Route / Gateway</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                <span>Service Logic</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                <span>Database / I/O</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side Inspector Drawer */}
      <NodeDetailPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
};
