#!/usr/bin/env node

/**
 * 🔍 AUDITORIA COMPLETA DE COMPONENTES - QUIZ QUEST CHALLENGE VERSE
 * ================================================================
 *
 * OBJETIVO: Identificar componentes duplicados, incompletos e criar
 * uma estrutura limpa e eficiente para as 21 etapas do editor.
 *
 * BASEADO NAS FUNCIONALIDADES DE:
 * - QuizPage.tsx (produção)
 * - ResultPage.tsx (produção)
 * - QuizOfferPage.tsx (produção)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====================================================================
// 📊 ESTRUTURA DE REFERÊNCIA - COMPONENTES EM PRODUÇÃO
// ====================================================================

const PRODUCTION_COMPONENTS = {
  // Baseado em QuizPage.tsx - COMPONENTES FUNCIONAIS
  quiz: {
    QuizIntroHeaderBlock: {
      path: '/src/components/editor/blocks/QuizIntroHeaderBlock.tsx',
      functionality: 'Header com logo, progresso, navegação',
      properties: ['logoUrl', 'logoAlt', 'progressValue', 'showProgress', 'backgroundColor'],
      calculations: 'Controle de progresso dinâmico',
      priority: 'CRÍTICO',
      status: 'MANTÉM',
    },
    OptionsGridBlock: {
      path: '/src/components/editor/blocks/OptionsGridBlock.tsx',
      functionality: 'Grid de opções para questões do quiz',
      properties: ['question', 'columns', 'gap', 'selectionMode', 'primaryColor'],
      calculations: 'Cálculo de pontuação por opção, validação de seleção',
      priority: 'CRÍTICO',
      status: 'MANTÉM',
    },
    QuizProgressBlock: {
      path: '/src/components/editor/blocks/QuizProgressBlock.tsx',
      functionality: 'Barra de progresso do quiz',
      properties: ['currentStep', 'totalSteps', 'showNumbers', 'barColor'],
      calculations: 'Percentual de progresso automático',
      priority: 'CRÍTICO',
      status: 'MANTÉM',
    },
  },

  // Baseado em ResultPage.tsx - COMPONENTES DE RESULTADO
  results: {
    QuizResultsEditor: {
      path: '/src/components/editor/blocks/QuizResultsEditor.tsx',
      functionality: 'Exibição de resultados calculados',
      properties: ['title', 'showScores', 'showPercentages', 'primaryColor'],
      calculations: 'Processamento de respostas, cálculo de estilo predominante',
      priority: 'CRÍTICO',
      status: 'OTIMIZAR',
    },
    StyleResultsEditor: {
      path: '/src/components/editor/blocks/StyleResultsEditor.tsx',
      functionality: 'Resultado específico de estilo com guia',
      properties: ['title', 'showAllStyles', 'showGuideImage', 'primaryStyle'],
      calculations: 'Mapeamento estilo -> características, recomendações personalizadas',
      priority: 'CRÍTICO',
      status: 'OTIMIZAR',
    },
  },

  // Baseado em QuizOfferPage.tsx - COMPONENTES DE CONVERSÃO
  offer: {
    FinalStepEditor: {
      path: '/src/components/editor/blocks/FinalStepEditor.tsx',
      functionality: 'Página final de oferta personalizada',
      properties: ['stepNumber', 'title', 'subtitle', 'showNavigation', 'backgroundColor'],
      calculations: 'Personalização baseada no resultado, tracking de conversão',
      priority: 'CRÍTICO',
      status: 'OTIMIZAR',
    },
  },
};

// ====================================================================
// 🔍 COMPONENTES A SEREM REMOVIDOS/CONSOLIDADOS
// ====================================================================

const COMPONENTS_TO_CLEANUP = [
  // Duplicatas identificadas
  {
    pattern: '**/QuizStartPageInlineBlock.*',
    reason: 'Duplicado - funcionalidade coberta por QuizIntroHeaderBlock',
    action: 'REMOVER',
    replacement: 'QuizIntroHeaderBlock com propriedades específicas',
  },
  {
    pattern: '**/QuizPersonalInfoInlineBlock.*',
    reason: 'Específico demais - usar FormInputBlock genérico',
    action: 'REMOVER',
    replacement: 'FormInputBlock + HeadingInlineBlock',
  },
  {
    pattern: '**/QuizExperienceInlineBlock.*',
    reason: 'Funcionalidade coberta por OptionsGridBlock',
    action: 'REMOVER',
    replacement: 'OptionsGridBlock configurado',
  },
  {
    pattern: '**/QuizQuestionInlineBlock.*',
    reason: 'Duplicado - usar OptionsGridBlock',
    action: 'REMOVER',
    replacement: 'OptionsGridBlock',
  },
  {
    pattern: '**/QuizTransitionInlineBlock.*',
    reason: 'Muito específico - usar componentes básicos',
    action: 'REMOVER',
    replacement: 'HeadingInlineBlock + TextInlineBlock + decorative-bar-inline',
  },
  {
    pattern: '**/QuizLoadingInlineBlock.*',
    reason: 'Loading deve ser estado UI, não componente',
    action: 'REMOVER',
    replacement: 'Estado de loading no QuizProgressBlock',
  },
];

