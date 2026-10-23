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
  UserCheck
} from 'lucide-react';
import { Project, InterviewQuestion, QuestionCategory, MockEvaluationResult } from '../types';
import { SketchBox } from '../components/SketchBox';
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
    <div className="container-paper py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#2b2f33]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-mono text-[#1f2421]">
              Interview Preparation Studio & Mock Viva
            </h1>
            <span className="sketch-badge sketch-badge-purple text-xs">
              Candidate Defense Lab
            </span>
          </div>
          <p className="text-xs text-[#5c6770] mt-0.5">
            Master the art of explaining your code confidently, defending architectural decisions, and acing mock viva questions.
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('pitches')}
            className={`sketch-btn sketch-btn-sm ${
              activeTab === 'pitches' ? 'sketch-btn-primary' : 'sketch-btn-outline'
            }`}
          >
            ⏱️ Elevator Pitches
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`sketch-btn sketch-btn-sm ${
              activeTab === 'questions' ? 'sketch-btn-primary' : 'sketch-btn-outline'
            }`}
          >
            ❓ Viva Questions Bank
          </button>
          <button
            onClick={() => setActiveTab('mock')}
            className={`sketch-btn sketch-btn-sm ${
              activeTab === 'mock' ? 'sketch-btn-primary' : 'sketch-btn-outline'
            }`}
          >
            🎯 Mock Viva Simulator
          </button>
        </div>
      </div>

      {/* Tab 1: Elevator Pitches & Introductions */}
      {activeTab === 'pitches' && (
        <div className="space-y-6">
          {/* Pitch Length Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedPitch('30s')}
              className={`sketch-btn sketch-btn-sm ${
                selectedPitch === '30s' ? 'sketch-btn-primary' : 'sketch-btn-outline'
              }`}
            >
              30-Second Quick Pitch
            </button>
            <button
              onClick={() => setSelectedPitch('2m')}
              className={`sketch-btn sketch-btn-sm ${
                selectedPitch === '2m' ? 'sketch-btn-primary' : 'sketch-btn-outline'
              }`}
            >
              2-Minute Interview Overview
            </button>
            <button
              onClick={() => setSelectedPitch('5m')}
              className={`sketch-btn sketch-btn-sm ${
                selectedPitch === '5m' ? 'sketch-btn-primary' : 'sketch-btn-outline'
              }`}
            >
              5-Minute Technical Deep-Dive
            </button>
            <button
              onClick={() => setSelectedPitch('resume')}
              className={`sketch-btn sketch-btn-sm ${
                selectedPitch === 'resume' ? 'sketch-btn-primary' : 'sketch-btn-outline'
              }`}
            >
              Resume Bullet Points
            </button>
            <button
              onClick={() => setSelectedPitch('arch')}
              className={`sketch-btn sketch-btn-sm ${
                selectedPitch === 'arch' ? 'sketch-btn-primary' : 'sketch-btn-outline'
              }`}
            >
              Architecture Defense Pitch
            </button>
          </div>

          {/* Pitch Content Display Box */}
          <SketchBox className="p-6 sm:p-8 bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-[#e9ecef] pb-3">
              <span className="font-mono text-xs font-bold text-[#1d4ed8] uppercase tracking-wider">
                {selectedPitch === '30s' && '⏱️ 30-Second Elevator Pitch (For HR / Recruiter Intro)'}
                {selectedPitch === '2m' && '⏱️ 2-Minute Interview Overview (For Technical Round 1)'}
                {selectedPitch === '5m' && '⏱️ 5-Minute Technical Deep-Dive (For Senior Architect Review)'}
                {selectedPitch === 'resume' && '📝 Resume Action Bullet Points (Quantified Achievements)'}
                {selectedPitch === 'arch' && '🏛️ Architecture Explanation (Decoupling & Data Flow)'}
              </span>
              <span className="hand-annotation text-xs text-[#854d0e]">
                grounded in {project.name}
              </span>
            </div>

            <div className="sketch-box-subtle p-5 bg-[#fdfcf9] border-l-4 border-l-[#1d4ed8]">
              {selectedPitch === '30s' && (
                <p className="text-base font-mono text-[#1f2421] leading-relaxed italic">
                  {pitches?.thirtySecondPitch}
                </p>
              )}

              {selectedPitch === '2m' && (
                <p className="text-sm text-[#2b2f33] leading-relaxed whitespace-pre-line font-sans">
                  {pitches?.twoMinutePitch}
                </p>
              )}

              {selectedPitch === '5m' && (
                <div className="text-sm text-[#2b2f33] leading-relaxed whitespace-pre-line font-sans">
                  {pitches?.fiveMinuteDeepDive}
                </div>
              )}

              {selectedPitch === 'resume' && (
                <ul className="space-y-2.5 text-xs text-[#2b2f33] font-mono">
                  {pitches?.resumeBulletPoints.map((bp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#1d4ed8] font-bold">▶</span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              )}

              {selectedPitch === 'arch' && (
                <p className="text-sm text-[#2b2f33] leading-relaxed font-sans">
                  {pitches?.architectureExplanation}
                </p>
              )}
            </div>

            <div className="p-3 bg-[#f8f9fa] border border-[#2b2f33] rounded text-xs font-mono text-[#5c6770] flex items-center justify-between">
              <span>💡 Tip: Speak clearly, avoid robotic memorization, and relate claims to your actual file structure.</span>
            </div>
          </SketchBox>
        </div>
      )}

      {/* Tab 2: Categorized Viva Question Bank */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded ${
                selectedCategory === 'all'
                  ? 'bg-[#2b2f33] text-white font-bold'
                  : 'bg-white border border-[#2b2f33] text-[#444]'
              }`}
            >
              All Categories ({questions.length})
            </button>
            {(Object.keys(CATEGORY_LABELS) as QuestionCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#2b2f33] text-white font-bold'
                    : 'bg-white border border-[#2b2f33] text-[#444]'
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
                <SketchBox key={q.id} className="p-4 sm:p-5 bg-white transition-all">
                  <div
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    className="flex items-start justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase font-bold text-[#1d4ed8]">
                          {CATEGORY_LABELS[q.category]}
                        </span>
                        <span className="sketch-badge text-[9px] uppercase font-mono">
                          {q.difficulty}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold font-mono text-[#1f2421]">
                        {q.question}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartMockForQuestion(q);
                        }}
                        className="sketch-btn sketch-btn-sm text-xs bg-[#eff6ff] text-[#1d4ed8] border-[#1d4ed8]"
                      >
                        <Mic size={12} />
                        <span>Rehearse</span>
                      </button>
                      <ChevronDown
                        size={16}
                        className={`text-[#666] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Expanded Answer Structure */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-[#e9ecef] space-y-3.5 text-xs">
                      {/* Direct Answer */}
                      <div className="sketch-box-subtle p-3 bg-[#fdfcf9]">
                        <span className="font-mono font-bold text-[#15803d] uppercase text-[10px] block mb-1">
                          1. Direct Viva Answer:
                        </span>
                        <p className="text-sm font-semibold text-[#1f2421]">{q.directAnswer}</p>
                      </div>

                      {/* Technical Explanation */}
                      <div className="p-3 bg-white border border-[#2b2f33] rounded">
                        <span className="font-mono font-bold text-[#1d4ed8] uppercase text-[10px] block mb-1">
                          2. Technical Explanation & Mechanisms:
                        </span>
                        <p className="text-xs text-[#343a40] leading-relaxed">{q.technicalExplanation}</p>
                      </div>

                      {/* Repository Evidence & Practical Example */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sketch-sticky p-2.5">
                          <span className="font-mono font-bold text-[#854d0e] uppercase text-[10px] block mb-1">
                            3. Grounded Repo Evidence:
                          </span>
                          <p className="text-xs text-[#713f12] font-mono">{q.repositoryEvidence}</p>
                        </div>

                        <div className="sketch-box-subtle p-2.5 bg-white">
                          <span className="font-mono font-bold text-[#4b5563] uppercase text-[10px] block mb-1">
                            4. Practical Example:
                          </span>
                          <p className="text-xs text-[#4b5563]">{q.practicalExample}</p>
                        </div>
                      </div>

                      {/* Trade-Offs & Likely Follow-up */}
                      <div className="p-3 bg-[#f8f9fa] border-l-2 border-[#b45309] rounded-r text-xs">
                        <span className="font-mono font-bold text-[#b45309] block mb-0.5">
                          Architectural Trade-Off:
                        </span>
                        <p className="text-[#495057] mb-2">{q.tradeOffs}</p>
                        <span className="font-mono font-bold text-[#1f2421] block mb-0.5">
                          Likely Examiner Follow-Up:
                        </span>
                        <p className="text-[#1d4ed8] font-mono italic">"{q.followUpQuestion}"</p>
                      </div>
                    </div>
                  )}
                </SketchBox>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Mock Viva Simulator */}
      {activeTab === 'mock' && (
        <div className="space-y-6">
          {/* Question Selector if none selected */}
          {!activeMockQuestion ? (
            <SketchBox className="p-8 text-center bg-white max-w-lg mx-auto">
              <Mic size={40} className="mx-auto text-[#1d4ed8] mb-3" />
              <h3 className="text-base font-bold font-mono text-[#1f2421] mb-1">
                Select A Question To Rehearse
              </h3>
              <p className="text-xs text-[#5c6770] mb-4">
                Choose any question from your project bank to simulate answering an external examiner.
              </p>
              <button
                onClick={() => handleStartMockForQuestion(questions[0])}
                className="sketch-btn sketch-btn-primary"
              >
                Start With Question #1
              </button>
            </SketchBox>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Question & Answer Area */}
              <div className="lg:col-span-7 space-y-4">
                <SketchBox className="p-5 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="sketch-badge sketch-badge-purple text-xs">
                      Mock Viva Question
                    </span>
                    <button
                      onClick={() => setActiveTab('questions')}
                      className="text-xs font-mono text-[#1d4ed8] underline"
                    >
                      Change Question
                    </button>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold font-mono text-[#1f2421]">
                    {activeMockQuestion.question}
                  </h3>
                  <p className="text-xs text-[#5c6770]">
                    Type your answer below as you would speak it in a viva interview. Mention specific mechanisms, files, and architectural reasons.
                  </p>
                </SketchBox>

                {/* Candidate Notebook Answer Area */}
                <SketchBox className="p-4 bg-[#ffffff] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-[#5c6770]">
                    <span>Your Answer (Spoken or Written Defense):</span>
                    <span>{userAnswer.length} characters</span>
                  </div>

                  <textarea
                    rows={8}
                    placeholder="In my project, this component is responsible for... When a user dispatches a request, the router intercepts the call and..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="sketch-input font-sans text-sm p-3.5 leading-relaxed resize-y"
                  />

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] font-mono text-[#888]">
                      Rubric checks for: direct answer, technical depth, and failure modes.
                    </span>
                    <button
                      onClick={handleEvaluateAnswer}
                      disabled={isEvaluating || !userAnswer.trim()}
                      className="sketch-btn sketch-btn-primary text-xs"
                    >
                      {isEvaluating ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Evaluating Viva Rubric...</span>
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          <span>Submit & Score Answer</span>
                        </>
                      )}
                    </button>
                  </div>
                </SketchBox>
              </div>

              {/* Real-Time Evaluation Result */}
              <div className="lg:col-span-5">
                {evaluation ? (
                  <SketchBox className="p-5 bg-white space-y-4 sticky top-20">
                    <div className="flex items-center justify-between border-b border-[#e9ecef] pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#6c757d] block">
                          Examiner Score
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold font-mono text-[#1f2421]">
                            {evaluation.score}
                          </span>
                          <span className="text-sm font-mono text-[#888]">/ 100</span>
                          <span
                            className={`sketch-badge text-xs uppercase ${
                              evaluation.verdict === 'Excellent'
                                ? 'sketch-badge-green'
                                : evaluation.verdict === 'Good'
                                ? 'sketch-badge-blue'
                                : 'sketch-badge-amber'
                            }`}
                          >
                            {evaluation.verdict}
                          </span>
                        </div>
                      </div>
                      <Award size={32} className="text-[#b45309]" />
                    </div>

                    <div className="text-xs text-[#2b2f33] leading-relaxed">
                      {evaluation.feedback}
                    </div>

                    {/* Well Explained Points */}
                    <div className="sketch-box-subtle p-3 bg-[#f0fdf4] border-[#86efac]">
                      <span className="text-[11px] font-mono font-bold text-[#15803d] block mb-1 flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        What You Explained Well:
                      </span>
                      <ul className="text-xs text-[#14532d] space-y-1">
                        {evaluation.wellExplainedPoints.map((p, i) => (
                          <li key={i}>• {p}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Missing Points */}
                    <div className="sketch-box-subtle p-3 bg-[#fffbeb] border-[#fde68a]">
                      <span className="text-[11px] font-mono font-bold text-[#b45309] block mb-1 flex items-center gap-1">
                        <AlertCircle size={13} />
                        What You Should Add To Improve:
                      </span>
                      <ul className="text-xs text-[#78350f] space-y-1">
                        {evaluation.missingPoints.map((p, i) => (
                          <li key={i}>• {p}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggested Viva Follow-Up */}
                    <div className="p-3 bg-[#f8f9fa] border-l-2 border-[#1d4ed8] rounded text-xs">
                      <span className="font-mono font-bold text-[#1d4ed8] block mb-0.5">
                        Follow-Up Examiner Question:
                      </span>
                      <p className="text-[#333] font-mono text-[11px] italic">
                        "{evaluation.suggestedFollowUp}"
                      </p>
                    </div>
                  </SketchBox>
                ) : (
                  <SketchBox className="p-6 bg-white text-center text-xs text-[#666] space-y-2">
                    <UserCheck size={32} className="mx-auto text-[#888]" />
                    <p className="font-mono font-bold text-sm text-[#333]">
                      Awaiting Your Response
                    </p>
                    <p>
                      Type your answer on the left and click "Submit & Score Answer" to receive instant rubric scoring and follow-up viva questions.
                    </p>
                  </SketchBox>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
