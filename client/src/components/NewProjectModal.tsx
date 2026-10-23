import React, { useState } from 'react';
import { X, GitBranch, Sparkles, Loader2, ArrowRight } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (repoUrl: string) => Promise<void>;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onAnalyze
}) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await onAnalyze(url.trim());
      setUrl('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to analyze repository. Check URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (presetUrl: string) => {
    setUrl(presetUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xl">
        <div className="glass-card p-6 sm:p-7 rounded-2xl border border-slate-800 shadow-2xl space-y-5 text-slate-100">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <GitBranch className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-mono tracking-tight text-white">
                  Analyze GitHub Repository
                </h2>
                <span className="text-xs text-slate-400 font-sans">
                  Grounded AST inspection & automatic workflow generation
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Public GitHub Repository URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="https://github.com/owner/repository"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                  className="input-executive pr-10 font-mono text-sm w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg py-2.5 px-3.5"
                  autoFocus
                />
                <GitBranch className="absolute right-3.5 top-3 w-4 h-4 text-slate-500" />
              </div>
              <p className="mt-1.5 text-xs text-slate-400 font-sans">
                Supports any public JavaScript, TypeScript, Python, or Go repository.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-lg text-xs text-rose-300 font-mono">
                {error}
              </div>
            )}

            {/* Quick-Start Presets */}
            <div className="pt-2">
              <span className="block text-xs font-mono font-bold text-slate-300 mb-2.5 flex items-center gap-1.5">
                <Sparkles size={13} className="text-cyan-400" />
                Or Select A Grounded Repository Preset:
              </span>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectPreset('https://github.com/karthikeya1498/Viva-Bachao')}
                  className="text-left p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all flex items-center justify-between group"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-cyan-300 block">
                      karthikeya1498/Viva-Bachao
                    </span>
                    <span className="text-[11px] text-slate-400 font-sans">
                      Fullstack TypeScript + Express + React + AST Whiteboard
                    </span>
                  </div>
                  <ArrowRight size={14} className="text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset('https://github.com/student-dev/TaskForge-Kanban')}
                  className="text-left p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all flex items-center justify-between group"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-300 block">
                      student-dev/TaskForge-Kanban
                    </span>
                    <span className="text-[11px] text-slate-400 font-sans">
                      Collaborative Kanban Board with Auth, SQLite & REST API
                    </span>
                  </div>
                  <ArrowRight size={14} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="btn-secondary text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Analyzing AST & Workflows...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Start Full Analysis</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
