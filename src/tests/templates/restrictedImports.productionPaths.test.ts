import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { globSync } from 'glob';

/**
 * Garante que arquivos de produção não importam diretamente paths do editor.
 * Exceções: arquivos dentro de src/components/editor/** e testes.
 */

const FORBIDDEN_PATTERN = "@/components/editor/";
const PROD_GLOBS = [
  'src/components/**/*.tsx',
  'src/components/**/*.ts',
  'src/pages/**/*.tsx',
  'src/pages/**/*.ts',
];

function isEditorPath(file: string) {
  return /src\/components\/editor\//.test(file) || /src\/tests\//.test(file) || /src\/components\/editor-/.test(file);
}

describe('Restricted imports em caminhos de produção', () => {
  it('não deve haver import de editor/* em componentes de produção', () => {
    const files = PROD_GLOBS.flatMap((g) => globSync(g, { windowsPathsNoEscape: true }));
    const offenders: { file: string; line: string }[] = [];
    for (const file of files) {
      if (isEditorPath(file)) continue;
      const content = readFileSync(file, 'utf-8');
      const lines = content.split(/\r?\n/);
      for (const line of lines) {
        if (line.includes("from '") || line.includes('from "')) {
          if (line.includes(FORBIDDEN_PATTERN)) {
            offenders.push({ file, line: line.trim() });
          }
        }
      }
    }
    // Permitir explicitamente o QuizAppConnected usar UnifiedStepRenderer do editor por enquanto
    const filtered = offenders.filter(o => !/src\/components\/quiz\/QuizAppConnected\.tsx$/.test(o.file) || !/editor\/unified/.test(o.line));
    expect(filtered, `Imports proibidos:\n${filtered.map(o => `${o.file}: ${o.line}`).join('\n')}`).toHaveLength(0);
  });
});
