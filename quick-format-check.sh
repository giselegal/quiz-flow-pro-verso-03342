#!/bin/bash

# 🔍 VERIFICAÇÃO RÁPIDA DE FORMATAÇÃO
echo "🔍 VERIFICAÇÃO RÁPIDA: Editor Fixed"
echo "=================================="
echo ""

# 1. Verificar status da formatação
echo "📊 Status atual da formatação:"
if npx prettier --check "src/**/*editor-fixed*" "src/components/editor/OptimizedPropertiesPanel.tsx" 2>/dev/null; then
    echo "✅ Todos os arquivos estão perfeitamente formatados!"
    echo ""
    
    # Mostrar estatísticas
    echo "📈 ESTATÍSTICAS:"
    echo "$(find src -name "*editor-fixed*" -type f | wc -l) arquivos editor-fixed verificados"
    echo "1 arquivo OptimizedPropertiesPanel verificado"
    echo "✨ Código em padrão profissional"
else
    echo "⚠️  Problemas de formatação detectados!"
    echo ""
    
    # Listar arquivos com problemas
    echo "📋 Arquivos que precisam de correção:"
    npx prettier --list-different "src/**/*editor-fixed*" "src/components/editor/OptimizedPropertiesPanel.tsx" 2>/dev/null || echo "Nenhum arquivo específico identificado"
    echo ""
    
    # Oferecer correção automática
    echo "🔧 CORREÇÃO AUTOMÁTICA DISPONÍVEL:"
    echo "Execute um destes comandos:"
    echo ""
    echo "1. Correção rápida:"
    echo "   npx prettier --write \"src/**/*editor-fixed*\""
    echo ""
    echo "2. Formatação premium completa:"
    echo "   ./format-editor-premium.sh"
    echo ""
    echo "3. Correção + verificação:"
    echo "   npm run format && npm run format:check"
fi

echo ""
echo "💡 DICAS DE MANUTENÇÃO:"
echo "======================"
echo "• Configure 'Format on Save' no VS Code"
echo "• Use Shift+Alt+F para formatação manual"
echo "• Execute este script antes de commits"
echo ""
echo "🎯 COMANDOS ÚTEIS:"
echo "• ./quick-format-check.sh  - Esta verificação"
echo "• ./format-editor-premium.sh - Formatação completa"
echo "• npm run format - Formatar todo o projeto"
