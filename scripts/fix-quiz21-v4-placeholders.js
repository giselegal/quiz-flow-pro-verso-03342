#!/usr/bin/env node
/**
 * Script para corrigir todos os placeholders no quiz21-v4.json
 * Gera um arquivo 100% válido conforme schema Zod
 * 
 * Correções aplicadas:
 * 1. metadata.createdAt: adiciona horário ISO 8601
 * 2. Substitui {{theme.colors.primary}} por #B89B7A
 * 3. Substitui {{theme.colors.secondary}} por #432818
 * 4. Substitui {{asset.logo}} por URL Cloudinary
 * 5. Corrige validation.required nos steps
 * 6. Adiciona content: {} vazio onde necessário
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Valores de substituição
const REPLACEMENTS = {
  '{{theme.colors.primary}}': '#B89B7A',
  '{{theme.colors.secondary}}': '#432818',
  '{{theme.colors.primaryHover}}': '#A68B6A',
  '{{theme.colors.primaryLight}}': '#F3E8D3',
  '{{asset.logo}}': 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/logo_euritmo.webp',
};

// Caminhos
const inputPath = path.join(__dirname, '../public/templates/quiz21-v4.json');
const outputPath = path.join(__dirname, '../public/templates/quiz21-v4-gold.json');

console.log('🔧 Iniciando correção do template V4...\n');

try {
  // Ler arquivo original
  console.log('📖 Lendo arquivo:', inputPath);
  let content = fs.readFileSync(inputPath, 'utf8');
  const originalSize = content.length;

  // Parse para verificar JSON válido
  const json = JSON.parse(content);
  console.log('✅ JSON original válido\n');

  // Aplicar substituições de placeholders
  console.log('🔄 Aplicando substituições de placeholders...');
  let replacementCount = 0;
  
  for (const [placeholder, value] of Object.entries(REPLACEMENTS)) {
    const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, value);
      console.log(`   ✓ ${placeholder} → ${value} (${matches.length}x)`);
      replacementCount += matches.length;
    }
  }
  console.log(`   Total: ${replacementCount} substituições\n`);

  // Parse novamente para fazer correções estruturais
  const fixedJson = JSON.parse(content);

  // Correção 1: metadata.createdAt para ISO 8601 completo
  if (fixedJson.metadata.createdAt === '2025-01-13') {
    fixedJson.metadata.createdAt = '2025-01-13T00:00:00.000Z';
    console.log('✅ Corrigido metadata.createdAt para ISO 8601 completo');
  }

  // Correção 2: Garantir que todos os blocks têm content
  let blocksFixed = 0;
  fixedJson.steps.forEach(step => {
    step.blocks.forEach(block => {
      if (!block.content) {
        block.content = {};
        blocksFixed++;
      }
    });
  });
  if (blocksFixed > 0) {
    console.log(`✅ Adicionado content: {} em ${blocksFixed} blocos`);
  }

  // Correção 3: validation.required nos steps
  let validationFixed = 0;
  fixedJson.steps.forEach(step => {
    if (step.validation && Array.isArray(step.validation.required)) {
      // Converter array para estrutura correta
      const requiredFields = step.validation.required;
      step.validation = {
        required: true,
        rules: {}
      };
      requiredFields.forEach(field => {
        step.validation.rules[field] = {
          minItems: 1,
          errorMessage: `${field} é obrigatório`
        };
      });
      validationFixed++;
    }
  });
  if (validationFixed > 0) {
    console.log(`✅ Corrigido validation.required em ${validationFixed} steps`);
  }

  // Correção 4: Substituir placeholders em strings HTML/CSS inline
  const htmlColorPattern = /text-\[\{\{theme\.colors\.\w+\}\}\]/g;
  const styleColorPattern = /color:\s*\{\{theme\.colors\.\w+\}\}/g;
  
  let htmlContent = JSON.stringify(fixedJson);
  let htmlReplacements = 0;
  
  // Substituir text-[{{theme.colors.primary}}] por text-[#B89B7A]
  htmlContent = htmlContent.replace(/text-\[\{\{theme\.colors\.primary\}\}\]/g, () => {
    htmlReplacements++;
    return 'text-[#B89B7A]';
  });
  
  // Substituir color: {{theme.colors.primary}} por color: #B89B7A
  htmlContent = htmlContent.replace(/color:\s*\{\{theme\.colors\.primary\}\}/g, () => {
    htmlReplacements++;
    return 'color: #B89B7A';
  });
  
  if (htmlReplacements > 0) {
    fixedJson = JSON.parse(htmlContent);
    console.log(`✅ Corrigido ${htmlReplacements} placeholders em HTML/CSS inline`);
  }

  // Salvar arquivo corrigido
  const finalContent = JSON.stringify(fixedJson, null, 2);
  fs.writeFileSync(outputPath, finalContent, 'utf8');
  
  const finalSize = finalContent.length;
  const reduction = ((originalSize - finalSize) / originalSize * 100).toFixed(2);
  
  console.log('\n📊 Estatísticas:');
  console.log(`   Tamanho original: ${(originalSize / 1024).toFixed(2)} KB`);
  console.log(`   Tamanho final: ${(finalSize / 1024).toFixed(2)} KB`);
  console.log(`   Redução: ${reduction > 0 ? reduction + '%' : '0%'}`);
  
  console.log('\n✅ Arquivo gold standard criado:', outputPath);
  console.log('🎯 Pronto para validação Zod!\n');
  
} catch (error) {
  console.error('\n❌ Erro ao processar arquivo:', error.message);
  process.exit(1);
}
