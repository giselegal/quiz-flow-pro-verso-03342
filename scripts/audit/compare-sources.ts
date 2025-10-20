#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';

async function main() {
  const root = process.cwd();
  const publicTemplatesDir = path.join(root, 'public', 'templates');
  const { getQuiz21StepsTemplate } = await import('../../src/templates/imports');
  const tsTemplate: any = getQuiz21StepsTemplate();

  const results: Array<{ step: string; existsInTS: boolean; existsInJSON: boolean; diff: string }> = [];

  for (let i = 1; i <= 21; i++) {
    const id = `step-${i.toString().padStart(2, '0')}`;
    const tsStep = tsTemplate[id];
    const jsonPath = path.join(publicTemplatesDir, `${id}-v3.json`);
    const existsInTS = !!tsStep;
    const existsInJSON = fs.existsSync(jsonPath);
    let diff = 'OK';
    if (existsInTS && existsInJSON) {
      try {
        const json = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        const tsSections = Array.isArray(tsStep.sections) ? tsStep.sections.length : 0;
        const tsBlocks = Array.isArray(tsStep.blocks) ? tsStep.blocks.length : 0;
        const jsonSections = Array.isArray(json.sections) ? json.sections.length : 0;
        const jsonBlocks = Array.isArray(json.blocks) ? json.blocks.length : 0;
        if (tsSections !== jsonSections || tsBlocks !== jsonBlocks) {
          diff = `ts(sections=${tsSections},blocks=${tsBlocks}) vs json(sections=${jsonSections},blocks=${jsonBlocks})`;
        }
      } catch (e) {
        diff = `Erro ao ler JSON: ${(e as Error).message}`;
      }
    } else if (!existsInTS) {
      diff = 'Ausente no TS';
    } else if (!existsInJSON) {
      diff = 'Ausente no JSON';
    }
    results.push({ step: id, existsInTS, existsInJSON, diff });
  }

  console.log('=== Auditoria de Fontes (expectativa: source=ts) ===');
  console.log('Fonte canônica (ts):', (tsTemplate as any)._source || 'desconhecida');
  results.forEach(r => {
    console.log(`${r.step}: ts=${r.existsInTS ? '✅' : '❌'} json=${r.existsInJSON ? '✅' : '❌'} diff=${r.diff}`);
  });
  const allTs = results.every(r => r.existsInTS);
  if (!allTs) {
    process.exitCode = 2;
  }
}

main().catch(err => {
  console.error('Erro na auditoria:', err);
  process.exit(1);
});
