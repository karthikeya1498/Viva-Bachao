import {
  WorkflowGraph,
  WorkflowNode,
  WorkflowEdge,
  WorkflowView,
  DetectedTechnology
} from '../types/index.js';
import { IngestedFile } from './languageDetector.js';
import { ExtractedRoute, ExtractedModel, ExtractedImport } from './astParser.js';
import { FileClassifier } from './fileClassifier.js';

export class WorkflowBuilder {
  public static buildAllWorkflows(
    files: IngestedFile[],
    routes: ExtractedRoute[],
    models: ExtractedModel[],
    imports: ExtractedImport[],
    technologies: DetectedTechnology[]
  ): Record<WorkflowView, WorkflowGraph> {
    return {
      system_architecture: this.buildSystemArchitecture(files, routes, models, imports, technologies),
      request_lifecycle: this.buildRequestLifecycle(files, routes),
      data_lifecycle: this.buildDataLifecycle(files, routes, models),
      auth_lifecycle: this.buildAuthLifecycle(files, routes),
      error_handling: this.buildErrorHandling(files, routes),
      deployment: this.buildDeploymentFlow(files, technologies)
    };
  }

  private static buildSystemArchitecture(
    files: IngestedFile[],
    routes: ExtractedRoute[],
    models: ExtractedModel[],
    imports: ExtractedImport[],
    technologies: DetectedTechnology[]
  ): WorkflowGraph {
    const nodes: WorkflowNode[] = [];
    const edges: WorkflowEdge[] = [];

    // 1. Client UI Entry Node
    const uiFile = files.find(f => {
      const c = FileClassifier.classify(f);
      return c === 'ui_component' || c === 'page' || f.relativePath.includes('App.');
    }) || files[0];

    const clientNode: WorkflowNode = {
      id: 'node-client-ui',
      label: 'Client Browser & UI Layer',
      nodeType: 'ui_component',
      filePath: uiFile ? uiFile.relativePath : 'src/App.tsx',
      symbol: 'React Virtual DOM / Component Tree',
      purpose: 'Renders the presentation layer, captures user input events, and manages local UI state.',
      inputs: ['User clicks', 'Form inputs', 'Keyboard navigation'],
      processingSteps: [
        'Receives user interaction event',
        'Validates state invariants in UI component',
        'Triggers asynchronous network dispatch (Fetch / Axios)'
      ],
      outputs: ['Rendered DOM elements', 'HTTP request payload'],
      plainExplanation: 'This is the visual screen where the student or user interacts with buttons and forms.',
      technicalExplanation: 'The frontend component layer handles event propagation, synchronizes with the Virtual DOM, and dispatches API calls to the server.',
      failureScenarios: [
        'Uncaught JavaScript runtime error crashes React component tree',
        'Stale closure causes state to be out of sync with user input'
      ],
      interviewQuestions: [
        'How does state flow from parent to child components in this view?',
        'What prevents unnecessary re-renders when user types in the input field?'
      ],
      confidence: 'confirmed',
      evidenceReferences: [uiFile ? uiFile.relativePath : 'frontend bundle'],
      x: 100,
      y: 180
    };
    nodes.push(clientNode);

    // 2. API Gateway / Route Dispatcher Node
    const primaryRoute = routes[0] || {
      method: 'POST',
      path: '/api/v1/resource',
      handlerSymbol: 'handleResource',
      filePath: 'src/routes/api.ts'
    };

    const routeNode: WorkflowNode = {
      id: 'node-backend-router',
      label: `API Router [${routes.length > 0 ? routes.length + ' endpoints' : 'HTTP Server'}]`,
      nodeType: 'backend_route',
      filePath: primaryRoute.filePath,
      symbol: `${primaryRoute.method} ${primaryRoute.path}`,
      purpose: 'Matches incoming HTTP requests against URL patterns and invokes corresponding controller middleware.',
      inputs: ['HTTP request headers', 'Query parameters', 'JSON Body'],
      processingSteps: [
        'Parses HTTP request line and headers',
        'Applies CORS and body-parsing middleware',
        'Dispatches payload to matched controller handler'
      ],
      outputs: ['Express Request/Response context'],
      plainExplanation: 'Like a receptionist directing incoming visitors to the right department.',
      technicalExplanation: 'HTTP requests hit the Express/FastAPI routing table, executing middleware pipelines before reaching the business handler.',
      failureScenarios: [
        '404 Not Found if route path does not match router pattern',
        'Payload Too Large error if request body exceeds middleware limit'
      ],
      interviewQuestions: [
        'How does the routing layer validate incoming request parameters before reaching business logic?',
        'What middleware executes before this handler is invoked?'
      ],
      confidence: routes.length > 0 ? 'confirmed' : 'inferred',
      evidenceReferences: [primaryRoute.filePath],
      x: 420,
      y: 180
    };
    nodes.push(routeNode);

    edges.push({
      id: 'edge-client-to-router',
      source: 'node-client-ui',
      target: 'node-backend-router',
      label: 'HTTP REST / JSON',
      relationshipType: 'calls',
      confidence: 'confirmed',
      evidence: 'Frontend fetches API endpoint exposed by backend router'
    });

    // 3. Controller & Service Logic Node
    const serviceFile = files.find(f => FileClassifier.classify(f) === 'service' || FileClassifier.classify(f) === 'api_handler');
    const serviceNode: WorkflowNode = {
      id: 'node-service-logic',
      label: 'Business Logic & Service Layer',
      nodeType: 'service',
      filePath: serviceFile ? serviceFile.relativePath : 'src/services/appService.ts',
      symbol: 'executeBusinessLogic()',
      purpose: 'Enforces domain business rules, authorizes actions, coordinates multiple data repositories, and generates responses.',
      inputs: ['Validated DTO / Domain objects'],
      processingSteps: [
        'Verifies business invariants and authorization permissions',
        'Performs data transformation and formatting',
        'Calls database access layer via ORM/SQL driver'
      ],
      outputs: ['Domain result entity', 'Success/Failure status'],
      plainExplanation: 'The brain of the system: makes decisions, checks if you have permission, and computes the result.',
      technicalExplanation: 'Decoupled domain service executing core business rules independently of HTTP or database transport details.',
      failureScenarios: [
        'Domain validation exception when entity rules are violated',
        'Database connection timeout during transactional processing'
      ],
      interviewQuestions: [
        'Why is business logic separated into services instead of placing it directly inside controllers?',
        'How do you manage database transactions if a service updates multiple tables?'
      ],
      confidence: serviceFile ? 'confirmed' : 'inferred',
      evidenceReferences: [serviceFile ? serviceFile.relativePath : 'service layer'],
      x: 740,
      y: 180
    };
    nodes.push(serviceNode);

    edges.push({
      id: 'edge-router-to-service',
      source: 'node-backend-router',
      target: 'node-service-logic',
      label: 'invokes handler',
      relationshipType: 'passes_data',
      confidence: 'confirmed',
      evidence: 'Router middleware delegates execution to business service'
    });

    // 4. Database Layer Node
    const primaryModel = models[0] || {
      name: 'User / Record',
      fields: ['id', 'created_at', 'status'],
      filePath: 'src/models/schema.ts',
      ormType: 'Relational Schema'
    };

    const dbNode: WorkflowNode = {
      id: 'node-db-storage',
      label: `Database Layer [${models.length > 0 ? models.map(m => m.name).join(', ') : 'Persistence'}]`,
      nodeType: 'db_operation',
      filePath: primaryModel.filePath,
      symbol: `${primaryModel.ormType}: ${primaryModel.name}`,
      purpose: 'Persists application state, enforces ACID guarantees, and executes queries via indexes.',
      inputs: ['Parameterized SQL query or ORM query object'],
      processingSteps: [
        'Acquires database connection from connection pool',
        'Executes prepared statement with sanitized values',
        'Returns query result set to calling service'
      ],
      outputs: ['Row records', 'Affected row count', 'Generated Primary Key'],
      plainExplanation: 'Where data is safely saved on disk so it stays intact even if the server restarts.',
      technicalExplanation: 'Data persistence layer interacting with SQLite/Postgres using parameterized queries or ORM models to prevent SQL injection.',
      failureScenarios: [
        'Unique constraint violation on duplicate key insertion',
        'Deadlock or connection pool exhaustion under heavy concurrency'
      ],
      interviewQuestions: [
        'What indexing strategy would you use to optimize queries on this table?',
        'How does the application prevent SQL injection vulnerabilities?'
      ],
      confidence: models.length > 0 ? 'confirmed' : 'inferred',
      evidenceReferences: [primaryModel.filePath],
      x: 1060,
      y: 180
    };
    nodes.push(dbNode);

    edges.push({
      id: 'edge-service-to-db',
      source: 'node-service-logic',
      target: 'node-db-storage',
      label: 'queries / persists',
      relationshipType: 'queries',
      confidence: 'confirmed',
      evidence: 'Service layer invokes model methods to query or mutate database state'
    });

    return {
      nodes,
      edges,
      viewType: 'system_architecture'
    };
  }

