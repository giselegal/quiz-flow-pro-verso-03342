#!/usr/bin/env tsx
/**
 * Audit imports of TemplateService to find non-canonical paths.
 * Canonical path: '@/services/canonical/TemplateService'
 * Report: reports/template-service-imports.md
 */

import { glob } from 'glob';
import { promises as fs } from 'fs';
import path from 'path';

const CANONICAL = "@/services/canonical/TemplateService";

async function main() {
  const files = await glob('src/**/*.{ts,tsx,js,jsx}', { ignore: ['**/node_modules/**', '**/dist/**'] });
  const offenders: Array<{file: string, line: number, statement: string}> = [];

  for (const file of files) {
    let content: string | null = null;
    try {
      content = await fs.readFile(file, 'utf-8');
    } catch {
      // arquivo pode ter sido removido durante o scan; ignorar
      continue;
    }
    const lines = content.split(/\r?\n/);
    lines.forEach((line, idx) => {
      if (/TemplateService|templateService/.test(line)) {
        if (!line.includes(CANONICAL)) {
          offenders.push({ file, line: idx + 1, statement: line.trim() });
        }
      }
    });
  }

  const outDir = path.resolve('reports');
  await fs.mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, 'template-service-imports.md');

  const header = [
    '# TemplateService Import Audit',
    '',
    `Canonical path: ${CANONICAL}`,
    `Total offenders: ${offenders.length}`,
    '',
    '| File | Line | Statement |',
    '|------|------:|-----------|',
  ];
  const rows = offenders.map(o => `| ${o.file} | ${o.line} | ${o.statement.replace(/\|/g, '\\|')} |`);

  await fs.writeFile(outFile, header.concat(rows).join('\n'), 'utf-8');
  console.log(`Report written to ${outFile}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
