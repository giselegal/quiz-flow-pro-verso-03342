#!/bin/bash

# Verificar tipos de propriedades usados no hook vs implementados no painel

echo "🔍 AUDITORIA DE TIPOS DE PROPRIEDADES"
echo "======================================"

echo ""
echo "📋 Tipos usados no useUnifiedProperties:"
grep -o "PropertyType\.[A-Z_]*" src/hooks/useUnifiedProperties.ts | sort | uniq -c | sort -nr

echo ""
echo "📋 Tipos implementados no EnhancedUniversalPropertiesPanel:"
grep -o "case PropertyType\.[A-Z_]*:" src/components/universal/EnhancedUniversalPropertiesPanel.tsx | sed 's/case PropertyType\.//g' | sed 's/://g' | sort | uniq

echo ""
echo "📋 Componentes que usam tipos não implementados:"

# Verificar componentes específicos que podem ter problemas
echo ""
echo "🔍 Analisando componentes principais:"

# Button component
echo "  🔹 button:"
grep -A 30 'case "button":' src/hooks/useUnifiedProperties.ts | grep "PropertyType\." | head -5

echo "  🔹 image:"
grep -A 30 'case "image":' src/hooks/useUnifiedProperties.ts | grep "PropertyType\." | head -5

echo "  🔹 container:"
grep -A 20 'case "container":' src/hooks/useUnifiedProperties.ts | grep "PropertyType\." | head -5

echo ""
echo "📊 RESUMO:"
echo "  ✅ text e heading: funcionam"
echo "  ❓ button, image, container: verificar implementação"

echo ""
echo "🎯 PRÓXIMAS AÇÕES:"
echo "  1. Implementar tipos faltantes no painel"
echo "  2. Adicionar controles de container scale/size"
echo "  3. Testar todos os componentes"
