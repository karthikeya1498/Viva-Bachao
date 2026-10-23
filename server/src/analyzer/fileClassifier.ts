import path from 'path';
import { IngestedFile } from './languageDetector.js';
import { FileTreeNode } from '../types/index.js';

export type FileCategory =
  | 'entry_point'
  | 'ui_component'
  | 'page'
  | 'routing'
  | 'api_handler'
  | 'service'
  | 'db_model'
  | 'utility'
  | 'config'
  | 'test'
  | 'doc'
  | 'deployment'
  | 'unknown';

export class FileClassifier {
  public static classify(file: IngestedFile): FileCategory {
    const p = file.relativePath.toLowerCase();
    const basename = path.basename(p);

    if (basename.startsWith('docker') || p.includes('.github/workflows') || basename === 'procfile') {
      return 'deployment';
    }

    if (
      basename.includes('.test.') ||
      basename.includes('.spec.') ||
      p.includes('__tests__') ||
      p.includes('/test/') ||
      p.includes('/tests/')
    ) {
      return 'test';
    }

    if (
      basename.endsWith('.md') ||
      basename.endsWith('.txt') ||
      basename === 'license' ||
      p.includes('/docs/')
    ) {
      return 'doc';
    }

    if (
      basename.endsWith('.config.js') ||
      basename.endsWith('.config.ts') ||
      basename.endsWith('.json') ||
      basename.startsWith('.env') ||
      basename === 'tsconfig.json'
    ) {
      return 'config';
    }

    if (
      basename === 'index.ts' ||
      basename === 'index.js' ||
      basename === 'main.ts' ||
      basename === 'main.js' ||
      basename === 'main.py' ||
      basename === 'app.py' ||
      basename === 'server.ts' ||
      basename === 'server.js' ||
      basename === 'app.ts' ||
      basename === 'app.js'
    ) {
      return 'entry_point';
    }

    if (
      p.includes('/routes/') ||
      p.includes('/routers/') ||
      basename.includes('.routes.') ||
      basename.includes('router.')
    ) {
      return 'routing';
    }

    if (
      p.includes('/controllers/') ||
      p.includes('/handlers/') ||
      p.includes('/api/') ||
      basename.includes('controller.') ||
      basename.includes('handler.')
    ) {
      return 'api_handler';
    }

    if (
      p.includes('/services/') ||
      p.includes('/usecases/') ||
      basename.includes('service.')
    ) {
      return 'service';
    }

    if (
      p.includes('/models/') ||
      p.includes('/schemas/') ||
      p.includes('/entities/') ||
      basename.endsWith('.prisma') ||
      p.includes('/migrations/')
    ) {
      return 'db_model';
    }

    if (
      p.includes('/pages/') ||
      p.includes('/views/') ||
      p.includes('/screens/') ||
      basename === 'app.tsx' ||
      basename === 'app.jsx'
    ) {
      return 'page';
    }

    if (
      p.includes('/components/') ||
      p.includes('/widgets/') ||
      basename.endsWith('.tsx') ||
      basename.endsWith('.jsx')
    ) {
      return 'ui_component';
    }

    if (
      p.includes('/utils/') ||
      p.includes('/helpers/') ||
      p.includes('/lib/') ||
      p.includes('/common/')
    ) {
      return 'utility';
    }

    return 'unknown';
  }

  public static buildFileTree(files: IngestedFile[]): FileTreeNode[] {
    const rootNodes: Record<string, any> = {};

    for (const f of files) {
      const parts = f.relativePath.split(/[\\/]/);
      let currentLevel = rootNodes;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1;

        if (!currentLevel[part]) {
          currentLevel[part] = {
            name: part,
            path: parts.slice(0, i + 1).join('/'),
            type: isFile ? 'file' : 'directory',
            size: isFile ? f.size : undefined,
            classification: isFile ? FileClassifier.classify(f) : undefined,
            children: isFile ? undefined : {}
          };
        }

        if (!isFile) {
          currentLevel = currentLevel[part].children;
        }
      }
    }

    const convertToArray = (obj: Record<string, any>): FileTreeNode[] => {
      return Object.values(obj).map(node => {
        if (node.type === 'directory') {
          return {
            ...node,
            children: convertToArray(node.children)
          };
        }
        return node;
      });
    };

    return convertToArray(rootNodes);
  }
}
