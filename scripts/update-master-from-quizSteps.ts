import fs from 'fs';
import path from 'path';
import { QUIZ_STEPS, type QuizStep } from '../src/data/quizSteps';

type Master = any;

const ROOT = '/workspaces/quiz-flow-pro-verso-03342';
const MASTER_PATH = path.join(ROOT, 'public/templates/quiz21-complete.json');

function loadMaster(): Master | null {
  try {
    const s = fs.readFileSync(MASTER_PATH, 'utf8');
    return JSON.parse(s);
  } catch (e) {
    console.error('Erro ao carregar master JSON:', e);
    return null;
  }
}

function saveMaster(master: Master) {
  const s = JSON.stringify(master, null, 2);
  fs.writeFileSync(MASTER_PATH, s, 'utf8');
}

function findSection(stepObj: any, type: string) {
  const arr = Array.isArray(stepObj?.sections) ? stepObj.sections : [];
  // aceitar ambos padrões para o grid
  if (type === 'options-grid') {
    return arr.find((s: any) => s?.type === 'options grid' || s?.type === 'options-grid');
  }
  return arr.find((s: any) => s?.type === type);
}

function ensureSection(stepObj: any, type: string, id: string, index?: number) {
  if (!Array.isArray(stepObj.sections)) stepObj.sections = [];
  const found = stepObj.sections.find((s: any) => s?.type === type);
  if (found) return found;
  const section = { type, id, content: {}, style: {}, animation: { type: 'fade', duration: 300, delay: 0, easing: 'ease-out' } };
  if (typeof index === 'number' && index >= 0 && index <= stepObj.sections.length) {
    stepObj.sections.splice(index, 0, section);
  } else {
    stepObj.sections.push(section);
  }
  return section;
}

function mapOptionsFromQuiz(step: QuizStep) {
  const opts = Array.isArray(step.options) ? step.options : [];
  return opts.map((o, idx) => ({
    id: o.id ?? `opt-${idx + 1}`,
    text: o.text,
    imageUrl: (o as any).image ? (o as any).image : undefined,
    value: o.id ?? `opt-${idx + 1}`,
  }));
}

function updateIntro(stepId: string, masterStep: any, step: QuizStep) {
  const hero = findSection(masterStep, 'intro-hero');
  const form = findSection(masterStep, 'welcome-form');
  if (hero) {
    hero.content = hero.content || {};
    if (step.title) hero.content.title = step.title;
    // Opcional: alinhar imagem com ModularIntroStep default
    if ((step as any).image) hero.content.imageUrl = (step as any).image;
    // Descrição alinhada ao ModularIntroStep
    const modularDescription = 'Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.';
    hero.content.description = modularDescription;
  }
  if (form) {
    form.content = form.content || {};
    if (step.formQuestion) form.content.questionText = step.formQuestion;
    if (step.placeholder) form.content.namePlaceholder = step.placeholder;
    if (step.buttonText) form.content.submitText = step.buttonText;
  }
}

function updateQuestionLike(stepId: string, masterStep: any, step: QuizStep) {
  const hero = findSection(masterStep, 'question-hero');
  const grid = findSection(masterStep, 'options-grid');
  // Novo: forçar uma section "question-title" separada do grid
  const titleSec = ensureSection(masterStep, 'question-title', `${stepId}-question-title`, 0);
  titleSec.content = titleSec.content || {};
  if (step.questionText) titleSec.content.text = step.questionText;
  titleSec.style = titleSec.style || { textAlign: 'center' };
  // Garantir hero após título (se existir hero)
  if (hero) {
    hero.content = hero.content || {};
    if (step.questionText) hero.content.questionText = step.questionText;
    if (step.questionNumber) hero.content.questionNumber = step.questionNumber;
  }
  if (grid) {
    grid.content = grid.content || {};
    const required = step.requiredSelections;
    if (typeof required === 'number') {
      grid.content.multipleSelection = required > 1;
      grid.content.minSelections = required;
      grid.content.maxSelections = required;
    } else if (step.type === 'strategic-question') {
      grid.content.multipleSelection = false;
      grid.content.minSelections = 1;
      grid.content.maxSelections = 1;
    }
    const mapped = mapOptionsFromQuiz(step);
    if (mapped.length) {
      grid.content.options = mapped;
    }
  }

  // Novo: CTAButton "Avançar"/"Continuar" abaixo das opções quando não houver
  const hasCTA = (masterStep.sections || []).some((s: any) => s?.type === 'CTAButton');
  if (!hasCTA) {
    const cta = ensureSection(masterStep, 'CTAButton', `${stepId}-cta-next`);
    cta.content = cta.content || {};
    cta.content.label = step.type === 'strategic-question' ? 'Continuar' : 'Avançar';
    cta.content.href = '#next';
    cta.content.variant = 'primary';
    cta.content.size = 'large';
  }
}

