import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  FileCode,
  Layers,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Code2
} from 'lucide-react';
import { Project, DocChapter, ExplanationLevel } from '../types';

interface DocumentationViewProps {
  project: Project;
}

export const DocumentationView: React.FC<DocumentationViewProps> = ({ project }) => {
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number>(1);
  const [level, setLevel] = useState<ExplanationLevel>('intermediate');
  const [search, setSearch] = useState('');

  const analysis = project.currentAnalysis;
  const chapters: DocChapter[] = analysis?.documentation || [];

  const filteredChapters = chapters.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.summary.toLowerCase().includes(search.toLowerCase())
  );

  const activeChapter = chapters.find((c) => c.chapterNumber === selectedChapterNumber) || chapters[0];

  return (
    <div className="container-executive py-6 text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
              15-Chapter Technical Project Architecture Guide
            </h1>
            <span className="badge-blue text-xs font-mono font-bold">
              Evidence-Backed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Grounded architectural documentation generated strictly from inspected repository source files.
          </p>
        </div>

        {/* 3-Level Depth Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 border border-slate-800 rounded-xl">
          <button
            onClick={() => setLevel('beginner')}
            className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-all ${
              level === 'beginner'
                ? 'bg-emerald-600 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🟢 Beginner
          </button>
          <button
            onClick={() => setLevel('intermediate')}
            className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-all ${
              level === 'intermediate'
                ? 'bg-indigo-600 text-white font-bold shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🟡 Intermediate
          </button>
          <button
            onClick={() => setLevel('advanced')}
            className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-all ${
              level === 'advanced'
                ? 'bg-purple-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🔴 Advanced
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Chapters + Chapter Reading Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Chapters Table of Contents */}
        <div className="md:col-span-4 lg:col-span-4 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search 15 chapters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-executive py-2 px-3 text-xs w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg pr-8"
            />
            <Search className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-500" />
          </div>

          <div className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
            {filteredChapters.map((chap) => {
              const isSelected = chap.chapterNumber === selectedChapterNumber;
              return (
                <div
                  key={chap.chapterNumber}
                  onClick={() => setSelectedChapterNumber(chap.chapterNumber)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all select-none ${
                    isSelected
                      ? 'glass-card border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.25)] translate-x-1 font-bold'
                      : 'bg-slate-900/40 hover:bg-slate-800/50 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-[11px] font-bold text-cyan-400">
                      Chapter {chap.chapterNumber}
                    </span>
                    <ChevronRight size={14} className={isSelected ? 'text-cyan-400' : 'text-slate-600'} />
                  </div>
                  <h4 className="text-xs font-mono text-white truncate">
                    {chap.title}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: In-Middle Explanation Document Reader */}
        <div className="md:col-span-8 lg:col-span-8">
          {activeChapter ? (
            <div className="glass-card p-6 sm:p-8 rounded-xl border border-slate-800/80 space-y-6">
              {/* Chapter Header */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    Chapter {activeChapter.chapterNumber} of 15
                  </span>
                  <span className="badge-purple text-xs uppercase font-mono font-bold">
                    Mode: {level}
                  </span>
                </div>
                <h2 className="text-2xl font-bold font-mono text-white">
                  {activeChapter.title}
                </h2>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  {activeChapter.summary}
                </p>
              </div>

              {/* In-Middle Explanation Content */}
              <div className="space-y-4">
                <div className="glass-card p-5 rounded-lg border-l-4 border-l-cyan-400 bg-slate-900/50">
                  <span className="text-[11px] font-mono uppercase font-bold text-cyan-400 block mb-2">
                    {level.toUpperCase()} TECHNICAL PERSPECTIVE:
                  </span>
                  <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                    {activeChapter.content[level]}
                  </div>
                </div>

                {/* Supporting Code or Structure */}
                {activeChapter.codeSnippets && activeChapter.codeSnippets.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                      <Code2 size={14} className="text-cyan-400" />
                      Associated Code Evidence:
                    </span>
                    {activeChapter.codeSnippets.map((snip, idx) => (
                      <div key={idx} className="code-box bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1">
                        <div className="text-[11px] font-mono font-bold text-slate-400 mb-1">
                          {snip.title}
                        </div>
                        <pre className="overflow-x-auto text-xs font-mono text-cyan-200/90">{snip.code}</pre>
                      </div>
                    ))}
                  </div>
                )}

                {/* Related Repository Files */}
                <div className="glass-card p-4 rounded-lg border border-amber-500/30">
                  <span className="text-xs font-mono font-bold text-amber-400 block mb-2 flex items-center gap-1.5">
                    <FileCode size={14} />
                    Inspected Files Supporting This Chapter:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeChapter.relatedFiles.map((rf, idx) => (
                      <span
                        key={idx}
                        className="font-mono text-xs bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-cyan-300"
                      >
                        {rf}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chapter Pager */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <button
                  disabled={activeChapter.chapterNumber <= 1}
                  onClick={() => setSelectedChapterNumber(activeChapter.chapterNumber - 1)}
                  className="btn-secondary text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Previous Chapter
                </button>
                <span className="text-slate-400">
                  {activeChapter.chapterNumber} / {chapters.length}
                </span>
                <button
                  disabled={activeChapter.chapterNumber >= chapters.length}
                  onClick={() => setSelectedChapterNumber(activeChapter.chapterNumber + 1)}
                  className="btn-secondary text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next Chapter →
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 font-mono text-xs">No chapter selected</div>
          )}
        </div>
      </div>
    </div>
  );
};
