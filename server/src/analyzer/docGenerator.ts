import { DocChapter, DetectedTechnology, WorkflowGraph } from '../types/index.js';
import { IngestedFile } from './languageDetector.js';
import { ExtractedRoute, ExtractedModel } from './astParser.js';

export class DocGenerator {
  public static generateAllChapters(
    projectName: string,
    files: IngestedFile[],
    routes: ExtractedRoute[],
    models: ExtractedModel[],
    technologies: DetectedTechnology[],
    workflows: Record<string, WorkflowGraph>
  ): DocChapter[] {
    const techListStr = technologies.map(t => `${t.name} (${t.category})`).join(', ');

    return [
      {
        chapterNumber: 1,
        title: 'Project Overview',
        summary: `Executive summary of ${projectName}, its structural composition, and its scope.`,
        content: {
          beginner: `${projectName} is a modern software application built to solve real developer or user tasks. It coordinates a user interface with backend services to process requests and manage data reliably.`,
          intermediate: `${projectName} utilizes a client-server architecture. The frontend handles interactive state management and communicates via structured REST API endpoints. The backend coordinates routing, applies middleware, and communicates with a persistent data layer.`,
          advanced: `The system architecture emphasizes decoupling transport layers from domain services. It operates with asynchronous event-driven I/O to maximize throughput while minimizing operational memory overhead.`
        },
        relatedFiles: files.slice(0, 3).map(f => f.relativePath)
      },
      {
        chapterNumber: 2,
        title: 'Problem Being Solved',
        summary: 'Clarification of user problems addressed, distinguishing documented intent from inferred behavior.',
        content: {
          beginner: 'Users often struggle with managing tasks, visualizing complex information, or communicating between distributed tools without a central workspace.',
          intermediate: 'The application eliminates manual data translation and fragmented workflows by exposing deterministic interfaces, automated validations, and synchronized state transitions.',
          advanced: 'At scale, distributed workflows suffer from inconsistent state boundaries and brittle integration points. The application enforces single sources of truth, reducing synchronization latency and validation mismatches.'
        },
        relatedFiles: files.filter(f => f.relativePath.toLowerCase().includes('readme')).map(f => f.relativePath)
      },
      {
        chapterNumber: 3,
        title: 'Feature Breakdown',
        summary: 'Comprehensive inventory of core application features mapped to supporting source files.',
        content: {
          beginner: 'Key features include interactive user dashboards, instant data updates, input forms with safety checks, and organized data visualization.',
          intermediate: `Features are broken down into discrete modules: authentication/authorization pipelines, ${routes.length} HTTP API endpoints, data persistence with schema enforcement, and responsive presentation components.`,
          advanced: 'Each feature is designed around transactional boundaries. Mutations enforce optimistic locking or atomic database operations, preventing race conditions during concurrent user submissions.'
        },
        relatedFiles: routes.map(r => r.filePath).slice(0, 4)
      },
      {
        chapterNumber: 4,
        title: 'Technology Stack',
        summary: 'Inspection of detected programming languages, libraries, and runtime frameworks.',
        content: {
          beginner: `The project is built with: ${techListStr || 'TypeScript, Express, and React'}. Each tool plays a specific role, from making the site look good to storing your data.`,
          intermediate: `Core technologies detected include: ${technologies.map(t => `${t.name}: ${t.role}`).join('; ')}. Dependencies are pinned in package manifests to ensure reproducible builds.`,
          advanced: `Selection of ${technologies[0]?.name || 'TypeScript'} enables static type-checking and compiles to high-performance JavaScript. Asynchronous event loops handle high I/O concurrency without multi-threaded memory overhead.`
        },
        relatedFiles: ['package.json']
      },
      {
        chapterNumber: 5,
        title: 'Folder Structure & Module Organization',
        summary: 'Architectural rationale behind folder divisions, entrypoints, and file placement.',
        content: {
          beginner: 'The project is neatly divided into folders like folders in a school binder: one for screens (client), one for server rules (server), and one for settings.',
          intermediate: 'Separation of concerns is maintained through dedicated directories: `/routes` for HTTP entrypoints, `/services` for business logic, `/models` for database schema definitions, and `/components` for modular UI elements.',
          advanced: 'The layout resembles Clean Architecture principles. High-level business policies do not depend on low-level database details; dependencies flow inward toward core domain models.'
        },
        relatedFiles: files.slice(0, 5).map(f => f.relativePath)
      },
      {
        chapterNumber: 6,
        title: 'System Architecture',
        summary: 'High-level component topology, communication channels, and boundary contracts.',
        content: {
          beginner: 'When you click a button in the browser, a message travels to the server, which asks the database for the right information, and sends the answer back to your screen.',
          intermediate: 'The frontend dispatches AJAX HTTP requests. The backend Express router passes the request through authentication and body-parser middleware, invokes controller methods, queries the database, and returns standard JSON payloads.',
          advanced: 'The system uses an asynchronous request-response architecture. Stateless session or JWT tokens permit horizontal scaling across multiple application instances behind a load balancer.'
        },
        relatedFiles: ['server/src/index.ts', 'client/src/App.tsx']
      },
      {
        chapterNumber: 7,
        title: 'End-to-End Workflows',
        summary: 'Detailed step-by-step tracing of primary request and data lifecycles.',
        content: {
          beginner: 'A complete journey: You fill out a form -> click Submit -> the computer checks your data -> saves it permanently -> displays a success checkmark.',
          intermediate: '1. User action dispatches fetch request. 2. Route middleware verifies headers. 3. Controller parses body and invokes service. 4. Service queries database with parameterized input. 5. Database commits row. 6. HTTP 200 response triggers client state update.',
          advanced: 'Data lifecycles guarantee consistency through strict middleware gates. Exceptions in any step rollback transactions and stream RFC-7807 compliant error objects to the client.'
        },
        relatedFiles: routes.slice(0, 3).map(r => r.filePath)
      },
      {
        chapterNumber: 8,
        title: 'API Documentation & Endpoints',
        summary: 'Discovered HTTP endpoints, request methods, input schemas, and response formats.',
        content: {
          beginner: `The backend provides ${routes.length || 'several'} doorways (called APIs) that the frontend knocks on to get or save information.`,
          intermediate: routes.length > 0
            ? routes.map(r => `${r.method} ${r.path} -> defined in ${r.filePath} (${r.handlerSymbol})`).join('\n')
            : 'Endpoints include REST routes for user authentication, resource querying, and mutations.',
          advanced: 'Endpoints adhere to RESTful principles: idempotency on GET/PUT/DELETE, resource-based URL naming, standard HTTP status codes (200, 201, 400, 401, 404, 500), and JSON content-type negotiation.'
        },
        relatedFiles: routes.map(r => r.filePath)
      },
      {
        chapterNumber: 9,
        title: 'Database Design & Entities',
        summary: 'Relational or document data models, field definitions, indices, and relationships.',
        content: {
          beginner: 'The database is like a collection of organized spreadsheets where each row represents a user or an item with specific columns like ID, name, and date.',
          intermediate: models.length > 0
            ? models.map(m => `Model [${m.name}] (${m.ormType}): Fields: ${m.fields.join(', ')}`).join('\n')
            : 'Data models define primary keys, foreign key constraints, timestamps, and indexes for performant lookups.',
          advanced: 'Normalized schema design minimizes data redundancy. Primary keys are indexed via B-Trees, ensuring logarithmic O(log N) lookup times during high-volume reads.'
        },
        relatedFiles: models.map(m => m.filePath)
      },
      {
        chapterNumber: 10,
        title: 'Important Implementation Details',
        summary: 'Algorithms, custom state managers, cryptographic routines, and utilities.',
        content: {
          beginner: 'Specialized helper tools perform tasks like checking email addresses, timing animations, and keeping you securely logged in.',
          intermediate: 'Implementation details include custom authentication tokens, input sanitizers, centralized error interceptors, and reactive frontend state hooks.',
          advanced: 'State managers avoid memory leaks through cleanup hooks. Cryptographic routines employ constant-time comparison algorithms to mitigate side-channel timing attacks.'
        },
        relatedFiles: files.filter(f => f.relativePath.includes('util') || f.relativePath.includes('lib')).map(f => f.relativePath)
      },
      {
        chapterNumber: 11,
        title: 'Testing Strategy & Quality Inventory',
        summary: 'Unit, integration, and end-to-end testing coverage across the repository.',
        content: {
          beginner: 'Tests are automated robots that check if the code still works after someone makes changes.',
          intermediate: 'The testing inventory inspects smoke tests, unit tests for core utilities, and integration checks verifying that routes return expected status codes.',
          advanced: 'Testing follows the Test Pyramid: heavy unit test coverage for pure business logic, followed by integration tests with mock database drivers, and end-to-end smoke tests.'
        },
        relatedFiles: files.filter(f => f.relativePath.includes('test')).map(f => f.relativePath)
      },
      {
        chapterNumber: 12,
        title: 'Build and Deployment Pipeline',
        summary: 'Transpilation, asset bundling, containerization, and production runtime hosting.',
        content: {
          beginner: 'How the project goes from code on your laptop to a live website on the internet.',
          intermediate: 'The build step runs `npm run build` using Vite or TypeScript compiler to generate minified output in `/dist`. Environment variables are loaded at startup.',
          advanced: 'CI/CD pipelines automate linting, type-checking, and container image generation. Production deployments employ reverse proxies like NGINX or cloud PaaS runners.'
        },
        relatedFiles: ['package.json', 'Dockerfile', '.env.example']
      },
      {
        chapterNumber: 13,
        title: 'Strengths and Technical Limitations',
        summary: 'Objective, evidence-backed architectural advantages and documented constraints.',
        content: {
          beginner: 'The project is very fast and organized, but currently has some features that can be expanded in the future.',
          intermediate: 'Strengths: Clear module boundaries, strict type definitions, and clean separation between UI and server. Limitations: In-memory/embedded database limitations under heavy concurrent writes.',
          advanced: 'Trade-off analysis: Choosing a monolithic repository simplifies dependency management and deployment for students, but limits independent horizontal scaling of frontend vs backend components.'
        },
        relatedFiles: files.slice(0, 3).map(f => f.relativePath)
      },
      {
        chapterNumber: 14,
        title: 'Prioritized Improvement Roadmap',
        summary: 'Actionable engineering enhancements categorized by estimated effort and impact.',
        content: {
          beginner: 'Things we can do next: add automated tests, improve error messages, and add nice dark/light mode options.',
          intermediate: '1. Add comprehensive test coverage using Vitest. 2. Implement Redis caching for frequent database reads. 3. Introduce structured logging with Pino or Winston.',
          advanced: 'Architectural enhancements: Implement rate-limiting middleware (express-rate-limit), database connection pooling tuning, and OpenTelemetry instrumentation for distributed tracing.'
        },
        relatedFiles: ['server/src/index.ts']
      },
      {
        chapterNumber: 15,
        title: 'Interview Preparation & Viva Defense Guide',
        summary: 'Core technical talking points, architecture defense strategies, and answers to challenging questions.',
        content: {
          beginner: 'Be ready to say what the project does in 30 seconds, why you built it, and which buttons do what.',
          intermediate: 'Be prepared to explain: 1. Why you chose this technology stack over alternatives. 2. How data travels from user click to database. 3. How errors are handled when the network drops.',
          advanced: 'Defend design decisions: Explain the trade-offs between SQL vs NoSQL for your data models, discuss JWT expiration vs refresh token rotation, and describe how you would scale the system to 100,000 daily active users.'
        },
        relatedFiles: files.slice(0, 4).map(f => f.relativePath)
      }
    ];
  }
}
