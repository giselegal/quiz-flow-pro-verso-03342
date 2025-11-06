#!/usr/bin/env node
/**
 * 🛑 DEPRECATED: Use `node scripts/split-master-complete.mjs` ou `npm run templates:generate:v3`
 * Este script legacy operava em "sections" e não preserva todos os campos.
 * Para forçar execução, defina ALLOW_DEPRECATED_GENERATORS=1.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';

const ROOT = process.cwd();
const TEMPLATES_DIR = resolve(ROOT, 'public', 'templates');
const MASTER = resolve(TEMPLATES_DIR, 'quiz21-complete.json');

const pad2 = (n) => String(n).padStart(2, '0');

function main() {
  if (!process.env.ALLOW_DEPRECATED_GENERATORS) {
    console.warn('⚠️ DEPRECATION: scripts/split-master-into-v3.mjs está obsoleto.');
    console.warn('   Use: node scripts/split-master-complete.mjs  (ou)  npm run templates:generate:v3');
    process.exit(1);
  }
  try {
    const raw = readFileSync(MASTER, 'utf-8');
    const master = JSON.parse(raw);
    const steps = master?.steps || {};

    let generated = 0;
    for (let i = 1; i <= 21; i++) {
      const key = `step-${pad2(i)}`;
      const data = steps[key];
      if (!data) {
        console.warn(`⚠️  ${key} não encontrado no master, pulando...`);
        continue;
      }
      const outFile = resolve(TEMPLATES_DIR, `${key}-v3.json`);
      const dir = dirname(outFile);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

      // Garantir templateVersion: '3.0'
      const normalized = {
        templateVersion: data.templateVersion || '3.0',
        metadata: data.metadata || { id: `${key}-v3`, name: key, description: '', category: 'question' },
        theme: data.theme || {},
        sections: data.sections || [],
        validation: data.validation || {},
        behavior: data.behavior || {},
      };

      writeFileSync(outFile, JSON.stringify(normalized, null, 2), 'utf-8');
      console.log(`✅ Gerado ${key}-v3.json (${normalized.sections.length} seções)`);
      generated++;
    }

    console.log(`\n🎉 Concluído. Arquivos gerados: ${generated}/21 em ${TEMPLATES_DIR}`);
  } catch (err) {
    console.error('❌ Erro ao dividir master:', err?.message || err);
    process.exit(1);
  }
}

main();
