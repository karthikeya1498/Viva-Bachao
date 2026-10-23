import {
  InterviewQuestion,
  ProjectIntroPitches,
  QuestionCategory,
  QuestionDifficulty,
  DetectedTechnology
} from '../types/index.js';
import { IngestedFile } from './languageDetector.js';
import { ExtractedRoute, ExtractedModel } from './astParser.js';

export class InterviewGenerator {
  public static generatePitches(
    projectName: string,
    primaryLang: string,
    primaryFramework: string,
    routesCount: number,
    models: ExtractedModel[],
    technologies: DetectedTechnology[]
  ): ProjectIntroPitches {
    const techNames = technologies.map(t => t.name).slice(0, 4).join(', ') || `${primaryLang} and ${primaryFramework}`;
    const modelNames = models.map(m => m.name).join(', ') || 'structured domain records';

    return {
      thirtySecondPitch: `"${projectName} is a developer-focused full-stack web application engineered using ${techNames}. It provides an integrated workflow for data management, structured API routing with ${routesCount} endpoints, and persistent storage for ${modelNames}, designed to give users real-time visibility and control."`,
      twoMinutePitch: `"I developed ${projectName} to solve the problem of fragmented workflows and lack of system visibility. The project is architected with a decoupled frontend built in ${primaryFramework} and a backend running ${primaryLang}.\n\nWhen a user interacts with the interface, the client dispatches RESTful API requests to our backend router. The backend passes requests through custom validation and authentication middleware, invokes business logic services, and persists state across ${models.length > 0 ? models.length : 'multiple'} database models. I focused on clean separation of concerns, ensuring that the database and transport layer remain isolated from core business logic."`,
      fiveMinuteDeepDive: `"Let's walk through the architectural blueprint of ${projectName}. The application is organized into three distinct tiers:\n\n1. Presentation & State Management: Built using modular components that bind directly to reactive state hooks. User events trigger asynchronous fetch pipelines that handle optimistic UI updates and gracefully capture network exceptions.\n\n2. API Routing & Middleware Pipeline: The server exposes ${routesCount} structured HTTP endpoints. Every incoming request flows through a middleware chain that validates JSON payloads, enforces CORS policies, and checks authorization tokens before reaching the business handlers.\n\n3. Service Layer & Persistence: Rather than embedding raw queries inside route handlers, I separated business logic into domain services. Persistence is managed via ${technologies.find(t => t.category === 'database')?.name || 'a relational database'}, where models (${modelNames}) are indexed on primary keys to ensure sub-millisecond query performance.\n\n4. Reliability & Error Recovery: The backend uses a centralized error-handling middleware that logs stack traces internally while returning sanitized, standardized error codes to the client, preventing credential leaks."`,
      resumeBulletPoints: [
        `Architected and deployed "${projectName}", a full-stack platform leveraging ${techNames} with ${routesCount} RESTful endpoints.`,
        `Designed normalized database schemas for ${modelNames}, implementing indexes and parameterized queries to prevent SQL injection.`,
        `Engineered end-to-end authentication and validation pipelines, reducing invalid payload exceptions and ensuring type safety.`,
        `Built modular frontend components with reactive state synchronization and centralized error toast notifications.`
      ],
      architectureExplanation: `The system follows an asynchronous client-server model. The client communicates via JSON over HTTP REST. The backend utilizes an event-driven loop to process requests through middleware, controllers, and services down to the database layer, maintaining strict separation of concerns.`
    };
  }

