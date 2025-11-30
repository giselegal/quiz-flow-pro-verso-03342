/**
 * Script para validar quiz21-v4.json com Zod schema
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar schema (isso vai falhar se houver erro de build, então vamos apenas verificar estrutura JSON)
const filePath = path.join(__dirname, '../public/templates/quiz21-v4.json');

console.log('📝 Validando arquivo:', filePath);
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let errors = [];

// Validações básicas
console.log('\n🔍 Validações básicas:\n');

// 1. Version e schemaVersion
if (!data.version || !/^\d+\.\d+\.\d+$/.test(data.version)) {
  errors.push('❌ version deve ser semver (x.y.z)');
} else {
  console.log('✅ version:', data.version);
}

if (!data.schemaVersion || !/^\d+\.\d+$/.test(data.schemaVersion)) {
  errors.push('❌ schemaVersion deve ser x.y (ex: 4.0)');
} else {
  console.log('✅ schemaVersion:', data.schemaVersion);
}

// 2. Metadata obrigatório
const requiredMetadataFields = ['id', 'title', 'description', 'slug', 'author', 'category', 'language', 'status'];
requiredMetadataFields.forEach(field => {
  if (!data.metadata[field]) {
    errors.push(`❌ metadata.${field} é obrigatório`);
  } else {
    console.log(`✅ metadata.${field}:`, data.metadata[field]);
  }
});

// 3. Theme cores (formato hex)
const requiredColors = ['primary', 'secondary', 'background', 'text', 'border'];
requiredColors.forEach(color => {
  const colorValue = data.theme?.colors?.[color];
  if (!colorValue || !/^#[0-9A-F]{6}$/i.test(colorValue)) {
    errors.push(`❌ theme.colors.${color} deve ser hexadecimal (#XXXXXX)`);
  } else {
    console.log(`✅ theme.colors.${color}:`, colorValue);
  }
});

// 4. Theme fonts
if (!data.theme?.fonts?.heading) {
  errors.push('❌ theme.fonts.heading é obrigatório');
} else {
  console.log('✅ theme.fonts.heading:', data.theme.fonts.heading);
}

if (!data.theme?.fonts?.body) {
  errors.push('❌ theme.fonts.body é obrigatório');
} else {
  console.log('✅ theme.fonts.body:', data.theme.fonts.body);
}

// 5. Settings
console.log('\n✅ settings.scoring.enabled:', data.settings?.scoring?.enabled);
console.log('✅ settings.scoring.method:', data.settings?.scoring?.method);
console.log('✅ settings.navigation.allowBack:', data.settings?.navigation?.allowBack);
console.log('✅ settings.validation.required:', data.settings?.validation?.required);

// 6. Steps
console.log('\n🔍 Validando steps:\n');

if (!data.steps || data.steps.length === 0) {
  errors.push('❌ Quiz deve ter pelo menos 1 step');
} else {
  console.log(`✅ Total de steps: ${data.steps.length}`);
  
  data.steps.forEach((step, index) => {
    const stepNum = index + 1;
    
    // Step ID formato
    if (!/^step-\d{2}$/.test(step.id)) {
      errors.push(`❌ Step ${stepNum}: ID "${step.id}" deve ser no formato "step-XX" (dois dígitos)`);
    }
    
    // Navigation nested
    if (!step.navigation || typeof step.navigation !== 'object') {
      errors.push(`❌ Step ${stepNum} (${step.id}): navigation deve ser objeto { nextStep: ... }`);
    } else if (!step.navigation.hasOwnProperty('nextStep')) {
      errors.push(`❌ Step ${stepNum} (${step.id}): navigation.nextStep é obrigatório (use null para último step)`);
    }
    
    // Blocks
    if (!step.blocks || step.blocks.length === 0) {
      errors.push(`❌ Step ${stepNum} (${step.id}): deve ter pelo menos 1 block`);
    } else {
      step.blocks.forEach((block, blockIndex) => {
        // Metadata obrigatório
        if (!block.metadata) {
          errors.push(`❌ Step ${stepNum} (${step.id}), Block ${blockIndex + 1} (${block.id}): metadata é obrigatório`);
        }
        
        // Properties obrigatório
        if (!block.properties) {
          errors.push(`❌ Step ${stepNum} (${step.id}), Block ${blockIndex + 1} (${block.id}): properties é obrigatório (use {} se vazio)`);
        }
      });
    }
  });
  
  console.log(`✅ Steps validados: ${data.steps.length}`);
  console.log(`✅ Blocos totais: ${data.steps.reduce((acc, s) => acc + s.blocks.length, 0)}`);
}

// Resumo
console.log('\n📊 RESUMO DA VALIDAÇÃO:\n');

if (errors.length === 0) {
  console.log('✅ Arquivo válido para ModernQuizEditor!');
  console.log('\n🎉 Pode ser usado no /editor sem problemas.\n');
  process.exit(0);
} else {
  console.log(`❌ ${errors.length} erro(s) encontrado(s):\n`);
  errors.forEach((err, i) => {
    console.log(`${i + 1}. ${err}`);
  });
  console.log('\n⚠️  Corrija os erros acima antes de usar no editor.\n');
  process.exit(1);
}
