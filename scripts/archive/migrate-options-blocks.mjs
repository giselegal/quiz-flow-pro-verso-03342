#!/usr/bin/env node
// Migra JSONs: "options-grid" -> "options grid" e ajusta columns (2 com imagens, 1 sem)
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, 'public');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(full));
    else if (e.isFile() && e.name.endsWith('.json')) files.push(full);
  }
  return files;
}

function hasImages(props) {
  if (!props || typeof props !== 'object') return false;
  if (props.showImages === true) return true;
  const opts = props.options;
  if (Array.isArray(opts)) {
    return opts.some(o => o && typeof o === 'object' && (o.imageUrl || o.image || o.src));
  }
  return false;
}

function migrateFile(file) {
  let json;
  try {
    const raw = fs.readFileSync(file, 'utf8');
    json = JSON.parse(raw);
  } catch (e) {
    return { file, changed: false, error: `parse-failed: ${e.message}` };
  }

  let changed = false;
  const visitAny = (node) => {
    if (Array.isArray(node)) {
      for (const item of node) visitAny(item);
      return;
    }
    if (!node || typeof node !== 'object') return;
    // Atualizar o próprio nó se for um bloco de opções
    if (typeof node.type === 'string' && (node.type === 'options-grid' || node.type === 'options grid')) {
      if (node.type === 'options-grid') {
        node.type = 'options grid';
        changed = true;
      }
      const props = (node.properties = node.properties || node.content || {});
      const images = hasImages(props);
      const desired = images ? 2 : 1;
      if (props.columns !== desired) {
        props.columns = desired;
        changed = true;
      }
    }
    // Recursão em todas as propriedades
    for (const key of Object.keys(node)) {
      visitAny(node[key]);
    }
  };

  visitAny(json);

  if (changed) {
    try {
      fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n');
      return { file, changed: true };
    } catch (e) {
      return { file, changed: false, error: `write-failed: ${e.message}` };
    }
  }
  return { file, changed: false };
}

function main() {
  const files = walk(TARGET_DIR);
  const results = files.map(migrateFile);
  const changed = results.filter(r => r.changed).map(r => r.file);
  const errors = results.filter(r => r.error);
  console.log(`Processed ${results.length} JSON files`);
  console.log(`Changed: ${changed.length}`);
  if (changed.length) {
    for (const f of changed) console.log(`  updated: ${path.relative(ROOT, f)}`);
  }
  if (errors.length) {
    console.warn('Errors:');
    for (const e of errors) console.warn(`  ${path.relative(ROOT, e.file)} -> ${e.error}`);
  }
  process.exit(0);
}

main();
