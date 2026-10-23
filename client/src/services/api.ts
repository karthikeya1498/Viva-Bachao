import { Project, MockEvaluationResult, InterviewQuestion } from '../types';

const API_BASE = 'http://localhost:5000/api';

export const api = {
  async getProjects(): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    const data = await res.json();
    return data.projects || [];
  },

  async getProject(id: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    if (!res.ok) throw new Error('Failed to fetch project details');
    const data = await res.json();
    return data.project;
  },

  async analyzeRepo(repoUrl: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoUrl })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to analyze repository');
    }
    const data = await res.json();
    return data.project;
  },

  async deleteProject(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete project');
  },

  async evaluateAnswer(
    question: InterviewQuestion,
    userAnswer: string,
    projectId?: string
  ): Promise<MockEvaluationResult> {
    const res = await fetch(`${API_BASE}/mock-interview/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, userAnswer, projectId })
    });
    if (!res.ok) throw new Error('Failed to evaluate answer');
    const data = await res.json();
    return data.evaluation;
  },

  async getMockHistory(projectId: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/mock-interview/${projectId}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.history || [];
  }
};