  public static generateQuestions(
    projectName: string,
    files: IngestedFile[],
    routes: ExtractedRoute[],
    models: ExtractedModel[],
    technologies: DetectedTechnology[]
  ): InterviewQuestion[] {
    const questions: InterviewQuestion[] = [];

    // Category A: Fundamentals
    questions.push({
      id: 'q-fund-1',
      category: 'fundamentals',
      difficulty: 'beginner',
      question: `What problem does ${projectName} solve, and who are its primary users?`,
      directAnswer: `${projectName} solves the challenge of scattered workflows and lack of visibility by providing a centralized, structured system for users to manage and inspect technical operations.`,
      technicalExplanation: 'The application consolidates user interactions, API dispatching, and persistent storage into an observable client-server architecture with deterministic error boundaries.',
      repositoryEvidence: 'Documented in README.md and root project configuration.',
      practicalExample: 'Instead of manually inspecting multiple disjointed files or logs, a user interacts with an intuitive UI backed by structured API endpoints.',
      tradeOffs: 'Focusing on a lightweight web interface requires a reliable network connection compared to a purely offline desktop CLI.',
      followUpQuestion: 'How would you enable offline capability or local-first synchronization if users lose network access?'
    });

    // Category B: Tech Stack
    questions.push({
      id: 'q-tech-1',
      category: 'tech_stack',
      difficulty: 'intermediate',
      question: `Why did you select ${technologies[0]?.name || 'TypeScript'} and ${technologies[1]?.name || 'Node.js'} for this project over alternatives?`,
      directAnswer: 'I chose this stack for end-to-end type safety, asynchronous event-driven I/O performance, and the massive ecosystem of battle-tested packages.',
      technicalExplanation: 'TypeScript allows sharing types between client and server, catching type mismatches at compile time rather than during runtime execution. Node.js non-blocking I/O is ideal for web APIs handling concurrent requests.',
      repositoryEvidence: 'Configured in package.json and tsconfig.json.',
      practicalExample: 'When modifying a data model interface, TypeScript immediately flags any controller or UI component expecting the old property structure.',
      tradeOffs: 'TypeScript requires a compilation step, and Node.js CPU-intensive tasks can block the single event loop if not offloaded to worker threads.',
      followUpQuestion: 'How would you handle heavy CPU-bound tasks like image processing or large PDF compilation in Node.js?'
    });

    // Category C: Architecture
    questions.push({
      id: 'q-arch-1',
      category: 'architecture',
      difficulty: 'intermediate',
      question: 'How is the project structured, and what are the responsibilities of its major modules?',
      directAnswer: 'The project follows a 3-tier modular architecture: presentation layer (client), routing and middleware (controllers), and domain business logic with data persistence (services/models).',
      technicalExplanation: 'Dependencies flow inward: routes pass validated data to services, which interact with database models. Controllers never execute raw database queries directly.',
      repositoryEvidence: 'Evident from directory separation: /routes, /services, /models, /components.',
      practicalExample: 'If we want to switch the database from SQLite to PostgreSQL, we only modify the database driver/model layer without touching any UI component or route definition.',
      tradeOffs: 'Layered architecture adds a few extra files per feature compared to writing everything in one script, but pays off in testability and maintainability.',
      followUpQuestion: 'How do you prevent circular dependency imports between your services?'
    });

    // Category D: Code-Level
    const primaryRoute = routes[0];
    questions.push({
      id: 'q-code-1',
      category: 'code_level',
      difficulty: 'intermediate',
      question: `What happens when a request hits ${primaryRoute ? primaryRoute.path : '/api/v1/resource'}? Walk me through the code.`,
      directAnswer: `The router matches ${primaryRoute ? primaryRoute.method + ' ' + primaryRoute.path : 'the path'}, runs body parsing and auth middleware, delegates to the handler, and returns a JSON response.`,
      technicalExplanation: `Express processes middleware linearly. If the payload is valid, the handler invokes the business service asynchronously using async/await, catches any rejection, and calls res.status(200).json().`,
      repositoryEvidence: primaryRoute ? `Defined in ${primaryRoute.filePath} around line ${primaryRoute.line}` : 'Route definition file',
      practicalExample: 'If a user sends an invalid parameter, the validation middleware short-circuits with a 400 Bad Request before hitting the database.',
      tradeOffs: 'Synchronous execution vs asynchronous promises: using async/await keeps asynchronous code readable like synchronous code while maintaining non-blocking I/O.',
      followUpQuestion: 'What happens if a promise inside the route handler rejects without a try-catch block?'
    });

    // Category E: API and Database
    questions.push({
      id: 'q-api-1',
      category: 'api_db',
      difficulty: 'intermediate',
      question: 'How does your application communicate between frontend and backend, and how is incoming data validated?',
      directAnswer: 'Communication occurs over HTTP REST using JSON payloads. Incoming data is validated on the client for user experience and strictly re-validated on the server for security.',
      technicalExplanation: 'The frontend uses the Fetch API with JSON serialization. The server parses the body using express.json() and validates schema types before database persistence.',
      repositoryEvidence: 'API routes and model schemas in server directory.',
      practicalExample: 'If a user submits an empty string for a required name field, the server returns `{ error: "Name is required" }` with HTTP status 422.',
      tradeOffs: 'REST over WebSockets was chosen because the workflows are primarily request-driven rather than requiring bidirectional sub-millisecond streaming.',
      followUpQuestion: 'When would you consider replacing REST with GraphQL or gRPC in this system?'
    });

    // Category F: Security
    questions.push({
      id: 'q-sec-1',
      category: 'security',
      difficulty: 'advanced',
      question: 'How does your application protect against common web vulnerabilities like SQL Injection, XSS, and CSRF?',
      directAnswer: 'SQL Injection is prevented through parameterized queries / ORM abstractions. XSS is mitigated by React automatic text encoding and CSP headers. CSRF is mitigated via modern SameSite cookies and Bearer tokens.',
      technicalExplanation: 'Parameterized queries separate SQL command structure from user input data at the database driver level. React DOM nodes escape string literals by default, preventing execution of injected `<script>` tags.',
      repositoryEvidence: 'Database queries and React JSX syntax.',
      practicalExample: 'Entering `\' OR 1=1 --` into a login form treats the input as a literal string value rather than executable SQL syntax.',
      tradeOffs: 'Strict sanitization can occasionally strip intentional HTML markup if not carefully configured with an explicit allowlist.',
      followUpQuestion: 'How would you securely store JWT tokens on the client: in localStorage or httpOnly cookies?'
    });

    // Category G: Testing and Debugging
    questions.push({
      id: 'q-test-1',
      category: 'testing_debugging',
      difficulty: 'intermediate',
      question: 'If a user reports that a request fails with a 500 error, what is your systematic debugging process?',
      directAnswer: '1. Inspect the server log file for the timestamped error stack trace. 2. Identify the failing line and error type. 3. Reproduce locally with the exact request payload. 4. Write a test case, fix the bug, and verify.',
      technicalExplanation: 'I check the correlation ID or request timestamp, check if the error was a null reference or database connection failure, reproduce with mock inputs, and verify the fix with automated assertions.',
      repositoryEvidence: 'Error handling middleware and logger configuration.',
      practicalExample: 'If a user submits a null field that was expected to be an array, the logs will show `TypeError: Cannot read properties of undefined (reading \'map\')`.',
      tradeOffs: 'Detailed error messages in logs help developers debug quickly, but stack traces must never be exposed to the public HTTP response for security.',
      followUpQuestion: 'How do you monitor runtime errors in production environments without manually checking log files?'
    });

    // Category H: Design Decisions
    questions.push({
      id: 'q-design-1',
      category: 'design_decisions',
      difficulty: 'advanced',
      question: 'What architectural trade-offs exist in your current implementation, and what would you change if scaling 100x?',
      directAnswer: 'The current monolithic design is simple to develop and deploy locally, but at 100x scale, database write bottlenecks and monolithic deployments would necessitate caching and horizontal scaling.',
      technicalExplanation: 'To scale 100x: 1. Introduce Redis for read caching. 2. Move from embedded SQLite to a clustered PostgreSQL instance with read replicas. 3. Containerize using Docker and deploy behind an NGINX load balancer.',
      repositoryEvidence: 'Monolithic project layout and database storage module.',
      practicalExample: 'Caching frequent GET queries in Redis reduces database load by 80%, allowing the system to serve thousands of concurrent requests.',
      tradeOffs: 'Microservices add significant networking overhead and distributed transaction complexity; a modular monolith is often the superior choice until team size or traffic demands microservices.',
      followUpQuestion: 'What caching strategy would you use: cache-aside, write-through, or write-behind?'
    });

    // Category I: Project Ownership
    questions.push({
      id: 'q-own-1',
      category: 'project_ownership',
      difficulty: 'intermediate',
      question: 'Which parts of this application did you design yourself, and what was the most difficult technical hurdle you overcame?',
      directAnswer: 'I designed the system architecture, API schemas, and interactive whiteboard workflow. The hardest challenge was ensuring evidence-based traceability between UI nodes and actual source code files.',
      technicalExplanation: 'Connecting high-level architecture diagrams with concrete static analysis required building deterministic AST parsers and file classification algorithms that work across various project conventions.',
      repositoryEvidence: 'Source code in /server and /client directories.',
      practicalExample: 'When building the dependency graph, resolving relative import paths across different folder depths required canonical path normalization.',
      tradeOffs: 'Building custom static analysis tools gave me deep understanding of ASTs and compilers, whereas using an off-the-shelf black-box library would have been faster but less tailored.',
      followUpQuestion: 'If you had another two weeks to work on this repository, what single feature would you prioritize?'
    });

    return questions;
  }

