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
  CheckCircle2,
  FileCode2,
  ShieldCheck,
  TrendingUp,
  Cpu
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
  const securityWarnings = analysis ? analysis.findings.filter((f) => f.category === 'security' && f.severity === 'critical').length : 0;
  const totalQuestions = analysis ? analysis.interviewMaterials.questions.length : 0;

  return (
    <div className="container-paper space-y-6 pb-12">
      {/* Hero / Welcome Banner */}
      <SketchBox className="p-6 sm:p-8 bg-[#ffffff] relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fef08a] border-2 border-[#854d0e] rounded-full text-xs font-mono font-bold text-[#854d0e]">
            <Sparkles size={13} />
            <span>Viva & Interview Defense Blueprint</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-mono tracking-tight text-[#1f2421] leading-tight">
            Turn Any GitHub Repository Into A Project You Can{' '}
            <span className="underline decoration-wavy decoration-[#1d4ed8] underline-offset-4">
              Understand, Explain, & Defend
            </span>
            .
          </h1>

          <p className="text-sm sm:text-base text-[#495057] leading-relaxed">
            Reconstruct execution flows, trace every API endpoint to database rows, explore interactive
            pencil-sketch architecture whiteboards, and rehearse technical questions tailored to your exact source files.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenNewModal}
              className="sketch-btn sketch-btn-primary"
            >
              <Plus size={16} />
              <span>Analyze New Repository</span>
            </button>

            {currentProject && (
              <button
                onClick={() => onNavigateTab('whiteboard')}
                className="sketch-btn sketch-btn-outline"
              >
                <GitGraph size={16} />
                <span>Open {currentProject.name} Whiteboard</span>
              </button>
            )}
          </div>
        </div>

        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none">
          <Cpu size={160} className="text-[#2b2f33]" />
        </div>
      </SketchBox>

      {/* Active Project Quick Stats & Highlights */}
      {currentProject && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#5c6770]">
                Active Project Overview
              </span>
              <span className="hand-annotation text-xs text-[#15803d]">
                (Ready for viva examination)
              </span>
            </div>
            <span className="text-xs font-mono text-[#666]">
              Revision: <strong>{analysis?.revision || 'HEAD'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SketchBox
              interactive
              onClick={() => onNavigateTab('whiteboard')}
              className="p-4 bg-white"
            >
              <div className="flex items-center justify-between text-[#1d4ed8] mb-1">
                <span className="text-xs font-mono font-bold">API Routes</span>
                <GitGraph size={16} />
              </div>
              <div className="text-2xl font-bold font-mono text-[#1f2421]">
                {totalRoutes > 0 ? totalRoutes : '5+'}
              </div>
              <span className="text-[11px] text-[#5c6770]">Discovered endpoints</span>
            </SketchBox>

            <SketchBox
              interactive
              onClick={() => onNavigateTab('docs')}
              className="p-4 bg-white"
            >
              <div className="flex items-center justify-between text-[#15803d] mb-1">
                <span className="text-xs font-mono font-bold">Documentation</span>
                <BookOpen size={16} />
              </div>
              <div className="text-2xl font-bold font-mono text-[#1f2421]">15 Chapters</div>
              <span className="text-[11px] text-[#5c6770]">Beginner / Int / Adv</span>
            </SketchBox>

            <SketchBox
              interactive
              onClick={() => onNavigateTab('quality')}
              className="p-4 bg-white"
            >
              <div className="flex items-center justify-between text-[#b45309] mb-1">
                <span className="text-xs font-mono font-bold">Quality Audit</span>
                <ShieldAlert size={16} />
              </div>
              <div className="text-2xl font-bold font-mono text-[#1f2421]">
                {strengthsCount} Strengths
              </div>
              <span className="text-[11px] text-[#5c6770]">
                {securityWarnings > 0 ? `${securityWarnings} critical warnings` : 'Zero critical leaks'}
              </span>
            </SketchBox>

            <SketchBox
              interactive
              onClick={() => onNavigateTab('interview')}
              className="p-4 bg-white"
            >
              <div className="flex items-center justify-between text-[#6d28d9] mb-1">
                <span className="text-xs font-mono font-bold">Viva Rehearsal</span>
                <Mic size={16} />
              </div>
              <div className="text-2xl font-bold font-mono text-[#1f2421]">
                {totalQuestions} Q&A
              </div>
              <span className="text-[11px] text-[#5c6770]">Mock Viva Evaluator</span>
            </SketchBox>
          </div>
        </div>
      )}

      {/* Project Library Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b-2 border-[#2b2f33]">
          <div>
            <h2 className="text-xl font-bold font-mono text-[#1f2421] flex items-center gap-2">
              <span>Project Library</span>
              <span className="sketch-badge sketch-badge-blue text-xs">
                {projects.length} Saved
              </span>
            </h2>
            <p className="text-xs text-[#5c6770]">
              Previously analyzed repositories stored locally. Revisit anytime for revision.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search repository..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="sketch-input py-1 px-3 text-xs w-48 sm:w-60"
              />
              <Search className="absolute right-2.5 top-2 w-3.5 h-3.5 text-[#888]" />
            </div>

            {/* Language Filter */}
            {allLanguages.length > 0 && (
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="sketch-input py-1 px-2.5 text-xs font-mono bg-white cursor-pointer"
              >
                <option value="all">All Languages</option>
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
                className={`p-5 bg-white transition-all ${
                  isCurrent ? 'ring-2 ring-[#1d4ed8] bg-[#fbfdff]' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#6c757d] block">
                      {proj.owner}
                    </span>
                    <h3 className="text-base font-bold font-mono text-[#1f2421] leading-snug">
                      {proj.name}
                    </h3>
                  </div>
                  <span className="sketch-badge sketch-badge-green text-[10px]">
                    {proj.status}
                  </span>
                </div>

                <p className="text-xs text-[#495057] line-clamp-2 mb-4">
                  {proj.currentAnalysis?.summary ||
                    `Repository analyzing ${proj.mainLanguage} codebase and ${proj.primaryFramework} dependencies.`}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  <span className="sketch-badge sketch-badge-blue text-[11px]">
                    {proj.mainLanguage}
                  </span>
                  <span className="sketch-badge text-[11px] bg-[#f8f9fa]">
                    {proj.primaryFramework}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#e9ecef] flex items-center justify-between text-xs font-mono text-[#6c757d]">
                  <div className="flex items-center gap-1 text-[11px]">
                    <Clock size={12} />
                    <span>Opened {new Date(proj.lastOpenedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      className="p-1 text-[#b91c1c] hover:bg-[#fef2f2] rounded border border-transparent hover:border-[#b91c1c]"
                      title="Delete Project"
                    >
                      <Trash2 size={13} />
                    </button>
                    <button
                      onClick={() => {
                        onSelectProject(proj.id);
                        onNavigateTab('whiteboard');
                      }}
                      className="sketch-btn sketch-btn-sm"
                    >
                      <span>Explore</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              </SketchBox>
            );
          })}

          {filteredProjects.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <SketchBox className="p-8 max-w-md mx-auto bg-white">
                <FileCode2 size={36} className="mx-auto text-[#888] mb-2" />
                <h4 className="font-mono font-bold text-sm text-[#333] mb-1">
                  No matching repositories found
                </h4>
                <p className="text-xs text-[#666] mb-4">
                  Analyze a new public GitHub repo to generate diagrams and documentation.
                </p>
                <button
                  onClick={onOpenNewModal}
                  className="sketch-btn sketch-btn-primary sketch-btn-sm"
                >
                  <Plus size={14} />
                  <span>Analyze A Repo Now</span>
                </button>
              </SketchBox>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
