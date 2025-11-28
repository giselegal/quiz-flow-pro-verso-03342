#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const TEMPLATE_DIRS = [
  path.join(root, 'public', 'templates'),
  path.join(root, 'public', 'steps-refs'),
];
const SCHEMA_PATH = path.join(root, 'schemas', 'quiz-template-v4.schema.json');
const REPORTS_DIR = path.join(root, 'reports');

async function readJson(p) {
  const raw = await fs.readFile(p, 'utf-8');
  return JSON.parse(raw);
}

async function listJsonFiles(dir) {
  const out = [];
  async function walk(d) {
    let entries;
    try {
      entries = await fs.readdir(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) await walk(full);
      else if (e.isFile() && e.name.endsWith('.json')) out.push(full);
    }
  }
  await walk(dir);
  return out;
}

function normalizeSchemaRef(ref) {
  if (!ref) return null;
  // Accept absolute like '/schemas/quiz-template-v4.schema.json' or relative
  return ref.replace(/^\./, '').replace(/^\/*/, '/');
}

async function main() {
  const schema = await readJson(SCHEMA_PATH);
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  const allFiles = [];
  for (const dir of TEMPLATE_DIRS) {
    const files = await listJsonFiles(dir);
    allFiles.push(...files);
  }

  const results = [];
  for (const file of allFiles) {
    let data;
    try {
      data = await readJson(file);
    } catch (e) {
      results.push({ file, ok: false, error: `JSON parse error: ${e.message}` });
      continue;
    }
    const schemaRef = normalizeSchemaRef(data.$schema);
    const shouldValidate = schemaRef === '/schemas/quiz-template-v4.schema.json';
    if (!shouldValidate) {
      results.push({ file, ok: null, note: schemaRef ? `Schema diferente: ${schemaRef}` : 'Sem $schema' });
      continue;
    }
    const valid = validate(data);
    if (valid) {
      results.push({ file, ok: true });
    } else {
      results.push({ file, ok: false, errors: validate.errors });
    }
  }

  await fs.mkdir(REPORTS_DIR, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
  const reportPath = path.join(REPORTS_DIR, `json-v4-validation-${date}.md`);

  const total = results.length;
  const validated = results.filter(r => r.ok === true).length;
  const failed = results.filter(r => r.ok === false).length;
  const skipped = results.filter(r => r.ok === null).length;

  let md = '';
  md += `# Validação JSON V4 (${date})\n\n`;
  md += `- Total analisados: ${total}\n`;
  md += `- Válidos (V4): ${validated}\n`;
  md += `- Falhas (V4): ${failed}\n`;
  md += `- Ignorados (sem $schema ou diferente): ${skipped}\n\n`;

  if (failed > 0) {
    md += `## Falhas\n`;
    for (const r of results.filter(r => r.ok === false)) {
      md += `- ${path.relative(root, r.file)}\n`;
      if (r.error) {
        md += `  - Erro: ${r.error}\n`;
      } else if (r.errors) {
        for (const err of r.errors) {
          md += `  - ${err.instancePath || '/'} ${err.message}\n`;
        }
      }
    }
    md += `\n`;
  }

  if (skipped > 0) {
    md += `## Ignorados\n`;
    for (const r of results.filter(r => r.ok === null)) {
      md += `- ${path.relative(root, r.file)} — ${r.note}\n`;
    }
    md += `\n`;
  }

  md += `## Válidos\n`;
  for (const r of results.filter(r => r.ok === true)) {
    md += `- ${path.relative(root, r.file)}\n`;
  }

  await fs.writeFile(reportPath, md, 'utf-8');
  console.log(`Relatório salvo em: ${path.relative(root, reportPath)}`);

  // Sinalização para CI: exit code 1 se houver falhas
  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
