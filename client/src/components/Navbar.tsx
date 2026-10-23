import React from 'react';
import {
  LayoutDashboard,
  GitGraph,
  BookOpen,
  ShieldAlert,
  Mic,
  FileDown,
  Plus
} from 'lucide-react';
import { Project } from '../types';

export type ActiveTab = 'dashboard' | 'whiteboard' | 'docs' | 'quality' | 'interview';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  projects: Project[];
  currentProject: Project | null;
  onSelectProject: (id: string) => void;
  onOpenNewModal: () => void;
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  projects,
  currentProject,
  onSelectProject,
  onOpenNewModal,
  onOpenReportModal
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#070a12]/95 backdrop-blur-xl border-b border-slate-800 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.7)]">
      <div className="max-w-[1440px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#6366f1] to-[#06b6d4] flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform">
              <span className="font-mono font-extrabold text-base text-white">V</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight font-mono text-white">
                  Viva-Bachao
                </span>
                <span className="badge-shine badge-blue text-[10px] py-0 px-1.5">
                  PRO
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                engineering intelligence & viva defense studio
              </span>
            </div>
          </div>

          {/* Project Switcher */}
          {projects.length > 0 && (
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-700/60">
              <span className="text-xs font-mono text-slate-400">Target:</span>
              <select
                value={currentProject?.id || ''}
                onChange={(e) => onSelectProject(e.target.value)}
                className="input-modern py-1 px-2.5 text-xs font-mono bg-slate-900/90 text-slate-200 border-slate-700 font-semibold cursor-pointer max-w-[220px] truncate"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.name} ({p.mainLanguage})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`btn-modern btn-sm ${
              activeTab === 'dashboard'
                ? 'btn-primary'
                : 'bg-slate-900/60 text-slate-300 hover:text-white'
            }`}
          >
            <LayoutDashboard size={14} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('whiteboard')}
            disabled={!currentProject}
            className={`btn-modern btn-sm ${
              activeTab === 'whiteboard'
                ? 'btn-primary'
                : 'bg-slate-900/60 text-slate-300 hover:text-white'
            } ${!currentProject ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <GitGraph size={14} />
            <span>Whiteboard</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            disabled={!currentProject}
            className={`btn-modern btn-sm ${
              activeTab === 'docs'
                ? 'btn-primary'
                : 'bg-slate-900/60 text-slate-300 hover:text-white'
            } ${!currentProject ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <BookOpen size={14} />
            <span>15-Ch Docs</span>
          </button>

          <button
            onClick={() => setActiveTab('quality')}
            disabled={!currentProject}
            className={`btn-modern btn-sm ${
              activeTab === 'quality'
                ? 'btn-primary'
                : 'bg-slate-900/60 text-slate-300 hover:text-white'
            } ${!currentProject ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <ShieldAlert size={14} />
            <span>Audit & Quality</span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            disabled={!currentProject}
            className={`btn-modern btn-sm ${
              activeTab === 'interview'
                ? 'btn-primary'
                : 'bg-slate-900/60 text-slate-300 hover:text-white'
            } ${!currentProject ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <Mic size={14} />
            <span>Viva Studio</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {currentProject && (
            <button
              onClick={onOpenReportModal}
              className="btn-modern btn-sm border-indigo-500/40 text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/60 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              title="Download Printable PDF / Markdown Report"
            >
              <FileDown size={14} />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          )}

          <button
            onClick={onOpenNewModal}
            className="btn-modern btn-primary btn-sm"
          >
            <Plus size={14} />
            <span>Analyze Repo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
