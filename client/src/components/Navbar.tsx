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
    <header className="sticky top-0 z-40 bg-[#fbfaf6] border-b-2 border-[#2b2f33] shadow-[0_2px_0_rgba(43,47,51,0.15)]">
      <div className="max-w-[1440px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 border-2 border-[#222] rounded-[15px_225px_15px_255px/255px_15px_225px_15px] bg-[#fff] flex items-center justify-center shadow-[1px_2px_0_#222] group-hover:rotate-3 transition-transform">
              <span className="font-mono font-bold text-lg text-[#222]">V</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight font-mono text-[#1f2421]">
                  Viva-Bachao
                </span>
                <span className="text-[10px] font-mono uppercase bg-[#fef08a] border border-[#854d0e] px-1.5 py-0.2 rounded text-[#854d0e] font-semibold">
                  v1.0
                </span>
              </div>
              <span className="hand-annotation text-xs text-[#5c6770] hidden sm:inline">
                engineering viva defense whiteboard
              </span>
            </div>
          </div>

          {/* Project Switcher */}
          {projects.length > 0 && (
            <div className="hidden md:flex items-center gap-1.5 pl-3 border-l-2 border-[#2b2f33]">
              <span className="text-xs font-mono text-[#5c6770]">Active Repo:</span>
              <select
                value={currentProject?.id || ''}
                onChange={(e) => onSelectProject(e.target.value)}
                className="sketch-input py-1 px-2.5 text-xs font-mono bg-white font-semibold cursor-pointer max-w-[210px] truncate"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.mainLanguage})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`sketch-btn sketch-btn-sm ${
              activeTab === 'dashboard' ? 'sketch-btn-primary' : 'sketch-btn-outline'
            }`}
          >
            <LayoutDashboard size={14} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('whiteboard')}
            disabled={!currentProject}
            className={`sketch-btn sketch-btn-sm ${
              activeTab === 'whiteboard' ? 'sketch-btn-primary' : 'sketch-btn-outline'
            } ${!currentProject ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <GitGraph size={14} />
            <span>Whiteboard</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            disabled={!currentProject}
            className={`sketch-btn sketch-btn-sm ${
              activeTab === 'docs' ? 'sketch-btn-primary' : 'sketch-btn-outline'
            } ${!currentProject ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <BookOpen size={14} />
            <span>15-Ch Docs</span>
          </button>

          <button
            onClick={() => setActiveTab('quality')}
            disabled={!currentProject}
            className={`sketch-btn sketch-btn-sm ${
              activeTab === 'quality' ? 'sketch-btn-primary' : 'sketch-btn-outline'
            } ${!currentProject ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <ShieldAlert size={14} />
            <span>Audit & Quality</span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            disabled={!currentProject}
            className={`sketch-btn sketch-btn-sm ${
              activeTab === 'interview' ? 'sketch-btn-primary' : 'sketch-btn-outline'
            } ${!currentProject ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <Mic size={14} />
            <span>Interview Studio</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {currentProject && (
            <button
              onClick={onOpenReportModal}
              className="sketch-btn sketch-btn-sm border-[#1d4ed8] text-[#1d4ed8] bg-[#eff6ff] hover:bg-[#dbeafe]"
              title="Download Printable PDF / DOCX Report"
            >
              <FileDown size={14} />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          )}

          <button
            onClick={onOpenNewModal}
            className="sketch-btn sketch-btn-sm bg-[#222] text-white hover:bg-[#111]"
          >
            <Plus size={14} />
            <span>Analyze Repo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
