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
  // Ignorar paths claramente não-produção ou escopos de editor/admin/builder
  if (/src\/tests\//.test(file)) return true;
  if (/src\/components\/editor\//.test(file)) return true;
  if (/src\/components\/editor-/.test(file)) return true;
  if (/src\/components\/result\/editor\//.test(file)) return true;
  if (/src\/components\/quiz\/builder\//.test(file)) return true;
  if (/src\/components\/quiz\/editable\//.test(file)) return true;
  // Admin e Dev: não são runtime de produção do quiz
  if (/src\/components\/admin\//.test(file)) return true;
  if (/src\/components\/dev\//.test(file)) return true;
  if (/src\/pages\/editor\//.test(file)) return true;
  if (/src\/pages\/admin\//.test(file)) return true;
  // Páginas utilitárias/diagnóstico específicas fora do escopo de produção
  if (/src\/pages\/(QuizIntegratedPage|MainEditorUnified\.new|EditorBlocksDiagnosticPage)\.tsx$/.test(file)) return true;
  // Backups/arquivados
  if (/backup/i.test(file)) return true;
  return false;
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
        // Ignorar linhas comentadas
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) continue;
        if (line.includes("from '") || line.includes('from "')) {
          if (line.includes(FORBIDDEN_PATTERN)) {
            offenders.push({ file, line: line.trim() });
          }
        }
      }
    }
    // Permitir explicitamente alguns barrels neutros temporários e casos especiais controlados
    const allowedPatterns = [
      /src\/components\/quiz\/QuizAppConnected\.tsx$/,
      /editor\/unified/,
      /src\/components\/core\/renderers\/index\.ts/,
      /src\/components\/quiz-modular\/index\.ts/,
      // Barrel neutro para módulos ainda hospedados sob editor/*
      /src\/components\/core\/modules\/index\.ts/,
    ];
    const filtered = offenders.filter(o => !allowedPatterns.some(p => p.test(o.file) || p.test(o.line)));
    expect(filtered, `Imports proibidos:\n${filtered.map(o => `${o.file}: ${o.line}`).join('\n')}`).toHaveLength(0);
  });
});
