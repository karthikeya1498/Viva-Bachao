import path from 'path';
import { DetectedTechnology } from '../types/index.js';

export interface IngestedFile {
  relativePath: string;
  content: string;
  size: number;
}

const EXTENSION_MAP: Record<string, string> = {
  '.ts': 'TypeScript',
  '.tsx': 'TypeScript (React)',
  '.js': 'JavaScript',
  '.jsx': 'JavaScript (React)',
  '.py': 'Python',
  '.java': 'Java',
  '.go': 'Go',
  '.rs': 'Rust',
  '.cpp': 'C++',
  '.c': 'C',
  '.cs': 'C#',
  '.html': 'HTML',
  '.css': 'CSS',
  '.scss': 'SCSS',
  '.sql': 'SQL',
  '.json': 'JSON',
  '.md': 'Markdown',
  '.yaml': 'YAML',
  '.yml': 'YAML'
};

export class LanguageDetector {
  public static detect(files: IngestedFile[]): {
    languages: Record<string, number>;
    technologies: DetectedTechnology[];
    primaryLanguage: string;
    primaryFramework: string;
  } {
    const langCounts: Record<string, number> = {};
    let totalLines = 0;

    for (const file of files) {
      const ext = path.extname(file.relativePath).toLowerCase();
      const lang = EXTENSION_MAP[ext];
      if (lang) {
        const lines = file.content.split('\n').length;
        langCounts[lang] = (langCounts[lang] || 0) + lines;
        totalLines += lines;
      }
    }

    const languagePercentages: Record<string, number> = {};
    let maxLines = 0;
    let primaryLanguage = 'JavaScript';

    for (const [lang, lines] of Object.entries(langCounts)) {
      const pct = totalLines > 0 ? Math.round((lines / totalLines) * 100) : 0;
      languagePercentages[lang] = pct;
      if (lines > maxLines) {
        maxLines = lines;
        primaryLanguage = lang.split(' ')[0];
      }
    }

    const technologies: DetectedTechnology[] = [];
    let primaryFramework = 'Vanilla / Node.js';

    // Check package.json
    const pkgFile = files.find(f => path.basename(f.relativePath) === 'package.json');
    if (pkgFile) {
      try {
        const pkg = JSON.parse(pkgFile.content);
        const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

        if (deps['react']) {
          technologies.push({
            name: 'React',
            category: 'frontend_framework',
            version: deps['react'],
            role: 'Component-based UI state management and virtual DOM rendering',
            detectedInFiles: ['package.json'],
            evidence: `Dependency declared in package.json: "react": "${deps['react']}"`
          });
          primaryFramework = 'React';
        }

        if (deps['next']) {
          technologies.push({
            name: 'Next.js',
            category: 'frontend_framework',
            version: deps['next'],
            role: 'Full-stack React framework with SSR, SSG, and file-based routing',
            detectedInFiles: ['package.json'],
            evidence: `Dependency declared in package.json: "next": "${deps['next']}"`
          });
          primaryFramework = 'Next.js';
        }

        if (deps['express']) {
          technologies.push({
            name: 'Express.js',
            category: 'backend_framework',
            version: deps['express'],
            role: 'RESTful API routing and middleware pipeline handling',
            detectedInFiles: ['package.json'],
            evidence: `Dependency declared in package.json: "express": "${deps['express']}"`
          });
          if (primaryFramework === 'Vanilla / Node.js') primaryFramework = 'Express.js';
        }

        if (deps['@prisma/client'] || deps['prisma']) {
          technologies.push({
            name: 'Prisma ORM',
            category: 'database',
            role: 'Type-safe database abstraction, migrations, and query generation',
            detectedInFiles: ['package.json'],
            evidence: 'Prisma client declared in dependencies'
          });
        }

        if (deps['mongoose']) {
          technologies.push({
            name: 'Mongoose',
            category: 'database',
            role: 'Schema-based Object Data Modeling (ODM) for MongoDB',
            detectedInFiles: ['package.json'],
            evidence: 'Mongoose declared in dependencies'
          });
        }

        if (deps['sqlite3'] || deps['better-sqlite3']) {
          technologies.push({
            name: 'SQLite',
            category: 'database',
            role: 'Embedded serverless SQL database engine',
            detectedInFiles: ['package.json'],
            evidence: 'SQLite driver found in dependencies'
          });
        }

        if (deps['pg'] || deps['postgres']) {
          technologies.push({
            name: 'PostgreSQL',
            category: 'database',
            role: 'Relational database driver for structured relational data storage',
            detectedInFiles: ['package.json'],
            evidence: 'PostgreSQL driver found in dependencies'
          });
        }

        if (deps['jsonwebtoken'] || deps['jwt-decode']) {
          technologies.push({
            name: 'JSON Web Tokens (JWT)',
            category: 'library',
            role: 'Stateless authentication and cryptographic token verification',
            detectedInFiles: ['package.json'],
            evidence: 'JWT package found in dependencies'
          });
        }

        if (deps['tailwindcss']) {
          technologies.push({
            name: 'Tailwind CSS',
            category: 'tool',
            role: 'Utility-first CSS styling system',
            detectedInFiles: ['package.json'],
            evidence: 'Tailwind CSS declared in devDependencies'
          });
        }

        if (deps['vite']) {
          technologies.push({
            name: 'Vite',
            category: 'tool',
            role: 'Modern frontend development server and Rollup-based build tool',
            detectedInFiles: ['package.json'],
            evidence: 'Vite bundler declared in devDependencies'
          });
        }
      } catch (err) {
        // invalid json, ignore
      }
    }

    // Check Python files
    const reqFile = files.find(f => path.basename(f.relativePath) === 'requirements.txt');
    if (reqFile) {
      if (reqFile.content.includes('django')) {
        technologies.push({
          name: 'Django',
          category: 'backend_framework',
          role: 'High-level Python web framework with built-in ORM and admin panel',
          detectedInFiles: ['requirements.txt'],
          evidence: 'Found django requirement'
        });
        primaryFramework = 'Django';
      }
      if (reqFile.content.includes('flask')) {
        technologies.push({
          name: 'Flask',
          category: 'backend_framework',
          role: 'Lightweight WSGI Python microframework',
          detectedInFiles: ['requirements.txt'],
          evidence: 'Found flask requirement'
        });
        primaryFramework = 'Flask';
      }
      if (reqFile.content.includes('fastapi')) {
        technologies.push({
          name: 'FastAPI',
          category: 'backend_framework',
          role: 'High-performance ASGI framework with Pydantic type validation',
          detectedInFiles: ['requirements.txt'],
          evidence: 'Found fastapi requirement'
        });
        primaryFramework = 'FastAPI';
      }
    }

    return {
      languages: languagePercentages,
      technologies,
      primaryLanguage,
      primaryFramework
    };
  }
}
