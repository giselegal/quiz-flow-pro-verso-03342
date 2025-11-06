const fs = require('fs');
const path = require('path');

console.log('\n🔍 VERIFICAÇÃO: Templates HTML vs quiz21-complete.json\n');
console.log('='.repeat(70));

// Carregar JSON
const quiz21Path = path.join(__dirname, '../public/templates/quiz21-complete.json');
const quiz21 = JSON.parse(fs.readFileSync(quiz21Path, 'utf8'));

// Carregar block-complexity-map
const blockMapPath = path.join(__dirname, '../src/config/block-complexity-map.ts');
const blockMapContent = fs.readFileSync(blockMapPath, 'utf8');

// Extrair blocos SIMPLE com seus templates
const simpleBlocksRegex = /'([^']+)':\s*{\s*complexity:\s*'SIMPLE',?\s*.*?template:\s*'([^']+)'/gs;
const simpleBlocks = new Map();
let match;

while ((match = simpleBlocksRegex.exec(blockMapContent)) !== null) {
  simpleBlocks.set(match[1], match[2]);
}

// Templates HTML disponíveis
const templatesDir = path.join(__dirname, '../public/templates/html');
const availableTemplates = fs.existsSync(templatesDir)
  ? fs.readdirSync(templatesDir).filter(f => f.endsWith('.html'))
  : [];

console.log(`\n📁 Templates HTML disponíveis: ${availableTemplates.length}\n`);
availableTemplates.forEach(t => console.log(`   ✅ ${t}`));

// Coletar todos os tipos de blocos usados no quiz21
const usedBlockTypes = new Set();
const simpleBlocksUsed = new Set();
const stepDetails = [];

Object.entries(quiz21.steps).forEach(([stepKey, stepData]) => {
  const blocks = stepData.blocks || stepData.template?.blocks || [];
  
  blocks.forEach(block => {
    usedBlockTypes.add(block.type);
    
    // Verificar se é SIMPLE
    if (simpleBlocks.has(block.type)) {
      simpleBlocksUsed.add(block.type);
      stepDetails.push({
        step: stepKey,
        blockType: block.type,
        blockId: block.id
      });
    }
  });
});

console.log(`\n\n📊 ANÁLISE DOS BLOCOS SIMPLE USADOS NO QUIZ21:\n`);

const problems = [];

if (simpleBlocksUsed.size === 0) {
  console.log(`   ✅ Nenhum bloco SIMPLE sendo usado no quiz21-complete.json`);
  console.log(`   (Todos os blocos são COMPLEX - renderização via React)\n`);
} else {
  simpleBlocksUsed.forEach(blockType => {
    const templateFile = simpleBlocks.get(blockType);
    const templateExists = availableTemplates.includes(templateFile);
    
    if (templateExists) {
      console.log(`   ✅ ${blockType.padEnd(30)} → ${templateFile} (OK)`);
    } else {
      console.log(`   ❌ ${blockType.padEnd(30)} → ${templateFile} (FALTANDO)`);
      problems.push({ blockType, templateFile });
    }
  });

  if (stepDetails.length > 0) {
    console.log(`\n   📍 Localização dos blocos SIMPLE:`);
    stepDetails.slice(0, 10).forEach(d => {
      console.log(`      • ${d.step}: ${d.blockType} (${d.blockId})`);
    });
    if (stepDetails.length > 10) {
      console.log(`      ... e mais ${stepDetails.length - 10} ocorrências`);
    }
  }
}

console.log(`\n\n🔍 BLOCOS SIMPLE MAPEADOS MAS NÃO USADOS:\n`);

let unusedCount = 0;
simpleBlocks.forEach((templateFile, blockType) => {
  if (!simpleBlocksUsed.has(blockType)) {
    const templateExists = availableTemplates.includes(templateFile);
    const status = templateExists ? '✅ Template existe' : '❌ Template faltando';
    console.log(`   ${blockType.padEnd(30)} → ${status}`);
    
    if (!templateExists) {
      unusedCount++;
    }
  }
});

console.log('\n' + '='.repeat(70));
console.log('\n📊 RESUMO:\n');

console.log(`   Blocos SIMPLE mapeados:        ${simpleBlocks.size}`);
console.log(`   Blocos SIMPLE usados no Quiz:  ${simpleBlocksUsed.size}`);
console.log(`   Templates HTML disponíveis:    ${availableTemplates.length}`);
console.log(`   Problemas encontrados:         ${problems.length}`);

if (problems.length > 0) {
  console.log(`\n   Status: ❌ DESINCRONIZADO`);
  console.log(`\n   ⚠️  Templates faltando para blocos USADOS no Quiz21:`);
  problems.forEach(p => {
    console.log(`      • ${p.templateFile} (para bloco ${p.blockType})`);
  });
  console.log(`\n   💡 Ação: Criar os templates HTML ou reclassificar como COMPLEX\n`);
  process.exit(1);
} else {
  console.log(`\n   Status: ✅ SINCRONIZADO`);
  console.log(`   Todos os blocos SIMPLE usados no Quiz21 têm templates HTML!\n`);
  
  if (unusedCount > 0) {
    console.log(`   ⚠️  Nota: ${unusedCount} blocos SIMPLE não usados não têm templates`);
    console.log(`   (Não impacta o Quiz21, mas pode causar problemas futuros)\n`);
  }
  
  process.exit(0);
}
