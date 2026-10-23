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
  Cpu
} from 'lucide-react';
import { Project, ProjectFinding, SeverityLevel, FindingCategory } from '../types';
import { SketchBox } from '../components/SketchBox';

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
        return 'sketch-badge-red';
      case 'high':
        return 'sketch-badge-amber';
      case 'medium':
        return 'sketch-badge-blue';
      case 'low':
        return 'sketch-badge-green';
    }
  };

  return (
    <div className="container-paper py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#2b2f33]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-mono text-[#1f2421]">
              Code Quality & Security Audit
            </h1>
            <span className="sketch-badge sketch-badge-purple text-xs">
              Static Heuristics
            </span>
          </div>
          <p className="text-xs text-[#5c6770] mt-0.5">
            Evidence-grounded audit identifying genuine strengths, maintainability hurdles, and vulnerability vectors.
          </p>
        </div>

        {/* Quick Audit Metrics */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="sketch-badge sketch-badge-green">
            {strengthsCount} Strengths
          </span>
          <span className="sketch-badge sketch-badge-amber">
            {weaknessesCount} Weaknesses
          </span>
          <span className="sketch-badge sketch-badge-red">
            {securityCount} Security Items
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 border-2 border-[#2b2f33] rounded-[15px_225px_15px_255px/255px_15px_225px_15px]">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          <span className="font-bold text-[#5c6770] flex items-center gap-1 pr-1">
            <Filter size={13} /> Category:
          </span>
          {['all', 'strength', 'weakness', 'security', 'performance', 'maintainability'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded capitalize ${
                selectedCategory === cat
                  ? 'bg-[#2b2f33] text-white font-bold'
                  : 'bg-[#f1ede4] hover:bg-[#e2ddd3] text-[#444]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 text-xs font-mono">
          <span className="font-bold text-[#5c6770]">Severity:</span>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="sketch-input py-0.5 px-2 text-xs bg-[#fbfaf6] cursor-pointer"
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
          <SketchBox key={finding.id} className="p-5 sm:p-6 bg-white space-y-4">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#e9ecef] pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`sketch-badge ${getSeverityBadge(finding.severity)} uppercase text-[10px]`}>
                    {finding.severity}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#6c757d]">
                    Category: {finding.category}
                  </span>
                </div>
                <h3 className="text-base font-bold font-mono text-[#1f2421]">
                  {finding.title}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-[#6c757d]">
                <Clock size={12} />
                <span>Fix Effort: {finding.estimatedEffort}</span>
              </div>
            </div>

            {/* Description & Impact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#343a40]">
              <div className="sketch-box-subtle p-3 bg-[#fdfcf9]">
                <span className="font-mono font-bold text-[#1f2421] block mb-1">
                  Detailed Finding:
                </span>
                <p className="leading-relaxed">{finding.description}</p>
                <div className="mt-2 text-[11px] font-mono text-[#854d0e]">
                  <strong>Evidence:</strong> {finding.evidence}
                </div>
              </div>

              <div className="sketch-box-subtle p-3 bg-[#fdfcf9]">
                <span className="font-mono font-bold text-[#b91c1c] block mb-1">
                  Practical Impact & Risk:
                </span>
                <p className="leading-relaxed">{finding.impact}</p>
                <div className="mt-2 text-[11px] font-mono text-[#15803d]">
                  <strong>Recommendation:</strong> {finding.recommendedCorrection}
                </div>
              </div>
            </div>

            {/* Before vs After Code Diff Box */}
            {(finding.beforeCode || finding.afterCode) && (
              <div className="space-y-2 pt-1">
                <span className="text-xs font-mono font-bold text-[#333] flex items-center gap-1.5">
                  <Code size={13} className="text-[#1d4ed8]" />
                  Recommended Implementation Correction:
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {finding.beforeCode && (
                    <div className="code-box bg-[#fff5f5] border-[#fca5a5]">
                      <span className="text-[10px] font-mono font-bold text-[#b91c1c] block mb-1">
                        ❌ Current / Problematic Pattern:
                      </span>
                      <pre className="overflow-x-auto text-[11px] font-mono text-[#7f1d1d]">
                        {finding.beforeCode}
                      </pre>
                    </div>
                  )}

                  {finding.afterCode && (
                    <div className="code-box bg-[#f0fdf4] border-[#86efac]">
                      <span className="text-[10px] font-mono font-bold text-[#15803d] block mb-1">
                        ✅ Recommended Secure Pattern:
                      </span>
                      <pre className="overflow-x-auto text-[11px] font-mono text-[#14532d]">
                        {finding.afterCode}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Affected Files Footer */}
            <div className="pt-2 flex flex-wrap items-center justify-between text-xs font-mono text-[#6c757d] border-t border-[#f1ede4]">
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-bold">Affected:</span>
                {finding.affectedFiles.map((af, i) => (
                  <span key={i} className="bg-[#f1ede4] px-1.5 py-0.5 rounded text-[#333] text-[11px]">
                    {af}
                  </span>
                ))}
              </div>
              <span className="text-[11px] text-[#15803d] font-bold">
                ✓ {finding.verificationStatus}
              </span>
            </div>
          </SketchBox>
        ))}

        {filteredFindings.length === 0 && (
          <div className="text-center py-12">
            <SketchBox className="p-6 max-w-sm mx-auto bg-white">
              <CheckCircle2 size={32} className="mx-auto text-[#15803d] mb-2" />
              <p className="font-mono text-xs text-[#333]">
                No findings match the selected filters.
              </p>
            </SketchBox>
          </div>
        )}
      </div>
    </div>
  );
};
