import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

function walk(dir: string, files: string[] = []): string[] {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    // Ignorar pastas de build/cache
    if (/(^\.|node_modules|dist|coverage|\.turbo|\.next|\.vercel)/.test(entry)) continue;
    const st = statSync(full);
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
      const content = readFileSync(file, 'utf8');
      if (pattern.test(content)) offenders.push(file);
    }
    expect(offenders, `Substitua os imports por '@/components/editor/blocks/EnhancedBlockRegistry'\nArquivos: \n- ${offenders.join('\n- ')}`).toEqual([]);
  });
});
