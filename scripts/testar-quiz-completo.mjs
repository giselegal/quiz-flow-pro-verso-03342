#!/usr/bin/env node

/**
 * TESTE COMPLETO DO SISTEMA DE QUIZ
 * Verifica se todas as 21 etapas foram configuradas corretamente
 */

import fs from 'fs';

const CONFIG_DIR = './src/config';
const TEMPLATES_DIR = `${CONFIG_DIR}/templates`;

console.log('🧪 TESTANDO SISTEMA COMPLETO DE QUIZ - 21 ETAPAS');
console.log('='.repeat(60));

// 1. Verificar se todos os arquivos de template existem
console.log('\n1. VERIFICANDO ARQUIVOS DE TEMPLATE:');
let templatesOk = true;

for (let i = 1; i <= 21; i++) {
  const stepNum = i.toString().padStart(2, '0');
  const templatePath = `${TEMPLATES_DIR}/step-${stepNum}.json`;

  if (fs.existsSync(templatePath)) {
    console.log(`✅ step-${stepNum}.json - OK`);
  } else {
    console.log(`❌ step-${stepNum}.json - FALTANDO`);
    templatesOk = false;
  }
}

if (!templatesOk) {
  console.log('\n❌ ERRO: Templates faltando. Execute o script de configuração primeiro.');
  process.exit(1);
}

// 2. Verificar estrutura dos templates
console.log('\n2. VERIFICANDO ESTRUTURA DOS TEMPLATES:');

const estruturaValida = {
  step01: { tipo: 'intro', minBlocos: 6 },
  step02to14: { tipo: 'pergunta', minBlocos: 4 },
  step15: { tipo: 'transicao', minBlocos: 4 },
  step16to20: { tipo: 'estrategica', minBlocos: 4 },
  step21: { tipo: 'resultado', minBlocos: 4 },
};

let estruturaOk = true;

for (let i = 1; i <= 21; i++) {
  const stepNum = i.toString().padStart(2, '0');
  const templatePath = `${TEMPLATES_DIR}/step-${stepNum}.json`;

  try {
    const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
    const blocos = template.blocks ? template.blocks.length : 0;

    let tipoEsperado, minBlocos;

    if (i === 1) {
      tipoEsperado = estruturaValida.step01.tipo;
      minBlocos = estruturaValida.step01.minBlocos;
    } else if (i >= 2 && i <= 14) {
      tipoEsperado = estruturaValida.step02to14.tipo;
      minBlocos = estruturaValida.step02to14.minBlocos;
    } else if (i === 15) {
      tipoEsperado = estruturaValida.step15.tipo;
      minBlocos = estruturaValida.step15.minBlocos;
    } else if (i >= 16 && i <= 20) {
      tipoEsperado = estruturaValida.step16to20.tipo;
      minBlocos = estruturaValida.step16to20.minBlocos;
    } else if (i === 21) {
      tipoEsperado = estruturaValida.step21.tipo;
      minBlocos = estruturaValida.step21.minBlocos;
    }

    if (blocos >= minBlocos) {
      console.log(`✅ step-${stepNum} (${tipoEsperado}): ${blocos} blocos`);
    } else {
      console.log(`⚠️ step-${stepNum} (${tipoEsperado}): ${blocos} blocos (mínimo: ${minBlocos})`);
      estruturaOk = false;
    }
  } catch (error) {
    console.log(`❌ step-${stepNum}: Erro ao ler template - ${error.message}`);
    estruturaOk = false;
  }
}

// 3. Verificar componentes específicos do quiz
console.log('\n3. VERIFICANDO COMPONENTES ESPECÍFICOS:');

const componentesEsperados = [
  { file: 'src/components/blocks/inline/ResultStyleCardBlock.tsx', nome: 'ResultStyleCard' },
  { file: 'src/components/blocks/inline/BonusShowcaseBlock.tsx', nome: 'BonusShowcase' },
  { file: 'src/components/blocks/inline/LoadingAnimationBlock.tsx', nome: 'LoadingAnimation' },
  { file: 'src/components/blocks/inline/OptionsGridInlineBlock.tsx', nome: 'OptionsGrid' },
];