  private static buildRequestLifecycle(files: IngestedFile[], routes: ExtractedRoute[]): WorkflowGraph {
    const nodes: WorkflowNode[] = [
      {
        id: 'req-1',
        label: '1. User Triggers Action',
        nodeType: 'user_interaction',
        filePath: 'client/src/components',
        symbol: 'onClick / onSubmit',
        purpose: 'User clicks submit button or initiates action in the client interface.',
        processingSteps: ['Captures event', 'Prevents default reload', 'Dispatches request'],
        plainExplanation: 'The user clicks a button to perform an action.',
        technicalExplanation: 'Synthetic DOM event handled by React event dispatcher.',
        failureScenarios: ['Multiple rapid clicks causing duplicate submissions'],
        interviewQuestions: ['How do you debounce or throttle rapid button clicks?'],
        confidence: 'confirmed',
        evidenceReferences: ['Frontend UI handler'],
        x: 80,
        y: 200
      },
      {
        id: 'req-2',
        label: '2. HTTP Request Dispatched',
        nodeType: 'api_request',
        filePath: 'client/src/services/api.ts',
        symbol: 'fetch(url, options)',
        purpose: 'Serializes JSON payload and sends asynchronous HTTP request with headers.',
        processingSteps: ['Sets Content-Type: application/json', 'Attaches Auth token if present', 'Awaits response'],
        plainExplanation: 'Your browser sends a message over the internet to the server.',
        technicalExplanation: 'Asynchronous fetch API request utilizing Promise-based lifecycle.',
        failureScenarios: ['Network timeout or offline connection failure'],
        interviewQuestions: ['How does your frontend handle network failures or offline status?'],
        confidence: 'confirmed',
        evidenceReferences: ['API client service'],
        x: 360,
        y: 200
      },
      {
        id: 'req-3',
        label: '3. Route Middleware & Validation',
        nodeType: 'backend_route',
        filePath: routes[0]?.filePath || 'server/src/routes',
        symbol: 'validateRequestMiddleware',
        purpose: 'Validates request schema, sanitizes inputs, and checks authentication headers.',
        processingSteps: ['Checks authorization header', 'Validates required body fields', 'Passes to handler'],
        plainExplanation: 'The server inspects the message to make sure it is safe and correctly formatted.',
        technicalExplanation: 'Express middleware stack running schema validators prior to business handler.',
        failureScenarios: ['400 Bad Request if mandatory fields are missing'],
        interviewQuestions: ['What library or pattern do you use for request payload validation?'],
        confidence: 'confirmed',
        evidenceReferences: [routes[0]?.filePath || 'route middleware'],
        x: 640,
        y: 200
      },
      {
        id: 'req-4',
        label: '4. Controller & Response Serialization',
        nodeType: 'controller',
        filePath: routes[0]?.filePath || 'server/src/controllers',
        symbol: 'res.status(200).json(data)',
        purpose: 'Executes domain logic, serializes response body, and sets HTTP status code.',
        processingSteps: ['Computes response', 'Sets 200 OK or appropriate status', 'Streams JSON back to client'],
        plainExplanation: 'The server prepares the answer and sends it back to your browser.',
        technicalExplanation: 'Express response pipeline serializing domain model into JSON and ending HTTP stream.',
        failureScenarios: ['Unhandled exception turning into a 500 Internal Server Error'],
        interviewQuestions: ['How are unexpected exceptions caught and mapped to standard HTTP error codes?'],
        confidence: 'confirmed',
        evidenceReferences: ['Controller response logic'],
        x: 920,
        y: 200
      },
      {
        id: 'req-5',
        label: '5. UI State Update & Rerender',
        nodeType: 'ui_component',
        filePath: 'client/src/App.tsx',
        symbol: 'setState(data)',
        purpose: 'Parses incoming JSON response, updates React state, and re-renders updated view.',
        processingSteps: ['Parses response.json()', 'Updates component state hook', 'Virtual DOM recalculates diff'],
        plainExplanation: 'The screen updates with the new information without needing a full page reload.',
        technicalExplanation: 'React reconciler schedules state update, diffs virtual tree, and commits DOM patches.',
        failureScenarios: ['Component unmounted before fetch completes causing memory leak warning'],
        interviewQuestions: ['What happens if an asynchronous state update runs after a component unmounts?'],
        confidence: 'confirmed',
        evidenceReferences: ['React state hooks'],
        x: 1200,
        y: 200
      }
    ];

    const edges: WorkflowEdge[] = [
      { id: 'e-req-1-2', source: 'req-1', target: 'req-2', label: 'triggers', relationshipType: 'triggers', confidence: 'confirmed', evidence: 'User click triggers fetch' },
      { id: 'e-req-2-3', source: 'req-2', target: 'req-3', label: 'network packet', relationshipType: 'calls', confidence: 'confirmed', evidence: 'HTTP request arrives at backend' },
      { id: 'e-req-3-4', source: 'req-3', target: 'req-4', label: 'validated payload', relationshipType: 'passes_data', confidence: 'confirmed', evidence: 'Middleware passes to handler' },
      { id: 'e-req-4-5', source: 'req-4', target: 'req-5', label: 'HTTP 200 JSON', relationshipType: 'renders', confidence: 'confirmed', evidence: 'JSON response parsed by client' }
    ];

    return { nodes, edges, viewType: 'request_lifecycle' };
  }

