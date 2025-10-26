#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'public', 'templates', 'blocks');
const DEST_DIR = path.join(ROOT, 'templates');

function pad(n){ return String(n).padStart(2, '0'); }
function stepId(i){ return `step-${pad(i)}`; }

function ensureDir(p){ if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

function main(){
  ensureDir(DEST_DIR);
  let ok = 0, miss = 0;
  for (let i = 1; i <= 21; i++) {
    const id = stepId(i);
    const srcPath = path.join(SRC_DIR, `${id}.json`);
    const destPath = path.join(DEST_DIR, `${id}-template.json`);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      ok++;
      console.log(`✅ Copiado ${srcPath} → ${destPath}`);
    } else {
      // fallback mínimo
      fs.writeFileSync(destPath, JSON.stringify({ templateVersion: '3.1', metadata: { id }, blocks: [] }, null, 2));
      miss++;
      console.log(`⚠️ Fonte ausente para ${id}.json. Criado stub vazio em ${destPath}`);
    }
  }
  console.log(`\nResumo: ${ok} copiados, ${miss} stubs criados.`);
}

main();
