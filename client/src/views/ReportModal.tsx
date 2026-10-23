import React from 'react';
import { X, Printer, Download, BookOpen, Layers, ShieldCheck, Check } from 'lucide-react';
import { Project } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, project }) => {
  if (!isOpen || !project) return null;

  const analysis = project.currentAnalysis;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    if (!analysis) return;
    let md = `# Project Technical Report: ${project.name}\n\n`;
    md += `**Repository URL:** ${project.repoUrl}\n`;
    md += `**Primary Language:** ${project.mainLanguage}\n`;
    md += `**Primary Framework:** ${project.primaryFramework}\n`;
    md += `**Analysis Revision:** ${analysis.revision}\n`;
    md += `**Generated Date:** ${new Date().toLocaleDateString()}\n\n`;
    md += `## Executive Summary\n${analysis.summary}\n\n`;

    md += `## Technology Stack\n`;
    analysis.technologies.forEach((t) => {
      md += `- **${t.name}** (${t.category}): ${t.role}\n`;
    });

    md += `\n## 15-Chapter Technical Project Documentation\n`;
    analysis.documentation.forEach((c) => {
      md += `### Chapter ${c.chapterNumber}: ${c.title}\n`;
      md += `*Summary*: ${c.summary}\n\n`;
      md += `**Technical Explanation:**\n${c.content.intermediate}\n\n`;
    });

    md += `## Code Quality & Security Audit\n`;
    analysis.findings.forEach((f) => {
      md += `### [${f.severity.toUpperCase()}] ${f.title}\n`;
      md += `- **Category:** ${f.category}\n`;
      md += `- **Description:** ${f.description}\n`;
      md += `- **Recommendation:** ${f.recommendedCorrection}\n\n`;
    });

    md += `## Interview & Viva Preparation\n`;
    md += `### 30-Second Elevator Pitch\n${analysis.interviewMaterials.pitches.thirtySecondPitch}\n\n`;
    md += `### Core Viva Questions\n`;
    analysis.interviewMaterials.questions.forEach((q, i) => {
      md += `#### Q${i + 1}: ${q.question}\n`;
      md += `**Answer:** ${q.directAnswer}\n`;
      md += `**Technical Detail:** ${q.technicalExplanation}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name}-viva-bachao-report.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0b1020] text-slate-100 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden print:max-h-none print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Modal Controls Bar */}
        <div className="p-4 bg-[#0d1428] border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-white">
              Printable Technical Report & Viva Defense Binder
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadMarkdown}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
              title="Download as Markdown"
            >
              <Download size={13} className="text-cyan-400" />
              <span>Download .MD</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
              title="Print to PDF"
            >
              <Printer size={13} />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-8 print:p-0 print:overflow-visible font-sans bg-[#090d1a] print:bg-white print:text-black">
          {/* Cover Header */}
          <div className="border-b border-slate-800 print:border-black pb-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs uppercase tracking-widest text-cyan-400 print:text-indigo-700">
                Viva-Bachao Technical Intelligence Report
              </span>
              <span className="font-mono text-xs text-slate-400 print:text-gray-600">
                Date: {new Date().toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-white print:text-black">
              {project.name}
            </h1>
            <p className="font-mono text-xs text-slate-400 print:text-gray-600">
              Repository: {project.repoUrl} | Stack: {project.mainLanguage} ({project.primaryFramework})
            </p>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2">
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-cyan-400 print:text-black border-b border-slate-800 print:border-black pb-1">
              1. Executive Summary & Purpose
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 print:text-gray-800 leading-relaxed">
              {analysis?.summary}
            </p>
          </div>

          {/* Section 2: Technology Stack Inventory */}
          <div className="space-y-2">
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-cyan-400 print:text-black border-b border-slate-800 print:border-black pb-1">
              2. Technology Stack & Role Analysis
            </h2>
            <div className="border border-slate-800 print:border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 print:bg-gray-100 border-b border-slate-800 print:border-gray-300 text-slate-300 print:text-black">
                  <tr>
                    <th className="p-2.5 border-r border-slate-800 print:border-gray-300">Technology</th>
                    <th className="p-2.5 border-r border-slate-800 print:border-gray-300">Category</th>
                    <th className="p-2.5">Architectural Responsibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-200">
                  {analysis?.technologies.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-2.5 font-bold border-r border-slate-800 print:border-gray-200 text-white print:text-black">{t.name}</td>
                      <td className="p-2.5 border-r border-slate-800 print:border-gray-200 text-slate-400 print:text-gray-600">{t.category}</td>
                      <td className="p-2.5 text-slate-300 print:text-gray-800 font-sans">{t.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: 15-Chapter Documentation Highlights */}
          <div className="space-y-3">
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-cyan-400 print:text-black border-b border-slate-800 print:border-black pb-1">
              3. 15-Chapter Technical Architecture Digest
            </h2>
            <div className="space-y-3">
              {analysis?.documentation.map((chap) => (
                <div key={chap.chapterNumber} className="border border-slate-800 print:border-gray-200 p-3.5 rounded-lg text-xs bg-slate-900/30 print:bg-white">
                  <div className="font-mono font-bold text-cyan-400 print:text-indigo-700 text-[11px] mb-1">
                    Chapter {chap.chapterNumber}: {chap.title}
                  </div>
                  <p className="text-slate-300 print:text-gray-800 leading-relaxed font-sans">{chap.content.intermediate}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Audit & Findings */}
          <div className="space-y-3">
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-cyan-400 print:text-black border-b border-slate-800 print:border-black pb-1">
              4. Code Quality & Security Audit
            </h2>
            <div className="space-y-2">
              {analysis?.findings.map((f) => (
                <div key={f.id} className="border border-slate-800 print:border-gray-200 p-3.5 rounded-lg text-xs space-y-1.5 bg-slate-900/30 print:bg-white">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white print:text-black">{f.title}</span>
                    <span className="font-mono uppercase text-[10px] text-rose-400 font-bold">[{f.severity}]</span>
                  </div>
                  <p className="text-slate-400 print:text-gray-600 font-sans">{f.description}</p>
                  <div className="text-emerald-400 font-mono text-[11px]">
                    <strong>Fix:</strong> {f.recommendedCorrection}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Top Viva Questions */}
          <div className="space-y-3">
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-cyan-400 print:text-black border-b border-slate-800 print:border-black pb-1">
              5. Predicted Viva Examination Defense
            </h2>
            <div className="space-y-3">
              {analysis?.interviewMaterials.questions.map((q, idx) => (
                <div key={q.id} className="border border-slate-800 print:border-gray-200 p-3.5 rounded-lg text-xs space-y-1.5 bg-slate-900/40 print:bg-white">
                  <div className="font-mono font-bold text-white print:text-black">
                    Q{idx + 1}: {q.question}
                  </div>
                  <p className="text-emerald-400 font-sans font-semibold">
                    <strong>Direct Answer:</strong> {q.directAnswer}
                  </p>
                  <p className="text-slate-300 print:text-gray-800 font-sans">
                    <strong>Technical Detail:</strong> {q.technicalExplanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-slate-800 print:border-gray-300 text-center font-mono text-xs text-slate-500">
            Generated by Viva-Bachao Platform • Turn your repository into interview confidence.
          </div>
        </div>
      </div>
    </div>
  );
};
