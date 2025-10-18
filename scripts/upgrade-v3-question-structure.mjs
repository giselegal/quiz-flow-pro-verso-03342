#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = '/workspaces/quiz-flow-pro-verso-03342';
const V3_DIR = path.join(ROOT, 'public/templates');

function listStepFiles() {
  const entries = fs.readdirSync(V3_DIR).filter(f => /^step-\d{2}-v3\.json$/.test(f));
  return entries.map(f => path.join(V3_DIR, f)).sort();
}

function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8');
}

function ensureArray(arr) { return Array.isArray(arr) ? arr : []; }

function hasType(sections, type) { return sections.some(s => s?.type === type); }

function insertSection(sections, section, index) {
  if (typeof index === 'number' && index >= 0 && index <= sections.length) {
    sections.splice(index, 0, section);
  } else {
    sections.push(section);
  }
}

function upgradeQuestionStep(json, stepId) {
  const sections = ensureArray(json.sections);
  if (!sections.length) return false;
  let changed = false;

  // 1) question-title (separado do grid)
  if (!hasType(sections, 'question-title')) {
    const hero = sections.find(s => s?.type === 'question-hero');
    const text = hero?.content?.questionText || json?.metadata?.name || '';
    const title = {
      type: 'question-title',
      id: `${stepId}-question-title`,
      content: { text },
      style: { textAlign: 'center', marginBottom: 12 },
      animation: { type: 'fade', duration: 250, delay: 0, easing: 'ease-out' }
    };
    insertSection(sections, title, 0);
    changed = true;
  }

  // 2) CTAButton abaixo das opções
  if (!hasType(sections, 'CTAButton')) {
    const cta = {
      type: 'CTAButton',
      id: `${stepId}-cta-next`,
      content: { label: 'Avançar', href: '#next', variant: 'primary', size: 'large' },
      style: { marginTop: 16, textAlign: 'center' },
      animation: { type: 'fade', duration: 250, delay: 50, easing: 'ease-out' }
    };
    insertSection(sections, cta);
    changed = true;
  }

  if (changed) json.sections = sections;
  return changed;
}

function upgradeTransitionStep(json, stepId) {
  const sections = ensureArray(json.sections);
  let changed = false;
  // Inserir text-inline e CTAButton para modularizar
  if (!hasType(sections, 'text-inline')) {
    const textSec = {
      type: 'text-inline',
      id: `${stepId}-transition-text`,
      content: { text: json?.metadata?.description || 'Continuando sua experiência...' },
      style: { textAlign: 'center', marginTop: 8 },
      animation: { type: 'fade', duration: 250, delay: 0, easing: 'ease-out' }
    };
    insertSection(sections, textSec, 1);
    changed = true;
  }
  if (!hasType(sections, 'CTAButton')) {
    const cta = {
      type: 'CTAButton',
      id: `${stepId}-transition-cta`,
      content: { label: 'Continuar', href: '#next', variant: 'primary', size: 'medium' },
      style: { textAlign: 'center', marginTop: 12 },
      animation: { type: 'fade', duration: 250, delay: 50, easing: 'ease-out' }
    };
    insertSection(sections, cta, 2);
    changed = true;
  }
  if (changed) json.sections = sections;
  return changed;
}

const files = listStepFiles();
let updated = 0;
for (const file of files) {
  const json = readJson(file);
  if (!json) continue;
  const match = path.basename(file).match(/(step-\d{2})-v3\.json/);
  const stepId = match ? match[1] : 'step-xx';

  const isTransition = json?.metadata?.category === 'transition' || json?.sections?.some?.((s) => s?.type === 'transition-hero');
  const isQuestion = json?.metadata?.category === 'quiz-question' || json?.sections?.some?.((s) => s?.type === 'options-grid');

  let changed = false;
  if (isQuestion) changed = upgradeQuestionStep(json, stepId) || changed;
  if ((stepId === 'step-12' || stepId === 'step-19') || isTransition) {
    changed = upgradeTransitionStep(json, stepId) || changed;
  }
  if (changed) {
    writeJson(file, json);
    updated++;
    console.log(`✅ Atualizado ${path.basename(file)}`);
  }
}

console.log(`Done. Updated ${updated} of ${files.length} files.`);
