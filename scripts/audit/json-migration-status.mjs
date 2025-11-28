#!/usr/bin/env node
/**
 * JSON Template Migration Status Report
 * Tracks progress of V3 → V4 template migration
 * 
 * Run: node scripts/audit/json-migration-status.mjs
 * Output: reports/json-migration-status-<date>.md
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');

const TEMPLATE_DIRS = [
  'public/templates',
  'public/templates/steps-refs',
  'data/templates',
  'src/config/templates',
];

const V4_INDICATORS = {
  hasSchema: (data) => typeof data.$schema === 'string' && data.$schema.includes('v4'),
  hasVersion4: (data) => String(data.version || '').startsWith('4'),
  hasMetadata: (data) => typeof data.metadata === 'object' && data.metadata !== null,
  hasStages: (data) => Array.isArray(data.stages),
};

const V3_INDICATORS = {
  hasVersion3: (data) => String(data.version || '').startsWith('3'),
  hasSteps: (data) => Array.isArray(data.steps) && !Array.isArray(data.stages),
  noSchema: (data) => !data.$schema,
};

async function readJson(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return { __parseError: e.message };
  }
}

async function walk(dir, files = []) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath, files);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist
  }
  return files;
}

function classifyTemplate(data) {
  if (data.__parseError) {
    return { version: 'ERROR', error: data.__parseError };
  }

  // Check V4 indicators
  const v4Score = Object.values(V4_INDICATORS).filter(fn => fn(data)).length;
  const v3Score = Object.values(V3_INDICATORS).filter(fn => fn(data)).length;

  if (v4Score >= 2) {
    return { version: 'V4', confidence: v4Score / Object.keys(V4_INDICATORS).length };
  }
  if (v3Score >= 2) {
    return { version: 'V3', confidence: v3Score / Object.keys(V3_INDICATORS).length };
  }
  if (data.version) {
    const ver = String(data.version);
    if (ver.startsWith('4')) return { version: 'V4', confidence: 0.5 };
    if (ver.startsWith('3')) return { version: 'V3', confidence: 0.5 };
    if (ver.startsWith('2')) return { version: 'V2', confidence: 0.5 };
  }
  return { version: 'UNKNOWN', confidence: 0 };
}

async function analyzeDirectory(dirPath) {
  const files = await walk(path.join(ROOT, dirPath));
  const results = {
    directory: dirPath,
    total: files.length,
    v4: [],
    v3: [],
    v2: [],
    unknown: [],
    errors: [],
  };

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const data = await readJson(file);
    const { version, confidence, error } = classifyTemplate(data);

    const entry = { file: rel, confidence, error };

    switch (version) {
      case 'V4':
        results.v4.push(entry);
        break;
      case 'V3':
        results.v3.push(entry);
        break;
      case 'V2':
        results.v2.push(entry);
        break;
      case 'ERROR':
        results.errors.push(entry);
        break;
      default:
        results.unknown.push(entry);
    }
  }

  return results;
}

function generateMarkdown(allResults) {
  const date = new Date().toISOString().slice(0, 10);
  const lines = [];

  lines.push(`# 📊 JSON Template Migration Status Report`);
  lines.push(`**Generated:** ${date}`);
  lines.push('');

  // Summary
  const totals = { v4: 0, v3: 0, v2: 0, unknown: 0, errors: 0, total: 0 };
  for (const r of allResults) {
    totals.v4 += r.v4.length;
    totals.v3 += r.v3.length;
    totals.v2 += r.v2.length;
    totals.unknown += r.unknown.length;
    totals.errors += r.errors.length;
    totals.total += r.total;
  }

  const migrationPct = totals.total > 0 
    ? ((totals.v4 / (totals.v4 + totals.v3 + totals.v2)) * 100).toFixed(1) 
    : 0;

  lines.push('## 📈 Summary');
  lines.push('');
  lines.push(`| Metric | Count |`);
  lines.push(`|--------|-------|`);
  lines.push(`| ✅ V4 Templates | ${totals.v4} |`);
  lines.push(`| ⏳ V3 Templates (pending migration) | ${totals.v3} |`);
  lines.push(`| 🔸 V2 Templates (legacy) | ${totals.v2} |`);
  lines.push(`| ❓ Unknown version | ${totals.unknown} |`);
  lines.push(`| ❌ Parse errors | ${totals.errors} |`);
  lines.push(`| **Total** | ${totals.total} |`);
  lines.push('');
  lines.push(`### Migration Progress: **${migrationPct}%** complete`);
  lines.push('');

  // Progress bar
  const barWidth = 30;
  const filled = Math.round((migrationPct / 100) * barWidth);
  const empty = barWidth - filled;
  lines.push(`\`[${'█'.repeat(filled)}${'░'.repeat(empty)}]\``);
  lines.push('');

  // Per-directory breakdown
  lines.push('## 📁 Directory Breakdown');
  lines.push('');

  for (const r of allResults) {
    if (r.total === 0) continue;
    
    const dirPct = r.total > 0 
      ? ((r.v4.length / (r.v4.length + r.v3.length + r.v2.length || 1)) * 100).toFixed(0)
      : 0;

    lines.push(`### \`${r.directory}/\``);
    lines.push(`V4: ${r.v4.length} | V3: ${r.v3.length} | V2: ${r.v2.length} | Unknown: ${r.unknown.length} | Errors: ${r.errors.length} | **${dirPct}% migrated**`);
    lines.push('');
  }

  // Files pending migration
  const pendingV3 = allResults.flatMap(r => r.v3);
  if (pendingV3.length > 0) {
    lines.push('## ⏳ Templates Pending Migration (V3 → V4)');
    lines.push('');
    for (const entry of pendingV3.slice(0, 50)) {
      lines.push(`- \`${entry.file}\``);
    }
    if (pendingV3.length > 50) {
      lines.push(`- _...and ${pendingV3.length - 50} more_`);
    }
    lines.push('');
  }

  // Errors
  const allErrors = allResults.flatMap(r => r.errors);
  if (allErrors.length > 0) {
    lines.push('## ❌ Parse Errors');
    lines.push('');
    for (const entry of allErrors) {
      lines.push(`- \`${entry.file}\`: ${entry.error}`);
    }
    lines.push('');
  }

  // Recommendations
  lines.push('## 💡 Recommendations');
  lines.push('');
  if (totals.v3 > 0) {
    lines.push(`1. **Migrate ${totals.v3} V3 templates** using \`node scripts/migrate-to-v4.mjs\``);
  }
  if (totals.errors > 0) {
    lines.push(`2. **Fix ${totals.errors} JSON parse errors** before migration`);
  }
  if (totals.unknown > 0) {
    lines.push(`3. **Review ${totals.unknown} files** with unknown version format`);
  }
  lines.push('');
  lines.push('---');
  lines.push('_Report generated by `scripts/audit/json-migration-status.mjs`_');

  return lines.join('\n');
}

async function main() {
  console.log('📊 Analyzing JSON template versions...');
  
  const allResults = [];
  for (const dir of TEMPLATE_DIRS) {
    const result = await analyzeDirectory(dir);
    allResults.push(result);
    if (result.total > 0) {
      console.log(`  ${dir}: ${result.v4.length} V4, ${result.v3.length} V3, ${result.errors.length} errors`);
    }
  }

  const markdown = generateMarkdown(allResults);
  
  // Ensure reports directory exists
  const reportsDir = path.join(ROOT, 'reports');
  await fs.mkdir(reportsDir, { recursive: true });
  
  const date = new Date().toISOString().slice(0, 10);
  const outputPath = path.join(reportsDir, `json-migration-status-${date}.md`);
  
  await fs.writeFile(outputPath, markdown, 'utf-8');
  console.log(`\n✅ Report saved to: ${path.relative(ROOT, outputPath)}`);

  // Exit with non-zero if there are errors
  const totals = allResults.reduce((acc, r) => {
    acc.errors += r.errors.length;
    return acc;
  }, { errors: 0 });

  if (totals.errors > 0) {
    console.error(`\n⚠️ Found ${totals.errors} parse errors`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
