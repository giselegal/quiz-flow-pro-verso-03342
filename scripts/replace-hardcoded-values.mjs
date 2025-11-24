#!/usr/bin/env node
/**
 * 🔧 SCRIPT: REPLACE HARDCODED VALUES (Fase 1)
 * - Substitui cores #B89B7A variantes → token {{theme.colors.primary}}
 * - Substitui URLs Cloudinary → referência "{{asset.logo}}" (simplificada)
 *
 * Uso: node scripts/replace-hardcoded-values.mjs --dry
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const publicTemplatesDir = path.join(root, 'public', 'templates');
const dryRun = process.argv.includes('--dry');

const COLOR_MAP = {
  '#B89B7A': '{{theme.colors.primary}}',
  '#b89b7a': '{{theme.colors.primary}}',
  'B89B7A': '{{theme.colors.primary}}',
};
const LOGO_REGEX = /https:\/\/res\.cloudinary\.com\/der8kogzu\/[^"']+/g;

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, acc); else acc.push(full);
  }
  return acc;
}

function transformContent(content) {
  let changed = false;
  for (const [needle, token] of Object.entries(COLOR_MAP)) {
    if (content.includes(needle)) {
      content = content.split(needle).join(token); changed = true;
    }
  }
  content = content.replace(LOGO_REGEX, (match) => { changed = true; return '{{asset.logo}}'; });
  return { content, changed };
}

const files = walk(publicTemplatesDir).filter(f => f.endsWith('.json'));
let totalChanged = 0;

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const { content, changed } = transformContent(raw);
  if (changed) {
    totalChanged++;
    if (!dryRun) fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ Atualizado: ${path.relative(root, file)}`);
  }
}

console.log(`\n📊 Substituições concluídas. Arquivos alterados: ${totalChanged}`);
if (dryRun) console.log('Modo DRY-RUN: nenhuma alteração escrita.');
