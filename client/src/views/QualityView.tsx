import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Code,
  ArrowRight,
  Filter,
  Zap,
  Cpu,
  FileCode,
  Check
} from 'lucide-react';
import { Project, ProjectFinding, SeverityLevel, FindingCategory } from '../types';

interface QualityViewProps {
  project: Project;
}

export const QualityView: React.FC<QualityViewProps> = ({ project }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const analysis = project.currentAnalysis;
  const findings: ProjectFinding[] = analysis?.findings || [];

  const filteredFindings = findings.filter((f) => {
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    const matchesSev = selectedSeverity === 'all' || f.severity === selectedSeverity;
    return matchesCat && matchesSev;
  });

  const strengthsCount = findings.filter((f) => f.category === 'strength').length;
  const weaknessesCount = findings.filter((f) => f.category === 'weakness').length;
  const securityCount = findings.filter((f) => f.category === 'security').length;
  const criticalCount = findings.filter((f) => f.severity === 'critical').length;

  const getSeverityBadge = (sev: SeverityLevel) => {
    switch (sev) {
      case 'critical':
        return 'badge-red';
      case 'high':
        return 'badge-amber';
      case 'medium':
        return 'badge-blue';
      case 'low':
        return 'badge-green';
    }
  };

  return (
    <div className="container-executive py-6 space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
              Code Quality & Vulnerability Audit
            </h1>
            <span className="badge-purple text-xs font-mono font-bold">
              Static Heuristics
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Evidence-grounded audit identifying genuine strengths, maintainability hurdles, and vulnerability vectors directly from AST analysis.
          </p>
        </div>

        {/* Quick Audit Metrics */}
        <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
          <span className="badge-green font-bold">
            {strengthsCount} Strengths
          </span>
          <span className="badge-amber font-bold">
            {weaknessesCount} Weaknesses
          </span>
          <span className="badge-red font-bold">
            {securityCount} Security Items
          </span>
          {criticalCount > 0 && (
            <span className="badge-red font-bold animate-pulse">
              {criticalCount} Critical Fixes
            </span>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-3.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          <span className="font-bold text-slate-400 flex items-center gap-1.5 pr-2">
            <Filter size={13} className="text-cyan-400" /> Category:
          </span>
          {['all', 'strength', 'weakness', 'security', 'performance', 'maintainability'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="font-bold text-slate-400">Severity:</span>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="input-executive py-1 px-3 text-xs bg-slate-900 border border-slate-700 text-slate-200 rounded-lg cursor-pointer"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {filteredFindings.map((finding) => (
          <div key={finding.id} className="glass-card p-5 sm:p-6 rounded-xl border border-slate-800/80 space-y-4 hover:border-slate-700 transition-all">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${getSeverityBadge(finding.severity)}`}>
                    {finding.severity}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    Category: <strong className="text-slate-200">{finding.category}</strong>
                  </span>
                </div>
                <h3 className="text-base font-bold font-mono text-white">
                  {finding.title}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                <Clock size={13} className="text-cyan-400" />
                <span>Estimated Fix: <strong className="text-slate-200">{finding.estimatedEffort}</strong></span>
              </div>
            </div>

            {/* Description & Impact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="glass-card p-4 rounded-lg border border-slate-800/80 space-y-2">
                <span className="font-mono font-bold text-cyan-400 block">
                  Detailed Finding & Grounded Evidence:
                </span>
                <p className="leading-relaxed text-slate-300 font-sans">{finding.description}</p>
                <div className="pt-2 text-[11px] font-mono text-amber-300/90 border-t border-slate-800/60">
                  <strong>Evidence:</strong> {finding.evidence}
                </div>
              </div>

              <div className="glass-card p-4 rounded-lg border border-slate-800/80 space-y-2">
                <span className="font-mono font-bold text-rose-400 block">
                  Practical Impact & Vulnerability Risk:
                </span>
                <p className="leading-relaxed text-slate-300 font-sans">{finding.impact}</p>
                <div className="pt-2 text-[11px] font-mono text-emerald-400 border-t border-slate-800/60">
                  <strong>Recommendation:</strong> {finding.recommendedCorrection}
                </div>
              </div>
            </div>

            {/* Before vs After Code Diff Box */}
            {(finding.beforeCode || finding.afterCode) && (
              <div className="space-y-2 pt-1">
                <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                  <Code size={14} className="text-cyan-400" />
                  Recommended Implementation Correction:
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {finding.beforeCode && (
                    <div className="code-box bg-rose-950/20 border-rose-900/60 rounded-xl p-3.5 space-y-1">
                      <span className="text-[11px] font-mono font-bold text-rose-400 block">
                        ❌ Current / Problematic Pattern:
                      </span>
                      <pre className="overflow-x-auto text-[11px] font-mono text-rose-200/90 leading-relaxed">
                        {finding.beforeCode}
                      </pre>
                    </div>
                  )}

                  {finding.afterCode && (
                    <div className="code-box bg-emerald-950/20 border-emerald-900/60 rounded-xl p-3.5 space-y-1">
                      <span className="text-[11px] font-mono font-bold text-emerald-400 block">
                        ✅ Recommended Secure Pattern:
                      </span>
                      <pre className="overflow-x-auto text-[11px] font-mono text-emerald-200/90 leading-relaxed">
                        {finding.afterCode}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Affected Files Footer */}
            <div className="pt-2.5 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800">
              <div className="flex items-center gap-2 truncate">
                <span className="font-bold text-slate-300">Affected Files:</span>
                {finding.affectedFiles.map((af, i) => (
                  <span key={i} className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-cyan-300 text-[11px]">
                    {af}
                  </span>
                ))}
              </div>
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <Check size={12} /> {finding.verificationStatus}
              </span>
            </div>
          </div>
        ))}

        {filteredFindings.length === 0 && (
          <div className="text-center py-12">
            <div className="glass-card p-8 max-w-sm mx-auto rounded-xl border border-slate-800">
              <CheckCircle2 size={36} className="mx-auto text-emerald-400 mb-3" />
              <p className="font-mono text-xs text-slate-300">
                No findings match the selected filters.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
