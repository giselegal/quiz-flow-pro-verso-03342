#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = '/workspaces/quiz-flow-pro-verso-03342';
const steps = Array.from({ length: 21 }, (_, i) => String(i + 1).padStart(2, '0'));

const paths = {
  modularDir: path.join(ROOT, 'src/data/modularSteps'),
  v3Dir: path.join(ROOT, 'public/templates'),
  master: path.join(ROOT, 'public/templates/quiz21-complete.json'),
  tsFallbackA: path.join(ROOT, 'src/templates/quiz21StepsComplete.ts'),
  tsFallbackB: path.join(ROOT, 'src/data/templates/quiz21StepsComplete.ts'),
  outFile: path.join(ROOT, 'RELATORIO_FONTES_STEPS.md'),
};

function fileExists(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

function loadJSON(p) {
  try {
    const s = fs.readFileSync(p, 'utf8');
    return JSON.parse(s);
  } catch (e) {
    return null;
  }
}

function countSectionsFromMaster(masterObj, stepKey) {
  try {
    const step = masterObj?.steps?.[stepKey];
    const sections = step?.sections;
    return Array.isArray(sections) ? sections.length : 0;
  } catch {
    return 0;
  }
}

function countSectionsFromV3(v3Obj) {
  try {
    const sections = v3Obj?.sections;
    return Array.isArray(sections) ? sections.length : 0;
  } catch {
    return 0;
  }
}

function countBlocksFromModular(modObj) {
  try {
    const blocks = modObj?.blocks;
    return Array.isArray(blocks) ? blocks.length : 0;
  } catch {
    return 0;
  }
}

// Load master once
const masterExists = fileExists(paths.master);
const masterObj = masterExists ? loadJSON(paths.master) : null;
const tsFallbackExists = fileExists(paths.tsFallbackA) || fileExists(paths.tsFallbackB);

const rows = [];
let modularCount = 0;

for (const s of steps) {
  const stepKey = `step-${s}`;
  const modularPath = path.join(paths.modularDir, `${stepKey}.json`);
  const v3Path = path.join(paths.v3Dir, `${stepKey}-v3.json`);

  const modularExists = fileExists(modularPath);
  const v3Exists = fileExists(v3Path);

  let modularBlocks = 0;
  let v3Sections = 0;
  let masterSections = 0;

  if (modularExists) {
    const modObj = loadJSON(modularPath);
    modularBlocks = countBlocksFromModular(modObj);
  }
  if (v3Exists) {
    const v3Obj = loadJSON(v3Path);
    v3Sections = countSectionsFromV3(v3Obj);
  }
  if (masterObj) {
    masterSections = countSectionsFromMaster(masterObj, stepKey);
  }

  const activeSource = modularExists ? 'modular' : (masterExists ? 'master' : (tsFallbackExists ? 'ts-fallback' : 'none'));
  if (modularExists) modularCount += 1;

  rows.push({
    step: stepKey,
    modularExists,
    modularBlocks,
    v3Exists,
    v3Sections,
    masterExists,
    masterSections,
    tsFallbackExists,
    activeSource,
  });
}

// Markdown output
const lines = [];
lines.push('# Relatório de Fontes por Etapa');
lines.push('');
lines.push('- Prioridade de carregamento atual: modular > master(hidratado) > TS fallback');
lines.push(`- Etapas com JSON modular: ${modularCount} de ${steps.length}`);
lines.push('');
lines.push('| Step | Modular | #Blocks | V3 | #Sections(v3) | Master | #Sections(master) | TS Fallback | Fonte Ativa |');
lines.push('|------|---------|---------|----|---------------|--------|-------------------|-------------|-------------|');
for (const r of rows) {
  const colMod = r.modularExists ? 'sim' : 'não';
  const colV3 = r.v3Exists ? 'sim' : 'não';
  const colMaster = r.masterExists ? 'sim' : 'não';
  const colTS = r.tsFallbackExists ? 'sim' : 'não';
  lines.push(`| ${r.step} | ${colMod} | ${r.modularBlocks} | ${colV3} | ${r.v3Sections} | ${colMaster} | ${r.masterSections} | ${colTS} | ${r.activeSource} |`);
}
lines.push('');
lines.push('Notas:');
lines.push('- Master JSON está presente por step quando indicado como "sim" e já é hidratado com QUIZ_STEPS no runtime.');
lines.push('- Se Modular = sim, ele sobrepõe Master. Caso não exista modular, o Master é a fonte ativa. O TS fallback é usado apenas se o Master estiver ausente.');

fs.writeFileSync(paths.outFile, lines.join('\n'), 'utf8');
console.log(`Relatório gerado em ${paths.outFile}`);
