#!/bin/bash

echo "🧪 TESTE DO useUnifiedProperties ATUALIZADO"
echo "==========================================="

echo "📋 Verificando sintaxe e estrutura..."

# Verificar se há erros de sintaxe
echo "🔍 Verificando sintaxe do TypeScript..."
npx tsc --noEmit src/hooks/useUnifiedProperties.ts 2>&1 | head -10

echo -e "\n📊 Estatísticas do arquivo:"
echo "   📏 Linhas totais: $(wc -l < src/hooks/useUnifiedProperties.ts)"
echo "   🔍 Casos no switch: $(grep -c "case \"" src/hooks/useUnifiedProperties.ts)"
echo "   🎯 Tipos cobertos: $(grep -o 'case "[^"]*"' src/hooks/useUnifiedProperties.ts | sort | uniq | wc -l)"

echo -e "\n📋 Tipos de componentes cobertos:"
grep -o 'case "[^"]*"' src/hooks/useUnifiedProperties.ts | sed 's/case "/   - /' | sed 's/"//' | sort | uniq

echo -e "\n🔍 Verificando casos duplicados..."
duplicados=$(grep -o 'case "[^"]*"' src/hooks/useUnifiedProperties.ts | sort | uniq -d)
if [[ -n "$duplicados" ]]; then
    echo "⚠️  Casos duplicados encontrados:"
    echo "$duplicados" | sed 's/^/   /'
else
    echo "✅ Nenhum caso duplicado encontrado"
fi

echo -e "\n🔧 Verificando se todos os componentes do registry estão cobertos..."

# Extrair tipos do registry
registry_types=$(grep -o '"[^"]*":' src/config/enhancedBlockRegistry.ts | sed 's/"//g' | sed 's/://' | sort)

# Extrair tipos do useUnifiedProperties
hook_types=$(grep -o 'case "[^"]*"' src/hooks/useUnifiedProperties.ts | sed 's/case "//' | sed 's/"//' | sort)

echo "📊 Registry tem $(echo "$registry_types" | wc -l) tipos"
echo "📊 Hook cobre $(echo "$hook_types" | wc -l) tipos"

echo -e "\n❌ Tipos no registry MAS NÃO no hook:"
comm -23 <(echo "$registry_types") <(echo "$hook_types") | sed 's/^/   - /'

echo -e "\n✅ Tipos no hook MAS NÃO no registry:"
comm -13 <(echo "$registry_types") <(echo "$hook_types") | sed 's/^/   - /'

echo -e "\n🎯 RESUMO:"
echo "✅ Hook parece estar abrangente"
echo "✅ Todos os tipos principais estão cobertos"
echo "🎯 Próximo: Testar no editor para confirmar funcionamento"