  public static evaluateMockAnswer(
    question: InterviewQuestion,
    userAnswer: string
  ): {
    score: number;
    verdict: 'Excellent' | 'Good' | 'Needs Improvement' | 'Incomplete';
    feedback: string;
    wellExplainedPoints: string[];
    missingPoints: string[];
    suggestedFollowUp: string;
  } {
    const text = userAnswer.trim().toLowerCase();
    const minLength = 30;

    if (text.length < minLength) {
      return {
        score: 35,
        verdict: 'Incomplete',
        feedback: 'Your answer is too brief for a technical interview. Interviewers look for concrete explanations of HOW and WHY the implementation works, supported by specific examples.',
        wellExplainedPoints: ['Attempted initial direct response'],
        missingPoints: [
          'Detailed technical explanation of the underlying mechanism',
          'Concrete mention of repository files, technologies, or functions',
          'Discussion of failure modes or architectural trade-offs'
        ],
        suggestedFollowUp: question.followUpQuestion
      };
    }

    // Heuristic keyword extraction from expected technical explanation
    const keywords = [
      ...question.directAnswer.toLowerCase().split(/\s+/),
      ...question.technicalExplanation.toLowerCase().split(/\s+/)
    ].filter(w => w.length > 4 && !['which', 'their', 'there', 'where', 'these', 'about', 'under'].includes(w));

    let matchedCount = 0;
    const foundKeywords: string[] = [];
    for (const kw of keywords) {
      if (text.includes(kw) && !foundKeywords.includes(kw)) {
        foundKeywords.push(kw);
        matchedCount++;
      }
    }

    const keywordRatio = Math.min(matchedCount / 6, 1.0);
    const lengthScore = Math.min(text.length / 250, 1.0);
    const calculatedScore = Math.round(keywordRatio * 55 + lengthScore * 40 + 5);

    const wellExplainedPoints: string[] = [];
    const missingPoints: string[] = [];

    if (calculatedScore >= 80) {
      wellExplainedPoints.push('Clearly articulated core technical concepts and direct answer');
      wellExplainedPoints.push('Demonstrated strong understanding of the architectural purpose');
      if (text.length > 200) wellExplainedPoints.push('Provided solid depth and implementation context');
      missingPoints.push('Could further highlight concrete trade-offs or performance numbers');
      return {
        score: calculatedScore,
        verdict: 'Excellent',
        feedback: 'Outstanding response! You explained the concept clearly, demonstrated technical ownership, and connected the answer to realistic engineering practices.',
        wellExplainedPoints,
        missingPoints,
        suggestedFollowUp: question.followUpQuestion
      };
    } else if (calculatedScore >= 60) {
      wellExplainedPoints.push('Addressed the main question and identified the correct technology/layer');
      wellExplainedPoints.push('Demonstrated reasonable conceptual grasp of the workflow');
      missingPoints.push('Cite specific source files or function names to prove hands-on ownership');
      missingPoints.push('Mention potential failure edge-cases and how the code recovers');
      return {
        score: calculatedScore,
        verdict: 'Good',
        feedback: 'Solid answer! You hit the main points. To turn this into a top-percentile response, weave in specific file paths and explain what trade-offs you considered.',
        wellExplainedPoints,
        missingPoints,
        suggestedFollowUp: question.followUpQuestion
      };
    } else {
      wellExplainedPoints.push('Understood the basic question premise');
      missingPoints.push('Needs deeper technical terminology (e.g. middleware, promises, ACID, indexes)');
      missingPoints.push('Explain HOW the code behaves under the hood rather than just what the user sees');
      missingPoints.push('Include a concrete code or architecture example');
      return {
        score: calculatedScore,
        verdict: 'Needs Improvement',
        feedback: 'Your answer is on the right track, but lacks technical depth. Avoid generic summaries; walk through how requests, data, or error handling actually work step-by-step.',
        wellExplainedPoints,
        missingPoints,
        suggestedFollowUp: question.followUpQuestion
      };
    }
  }
}
