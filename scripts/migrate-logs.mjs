#!/usr/bin/env node
/**
 * Migra console.log/warn/error para appLogger.debug/warn/error.
 * Uso:
 *   node scripts/migrate-logs.mjs [glob]
 * Ex.:
 *   node scripts/migrate-logs.mjs "src/components/editor/**/*.tsx"
 * Flags:
 *   --dry     Apenas exibe arquivos que seriam alterados
 */
import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';

const args = process.argv.slice(2);
const isDry = args.includes('--dry');
const patterns = args.filter(a => !a.startsWith('--'));
const target = patterns.length ? patterns : [
  'src/components/editor/**/*.tsx',
  'src/components/editor/**/*.ts'
];

const replaceConsole = (code) => {
  return code
    .replace(/\bconsole\.log\s*\(/g, 'appLogger.debug(')
    .replace(/\bconsole\.warn\s*\(/g, 'appLogger.warn(')
    .replace(/\bconsole\.error\s*\(/g, 'appLogger.error(');
};

const ensureImport = (code) => {
  const importLine = `import { appLogger } from '@/utils/logger';`;
  if (code.includes(importLine)) return code;
  // Se já há algum import de '@/utils/logger', apenas acrescenta appLogger
  const m = code.match(/import\s+\{([^}]+)\}\s+from\s+['"]@\/utils\/logger['"];?/);
  if (m) {
    const before = m[0];
    const names = m[1].split(',').map(s => s.trim()).filter(Boolean);
    if (!names.includes('appLogger')) {
      const after = before.replace('{'+m[1]+'}', '{ '+[...names, 'appLogger'].join(', ')+' }');
      return code.replace(before, after);
    }
    return code; // já tem appLogger
  }
  // Inserir após o primeiro import
  const lines = code.split('\n');
  const idx = lines.findIndex(l => l.startsWith('import '));
  if (idx >= 0) {
    lines.splice(idx + 1, 0, importLine);
    return lines.join('\n');
  }
  return importLine + '\n' + code;
};

const run = async () => {
  const files = (await Promise.all(target.map(p => glob(p, { ignore: ['**/*.d.ts'] })))).flat();
  if (!files.length) {
    console.log('Nenhum arquivo encontrado para migrar.');
    process.exit(0);
  }
  let changed = 0; let scanned = 0;
  for (const file of files) {
    scanned++;
    const abs = path.resolve(file);
    const code = fs.readFileSync(abs, 'utf8');
    if (!/\bconsole\.(log|warn|error)\s*\(/.test(code)) continue;
    const replaced = replaceConsole(code);
    if (replaced === code) continue;
    const withImport = ensureImport(replaced);
    if (isDry) {
      console.log(`[dry] ${file}`);
    } else {
      fs.writeFileSync(abs, withImport, 'utf8');
      console.log(`✔ Migrado: ${file}`);
    }
    changed++;
  }
  console.log(`Concluído. Escaneados: ${scanned}. ${isDry ? 'Candidatos' : 'Migrados'}: ${changed}.`);
};

run().catch((e) => {
  console.error('Falha na migração de logs:', e);
  process.exit(1);
});
