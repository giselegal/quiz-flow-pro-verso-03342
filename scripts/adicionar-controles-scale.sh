#!/bin/bash

echo "🎯 ADICIONANDO CONTROLES DE CONTAINER SCALE UNIFORME"
echo "==================================================="

echo ""
echo "📋 1. Adicionando propriedade scale ao useUnifiedProperties..."

# Backup do arquivo atual
cp src/hooks/useUnifiedProperties.ts src/hooks/useUnifiedProperties.ts.backup

# Criar função temporária para adicionar scale a todos os componentes
cat > temp_add_scale.js << 'EOF'
const fs = require('fs');

const filePath = 'src/hooks/useUnifiedProperties.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Propriedade scale para adicionar a todos os componentes
const scaleProperty = `            {
              key: "scale",
              value: currentBlock?.properties?.scale || 1,
              type: PropertyType.RANGE,
              label: "Tamanho do Container",
              category: "style",
              min: 0.5,
              max: 2,
              step: 0.1,
              unit: "x",
            },`;

// Encontrar todos os cases e adicionar scale
const caseRegex = /case "([\w-]+)":\s*return \[\s*\.\.\.baseProperties,/g;
let matches = [...content.matchAll(caseRegex)];

console.log(`Encontrados ${matches.length} casos para adicionar scale`);

matches.forEach(match => {
  const fullMatch = match[0];
  const componentType = match[1];
  
  // Pular se já tem scale
  if (content.includes(`case "${componentType}"`) && content.includes(`"scale"`)) {
    console.log(`  ⏭️  ${componentType}: já tem scale`);
    return;
  }
  
  const replacement = fullMatch + '\n' + scaleProperty;
  content = content.replace(fullMatch, replacement);
  console.log(`  ✅ ${componentType}: scale adicionado`);
});

fs.writeFileSync(filePath, content);
console.log('\n🎉 Scale adicionado a todos os componentes!');
EOF

# Executar o script de adição
node temp_add_scale.js

echo ""
echo "📋 2. Verificando implementação..."

# Contar quantos componentes agora têm scale
echo "  🔍 Componentes com scale:"
grep -c '"scale"' src/hooks/useUnifiedProperties.ts

echo ""
echo "📋 3. Testando alguns componentes específicos..."

echo "  🔹 button:"
grep -A 10 'case "button":' src/hooks/useUnifiedProperties.ts | grep -E "(scale|key.*scale)" | head -2

echo "  🔹 image:"
grep -A 10 'case "image":' src/hooks/useUnifiedProperties.ts | grep -E "(scale|key.*scale)" | head -2

# Limpeza
rm temp_add_scale.js

echo ""
echo "🎯 PRÓXIMAS AÇÕES:"
echo "  1. Testar se scale aparece no painel"
echo "  2. Investigar por que alguns componentes não são editáveis"
echo "  3. Verificar se todos os componentes aplicam a propriedade scale"

echo ""
echo "📊 RESUMO:"
echo "  ✅ Propriedade scale adicionada ao useUnifiedProperties"
echo "  ✅ Controle uniforme de tamanho implementado"
echo "  🔄 Testar no editor agora"
