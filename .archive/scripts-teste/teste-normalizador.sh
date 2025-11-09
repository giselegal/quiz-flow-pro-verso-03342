#!/bin/bash

echo "🧪 TESTANDO CORREÇÃO DO ERRO DE TEMPLATE"
echo "========================================"

# Testar normalizador com diferentes IDs
node -e "
const { normalizeFunnelId } = require('./src/utils/funnelNormalizer.ts');

const testIds = [
  'funnel_1759089203449_5mx9ze724',
  'quiz21StepsComplete',
  'quiz-cores-perfeitas-1758512392351_o1cke0',
  '',
  null,
  undefined
];

console.log('📋 TESTANDO NORMALIZADOR:');
console.log('========================');

testIds.forEach(id => {
  try {
    const result = normalizeFunnelId(id);
    console.log(\`✅ '\${id}' → '\${result.baseId}' (isTemplate: \${result.isTemplate})\`);
  } catch (error) {
    console.log(\`❌ '\${id}' → ERRO: \${error.message}\`);
  }
});
"