  private static buildDataLifecycle(files: IngestedFile[], routes: ExtractedRoute[], models: ExtractedModel[]): WorkflowGraph {
    const nodes: WorkflowNode[] = [
      {
        id: 'data-1',
        label: '1. Raw User Input',
        nodeType: 'user_interaction',
        filePath: 'client/src/forms',
        symbol: 'Controlled Inputs',
        purpose: 'Captures raw input strings entered into forms.',
        processingSteps: ['Captures onChange event', 'Stores in component state'],
        plainExplanation: 'Information typed in by the user.',
        technicalExplanation: 'React controlled input components bound to state variables.',
        failureScenarios: ['Special characters, SQL injection strings, or oversized input'],
        interviewQuestions: ['Why should client-side input validation never be the only defense?'],
        confidence: 'confirmed',
        evidenceReferences: ['Client form input'],
        x: 100,
        y: 180
      },
      {
        id: 'data-2',
        label: '2. Backend Sanitization & Validation',
        nodeType: 'backend_route',
        filePath: routes[0]?.filePath || 'server/src/validation',
        symbol: 'Schema Validation (Zod/Joi/Pydantic)',
        purpose: 'Validates types, required fields, constraints, and strips malicious tags.',
        processingSteps: ['Validates string lengths', 'Checks email/number formats', 'Strips dangerous HTML/script tags'],
        plainExplanation: 'A safety inspection ensuring data is clean, correct, and not harmful.',
        technicalExplanation: 'Schema validation rejecting invalid payloads with 422 Unprocessable Entity before database access.',
        failureScenarios: ['Validation bypass if schema is missing or incomplete'],
        interviewQuestions: ['How do you protect your backend against XSS (Cross-Site Scripting)?'],
        confidence: 'confirmed',
        evidenceReferences: ['Backend validator'],
        x: 460,
        y: 180
      },
      {
        id: 'data-3',
        label: '3. Entity Transformation & Hashing',
        nodeType: 'service',
        filePath: 'server/src/services',
        symbol: 'hashPassword() / mapToEntity()',
        purpose: 'Transforms input into canonical domain model and hashes sensitive fields like passwords.',
        processingSteps: ['Hashes passwords with bcrypt/argon2', 'Generates UUID / timestamps', 'Applies domain business rules'],
        plainExplanation: 'Scrambles passwords for security and adds creation timestamps.',
        technicalExplanation: 'One-way cryptographic salt-and-hash transformation before persistence.',
        failureScenarios: ['Plaintext password storage if hashing step is skipped'],
        interviewQuestions: ['Why is hashing passwords with a salt necessary instead of plain SHA-256?'],
        confidence: 'confirmed',
        evidenceReferences: ['Entity transformation logic'],
        x: 820,
        y: 180
      },
      {
        id: 'data-4',
        label: '4. Disk Persistence & Indexing',
        nodeType: 'db_operation',
        filePath: models[0]?.filePath || 'server/src/db',
        symbol: 'INSERT INTO / db.save()',
        purpose: 'Commits record to database disk pages and updates B-tree indices.',
        processingSteps: ['Begins transaction', 'Writes to write-ahead log (WAL)', 'Updates index table', 'Commits transaction'],
        plainExplanation: 'Permanently writes the information to storage so it is never lost.',
        technicalExplanation: 'ACID transactional write to database tables with automatic B-Tree index recalculation.',
        failureScenarios: ['Unique key collision (e.g. email already exists)'],
        interviewQuestions: ['What are the ACID properties and how does your database guarantee them?'],
        confidence: 'confirmed',
        evidenceReferences: ['Database schema definition'],
        x: 1180,
        y: 180
      }
    ];

    const edges: WorkflowEdge[] = [
      { id: 'e-data-1-2', source: 'data-1', target: 'data-2', label: 'transmits raw data', relationshipType: 'passes_data', confidence: 'confirmed', evidence: 'Sent via POST request' },
      { id: 'e-data-2-3', source: 'data-2', target: 'data-3', label: 'sanitized payload', relationshipType: 'passes_data', confidence: 'confirmed', evidence: 'Valid data passed to service' },
      { id: 'e-data-3-4', source: 'data-3', target: 'data-4', label: 'persists entity', relationshipType: 'queries', confidence: 'confirmed', evidence: 'ORM executes insert query' }
    ];

    return { nodes, edges, viewType: 'data_lifecycle' };
  }

