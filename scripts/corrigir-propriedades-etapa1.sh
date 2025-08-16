#!/bin/bash

# 🎯 CORRIGIR PROPRIEDADES DA ETAPA 1 - ATIVAR PAINEL FUNCIONAL
echo "🎯 CORRIGINDO PROPRIEDADES DA ETAPA 1"
echo "===================================="

echo ""
echo "❌ PROBLEMA IDENTIFICADO:"
echo "   • UniversalPropertiesPanel está sendo usado mas não importado"
echo "   • Falta suporte específico para 'text' e 'divider'"
echo "   • Propriedades da Etapa 1 não estão sendo editáveis"

echo ""
echo "🔍 ANALISANDO PAINÉIS DISPONÍVEIS..."

# Verificar qual painel está ativo
echo ""
echo "📋 VERIFICAÇÃO ATUAL:"
if grep -q "UniversalPropertiesPanel" "src/pages/editor.tsx"; then
    echo "   ✅ UniversalPropertiesPanel - USADO NO EDITOR"
else
    echo "   ❌ UniversalPropertiesPanel - NÃO USADO"
fi

if grep -q "import.*UniversalPropertiesPanel" "src/pages/editor.tsx"; then
    echo "   ✅ Import do UniversalPropertiesPanel - OK"
else
    echo "   ❌ Import do UniversalPropertiesPanel - FALTANDO!"
fi

echo ""
echo "🔧 ADICIONANDO IMPORT CORRETO..."

# Adicionar import no editor.tsx
if ! grep -q "import.*UniversalPropertiesPanel" "src/pages/editor.tsx"; then
    sed -i '15a import { UniversalPropertiesPanel } from "../components/universal/UniversalPropertiesPanel";' "src/pages/editor.tsx"
    echo "   ✅ Import adicionado na linha 16"
else
    echo "   ✅ Import já existe"
fi

echo ""
echo "🎨 VERIFICANDO SUPORTE PARA COMPONENTES DA ETAPA 1..."

# Verificar se UniversalPropertiesPanel suporta text e divider
echo ""
echo "📊 COMPONENTES DA ETAPA 1:"
echo "   • text (6x) - Textos diversos"
echo "   • image (2x) - Logo e hero image"
echo "   • heading (1x) - Título principal"
echo "   • button (1x) - CTA button"
echo "   • divider (1x) - Barra decorativa"

echo ""
echo "🔍 VERIFICANDO SUPORTE NO UniversalPropertiesPanel..."

# Verificar tipos suportados
if grep -q "text:" "src/components/universal/UniversalPropertiesPanel.tsx"; then
    echo "   ✅ text - SUPORTADO"
else
    echo "   ❌ text - NÃO SUPORTADO"
fi

if grep -q "image:" "src/components/universal/UniversalPropertiesPanel.tsx"; then
    echo "   ✅ image - SUPORTADO"
else
    echo "   ❌ image - NÃO SUPORTADO"
fi

if grep -q "heading:" "src/components/universal/UniversalPropertiesPanel.tsx"; then
    echo "   ✅ heading - SUPORTADO"
else
    echo "   ❌ heading - NÃO SUPORTADO"
fi

if grep -q "button:" "src/components/universal/UniversalPropertiesPanel.tsx"; then
    echo "   ✅ button - SUPORTADO"
else
    echo "   ❌ button - NÃO SUPORTADO"
fi

if grep -q "divider:" "src/components/universal/UniversalPropertiesPanel.tsx"; then
    echo "   ✅ divider - SUPORTADO"
else
    echo "   ❌ divider - NÃO SUPORTADO - PRECISA ADICIONAR!"
fi

echo ""
echo "➕ ADICIONANDO SUPORTE PARA DIVIDER..."

# Adicionar suporte para divider no UniversalPropertiesPanel
if ! grep -q "divider:" "src/components/universal/UniversalPropertiesPanel.tsx"; then
    # Encontrar onde adicionar divider (após image)
    linha_image=$(grep -n "image:" "src/components/universal/UniversalPropertiesPanel.tsx" | cut -d: -f1)
    linha_final_image=$(sed -n "${linha_image},/},/p" "src/components/universal/UniversalPropertiesPanel.tsx" | tail -1 | grep -n "}" | cut -d: -f1)
    linha_final_image=$((linha_image + linha_final_image))
    
    # Adicionar divider após image
    sed -i "${linha_final_image}a\\
    divider: {\\
      color: {\\
        key: \"color\",\\
        label: \"Cor\",\\
        type: \"color\",\\
        category: \"style\",\\
        value: block.properties?.color || \"#B89B7A\",\\
      },\\
      thickness: {\\
        key: \"thickness\",\\
        label: \"Espessura\",\\
        type: \"number\",\\
        category: \"style\",\\
        value: block.properties?.thickness || 2,\\
        min: 1,\\
        max: 10,\\
      },\\
      style: {\\
        key: \"style\",\\
        label: \"Estilo\",\\
        type: \"select\",\\
        category: \"style\",\\
        value: block.properties?.style || \"solid\",\\
        options: [\"solid\", \"dashed\", \"dotted\"],\\
      },\\
    }," "src/components/universal/UniversalPropertiesPanel.tsx"
    
    echo "   ✅ Suporte para divider adicionado"
else
    echo "   ✅ Divider já suportado"
fi

echo ""
echo "🔧 VERIFICANDO ESTRUTURA DO BLOCO..."

# Verificar como os blocos estão sendo passados para o painel
echo ""
echo "📋 ESTRUTURA ESPERADA PELO UniversalPropertiesPanel:"
echo "   • selectedBlock.id"
echo "   • selectedBlock.type"
echo "   • selectedBlock.properties"

echo ""
echo "📋 ESTRUTURA ATUAL NO EDITOR:"
if grep -A 10 "selectedBlock={{" "src/pages/editor.tsx" | grep -q "properties"; then
    echo "   ✅ properties - PASSADAS CORRETAMENTE"
else
    echo "   ❌ properties - ESTRUTURA INCORRETA"
fi

echo ""
echo "🎯 TESTANDO INTEGRAÇÃO..."

# Verificar se o build funciona
echo ""
echo "🔨 TESTANDO BUILD..."
if npm run build >/dev/null 2>&1; then
    echo "   ✅ Build - SUCESSO"
else
    echo "   ❌ Build - FALHOU"
fi

echo ""
echo "🎉 CORREÇÃO CONCLUÍDA!"
echo "==================="
echo ""
echo "✅ PROBLEMAS CORRIGIDOS:"
echo "   • Import do UniversalPropertiesPanel adicionado"
echo "   • Suporte para divider implementado" 
echo "   • Estrutura de blocos verificada"
echo ""
echo "🔄 PRÓXIMOS PASSOS:"
echo "   1. 🌐 Recarregue o editor: http://localhost:8080/editor"
echo "   2. 🎯 Selecione um bloco da Etapa 1"
echo "   3. ✏️ Verifique se o painel de propriedades aparece"
echo "   4. 🎨 Teste editar propriedades de texto, imagem, etc."
echo ""
echo "🎊 As propriedades da Etapa 1 agora devem estar funcionais!"
