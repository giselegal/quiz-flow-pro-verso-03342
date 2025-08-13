#!/usr/bin/env node
/**
 * 🔍 SCRIPT DE AUDITORIA COMPLETA - COMPONENTES DO EDITOR
 * 
 * Escaneia todos os componentes disponíveis e gera relatório detalhado
 * para ativação massiva no blockDefinitions.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Configuração de caminhos
const BLOCKS_DIR = path.join(projectRoot, 'src/components/editor/blocks');
const BLOCK_DEFINITIONS_FILE = path.join(projectRoot, 'src/config/blockDefinitions.ts');

console.log('🔍 AUDITORIA COMPLETA DE COMPONENTES DO EDITOR');
console.log('='.repeat(60));

// 1. Escanear arquivos físicos
function scanPhysicalComponents() {
  const components = [];
  const files = fs.readdirSync(BLOCKS_DIR, { withFileTypes: true });
  
  for (const file of files) {
    if (file.isFile() && file.name.endsWith('.tsx')) {
      const filePath = path.join(BLOCKS_DIR, file.name);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Extrair nome do componente
      const componentMatch = content.match(/^export\s+(?:default\s+)?(?:const|function)\s+(\w+)/m);
      const exportDefaultMatch = content.match(/export\s+default\s+(\w+)/);
      
      const componentName = componentMatch ? componentMatch[1] : 
                           exportDefaultMatch ? exportDefaultMatch[1] : 
                           file.name.replace('.tsx', '');
      
      // Verificar categoria baseada no nome
      const category = inferCategory(componentName);
      
      // Verificar se tem props interface
      const hasPropsInterface = content.includes('Props') || content.includes('interface');
      
      components.push({
        fileName: file.name,
        componentName,
        filePath,
        category,
        hasPropsInterface,
        fileSize: fs.statSync(filePath).size,
        lastModified: fs.statSync(filePath).mtime
      });
    }
  }
  
  return components.sort((a, b) => a.componentName.localeCompare(b.componentName));
}

// 2. Analisar componentes já conectados
function analyzeConnectedComponents() {
  const content = fs.readFileSync(BLOCK_DEFINITIONS_FILE, 'utf-8');
  
  // Extrair imports
  const importMatches = content.match(/import\s+\w+\s+from\s+'[^']+'/g) || [];
  const imports = importMatches.map(imp => {
    const match = imp.match(/import\s+(\w+)/);
    return match ? match[1] : null;
  }).filter(Boolean);
  
  // Extrair definições de bloco
  const blockMatches = content.match(/{\s*type:\s*'([^']+)'[\s\S]*?}/g) || [];
  const connectedBlocks = blockMatches.map(block => {
    const typeMatch = block.match(/type:\s*'([^']+)'/);
    const componentMatch = block.match(/component:\s*(\w+)/);
    
    return {
      type: typeMatch ? typeMatch[1] : null,
      component: componentMatch ? componentMatch[1] : null
    };
  }).filter(block => block.type && block.component);
  
  return { imports, connectedBlocks };
}

// 3. Inferir categoria do componente
function inferCategory(componentName) {
  const name = componentName.toLowerCase();
  
  if (name.includes('quiz') || name.includes('question')) return 'quiz';
  if (name.includes('text') || name.includes('heading') || name.includes('title')) return 'text';
  if (name.includes('button') || name.includes('cta') || name.includes('call')) return 'action';
  if (name.includes('image') || name.includes('video') || name.includes('media')) return 'media';
  if (name.includes('form') || name.includes('input')) return 'forms';
  if (name.includes('pricing') || name.includes('price')) return 'pricing';
  if (name.includes('testimonial') || name.includes('review')) return 'social-proof';
  if (name.includes('faq') || name.includes('question')) return 'faq';
  if (name.includes('countdown') || name.includes('timer')) return 'urgency';
  if (name.includes('chart') || name.includes('stats') || name.includes('metrics')) return 'analytics';
  if (name.includes('carousel') || name.includes('gallery')) return 'gallery';
  if (name.includes('spacer') || name.includes('divider')) return 'layout';
  if (name.includes('progress') || name.includes('loader')) return 'feedback';
  if (name.includes('result') || name.includes('offer')) return 'conversion';
  
  return 'misc';
}

// 4. Gerar relatório
function generateReport() {
  console.log('\n📊 ESCANEANDO COMPONENTES...\n');
  
  const physicalComponents = scanPhysicalComponents();
  const { imports, connectedBlocks } = analyzeConnectedComponents();
  
  console.log(`✅ COMPONENTES FÍSICOS ENCONTRADOS: ${physicalComponents.length}`);
  console.log(`✅ COMPONENTES CONECTADOS: ${connectedBlocks.length}`);
  console.log(`📦 IMPORTS NO BLOCKDEFINITIONS: ${imports.length}\n`);
  
  // Categorizar componentes
  const categories = {};
  physicalComponents.forEach(comp => {
    if (!categories[comp.category]) categories[comp.category] = [];
    categories[comp.category].push(comp);
  });
  
  console.log('📁 COMPONENTES POR CATEGORIA:');
  console.log('-'.repeat(40));
  Object.entries(categories).forEach(([category, components]) => {
    console.log(`${category.toUpperCase()}: ${components.length} componentes`);
    components.slice(0, 3).forEach(comp => {
      console.log(`  • ${comp.componentName}`);
    });
    if (components.length > 3) {
      console.log(`  ... e mais ${components.length - 3}`);
    }
    console.log();
  });
  
  // Componentes não conectados
  const connectedNames = new Set(connectedBlocks.map(b => b.component));
  const unconnected = physicalComponents.filter(comp => !connectedNames.has(comp.componentName));
  
  console.log('⚠️ COMPONENTES NÃO CONECTADOS:');
  console.log('-'.repeat(40));
  console.log(`Total: ${unconnected.length} de ${physicalComponents.length} (${Math.round((unconnected.length/physicalComponents.length)*100)}% não conectados)`);
  
  // Top 10 componentes não conectados por categoria
  const unconnectedByCategory = {};
  unconnected.forEach(comp => {
    if (!unconnectedByCategory[comp.category]) unconnectedByCategory[comp.category] = [];
    unconnectedByCategory[comp.category].push(comp.componentName);
  });
  
  Object.entries(unconnectedByCategory).forEach(([category, components]) => {
    console.log(`\n${category.toUpperCase()}: ${components.length} componentes`);
    components.slice(0, 5).forEach(comp => console.log(`  • ${comp}`));
    if (components.length > 5) console.log(`  ... e mais ${components.length - 5}`);
  });
  
  // Estatísticas finais
  console.log('\n📈 ESTATÍSTICAS FINAIS:');
  console.log('-'.repeat(40));
  console.log(`Taxa de Conexão: ${Math.round((connectedBlocks.length/physicalComponents.length)*100)}%`);
  console.log(`Potencial de Crescimento: ${unconnected.length} componentes`);
  console.log(`Categorias Disponíveis: ${Object.keys(categories).length}`);
  
  return {
    physicalComponents,
    connectedBlocks,
    unconnected,
    categories,
    stats: {
      total: physicalComponents.length,
      connected: connectedBlocks.length,
      unconnected: unconnected.length,
      connectionRate: Math.round((connectedBlocks.length/physicalComponents.length)*100)
    }
  };
}

// 5. Executar auditoria
const report = generateReport();

console.log('\n🎯 PRÓXIMO PASSO: ATIVAÇÃO MASSIVA');
console.log('-'.repeat(40));
console.log('Execute: npm run activate-components');
console.log(`Isso conectará ${report.stats.unconnected} componentes ao sistema!`);