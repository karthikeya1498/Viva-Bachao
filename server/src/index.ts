import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { db } from './db/database.js';
import { AnalysisEngine } from './analyzer/analysisEngine.js';
import { InterviewGenerator } from './analyzer/interviewGenerator.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Seed or refresh default projects with latest dynamic engine
async function seedDefaultProjects() {
  console.log('Synchronizing projects with latest dynamic AST engine...');
  try {
    await AnalysisEngine.analyzeRepository('https://github.com/karthikeya1498/Viva-Bachao');
    await AnalysisEngine.analyzeRepository('https://github.com/student-dev/TaskForge-Kanban');
    console.log('Projects synchronized with real dynamic workflows and deep viva predictions.');
  } catch (err) {
    console.warn('Seeding failed:', err);
  }
}

// Routes
// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Viva-Bachao Intelligence Engine',
    version: '1.0.0'
  });
});

// 2. Get all projects
app.get('/api/projects', (req: Request, res: Response) => {
  const projects = db.getAllProjects();
  res.json({ projects, count: projects.length });
});

// 3. Get single project by ID
app.get('/api/projects/:id', (req: Request, res: Response) => {
  const projectId = String(req.params.id);
  const project = db.getProjectById(projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  // Update last opened
  project.lastOpenedAt = new Date().toISOString();
  db.saveProject(project);
  res.json({ project });
});

// 4. Trigger analysis
app.post('/api/projects/analyze', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl || typeof repoUrl !== 'string') {
      return res.status(400).json({ error: 'repoUrl is required' });
    }

    console.log(`Starting analysis for: ${repoUrl}`);
    const project = await AnalysisEngine.analyzeRepository(repoUrl.trim());
    res.status(201).json({
      message: 'Analysis completed successfully',
      project
    });
  } catch (err) {
    next(err);
  }
});

// 5. Delete project
app.delete('/api/projects/:id', (req: Request, res: Response) => {
  const deleted = db.deleteProject(String(req.params.id));
  if (!deleted) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json({ success: true, message: 'Project removed from history' });
});

// 6. Evaluate Mock Interview Answer
app.post('/api/mock-interview/evaluate', (req: Request, res: Response) => {
  const { question, userAnswer, projectId } = req.body;
  if (!question || !userAnswer) {
    return res.status(400).json({ error: 'question and userAnswer are required' });
  }

  const evaluation = InterviewGenerator.evaluateMockAnswer(question, userAnswer);

  if (projectId) {
    db.saveMockInterview(projectId, {
      questionId: question.id,
      questionText: question.question,
      userAnswer,
      evaluation,
      evaluatedAt: new Date().toISOString()
    });
  }

  res.json({ evaluation });
});

// 7. Get Mock Interview History
app.get('/api/mock-interview/:projectId', (req: Request, res: Response) => {
  const history = db.getMockInterviews(String(req.params.projectId));
  res.json({ history });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred during repository analysis.'
  });
});

app.listen(PORT, async () => {
  console.log(`=========================================`);
  console.log(`Viva-Bachao Server running on http://localhost:${PORT}`);
  console.log(`=========================================`);
  await seedDefaultProjects();
});