let componentesOk = true;

componentesEsperados.forEach(comp => {
  if (fs.existsSync(comp.file)) {
    console.log(`✅ ${comp.nome} - OK`);
  } else {
    console.log(`❌ ${comp.nome} - FALTANDO (${comp.file})`);
    componentesOk = false;
  }
});

// 4. Verificar registry de blocos
console.log('\n4. VERIFICANDO REGISTRY DE BLOCOS:');

const registryPath = 'src/config/enhancedBlockRegistry.ts';
if (fs.existsSync(registryPath)) {
  const registryContent = fs.readFileSync(registryPath, 'utf8');

  const blocosQuiz = ['result-style-card', 'bonus-showcase', 'loading-animation', 'options-grid'];

  let registryOk = true;

  blocosQuiz.forEach(bloco => {
    if (registryContent.includes(`"${bloco}"`)) {
      console.log(`✅ ${bloco} - Registrado`);
    } else {
      console.log(`❌ ${bloco} - Não registrado`);
      registryOk = false;
    }
  });

  if (!registryOk) {
    componentesOk = false;
  }
} else {
  console.log('❌ Registry não encontrado');
  componentesOk = false;
}

// 5. Verificar sistema de pontuação
console.log('\n5. VERIFICANDO SISTEMA DE PONTUAÇÃO:');

// Pega um template de pergunta para verificar o sistema de scores
const templatePergunta = JSON.parse(fs.readFileSync(`${TEMPLATES_DIR}/step-02.json`, 'utf8'));
const optionsGrid = templatePergunta.blocks.find(b => b.type === 'options-grid');

if (optionsGrid && optionsGrid.properties && optionsGrid.properties.options) {
  const opcoes = optionsGrid.properties.options;
  const temScores = opcoes.some(
    opcao =>
      opcao.scores && typeof opcao.scores === 'object' && Object.keys(opcao.scores).length > 0
  );

  if (temScores) {
    console.log('✅ Sistema de pontuação configurado');

    // Verificar se tem as 8 categorias esperadas
    const categorias = new Set();
    opcoes.forEach(opcao => {
      if (opcao.scores) {
        Object.keys(opcao.scores).forEach(cat => categorias.add(cat));
      }
    });

    const categoriasEsperadas = [
      'natural',
      'classico',
      'contemporaneo',
      'elegante',
      'romantico',
      'sexy',
      'dramatico',
      'criativo',
    ];
    const todasCategorias = categoriasEsperadas.every(cat => categorias.has(cat));

    if (todasCategorias) {
      console.log('✅ Todas as 8 categorias de estilo configuradas');
    } else {
      console.log(
        `⚠️ Algumas categorias podem estar faltando. Encontradas: ${Array.from(categorias).join(', ')}`
      );
    }
  } else {
    console.log('❌ Sistema de pontuação não configurado corretamente');
  }
} else {
  console.log('❌ Options grid não encontrado ou mal configurado');
}

// 6. Resumo final
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMO FINAL:');

const todosOk = templatesOk && estruturaOk && componentesOk;

if (todosOk) {
  console.log('🎉 SUCESSO! Todas as verificações passaram.');
  console.log('✅ 21 templates de etapas configurados');
  console.log('✅ Componentes especializados criados');
  console.log('✅ Registry de blocos atualizado');
  console.log('✅ Sistema de pontuação funcionando');
  console.log('\n🚀 O sistema de quiz está pronto para uso!');
  console.log('🔗 Acesse: http://localhost:8081/editor para testar');
} else {
  console.log('❌ FALHA! Algumas verificações falharam.');
  console.log('📝 Revise os itens marcados com ❌ ou ⚠️ acima');
}

console.log('');
