#!/bin/bash

echo "🔍 DIAGNÓSTICO: POR QUE APENAS TEXT E HEADING SÃO EDITÁVEIS?"
echo "============================================================="

echo ""
echo "📋 1. Verificando estructura do EnhancedUniversalPropertiesPanel..."

# Verificar se o painel trata todos os tipos de propriedades corretamente
echo "  🔹 Tipos de propriedades implementados no painel:"
grep "case PropertyType\." src/components/universal/EnhancedUniversalPropertiesPanel.tsx | wc -l

echo ""
echo "📋 2. Verificando como o painel recebe as propriedades..."

# Verificar se há logs de debug no painel
echo "  🔹 Logs de debug no painel:"
grep -c "console.log" src/components/universal/EnhancedUniversalPropertiesPanel.tsx

echo ""
echo "📋 3. Verificando se o hook useUnifiedProperties está sendo usado corretamente..."

# Verificar se o painel usa o hook corretamente
echo "  🔹 Uso do useUnifiedProperties no painel:"
grep -A 5 -B 5 "useUnifiedProperties" src/components/universal/EnhancedUniversalPropertiesPanel.tsx

echo ""
echo "📋 4. Testando componentes específicos no hook..."

echo "  🔹 Componente button no hook:"
grep -A 15 'case "button":' src/hooks/useUnifiedProperties.ts | head -10

echo ""
echo "  🔹 Componente image no hook:"
grep -A 15 'case "image":' src/hooks/useUnifiedProperties.ts | head -10

echo ""
echo "📋 5. Verificando se há erros de TypeScript..."

# Fazer uma verificação básica do TypeScript
echo "  🔹 Verificando compilação:"
npm run build 2>&1 | tail -5

echo ""
echo "🎯 HIPÓTESES DO PROBLEMA:"
echo "  1. ❓ Hook retorna propriedades mas painel não as renderiza"
echo "  2. ❓ Problema na comunicação entre hook e painel"
echo "  3. ❓ Componentes button/image não estão sendo registrados corretamente"
echo "  4. ❓ Problemas de tipo/interface entre hook e painel"

echo ""
echo "📊 PRÓXIMOS PASSOS:"
echo "  1. Adicionar logs de debug detalhados"
echo "  2. Testar componente button manualmente"
echo "  3. Verificar se o problema está no lado do hook ou do painel"
