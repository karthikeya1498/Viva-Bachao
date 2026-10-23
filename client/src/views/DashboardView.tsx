import React, { useState } from 'react';
import {
  GitGraph,
  BookOpen,
  ShieldAlert,
  Mic,
  Clock,
  ExternalLink,
  Trash2,
  Search,
  Plus,
  Sparkles,
  FileCode2,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { Project } from '../types';
import { SketchBox } from '../components/SketchBox';

interface DashboardViewProps {
  projects: Project[];
  currentProject: Project | null;
  onSelectProject: (id: string) => void;
  onOpenNewModal: () => void;
  onDeleteProject: (id: string) => void;
  onNavigateTab: (tab: 'whiteboard' | 'docs' | 'quality' | 'interview') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  currentProject,
  onSelectProject,
  onOpenNewModal,
  onDeleteProject,
  onNavigateTab
}) => {
  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.owner.toLowerCase().includes(search.toLowerCase());
    const matchesLang =
      selectedLanguage === 'all' || p.mainLanguage.toLowerCase() === selectedLanguage.toLowerCase();
    return matchesSearch && matchesLang;
  });

  const allLanguages = Array.from(new Set(projects.map((p) => p.mainLanguage)));

  const analysis = currentProject?.currentAnalysis;
  const totalRoutes = analysis ? Object.values(analysis.workflows).reduce((acc, wf) => Math.max(acc, wf.nodes.filter(n => n.nodeType === 'backend_route').length), 0) : 0;
  const strengthsCount = analysis ? analysis.findings.filter((f) => f.category === 'strength').length : 0;
  const securityWarnings = analysis ? analysis.findings.filter((f) => f.category === 'security').length : 0;
  const totalQuestions = analysis ? analysis.interviewMaterials.questions.length : 0;

  return (
    <div className="container-paper space-y-6 pb-12">
      {/* Hero / Executive Studio Banner */}
      <SketchBox className="p-6 sm:p-8 relative overflow-hidden border-indigo-500/30 shadow-[0_0_50px_-10px_rgba(99,102,241,0.25)]">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/60 border border-indigo-500/40 rounded-full text-xs font-mono font-bold text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Sparkles size={13} className="text-cyan-400" />
            <span>Deterministic AST Intelligence & Viva Defense Studio</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-mono tracking-tight text-white leading-tight">
            Turn Any GitHub Repository Into An{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Explainable, High-Scoring Viva Project
            </span>
            .
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Reconstruct execution flows, trace every API route to storage rows, explore high-clarity engineering
            architecture whiteboards, and rehearse predictive examiner viva questions grounded strictly in your source code.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenNewModal}
              className="btn-modern btn-primary"
            >
              <Plus size={16} />
              <span>Analyze New Repository</span>
            </button>

            {currentProject && (
              <button
                onClick={() => onNavigateTab('whiteboard')}
                className="btn-modern bg-slate-800/80 hover:bg-slate-700/80 text-white border-slate-600"
              >
                <GitGraph size={16} className="text-cyan-400" />
                <span>Open {currentProject.name} Whiteboard</span>
              </button>
            )}
          </div>
        </div>

        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none text-indigo-400">
          <Cpu size={180} />
        </div>
      </SketchBox>

      {/* Active Project Quick Stats & Highlights */}
      {currentProject && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider font-bold text-slate-400">
                Active Repository:
              </span>
              <span className="font-mono text-xs font-bold text-cyan-400">
                {currentProject.owner} / {currentProject.name}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Revision: <strong className="text-indigo-400">{analysis?.revision || 'HEAD'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <SketchBox
              interactive
              onClick={() => onNavigateTab('whiteboard')}
              className="p-4"
            >
              <div className="flex items-center justify-between text-indigo-400 mb-1">
                <span className="text-xs font-mono font-bold">API Routes</span>
                <GitGraph size={16} />
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {totalRoutes > 0 ? totalRoutes : '5+'}
              </div>
              <span className="text-[11px] text-slate-400">Inspected endpoints</span>
            </SketchBox>

            <SketchBox
              interactive
              onClick={() => onNavigateTab('docs')}
              className="p-4"
            >
              <div className="flex items-center justify-between text-emerald-400 mb-1">
                <span className="text-xs font-mono font-bold">Documentation</span>
                <BookOpen size={16} />
              </div>
              <div className="text-2xl font-bold font-mono text-white">15 Chapters</div>
              <span className="text-[11px] text-slate-400">Beginner / Int / Advanced</span>
            </SketchBox>

            <SketchBox
              interactive
              onClick={() => onNavigateTab('quality')}
              className="p-4"
            >
              <div className="flex items-center justify-between text-amber-400 mb-1">
                <span className="text-xs font-mono font-bold">Security & Audit</span>
                <ShieldAlert size={16} />
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {securityWarnings} Findings
              </div>
              <span className="text-[11px] text-slate-400">
                {strengthsCount} verified strengths
              </span>
            </SketchBox>

            <SketchBox
              interactive
              onClick={() => onNavigateTab('interview')}
              className="p-4"
            >
              <div className="flex items-center justify-between text-purple-400 mb-1">
                <span className="text-xs font-mono font-bold">Predicted Viva</span>
                <Mic size={16} />
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {totalQuestions} Q&A
              </div>
              <span className="text-[11px] text-slate-400">Mock Examiner Simulator</span>
            </SketchBox>
          </div>
        </div>
      )}

      {/* Project Library Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-700/60">
          <div>
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
              <span>Repository Library</span>
              <span className="badge-shine badge-blue text-xs">
                {projects.length} Available
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Previously analyzed repositories stored in local persistence. Switch anytime to inspect.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search repositories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-modern py-1 px-3 text-xs w-48 sm:w-60"
              />
              <Search className="absolute right-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
            </div>

            {/* Language Filter */}
            {allLanguages.length > 0 && (
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="input-modern py-1 px-2.5 text-xs font-mono bg-slate-900 cursor-pointer text-slate-300"
              >
                <option value="all">All Stacks</option>
                {allLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((proj) => {
            const isCurrent = currentProject?.id === proj.id;
            return (
              <SketchBox
                key={proj.id}
                className={`p-5 transition-all ${
                  isCurrent ? 'border-indigo-500/70 shadow-[0_0_25px_rgba(99,102,241,0.25)] bg-slate-900/90' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                      {proj.owner}
                    </span>
                    <h3 className="text-base font-bold font-mono text-white leading-snug">
                      {proj.name}
                    </h3>
                  </div>
                  <span className="badge-shine badge-green text-[10px]">
                    {proj.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                  {proj.currentAnalysis?.summary ||
                    `Repository analyzing ${proj.mainLanguage} codebase and ${proj.primaryFramework} dependencies.`}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  <span className="badge-shine badge-blue text-[11px]">
                    {proj.mainLanguage}
                  </span>
                  <span className="badge-shine badge-cyan text-[11px]">
                    {proj.primaryFramework}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1 text-[11px]">
                    <Clock size={12} />
                    <span>{new Date(proj.lastOpenedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded border border-transparent hover:border-rose-500/40 transition-colors"
                      title="Remove Repository"
                    >
                      <Trash2 size={13} />
                    </button>
                    <button
                      onClick={() => {
                        onSelectProject(proj.id);
                        onNavigateTab('whiteboard');
                      }}
                      className="btn-modern btn-sm btn-primary"
                    >
                      <span>Explore</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </SketchBox>
            );
          })}

          {filteredProjects.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <SketchBox className="p-8 max-w-md mx-auto">
                <FileCode2 size={36} className="mx-auto text-slate-500 mb-2" />
                <h4 className="font-mono font-bold text-sm text-slate-200 mb-1">
                  No matching repositories found
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Analyze a new public GitHub repo or local path to generate diagrams and documentation.
                </p>
                <button
                  onClick={onOpenNewModal}
                  className="btn-modern btn-primary btn-sm"
                >
                  <Plus size={14} />
                  <span>Analyze Repo Now</span>
                </button>
              </SketchBox>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
