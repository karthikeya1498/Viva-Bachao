import React, { useState } from 'react';
import {
  Mic,
  MessageSquare,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  ChevronDown,
  Send,
  Loader2,
  FileText,
  UserCheck,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Project, InterviewQuestion, QuestionCategory, MockEvaluationResult } from '../types';
import { api } from '../services/api';

interface InterviewStudioViewProps {
  project: Project;
}

const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  fundamentals: '1. Fundamentals & Problem',
  tech_stack: '2. Tech Stack Rationale',
  architecture: '3. System Architecture',
  code_level: '4. Code-Level Implementation',
  api_db: '5. API & Database Integrity',
  security: '6. Security & Vulnerabilities',
  testing_debugging: '7. Testing & Debugging',
  design_decisions: '8. Trade-Offs & Scaling',
  project_ownership: '9. Project Ownership & Role'
};

export const InterviewStudioView: React.FC<InterviewStudioViewProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState<'pitches' | 'questions' | 'mock'>('pitches');
  const [selectedPitch, setSelectedPitch] = useState<'30s' | '2m' | '5m' | 'resume' | 'arch'>('30s');
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'all'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Mock Interview Simulator State
  const [activeMockQuestion, setActiveMockQuestion] = useState<InterviewQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<MockEvaluationResult | null>(null);

  const analysis = project.currentAnalysis;
  const pitches = analysis?.interviewMaterials.pitches;
  const questions: InterviewQuestion[] = analysis?.interviewMaterials.questions || [];

  const filteredQuestions = questions.filter(
    (q) => selectedCategory === 'all' || q.category === selectedCategory
  );

  const handleStartMockForQuestion = (q: InterviewQuestion) => {
    setActiveMockQuestion(q);
    setUserAnswer('');
    setEvaluation(null);
    setActiveTab('mock');
  };

  const handleEvaluateAnswer = async () => {
    if (!activeMockQuestion || !userAnswer.trim()) return;
    setIsEvaluating(true);
    try {
      const result = await api.evaluateAnswer(activeMockQuestion, userAnswer.trim(), project.id);
      setEvaluation(result);
    } catch (err) {
      console.error('Failed to evaluate answer:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="container-executive py-6 space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
              Predicted Viva Defense Studio & Simulator
            </h1>
            <span className="badge-cyan text-xs font-mono font-bold">
              High-Stakes Defense
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Prepare for senior examiner technical interrogations with predicted architectural questions, elevator pitches, and live mock scoring.
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('pitches')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'pitches'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)] font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            ⏱️ Elevator Pitches
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'questions'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)] font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            ❓ Predicted Viva Bank
          </button>
          <button
            onClick={() => setActiveTab('mock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'mock'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)] font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            🎯 Mock Viva Simulator
          </button>
        </div>
      </div>

      {/* Tab 1: Elevator Pitches */}
      {activeTab === 'pitches' && (
        <div className="space-y-5">
          {/* Pitch Length Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: '30s', label: '30-Second Quick Pitch' },
              { id: '2m', label: '2-Minute Interview Overview' },
              { id: '5m', label: '5-Minute Technical Deep-Dive' },
              { id: 'resume', label: 'Resume Bullet Points' },
              { id: 'arch', label: 'Architecture Defense Pitch' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedPitch(item.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  selectedPitch === item.id
                    ? 'bg-indigo-600 text-white border border-indigo-400/50 shadow-[0_0_12px_rgba(99,102,241,0.4)] font-bold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Pitch Content Display Box */}
          <div className="glass-card p-6 sm:p-8 rounded-xl border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={14} />
                {selectedPitch === '30s' && '30-Second Elevator Pitch (For HR / Technical Recruiter)'}
                {selectedPitch === '2m' && '2-Minute Comprehensive Overview (For Technical Round 1)'}
                {selectedPitch === '5m' && '5-Minute Architectural Deep-Dive (For Senior Architect / Examiner)'}
                {selectedPitch === 'resume' && 'Resume Action Bullets (Quantified Engineering Accomplishments)'}
                {selectedPitch === 'arch' && 'System Architecture Defense (Decoupled Layers & Data Flow)'}
              </span>
              <span className="badge-blue text-[11px] font-mono">
                {project.name}
              </span>
            </div>

            <div className="glass-card p-5 rounded-lg border-l-4 border-l-cyan-400 bg-slate-900/50">
              {selectedPitch === '30s' && (
                <p className="text-base font-mono text-slate-100 leading-relaxed italic">
                  "{pitches?.thirtySecondPitch}"
                </p>
              )}

              {selectedPitch === '2m' && (
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                  {pitches?.twoMinutePitch}
                </p>
              )}

              {selectedPitch === '5m' && (
                <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                  {pitches?.fiveMinuteDeepDive}
                </div>
              )}

              {selectedPitch === 'resume' && (
                <ul className="space-y-3 text-xs text-slate-200 font-mono">
                  {pitches?.resumeBulletPoints.map((bp, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-cyan-400 font-bold">▶</span>
                      <span className="leading-relaxed">{bp}</span>
                    </li>
                  ))}
                </ul>
              )}

              {selectedPitch === 'arch' && (
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  {pitches?.architectureExplanation}
                </p>
              )}
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>💡 Examiner Tip: Speak deliberately, avoid memorized jargon, and refer to your actual file structure for validation.</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Categorized Viva Question Bank */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              All Questions ({questions.length})
            </button>
            {(Object.keys(CATEGORY_LABELS) as QuestionCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Question Cards */}
          <div className="space-y-3">
            {filteredQuestions.map((q, idx) => {
              const isExpanded = expandedQuestionId === q.id;
              return (
                <div key={q.id} className="glass-card p-5 rounded-xl border border-slate-800/80 transition-all hover:border-slate-700">
                  <div
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    className="flex items-start justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase font-bold text-cyan-400">
                          {CATEGORY_LABELS[q.category]}
                        </span>
                        <span className="badge-purple text-[9px] uppercase font-mono font-bold">
                          {q.difficulty}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold font-mono text-white leading-snug">
                        {q.question}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartMockForQuestion(q);
                        }}
                        className="btn-secondary text-xs py-1 px-3 flex items-center gap-1.5"
                      >
                        <Mic size={13} className="text-cyan-400" />
                        <span>Rehearse</span>
                      </button>
                      <ChevronDown
                        size={18}
                        className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180 text-cyan-400' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Expanded Answer Structure */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-3.5 text-xs">
                      {/* Direct Answer */}
                      <div className="glass-card p-3.5 rounded-lg border-l-4 border-l-emerald-400 bg-emerald-950/10">
                        <span className="font-mono font-bold text-emerald-400 uppercase text-[10px] block mb-1">
                          1. Concise Viva Direct Answer:
                        </span>
                        <p className="text-sm font-semibold text-slate-100 leading-relaxed">{q.directAnswer}</p>
                      </div>

                      {/* Technical Explanation */}
                      <div className="glass-card p-3.5 rounded-lg border border-slate-800">
                        <span className="font-mono font-bold text-cyan-400 uppercase text-[10px] block mb-1">
                          2. Technical Explanation & Mechanics:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{q.technicalExplanation}</p>
                      </div>

                      {/* Repository Evidence & Practical Example */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="glass-card p-3 rounded-lg border border-amber-500/30">
                          <span className="font-mono font-bold text-amber-400 uppercase text-[10px] block mb-1">
                            3. Grounded Repo Evidence:
                          </span>
                          <p className="text-xs text-amber-200/90 font-mono">{q.repositoryEvidence}</p>
                        </div>

                        <div className="glass-card p-3 rounded-lg border border-indigo-500/30">
                          <span className="font-mono font-bold text-indigo-400 uppercase text-[10px] block mb-1">
                            4. Practical Example:
                          </span>
                          <p className="text-xs text-slate-300 font-sans">{q.practicalExample}</p>
                        </div>
                      </div>

                      {/* Trade-Offs & Likely Follow-up */}
                      <div className="glass-card p-3.5 rounded-lg border-l-2 border-rose-500 bg-slate-900/60 text-xs space-y-2">
                        <div>
                          <span className="font-mono font-bold text-rose-400 block mb-0.5">
                            Architectural Trade-Off:
                          </span>
                          <p className="text-slate-300 font-sans">{q.tradeOffs}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-800">
                          <span className="font-mono font-bold text-amber-400 block mb-0.5">
                            Examiner Trap Follow-Up Question:
                          </span>
                          <p className="text-cyan-300 font-mono italic">"{q.followUpQuestion}"</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Mock Viva Simulator */}
      {activeTab === 'mock' && (
        <div className="space-y-6">
          {!activeMockQuestion ? (
            <div className="glass-card p-8 text-center max-w-lg mx-auto rounded-xl border border-slate-800 space-y-3">
              <Mic size={40} className="mx-auto text-cyan-400 mb-2" />
              <h3 className="text-base font-bold font-mono text-white">
                Select A Viva Question To Rehearse
              </h3>
              <p className="text-xs text-slate-400">
                Choose any question from your project bank to simulate answering an external examiner.
              </p>
              <button
                onClick={() => handleStartMockForQuestion(questions[0])}
                className="btn-primary text-xs"
              >
                Start With Question #1
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Question & Answer Area */}
              <div className="lg:col-span-7 space-y-4">
                <div className="glass-card p-5 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="badge-purple text-xs font-mono">
                      Mock Viva Prompt
                    </span>
                    <button
                      onClick={() => setActiveTab('questions')}
                      className="text-xs font-mono text-cyan-400 hover:underline"
                    >
                      Change Question
                    </button>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold font-mono text-white">
                    {activeMockQuestion.question}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Type your answer below as you would speak it in a technical viva. Mention specific files, design trade-offs, and error cases.
                  </p>
                </div>

                {/* Candidate Notebook Answer Area */}
                <div className="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Your Defense Answer:</span>
                    <span>{userAnswer.length} characters</span>
                  </div>

                  <textarea
                    rows={8}
                    placeholder="In my project, this component is structured around... When a request arrives, the router intercepts it and... We handle failures by..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="input-executive w-full font-sans text-sm p-4 leading-relaxed resize-y bg-slate-900 border border-slate-700 text-slate-100 rounded-lg"
                  />

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] font-mono text-slate-500">
                      Evaluated on: directness, technical depth, and error resilience.
                    </span>
                    <button
                      onClick={handleEvaluateAnswer}
                      disabled={isEvaluating || !userAnswer.trim()}
                      className="btn-primary text-xs flex items-center gap-1.5"
                    >
                      {isEvaluating ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Evaluating Viva Rubric...</span>
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          <span>Submit & Score Defense</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Real-Time Evaluation Result */}
              <div className="lg:col-span-5">
                {evaluation ? (
                  <div className="glass-card p-5 rounded-xl border border-slate-800 space-y-4 sticky top-20">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block">
                          Examiner Score
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold font-mono text-white">
                            {evaluation.score}
                          </span>
                          <span className="text-sm font-mono text-slate-400">/ 100</span>
                          <span
                            className={`text-xs uppercase font-mono font-bold px-2 py-0.5 rounded-full ${
                              evaluation.verdict === 'Excellent'
                                ? 'badge-green'
                                : evaluation.verdict === 'Good'
                                ? 'badge-blue'
                                : 'badge-amber'
                            }`}
                          >
                            {evaluation.verdict}
                          </span>
                        </div>
                      </div>
                      <Award size={36} className="text-amber-400" />
                    </div>

                    <div className="text-xs text-slate-300 leading-relaxed font-sans">
                      {evaluation.feedback}
                    </div>

                    {/* Well Explained Points */}
                    <div className="glass-card p-3.5 rounded-lg border border-emerald-500/40 bg-emerald-950/20 space-y-1">
                      <span className="text-[11px] font-mono font-bold text-emerald-400 block flex items-center gap-1.5">
                        <CheckCircle2 size={13} />
                        What You Explained Well:
                      </span>
                      <ul className="text-xs text-emerald-200/90 space-y-1">
                        {evaluation.wellExplainedPoints.map((p, i) => (
                          <li key={i}>• {p}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Missing Points */}
                    <div className="glass-card p-3.5 rounded-lg border border-amber-500/40 bg-amber-950/20 space-y-1">
                      <span className="text-[11px] font-mono font-bold text-amber-400 block flex items-center gap-1.5">
                        <AlertCircle size={13} />
                        What You Should Add To Improve:
                      </span>
                      <ul className="text-xs text-amber-200/90 space-y-1">
                        {evaluation.missingPoints.map((p, i) => (
                          <li key={i}>• {p}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggested Viva Follow-Up */}
                    <div className="glass-card p-3 rounded-lg border-l-2 border-cyan-400 bg-slate-900/60 text-xs">
                      <span className="font-mono font-bold text-cyan-400 block mb-0.5">
                        Follow-Up Examiner Challenge:
                      </span>
                      <p className="text-slate-200 font-mono text-[11px] italic">
                        "{evaluation.suggestedFollowUp}"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="glass-card p-8 rounded-xl border border-slate-800 text-center text-xs text-slate-400 space-y-2.5">
                    <UserCheck size={36} className="mx-auto text-slate-500" />
                    <p className="font-mono font-bold text-sm text-slate-200">
                      Awaiting Candidate Response
                    </p>
                    <p className="font-sans">
                      Type your defense answer on the left and submit to receive instant automated viva rubric scoring and follow-up examiner challenges.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
