#!/usr/bin/env node

/**
 * Script para upgrade do quiz21-v4.json para padrão SaaS
 * 
 * Aplica:
 * 1. Padronização de options (id, label, imageUrl, value, score)
 * 2. Separação clara de properties vs content
 * 3. Remoção de HTML/Tailwind inline → rich-text
 * 4. Scoring explícito por opção
 * 5. Validações consolidadas
 * 6. Normalização de URLs de assets
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const filePath = resolve(process.cwd(), 'public/templates/quiz21-v4.json');

console.log('🚀 Iniciando upgrade para padrão SaaS...\n');

// Ler o JSON
const rawData = readFileSync(filePath, 'utf-8');
const quiz = JSON.parse(rawData);

// ========================================
// 1. PADRONIZAR OPTIONS
// ========================================
function standardizeOption(option, categoryFromId) {
  const standardized = {
    id: option.id,
    label: option.text || option.label || '',
    value: option.value || option.id,
    imageUrl: option.imageUrl || option.image || null,
  };

  // Adicionar scoring explícito
  if (categoryFromId) {
    const categoryMap = {
      natural: 'Natural',
      classico: 'Clássico',
      contemporaneo: 'Contemporâneo',
      elegante: 'Elegante',
      romantico: 'Romântico',
      sexy: 'Sexy',
      dramatico: 'Dramático',
      criativo: 'Criativo',
    };

    standardized.score = {
      category: categoryMap[option.id] || option.id,
      points: 1,
    };
  }

  return standardized;
}

// ========================================
// 2. REMOVER HTML/TAILWIND → RICH-TEXT
// ========================================
function convertToRichText(htmlString) {
  if (!htmlString || typeof htmlString !== 'string') return htmlString;

  // Detectar se tem HTML/Tailwind
  if (!htmlString.includes('<span') && !htmlString.includes('class=')) {
    return htmlString;
  }

  // Extrair blocos de texto e highlights
  const blocks = [];
  let remaining = htmlString;

  // Pattern: texto normal + <span ...>texto destacado</span>
  const spanRegex = /<span[^>]*>(.*?)<\/span>/g;
  let lastIndex = 0;
  let match;

  while ((match = spanRegex.exec(htmlString)) !== null) {
    // Texto antes do span
    if (match.index > lastIndex) {
      const text = htmlString.substring(lastIndex, match.index).trim();
      if (text) {
        blocks.push({ type: 'text', value: text });
      }
    }

    // Texto dentro do span (destacado)
    blocks.push({ type: 'highlight', value: match[1] });
    lastIndex = match.index + match[0].length;
  }

  // Texto após o último span
  if (lastIndex < htmlString.length) {
    const text = htmlString.substring(lastIndex).trim();
    if (text) {
      blocks.push({ type: 'text', value: text });
    }
  }

  return {
    type: 'rich-text',
    blocks: blocks.length > 0 ? blocks : [{ type: 'text', value: htmlString }],
  };
}

// ========================================
// 3. NORMALIZAR URLs
// ========================================
function normalizeAssetUrl(url) {
  if (!url) return null;
  if (url.startsWith('/quiz-assets/')) return url;
  
  // Extrair filename do Cloudinary
  if (url.includes('cloudinary.com')) {
    const match = url.match(/\/([^\/]+\.webp)$/);
    if (match) {
      return `/quiz-assets/${match[1]}`;
    }
  }
  
  return url;
}

// ========================================
// 4. PROCESSAR STEPS E BLOCKS
// ========================================
console.log('📦 Processando steps e blocks...');

let optionsStandardized = 0;
let richTextConverted = 0;
let urlsNormalized = 0;

quiz.steps.forEach((step, stepIdx) => {
  step.blocks.forEach((block, blockIdx) => {
    // ==========================
    // PADRONIZAR OPTIONS
    // ==========================
    if (block.content?.options && Array.isArray(block.content.options)) {
      const hasScoring = block.content.options.length === 8; // perguntas de estilo têm 8 opções
      
      block.content.options = block.content.options.map((opt) => {
        optionsStandardized++;
        return standardizeOption(opt, hasScoring);
      });

      // Remover duplicação columns/gap de content
      if (block.content.columns !== undefined) {
        delete block.content.columns;
      }
      if (block.content.gap !== undefined) {
        delete block.content.gap;
      }
    }

    // ==========================
    // CONVERTER HTML → RICH-TEXT
    // ==========================
    if (block.content?.text) {
      const converted = convertToRichText(block.content.text);
      if (typeof converted === 'object') {
        richTextConverted++;
        block.content.text = converted;
      }
    }

    if (block.content?.title) {
      const converted = convertToRichText(block.content.title);
      if (typeof converted === 'object') {
        richTextConverted++;
        block.content.title = converted;
      }
    }

    // ==========================
    // NORMALIZAR URLs
    // ==========================
    ['imageUrl', 'image', 'src', 'logoUrl'].forEach((field) => {
      if (block.content?.[field]) {
        const normalized = normalizeAssetUrl(block.content[field]);
        if (normalized !== block.content[field]) {
          urlsNormalized++;
          block.content[field] = normalized;
        }
      }

      if (block.properties?.[field]) {
        const normalized = normalizeAssetUrl(block.properties[field]);
        if (normalized !== block.properties[field]) {
          urlsNormalized++;
          block.properties[field] = normalized;
        }
      }
    });
  });
});

// ========================================
// 5. CONSOLIDAR VALIDAÇÕES
// ========================================
console.log('✅ Consolidando validações...');

// Criar defaults globais
quiz.settings.validation = {
  required: true,
  strictMode: true,
  defaults: {
    question: {
      minSelections: 3,
      maxSelections: 3,
      errorMessage: 'Selecione exatamente 3 opções para continuar',
    },
    intro: {
      required: true,
      errorMessage: 'Campo obrigatório',
    },
  },
};

// Simplificar validações dos steps (só manter se for diferente do default)
quiz.steps.forEach((step) => {
  if (step.type === 'question') {
    // Validação padrão já está em settings, remover duplicação
    if (
      step.validation?.rules?.selectedOptions?.minItems === 3 ||
      step.validation?.required === true
    ) {
      step.validation = { inheritsDefaults: true };
    }
  }
});

// ========================================
// 6. ATUALIZAR METADATA
// ========================================
quiz.metadata.updatedAt = new Date().toISOString();
quiz.metadata.description =
  'Template v4.0 - Padrão SaaS: options padronizadas, rich-text, scoring explícito, validações consolidadas';
quiz.version = '4.1.0'; // Bump version

// ========================================
// SALVAR
// ========================================
const outputPath = filePath.replace('.json', '-saas.json');
writeFileSync(outputPath, JSON.stringify(quiz, null, 2), 'utf-8');

console.log('\n✨ Upgrade concluído com sucesso!\n');
console.log(`📊 Estatísticas:`);
console.log(`   • ${optionsStandardized} opções padronizadas`);
console.log(`   • ${richTextConverted} textos convertidos para rich-text`);
console.log(`   • ${urlsNormalized} URLs normalizadas`);
console.log(`   • Validações consolidadas em settings.validation.defaults`);
console.log(`\n📁 Arquivo gerado: ${outputPath}\n`);
console.log('👉 Próximos passos:');
console.log('   1. Revisar o arquivo gerado');
console.log('   2. Atualizar o renderer para suportar rich-text');
console.log('   3. Ajustar scoring para usar option.score.category');
console.log('   4. Remover quiz21-v4.json antigo após validação\n');
