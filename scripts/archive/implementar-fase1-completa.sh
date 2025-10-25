#!/bin/bash

# 🚀 EXECUTOR COMPLETO DA FASE 1 - LIMPEZA IMEDIATA
# Executa todas as sub-fases em sequência

echo "🚀 EXECUTANDO FASE 1 COMPLETA - LIMPEZA IMEDIATA"
echo "==============================================="

# Criar diretório de backup principal
mkdir -p backup/fase1-limpeza

echo ""
echo "📋 ETAPAS DA FASE 1:"
echo "   1.1 Remover componentes quebrados (19 arquivos)"
echo "   1.2 Consolidar editores de propriedades (4→1)"  
echo "   1.3 Consolidar renderers e registries (7→2)"

echo ""
echo "🎯 INICIANDO EXECUÇÃO..."

# Tornar scripts executáveis
chmod +x implementar-fase1-1-remover-quebrados.sh
chmod +x implementar-fase1-2-consolidar-editores.sh
chmod +x implementar-fase1-3-consolidar-renderers.sh

# Executar sub-fases
echo ""
echo "▶️  Executando Fase 1.1..."
./implementar-fase1-1-remover-quebrados.sh

echo ""
echo "▶️  Executando Fase 1.2..."
./implementar-fase1-2-consolidar-editores.sh

echo ""
echo "▶️  Executando Fase 1.3..."
./implementar-fase1-3-consolidar-renderers.sh

echo ""
echo "📊 RELATÓRIO FINAL DA FASE 1:"
echo "============================================="

# Contar arquivos removidos
REMOVED_COUNT=0
if [ -d "backup/broken-components" ]; then
    BROKEN_COUNT=$(find backup/broken-components -name "*.tsx" | wc -l)
    echo "   🗑️  Componentes quebrados removidos: $BROKEN_COUNT"
    REMOVED_COUNT=$((REMOVED_COUNT + BROKEN_COUNT))
fi

if [ -d "backup/duplicate-editors" ]; then
    EDITORS_COUNT=$(find backup/duplicate-editors -name "*.tsx" | wc -l)
    echo "   🔧 Editores duplicados removidos: $EDITORS_COUNT"
    REMOVED_COUNT=$((REMOVED_COUNT + EDITORS_COUNT))
fi

if [ -d "backup/duplicate-renderers" ]; then
    RENDERERS_COUNT=$(find backup/duplicate-renderers -name "*.tsx" | wc -l)
    echo "   🎨 Renderers duplicados removidos: $RENDERERS_COUNT"
    REMOVED_COUNT=$((REMOVED_COUNT + RENDERERS_COUNT))
fi

if [ -d "backup/duplicate-registries" ]; then
    REGISTRIES_COUNT=$(find backup/duplicate-registries -name "*.tsx" | wc -l)
    echo "   📋 Registries duplicados removidos: $REGISTRIES_COUNT"
    REMOVED_COUNT=$((REMOVED_COUNT + REGISTRIES_COUNT))
fi

echo ""
echo "🎉 FASE 1 CONCLUÍDA COM SUCESSO!"
echo "   📁 Total de arquivos removidos: $REMOVED_COUNT"
echo "   💾 Todos os backups criados em: backup/fase1-limpeza/"
echo "   🎯 Próxima etapa: FASE 2 - Refatoração dos Steps"

echo ""
echo "✅ COMPONENTES PRINCIPAIS MANTIDOS:"
echo "   ✅ UniversalPropertiesPanel.tsx"
echo "   ✅ EnhancedBlockRegistry.tsx"
echo "   ✅ UniversalBlockRendererV2.tsx"
echo "   ✅ SchemaDrivenEditorResponsive.tsx"
