#!/usr/bin/env node
/**
 * 🎯 GERADOR DE STEPS PARA QUIZ21-COMPLETE.JSON
 * 
 * Uso:
 *   node scripts/step-generator.mjs add-question --number 22 --title "Nova Pergunta"
 *   node scripts/step-generator.mjs add-result --number 20 --title "Resultado Final"
 *   node scripts/step-generator.mjs reorder --from 5 --to 3
 *   node scripts/step-generator.mjs add-block --step 5 --type "question-progress" --position 0
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = join(__dirname, '../public/templates/quiz21-complete.json');

// ============================================================================
// TEMPLATES DE BLOCOS
// ============================================================================

const BLOCK_TEMPLATES = {
  'intro-form': {
    id: 'intro-form-block',
    type: 'intro-form',
    data: {
      title: 'Descubra Seu Estilo Pessoal',
      subtitle: 'Em apenas 2 minutos',
      placeholder: 'Digite seu primeiro nome',
      buttonText: 'Começar Agora',
      validation: { required: true, minLength: 2 }
    }
  },
  
  'question-title': {
    id: 'question-title',
    type: 'question-title',
    data: {
      text: 'Qual dessas opções combina mais com você?',
      style: { fontSize: '1.5rem', fontWeight: 600 }
    }
  },

  'question-multiple-choice': {
    id: 'question-multiple-choice',
    type: 'question-multiple-choice',
    data: {
      options: [
        { id: 'opt1', label: 'Opção 1', value: 'option1', points: 10 },
        { id: 'opt2', label: 'Opção 2', value: 'option2', points: 20 },
        { id: 'opt3', label: 'Opção 3', value: 'option3', points: 30 }
      ],
      allowMultiple: false,
      minSelections: 1,
      maxSelections: 1
    }
  },

  'question-progress': {
    id: 'progress-bar',
    type: 'question-progress',
    data: {
      showPercentage: true,
      showStepCount: true,
      style: { height: '8px', backgroundColor: '#e0e0e0' }
    }
  },

  'question-navigation': {
    id: 'navigation-buttons',
    type: 'question-navigation',
    data: {
      nextText: 'Próxima',
      backText: 'Voltar',
      showBack: true,
      style: { justifyContent: 'space-between' }
    }
  },

  'transition-loader': {
    id: 'transition-loader',
    type: 'transition-loader',
    data: {
      message: 'Analisando suas respostas...',
      duration: 2000,
      animation: 'spinner'
    }
  },

  'result-main': {
    id: 'result-main',
    type: 'result-main',
    data: {
      titleTemplate: 'Seu estilo é: {styleName}',
      descriptionTemplate: 'Parabéns {userName}! Você é {percentage}% {styleName}',
      style: { textAlign: 'center' }
    }
  },

  'result-cta': {
    id: 'result-cta',
    type: 'result-cta',
    data: {
      text: 'Baixe Seu Guia Completo',
      url: 'https://example.com/guia',
      style: { backgroundColor: '#4CAF50', color: 'white' }
    }
  },

  'result-share': {
    id: 'result-share',
    type: 'result-share',
    data: {
      title: 'Compartilhe seu resultado',
      platforms: ['facebook', 'twitter', 'whatsapp', 'linkedin']
    }
  },

  'result-progress-bars': {
    id: 'result-progress-bars',
    type: 'result-progress-bars',
    data: {
      bars: [
        { label: 'Criatividade', value: 85, color: '#FF6B6B' },
        { label: 'Lógica', value: 70, color: '#4ECDC4' },
        { label: 'Empatia', value: 95, color: '#FFD93D' }
      ]
    }
  }
};

// ============================================================================
// FUNÇÕES DE UTILIDADE
// ============================================================================

function loadTemplate() {
  const content = readFileSync(TEMPLATE_PATH, 'utf-8');
  return JSON.parse(content);
}

function saveTemplate(template) {
  const content = JSON.stringify(template, null, 2);
  writeFileSync(TEMPLATE_PATH, content, 'utf-8');
  console.log('✅ Template salvo em:', TEMPLATE_PATH);
}

function generateStepId(number) {
  return `step-${String(number).padStart(2, '0')}`;
}

function createQuestionStep(number, title, options = {}) {
  const stepId = generateStepId(number);
  const blocks = [
    { ...BLOCK_TEMPLATES['question-title'], id: `${stepId}-title`, data: { ...BLOCK_TEMPLATES['question-title'].data, text: title } },
    { ...BLOCK_TEMPLATES['question-multiple-choice'], id: `${stepId}-options` }
  ];

  if (options.showProgress !== false) {
    blocks.unshift({ ...BLOCK_TEMPLATES['question-progress'], id: `${stepId}-progress` });
  }

  if (options.showNavigation !== false) {
    blocks.push({ ...BLOCK_TEMPLATES['question-navigation'], id: `${stepId}-navigation` });
  }

  return {
    id: stepId,
    name: title,
    category: options.category || 'question',
    allowNext: true,
    allowPrevious: true,
    requiresValidation: false,
    blocks
  };
}

function createIntroStep(number, title, options = {}) {
  return {
    id: generateStepId(number),
    name: title,
    category: 'intro',
    allowNext: true,
    allowPrevious: false,
    requiresValidation: true,
    blocks: [
      { ...BLOCK_TEMPLATES['intro-form'], id: `step-${number}-intro-form` }
    ]
  };
}

function createTransitionStep(number, message) {
  return {
    id: generateStepId(number),
    name: 'Transição',
    category: 'transition',
    allowNext: false,
    allowPrevious: false,
    requiresValidation: false,
    blocks: [
      { ...BLOCK_TEMPLATES['transition-loader'], id: `step-${number}-loader`, data: { ...BLOCK_TEMPLATES['transition-loader'].data, message } }
    ]
  };
}

function createResultStep(number, title, options = {}) {
  const blocks = [
    { ...BLOCK_TEMPLATES['result-main'], id: `step-${number}-result-main` }
  ];

  if (options.showProgressBars !== false) {
    blocks.push({ ...BLOCK_TEMPLATES['result-progress-bars'], id: `step-${number}-progress-bars` });
  }

  if (options.showCTA !== false) {
    blocks.push({ ...BLOCK_TEMPLATES['result-cta'], id: `step-${number}-cta` });
  }

  if (options.showShare !== false) {
    blocks.push({ ...BLOCK_TEMPLATES['result-share'], id: `step-${number}-share` });
  }

  return {
    id: generateStepId(number),
    name: title,
    category: 'result',
    allowNext: true,
    allowPrevious: true,
    requiresValidation: false,
    blocks
  };
}

// ============================================================================
// COMANDOS
// ============================================================================

const commands = {
  'add-question': (args) => {
    const template = loadTemplate();
    const number = parseInt(args.number);
    const title = args.title || `Pergunta ${number}`;
    const category = args.strategic ? 'strategic' : 'question';
    
    const newStep = createQuestionStep(number, title, { 
      category,
      showProgress: args.progress !== 'false',
      showNavigation: args.navigation !== 'false'
    });
    
    template.steps.push(newStep);
    saveTemplate(template);
    console.log(`✅ Step ${newStep.id} adicionado:`, newStep.name);
  },

  'add-intro': (args) => {
    const template = loadTemplate();
    const number = parseInt(args.number || 1);
    const title = args.title || 'Introdução';
    
    const newStep = createIntroStep(number, title);
    template.steps.unshift(newStep);
    saveTemplate(template);
    console.log(`✅ Step ${newStep.id} adicionado:`, newStep.name);
  },

  'add-transition': (args) => {
    const template = loadTemplate();
    const number = parseInt(args.number);
    const message = args.message || 'Analisando suas respostas...';
    
    const newStep = createTransitionStep(number, message);
    const insertIndex = template.steps.findIndex(s => parseInt(s.id.split('-')[1]) > number);
    
    if (insertIndex === -1) {
      template.steps.push(newStep);
    } else {
      template.steps.splice(insertIndex, 0, newStep);
    }
    
    saveTemplate(template);
    console.log(`✅ Step ${newStep.id} adicionado`);
  },

  'add-result': (args) => {
    const template = loadTemplate();
    const number = parseInt(args.number);
    const title = args.title || 'Seu Resultado';
    
    const newStep = createResultStep(number, title, {
      showProgressBars: args['progress-bars'] !== 'false',
      showCTA: args.cta !== 'false',
      showShare: args.share !== 'false'
    });
    
    template.steps.push(newStep);
    saveTemplate(template);
    console.log(`✅ Step ${newStep.id} adicionado:`, newStep.name);
  },

  'add-block': (args) => {
    const template = loadTemplate();
    const stepId = generateStepId(parseInt(args.step));
    const blockType = args.type;
    const position = parseInt(args.position || -1);
    
    const step = template.steps.find(s => s.id === stepId);
    if (!step) {
      console.error(`❌ Step ${stepId} não encontrado`);
      return;
    }
    
    const blockTemplate = BLOCK_TEMPLATES[blockType];
    if (!blockTemplate) {
      console.error(`❌ Tipo de bloco "${blockType}" não existe`);
      console.log('Tipos disponíveis:', Object.keys(BLOCK_TEMPLATES).join(', '));
      return;
    }
    
    const newBlock = {
      ...blockTemplate,
      id: `${stepId}-${blockType}-${Date.now()}`
    };
    
    if (position === -1) {
      step.blocks.push(newBlock);
    } else {
      step.blocks.splice(position, 0, newBlock);
    }
    
    saveTemplate(template);
    console.log(`✅ Bloco ${blockType} adicionado ao step ${stepId}`);
  },

  'reorder': (args) => {
    const template = loadTemplate();
    const fromIndex = parseInt(args.from) - 1;
    const toIndex = parseInt(args.to) - 1;
    
    if (fromIndex < 0 || fromIndex >= template.steps.length) {
      console.error(`❌ Índice origem ${args.from} inválido`);
      return;
    }
    
    if (toIndex < 0 || toIndex >= template.steps.length) {
      console.error(`❌ Índice destino ${args.to} inválido`);
      return;
    }
    
    const [movedStep] = template.steps.splice(fromIndex, 1);
    template.steps.splice(toIndex, 0, movedStep);
    
    saveTemplate(template);
    console.log(`✅ Step ${movedStep.id} movido de posição ${args.from} para ${args.to}`);
  },

  'list': () => {
    const template = loadTemplate();
    console.log(`\n📋 Template: ${template.id} (${template.steps.length} steps)\n`);
    template.steps.forEach((step, index) => {
      console.log(`${index + 1}. ${step.id} - ${step.name} (${step.category})`);
      console.log(`   └─ ${step.blocks.length} blocos: ${step.blocks.map(b => b.type).join(', ')}`);
    });
  },

  'help': () => {
    console.log(`
🎯 GERADOR DE STEPS - QUIZ21-COMPLETE.JSON

COMANDOS DISPONÍVEIS:

  add-question --number N --title "Título" [--strategic] [--progress false] [--navigation false]
    Adiciona uma nova pergunta

  add-intro --number N --title "Título"
    Adiciona um step de introdução

  add-transition --number N --message "Mensagem"
    Adiciona um step de transição/loading

  add-result --number N --title "Título" [--progress-bars false] [--cta false] [--share false]
    Adiciona um step de resultado

  add-block --step N --type TIPO [--position POS]
    Adiciona um bloco a um step existente
    Tipos: ${Object.keys(BLOCK_TEMPLATES).join(', ')}

  reorder --from N --to M
    Reordena steps (move step da posição N para M)

  list
    Lista todos os steps do template

  help
    Mostra esta ajuda

EXEMPLOS:

  # Adicionar nova pergunta
  node scripts/step-generator.mjs add-question --number 22 --title "Qual seu hobby?"

  # Adicionar pergunta estratégica
  node scripts/step-generator.mjs add-question --number 13 --title "Estratégia" --strategic

  # Adicionar barra de progresso ao step 5
  node scripts/step-generator.mjs add-block --step 5 --type question-progress --position 0

  # Mover step 10 para posição 8
  node scripts/step-generator.mjs reorder --from 10 --to 8

  # Listar todos os steps
  node scripts/step-generator.mjs list
    `);
  }
};

// ============================================================================
// MAIN
// ============================================================================

const [,, command, ...rawArgs] = process.argv;

if (!command || command === 'help') {
  commands.help();
  process.exit(0);
}

// Parse arguments
const args = {};
for (let i = 0; i < rawArgs.length; i += 2) {
  const key = rawArgs[i].replace(/^--/, '');
  const value = rawArgs[i + 1];
  args[key] = value;
}

const handler = commands[command];
if (!handler) {
  console.error(`❌ Comando "${command}" não encontrado`);
  commands.help();
  process.exit(1);
}

try {
  handler(args);
} catch (error) {
  console.error('❌ Erro ao executar comando:', error.message);
  process.exit(1);
}