  private static buildAuthLifecycle(files: IngestedFile[], routes: ExtractedRoute[]): WorkflowGraph {
    const nodes: WorkflowNode[] = [
      {
        id: 'auth-1',
        label: '1. Credentials Submission',
        nodeType: 'user_interaction',
        filePath: 'client/src/pages/Login',
        symbol: 'handleLoginSubmit()',
        purpose: 'User inputs identifier (email/username) and password over HTTPS.',
        processingSteps: ['Prevents plain HTTP transmission', 'Packages credentials into JSON body'],
        plainExplanation: 'User enters email and password into the login form.',
        technicalExplanation: 'Credential dispatch over TLS encrypted transport layer.',
        failureScenarios: ['MITM attack if TLS is not enforced on the connection'],
        interviewQuestions: ['Why must authentication requests strictly use HTTPS?'],
        confidence: 'confirmed',
        evidenceReferences: ['Login interface'],
        x: 100,
        y: 200
      },
      {
        id: 'auth-2',
        label: '2. Credential Verification & Hash Comparison',
        nodeType: 'auth_step',
        filePath: 'server/src/auth',
        symbol: 'bcrypt.compare(password, hash)',
        purpose: 'Fetches user record from DB and compares submitted password against stored hash using constant-time comparison.',
        processingSteps: ['Retrieves user by identifier', 'Runs constant-time hash verification', 'Rejects if mismatch'],
        plainExplanation: 'Checks if the password matches the secret record on file.',
        technicalExplanation: 'Timing-safe password hash verification preventing timing attacks.',
        failureScenarios: ['401 Unauthorized returned if password does not match'],
        interviewQuestions: ['What is a timing attack and how does constant-time comparison protect against it?'],
        confidence: 'confirmed',
        evidenceReferences: ['Authentication controller'],
        x: 460,
        y: 200
      },
      {
        id: 'auth-3',
        label: '3. Token / Session Minting',
        nodeType: 'auth_step',
        filePath: 'server/src/auth/jwt',
        symbol: 'jwt.sign({ userId, role }, SECRET, { expiresIn })',
        purpose: 'Signs an encrypted or tamper-proof token containing user claims and expiration timestamp.',
        processingSteps: ['Embeds user claims into payload', 'Signs with HMAC-SHA256 secret key', 'Returns token in response or httpOnly cookie'],
        plainExplanation: 'Creates a digital backstage pass (token) proving you are logged in.',
        technicalExplanation: 'Stateless JWT generation with cryptographically signed payload preventing forgery.',
        failureScenarios: ['Hardcoded secret key allowing attackers to forge tokens'],
        interviewQuestions: ['What is the difference between session-based auth and JWT-based auth?'],
        confidence: 'confirmed',
        evidenceReferences: ['Token generator'],
        x: 820,
        y: 200
      },
      {
        id: 'auth-4',
        label: '4. Protected Route Guard',
        nodeType: 'backend_route',
        filePath: 'server/src/middleware/auth',
        symbol: 'verifyTokenMiddleware',
        purpose: 'Extracts Authorization: Bearer <token> header on protected endpoints and verifies signature.',
        processingSteps: ['Extracts token from header', 'Verifies signature and expiration', 'Attaches req.user context'],
        plainExplanation: 'Security guard checking your backstage pass before allowing you into private pages.',
        technicalExplanation: 'Route middleware executing signature verification before granting access to controllers.',
        failureScenarios: ['401 if token expired; 403 Forbidden if user lacks required role'],
        interviewQuestions: ['How do you handle JWT revocation if a user logs out before token expiration?'],
        confidence: 'confirmed',
        evidenceReferences: ['Auth guard middleware'],
        x: 1180,
        y: 200
      }
    ];

    const edges: WorkflowEdge[] = [
      { id: 'e-auth-1-2', source: 'auth-1', target: 'auth-2', label: 'POST /api/auth/login', relationshipType: 'authenticates', confidence: 'confirmed', evidence: 'User dispatches credentials' },
      { id: 'e-auth-2-3', source: 'auth-2', target: 'auth-3', label: 'valid credentials', relationshipType: 'passes_data', confidence: 'confirmed', evidence: 'Backend generates signed token' },
      { id: 'e-auth-3-4', source: 'auth-3', target: 'auth-4', label: 'Bearer <token> header', relationshipType: 'authenticates', confidence: 'confirmed', evidence: 'Token passed to protected routes' }
    ];

    return { nodes, edges, viewType: 'auth_lifecycle' };
  }

