#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = path.resolve(process.cwd());
const templatePath = path.join(root, 'src/templates/quiz21StepsComplete.json');
const rendererPath = path.join(root, 'src/components/editor/quiz/renderers/BlockTypeRenderer.tsx');

function readJson(p) {
  try {
    const raw = fs.readFileSync(p, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Erro lendo JSON em ${p}:`, e.message);
    process.exitCode = 1;
    return null;
  }
}

function extractTypesFromTemplate(template) {
  const steps = template?.steps || {};
  const blocks = Object.values(steps).flat();
  const types = new Set();
  for (const b of blocks) {
    if (b && typeof b.type === 'string') types.add(b.type);
  }
  return Array.from(types).sort();
}

function extractCasesFromRenderer(source) {
  const caseRegex = /case\s+'([^']+)'/g;
  const types = new Set();
  let m;
  while ((m = caseRegex.exec(source))) {
    types.add(m[1]);
  }
  return Array.from(types).sort();
}

function main() {
  const template = readJson(templatePath);
  const rendererSrc = fs.readFileSync(rendererPath, 'utf8');
  const tplTypes = extractTypesFromTemplate(template);
  const rendererTypes = extractCasesFromRenderer(rendererSrc);

  const setRenderer = new Set(rendererTypes);
  const missingInRenderer = tplTypes.filter(t => !setRenderer.has(t));
  const extraInRenderer = rendererTypes.filter(t => !tplTypes.includes(t));

  console.log('=== Auditoria de Tipos de Blocos ===');
  console.log(`Template: ${templatePath}`);
  console.log(`Renderer: ${rendererPath}`);
  console.log('------------------------------------');
  console.log(`Tipos no template (${tplTypes.length}):`);
  console.log(tplTypes.join(', '));
  console.log('------------------------------------');
  console.log(`Tipos no renderer (${rendererTypes.length}):`);
  console.log(rendererTypes.join(', '));
  console.log('------------------------------------');
  if (missingInRenderer.length === 0) {
    console.log('✅ Todos os tipos do template têm case no renderer.');
  } else {
    console.log('❌ Tipos do template sem case no renderer:');
    console.log(missingInRenderer.join(', '));
  }
  if (extraInRenderer.length) {
    console.log('ℹ️ Types extras no renderer (aliases/suporte futuro):');
    console.log(extraInRenderer.join(', '));
  }
}

main();