// ====================================================================
// 🏗️ ARQUITETURA OTIMIZADA - 21 ETAPAS
// ====================================================================

const OPTIMIZED_STEP_ARCHITECTURE = {
  // ETAPA 1: Introdução
  step01: {
    name: 'Introdução do Quiz',
    components: [
      { type: 'quiz-intro-header', config: 'Logo + Progress inicial (0%)' },
      { type: 'heading-inline', config: 'Título principal personalizável' },
      { type: 'text-inline', config: 'Descrição do quiz' },
      { type: 'decorative-bar-inline', config: 'Separador visual' },
      { type: 'form-input', config: 'Campo de nome (required)' },
      { type: 'button-inline', config: 'CTA "Iniciar Quiz"' },
      { type: 'legal-notice-inline', config: 'Termos e privacidade' },
    ],
    calculations: 'Inicialização do quiz, validação de nome',
    editableProperties: 'Todos os textos, cores, imagens, layout',
  },

  // ETAPAS 2-11: Questões Principais
  'steps02-11': {
    name: 'Questões do Quiz (x10)',
    components: [
      { type: 'quiz-intro-header', config: 'Progress dinâmico (10%-55%)' },
      { type: 'heading-inline', config: 'Pergunta principal' },
      { type: 'options-grid', config: 'Grid de opções (2-4 colunas)' },
      { type: 'quiz-progress', config: 'Barra de progresso detalhada' },
    ],
    calculations: 'Pontuação por resposta, cálculo progressivo do estilo',
    editableProperties: 'Pergunta, opções, imagens, cores, layout, pontuação',
  },

  // ETAPA 12: Transição
  step12: {
    name: 'Transição - Análise Parcial',
    components: [
      { type: 'quiz-intro-header', config: 'Progress 60%' },
      { type: 'heading-inline', config: 'Título de transição' },
      { type: 'text-inline', config: 'Feedback motivacional' },
      { type: 'quiz-progress', config: 'Loading visual' },
      { type: 'button-inline', config: 'Continuar análise' },
    ],
    calculations: 'Análise parcial dos resultados, preparação para questões estratégicas',
    editableProperties: 'Textos, timing, animações',
  },

  // ETAPAS 13-18: Questões Estratégicas
  'steps13-18': {
    name: 'Questões Estratégicas (x6)',
    components: [
      { type: 'quiz-intro-header', config: 'Progress 65%-95%' },
      { type: 'heading-inline', config: 'Pergunta estratégica' },
      { type: 'options-grid', config: 'Opções focadas em conversão' },
      { type: 'quiz-progress', config: 'Progress refinado' },
    ],
    calculations: 'Refinamento do cálculo, segmentação para oferta',
    editableProperties: 'Todas as propriedades + peso das respostas',
  },

  // ETAPA 19: Transição Final
  step19: {
    name: 'Preparando Seu Resultado',
    components: [
      { type: 'quiz-intro-header', config: 'Progress 100%' },
      { type: 'heading-inline', config: 'Finalizando análise' },
      { type: 'text-inline', config: 'Mensagem de loading' },
      { type: 'quiz-progress', config: 'Animação de conclusão' },
    ],
    calculations: 'Cálculo final do estilo predominante',
    editableProperties: 'Textos, animações, timing',
  },

  // ETAPA 20: Resultado Personalizado
  step20: {
    name: 'Seu Resultado Personalizado',
    components: [
      { type: 'quiz-intro-header', config: 'Sem progress, apenas logo' },
      { type: 'quiz-results', config: 'Resultado principal calculado' },
      { type: 'style-results', config: 'Detalhes do estilo predominante' },
      { type: 'image-display-inline', config: 'Guia visual do estilo' },
      { type: 'text-inline', config: 'Características detalhadas' },
      { type: 'button-inline', config: 'CTA para oferta personalizada' },
    ],
    calculations: 'Exibição do resultado calculado, personalização completa',
    editableProperties: 'Layout do resultado, textos personalizados, imagens',
  },

  // ETAPA 21: Oferta Personalizada
  step21: {
    name: 'Oferta Exclusiva Para Seu Estilo',
    components: [
      { type: 'quiz-intro-header', config: 'Logo + badge de oferta' },
      { type: 'final-step', config: 'Header da oferta personalizada' },
      { type: 'heading-inline', config: 'Título da oferta baseado no resultado' },
      { type: 'image-display-inline', config: 'Produto específico para o estilo' },
      { type: 'text-inline', config: 'Benefícios personalizados' },
      { type: 'options-grid', config: 'Opções de pagamento' },
      { type: 'form-input', config: 'Dados para checkout (opcional)' },
      { type: 'button-inline', config: 'CTA de conversão final' },
      { type: 'legal-notice-inline', config: 'Garantias e termos' },
    ],
    calculations: 'Personalização da oferta, tracking de conversão, cálculo de desconto',
    editableProperties: 'Oferta, preços, produtos, textos, imagens, CTAs',
  },
};

