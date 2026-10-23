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
import { SketchBox } from '../components/SketchBox';

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
    <div className="container-paper py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#2b2f33] mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-mono text-[#1f2421]">
              15-Chapter Technical Project Guide
            </h1>
            <span className="sketch-badge sketch-badge-blue text-xs">
              Evidence-Backed
            </span>
          </div>
          <p className="text-xs text-[#5c6770] mt-0.5">
            Grounded architectural documentation generated strictly from inspected repository source files.
          </p>
        </div>

        {/* 3-Level Depth Switcher */}
        <div className="flex items-center gap-1 bg-[#f1ede4] p-1 border-2 border-[#2b2f33] rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
          <button
            onClick={() => setLevel('beginner')}
            className={`px-3 py-1 text-xs font-mono font-bold rounded ${
              level === 'beginner'
                ? 'bg-[#15803d] text-white shadow-[1px_2px_0_#222]'
                : 'text-[#444] hover:bg-[#e4decb]'
            }`}
          >
            🟢 Beginner
          </button>
          <button
            onClick={() => setLevel('intermediate')}
            className={`px-3 py-1 text-xs font-mono font-bold rounded ${
              level === 'intermediate'
                ? 'bg-[#1d4ed8] text-white shadow-[1px_2px_0_#222]'
                : 'text-[#444] hover:bg-[#e4decb]'
            }`}
          >
            🟡 Intermediate
          </button>
          <button
            onClick={() => setLevel('advanced')}
            className={`px-3 py-1 text-xs font-mono font-bold rounded ${
              level === 'advanced'
                ? 'bg-[#6d28d9] text-white shadow-[1px_2px_0_#222]'
                : 'text-[#444] hover:bg-[#e4decb]'
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
              placeholder="Filter chapters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sketch-input py-1 px-3 text-xs w-full"
            />
            <Search className="absolute right-2.5 top-2 w-3.5 h-3.5 text-[#888]" />
          </div>

          <div className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
            {filteredChapters.map((chap) => {
              const isSelected = chap.chapterNumber === selectedChapterNumber;
              return (
                <div
                  key={chap.chapterNumber}
                  onClick={() => setSelectedChapterNumber(chap.chapterNumber)}
                  className={`p-2.5 border-2 border-[#2b2f33] rounded-[15px_225px_15px_255px/255px_15px_225px_15px] cursor-pointer transition-all select-none ${
                    isSelected
                      ? 'bg-white shadow-[3px_3px_0_#2b2f33] translate-x-1 font-bold'
                      : 'bg-[#faf8f4] hover:bg-white text-[#4b5563]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] font-bold text-[#1d4ed8]">
                      Chapter {chap.chapterNumber}
                    </span>
                    <ChevronRight size={13} className={isSelected ? 'text-[#1d4ed8]' : 'text-[#aaa]'} />
                  </div>
                  <h4 className="text-xs font-mono text-[#1f2421] truncate mt-0.5">
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
            <SketchBox className="p-6 sm:p-8 bg-white space-y-6">
              {/* Chapter Header */}
              <div className="border-b-2 border-[#2b2f33] pb-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#1d4ed8] uppercase tracking-wider">
                    Chapter {activeChapter.chapterNumber} of 15
                  </span>
                  <span className="sketch-badge text-xs uppercase font-mono">
                    Mode: {level}
                  </span>
                </div>
                <h2 className="text-2xl font-bold font-mono text-[#1f2421]">
                  {activeChapter.title}
                </h2>
                <p className="text-xs text-[#5c6770] font-sans mt-1">
                  {activeChapter.summary}
                </p>
              </div>

              {/* In-Middle Explanation Content */}
              <div className="space-y-4">
                <div className="sketch-box-subtle p-4 bg-[#fdfcf9] border-l-4 border-l-[#1d4ed8]">
                  <span className="text-[11px] font-mono uppercase font-bold text-[#1d4ed8] block mb-2">
                    {level.toUpperCase()} TECHNICAL PERSPECTIVE:
                  </span>
                  <div className="text-sm text-[#2b2f33] leading-relaxed whitespace-pre-line font-sans">
                    {activeChapter.content[level]}
                  </div>
                </div>

                {/* Supporting Code or Structure */}
                {activeChapter.codeSnippets && activeChapter.codeSnippets.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold text-[#333] flex items-center gap-1.5">
                      <Code2 size={14} />
                      Associated Code Evidence:
                    </span>
                    {activeChapter.codeSnippets.map((snip, idx) => (
                      <div key={idx} className="code-box">
                        <div className="text-[11px] font-mono font-bold text-[#666] mb-1">
                          {snip.title}
                        </div>
                        <pre className="overflow-x-auto text-xs">{snip.code}</pre>
                      </div>
                    ))}
                  </div>
                )}

                {/* Related Repository Files */}
                <div className="sketch-sticky p-3.5">
                  <span className="text-xs font-mono font-bold text-[#854d0e] block mb-1.5 flex items-center gap-1.5">
                    <FileCode size={13} />
                    Inspected Files Supporting This Chapter:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeChapter.relatedFiles.map((rf, idx) => (
                      <span
                        key={idx}
                        className="font-mono text-xs bg-white/80 border border-[#854d0e] px-2 py-0.5 rounded text-[#713f12]"
                      >
                        {rf}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chapter Pager */}
              <div className="pt-4 border-t-2 border-[#2b2f33] flex items-center justify-between text-xs font-mono">
                <button
                  disabled={activeChapter.chapterNumber <= 1}
                  onClick={() => setSelectedChapterNumber(activeChapter.chapterNumber - 1)}
                  className="sketch-btn sketch-btn-sm disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Previous Chapter
                </button>
                <span>
                  {activeChapter.chapterNumber} / {chapters.length}
                </span>
                <button
                  disabled={activeChapter.chapterNumber >= chapters.length}
                  onClick={() => setSelectedChapterNumber(activeChapter.chapterNumber + 1)}
                  className="sketch-btn sketch-btn-sm disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next Chapter →
                </button>
              </div>
            </SketchBox>
          ) : (
            <div className="text-center py-12">No chapter selected</div>
          )}
        </div>
      </div>
    </div>
  );
};
