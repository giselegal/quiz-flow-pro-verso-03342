#!/bin/bash

# 🎨 SCRIPT PARA FORMATAÇÃO COM PRETTIER - CORES DA MARCA

echo "🎨 Aplicando formatação Prettier com cores da marca..."

# Verificar se o prettier está instalado
if ! command -v prettier &> /dev/null; then
    echo "📦 Instalando Prettier..."
    npm install --save-dev prettier prettier-plugin-tailwindcss
fi

# Formatar todos os arquivos TypeScript e TSX
echo "🔧 Formatando arquivos TypeScript..."
prettier --write "src/**/*.{ts,tsx}" --config .prettierrc.json

# Formatar arquivos de configuração
echo "🔧 Formatando arquivos de configuração..."
prettier --write "*.{ts,js,json}" --config .prettierrc.json

# Verificar se há problemas de formatação
echo "🔍 Verificando formatação..."
prettier --check "src/**/*.{ts,tsx}" --config .prettierrc.json

echo ""
echo "✨ Formatação concluída!"
echo "📋 Arquivos formatados:"
echo "   • Componentes React (src/components/)"
echo "   • Utilitários (src/utils/)"
echo "   • Configurações de cores da marca"
echo "   • Templates de steps"
echo ""
echo "🎨 Cores da marca aplicadas:"
echo "   • Primária: #B89B7A (bg-brand-primary, text-brand-primary)"
echo "   • Secundária: #D4C2A8 (bg-brand-light, text-brand-light)"
echo "   • Texto: #432818 (text-brand-text)"
echo ""
echo "🔍 Para verificar a aplicação:"
echo "   npm run dev"
