/**
 * Validação de boas práticas do quiz21-v4.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../public/templates/quiz21-v4.json');

console.log('📝 Analisando boas práticas em:', filePath);
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const issues = [];
const warnings = [];
const recommendations = [];

console.log('\n🔍 ANÁLISE DE BOAS PRÁTICAS\n');

// ===========================================================================
// 1. ESTRUTURA GERAL
// ===========================================================================
console.log('📦 1. ESTRUTURA GERAL\n');

if (data.$schema) {
  console.log('✅ $schema definido:', data.$schema);
} else {
  recommendations.push('Adicionar $schema para validação de IDE');
}

// Versionamento semântico
if (data.version && /^\d+\.\d+\.\d+$/.test(data.version)) {
  console.log('✅ Version semver válido:', data.version);
} else {
  issues.push('Version deve seguir semver (x.y.z)');
}

// ===========================================================================
// 2. METADATA
// ===========================================================================
console.log('\n📋 2. METADATA\n');

// Campos obrigatórios
const requiredMetadata = ['id', 'title', 'description', 'slug', 'author', 'category', 'language', 'status'];
requiredMetadata.forEach(field => {
  if (data.metadata[field]) {
    console.log(`✅ metadata.${field}: presente`);
  } else {
    issues.push(`metadata.${field} é obrigatório`);
  }
});

// Slug deve ser kebab-case
if (data.metadata.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.metadata.slug)) {
  warnings.push('metadata.slug deve ser kebab-case (ex: quiz-estilo-pessoal)');
} else {
  console.log('✅ Slug em kebab-case válido');
}

// Status válido
const validStatuses = ['draft', 'published', 'archived'];
if (!validStatuses.includes(data.metadata.status)) {
  issues.push(`metadata.status deve ser: ${validStatuses.join(', ')}`);
} else {
  console.log('✅ Status válido:', data.metadata.status);
}

// ===========================================================================
// 3. THEME
// ===========================================================================
console.log('\n🎨 3. THEME\n');

// Cores hexadecimais válidas
const colorKeys = ['primary', 'secondary', 'background', 'text', 'border'];
colorKeys.forEach(key => {
  const color = data.theme?.colors?.[key];
  if (color && /^#[0-9A-F]{6}$/i.test(color)) {
    console.log(`✅ colors.${key}: ${color}`);
  } else {
    issues.push(`theme.colors.${key} deve ser hexadecimal válido`);
  }
});

// Cores opcionais mas recomendadas
const optionalColors = ['primaryHover', 'primaryLight'];
optionalColors.forEach(key => {
  if (data.theme?.colors?.[key]) {
    console.log(`✅ colors.${key}: ${data.theme.colors[key]} (opcional)`);
  } else {
    recommendations.push(`Adicionar theme.colors.${key} para melhor UX`);
  }
});

// Fontes
if (data.theme?.fonts?.heading && data.theme?.fonts?.body) {
  console.log('✅ Fonts heading e body definidas');
} else {
  issues.push('theme.fonts.heading e theme.fonts.body são obrigatórios');
}

// ===========================================================================
// 4. SETTINGS
// ===========================================================================
console.log('\n⚙️ 4. SETTINGS\n');

// Scoring method válido
const validMethods = ['sum', 'weighted', 'majority', 'category-points'];
if (validMethods.includes(data.settings?.scoring?.method)) {
  console.log('✅ scoring.method válido:', data.settings.scoring.method);
} else {
  issues.push(`scoring.method deve ser: ${validMethods.join(', ')}`);
}

// Se method = category-points, categories é obrigatório
if (data.settings?.scoring?.method === 'category-points') {
  if (data.settings.scoring.categories?.length > 0) {
    console.log('✅ scoring.categories definidas:', data.settings.scoring.categories.length);
  } else {
    issues.push('scoring.categories é obrigatório quando method = category-points');
  }
}

// Completion settings
if (data.settings?.completion) {
  console.log('✅ completion settings presente');
} else {
  recommendations.push('Adicionar settings.completion para melhor controle pós-quiz');
}

// ===========================================================================
// 5. STEPS
// ===========================================================================
console.log('\n📄 5. STEPS\n');

if (!data.steps || data.steps.length === 0) {
  issues.push('Quiz deve ter pelo menos 1 step');
} else {
  console.log(`✅ Total de steps: ${data.steps.length}`);
  
  // Validar ordem sequencial
  const orders = data.steps.map(s => s.order);
  const isSequential = orders.every((order, idx) => order === idx + 1);
  if (isSequential) {
    console.log('✅ Orders sequenciais (1, 2, 3...)');
  } else {
    warnings.push('Orders dos steps não são sequenciais');
  }
  
  // Validar IDs
  let stepIdErrors = 0;
  data.steps.forEach((step, idx) => {
    if (!/^step-\d{2}$/.test(step.id)) {
      stepIdErrors++;
    }
  });
  
  if (stepIdErrors === 0) {
    console.log('✅ Todos os step IDs no formato step-XX');
  } else {
    issues.push(`${stepIdErrors} step(s) com ID inválido (deve ser step-XX)`);
  }
  
  // Validar navigation
  let navErrors = 0;
  data.steps.forEach((step, idx) => {
    if (!step.navigation || typeof step.navigation !== 'object') {
      navErrors++;
    } else if (!step.navigation.hasOwnProperty('nextStep')) {
      navErrors++;
    }
  });
  
  if (navErrors === 0) {
    console.log('✅ Todos os steps têm navigation: { nextStep }');
  } else {
    issues.push(`${navErrors} step(s) sem navigation nested correto`);
  }
  
  // Último step deve ter nextStep: null
  const lastStep = data.steps[data.steps.length - 1];
  if (lastStep.navigation?.nextStep === null) {
    console.log('✅ Último step com nextStep: null');
  } else {
    warnings.push('Último step deveria ter navigation.nextStep: null');
  }
}

// ===========================================================================
// 6. BLOCKS
// ===========================================================================
console.log('\n🧱 6. BLOCKS\n');

let totalBlocks = 0;
let blocksWithMetadata = 0;
let blocksWithProperties = 0;
let blocksWithContent = 0;

data.steps.forEach(step => {
  step.blocks.forEach(block => {
    totalBlocks++;
    
    if (block.metadata) blocksWithMetadata++;
    if (block.properties) blocksWithProperties++;
    if (block.content !== undefined) blocksWithContent++;
  });
});

console.log(`✅ Total de blocos: ${totalBlocks}`);
console.log(`✅ Blocos com metadata: ${blocksWithMetadata}/${totalBlocks}`);
console.log(`✅ Blocos com properties: ${blocksWithProperties}/${totalBlocks}`);
console.log(`✅ Blocos com content: ${blocksWithContent}/${totalBlocks}`);

if (blocksWithMetadata !== totalBlocks) {
  issues.push(`${totalBlocks - blocksWithMetadata} bloco(s) sem metadata obrigatório`);
}

if (blocksWithProperties !== totalBlocks) {
  issues.push(`${totalBlocks - blocksWithProperties} bloco(s) sem properties (use {} se vazio)`);
}

// ===========================================================================
// 7. PERFORMANCE & OTIMIZAÇÃO
// ===========================================================================
console.log('\n⚡ 7. PERFORMANCE & OTIMIZAÇÃO\n');

// Tamanho do arquivo
const fileSize = fs.statSync(filePath).size;
const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);
console.log(`📊 Tamanho do arquivo: ${fileSizeMB} MB`);

if (fileSize > 5 * 1024 * 1024) {
  warnings.push(`Arquivo grande (${fileSizeMB} MB) - considere split ou lazy loading`);
} else if (fileSize > 10 * 1024 * 1024) {
  issues.push(`Arquivo muito grande (${fileSizeMB} MB) - performance impactada`);
} else {
  console.log('✅ Tamanho de arquivo adequado');
}

// Imagens externas
let externalImages = 0;
const imageRegex = /https?:\/\/[^\s"]+\.(jpg|jpeg|png|webp|gif)/gi;
const jsonString = JSON.stringify(data);
const matches = jsonString.match(imageRegex);
if (matches) {
  externalImages = matches.length;
  console.log(`📷 Imagens externas: ${externalImages}`);
  
  if (externalImages > 50) {
    recommendations.push('Muitas imagens externas - considere CDN ou lazy loading');
  }
}

// ===========================================================================
// 8. ACESSIBILIDADE
// ===========================================================================
console.log('\n♿ 8. ACESSIBILIDADE\n');

// Verificar se blocos de imagem têm alt text
let imagesWithoutAlt = 0;
data.steps.forEach(step => {
  step.blocks.forEach(block => {
    if (['intro-image', 'question-hero', 'result-image', 'offer-hero'].includes(block.type)) {
      if (!block.content?.alt && !block.properties?.alt) {
        imagesWithoutAlt++;
      }
    }
  });
});

if (imagesWithoutAlt === 0) {
  console.log('✅ Todas as imagens têm alt text');
} else {
  warnings.push(`${imagesWithoutAlt} imagem(ns) sem alt text`);
}

// ===========================================================================
// 9. CONSISTÊNCIA
// ===========================================================================
console.log('\n🔄 9. CONSISTÊNCIA\n');

// Verificar se todos os blocos do mesmo tipo têm estrutura similar
const blocksByType = {};
data.steps.forEach(step => {
  step.blocks.forEach(block => {
    if (!blocksByType[block.type]) {
      blocksByType[block.type] = [];
    }
    blocksByType[block.type].push(block);
  });
});

console.log(`✅ Tipos de blocos únicos: ${Object.keys(blocksByType).length}`);

// Verificar progress bars
const progressBlocks = blocksByType['question-progress'] || [];
if (progressBlocks.length > 0) {
  console.log(`✅ Progress bars: ${progressBlocks.length}`);
  
  // Verificar se totalSteps é consistente
  const totalStepsValues = progressBlocks.map(b => b.content?.totalSteps).filter(Boolean);
  const uniqueTotals = [...new Set(totalStepsValues)];
  
  if (uniqueTotals.length === 1) {
    console.log(`✅ totalSteps consistente: ${uniqueTotals[0]}`);
  } else {
    warnings.push(`totalSteps inconsistente em progress bars: ${uniqueTotals.join(', ')}`);
  }
}

// ===========================================================================
// 10. BOAS PRÁTICAS ESPECÍFICAS
// ===========================================================================
console.log('\n✨ 10. BOAS PRÁTICAS ESPECÍFICAS\n');

// Step intro deve ter form-input ou intro-form
const introSteps = data.steps.filter(s => s.type === 'intro');
if (introSteps.length > 0) {
  const hasFormInput = introSteps.some(s => 
    s.blocks.some(b => ['form-input', 'intro-form'].includes(b.type))
  );
  
  if (hasFormInput) {
    console.log('✅ Step intro tem captura de dados');
  } else {
    recommendations.push('Adicionar form-input no step intro para capturar nome/email');
  }
}

// Step result deve ter display de resultado
const resultSteps = data.steps.filter(s => s.type === 'result' || s.type === 'quiz-result');
if (resultSteps.length > 0) {
  const hasResultDisplay = resultSteps.some(s =>
    s.blocks.some(b => ['result-display', 'quiz-score-display', 'result-main'].includes(b.type))
  );
  
  if (hasResultDisplay) {
    console.log('✅ Step result tem exibição de pontuação');
  } else {
    warnings.push('Step result sem bloco de exibição de resultado');
  }
}

// CTAs devem ter texto claro
let ctasCount = 0;
let ctasWithoutText = 0;

data.steps.forEach(step => {
  step.blocks.forEach(block => {
    if (['button', 'cta-button', 'CTAButton', 'intro-button'].includes(block.type)) {
      ctasCount++;
      if (!block.content?.text && !block.content?.buttonText) {
        ctasWithoutText++;
      }
    }
  });
});

if (ctasCount > 0) {
  console.log(`✅ CTAs encontrados: ${ctasCount}`);
  if (ctasWithoutText === 0) {
    console.log('✅ Todos os CTAs têm texto definido');
  } else {
    warnings.push(`${ctasWithoutText} CTA(s) sem texto`);
  }
}

// ===========================================================================
// RESUMO FINAL
// ===========================================================================
console.log('\n' + '='.repeat(80));
console.log('📊 RESUMO FINAL\n');

const totalIssues = issues.length + warnings.length;
const score = Math.max(0, 100 - (issues.length * 10) - (warnings.length * 5));

console.log(`📈 PONTUAÇÃO: ${score}/100\n`);

if (issues.length === 0 && warnings.length === 0) {
  console.log('✅ EXCELENTE! O arquivo segue todas as boas práticas obrigatórias.\n');
} else {
  if (issues.length > 0) {
    console.log(`❌ PROBLEMAS CRÍTICOS (${issues.length}):\n`);
    issues.forEach((issue, i) => {
      console.log(`   ${i + 1}. ${issue}`);
    });
    console.log();
  }
  
  if (warnings.length > 0) {
    console.log(`⚠️  AVISOS (${warnings.length}):\n`);
    warnings.forEach((warning, i) => {
      console.log(`   ${i + 1}. ${warning}`);
    });
    console.log();
  }
}

if (recommendations.length > 0) {
  console.log(`💡 RECOMENDAÇÕES (${recommendations.length}):\n`);
  recommendations.forEach((rec, i) => {
    console.log(`   ${i + 1}. ${rec}`);
  });
  console.log();
}

console.log('='.repeat(80) + '\n');

// Exit code
if (issues.length > 0) {
  process.exit(1);
} else if (warnings.length > 0) {
  process.exit(0); // Warnings não bloqueiam
} else {
  process.exit(0);
}
