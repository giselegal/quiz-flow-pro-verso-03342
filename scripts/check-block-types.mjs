#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const REGISTRY_TSX = path.join(ROOT, 'src', 'components', 'editor', 'blocks', 'EnhancedBlockRegistry.tsx');
const DYNAMIC_REGISTRY_TS = path.join(ROOT, 'src', 'config', 'registry', 'DynamicBlockRegistry.ts');
const BLOCKS_DIR = path.join(ROOT, 'public', 'templates', 'blocks');

function read(p){ try { return fs.readFileSync(p, 'utf-8'); } catch { return ''; } }

function extractRegistryKeys(code){
  const keys = new Set();
  const objStart = code.indexOf('export const ENHANCED_BLOCK_REGISTRY');
  if (objStart !== -1) {
    const braceStart = code.indexOf('{', objStart);
    if (braceStart !== -1) {
      let i = braceStart+1, depth = 1, buf = '';
      while (i < code.length && depth > 0) {
        const ch = code[i++];
        if (ch === '{') depth++;
        if (ch === '}') depth--;
        if (depth > 0) buf += ch;
      }
      // Find keys like 'foo': or "foo":
      const keyRegex = /['\"]([a-zA-Z0-9_-]+)['\"]\s*:/g;
      let m;
      while ((m = keyRegex.exec(buf)) !== null) {
        keys.add(m[1]);
      }
    }
  }
  return keys;
}

function extractDynamicKeys(code){
  const keys = new Set();
  // From metadata
  const metaRegex = /this\.setMetadata\(\s*['\"]([a-zA-Z0-9_-]+)['\"]/g;
  let m;
  while ((m = metaRegex.exec(code)) !== null) keys.add(m[1]);
  // From import map: if (type === 'xyz') return import(...)
  const importRegex = /if \(type === ['\"]([a-zA-Z0-9_-]+)['\"]\)/g;
  while ((m = importRegex.exec(code)) !== null) keys.add(m[1]);
  return keys;
}

function loadBlocksTypes(){
  const types = new Map();
  const files = fs.readdirSync(BLOCKS_DIR).filter(f => f.endsWith('.json'));
  for (const f of files) {
    const p = path.join(BLOCKS_DIR, f);
    try {
      const json = JSON.parse(fs.readFileSync(p, 'utf-8'));
      const blocks = json.blocks || [];
      for (const b of blocks) {
        const t = b.type;
        if (!types.has(t)) types.set(t, new Set());
        types.get(t).add(f);
      }
    } catch (e) {
      // ignore
    }
  }
  return types;
}

const regCode = read(REGISTRY_TSX);
const dynCode = read(DYNAMIC_REGISTRY_TS);
const regKeys = extractRegistryKeys(regCode);
const dynKeys = extractDynamicKeys(dynCode);
const known = new Set([...regKeys, ...dynKeys]);

const typesUsage = loadBlocksTypes();

const unknown = [];
for (const [t, files] of typesUsage.entries()) {
  if (!known.has(t)) unknown.push({ type: t, files: Array.from(files).sort() });
}

console.log('Tipos conhecidos no Enhanced + Dynamic:', known.size);
console.log('Tipos usados nos blocos:', typesUsage.size);
if (unknown.length) {
  console.log('\n⚠️ Tipos não encontrados no registro (podem não renderizar):');
  for (const u of unknown) {
    console.log(` - ${u.type} -> ${u.files.join(', ')}`);
  }
} else {
  console.log('\n✅ Todos os tipos dos blocos estão registrados.');
}
