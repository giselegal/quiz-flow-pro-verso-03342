const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/templates/quiz21-complete.json', 'utf8'));
const step20 = data.steps['step-20'];

console.log('🔍 ANÁLISE DE PONTOS CEGOS - STEP-20\n');
console.log('='.repeat(70));

// 1. VERIFICAR IDs DUPLICADOS
console.log('\n1️⃣ VERIFICAÇÃO DE IDs DUPLICADOS:\n');
const ids = step20.blocks.map(b => b.id);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicates.length > 0) {
  console.log('❌ IDs DUPLICADOS ENCONTRADOS:', [...new Set(duplicates)]);
} else {
  console.log('✅ Nenhum ID duplicado');
}

// 2. VERIFICAR ORDEM DOS BLOCOS
console.log('\n2️⃣ VERIFICAÇÃO DA ORDEM:\n');
const orders = step20.blocks.map((b, i) => ({ index: i, id: b.id, order: b.order }));
const sortedOrders = [...orders].sort((a, b) => a.order - b.order);
let orderIssues = false;
sortedOrders.forEach((item, i) => {
  if (item.index !== i) {
    console.log(`⚠️  Bloco "${item.id}" está fora de ordem:`);
    console.log(`   Posição atual: ${item.index}, Order: ${item.order}, Deveria estar em: ${i}`);
    orderIssues = true;
  }
});
if (!orderIssues) {
  console.log('✅ Todos os blocos estão na ordem correta');
}

// 3. VERIFICAR PROPRIEDADES ESSENCIAIS
console.log('\n3️⃣ VERIFICAÇÃO DE PROPRIEDADES ESSENCIAIS:\n');
step20.blocks.forEach((block, index) => {
  const issues = [];
  
  if (!block.id) issues.push('sem ID');
  if (!block.type) issues.push('sem type');
  if (block.order === undefined) issues.push('sem order');
  
  // Verificar se enabled está explícito
  const enabled = block.properties?.enabled !== false;
  if (!enabled) issues.push('DESABILITADO');
  
  if (issues.length > 0) {
    console.log(`❌ Bloco ${index + 1}: ${block.id || 'SEM ID'} - ${issues.join(', ')}`);
  }
});
console.log('✅ Verificação de propriedades concluída');

// 4. VERIFICAR TIPOS DE BLOCO vs COMPONENTES REGISTRADOS
console.log('\n4️⃣ TIPOS DE BLOCO vs COMPONENTES:\n');
const registeredComponents = {
  'result-congrats': 'ResultCongratsBlock.tsx',
  'quiz-score-display': 'QuizScoreDisplay.tsx',
  'result-main': 'ResultMainBlock.tsx',
  'result-progress-bars': 'ResultProgressBarsBlock.tsx',
  'result-secondary-styles': 'ResultSecondaryStylesBlock.tsx',
  'result-image': 'ResultImageBlock.tsx',
  'result-description': 'ResultDescriptionBlock.tsx',
  'result-cta': 'ResultCTABlock.tsx',
  'result-share': 'ResultShareBlock.tsx',
  'text-inline': 'TextInlineBlock.tsx'
};

const uniqueTypes = [...new Set(step20.blocks.map(b => b.type))];
uniqueTypes.forEach(type => {
  const count = step20.blocks.filter(b => b.type === type).length;
  if (registeredComponents[type]) {
    console.log(`✅ ${type} (${count}x) → ${registeredComponents[type]}`);
  } else {
    console.log(`❌ ${type} (${count}x) → COMPONENTE NÃO REGISTRADO!`);
  }
});

// 5. VERIFICAR PARENTID (VIRTUALIZAÇÃO)
console.log('\n5️⃣ VERIFICAÇÃO DE PARENTID (Aninhamento/Virtualização):\n');
const withParent = step20.blocks.filter(b => b.parentId);
const withoutParent = step20.blocks.filter(b => !b.parentId || b.parentId === null);

console.log(`Total de blocos: ${step20.blocks.length}`);
console.log(`Blocos raiz (sem parent): ${withoutParent.length}`);
console.log(`Blocos aninhados (com parent): ${withParent.length}`);

if (withParent.length > 0) {
  console.log('\n⚠️  BLOCOS ANINHADOS ENCONTRADOS:');
  withParent.forEach(b => {
    const parent = step20.blocks.find(p => p.id === b.parentId);
    if (parent) {
      console.log(`   ${b.id} → filho de ${b.parentId} (${parent.type})`);
    } else {
      console.log(`   ❌ ${b.id} → parent "${b.parentId}" NÃO EXISTE!`);
    }
  });
} else {
  console.log('✅ Todos os blocos são de nível raiz (não há aninhamento)');
}

// 6. VERIFICAR VARIÁVEIS DINÂMICAS
console.log('\n6️⃣ VARIÁVEIS DINÂMICAS NOS BLOCOS:\n');
const varsPattern = /\{(\w+)\}/g;
let varsFound = [];

function findVars(obj, path = '') {
  if (typeof obj === 'string') {
    let match;
    while ((match = varsPattern.exec(obj)) !== null) {
      varsFound.push({ var: match[1], path, value: obj });
    }
  } else if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach(key => {
      findVars(obj[key], path ? `${path}.${key}` : key);
    });
  }
}

step20.blocks.forEach((block, i) => {
  findVars(block, `blocks[${i}].${block.id}`);
});

if (varsFound.length > 0) {
  console.log(`📝 ${varsFound.length} variáveis dinâmicas encontradas:`);
  const groupedVars = {};
  varsFound.forEach(v => {
    if (!groupedVars[v.var]) groupedVars[v.var] = 0;
    groupedVars[v.var]++;
  });
  Object.entries(groupedVars).forEach(([varName, count]) => {
    console.log(`   {${varName}} usado ${count}x`);
  });
} else {
  console.log('ℹ️  Nenhuma variável dinâmica encontrada');
}

// 7. VERIFICAR BLOCOS COM CONTENT vs PROPS
console.log('\n7️⃣ CONTENT vs PROPS:\n');
const withContent = step20.blocks.filter(b => b.content && Object.keys(b.content).length > 0);
const withProps = step20.blocks.filter(b => b.properties?.props);

console.log(`Blocos com content: ${withContent.length}`);
console.log(`Blocos com properties.props: ${withProps.length}`);

withContent.forEach(b => {
  console.log(`   ${b.type} (${b.id}): content = ${Object.keys(b.content).join(', ')}`);
});

// 8. RESUMO FINAL
console.log('\n' + '='.repeat(70));
console.log('📊 RESUMO DA ANÁLISE:\n');
console.log(`✅ Total de blocos: ${step20.blocks.length}`);
console.log(`✅ Blocos habilitados: ${step20.blocks.filter(b => b.properties?.enabled !== false).length}`);
console.log(`✅ Tipos únicos: ${uniqueTypes.length}`);
console.log(`${duplicates.length === 0 ? '✅' : '❌'} IDs duplicados: ${duplicates.length}`);
console.log(`${orderIssues ? '⚠️' : '✅'} Problemas de ordem: ${orderIssues ? 'SIM' : 'NÃO'}`);
console.log(`${withParent.length > 0 ? '⚠️' : '✅'} Blocos aninhados: ${withParent.length}`);
console.log(`📝 Variáveis dinâmicas: ${varsFound.length}`);