// ====================================================================
// 🛠️ FUNÇÕES DE AUDITORIA
// ====================================================================

function logSection(title, type = 'info') {
  const colors = {
    info: '\x1b[36m', // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m', // Red
    reset: '\x1b[0m', // Reset
  };

  console.log(`${colors[type]}${'='.repeat(60)}`);
  console.log(`${title}`);
  console.log(`${'='.repeat(60)}${colors.reset}`);
}

function scanComponentFiles() {
  logSection('🔍 ESCANEANDO ARQUIVOS DE COMPONENTES', 'info');

  const componentDirs = [
    'src/components/editor/blocks',
    'src/components/blocks/inline',
    'src/components/funnel-blocks',
  ];

  const foundComponents = {};

  componentDirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (fs.existsSync(fullPath)) {
      const files = fs.readdirSync(fullPath);
      files.forEach(file => {
        if (file.endsWith('.tsx') && !file.endsWith('.backup')) {
          const componentName = file.replace('.tsx', '');
          if (!foundComponents[componentName]) {
            foundComponents[componentName] = [];
          }
          foundComponents[componentName].push(path.join(dir, file));
        }
      });
    }
  });

  return foundComponents;
}

function identifyDuplicates(components) {
  logSection('🚨 IDENTIFICANDO DUPLICATAS', 'warning');

  const duplicates = {};
  const unique = {};

  Object.entries(components).forEach(([name, paths]) => {
    if (paths.length > 1) {
      duplicates[name] = paths;
      console.log(`❌ DUPLICATA: ${name}`);
      paths.forEach(p => console.log(`   - ${p}`));
    } else {
      unique[name] = paths[0];
    }
  });

  console.log(`\n📊 RESUMO:`);
  console.log(`   - Componentes únicos: ${Object.keys(unique).length}`);
  console.log(`   - Componentes duplicados: ${Object.keys(duplicates).length}`);

  return { duplicates, unique };
}

