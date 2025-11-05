#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const ROOT = process.cwd();
const FILE = path.join(ROOT, 'src', 'config', 'optimized21StepsFunnel.json');

const args = new Set(process.argv.slice(2));
const apply = args.has('--apply');

async function run() {
  const raw = await fs.readFile(FILE, 'utf8');
  const json = JSON.parse(raw);
  if (!Array.isArray(json.steps)) {
    console.log('Nenhuma array steps encontrada. Nada a fazer.');
    return;
  }
  const seen = new Set();
  const duplicates = [];
  const deduped = [];
  for (const s of json.steps) {
    const id = s && s.id ? String(s.id) : undefined;
    if (!id) { deduped.push(s); continue; }
    if (seen.has(id)) {
      duplicates.push(id);
      // skip if applying; else keep for preview
      if (!apply) deduped.push(s);
    } else {
      seen.add(id);
      deduped.push(s);
    }
  }
  const uniqueDups = [...new Set(duplicates)];
  if (uniqueDups.length === 0) {
    console.log('Sem duplicatas de stepId encontradas.');
    return;
  }
  console.log('Duplicatas encontradas:', uniqueDups);
  if (apply) {
    const out = { ...json, steps: deduped };
    await fs.writeFile(FILE, JSON.stringify(out, null, 2) + '\n', 'utf8');
    console.log('Arquivo atualizado sem duplicatas.');
  } else {
    console.log('Execução em modo dry-run. Use --apply para gravar.');
  }
}

run().catch(err => { console.error(err); process.exit(1); });
