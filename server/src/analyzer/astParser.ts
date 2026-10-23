import path from 'path';
import { IngestedFile } from './languageDetector.js';

export interface ExtractedRoute {
  method: string;
  path: string;
  handlerSymbol: string;
  filePath: string;
  line: number;
}

export interface ExtractedModel {
  name: string;
  fields: string[];
  filePath: string;
  ormType: string;
}

export interface ExtractedImport {
  sourceFile: string;
  importedFile: string;
  symbols: string[];
}

export class AstParser {
  public static extractImports(files: IngestedFile[]): ExtractedImport[] {
    const imports: ExtractedImport[] = [];
    const filePaths = new Set(files.map(f => f.relativePath.replace(/\\/g, '/')));

    for (const file of files) {
      const content = file.content;
      const normalizedSource = file.relativePath.replace(/\\/g, '/');

      // JS / TS import: import { a, b } from './c' or import d from './c'
      const jsImportRegex = /import\s+(?:\{([^}]+)\}|([a-zA-Z0-9_$]+))\s+from\s+['"]([^'"]+)['"]/g;
      let match;
      while ((match = jsImportRegex.exec(content)) !== null) {
        const symbols = match[1]
          ? match[1].split(',').map(s => s.trim())
          : match[2]
          ? [match[2].trim()]
          : [];
        const importTarget = match[3];

        if (importTarget.startsWith('.')) {
          const resolved = path
            .normalize(path.join(path.dirname(normalizedSource), importTarget))
            .replace(/\\/g, '/');

          // Check extensions
          const candidates = [
            resolved,
            `${resolved}.ts`,
            `${resolved}.tsx`,
            `${resolved}.js`,
            `${resolved}.jsx`,
            `${resolved}/index.ts`,
            `${resolved}/index.js`
          ];

          const found = candidates.find(c => filePaths.has(c));
          if (found) {
            imports.push({
              sourceFile: normalizedSource,
              importedFile: found,
              symbols
            });
          }
        }
      }

      // Python import: from x import y or import z
      const pyImportRegex = /(?:from\s+([a-zA-Z0-9_.]+)\s+import\s+([a-zA-Z0-9_,\s]+)|import\s+([a-zA-Z0-9_.]+))/g;
      let pyMatch;
      while ((pyMatch = pyImportRegex.exec(content)) !== null) {
        const mod = pyMatch[1] || pyMatch[3];
        const symbols = pyMatch[2] ? pyMatch[2].split(',').map(s => s.trim()) : [mod];
        if (mod && mod.startsWith('.')) {
          imports.push({
            sourceFile: normalizedSource,
            importedFile: mod,
            symbols
          });
        }
      }
    }

    return imports;
  }

  public static extractRoutes(files: IngestedFile[]): ExtractedRoute[] {
    const routes: ExtractedRoute[] = [];

    for (const file of files) {
      const lines = file.content.split('\n');
      const normalizedPath = file.relativePath.replace(/\\/g, '/');

      // Express style: router.get('/path', handler) or app.post('/path', ...)
      const expressRouteRegex = /(?:app|router)\.(get|post|put|delete|patch)\s*\(\s*['"]([^'"]+)['"]\s*,\s*(?:[a-zA-Z0-9_$,\s()]+\s*=>|function|[a-zA-Z0-9_$]+)/;

      // Flask style: @app.route('/path', methods=['GET'])
      const flaskRouteRegex = /@(?:app|api|blueprint)\.route\s*\(\s*['"]([^'"]+)['"](?:.*methods=\[([^\]]+)\])?/;

      // FastAPI style: @app.get('/path')
      const fastApiRouteRegex = /@(?:app|router)\.(get|post|put|delete|patch)\s*\(\s*['"]([^'"]+)['"]/;

      lines.forEach((line, index) => {
        const expMatch = line.match(expressRouteRegex);
        if (expMatch) {
          routes.push({
            method: expMatch[1].toUpperCase(),
            path: expMatch[2],
            handlerSymbol: `line ${index + 1} handler`,
            filePath: normalizedPath,
            line: index + 1
          });
          return;
        }

        const flaskMatch = line.match(flaskRouteRegex);
        if (flaskMatch) {
          const method = flaskMatch[2] ? flaskMatch[2].replace(/['"\s]/g, '') : 'GET';
          routes.push({
            method: method.toUpperCase(),
            path: flaskMatch[1],
            handlerSymbol: lines[index + 1]?.trim() || `route_${index + 1}`,
            filePath: normalizedPath,
            line: index + 1
          });
          return;
        }

        const fastMatch = line.match(fastApiRouteRegex);
        if (fastMatch) {
          routes.push({
            method: fastMatch[1].toUpperCase(),
            path: fastMatch[2],
            handlerSymbol: lines[index + 1]?.trim() || `route_${index + 1}`,
            filePath: normalizedPath,
            line: index + 1
          });
        }
      });
    }

    return routes;
  }

  public static extractModels(files: IngestedFile[]): ExtractedModel[] {
    const models: ExtractedModel[] = [];

    for (const file of files) {
      const content = file.content;
      const normalizedPath = file.relativePath.replace(/\\/g, '/');

      // Prisma models: model User { id String @id ... }
      if (file.relativePath.endsWith('.prisma')) {
        const prismaModelRegex = /model\s+([a-zA-Z0-9_]+)\s*\{([^}]+)\}/g;
        let match;
        while ((match = prismaModelRegex.exec(content)) !== null) {
          const modelName = match[1];
          const body = match[2];
          const fields = body
            .split('\n')
            .map(l => l.trim())
            .filter(l => l && !l.startsWith('//') && !l.startsWith('@@'))
            .map(l => l.split(/\s+/)[0]);

          models.push({
            name: modelName,
            fields,
            filePath: normalizedPath,
            ormType: 'Prisma'
          });
        }
      }

      // Mongoose: const UserSchema = new Schema({ ... })
      const mongooseRegex = /(?:const|let|var)\s+([a-zA-Z0-9_]+)Schema\s*=\s*new\s+(?:mongoose\.)?Schema\s*\(\s*\{([^}]+)\}/g;
      let mgMatch;
      while ((mgMatch = mongooseRegex.exec(content)) !== null) {
        const modelName = mgMatch[1];
        const body = mgMatch[2];
        const fields = body
          .split('\n')
          .map(l => l.trim().split(':')[0].replace(/['"]/g, '').trim())
          .filter(Boolean);

        models.push({
          name: modelName,
          fields,
          filePath: normalizedPath,
          ormType: 'Mongoose'
        });
      }

      // Django models: class User(models.Model):
      const djangoRegex = /class\s+([a-zA-Z0-9_]+)\s*\(\s*(?:models\.Model|db\.Model)\s*\):/g;
      let djMatch;
      while ((djMatch = djangoRegex.exec(content)) !== null) {
        models.push({
          name: djMatch[1],
          fields: ['id', 'created_at', 'attributes'],
          filePath: normalizedPath,
          ormType: 'Django/SQLAlchemy'
        });
      }
    }

    return models;
  }
}