function updateTransition(stepId: string, masterStep: any, step: QuizStep) {
  const hero = findSection(masterStep, 'transition-hero');
  if (hero) {
    hero.content = hero.content || {};
    if (step.title) hero.content.title = step.title;
    if (step.text) {
      if (hero.content.subtitle === undefined) hero.content.subtitle = step.text;
      else hero.content.description = step.text;
    }
    if (typeof step.duration === 'number') {
      hero.content.autoAdvanceDelay = step.duration;
    }
  }
  // Novo: tornar mais modular adicionando descrição e CTA explícitos
  const maybeText = ensureSection(masterStep, 'text-inline', `${stepId}-transition-text`, 1);
  if (step.text) {
    maybeText.content = maybeText.content || {};
    maybeText.content.text = step.text;
  }
  const maybeCTA = ensureSection(masterStep, 'CTAButton', `${stepId}-transition-cta`, 2);
  maybeCTA.content = maybeCTA.content || {};
  // Para transições, manter CTA opcional: mostrar "Continuar" se showContinueButton
  if (step.showContinueButton) {
    maybeCTA.content.label = step.continueButtonText || 'Continuar';
    maybeCTA.content.href = '#next';
    maybeCTA.content.variant = 'primary';
    maybeCTA.content.size = 'medium';
  } else {
    // Se não há botão, deixar como secundário/desabilitado semanticamente
    maybeCTA.content.label = '...';
    maybeCTA.content.variant = 'outline';
    maybeCTA.content.size = 'small';
  }
  // navigation
  masterStep.navigation = masterStep.navigation || {};
  if (typeof step.duration === 'number') {
    masterStep.navigation.autoAdvance = true;
    masterStep.navigation.autoAdvanceDelay = step.duration;
  }
}

function main() {
  const master = loadMaster();
  if (!master) process.exit(1);
  const steps = master.steps || {};

  for (const [stepId, step] of Object.entries(QUIZ_STEPS)) {
    const masterStep = steps[stepId];
    if (!masterStep) continue;

    // Sincronizar tipo e navegação básica
    (masterStep as any).type = step.type;
    masterStep.navigation = masterStep.navigation || {};
    if (step.nextStep) masterStep.navigation.nextStep = step.nextStep;

    switch (step.type) {
      case 'intro':
        updateIntro(stepId, masterStep, step);
        break;
      case 'question':
      case 'strategic-question':
        updateQuestionLike(stepId, masterStep, step);
        break;
      case 'transition':
      case 'transition-result':
        updateTransition(stepId, masterStep, step);
        break;
      case 'result':
      case 'offer':
      default:
        // Sem alterações diretas no master para resultado/oferta
        break;
    }
  }

  // Atualizar metadados
  master.metadata = master.metadata || {};
  master.metadata.updatedAt = new Date().toISOString();
  master.metadata.consolidated = true;

  saveMaster(master);
  console.log('✅ Master JSON atualizado com base no QUIZ_STEPS');
}

main();
