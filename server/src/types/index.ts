export type ProjectStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'outdated';

export type NodeType =
  | 'user_interaction'
  | 'ui_component'
  | 'api_request'
  | 'backend_route'
  | 'controller'
  | 'service'
  | 'db_operation'
  | 'external_service'
  | 'auth_step'
  | 'error_handler';

export type VerificationConfidence = 'confirmed' | 'inferred' | 'unresolved';

export interface WorkflowNode {
  id: string;
  label: string;
  nodeType: NodeType;
  filePath: string;
  symbol: string;
  purpose: string;
  inputs?: string[];
  processingSteps: string[];
  outputs?: string[];
  plainExplanation: string;
  technicalExplanation: string;
  failureScenarios: string[];
  interviewQuestions: string[];
  confidence: VerificationConfidence;
  evidenceReferences: string[];
  x?: number;
  y?: number;
}

export type RelationshipType =
  | 'calls'
  | 'renders'
  | 'queries'
  | 'authenticates'
  | 'handles_error'
  | 'triggers'
  | 'passes_data';

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  relationshipType: RelationshipType;
  confidence: VerificationConfidence;
  evidence: string;
}

export type WorkflowView =
  | 'system_architecture'
  | 'request_lifecycle'
  | 'data_lifecycle'
  | 'auth_lifecycle'
  | 'error_handling'
  | 'deployment';

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewType: WorkflowView;
}

export type FindingCategory =
  | 'strength'
  | 'weakness'
  | 'security'
  | 'performance'
  | 'maintainability'
  | 'testing';

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface ProjectFinding {
  id: string;
  title: string;
  category: FindingCategory;
  severity: SeverityLevel;
  description: string;
  evidence: string;
  affectedFiles: string[];
  impact: string;
  recommendedCorrection: string;
  beforeCode?: string;
  afterCode?: string;
  estimatedEffort: string; // e.g. '30 mins', '2 hours'
  confidence: VerificationConfidence;
  verificationStatus: string;
}

export type ExplanationLevel = 'beginner' | 'intermediate' | 'advanced';

export interface DocChapter {
  chapterNumber: number;
  title: string;
  summary: string;
  content: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
  codeSnippets?: { title: string; language: string; code: string; filePath?: string }[];
  relatedFiles: string[];
}

export type QuestionCategory =
  | 'fundamentals'
  | 'tech_stack'
  | 'architecture'
  | 'code_level'
  | 'api_db'
  | 'security'
  | 'testing_debugging'
  | 'design_decisions'
  | 'project_ownership';

export type QuestionDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface InterviewQuestion {
  id: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  question: string;
  directAnswer: string;
  technicalExplanation: string;
  repositoryEvidence: string;
  practicalExample: string;
  tradeOffs: string;
  followUpQuestion: string;
}

export interface ProjectIntroPitches {
  thirtySecondPitch: string;
  twoMinutePitch: string;
  fiveMinuteDeepDive: string;
  resumeBulletPoints: string[];
  architectureExplanation: string;
}

export interface FileTreeNode {
  path: string;
  name: string;
  type: 'file' | 'directory';
  size?: number;
  classification?: string;
  children?: FileTreeNode[];
}

export interface DetectedTechnology {
  name: string;
  category: 'language' | 'frontend_framework' | 'backend_framework' | 'database' | 'library' | 'tool';
  version?: string;
  role: string;
  detectedInFiles: string[];
  evidence: string;
}

export interface ProjectAnalysis {
  id: string;
  projectId: string;
  createdAt: string;
  revision: string;
  summary: string;
  intendedPurpose: string;
  targetUsers: string;
  detectedProblem: string;
  languages: { [lang: string]: number }; // percentage or file count
  technologies: DetectedTechnology[];
  fileTree: FileTreeNode[];
  entryPoints: { path: string; type: string; description: string }[];
  workflows: Record<WorkflowView, WorkflowGraph>;
  documentation: DocChapter[];
  findings: ProjectFinding[];
  interviewMaterials: {
    pitches: ProjectIntroPitches;
    questions: InterviewQuestion[];
  };
}

export interface Project {
  id: string;
  name: string;
  owner: string;
  repoUrl: string;
  defaultBranch: string;
  mainLanguage: string;
  primaryFramework: string;
  lastOpenedAt: string;
  lastAnalyzedAt: string;
  status: ProjectStatus;
  currentAnalysis?: ProjectAnalysis;
}
