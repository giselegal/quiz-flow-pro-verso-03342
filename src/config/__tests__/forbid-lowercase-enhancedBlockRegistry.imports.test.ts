import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

function walk(dir: string, files: string[] = []): string[] {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    // Ignorar pastas de build/cache/arquivadas
    if (/(^\.|node_modules|dist|coverage|\.turbo|\.next|\.vercel|archived)/.test(entry)) continue;
    let st: ReturnType<typeof statSync> | null = null;
    try {
      st = statSync(full);
    } catch {
      continue; // pular entradas inválidas/apagadas
    }
    if (st.isDirectory()) walk(full, files);
  else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry)) files.push(full);
  }
  return files;
}

describe('Imports do EnhancedBlockRegistry devem usar caminho canônico', () => {
  it('não deve haver imports para \'/blocks/enhancedBlockRegistry\' (minúsculo)', () => {
    const root = join(process.cwd(), 'src');
    const files = walk(root);
    const offenders: string[] = [];
    const pattern = /components\/editor\/blocks\/enhancedBlockRegistry(\.|'|"|\/?)/;
    for (const file of files) {
  // Ignorar o próprio shim legacy (mantido apenas com warning) e arquivos de teste
      if (file.endsWith('src/components/editor/blocks/enhancedBlockRegistry.ts')) continue;
  if (file.includes('/__tests__/')) continue;
  let content = '';
  try { content = readFileSync(file, 'utf8'); } catch { continue; }
      if (pattern.test(content)) offenders.push(file);
    }
    expect(offenders, `Substitua os imports por '@/components/editor/blocks/EnhancedBlockRegistry'\nArquivos: \n- ${offenders.join('\n- ')}`).toEqual([]);
  });
});
