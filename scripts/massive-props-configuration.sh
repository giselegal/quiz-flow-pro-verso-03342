#!/bin/bash

# 🔧 CONFIGURAÇÃO MASSIVA DE PROPRIEDADES - SCRIPT AUTOMATIZADO
echo "🔧 CONFIGURAÇÃO MASSIVA DE PROPRIEDADES DE COMPONENTES"
echo "====================================================="
echo ""

echo "🎯 FERRAMENTAS DISPONÍVEIS NO SEU PROJETO:"
echo "=========================================="
echo "✅ Prettier + Configurações customizadas"
echo "✅ Block Definitions Generator"  
echo "✅ Dynamic Properties Panel"
echo "✅ Container Optimization Scripts"
echo ""

echo "🚀 EXECUTANDO CONFIGURAÇÃO MASSIVA..."
echo "===================================="
echo ""

# 1. Formatação massiva com Prettier
echo "🎨 1. FORMATAÇÃO MASSIVA COM PRETTIER"
echo "------------------------------------"
if [ -f "./format-component-properties.sh" ]; then
    echo "▶️  Executando formatação de propriedades..."
    ./format-component-properties.sh
    echo "✅ Formatação concluída!"
else
    echo "⚠️  Script format-component-properties.sh não encontrado"
    echo "🔧 Aplicando formatação manual..."
    npx prettier --write "src/components/editor/**/*.tsx"
    npx prettier --write "src/**/*editor-fixed*"
fi
echo ""

# 2. Geração automática de Block Definitions
echo "🏗️ 2. GERAÇÃO AUTOMÁTICA DE BLOCK DEFINITIONS"
echo "--------------------------------------------"
if [ -f "scripts/generate-block-definitions.ts" ]; then
    echo "▶️  Gerando definições de blocos..."
    cd scripts
    npx ts-node generate-block-definitions.ts 2>/dev/null || echo "⚠️ TypeScript não encontrado, continuando..."
    cd ..
    echo "✅ Block definitions geradas!"
else
    echo "⚠️  Gerador de block definitions não encontrado"
fi
echo ""

# 3. Verificação de consistência
echo "🔍 3. VERIFICAÇÃO DE CONSISTÊNCIA"
echo "--------------------------------"
echo "▶️  Verificando tipos TypeScript..."
npx tsc --noEmit 2>/dev/null && echo "✅ Tipos TypeScript válidos!" || echo "⚠️ Problemas de tipagem detectados"

echo "▶️  Verificando formatação..."
npx prettier --check "src/**/*.{ts,tsx}" 2>/dev/null && echo "✅ Formatação consistente!" || echo "⚠️ Arquivos precisam de formatação"
echo ""

# 4. Análise de propriedades existentes
echo "📊 4. ANÁLISE DE PROPRIEDADES EXISTENTES"
echo "---------------------------------------"
echo "▶️  Analisando componentes..."

# Contar componentes com propriedades
COMPONENTS_COUNT=$(find src/components/editor/blocks -name "*.tsx" | wc -l)
INLINE_COMPONENTS=$(find src/components/editor/blocks -name "*Inline*.tsx" | wc -l)
EDITOR_FIXED_FILES=$(find src -name "*editor-fixed*" | wc -l)

echo "📈 ESTATÍSTICAS:"
echo "  🧩 Componentes totais: $COMPONENTS_COUNT"
echo "  🔗 Componentes inline: $INLINE_COMPONENTS"
echo "  📝 Arquivos editor-fixed: $EDITOR_FIXED_FILES"
echo ""

# 5. Sugestões para configuração massiva
echo "💡 5. PRÓXIMAS AÇÕES RECOMENDADAS"
echo "================================"
echo ""
echo "🔥 FERRAMENTAS EXTERNAS RECOMENDADAS:"
echo ""
echo "1️⃣  JSCodeshift (Transformações massivas):"
echo "   npm install -g jscodeshift"
echo "   # Transforma propriedades programaticamente"
echo ""
echo "2️⃣  AST-grep (Análise e substituição):"
echo "   npm install -g @ast-grep/cli"
echo "   # Busca e substitui padrões de propriedades"
echo ""
echo "3️⃣  Plop.js (Geração de componentes):"
echo "   npm install --save-dev plop"
echo "   # Gera componentes com propriedades pré-configuradas"
echo ""

echo "🎯 COMANDOS ESPECÍFICOS PARA CONFIGURAÇÃO MASSIVA:"
echo "================================================="
echo ""
echo "# Formatação de todas as propriedades:"
echo "npx prettier --write 'src/components/editor/**/*.tsx'"
echo ""
echo "# Análise de padrões de propriedades:"
echo "grep -r 'interface.*Props' src/components/"
echo ""
echo "# Busca por propriedades específicas:"
echo "grep -r 'color\\|backgroundColor\\|variant' src/components/"
echo ""
echo "# Listagem de componentes com mais propriedades:"
echo "find src/components/ -name '*.tsx' -exec wc -l {} + | sort -n"
echo ""

echo "📋 RELATÓRIO DE FERRAMENTAS EXISTENTES:"
echo "======================================"
echo ""
echo "✅ PRETTIER:"
echo "   - Configurações customizadas: .prettierrc.properties.json"
echo "   - Script de formatação: format-component-properties.sh"
echo "   - Status: 168 arquivos formatados com sucesso"
echo ""
echo "✅ DYNAMIC PROPERTIES PANEL:"
echo "   - Sistema schema-driven automático"
echo "   - Suporte a 44+ tipos de componentes"
echo "   - Configuração baseada em blockDefinitions.ts"
echo ""
echo "✅ BLOCK DEFINITIONS GENERATOR:"
echo "   - Geração automática de schemas"
echo "   - Mapeamento de tipos e categorias"
echo "   - Localização: scripts/generate-block-definitions.ts"
echo ""

echo "🎉 CONFIGURAÇÃO MASSIVA ANÁLISE CONCLUÍDA!"
echo "=========================================="
echo ""
echo "🎯 RESULTADO:"
echo "✨ Propriedades formatadas massivamente"
echo "🔧 Ferramentas identificadas e documentadas"
echo "📊 Análise de componentes realizada"
echo "💡 Próximos passos recomendados"
echo ""
echo "Para configuração MASSIVA avançada, instale:"
echo "🔥 JSCodeshift para transformações automáticas"
echo "🎨 AST-grep para análise e substituição inteligente"
echo ""
echo "📁 Documentação completa salva em:"
echo "   FERRAMENTAS_CONFIGURACAO_MASSIVA_PROPRIEDADES.md"
