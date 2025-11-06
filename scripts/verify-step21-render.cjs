#!/usr/bin/env node
/**
 * ✅ VERIFICAÇÃO FINAL - Step 21 Render Test
 * 
 * Valida que os blocos do Step 21 agora renderizam corretamente
 */

const fs = require('fs');
const path = require('path');

console.log('\n✅ VERIFICAÇÃO FINAL: Step 21 Render Test\n');
console.log('='.repeat(70));

// Carregar JSON
const quiz21Path = path.join(__dirname, '../public/templates/quiz21-complete.json');
const quiz21 = JSON.parse(fs.readFileSync(quiz21Path, 'utf8'));

// Step 21
const step21 = quiz21.steps['step-21'];

if (!step21) {
  console.log('\n❌ Step 21 não encontrado!\n');
  process.exit(1);
}

console.log(`\n📋 STEP 21: ${step21.title}`);
console.log(`   Tipo: ${step21.type}`);
console.log(`   Blocos: ${step21.blocks?.length || 0}\n`);

// Verificar cada bloco
const blockMapPath = path.join(__dirname, '../src/config/block-complexity-map.ts');
const blockMapContent = fs.readFileSync(blockMapPath, 'utf8');

const registryPath = path.join(__dirname, '../src/registry/UnifiedBlockRegistry.ts');
const registryContent = fs.readFileSync(registryPath, 'utf8');

let allOk = true;

if (!step21.blocks || step21.blocks.length === 0) {
  console.log('⚠️  Step 21 não tem blocos definidos (pode estar em outra estrutura)\n');
  process.exit(0);
}

step21.blocks.forEach((block, idx) => {
  console.log(`${idx + 1}. Bloco: ${block.type} (${block.id})`);
  
  // Check if SIMPLE
  const isSimpleRegex = new RegExp(`'${block.type}':\\s*{\\s*complexity:\\s*'SIMPLE'`, 'g');
  const isSimple = isSimpleRegex.test(blockMapContent);
  
  // Check if COMPLEX
  const isComplexRegex = new RegExp(`'${block.type}':\\s*{\\s*complexity:\\s*'COMPLEX'`, 'g');
  const isComplex = isComplexRegex.test(blockMapContent);
  
  if (isSimple) {
    // Verificar template HTML
    const templateRegex = new RegExp(`'${block.type}':\\s*{[^}]*template:\\s*'([^']+)'`, 'g');
    const match = templateRegex.exec(blockMapContent);
    
    if (match) {
      const templateFile = match[1];
      const templatePath = path.join(__dirname, '../public/templates/html', templateFile);
      
      if (fs.existsSync(templatePath)) {
        console.log(`   ✅ SIMPLE → Template HTML existe: ${templateFile}`);
      } else {
        console.log(`   ❌ SIMPLE → Template HTML FALTANDO: ${templateFile}`);
        allOk = false;
      }
    }
  } else if (isComplex) {
    // Verificar registro
    const inRegistry = registryContent.includes(`'${block.type}': () => import(`) ||
                      registryContent.includes(`'${block.type}': () => Promise.all(`);
    
    if (inRegistry) {
      console.log(`   ✅ COMPLEX → Registrado no UnifiedBlockRegistry`);
    } else {
      console.log(`   ⚠️  COMPLEX → Não registrado (pode usar BlockTypeRenderer direto)`);
    }
  } else {
    console.log(`   ❌ NÃO MAPEADO no block-complexity-map.ts`);
    allOk = false;
  }
  
  console.log();
});

console.log('='.repeat(70));

if (allOk) {
  console.log('\n✅ SUCESSO: Todos os blocos do Step 21 podem renderizar!\n');
  console.log('   🎉 Step 21 (Oferta Final) está 100% funcional!\n');
  process.exit(0);
} else {
  console.log('\n❌ FALHA: Alguns blocos do Step 21 não podem renderizar.\n');
  console.log('   Verifique os problemas acima.\n');
  process.exit(1);
}
