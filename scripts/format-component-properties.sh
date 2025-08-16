#!/bin/bash

echo "🎛️ FORMATAÇÃO AVANÇADA: Propriedades de Componentes"
echo "=================================================="

# 1. Formatar com configuração específica para propriedades
echo "🔧 Aplicando formatação de propriedades..."
npx prettier --config .prettierrc.properties.json --write "src/**/*editor-fixed*"
npx prettier --config .prettierrc.properties.json --write "src/components/editor/OptimizedPropertiesPanel.tsx"

# 2. Formatar componentes com configuração específica
echo "🎨 Aplicando formatação de componentes..."
npx prettier --config .prettierrc.editor-components.json --write "src/components/editor/blocks/**/*.tsx"

# 3. Verificar resultado
echo "🔍 Verificando formatação de propriedades..."
npx prettier --config .prettierrc.properties.json --check "src/**/*editor-fixed*" && echo "✅ Propriedades formatadas!" || echo "⚠️ Problemas detectados"

echo "🎉 Formatação de propriedades concluída!"
