#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const MASTER = path.join(ROOT, 'public', 'templates', 'quiz21-complete.json');
const BLOCKS_DIR = path.join(ROOT, 'public', 'templates', 'blocks');
const REPORTS_DIR = path.join(ROOT, 'reports');

function pad(n) { return String(n).padStart(2, '0'); }
function stepId(n){ return `step-${pad(n)}`; }

function readJSON(p){
  try {
    const raw = fs.readFileSync(p, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function listStrings(obj) {
  const out = [];
  const visit = (v) => {
    if (v == null) return;
    if (typeof v === 'string') {
      const s = v.trim();
      if (s) out.push(s);
    } else if (Array.isArray(v)) {
      v.forEach(visit);
    } else if (typeof v === 'object') {
      for (const k of Object.keys(v)) visit(v[k]);
    }
  };
  visit(obj);
  return out;
}

function extractMasterStepInfo(step) {
  const info = { titles: [], options: [], images: [], texts: [] };
  const sections = step?.sections || [];
  for (const sec of sections) {
    if (!sec) continue;
    const type = (sec.type || '').toLowerCase();
    const content = sec.content || {};
    // Titles / question text
    if (type.includes('title') || type.includes('heading')) {
      if (content.title) info.titles.push(String(content.title));
      if (content.text) info.titles.push(String(content.text));
    }
    if (content.questionText) info.titles.push(String(content.questionText));
    // Options
    const opts = content.options || content.itens || content.items || [];
    if (Array.isArray(opts)) {
      for (const opt of opts) {
        const id = opt?.id || opt?.value || opt?.key || null;
        const text = opt?.text || opt?.label || opt?.title || null;
        const image = opt?.image || opt?.img || null;
        info.options.push({ id, text });
        if (image) info.images.push(image);
      }
    }
    // All texts in section content
    info.texts.push(...listStrings(content));
  }
  // Unique-ify
  info.titles = Array.from(new Set(info.titles.filter(Boolean)));
  info.texts = Array.from(new Set(info.texts.filter(Boolean)));
  return info;
}

function extractBlocksInfo(blocksJson) {
  const info = { titles: [], options: [], images: [], texts: [], types: [] };
  if (!blocksJson) return info;
  const blocks = blocksJson.blocks || [];
  const visitBlock = (b) => {
    if (!b) return;
    info.types.push(b.type);
    const props = b.properties || b.config || {};
    if (props.title) info.titles.push(String(props.title));
    if (props.text) info.titles.push(String(props.text));
    if (props.questionText) info.titles.push(String(props.questionText));
    const opts = props.options || [];
    if (Array.isArray(opts)) {
      for (const opt of opts) {
        const id = opt?.id || opt?.value || opt?.key || null;
        const text = opt?.text || opt?.label || opt?.title || null;
        const image = opt?.image || opt?.img || null;
        info.options.push({ id, text });
        if (image) info.images.push(image);
      }
    }
    info.texts.push(...listStrings(props));
    const children = b.children || [];
    if (Array.isArray(children)) children.forEach(visitBlock);
  };
  blocks.forEach(visitBlock);
  info.titles = Array.from(new Set(info.titles.filter(Boolean)));
  info.texts = Array.from(new Set(info.texts.filter(Boolean)));
  info.types = Array.from(new Set(info.types.filter(Boolean)));
  return info;
}

function compareStep(masterStep, blocksJson, id) {
  const masterInfo = extractMasterStepInfo(masterStep);
  const blocksInfo = extractBlocksInfo(blocksJson);

  const masterOptionIds = new Set(masterInfo.options.map(o => o.id).filter(Boolean));
  const blocksOptionIds = new Set(blocksInfo.options.map(o => o.id).filter(Boolean));

  const missingInBlocks = Array.from(masterOptionIds).filter(x => !blocksOptionIds.has(x));
  const extraInBlocks = Array.from(blocksOptionIds).filter(x => !masterOptionIds.has(x));

  const result = {
    stepId: id,
    master: {
      titles: masterInfo.titles,
      optionCount: masterInfo.options.length,
      optionIds: Array.from(masterOptionIds),
    },
    blocks: {
      titles: blocksInfo.titles,
      types: blocksInfo.types,
      optionCount: blocksInfo.options.length,
      optionIds: Array.from(blocksOptionIds),
    },
    diffs: {
      optionIdsMissingInBlocks: missingInBlocks,
      optionIdsExtraInBlocks: extraInBlocks,
      optionCountEqual: masterInfo.options.length === blocksInfo.options.length,
      titlesOverlap: masterInfo.titles.some(t => blocksInfo.titles.includes(t)),
    },
    status: 'OK',
    notes: [],
  };

  if (blocksJson == null) {
    result.status = 'NO_BLOCKS_FILE';
    result.notes.push('Arquivo de blocos não encontrado');
  }

  if (missingInBlocks.length > 0) {
    result.status = 'MISMATCH';
    result.notes.push(`IDs de opção ausentes nos blocos: ${missingInBlocks.join(', ')}`);
  }
  if (extraInBlocks.length > 0) {
    result.status = 'MISMATCH';
    result.notes.push(`IDs de opção extras nos blocos: ${extraInBlocks.join(', ')}`);
  }
  if (!result.diffs.optionCountEqual) {
    result.status = 'MISMATCH';
    result.notes.push(`Contagem de opções difere (master=${masterInfo.options.length} vs blocks=${blocksInfo.options.length})`);
  }
  // Heurística simples de título
  if (masterInfo.titles.length && blocksInfo.titles.length) {
    const overlap = masterInfo.titles.filter(t => blocksInfo.titles.includes(t));
    if (overlap.length === 0) {
      result.notes.push('Títulos não coincidem exatamente (pode ser esperado)');
    }
  }

  return result;
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function main(){
  const master = readJSON(MASTER);
  if (!master) {
    console.error(`❌ Master não encontrado em ${MASTER}`);
    process.exit(1);
  }
  const steps = master.steps || {};
  const ids = Array.from({ length: 21 }, (_, i) => stepId(i+1));
  const report = [];
  let ok = 0, warn = 0, mismatch = 0, missing = 0;

  for (const id of ids) {
    const masterStep = steps[id];
    if (!masterStep) {
      report.push({ stepId: id, status: 'MISSING_IN_MASTER', notes: ['Step ausente no master'] });
      missing++;
      continue;
    }
    const blocksPath = path.join(BLOCKS_DIR, `${id}.json`);
    const blocksJson = readJSON(blocksPath);
    const cmp = compareStep(masterStep, blocksJson, id);
    report.push(cmp);
    if (cmp.status === 'OK') ok++;
    else if (cmp.status === 'MISMATCH') mismatch++;
    else if (cmp.status === 'NO_BLOCKS_FILE') warn++;
  }

  ensureDir(REPORTS_DIR);
  const outPath = path.join(REPORTS_DIR, 'compare-master-vs-blocks.json');
  fs.writeFileSync(outPath, JSON.stringify({ summary: { ok, warn, mismatch, missing }, report }, null, 2));

  console.log('\n===== Comparação Master vs Blocos =====');
  console.log(`OK: ${ok} | MISMATCH: ${mismatch} | WARN(no blocks): ${warn} | MISSING_IN_MASTER: ${missing}`);
  for (const r of report) {
    const tag = r.status === 'OK' ? '✅' : r.status === 'MISMATCH' ? '❌' : r.status === 'NO_BLOCKS_FILE' ? '⚠️' : '❗';
    const note = (r.notes && r.notes[0]) ? ` - ${r.notes[0]}` : '';
    console.log(`${tag} ${r.stepId}: ${r.status}${note}`);
  }
  console.log(`\n📄 Relatório salvo em ${outPath}`);
}

main();
