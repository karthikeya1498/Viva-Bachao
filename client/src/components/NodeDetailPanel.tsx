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
  Cpu
} from 'lucide-react';
import { WorkflowNode } from '../types';
import { SketchBox } from './SketchBox';

interface NodeDetailPanelProps {
  node: WorkflowNode | null;
  onClose: () => void;
}

export const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({ node, onClose }) => {
  const [tab, setTab] = useState<'explanation' | 'technical' | 'viva'>('explanation');

  if (!node) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-[#fbfaf6] border-l-2 border-[#2b2f33] shadow-[-6px_0_15px_rgba(0,0,0,0.08)] flex flex-col h-full overflow-hidden">
      {/* Drawer Header */}
      <div className="p-4 bg-white border-b-2 border-[#2b2f33] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#15803d] border border-[#222]" />
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#5c6770]">
              Component Inspector ({node.nodeType.replace(/_/g, ' ')})
            </span>
            <h3 className="text-base font-bold font-mono text-[#1f2421] leading-tight">
              {node.label}
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#ece8df] rounded border border-transparent hover:border-[#222]"
        >
          <X size={18} />
        </button>
      </div>

      {/* Quick Navigation Tabs inside Inspector */}
      <div className="flex border-b-2 border-[#2b2f33] bg-[#f5f1e8] px-4 pt-2 gap-1">
        <button
          onClick={() => setTab('explanation')}
          className={`px-3 py-1.5 text-xs font-mono font-bold border-t-2 border-x-2 border-[#2b2f33] rounded-t-md ${
            tab === 'explanation' ? 'bg-[#fbfaf6] translate-y-[2px]' : 'bg-[#e5dfd3] opacity-75'
          }`}
        >
          📖 In-Middle Explanation
        </button>
        <button
          onClick={() => setTab('technical')}
          className={`px-3 py-1.5 text-xs font-mono font-bold border-t-2 border-x-2 border-[#2b2f33] rounded-t-md ${
            tab === 'technical' ? 'bg-[#fbfaf6] translate-y-[2px]' : 'bg-[#e5dfd3] opacity-75'
          }`}
        >
          ⚙️ Specs & Inputs/Outputs
        </button>
        <button
          onClick={() => setTab('viva')}
          className={`px-3 py-1.5 text-xs font-mono font-bold border-t-2 border-x-2 border-[#2b2f33] rounded-t-md ${
            tab === 'viva' ? 'bg-[#fbfaf6] translate-y-[2px]' : 'bg-[#e5dfd3] opacity-75'
          }`}
        >
          🎯 Viva Defense Questions
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Source File Badge */}
        <div className="sketch-box-subtle p-2.5 bg-white flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[#343a40] truncate">
            <FileCode size={15} className="text-[#1d4ed8] shrink-0" />
            <span className="truncate">{node.filePath}</span>
          </div>
          <span className="sketch-badge sketch-badge-blue shrink-0">
            {node.symbol}
          </span>
        </div>

        {tab === 'explanation' && (
          <div className="space-y-4">
            {/* Plain English Explanation */}
            <SketchBox className="p-4 bg-[#ffffff]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#15803d] font-bold block mb-1">
                1. Plain-English Explanation (For Beginners)
              </span>
              <p className="text-sm text-[#2b2f33] leading-relaxed">
                {node.plainExplanation}
              </p>
            </SketchBox>

            {/* Technical Explanation */}
            <SketchBox className="p-4 bg-[#ffffff]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#1d4ed8] font-bold block mb-1">
                2. Technical Architecture Explanation (For Viva)
              </span>
              <p className="text-sm text-[#2b2f33] leading-relaxed">
                {node.technicalExplanation}
              </p>
            </SketchBox>

            {/* Purpose & Responsibility */}
            <SketchBox variant="subtle" className="p-3.5 bg-white">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#495057] font-bold block mb-1">
                Purpose & Responsibility
              </span>
              <p className="text-xs text-[#495057]">
                {node.purpose}
              </p>
            </SketchBox>

            {/* Evidence References */}
            <div className="sketch-sticky p-3.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#854d0e] font-bold block mb-1 flex items-center gap-1">
                <CheckCircle2 size={13} />
                Grounded Repository Evidence
              </span>
              <ul className="text-xs text-[#713f12] list-disc list-inside space-y-1">
                {node.evidenceReferences.map((ref, idx) => (
                  <li key={idx} className="font-mono">{ref}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === 'technical' && (
          <div className="space-y-4">
            {/* Processing Steps */}
            <SketchBox className="p-4 bg-white">
              <span className="text-xs font-mono font-bold text-[#1f2421] block mb-2 flex items-center gap-1.5">
                <Cpu size={14} className="text-[#6d28d9]" />
                Internal Processing Steps (Linear Execution)
              </span>
              <ol className="space-y-2">
                {node.processingSteps.map((step, i) => (
                  <li key={i} className="text-xs text-[#343a40] flex items-start gap-2">
                    <span className="font-mono font-bold bg-[#f1ede4] border border-[#2b2f33] w-5 h-5 rounded flex items-center justify-center shrink-0 text-[10px]">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </SketchBox>

            {/* Inputs & Outputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sketch-box-subtle p-3 bg-white">
                <span className="text-[11px] font-mono uppercase font-bold text-[#2563eb] block mb-1.5">
                  📥 Inputs & Events
                </span>
                <ul className="space-y-1 text-xs text-[#4b5563]">
                  {node.inputs && node.inputs.length > 0 ? (
                    node.inputs.map((inp, idx) => (
                      <li key={idx} className="flex items-center gap-1">
                        <ArrowRight size={10} className="text-[#2563eb]" />
                        <span>{inp}</span>
                      </li>
                    ))
                  ) : (
                    <li className="italic text-[#888]">No external inputs required</li>
                  )}
                </ul>
              </div>

              <div className="sketch-box-subtle p-3 bg-white">
                <span className="text-[11px] font-mono uppercase font-bold text-[#15803d] block mb-1.5">
                  📤 Outputs & Side-Effects
                </span>
                <ul className="space-y-1 text-xs text-[#4b5563]">
                  {node.outputs && node.outputs.length > 0 ? (
                    node.outputs.map((out, idx) => (
                      <li key={idx} className="flex items-center gap-1">
                        <ArrowRight size={10} className="text-[#15803d]" />
                        <span>{out}</span>
                      </li>
                    ))
                  ) : (
                    <li className="italic text-[#888]">Void / In-place mutation</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Potential Failure Scenarios */}
            <div className="sketch-box p-3.5 bg-[#fef2f2] border-[#b91c1c]">
              <span className="text-xs font-mono font-bold text-[#b91c1c] block mb-1.5 flex items-center gap-1.5">
                <AlertTriangle size={14} />
                Potential Failure Scenarios & Edge Cases
              </span>
              <ul className="space-y-1.5 text-xs text-[#7f1d1d]">
                {node.failureScenarios.map((fail, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#b91c1c] font-bold">•</span>
                    <span>{fail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === 'viva' && (
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-[#1f2421] block flex items-center gap-1">
              <HelpCircle size={14} className="text-[#b45309]" />
              Questions the External Examiner May Ask About This Component:
            </span>

            {node.interviewQuestions.map((q, idx) => (
              <SketchBox key={idx} className="p-3.5 bg-white">
                <span className="text-[10px] font-mono uppercase bg-[#fefce8] border border-[#b45309] text-[#b45309] px-1.5 py-0.5 rounded font-bold inline-block mb-1">
                  Viva Question #{idx + 1}
                </span>
                <p className="text-xs font-bold text-[#1f2421] mb-2">{q}</p>
                <div className="bg-[#f8f9fa] border-l-2 border-[#15803d] p-2 text-xs text-[#343a40]">
                  <span className="font-semibold text-[#15803d] block mb-0.5">Recommended Defense:</span>
                  Discuss the specific lines in <code className="font-mono bg-[#eee] px-1 rounded">{node.filePath}</code>, mention how error states are caught, and explain why this pattern guarantees maintainability.
                </div>
              </SketchBox>
            ))}
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-3 bg-white border-t-2 border-[#2b2f33] flex items-center justify-between text-xs font-mono text-[#5c6770]">
        <span>Confidence: <strong className="text-[#15803d] uppercase">{node.confidence}</strong></span>
        <button
          onClick={onClose}
          className="sketch-btn sketch-btn-sm"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
};