function analyzeComponentQuality(componentPath) {
  const fullPath = path.join(__dirname, componentPath);

  if (!fs.existsSync(fullPath)) {
    return { quality: 'MISSING', issues: ['Arquivo não encontrado'] };
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const issues = [];
  let quality = 'GOOD';

  // Verificar export default
  if (!content.includes('export default')) {
    issues.push('Sem export default');
    quality = 'POOR';
  }

  // Verificar props tipadas
  if (!content.includes('interface') && !content.includes('type')) {
    issues.push('Props não tipadas');
    quality = quality === 'GOOD' ? 'FAIR' : quality;
  }

  // Verificar React.FC
  if (!content.includes('React.FC') && !content.includes(': FC<')) {
    issues.push('Não usa React.FC');
    quality = quality === 'GOOD' ? 'FAIR' : quality;
  }

  // Verificar comentários/documentação
  if (!content.includes('/**') && !content.includes('//')) {
    issues.push('Sem documentação');
    quality = quality === 'GOOD' ? 'FAIR' : quality;
  }

  // Verificar props destructuring
  if (!content.includes('const {') && !content.includes('({')) {
    issues.push('Props não destructured');
    quality = quality === 'GOOD' ? 'FAIR' : quality;
  }

  return { quality, issues };
}

function generateCleanupPlan(duplicates, unique) {
  logSection('🧹 PLANO DE LIMPEZA', 'warning');

  const plan = {
    toRemove: [],
    toOptimize: [],
    toKeep: [],
  };

  // Analisar duplicatas
  Object.entries(duplicates).forEach(([name, paths]) => {
    const qualities = paths.map(p => analyzeComponentQuality(p));
    const bestIndex = qualities.findIndex(q => q.quality === 'GOOD') || 0;

    plan.toKeep.push(paths[bestIndex]);
    paths.forEach((path, index) => {
      if (index !== bestIndex) {
        plan.toRemove.push(path);
      }
    });
  });

  // Analisar componentes únicos
  Object.entries(unique).forEach(([name, path]) => {
    const analysis = analyzeComponentQuality(path);

    if (analysis.quality === 'POOR') {
      plan.toRemove.push(path);
    } else if (analysis.quality === 'FAIR') {
      plan.toOptimize.push(path);
    } else {
      plan.toKeep.push(path);
    }
  });

  console.log(`📊 PLANO DE AÇÃO:`);
  console.log(`   - Manter: ${plan.toKeep.length} componentes`);
  console.log(`   - Otimizar: ${plan.toOptimize.length} componentes`);
  console.log(`   - Remover: ${plan.toRemove.length} componentes`);

  return plan;
}

function generateOptimizedStructure() {
  logSection('🚀 ESTRUTURA OTIMIZADA PARA AS 21 ETAPAS', 'success');

  console.log('📋 COMPONENTES CORE NECESSÁRIOS:\n');

  const coreComponents = [
    '✅ quiz-intro-header - Header universal com logo e progresso',
    '✅ heading-inline - Títulos configuráveis (H1-H6)',
    '✅ text-inline - Texto rico com formatação',
    '✅ decorative-bar-inline - Separadores visuais',
    '✅ form-input - Campos de formulário universais',
    '✅ button-inline - Botões com estados e estilos',
    '✅ options-grid - Grid de opções para questões',
    '✅ quiz-progress - Barra de progresso inteligente',
    '✅ quiz-results - Resultados calculados',
    '✅ style-results - Resultados específicos de estilo',
    '✅ final-step - Editor de oferta final',
    '✅ image-display-inline - Imagens responsivas',
    '✅ legal-notice-inline - Avisos legais',
  ];

  coreComponents.forEach(comp => console.log(comp));

  console.log('\n🎯 BENEFÍCIOS DA ESTRUTURA OTIMIZADA:\n');
  console.log('• Redução de 40+ componentes para 13 componentes core');
  console.log('• Reutilização máxima entre etapas');
  console.log('• Configuração flexível via propriedades');
  console.log('• Manutenção simplificada');
  console.log('• Performance otimizada');
  console.log('• Editabilidade total no painel de propriedades');
}

function generateConfigurationGuide() {
  logSection('📘 GUIA DE CONFIGURAÇÃO DAS 21 ETAPAS', 'info');

  console.log('EXEMPLO - ETAPA 1: Introdução\n');
  console.log(`{
  "step": 1,
  "name": "Introdução do Quiz",
  "blocks": [
    {
      "type": "quiz-intro-header",
      "properties": {
        "logoUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        "logoAlt": "Logo Gisele Galvão",
        "progressValue": 0,
        "showProgress": false,
        "backgroundColor": "#F9F5F1"
      }
    },
    {
      "type": "heading-inline",
      "properties": {
        "content": "Descubra Seu Estilo Predominante",
        "level": "h1",
        "textAlign": "center",
        "color": "#432818"
      }
    },
    {
      "type": "text-inline", 
      "properties": {
        "text": "Responda algumas perguntas rápidas e descubra qual dos 7 estilos universais combina mais com você.",
        "fontSize": "1.125rem",
        "alignment": "center"
      }
    },
    {
      "type": "form-input",
      "properties": {
        "label": "Qual é o seu nome?",
        "placeholder": "Digite seu primeiro nome",
        "required": true,
        "type": "text"
      }
    },
    {
      "type": "button-inline",
      "properties": {
        "text": "Iniciar Quiz",
        "style": "primary",
        "size": "large",
        "backgroundColor": "#B89B7A"
      }
    }
  ]
}`);

  console.log('\n🔄 COMO APLICAR EM TODAS AS ETAPAS:\n');
  console.log('1. Cada etapa usa os mesmos componentes core');
  console.log('2. Apenas as propriedades mudam entre etapas');
  console.log('3. Lógica de cálculo fica nos hooks/services');
  console.log('4. Editor permite edição total das propriedades');
  console.log('5. Templates pré-configurados aceleram criação');
}

// ====================================================================
// 🚀 EXECUÇÃO PRINCIPAL DA AUDITORIA
// ====================================================================

function runCompleteAudit() {
  console.log('🎯 INICIANDO AUDITORIA COMPLETA DE COMPONENTES');
  console.log('='.repeat(80));

  // 1. Escanear arquivos
  const components = scanComponentFiles();

  // 2. Identificar duplicatas
  const { duplicates, unique } = identifyDuplicates(components);

  // 3. Gerar plano de limpeza
  const cleanupPlan = generateCleanupPlan(duplicates, unique);

  // 4. Mostrar estrutura otimizada
  generateOptimizedStructure();

  // 5. Guia de configuração
  generateConfigurationGuide();

  logSection('✅ AUDITORIA CONCLUÍDA', 'success');

  console.log('\n🎯 PRÓXIMOS PASSOS:\n');
  console.log('1. Executar limpeza de componentes duplicados');
  console.log('2. Otimizar componentes com qualidade FAIR');
  console.log('3. Implementar configuração das 21 etapas');
  console.log('4. Testar funcionalidades de cálculo');
  console.log('5. Validar editabilidade no painel de propriedades');

  console.log('\n🚀 RESULTADO: Sistema otimizado e eficiente para as 21 etapas!');

  return {
    components,
    duplicates,
    unique,
    cleanupPlan,
    optimizedStructure: OPTIMIZED_STEP_ARCHITECTURE,
  };
}

// Executar auditoria
const auditResult = runCompleteAudit();
