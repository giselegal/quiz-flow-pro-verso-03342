#!/bin/bash

# 🎨 FORMATAÇÃO COM PRETTIER: Editor Fixed
echo "🎨 FORMATANDO EDITOR-FIXED COM PRETTIER"
echo "======================================="
echo ""

echo "📁 ARQUIVOS DO EDITOR-FIXED ENCONTRADOS:"
echo ""

# Listar arquivos do editor-fixed
find src -name "*editor-fixed*" -type f | while read file; do
    echo "   📄 $file"
done

echo ""
echo "🔧 EXECUTANDO FORMATAÇÃO PRETTIER..."
echo ""

# Formatar arquivos específicos do editor-fixed
echo "1. 📝 Formatando página principal:"
if [ -f "src/pages/editor-fixed-dragdrop.tsx" ]; then
    prettier --write src/pages/editor-fixed-dragdrop.tsx
    echo "   ✅ editor-fixed-dragdrop.tsx formatado"
else
    echo "   ❌ editor-fixed-dragdrop.tsx não encontrado"
fi

echo ""
echo "2. 🎛️ Formatando OptimizedPropertiesPanel:"
if [ -f "src/components/editor/OptimizedPropertiesPanel.tsx" ]; then
    prettier --write src/components/editor/OptimizedPropertiesPanel.tsx
    echo "   ✅ OptimizedPropertiesPanel.tsx formatado"
else
    echo "   ❌ OptimizedPropertiesPanel.tsx não encontrado"
fi

echo ""
echo "3. 🖥️ Formatando componentes do editor:"
find src/components/editor -name "*.tsx" -type f | while read file; do
    prettier --write "$file"
    echo "   ✅ $(basename "$file") formatado"
done

echo ""
echo "4. 📱 Formatando páginas admin/editor:"
find src/pages/admin -name "*ditor*" -type f | while read file; do
    prettier --write "$file"
    echo "   ✅ $(basename "$file") formatado"
done

echo ""
echo "🎯 CONFIGURAÇÃO PRETTIER RECOMENDADA:"
echo "======================================"

# Criar configuração otimizada para React/TypeScript
cat > .prettierrc.editor-optimized << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "jsxSingleQuote": false,
  "quoteProps": "as-needed"
}
EOF

echo "✅ Configuração otimizada criada: .prettierrc.editor-optimized"
echo ""

echo "📋 COMANDOS ÚTEIS PRETTIER:"
echo "=========================="
echo ""
echo "🚀 Formatar todo o projeto:"
echo "   npm run format"
echo ""
echo "🔍 Verificar formatação (sem alterar):"
echo "   npm run format:check"
echo ""
echo "🎯 Formatar apenas editor-fixed:"
echo "   prettier --write 'src/**/*editor-fixed*'"
echo ""
echo "📱 Formatar componentes específicos:"
echo "   prettier --write src/components/editor/"
echo ""
echo "⚡ Formatar e assistir mudanças:"
echo "   prettier --write --watch 'src/**/*.{ts,tsx}'"
echo ""

echo "💡 DICAS PARA EDITOR-FIXED:"
echo "=========================="
echo ""
echo "1. 🎨 Configurar auto-format no VS Code:"
echo "   - Abra Settings (Ctrl+,)"
echo "   - Procure 'format on save'"
echo "   - Ative 'Editor: Format On Save'"
echo ""
echo "2. 🔧 Comando manual no VS Code:"
echo "   - Shift+Alt+F (formatar documento)"
echo "   - Ctrl+Shift+P → 'Format Document'"
echo ""
echo "3. 📝 Integração com git:"
echo "   - Pre-commit hook para auto-format"
echo "   - Evita commits com código mal formatado"
echo ""

echo "🎉 FORMATAÇÃO CONCLUÍDA!"
echo "Todos os arquivos do editor-fixed foram formatados com Prettier!"
