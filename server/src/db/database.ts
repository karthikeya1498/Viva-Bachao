import fs from 'fs';
import path from 'path';
import { Project, ProjectAnalysis } from '../types/index.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  projects: Record<string, Project>;
  mockInterviews: Record<string, any[]>;
}

class Database {
  private data: DatabaseSchema = {
    projects: {},
    mockInterviews: {}
  };

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse database file, initializing empty database:', err);
        this.save();
      }
    } else {
      this.save();
    }
  }

  private save() {
    try {
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Failed to save database to disk:', err);
    }
  }

  public getAllProjects(): Project[] {
    return Object.values(this.data.projects).sort(
      (a, b) => new Date(b.lastOpenedAt).getTime() - new Date(a.lastOpenedAt).getTime()
    );
  }

  public getProjectById(id: string): Project | undefined {
    return this.data.projects[id];
  }

  public saveProject(project: Project): Project {
    this.data.projects[project.id] = project;
    this.save();
    return project;
  }

  public deleteProject(id: string): boolean {
    if (this.data.projects[id]) {
      delete this.data.projects[id];
      delete this.data.mockInterviews[id];
      this.save();
      return true;
    }
    return false;
  }

  public saveMockInterview(projectId: string, record: any) {
    if (!this.data.mockInterviews[projectId]) {
      this.data.mockInterviews[projectId] = [];
    }
    this.data.mockInterviews[projectId].push(record);
    this.save();
  }

  public getMockInterviews(projectId: string): any[] {
    return this.data.mockInterviews[projectId] || [];
  }
}

export const db = new Database();
