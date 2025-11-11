#!/usr/bin/env tsx
/**
 * Audit duplications/divergence of step JSON files across multiple roots.
 * - Roots scanned: src/config/templates, public/templates/funnels/quiz21StepsComplete/steps, templates, src/services/data/templates, src/services/data/modularSteps
 * - Output: markdown report to reports/step-json-duplications.md
 */

import { glob } from 'glob';
import { promises as fs } from 'fs';
import path from 'path';

const ROOTS = [
  'src/config/templates',
  'public/templates/funnels/quiz21StepsComplete/steps',
  'templates',
  'src/services/data/templates',
  'src/services/data/modularSteps'
];

function stepKeyFromFilename(file: string) {
  const base = path.basename(file).toLowerCase();
  const m = base.match(/step[-_ ]?(\d{1,2})/);
  return m ? m[1].padStart(2, '0') : null;
}

async function readJsonSafe(file: string) {
  try {
    const content = await fs.readFile(file, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function main() {
  const allFiles: string[] = [];
  for (const root of ROOTS) {
    const matches = await glob(path.join(root, '**/step-*.json').replace(/\\/g, '/'));
    allFiles.push(...matches);
  }

  const map = new Map<string, string[]>();
  for (const f of allFiles) {
    const key = stepKeyFromFilename(f);
    if (!key) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(f);
  }

  const rows: string[] = [];
  rows.push('# Step JSON Duplication Report');
  rows.push('');
  rows.push(`Total steps detected: ${map.size}`);
  rows.push(`Total files scanned: ${allFiles.length}`);
  rows.push('');
  rows.push('| Step | Count | Locations | Divergence |');
  rows.push('|-----:|------:|-----------|-----------|');

  const divergenceDetails: string[] = [];

  for (const [step, files] of Array.from(map.entries()).sort()) {
    const samples = await Promise.all(files.map(readJsonSafe));
    const hashes = samples.map(s => (s ? JSON.stringify(s) : 'INVALID'));
    const unique = new Set(hashes);
    const diverges = unique.size > 1;

    rows.push(`| ${step} | ${files.length} | ${files.map(f => '`' + f + '`').join('<br/>')} | ${diverges ? 'YES' : 'NO'} |`);

    if (diverges) {
      divergenceDetails.push(`\n## Step ${step}\n`);
      divergenceDetails.push(`Files:`);
      for (let i = 0; i < files.length; i++) {
        divergenceDetails.push(`- ${files[i]} (${hashes[i] === 'INVALID' ? 'INVALID JSON' : 'OK'})`);
      }
    }
  }

  const outDir = path.resolve('reports');
  await fs.mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, 'step-json-duplications.md');
  await fs.writeFile(outFile, rows.concat(divergenceDetails).join('\n'), 'utf-8');
  console.log(`Report written to ${outFile}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
