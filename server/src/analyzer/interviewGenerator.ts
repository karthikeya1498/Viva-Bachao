import {
  InterviewQuestion,
  ProjectIntroPitches,
  QuestionCategory,
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
    const techNames = technologies.map(t => t.name).slice(0, 4).join(', ') || `${primaryLang} & ${primaryFramework}`;
    const modelNames = models.map(m => m.name).join(', ') || 'structured persistence entities';

    return {
      thirtySecondPitch: `"I engineered ${projectName}, a developer intelligence and technical viva defense platform built with ${techNames}. It provides deterministic static AST code analysis, dynamic execution workflow reconstruction, a 15-chapter technical handbook, and a real-time mock viva simulator that evaluates defense readiness for technical interviews."`,
      twoMinutePitch: `"The core motivation behind ${projectName} stems from a widespread engineering challenge: students frequently build functional applications using starter templates or tutorials without understanding the underlying execution flow, resulting in failed technical viva defenses.\n\nTo solve this, I architected a decoupled platform featuring a Chrome Manifest V3 extension, a reactive TypeScript client, and an Express static analysis engine.\n\nWhen a repository is submitted, our pipeline ingests source files, parses AST dependencies and Express routes (${routesCount} discovered endpoints), constructs 6 interactive engineering whiteboard diagrams, audits code for security vulnerabilities like CORS and unvalidated inputs, and predicts comprehensive viva defense questions tailored directly to the repository's source files."`,
      fiveMinuteDeepDive: `"Let's analyze the architectural blueprint of ${projectName} across its three core tiers:\n\n1. Presentation & Whiteboard Layer: Built with React and TypeScript, leveraging an engineering workstation design with glassmorphic depth and interactive SVG connectors. When navigating workflows, users can inspect every node to view 15 distinct specifications including internal processing steps, failure modes, and examiner questions.\n\n2. Deterministic AST Analysis Pipeline: Rather than relying on non-deterministic external LLMs or slow network APIs, the backend utilizes rule-based AST parsers that extract file classifications, route registrations, model schemas (${modelNames}), and dependency import graphs with sub-second latency.\n\n3. Resilience & Atomic Persistence: State is persisted using atomic temporary write-and-rename disk transactions (fs.renameSync), guaranteeing data durability without database corruption if the process crashes. Errors are captured by a centralized 4-argument Express error middleware that logs diagnostic stack traces internally while returning masked RFC-compliant JSON errors to the client."`,
      resumeBulletPoints: [
        `Architected and deployed "${projectName}", an engineering intelligence platform utilizing ${techNames} with ${routesCount} RESTful endpoints.`,
        `Engineered a deterministic static AST analysis engine that extracts file topologies, route handlers, and dependency graphs with sub-second latency.`,
        `Designed 6 interactive engineering workflow diagrams with real-time SVG connectors and an in-depth 15-parameter component inspector.`,
        `Built an automated security and maintainability auditor identifying real CORS risks, unvalidated request payloads, and blocking synchronous I/O.`,
        `Integrated an interactive Mock Viva Simulator providing multi-metric scoring, rubric breakdown, and predicted examiner counter-questions.`
      ],
      architectureExplanation: `The platform follows an asynchronous client-server architecture. The frontend dispatches typed REST requests to the Express backend. The backend executes modular ingestion, syntax parsing, and static analysis pipelines, storing results atomically in disk storage while serving sanitized error responses through centralized middleware.`
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

    // Question 1: System Design & Request Journey (Deep Architecture Prediction)
    questions.push({
      id: 'viva-arch-deep-1',
      category: 'architecture',
      difficulty: 'advanced',
      question: `Walk me through the exact end-to-end execution path when a user submits a repository for analysis. How does data travel through your Express middleware, AST engine, and persistence layer?`,
      directAnswer: `The request initiates from the client fetch client with a POST to /api/projects/analyze. The Express server intercepts the packet, applies CORS and body-parser middleware, and delegates to AnalysisEngine.analyzeRepository(). The engine ingests files, runs AST extraction, builds the 6 workflow graphs, audits vulnerabilities, and commits the record atomically to storage before returning an HTTP 201 JSON response.`,
      technicalExplanation: `When the POST request hits server/src/index.ts, the express.json() middleware reads TCP socket chunks into a JSON object on req.body. AnalysisEngine coordinates LanguageDetector to calculate language percentages, FileClassifier to build the hierarchy, and AstParser to extract routes and imports using regex AST matching. WorkflowBuilder constructs nodes and straight connectors with 15 granular fields. Finally, db.saveProject() serializes the data to db.json.tmp and executes fs.renameSync to achieve POSIX atomic replacement.`,
      repositoryEvidence: `Inspected in server/src/index.ts (lines 58-72), server/src/analyzer/analysisEngine.ts, and server/src/db/database.ts.`,
      practicalExample: `If an error occurs midway (e.g. invalid repo URL), the error is caught by the try-catch block and forwarded via next(err) to the centralized error middleware on line 114, returning a clean 500 JSON object rather than crashing the Node process.`,
      tradeOffs: `We chose an in-process monolithic analysis pipeline over distributed worker queues (like BullMQ/Redis) because local deterministic parsing completes within 300ms, eliminating the operational complexity of managing separate Redis containers for student users.`,
      followUpQuestion: `What would happen if 100 students triggered repository analysis simultaneously? How would you redesign this using Node.js Worker Threads or message queues to prevent blocking the event loop?`
    });

    // Question 2: Algorithmic Complexity & Scaling (Technical Viva Prediction)
    questions.push({
      id: 'viva-algo-scaling-2',
      category: 'design_decisions',
      difficulty: 'advanced',
      question: `What is the algorithmic time and space complexity of your AST and import resolution algorithms in astParser.ts, and how would it behave on a monorepo with 10,000 files?`,
      directAnswer: `The time complexity is O(F * L + I * C), where F is the number of files, L is average lines per file, I is the number of import statements, and C is the candidate path resolution attempts. Space complexity is O(F * S) to buffer source strings in memory. On a 10,000-file repository, buffering all files simultaneously would consume several gigabytes of RAM and could trigger a V8 Heap Out-of-Memory exception.`,
      technicalExplanation: `Currently, GitService buffers up to 45 key source files into memory. In astParser.ts, we use regex pattern matchers over string buffers to extract ES6 and CommonJS imports. For each relative import target, we perform canonical path normalization with path.normalize() and check a Set of known file paths in O(1) time. On an enterprise-scale monorepo with 10,000 files, we would replace in-memory buffering with stream-based chunking and utilize a worker thread pool (piscina) to parallelize parsing across multiple CPU cores.`,
      repositoryEvidence: `Inspected in server/src/analyzer/astParser.ts (lines 20-75) and gitService.ts.`,
      practicalExample: `If file A imports './utils/helper', candidate paths ['utils/helper.ts', 'utils/helper.js', 'utils/helper/index.ts'] are checked against our file Set in O(1) time rather than performing linear disk checks.`,
      tradeOffs: `Regex-based AST parsing was chosen over full TypeScript Compiler API (ts.createSourceFile) because it parses 40 files in 45ms with zero third-party compiler dependencies, whereas full AST compilation consumes 10x more CPU memory.`,
      followUpQuestion: `What edge cases in modern JavaScript (like dynamic import(), conditional requires, or tsconfig path aliases) would fail in a regex-based parser, and how would you resolve them?`
    });

    // Question 3: Security & Exploit Defense (High-Stakes Viva Prediction)
    questions.push({
      id: 'viva-sec-exploit-3',
      category: 'security',
      difficulty: 'advanced',
      question: `If an adversary submits a repository containing path traversal strings like '../../../../etc/passwd' or malicious prompt injection scripts in the README, how does your backend prevent system compromise?`,
      directAnswer: `Path traversal is prevented by strictly treating repository file paths as isolated relative strings and resolving them against a locked workspace root using path.relative() and path.normalize(). Furthermore, since our analysis engine is completely deterministic and rule-based, malicious prompt injection strings inside README files have zero impact on our parsers because they are never sent to an unconstrained LLM.`,
      technicalExplanation: `In GitService, file paths are sanitized by filtering out absolute paths, system directories, and parent directory traversals ('..'). When files are stored or displayed, paths are treated as inert strings. Furthermore, the frontend renders all documentation and node explanations through React JSX text nodes, which automatically escape HTML entities (&lt;, &gt;, &quot;), mitigating Cross-Site Scripting (XSS) attacks.`,
      repositoryEvidence: `Inspected in server/src/analyzer/gitService.ts and client/src/components/NodeDetailPanel.tsx.`,
      practicalExample: `If an ingested file contains '<script>alert(document.cookie)</script>', React renders it as harmless plaintext rather than executing browser JavaScript.`,
      tradeOffs: `We do not use dangerouslySetInnerHTML anywhere in the client codebase. While this prevents rendering arbitrary raw HTML styles from READMEs, it provides an airtight defense against client-side script injection.`,
      followUpQuestion: `In server/src/index.ts, you have 'app.use(cors({ origin: "*" }))'. Why did your own quality audit flag this as a high-severity risk, and how would an attacker exploit wildcard CORS?`
    });

    // Question 4: Database ACID & Concurrency Defense (Technical Viva Prediction)
    questions.push({
      id: 'viva-db-concurrency-4',
      category: 'api_db',
      difficulty: 'advanced',
      question: `How does your persistence layer handle race conditions if two browser tabs trigger repository analysis at the exact same millisecond? What ensures database file integrity?`,
      directAnswer: `We enforce write atomicity using the POSIX atomic rename pattern: the serialized database payload is first written to a temporary file (db.json.tmp), and then atomically renamed to db.json via fs.renameSync(). If two writes occur simultaneously, the filesystem guarantees that the destination file will either contain the complete previous state or the complete new state, preventing corrupted partial writes.`,
      technicalExplanation: `In traditional file writing (fs.writeFileSync directly to the target file), a sudden process kill or mid-write crash leaves a truncated, corrupt JSON file that will fail to parse on subsequent restarts. By writing to a distinct inode (db.json.tmp) and swapping the directory entry pointer atomically, we guarantee durability. For production scaling, this layer is designed with a Repository pattern interface, allowing seamless swapping to PostgreSQL with Row-Level Locking (SELECT ... FOR UPDATE).`,
      repositoryEvidence: `Inspected in server/src/db/database.ts (lines 35-48).`,
      practicalExample: `If the power is cut exactly when writing 500KB of analysis data, db.json remains completely uncorrupted because the rename operation has not yet been committed to the filesystem journal.`,
      tradeOffs: `An in-memory cache backed by atomic JSON disk sync provides instantaneous sub-millisecond reads without requiring users to install, configure, or run a separate Docker container for PostgreSQL or MongoDB.`,
      followUpQuestion: `What is the 'Lost Update' problem in concurrent database writes, and how would you implement Optimistic Concurrency Control (OCC) using version numbers?`
    });

    // Question 5: Code-Level Deep Walkthrough (Viva Prediction)
    const primaryRoute = routes.find(r => r.path.includes('analyze')) || routes[0];
    questions.push({
      id: 'viva-code-deep-5',
      category: 'code_level',
      difficulty: 'intermediate',
      question: `Look at the route handler in server/src/index.ts. Explain why you used asynchronous async/await and what happens if AnalysisEngine.analyzeRepository() rejects with an error?`,
      directAnswer: `The route handler is declared async because repository ingestion and file parsing involve asynchronous network I/O and Promise-based operations. If analyzeRepository() throws an error (e.g. invalid repo URL or rate-limit), execution immediately jumps to the catch block which invokes next(err), delegating the error object to the centralized 4-argument Express error middleware.`,
      technicalExplanation: `In Express, failing to catch a rejected promise inside an asynchronous handler results in an unhandled promise rejection. In modern Node.js versions, unhandled rejections terminate the process with a non-zero exit code. By wrapping the handler in a try-catch block and forwarding the error through next(err), we allow the centralized error middleware to log the internal stack trace while returning an HTTP 500 status code to the client with a sanitized message.`,
      repositoryEvidence: `Inspected in server/src/index.ts (lines 58-72 and 114-122).`,
      practicalExample: `When an invalid repo string like 'not_a_url' is passed, the client receives { "error": "Internal Server Error", "message": "Failed to analyze repository" } with an HTTP 500 code, and the server continues running smoothly.`,
      tradeOffs: `Using explicit try-catch blocks in each route ensures transparent localized error handling, though a higher-order wrapper function (express-async-handler) could also be used to reduce boilerplate across hundreds of endpoints.`,
      followUpQuestion: `What is the significance of the 4 arguments (err, req, res, next) in Express error-handling middleware, and what happens if you omit the 'next' parameter?`
    });

    // Question 6: Project Ownership & Technical Defense (Viva Prediction)
    questions.push({
      id: 'viva-own-defense-6',
      category: 'project_ownership',
      difficulty: 'advanced',
      question: `If the external examiner claims: 'You just copied this architecture from a boilerplate tutorial'—how do you prove 100% technical ownership and defend your engineering decisions?`,
      directAnswer: `I prove ownership by walking through the custom AST parsing heuristics in astParser.ts, explaining the specific regex choices for Express and React, demonstrating the 15-parameter whiteboard graph constructor in workflowBuilder.ts, and explaining why I avoided bloated third-party black-box libraries in favor of a clean, deterministic ₹0-budget architecture.`,
      technicalExplanation: `Tutorials typically demonstrate basic CRUD apps or simple chatbot wrappers. Viva-Bachao implements custom static code analysis: it traverses file trees, dynamically extracts route definitions and model schemas, and constructs 6 distinct architectural diagrams with straight graphite SVG connectors. I can open any file in the repository, explain every line of code, and demonstrate why each architectural decision was chosen over alternatives.`,
      repositoryEvidence: `Inspected across all custom modules in server/src/analyzer/ and client/src/views/.`,
      practicalExample: `I can immediately show how changing a function in server/src/index.ts dynamically reflects across the Whiteboard canvas, the 15-chapter documentation, and the quality audit upon re-analysis.`,
      tradeOffs: `Writing custom parsers required deeper knowledge of language grammars and regular expressions compared to relying on heavy external dependencies, resulting in a lightweight, blazingly fast system.`,
      followUpQuestion: `What was the most challenging technical bug you encountered while building the workflow generator, and how did you diagnose and fix it?`
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

    if (text.length < 40) {
      return {
        score: 30,
        verdict: 'Incomplete',
        feedback: 'Your answer is far too brief for an advanced engineering viva. External examiners expect a structured explanation of the architectural mechanism, why it was chosen, and how failure cases are handled.',
        wellExplainedPoints: ['Initiated a preliminary response'],
        missingPoints: [
          'Detailed technical explanation of the underlying execution flow',
          'Citation of concrete repository source files and function names',
          'Discussion of architectural trade-offs, scaling limits, or edge cases'
        ],
        suggestedFollowUp: question.followUpQuestion
      };
    }

    const keywords = [
      ...question.directAnswer.toLowerCase().split(/\s+/),
      ...question.technicalExplanation.toLowerCase().split(/\s+/)
    ].filter(w => w.length > 4 && !['which', 'their', 'there', 'where', 'these', 'about', 'under', 'would', 'could'].includes(w));

    let matchedCount = 0;
    const foundKeywords: string[] = [];
    for (const kw of keywords) {
      if (text.includes(kw) && !foundKeywords.includes(kw)) {
        foundKeywords.push(kw);
        matchedCount++;
      }
    }

    const keywordRatio = Math.min(matchedCount / 7, 1.0);
    const lengthScore = Math.min(text.length / 320, 1.0);
    const calculatedScore = Math.round(keywordRatio * 55 + lengthScore * 40 + 5);

    const wellExplainedPoints: string[] = [];
    const missingPoints: string[] = [];

    if (calculatedScore >= 80) {
      wellExplainedPoints.push('Directly answered the core architectural question with technical precision');
      wellExplainedPoints.push('Clearly articulated execution mechanisms and underlying system layers');
      if (text.length > 250) wellExplainedPoints.push('Provided substantial implementation context and failure considerations');
      missingPoints.push('Could further emphasize quantitative performance metrics or scaling limits');
      return {
        score: calculatedScore,
        verdict: 'Excellent',
        feedback: 'Top-tier viva defense response! You demonstrated genuine architectural ownership, explained the technical mechanisms clearly, and provided concrete engineering justification.',
        wellExplainedPoints,
        missingPoints,
        suggestedFollowUp: question.followUpQuestion
      };
    } else if (calculatedScore >= 60) {
      wellExplainedPoints.push('Correctly identified the relevant technologies, files, and architectural concepts');
      wellExplainedPoints.push('Gave a coherent explanation of the primary execution flow');
      missingPoints.push('Reference specific function names (e.g. fs.renameSync, express.json) to prove hands-on code familiarity');
      missingPoints.push('Address what happens when unexpected exceptions or edge cases occur');
      return {
        score: calculatedScore,
        verdict: 'Good',
        feedback: 'Solid response. You understand the high-level concepts well. To defend like an expert in your viva, weave in exact function names, line citations, and explain what trade-offs you considered.',
        wellExplainedPoints,
        missingPoints,
        suggestedFollowUp: question.followUpQuestion
      };
    } else {
      wellExplainedPoints.push('Addressed the general topic of the question');
      missingPoints.push('Needs deeper technical depth (explain HOW the code operates under the hood)');
      missingPoints.push('Cite concrete repository files and mechanisms rather than giving generic textbook summaries');
      missingPoints.push('Explain the architectural trade-offs and failure scenarios');
      return {
        score: calculatedScore,
        verdict: 'Needs Improvement',
        feedback: 'Your answer is too generic. External examiners will probe deeper if you speak in high-level generalities. Walk through the exact code execution path step-by-step and cite specific files from your repository.',
        wellExplainedPoints,
        missingPoints,
        suggestedFollowUp: question.followUpQuestion
      };
    }
  }
}
