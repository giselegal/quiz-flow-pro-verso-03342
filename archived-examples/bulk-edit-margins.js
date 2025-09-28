#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 🎯 SCRIPT PARA PADRONIZAÇÃO EM LOTE DAS MARGENS NAS STEPS 01-21
console.log('🚀 Iniciando padronização em lote das margens das Steps...');

const stepFiles = [
  'Step01Template.tsx',
  'Step02Template.tsx',
  'Step03Template.tsx',
  'Step04Template.tsx',
  'Step05Template.tsx',
  'Step06Template.tsx',
  'Step07Template.tsx',
  'Step08Template.tsx',
  'Step09Template.tsx',
  'Step10Template.tsx',
  'Step11Template.tsx',
  'Step12Template.tsx',
  'Step13Template.tsx',
  'Step14Template.tsx',
  'Step15Template.tsx',
  'Step16Template.tsx',
  'Step17Template.tsx',
  'Step18Template.tsx',
  'Step19Template.tsx',
  'Step20Template.tsx',
  'Step21Template.tsx',
];

const basePath = '/workspaces/quiz-quest-challenge-verse/src/components/steps';

stepFiles.forEach(fileName => {
  const filePath = path.join(basePath, fileName);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Arquivo não encontrado: ${fileName}`);
    return;
  }

  console.log(`📝 Processando: ${fileName}`);

  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  // 🎯 PADRONIZAÇÕES APLICADAS:

  // 1. Adicionar marginTop: 0 onde não existe
  if (!content.includes('marginTop:') && content.includes('properties:')) {
    content = content.replace(
      /(\s+)(properties:\s*\{[^}]*?)(\s*\})/gs,
      (match, indent, props, closing) => {
        if (!props.includes('marginTop:')) {
          return `${indent}${props},${indent.slice(0, -2)}marginTop: 0${closing}`;
        }
        return match;
      }
    );
    hasChanges = true;
  }

  // 2. Adicionar marginBottom: 0 onde não existe
  if (!content.includes('marginBottom:') && content.includes('properties:')) {
    content = content.replace(
      /(\s+)(properties:\s*\{[^}]*?)(\s*\})/gs,
      (match, indent, props, closing) => {
        if (!props.includes('marginBottom:')) {
          return `${indent}${props},${indent.slice(0, -2)}marginBottom: 0${closing}`;
        }
        return match;
      }
    );
    hasChanges = true;
  }

  // 3. Adicionar spacing: "small" onde não existe
  if (!content.includes('spacing:') && content.includes('properties:')) {
    content = content.replace(
      /(\s+)(properties:\s*\{[^}]*?)(\s*\})/gs,
      (match, indent, props, closing) => {
        if (!props.includes('spacing:')) {
          return `${indent}${props},${indent.slice(0, -2)}spacing: "small"${closing}`;
        }
        return match;
      }
    );
    hasChanges = true;
  }

  // 4. Substituir valores específicos por padrão (preservando valores intencionais como separadores)
  const replacements = [
    // Margem superior pequenas -> 0
    { from: /marginTop:\s*[1-8](?![0-9])/g, to: 'marginTop: 0' },
    // Margem inferior pequenas -> 0
    { from: /marginBottom:\s*[1-8](?![0-9])/g, to: 'marginBottom: 0' },
    // Spacing normal -> small
    { from: /spacing:\s*"normal"/g, to: 'spacing: "small"' },
    // Spacing compact -> small
    { from: /spacing:\s*"compact"/g, to: 'spacing: "small"' },
  ];

  replacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      hasChanges = true;
    }
  });

  // 5. Salvar arquivo se houve mudanças
  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${fileName} - Atualizado`);
  } else {
    console.log(`ℹ️ ${fileName} - Sem alterações necessárias`);
  }
});

console.log('🎉 Padronização completa! Todas as Steps foram processadas.');
console.log('');
console.log('📋 PADRONIZAÇÕES APLICADAS:');
console.log('- marginTop: 0 (padrão)');
console.log('- marginBottom: 0 (padrão)');
console.log('- spacing: "small" (0.75rem)');
console.log('- Preservadas margens intencionais (>= 10px)');
