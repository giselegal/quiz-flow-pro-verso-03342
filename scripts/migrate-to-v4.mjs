#!/usr/bin/env node

/**
 * 🔄 SCRIPT DE MIGRAÇÃO: v3 → v4
 * 
 * Migra quiz21-complete.json (v3) para nova estrutura v4
 * com validação Zod e melhorias de estrutura
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

console.log('\n🔄 MIGRAÇÃO: quiz21-complete.json v3 → v4\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// ============================================================================
// 1. CARREGAR ARQUIVO V3
// ============================================================================

const v3Path = path.join(ROOT, 'public/templates/quiz21-complete.json');

if (!fs.existsSync(v3Path)) {
  console.error('❌ Arquivo não encontrado:', v3Path);
  process.exit(1);
}

console.log('📂 Carregando arquivo v3...');
const v3Data = JSON.parse(fs.readFileSync(v3Path, 'utf8'));
console.log(`✅ Carregado: ${Object.keys(v3Data.steps).length} steps\n`);

// ============================================================================
// 2. EXTRAIR TEMA DO PRIMEIRO STEP
// ============================================================================

console.log('🎨 Extraindo tema global...');
const firstStep = v3Data.steps['step-01'];
const theme = firstStep?.theme || {
  colors: {
    primary: '#B89B7A',
    primaryHover: '#A68B6A',
    primaryLight: '#F3E8D3',
    secondary: '#432818',
    background: '#FAF9F7',
    text: '#1F2937',
    border: '#E5E7EB'
  },
  fonts: {
    heading: 'Playfair Display, serif',
    body: 'Inter, sans-serif'
  },
  spacing: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16
  }
};
console.log('✅ Tema extraído\n');

// ============================================================================
// 3. CONVERTER STEPS
// ============================================================================

console.log('🔄 Convertendo steps...');
const steps = Object.entries(v3Data.steps)
  .sort(([a], [b]) => {
    const numA = parseInt(a.replace('step-', ''));
    const numB = parseInt(b.replace('step-', ''));
    return numA - numB;
  })
  .map(([stepKey, stepData], index) => {
    const stepNumber = index + 1;
    const stepId = `step-${String(stepNumber).padStart(2, '0')}`;
    
    return {
      id: stepId,
      type: stepData.metadata?.category || stepData.type || 'question',
      order: stepNumber,
      title: stepData.metadata?.name,
      blocks: stepData.blocks || [],
      navigation: {
        nextStep: stepData.navigation?.nextStep || (
          stepNumber < Object.keys(v3Data.steps).length 
            ? `step-${String(stepNumber + 1).padStart(2, '0')}` 
            : null
        ),
        conditions: stepData.navigation?.conditions || []
      },
      validation: stepData.validation || {
        required: stepData.type === 'question',
        rules: stepData.validation?.rules || {}
      }
    };
  });

console.log(`✅ ${steps.length} steps convertidos\n`);

// ============================================================================
// 4. EXTRAIR CONFIGURAÇÕES DE SCORING
// ============================================================================

console.log('📊 Extraindo configurações de scoring...');
const scoringRules = v3Data.metadata?.scoringRules || {};
const settings = {
  scoring: {
    enabled: v3Data.metadata?.scoringEnabled || true,
    method: 'category-points',
    categories: [
      'Natural',
      'Clássico',
      'Contemporâneo',
      'Elegante',
      'Romântico',
      'Sexy',
      'Dramático',
      'Criativo'
    ],
    weights: {},
    tieBreak: 'natural-first'
  },
  navigation: {
    allowBack: true,
    autoAdvance: true,
    showProgress: true,
    delayMs: 500
  },
  validation: {
    required: true,
    strictMode: true
  }
};
console.log('✅ Settings configurados\n');

// ============================================================================
// 5. CRIAR BLOCK LIBRARY
// ============================================================================

console.log('📚 Criando block library...');
const blockLibrary = {
  'question-progress': {
    component: 'QuestionProgress',
    editable: true,
    reorderable: true,
    reusable: true,
    deletable: true,
    defaultProps: { padding: 8 },
    defaultContent: {
      showPercentage: true,
      barColor: theme.colors.primary,
      backgroundColor: theme.colors.border
    }
  },
  'question-title': {
    component: 'QuestionTitle',
    editable: true,
    reorderable: true,
    reusable: true,
    deletable: false,
    defaultProps: { padding: 16 },
    defaultContent: {
      text: 'Nova pergunta',
      subtitle: ''
    }
  },
  'options-grid': {
    component: 'OptionsGrid',
    editable: true,
    reorderable: true,
    reusable: true,
    deletable: false,
    defaultProps: { columns: 2, gap: 16 },
    defaultContent: {
      options: [],
      minSelections: 3,
      maxSelections: 3,
      showImages: true
    }
  },
  'question-navigation': {
    component: 'QuestionNavigation',
    editable: true,
    reorderable: true,
    reusable: true,
    deletable: false,
    defaultProps: { showBack: true, showNext: true },
    defaultContent: {
      backLabel: 'Voltar',
      nextLabel: 'Avançar'
    }
  },
  'form-input': {
    component: 'FormInput',
    editable: true,
    reorderable: true,
    reusable: true,
    deletable: true,
    defaultProps: { padding: 16 },
    defaultContent: {
      label: 'Digite aqui',
      placeholder: '',
      required: true
    }
  },
  'text-inline': {
    component: 'TextInline',
    editable: true,
    reorderable: true,
    reusable: true,
    deletable: true,
    defaultProps: { padding: 8 },
    defaultContent: {
      text: 'Texto'
    }
  },
  'quiz-intro-header': {
    component: 'QuizIntroHeader',
    editable: true,
    reorderable: true,
    reusable: true,
    deletable: true,
    defaultProps: {},
    defaultContent: {
      logoUrl: '',
      showProgress: false
    }
  }
};
console.log('✅ Block library criado\n');

// ============================================================================
// 6. CRIAR ESTRUTURA V4
// ============================================================================

console.log('🏗️  Montando estrutura v4...');
const v4Schema = {
  version: '4.0.0',
  schemaVersion: '1.0',
  metadata: {
    id: v3Data.templateId || 'quiz21StepsComplete',
    name: v3Data.name || 'Quiz de Estilo Pessoal - 21 Etapas',
    description: v3Data.description || 'Template completo v4.0 com validação Zod',
    author: v3Data.metadata?.author || 'giselegal',
    createdAt: v3Data.metadata?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: '4.0.0',
    tags: ['quiz', 'estilo', 'pessoal', 'v4', 'zod']
  },
  theme,
  settings,
  steps,
  results: {},
  blockLibrary
};
console.log('✅ Estrutura v4 montada\n');

// ============================================================================
// 7. SALVAR ARQUIVO V4
// ============================================================================

console.log('💾 Salvando arquivo v4...');
const v4Path = path.join(ROOT, 'public/templates/quiz21-v4.json');
fs.writeFileSync(v4Path, JSON.stringify(v4Schema, null, 2));
console.log(`✅ Salvo em: ${path.relative(ROOT, v4Path)}\n`);

// ============================================================================
// 8. ESTATÍSTICAS
// ============================================================================

const v3Size = fs.statSync(v3Path).size;
const v4Size = fs.statSync(v4Path).size;
const reduction = ((v3Size - v4Size) / v3Size * 100).toFixed(1);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 ESTATÍSTICAS DA MIGRAÇÃO');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log(`📄 Arquivo v3: ${Math.round(v3Size / 1024)}KB`);
console.log(`📄 Arquivo v4: ${Math.round(v4Size / 1024)}KB`);
console.log(`${reduction > 0 ? '📉' : '📈'} Diferença: ${Math.abs(reduction)}%\n`);
console.log(`🎯 Steps migrados: ${steps.length}`);
console.log(`🧩 Blocks totais: ${steps.reduce((sum, s) => sum + s.blocks.length, 0)}`);
console.log(`📚 Block types: ${Object.keys(blockLibrary).length}`);
console.log(`🎨 Tema: ${theme.colors.primary}`);
console.log(`📊 Scoring: ${settings.scoring.categories.length} categorias\n`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📋 PRÓXIMOS PASSOS:\n');
console.log('1. Validar schema Zod:');
console.log('   npm run validate:schema\n');
console.log('2. Testar carregamento:');
console.log('   npm run dev\n');
console.log('3. Atualizar código para usar v4:');
console.log('   - Alterar imports para quiz21-v4.json');
console.log('   - Adicionar validação Zod nos hooks\n');

process.exit(0);
