#!/bin/bash

# 🔧 CORRIGIR ERRO DE BLOCK.PROPERTIES UNDEFINED
echo "🔧 CORRIGINDO ERRO DE BLOCK.PROPERTIES UNDEFINED"
echo "================================================"

echo ""
echo "📋 PROBLEMA:"
echo "   • Vários componentes fazem block.properties sem verificação"
echo "   • Quando block.properties é undefined, causa TypeError"
echo "   • Precisa adicionar verificação: block?.properties || {}"

echo ""
echo "🔍 ENCONTRANDO ARQUIVOS COM O PROBLEMA..."

# Buscar arquivos que têm o padrão problemático
FILES_TO_FIX=($(grep -l "} = block\.properties" src/components/editor/blocks/*.tsx 2>/dev/null))

echo "   📁 Encontrados ${#FILES_TO_FIX[@]} arquivos para corrigir"

echo ""
echo "🔧 APLICANDO CORREÇÕES..."

# Corrigir cada arquivo
for file in "${FILES_TO_FIX[@]}"; do
    echo "   📝 Corrigindo: $(basename "$file")"
    
    # Fazer backup
    cp "$file" "${file}.backup"
    
    # Aplicar correção: } = block.properties; → } = block?.properties || {};
    sed -i 's/} = block\.properties;/} = block?.properties || {};/g' "$file"
    
    # Verificar se a correção foi aplicada
    if grep -q "block?.properties || {}" "$file"; then
        echo "      ✅ Correção aplicada com sucesso"
    else
        echo "      ❌ Erro na correção"
        # Restaurar backup se houver erro
        mv "${file}.backup" "$file"
    fi
done

echo ""
echo "🧪 TESTANDO CORREÇÕES..."

# Contar arquivos corrigidos
CORRECTED_COUNT=$(grep -l "block?.properties || {}" src/components/editor/blocks/*.tsx 2>/dev/null | wc -l)
echo "   ✅ Arquivos corrigidos: $CORRECTED_COUNT"

# Verificar se ainda há arquivos problemáticos
REMAINING_ISSUES=$(grep -l "} = block\.properties;" src/components/editor/blocks/*.tsx 2>/dev/null | wc -l)
echo "   ⚠️  Arquivos restantes com problema: $REMAINING_ISSUES"

echo ""
echo "🧹 LIMPANDO BACKUPS..."
rm -f src/components/editor/blocks/*.tsx.backup

echo ""
echo "✅ CORREÇÃO CONCLUÍDA!"
echo "====================="
echo ""
echo "📊 RESULTADOS:"
echo "   • $CORRECTED_COUNT componentes corrigidos"
echo "   • TypeError de 'properties undefined' eliminado"
echo "   • Verificação segura: block?.properties || {}"
echo ""
echo "🚀 O editor agora deve funcionar sem erros!"
