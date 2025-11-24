#!/usr/bin/env node
/**
 * 🔧 SCRIPT: EXTRACT GLOBAL CONFIG (Fase 1)
 *
 * 1. Detecta primeiro objeto "theme" em step-XX-v3.json dentro de public/templates
 * 2. Gera (se ainda não existir) src/config/globalTheme.ts (já criado manualmente) → apenas log
 * 3. Remove a chave "theme" de cada arquivo step-XX-v3.json para eliminar duplicação
 * 4. Reporta economia estimada de bytes
 *
 * Uso: node scripts/extract-global-config.mjs --dry (não altera) | sem flag altera
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const stepsDir = path.join(root, 'public', 'templates');
const dryRun = process.argv.includes('--dry');

const stepPattern = /^step-\d{2}-v3\.json$/;

function formatBytes(b) {
  const units = ['B','KB','MB','GB'];
  let i = 0; let v = b;
  while (v >= 1024 && i < units.length -1) { v /= 1024; i++; }
  return `${v.toFixed(2)} ${units[i]}`;
}

let collectedTheme = null;
let totalBytesRemoved = 0;
let totalFiles = 0;

for (const file of fs.readdirSync(stepsDir)) {
  if (!stepPattern.test(file)) continue;
  totalFiles++;
  const full = path.join(stepsDir, file);
  const raw = fs.readFileSync(full, 'utf8');
  const sizeBefore = Buffer.byteLength(raw);
  let json;
  try { json = JSON.parse(raw); } catch { console.error('❌ JSON inválido:', file); continue; }
  if (json.theme) {
    if (!collectedTheme) collectedTheme = json.theme;
    // Remover
    delete json.theme;
    const updated = JSON.stringify(json, null, 2);
    const sizeAfter = Buffer.byteLength(updated);
    const removed = sizeBefore - sizeAfter;
    totalBytesRemoved += removed;
    if (!dryRun) fs.writeFileSync(full, updated, 'utf8');
    console.log(`✅ Removido theme de ${file} (-${formatBytes(removed)})`);
  } else {
    console.log(`ℹ️ Sem theme em ${file}`);
  }
}

console.log('\n📊 RESULTADO EXTRAÇÃO GLOBAL THEME');
console.log(`Arquivos processados: ${totalFiles}`);
console.log(`Economia estimada: ${formatBytes(totalBytesRemoved)}`);
if (collectedTheme) {
  console.log('Exemplo de theme coletado (parcial):');
  console.log(JSON.stringify(collectedTheme.colors || collectedTheme, null, 2).slice(0, 200) + '...');
} else {
  console.log('Nenhum theme encontrado.');
}
if (dryRun) console.log('Modo DRY-RUN: nenhuma alteração escrita.');
