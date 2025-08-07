#!/bin/bash

echo "🔧 CORREÇÃO DE CONFLITOS: SISTEMAS PARALELOS"
echo "============================================="
echo "Este script corrige os conflitos identificados entre sistemas paralelos"
echo ""

# 1. CORRIGIR IMPORT CONFLITANTE NO editorBlocksMapping.ts
echo "1/4 - Corrigindo import conflitante no editorBlocksMapping.ts..."

# Backup do arquivo
cp src/config/editorBlocksMapping.ts src/config/editorBlocksMapping.ts.backup

# Corrigir o import para usar o registry correto
sed -i 's|from "../components/editor/blocks/EnhancedBlockRegistry"|from "./enhancedBlockRegistry"|g' src/config/editorBlocksMapping.ts

echo "✅ Import corrigido: EnhancedBlockRegistry.tsx → enhancedBlockRegistry.ts"

# 2. VERIFICAR SE A CORREÇÃO FUNCIONOU
echo ""
echo "2/4 - Verificando correção..."
if grep -q 'from "./enhancedBlockRegistry"' src/config/editorBlocksMapping.ts; then
    echo "✅ Correção aplicada com sucesso"
else
    echo "❌ Erro na correção - restaurando backup"
    cp src/config/editorBlocksMapping.ts.backup src/config/editorBlocksMapping.ts
    exit 1
fi

# 3. VERIFICAR COMPATIBILIDADE DE EXPORTS
echo ""
echo "3/4 - Verificando compatibilidade de exports..."

# Verificar se os exports necessários existem no registry principal
echo "📦 Exports necessários no enhancedBlockRegistry.ts:"
grep "export.*getBlockComponent" src/config/enhancedBlockRegistry.ts || echo "⚠️ getBlockComponent não encontrado"
grep "export.*getAllBlockTypes" src/config/enhancedBlockRegistry.ts || echo "⚠️ getAllBlockTypes não encontrado"
grep "export.*getBlockDefinition" src/config/enhancedBlockRegistry.ts || echo "⚠️ getBlockDefinition não encontrado"

# 4. TESTAR SE O SISTEMA CONTINUA FUNCIONANDO
echo ""
echo "4/4 - Testando build..."
npm run build > build_test.log 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Build passou - correção bem-sucedida!"
    rm build_test.log
else
    echo "❌ Build falhou - verificando log..."
    tail -10 build_test.log
    echo ""
    echo "🔄 Restaurando backup..."
    cp src/config/editorBlocksMapping.ts.backup src/config/editorBlocksMapping.ts
    echo "❌ Correção revertida devido a erro no build"
    exit 1
fi

echo ""
echo "📋 PRÓXIMOS PASSOS RECOMENDADOS:"
echo "================================"
echo "1. Verificar se o painel de propriedades ainda funciona"
echo "2. Testar componentes no editor /editor-fixed"
echo "3. Se tudo funcionar, considerar remover arquivos não usados:"
echo "   - src/components/editor/blocks/EnhancedBlockRegistry.tsx (se não usado)"
echo "   - Painéis de propriedades não usados (11 encontrados)"
echo "   - Backups antigos de useUnifiedProperties.ts (7 encontrados)"

echo ""
echo "✅ Correção de conflitos concluída!"