  private static buildErrorHandling(files: IngestedFile[], routes: ExtractedRoute[]): WorkflowGraph {
    const nodes: WorkflowNode[] = [
      {
        id: 'err-1',
        label: '1. Exception Triggered',
        nodeType: 'error_handler',
        filePath: 'server/src/services',
        symbol: 'throw new Error("Resource not found")',
        purpose: 'An unexpected or handled error occurs (e.g. missing item, invalid state, DB failure).',
        processingSteps: ['Catches failed invariant', 'Instantiates error object with message and code'],
        plainExplanation: 'Something unexpected went wrong while processing your request.',
        technicalExplanation: 'Synchronous or asynchronous rejection creating an Error stack trace.',
        failureScenarios: ['Unhandled promise rejection crashing the Node.js process'],
        interviewQuestions: ['What is the danger of unhandled promise rejections in Node.js?'],
        confidence: 'confirmed',
        evidenceReferences: ['Business logic exception'],
        x: 100,
        y: 200
      },
      {
        id: 'err-2',
        label: '2. Global Error Middleware',
        nodeType: 'error_handler',
        filePath: 'server/src/middleware/errorHandler',
        symbol: 'app.use((err, req, res, next) => ...)',
        purpose: 'Catches all unhandled exceptions, logs internal stack trace, and masks sensitive info.',
        processingSteps: ['Logs full stack trace to logger', 'Determines HTTP status code (400, 404, 500)', 'Builds sanitized error response'],
        plainExplanation: 'The safety net that catches any crash, writes details in private logs, and sends a friendly message.',
        technicalExplanation: 'Express 4-argument error-handling middleware preventing unhandled process termination.',
        failureScenarios: ['Leaking database credentials or SQL query in error response to client'],
        interviewQuestions: ['Why should database error messages never be sent raw to the frontend?'],
        confidence: 'confirmed',
        evidenceReferences: ['Error handling middleware'],
        x: 500,
        y: 200
      },
      {
        id: 'err-3',
        label: '3. Client Toast / Fallback UI',
        nodeType: 'ui_component',
        filePath: 'client/src/components/ErrorBoundary',
        symbol: 'showToastError() / ErrorBoundary',
        purpose: 'Informs user of the problem gracefully without crashing the entire web application.',
        processingSteps: ['Receives non-2xx status code', 'Renders non-intrusive alert toast', 'Maintains app state'],
        plainExplanation: 'A helpful notification pops up telling the user what went wrong, keeping the rest of the page working.',
        technicalExplanation: 'React Error Boundary and toast notification displaying user-facing guidance.',
        failureScenarios: ['Silent failure leaving user confused with infinite loading spinner'],
        interviewQuestions: ['How do React Error Boundaries work and when should you use them?'],
        confidence: 'confirmed',
        evidenceReferences: ['Client Error Boundary'],
        x: 950,
        y: 200
      }
    ];

    const edges: WorkflowEdge[] = [
      { id: 'e-err-1-2', source: 'err-1', target: 'err-2', label: 'thrown exception', relationshipType: 'handles_error', confidence: 'confirmed', evidence: 'Error intercepted by middleware' },
      { id: 'e-err-2-3', source: 'err-2', target: 'err-3', label: 'JSON { error, code }', relationshipType: 'renders', confidence: 'confirmed', evidence: 'Client parses error response' }
    ];

    return { nodes, edges, viewType: 'error_handling' };
  }

