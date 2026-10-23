import { v4 as uuidv4 } from 'uuid';
import { Project, ProjectAnalysis } from '../types/index.js';
import { db } from '../db/database.js';
import { GitService, RepoDetails } from './gitService.js';
import { LanguageDetector, IngestedFile } from './languageDetector.js';
import { FileClassifier } from './fileClassifier.js';
import { AstParser } from './astParser.js';
import { WorkflowBuilder } from './workflowBuilder.js';
import { QualityAuditor } from './qualityAuditor.js';
import { DocGenerator } from './docGenerator.js';
import { InterviewGenerator } from './interviewGenerator.js';

export class AnalysisEngine {
  public static async analyzeRepository(repoInput: string): Promise<Project> {
    let repoDetails = GitService.parseRepoUrl(repoInput);

    if (!repoDetails) {
      // Fallback for custom or local name
      const cleanName = repoInput.replace(/[^a-zA-Z0-9_\-]/g, '_') || 'CustomProject';
      repoDetails = {
        owner: 'student-developer',
        name: cleanName,
        defaultBranch: 'main',
        url: repoInput.startsWith('http') ? repoInput : `https://github.com/student-developer/${cleanName}`
      };
    }

    const projectId = `proj-${repoDetails.owner.toLowerCase()}-${repoDetails.name.toLowerCase()}`;
    const existing = db.getProjectById(projectId);

    // Fetch repository files
    const files: IngestedFile[] = await GitService.fetchPublicRepo(repoDetails);

    // 1. Language & Framework Detection
    const { languages, technologies, primaryLanguage, primaryFramework } = LanguageDetector.detect(files);

    // 2. File Classification & Tree
    const fileTree = FileClassifier.buildFileTree(files);

    // 3. AST & Structural Parsing
    const imports = AstParser.extractImports(files);
    const routes = AstParser.extractRoutes(files);
    const models = AstParser.extractModels(files);

    // 4. Entry point detection
    const entryPoints = files
      .filter(f => FileClassifier.classify(f) === 'entry_point')
      .map(f => ({
        path: f.relativePath,
        type: 'Application / Server Entry',
        description: 'Initial bootstrap file initializing middleware, routes, and listening socket.'
      }));

    if (entryPoints.length === 0) {
      entryPoints.push({
        path: files[0]?.relativePath || 'index.ts',
        type: 'Root Entry',
        description: 'Root module orchestrating dependencies.'
      });
    }

    // 5. Build 6 Engineering Whiteboard Workflows
    const workflows = WorkflowBuilder.buildAllWorkflows(files, routes, models, imports, technologies);

    // 6. Quality & Security Static Audit
    const findings = QualityAuditor.audit(files);

    // 7. 15-Chapter Documentation
    const documentation = DocGenerator.generateAllChapters(
      repoDetails.name,
      files,
      routes,
      models,
      technologies,
      workflows
    );

    // 8. Interview Preparation Studio Materials
    const pitches = InterviewGenerator.generatePitches(
      repoDetails.name,
      primaryLanguage,
      primaryFramework,
      routes.length,
      models,
      technologies
    );

    const questions = InterviewGenerator.generateQuestions(
      repoDetails.name,
      files,
      routes,
      models,
      technologies
    );

    const now = new Date().toISOString();
    const analysisId = `analysis-${uuidv4().slice(0, 8)}`;

    const currentAnalysis: ProjectAnalysis = {
      id: analysisId,
      projectId,
      createdAt: now,
      revision: 'HEAD-main',
      summary: `${repoDetails.name} is a ${primaryLanguage} project leveraging ${primaryFramework}. It features ${routes.length} HTTP routes, ${models.length} data models, and an automated audit score of ${findings.filter(f => f.category === 'strength').length} verified strengths.`,
      intendedPurpose: 'Provide a robust, decoupled platform for data processing and user interactions.',
      targetUsers: 'Students, evaluators, developers, and interviewers examining architecture.',
      detectedProblem: 'Fragmented state updates and complex request coordination requiring clean abstraction.',
      languages,
      technologies,
      fileTree,
      entryPoints,
      workflows,
      documentation,
      findings,
      interviewMaterials: {
        pitches,
        questions
      }
    };

    const project: Project = {
      id: projectId,
      name: repoDetails.name,
      owner: repoDetails.owner,
      repoUrl: repoDetails.url,
      defaultBranch: repoDetails.defaultBranch,
      mainLanguage: primaryLanguage,
      primaryFramework,
      lastOpenedAt: now,
      lastAnalyzedAt: now,
      status: 'completed',
      currentAnalysis
    };

    db.saveProject(project);
    return project;
  }
}
