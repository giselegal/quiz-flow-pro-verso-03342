#!/usr/bin/env node
// Audita arquivos duplicados por hash em diretórios alvo
// Uso: node scripts/find-duplicates.mjs [dirs...] [--md]

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const args = process.argv.slice(2);
const writeMarkdown = args.includes('--md');
const dirs = args.filter((a) => !a.startsWith('--'));

// Diretórios padrão alvo (foco no código fonte)
const defaultTargets = ['src', 'client', 'shared', 'templates'];
const targetDirs = dirs.length ? dirs : defaultTargets;

// Extensões alvo (evitar ruído de markdown e binários)
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.css', '.scss']);

// Pastas ignoradas
const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.next',
  '.cache',
  'worktrees',
  'backup',
  'backup_20250811_editor_robusto',
  'system-backup',
  'rest-express@1.0.0',
]);

const root = process.cwd();

/** @param {string} p */
function isIgnoredDir(p) {
  const name = path.basename(p);
  return IGNORE_DIRS.has(name);
}

/** @param {string} file */
function isTargetFile(file) {
  const ext = path.extname(file).toLowerCase();
  return exts.has(ext);
}

/**
 * @param {string} start
 * @returns {Promise<string[]>}
 */
async function walk(start) {
  /** @type {string[]} */
  const files = [];
  async function rec(p) {
    let stat;
    try {
      stat = await fs.promises.stat(p);
    } catch {
      return;
    }
    if (stat.isDirectory()) {
      if (isIgnoredDir(p)) return;
      const entries = await fs.promises.readdir(p);
      await Promise.all(entries.map((e) => rec(path.join(p, e))));
    } else if (stat.isFile()) {
      if (isTargetFile(p)) files.push(p);
    }
  }
  await rec(start);
  return files;
}

/** @param {string} file */
async function hashFile(file) {
  const buf = await fs.promises.readFile(file);
  const h = crypto.createHash('sha1').update(buf).digest('hex');
  return { hash: h, size: buf.length };
}

async function main() {
  const t0 = Date.now();
  const scanTargets = targetDirs
    .map((d) => path.resolve(root, d))
    .filter((p) => fs.existsSync(p));

  if (scanTargets.length === 0) {
    console.error('[dupes] Nenhum diretório alvo encontrado. Informe diretórios ou crie src/.');
    process.exit(1);
  }

  const allFilesArrays = await Promise.all(scanTargets.map((d) => walk(d)));
  const allFiles = allFilesArrays.flat();

  /** @type {Record<string, {size:number, paths:string[]}>} */
  const byHash = {};

  await Promise.all(
    allFiles.map(async (f) => {
      try {
        const { hash, size } = await hashFile(f);
        if (!byHash[hash]) byHash[hash] = { size, paths: [] };
        byHash[hash].paths.push(path.relative(root, f));
      } catch (e) {
        // ignora erros de leitura
      }
    })
  );

  const groups = Object.entries(byHash)
    .map(([hash, info]) => ({ hash, size: info.size, paths: info.paths }))
    .filter((g) => g.paths.length > 1)
    .sort((a, b) => b.size - a.size);

  const duration = ((Date.now() - t0) / 1000).toFixed(2);

  const summary = {
    scannedDirs: scanTargets.map((p) => path.relative(root, p)),
    filesScanned: allFiles.length,
    duplicateGroups: groups.length,
    timeSeconds: Number(duration),
  };

  const reportDir = path.join(root, 'reports');
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const jsonPath = path.join(reportDir, `duplicates-${ts}.json`);
  await fs.promises.writeFile(
    jsonPath,
    JSON.stringify({ summary, groups }, null, 2),
    'utf8'
  );

  if (writeMarkdown) {
    const md = [
      `# Relatório de Arquivos Duplicados`,
      ``,
      `- Diretórios: ${summary.scannedDirs.join(', ')}`,
      `- Arquivos escaneados: ${summary.filesScanned}`,
      `- Grupos duplicados: ${summary.duplicateGroups}`,
      `- Tempo: ${summary.timeSeconds}s`,
      ``,
      `## Grupos (ordenados por tamanho)`,
      ``,
      ...groups.slice(0, 200).flatMap((g, idx) => [
        `### Grupo ${idx + 1} — ${g.size} bytes — hash ${g.hash}`,
        ...g.paths.map((p) => `- ${p}`),
        '',
      ]),
      groups.length > 200
        ? `... (${groups.length - 200} grupos ocultos para reduzir ruído)`
        : '',
    ].join('\n');
    const mdPath = path.join(reportDir, `duplicates-${ts}.md`);
    await fs.promises.writeFile(mdPath, md, 'utf8');
  }

  console.log('[dupes] resumo:', summary);
  console.log('[dupes] relatório salvo em', path.relative(root, jsonPath));
  if (writeMarkdown) {
    console.log('[dupes] markdown gerado em reports/');
  }
}

main().catch((e) => {
  console.error('[dupes] erro:', e);
  process.exit(1);
});
