import React, { useState } from 'react';
import {
  X,
  FileCode,
  Layers,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  ArrowRight,
  BookOpen,
  Cpu,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { WorkflowNode } from '../types';

interface NodeDetailPanelProps {
  node: WorkflowNode | null;
  onClose: () => void;
}

export const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({ node, onClose }) => {
  const [tab, setTab] = useState<'explanation' | 'technical' | 'viva'>('explanation');

  if (!node) return null;

  return (
    <div className="fixed top-[65px] bottom-0 right-0 z-50 w-full max-w-xl bg-[#090d1a]/95 backdrop-blur-xl border-l border-slate-800 shadow-[-10px_0_30px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden text-slate-100">
      {/* Drawer Header */}
      <div className="p-4 bg-[#0d1326] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-cyan-400">
              Component Inspector • {node.nodeType.replace(/_/g, ' ')}
            </span>
            <h3 className="text-base font-bold font-mono text-white leading-tight">
              {node.label}
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Quick Navigation Tabs inside Inspector */}
      <div className="flex border-b border-slate-800 bg-[#070b16] px-4 pt-2 gap-1.5">
        <button
          onClick={() => setTab('explanation')}
          className={`px-3.5 py-2 text-xs font-mono font-medium rounded-t-lg transition-all ${
            tab === 'explanation'
              ? 'bg-[#0d1326] text-cyan-400 border-t border-x border-slate-800 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          📖 In-Middle Explanation
        </button>
        <button
          onClick={() => setTab('technical')}
          className={`px-3.5 py-2 text-xs font-mono font-medium rounded-t-lg transition-all ${
            tab === 'technical'
              ? 'bg-[#0d1326] text-cyan-400 border-t border-x border-slate-800 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          ⚙️ Specs & Failure Modes
        </button>
        <button
          onClick={() => setTab('viva')}
          className={`px-3.5 py-2 text-xs font-mono font-medium rounded-t-lg transition-all ${
            tab === 'viva'
              ? 'bg-[#0d1326] text-cyan-400 border-t border-x border-slate-800 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          🎯 Viva Defense Questions
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Source File Badge */}
        <div className="glass-card p-3 rounded-lg flex items-center justify-between text-xs font-mono border border-slate-800">
          <div className="flex items-center gap-2 text-slate-300 truncate">
            <FileCode size={15} className="text-cyan-400 shrink-0" />
            <span className="truncate">{node.filePath}</span>
          </div>
          <span className="badge-blue text-[11px] px-2 py-0.5 rounded shrink-0">
            {node.symbol}
          </span>
        </div>

        {tab === 'explanation' && (
          <div className="space-y-4">
            {/* Plain English Explanation */}
            <div className="glass-card p-4 rounded-xl border border-emerald-500/30 space-y-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <Sparkles size={13} />
                1. Plain-English Explanation (For Beginners)
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {node.plainExplanation}
              </p>
            </div>

            {/* Technical Explanation */}
            <div className="glass-card p-4 rounded-xl border border-cyan-500/30 space-y-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                <Cpu size={13} />
                2. Technical Architecture Explanation (For Viva Defense)
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {node.technicalExplanation}
              </p>
            </div>

            {/* Purpose & Responsibility */}
            <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Purpose & Architectural Responsibility
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {node.purpose}
              </p>
            </div>

            {/* Evidence References */}
            <div className="glass-card p-4 rounded-xl border border-amber-500/30 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                Grounded Repository Evidence (File-Checked)
              </span>
              <ul className="text-xs text-slate-300 list-disc list-inside space-y-1 font-mono">
                {node.evidenceReferences.map((ref, idx) => (
                  <li key={idx} className="text-amber-200/90">{ref}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === 'technical' && (
          <div className="space-y-4">
            {/* Processing Steps */}
            <div className="glass-card p-4 rounded-xl border border-indigo-500/30 space-y-3">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <Cpu size={14} className="text-indigo-400" />
                Internal Processing Steps (Linear Execution Sequence)
              </span>
              <ol className="space-y-2">
                {node.processingSteps.map((step, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2.5">
                    <span className="font-mono font-bold bg-indigo-950/80 border border-indigo-500/40 text-cyan-300 w-5 h-5 rounded flex items-center justify-center shrink-0 text-[10px]">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Inputs & Outputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="glass-card p-3.5 rounded-xl border border-cyan-500/30">
                <span className="text-[11px] font-mono uppercase font-bold text-cyan-400 block mb-2">
                  📥 Inputs & Events
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {node.inputs && node.inputs.length > 0 ? (
                    node.inputs.map((inp, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 font-mono">
                        <ArrowRight size={11} className="text-cyan-400 shrink-0" />
                        <span>{inp}</span>
                      </li>
                    ))
                  ) : (
                    <li className="italic text-slate-500">No external inputs required</li>
                  )}
                </ul>
              </div>

              <div className="glass-card p-3.5 rounded-xl border border-emerald-500/30">
                <span className="text-[11px] font-mono uppercase font-bold text-emerald-400 block mb-2">
                  📤 Outputs & Mutations
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {node.outputs && node.outputs.length > 0 ? (
                    node.outputs.map((out, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 font-mono">
                        <ArrowRight size={11} className="text-emerald-400 shrink-0" />
                        <span>{out}</span>
                      </li>
                    ))
                  ) : (
                    <li className="italic text-slate-500">Void / Local side-effect</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Potential Failure Scenarios */}
            <div className="glass-card p-4 rounded-xl border border-rose-500/40 bg-rose-950/20 space-y-2">
              <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle size={14} />
                Potential Failure Scenarios & Edge Cases
              </span>
              <ul className="space-y-1.5 text-xs text-rose-200/90 font-sans">
                {node.failureScenarios.map((fail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{fail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === 'viva' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <HelpCircle size={15} className="text-amber-400" />
              <span className="text-xs font-mono font-bold text-white">
                Predicted Examiner Questions for this Node:
              </span>
            </div>

            {node.interviewQuestions.map((q, idx) => (
              <div key={idx} className="glass-card p-4 rounded-xl border border-slate-800 space-y-2.5">
                <span className="badge-amber text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold inline-block">
                  Predicted Viva Question #{idx + 1}
                </span>
                <p className="text-xs font-bold text-white font-mono leading-relaxed">{q}</p>
                <div className="bg-slate-900/90 border-l-2 border-emerald-400 p-2.5 rounded-r-lg text-xs text-slate-300 font-sans space-y-1">
                  <span className="font-semibold text-emerald-400 block font-mono text-[11px]">
                    Recommended High-Scoring Defense:
                  </span>
                  <p>
                    Cite the specific lines in <code className="font-mono text-cyan-300 bg-slate-800 px-1 py-0.5 rounded">{node.filePath}</code>. Explain the architectural trade-offs, how exceptions are handled, and how this component maintains decoupling.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-3.5 bg-[#0d1326] border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
        <span>Confidence Score: <strong className="text-emerald-400 uppercase">{node.confidence}</strong></span>
        <button
          onClick={onClose}
          className="btn-primary text-xs py-1 px-3"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
};
