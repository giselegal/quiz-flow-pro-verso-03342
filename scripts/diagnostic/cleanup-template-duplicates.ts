#!/usr/bin/env tsx
/*
 * Limpa duplicados -template.json quando existe -v3.json
 * - Move arquivos step-XX-template.json para public/templates/.trash-<timestamp>/
 * - Gera um log com hashes para rastreabilidade
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const TEMPLATES = path.join(ROOT, 'public', 'templates');

function exists(p: string) { try { fs.accessSync(p, fs.constants.F_OK); return true; } catch { return false; } }
function mkdirp(p: string) { fs.mkdirSync(p, { recursive: true }); }
function sha1File(p: string) { return crypto.createHash('sha1').update(fs.readFileSync(p)).digest('hex'); }

function stepFiles(stepId: string) {
  return {
    v3: path.join(TEMPLATES, `${stepId}-v3.json`),
    template: path.join(TEMPLATES, `${stepId}-template.json`),
  };
}

async function main() {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  const trashDir = path.join(TEMPLATES, `.trash-${stamp}`);
  mkdirp(trashDir);

  const moves: any[] = [];

  for (let i = 1; i <= 21; i++) {
    const stepId = `step-${String(i).padStart(2, '0')}`;
    const files = stepFiles(stepId);
    if (exists(files.v3) && exists(files.template)) {
      const src = files.template;
      const dst = path.join(trashDir, path.basename(src));
      const info = {
        step: stepId,
        from: src,
        to: dst,
        v3Hash: sha1File(files.v3),
        templateHash: sha1File(files.template),
      };
      fs.renameSync(src, dst);
      moves.push(info);
      console.log(`🔄 Movido ${path.basename(src)} → ${dst}`);
    }
  }

  const logPath = path.join(trashDir, 'cleanup.log.json');
  fs.writeFileSync(logPath, JSON.stringify({ when: new Date().toISOString(), moves }, null, 2));
  console.log(`\n✅ Limpeza concluída. Log em: ${logPath}`);
}

main().catch(err => { console.error('Falha na limpeza:', err); process.exit(1); });
