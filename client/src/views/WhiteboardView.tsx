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
  Compass
} from 'lucide-react';
import { Project, WorkflowView, WorkflowNode, WorkflowEdge } from '../types';
import { SketchBox } from '../components/SketchBox';
import { NodeDetailPanel } from '../components/NodeDetailPanel';

interface WhiteboardViewProps {
  project: Project;
}

const VIEW_METADATA: Record<
  WorkflowView,
  { label: string; description: string; icon: any; color: string }
> = {
  system_architecture: {
    label: 'System Architecture',
    description: 'High-level component topology: Browser -> API Routes -> Controllers -> Services -> Database.',
    icon: Layers,
    color: '#1d4ed8'
  },
  request_lifecycle: {
    label: 'Request Lifecycle',
    description: 'Traces how user actions trigger HTTP dispatches, route middleware, and response renders.',
    icon: ArrowRight,
    color: '#15803d'
  },
  data_lifecycle: {
    label: 'Data Lifecycle',
    description: 'Follows data from user form input, sanitization, hashing, to disk persistence.',
    icon: Database,
    color: '#b45309'
  },
  auth_lifecycle: {
    label: 'Auth & Security Lifecycle',
    description: 'Credentials transmission, timing-safe bcrypt hash check, JWT minting, and route guards.',
    icon: Shield,
    color: '#6d28d9'
  },
  error_handling: {
    label: 'Error Recovery Flow',
    description: 'How exceptions are caught by global error middleware without leaking credentials to client.',
    icon: Server,
    color: '#b91c1c'
  },
  deployment: {
    label: 'Deployment Workflow',
    description: 'Build artifacts, Docker containerization, environment injection, and reverse proxy runtime.',
    icon: Compass,
    color: '#4b5563'
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
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.6), 1.8));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'user_interaction':
      case 'ui_component':
        return { border: '#1d4ed8', bg: '#eff6ff', tag: 'UI / Client' };
      case 'api_request':
      case 'backend_route':
        return { border: '#15803d', bg: '#f0fdf4', tag: 'API Route' };
      case 'controller':
      case 'service':
        return { border: '#6d28d9', bg: '#f5f3ff', tag: 'Service Logic' };
      case 'db_operation':
        return { border: '#b45309', bg: '#fefce8', tag: 'Database Layer' };
      case 'auth_step':
        return { border: '#4338ca', bg: '#e0e7ff', tag: 'Security Guard' };
      case 'error_handler':
        return { border: '#b91c1c', bg: '#fef2f2', tag: 'Error Middleware' };
      default:
        return { border: '#2b2f33', bg: '#ffffff', tag: 'Runtime Node' };
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-[#faf9f5]">
      {/* Top Workflow Control Bar */}
      <div className="px-4 py-2.5 bg-white border-b-2 border-[#2b2f33] flex flex-wrap items-center justify-between gap-3 shrink-0 z-20">
        {/* Workflow View Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-mono font-bold text-[#5c6770] flex items-center gap-1 pr-1">
            <Filter size={13} />
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
                className={`sketch-btn sketch-btn-sm text-xs ${
                  isActive
                    ? 'sketch-btn-primary'
                    : 'sketch-btn-outline bg-white hover:bg-[#f1ede4]'
                }`}
              >
                <Icon size={13} />
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>

        {/* Canvas Controls */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono text-[#5c6770] hidden sm:inline">
            Zoom: {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => handleZoom(0.15)}
            className="sketch-btn sketch-btn-sm p-1.5"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => handleZoom(-0.15)}
            className="sketch-btn sketch-btn-sm p-1.5"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={resetView}
            className="sketch-btn sketch-btn-sm p-1.5"
            title="Reset Pan & Zoom"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* View Explanatory Sub-banner */}
      <div className="bg-[#fdfcf9] border-b border-[#e5dfd3] px-4 py-1.5 flex items-center justify-between text-xs text-[#5c6770]">
        <div className="flex items-center gap-2">
          <Info size={13} className="text-[#1d4ed8]" />
          <span>{currentMeta.description}</span>
        </div>
        <span className="hand-annotation text-xs text-[#854d0e] hidden md:inline">
          click any box to inspect full 15 viva parameters
        </span>
      </div>

      {/* Whiteboard Interactive Canvas */}
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
            style={{ width: '3000px', height: '2000px' }}
          >
            <defs>
              <marker
                id="sketch-arrow"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#2b2f33" stroke="#2b2f33" />
              </marker>
            </defs>

            {workflow.edges.map((edge) => {
              const srcNode = workflow.nodes.find((n) => n.id === edge.source);
              const tgtNode = workflow.nodes.find((n) => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              const x1 = (srcNode.x || 100) + 240;
              const y1 = (srcNode.y || 200) + 70;
              const x2 = tgtNode.x || 400;
              const y2 = (tgtNode.y || 200) + 70;
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              return (
                <g key={edge.id}>
                  {/* Straight graphite line connector */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#2b2f33"
                    strokeWidth="2.5"
                    strokeDasharray={edge.confidence === 'inferred' ? '4 3' : undefined}
                    markerEnd="url(#sketch-arrow)"
                  />
                  {/* Connector Label */}
                  {edge.label && (
                    <g transform={`translate(${midX}, ${midY - 12})`}>
                      <rect
                        x="-60"
                        y="-10"
                        width="120"
                        height="20"
                        fill="#faf9f5"
                        stroke="#2b2f33"
                        strokeWidth="1"
                        rx="4"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fontFamily="var(--font-mono)"
                        fontSize="10"
                        fill="#333"
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
            const style = getNodeColor(node.nodeType);
            const posX = node.x || 100;
            const posY = node.y || 200;

            return (
              <div
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(node);
                }}
                className={`whiteboard-node absolute w-64 bg-white border-2 border-[#2b2f33] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] p-3.5 cursor-pointer shadow-[3px_4px_0px_#2b2f33] hover:translate-y-[-2px] hover:shadow-[4px_6px_0px_#2b2f33] transition-all select-none ${
                  isSelected ? 'ring-3 ring-[#1d4ed8] scale-102 bg-[#fbfcff]' : ''
                }`}
                style={{
                  left: `${posX}px`,
                  top: `${posY}px`
                }}
              >
                {/* Node Tag & Badge */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span
                    className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded border"
                    style={{
                      borderColor: style.border,
                      backgroundColor: style.bg,
                      color: style.border
                    }}
                  >
                    {style.tag}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-[#777]">
                    {node.confidence}
                  </span>
                </div>

                {/* Node Label */}
                <h4 className="font-mono font-bold text-xs text-[#1f2421] leading-snug mb-1">
                  {node.label}
                </h4>

                {/* Purpose Brief */}
                <p className="text-[11px] text-[#4b5563] line-clamp-2 leading-relaxed mb-2.5">
                  {node.purpose}
                </p>

                {/* File Path Pill */}
                <div className="bg-[#f8f9fa] border border-[#2b2f33] rounded px-1.5 py-0.5 text-[10px] font-mono text-[#333] truncate flex items-center justify-between">
                  <span className="truncate">{node.filePath}</span>
                  <span className="text-[#1d4ed8] font-bold text-[9px] ml-1">Inspect →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Whiteboard Minimap / Legend Floating Box */}
        <div className="absolute left-4 bottom-4 z-20 hidden md:block">
          <SketchBox variant="subtle" className="p-3 bg-white/95 backdrop-blur-xs text-xs font-mono max-w-xs">
            <span className="font-bold text-[#1f2421] block mb-1">
              Whiteboard Legend
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[#5c6770]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#eff6ff] border border-[#1d4ed8]" />
                <span>UI Component</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f0fdf4] border border-[#15803d]" />
                <span>Route / Gateway</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f5f3ff] border border-[#6d28d9]" />
                <span>Service Logic</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fefce8] border border-[#b45309]" />
                <span>Database / Schema</span>
              </div>
            </div>
          </SketchBox>
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
