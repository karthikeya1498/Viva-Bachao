import React, { useState } from 'react';
import { X, GitBranch, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { SketchBox } from './SketchBox';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-xl">
        <SketchBox className="p-6 bg-[#fbfaf6]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#2b2f33]">
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-[#222]" />
              <h2 className="text-xl font-bold font-mono tracking-tight text-[#1f2421]">
                Analyze GitHub Repository
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#e8e4db] rounded border border-transparent hover:border-[#222]"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#343a40] mb-1.5">
                Public GitHub Repository URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="https://github.com/owner/repository"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                  className="sketch-input pr-10 font-mono text-sm"
                  autoFocus
                />
                <GitBranch className="absolute right-3 top-3 w-4 h-4 text-[#888]" />
              </div>
              <p className="mt-1 text-xs text-[#5c6770] font-sans">
                Supports any public JavaScript, TypeScript, Python, or Go GitHub repo.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-[#fef2f2] border-2 border-[#b91c1c] rounded-md text-xs text-[#b91c1c] font-mono">
                {error}
              </div>
            )}

            {/* Quick-Start Presets */}
            <div className="pt-2">
              <span className="block text-xs font-mono font-bold text-[#444] mb-2 flex items-center gap-1">
                <Sparkles size={13} className="text-[#b45309]" />
                Or Try A Quick-Start Preset:
              </span>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectPreset('https://github.com/karthikeya1498/Viva-Bachao')}
                  className="text-left p-2.5 bg-white border border-[#2b2f33] rounded hover:bg-[#f3eee4] transition-colors flex items-center justify-between group"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-[#1f2421] block">
                      karthikeya1498/Viva-Bachao
                    </span>
                    <span className="text-[11px] text-[#666]">
                      Fullstack TypeScript + Express + React + AST Whiteboard
                    </span>
                  </div>
                  <ArrowRight size={14} className="text-[#888] group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset('https://github.com/student-dev/TaskForge-Kanban')}
                  className="text-left p-2.5 bg-white border border-[#2b2f33] rounded hover:bg-[#f3eee4] transition-colors flex items-center justify-between group"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-[#1f2421] block">
                      student-dev/TaskForge-Kanban
                    </span>
                    <span className="text-[11px] text-[#666]">
                      Collaborative KanBan Board with Auth, SQLite & REST API
                    </span>
                  </div>
                  <ArrowRight size={14} className="text-[#888] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t-2 border-[#2b2f33]">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="sketch-btn sketch-btn-outline text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="sketch-btn sketch-btn-primary text-xs"
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
        </SketchBox>
      </div>
    </div>
  );
};