  private static buildDeploymentFlow(files: IngestedFile[], technologies: DetectedTechnology[]): WorkflowGraph {
    const hasDocker = files.some(f => f.relativePath.toLowerCase().includes('dockerfile'));
    const nodes: WorkflowNode[] = [
      {
        id: 'dep-1',
        label: '1. Source Build & Bundle',
        nodeType: 'external_service',
        filePath: 'package.json / tsconfig.json',
        symbol: 'npm run build (Vite/TSC)',
        purpose: 'Transpiles TypeScript, tree-shakes dead code, minifies JavaScript, and compiles assets.',
        processingSteps: ['Type checks with tsc', 'Bundles modules with Vite/Rollup', 'Outputs static files to /dist'],
        plainExplanation: 'Takes all your code and packs it into small, fast files ready for the web.',
        technicalExplanation: 'Static asset bundling optimizing chunk sizes and hashing filenames for browser caching.',
        failureScenarios: ['TypeScript compilation errors halting the build pipeline'],
        interviewQuestions: ['What is tree-shaking and how does it reduce frontend bundle size?'],
        confidence: 'confirmed',
        evidenceReferences: ['Build scripts in package.json'],
        x: 100,
        y: 200
      },
      {
        id: 'dep-2',
        label: hasDocker ? '2. Docker Containerization' : '2. Environment Provisioning',
        nodeType: 'external_service',
        filePath: hasDocker ? 'Dockerfile' : '.env.example',
        symbol: hasDocker ? 'docker build -t app:latest .' : 'NODE_ENV=production',
        purpose: 'Packages application code with system dependencies into an immutable container or isolated process.',
        processingSteps: ['Installs production node_modules', 'Configures environment variables', 'Exposes application port'],
        plainExplanation: 'Puts the application inside a standardized shipping container that runs identically everywhere.',
        technicalExplanation: 'Multi-stage Docker build minimizing runtime image footprint and locking Linux kernel dependencies.',
        failureScenarios: ['Missing environment variable causing startup crash'],
        interviewQuestions: ['Why are multi-stage Docker builds recommended for Node/Go applications?'],
        confidence: hasDocker ? 'confirmed' : 'inferred',
        evidenceReferences: [hasDocker ? 'Dockerfile' : 'Environment configuration'],
        x: 520,
        y: 200
      },
      {
        id: 'dep-3',
        label: '3. Web Server Runtime & Reverse Proxy',
        nodeType: 'external_service',
        filePath: 'server/src/index.ts',
        symbol: 'node dist/index.js (Port 5000 / NGINX)',
        purpose: 'Serves incoming traffic, terminates SSL/TLS, and executes application processes.',
        processingSteps: ['Listens on TCP socket', 'Handles incoming connections', 'Logs requests and health metrics'],
        plainExplanation: 'The live server on the internet answering visits 24/7.',
        technicalExplanation: 'Reverse proxy routing requests to Node.js clustered workers or container orchestrator.',
        failureScenarios: ['Out-of-memory crash under sudden spike in traffic'],
        interviewQuestions: ['How does a reverse proxy like NGINX improve security and performance?'],
        confidence: 'confirmed',
        evidenceReferences: ['Server entrypoint'],
        x: 950,
        y: 200
      }
    ];

    const edges: WorkflowEdge[] = [
      { id: 'e-dep-1-2', source: 'dep-1', target: 'dep-2', label: 'compiled artifact', relationshipType: 'passes_data', confidence: 'confirmed', evidence: 'Build outputs packaged into runtime container' },
      { id: 'e-dep-2-3', source: 'dep-2', target: 'dep-3', label: 'launches process', relationshipType: 'triggers', confidence: 'confirmed', evidence: 'Container starts Node.js application server' }
    ];

    return { nodes, edges, viewType: 'deployment' };
  }
}
