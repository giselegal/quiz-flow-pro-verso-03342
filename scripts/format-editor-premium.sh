#!/bin/bash

echo "🎨 FORMATAÇÃO PREMIUM: Editor Fixed"
echo "==================================="

# 1. Backup antes da formatação
echo "📋 Criando backup..."
cp -r src/pages/editor-fixed* backup/ 2>/dev/null || mkdir -p backup && cp -r src/pages/editor-fixed* backup/
cp src/components/editor/OptimizedPropertiesPanel.tsx backup/ 2>/dev/null

# 2. Formatação com configuração premium
echo "✨ Aplicando formatação premium..."
npx prettier --config .prettierrc.super-beautiful.json --write "src/**/*editor-fixed*"
npx prettier --config .prettierrc.super-beautiful.json --write "src/components/editor/OptimizedPropertiesPanel.tsx"

# 3. Organizar imports (se plugin instalado)
echo "🔄 Organizando imports..."
npx prettier --config .prettierrc.with-plugins --write "src/**/*editor-fixed*" 2>/dev/null || echo "Plugin de imports não instalado"

# 4. Verificar resultado
echo "🔍 Verificando qualidade..."
if npx prettier --check "src/**/*editor-fixed*"; then
    echo "✅ Formatação perfeita!"
else
    echo "⚠️ Corrigindo problemas de formatação..."
    npx prettier --write "src/**/*editor-fixed*"
    echo "✅ Formatação corrigida com sucesso!"
fi

echo "🎉 Formatação premium concluída!"
