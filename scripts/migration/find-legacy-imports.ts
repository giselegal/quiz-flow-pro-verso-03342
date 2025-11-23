#!/usr/bin/env tsx
/**
 * Scan de imports legados e sugestões de migração para aliases/canônico
 *
 * Uso:
 *  - tsx scripts/migration/find-legacy-imports.ts
 *  - tsx scripts/migration/find-legacy-imports.ts --apply-alias (experimental)
 */
import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';

const patterns = [
  'src/**/*.{ts,tsx,js,jsx}'
];

const legacyTargets = [
  '@/services/HybridTemplateService',
  '@/services/UnifiedTemplateService',
  '@/services/ServiceAliases',
  'src/services/HybridTemplateService',
  'src/services/UnifiedTemplateService',
  'src/services/ServiceAliases',
];

const aliasModule = "@/services/aliases";

function findMatches(content: string) {
  const matches: { from: string; line: number; text: string }[] = [];
  const lines = content.split(/\r?\n/);
  lines.forEach((text, idx) => {
    if (!text.includes('import')) return;
    for (const target of legacyTargets) {
      if (text.includes(`'${target}'`) || text.includes(`"${target}"`)) {
        matches.push({ from: target, line: idx + 1, text: text.trim() });
      }
    }
  });
  return matches;
}

function suggestReplacement(original: string) {
  // Heurística simples: redirecionar para aliases centralizados
  // Mapeia import default para named import quando necessário
  const suggestion = original
    .replace(/from ['\"](@?\/?src\/services\/|@\/services\/)(HybridTemplateService)['\"];?/, "from '@/services/aliases'; // import { HybridTemplateService } from '@/services/aliases'")
    .replace(/from ['\"](@?\/?src\/services\/|@\/services\/)(UnifiedTemplateService)['\"];?/, "from '@/services/aliases'; // import { UnifiedTemplateService } from '@/services/aliases'")
    .replace(/from ['\"](@?\/?src\/services\/|@\/services\/)(ServiceAliases)['\"];?/, "from '@/services/aliases'");
  return suggestion;
}

async function main() {
  const apply = process.argv.includes('--apply-alias');
  const files = await glob(patterns, { ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'] });
  let total = 0;
  let changed = 0;
  for (const file of files) {
    const abs = path.resolve(file);
    let content: string;
    try {
      content = await fs.readFile(abs, 'utf8');
    } catch (e) {
      console.warn(`⚠️  Ignorando arquivo inacessível: ${file}`);
      continue;
    }
    const matches = findMatches(content);
    if (matches.length > 0) {
      total += matches.length;
      console.log(`\n📄 ${file}`);
      for (const m of matches) {
        console.log(`  L${m.line}: ${m.text}`);
        const suggestion = suggestReplacement(m.text);
        if (suggestion !== m.text) {
          console.log(`  → Sugestão: ${suggestion}`);
        }
      }
      if (apply) {
        let updated = content;
        let didChange = false;
        for (const m of matches) {
          const suggestion = suggestReplacement(m.text);
          if (suggestion !== m.text) {
            updated = updated.replace(m.text, suggestion);
            didChange = true;
          }
        }
        if (didChange) {
          await fs.writeFile(abs, updated, 'utf8');
          changed++;
        }
      }
    }
  }
  console.log(`\nResumo: ${total} import(s) legado(s) encontrado(s) em ${files.length} arquivo(s).`);
  if (apply) console.log(`Arquivos alterados: ${changed}`);
  console.log(`\nDica: prefira migrar para os canônicos diretamente (ex.: templateService em '@/services/canonical/TemplateService').`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
