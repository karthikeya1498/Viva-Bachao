import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { DashboardView } from './views/DashboardView';
import { WhiteboardView } from './views/WhiteboardView';
import { DocumentationView } from './views/DocumentationView';
import { QualityView } from './views/QualityView';
import { InterviewStudioView } from './views/InterviewStudioView';
import { NewProjectModal } from './components/NewProjectModal';
import { ReportModal } from './views/ReportModal';
import { Project } from './types';
import { api } from './services/api';
import { Loader2 } from 'lucide-react';

export function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load projects on startup
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await api.getProjects();
      setProjects(data);
      if (data.length > 0 && !currentProjectId) {
        setCurrentProjectId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentProject = projects.find((p) => p.id === currentProjectId) || (projects.length > 0 ? projects[0] : null);

  const handleSelectProject = async (id: string) => {
    setCurrentProjectId(id);
    try {
      const updated = await api.getProject(id);
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err) {
      console.error('Failed to refresh project:', err);
    }
  };

  const handleAnalyzeRepo = async (repoUrl: string) => {
    const newProject = await api.analyzeRepo(repoUrl);
    setProjects((prev) => [newProject, ...prev.filter((p) => p.id !== newProject.id)]);
    setCurrentProjectId(newProject.id);
    setActiveTab('whiteboard');
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to remove this project from your library?')) return;
    try {
      await api.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (currentProjectId === id) {
        const remaining = projects.filter((p) => p.id !== id);
        setCurrentProjectId(remaining[0]?.id || null);
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#070a12] text-slate-100">
        <div className="glass-card p-8 text-center space-y-4 max-w-md">
          <Loader2 size={36} className="animate-spin mx-auto text-cyan-400" />
          <h2 className="font-mono font-bold text-lg text-white">
            Viva-Bachao Engine Loading...
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Initializing local SQLite database and static AST analysis pipelines.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070a12] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Glassmorphic Executive Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projects={projects}
        currentProject={currentProject}
        onSelectProject={handleSelectProject}
        onOpenNewModal={() => setIsNewModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Main View Router with Key-based Dynamic Repo Switching */}
      <main className="flex-1 flex flex-col min-h-0">
        {activeTab === 'dashboard' && (
          <DashboardView
            key={`dashboard-${currentProject?.id || 'none'}`}
            projects={projects}
            currentProject={currentProject}
            onSelectProject={handleSelectProject}
            onOpenNewModal={() => setIsNewModalOpen(true)}
            onDeleteProject={handleDeleteProject}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'whiteboard' && currentProject && (
          <WhiteboardView
            key={`whiteboard-${currentProject.id}`}
            project={currentProject}
          />
        )}

        {activeTab === 'docs' && currentProject && (
          <DocumentationView
            key={`docs-${currentProject.id}`}
            project={currentProject}
          />
        )}

        {activeTab === 'quality' && currentProject && (
          <QualityView
            key={`quality-${currentProject.id}`}
            project={currentProject}
          />
        )}

        {activeTab === 'interview' && currentProject && (
          <InterviewStudioView
            key={`interview-${currentProject.id}`}
            project={currentProject}
          />
        )}
      </main>

      {/* Modals */}
      <NewProjectModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onAnalyze={handleAnalyzeRepo}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        project={currentProject}
      />
    </div>
  );
}

export default App;
