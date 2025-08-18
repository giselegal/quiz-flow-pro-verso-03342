#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 ANÁLISE DO CANVAS MOBILE DO EDITOR\n');

// Análise do PageEditorCanvas.tsx
const canvasPath =
  '/workspaces/quiz-quest-challenge-verse/client/src/components/editor/PageEditorCanvas.tsx';
const cssPath =
  '/workspaces/quiz-quest-challenge-verse/client/src/styles/editor/editor-modular.module.css';

console.log('📁 Verificando arquivos...');

if (!fs.existsSync(canvasPath)) {
  console.log('❌ PageEditorCanvas.tsx não encontrado');
  process.exit(1);
}

if (!fs.existsSync(cssPath)) {
  console.log('❌ editor-modular.module.css não encontrado');
  process.exit(1);
}

console.log('✅ Arquivos encontrados\n');

// Ler o conteúdo dos arquivos
const canvasContent = fs.readFileSync(canvasPath, 'utf8');
const cssContent = fs.readFileSync(cssPath, 'utf8');

console.log('🎯 PROBLEMAS IDENTIFICADOS:\n');

// 1. Verificar classes CSS faltantes
const requiredClasses = [
  'canvasContainer',
  'canvasPreview',
  'mobilePreview',
  'tabletPreview',
  'desktopPreview',
  'pageCard',
  'pageScrollArea',
  'pageContent',
  'pageHeader',
  'pageTitle',
  'emptyCanvas',
  'emptyCanvasText',
  'componentsContainer',
  'pageProgress',
  'progressBar',
  'progressFill',
  'progressText',
  'componentContainer',
  'componentWrapper',
  'componentPreview',
  'actionButton',
  'actionIcon',
  'selected',
  'canvasHeader',
  'deviceBadge',
];

const missingClasses = [];
requiredClasses.forEach(className => {
  if (!cssContent.includes(`.${className}`)) {
    missingClasses.push(className);
  }
});

if (missingClasses.length > 0) {
  console.log('❌ CLASSES CSS FALTANTES:');
  missingClasses.forEach(cls => {
    console.log(`   - .${cls}`);
  });
  console.log('');
}

// 2. Verificar responsividade mobile
console.log('📱 ANÁLISE DE RESPONSIVIDADE MOBILE:\n');

const mobileIssues = [];

// Verificar se há breakpoints responsivos
if (!cssContent.includes('@media')) {
  mobileIssues.push('Nenhuma media query encontrada para responsividade');
}

// Verificar larguras fixas problemáticas
const fixedWidthRegex = /width:\s*\d+(px|rem|em)/g;
const fixedWidths = cssContent.match(fixedWidthRegex) || [];
if (fixedWidths.length > 0) {
  mobileIssues.push(
    `Larguras fixas encontradas: ${fixedWidths.slice(0, 3).join(', ')}${fixedWidths.length > 3 ? '...' : ''}`
  );
}

// Verificar se o canvas mobile tem configuração adequada
if (!cssContent.includes('canvasPreviewFrameMobile')) {
  mobileIssues.push('Configuração específica para canvas mobile não encontrada');
}

if (mobileIssues.length > 0) {
  console.log('⚠️  PROBLEMAS DE RESPONSIVIDADE:');
  mobileIssues.forEach(issue => {
    console.log(`   - ${issue}`);
  });
  console.log('');
}

// 3. Verificar estrutura do componente Canvas
console.log('🏗️  ANÁLISE DA ESTRUTURA DO CANVAS:\n');

const structureIssues = [];

// Verificar se getDeviceClasses está corretamente implementado
if (!canvasContent.includes('getDeviceClasses')) {
  structureIssues.push('Função getDeviceClasses não encontrada');
}

// Verificar se o deviceView está sendo usado
if (!canvasContent.includes('deviceView')) {
  structureIssues.push('Prop deviceView não está sendo utilizada');
}

// Verificar se há renderização condicional para mobile
if (!canvasContent.includes('mobile') && !canvasContent.includes('Mobile')) {
  structureIssues.push('Nenhuma lógica específica para mobile encontrada');
}

if (structureIssues.length > 0) {
  console.log('❌ PROBLEMAS DE ESTRUTURA:');
  structureIssues.forEach(issue => {
    console.log(`   - ${issue}`);
  });
  console.log('');
}

// 4. Verificar se as classes usadas no JSX existem no CSS
console.log('🔗 VERIFICAÇÃO DE CONSISTÊNCIA JSX ↔ CSS:\n');

const classMatches = canvasContent.match(/styles\.(\w+)/g) || [];
const usedClasses = [...new Set(classMatches.map(match => match.replace('styles.', '')))];

const inconsistencies = [];
usedClasses.forEach(className => {
  if (!cssContent.includes(`.${className}`)) {
    inconsistencies.push(className);
  }
});

if (inconsistencies.length > 0) {
  console.log('❌ CLASSES USADAS MAS NÃO DEFINIDAS:');
  inconsistencies.forEach(cls => {
    console.log(`   - styles.${cls}`);
  });
  console.log('');
}

// 5. Sugestões de melhorias
console.log('💡 SUGESTÕES DE MELHORIAS:\n');

console.log('1. ✨ Adicionar classes CSS faltantes:');
console.log('   - Criar todas as classes necessárias no editor-modular.module.css');

console.log('\n2. 📱 Melhorar responsividade mobile:');
console.log('   - Adicionar media queries específicas para mobile');
console.log('   - Usar unidades relativas (%, vw, vh) em vez de px fixos');
console.log('   - Implementar layout flexível para diferentes tamanhos de tela');

console.log('\n3. 🎛️ Otimizar controles mobile:');
console.log('   - Aumentar área de toque para botões');
console.log('   - Adicionar gestos de swipe se necessário');
console.log('   - Melhorar feedback visual para interações touch');

console.log('\n4. 🔧 Corrigir inconsistências:');
console.log('   - Sincronizar classes CSS com uso no JSX');
console.log('   - Implementar fallbacks para diferentes tamanhos de tela');

console.log('\n🏁 ANÁLISE CONCLUÍDA!');

// Gerar score de problemas
const totalIssues =
  missingClasses.length + mobileIssues.length + structureIssues.length + inconsistencies.length;
const score = Math.max(0, 100 - totalIssues * 5);

console.log(`\n📊 SCORE DE QUALIDADE MOBILE: ${score}/100`);

if (score >= 90) {
  console.log('🟢 Excelente - Canvas mobile está bem implementado');
} else if (score >= 70) {
  console.log('🟡 Bom - Alguns ajustes necessários para melhor experiência mobile');
} else if (score >= 50) {
  console.log('🟠 Regular - Vários problemas precisam ser corrigidos');
} else {
  console.log('🔴 Crítico - Canvas mobile precisa de refatoração completa');
}
