#!/bin/bash

# 🎨 FASE 1.3 - CONSOLIDAÇÃO DE BLOCK RENDERERS
# Mantém apenas UniversalBlockRendererV2.tsx e EnhancedBlockRegistry.tsx

echo "🎨 FASE 1.3 - CONSOLIDANDO BLOCK RENDERERS"
echo "=========================================="

# Renderers duplicados para remover
DUPLICATE_RENDERERS=(
    "src/components/editor/blocks/BlockRenderer.tsx"
    "src/components/editor/blocks/UniversalBlockRenderer.tsx"
    "src/components/editor/components/ComponentRenderer.tsx"
    "src/components/result-editor/BlockRenderer.tsx"
    "src/components/live-editor/preview/BlockRenderer.tsx"
)

# Registries duplicados para remover  
DUPLICATE_REGISTRIES=(
    "src/components/editor/blocks/BlockRegistry.tsx"
    "src/components/editor/blocks/ComponentRegistry.tsx"
    "src/components/result-editor/ComponentRegistry.tsx"
)

echo "📋 Mantendo:"
echo "   ✅ UniversalBlockRendererV2.tsx (RENDERER PRINCIPAL)"
echo "   ✅ EnhancedBlockRegistry.tsx (REGISTRY PRINCIPAL)"

echo ""
echo "📋 Removendo renderers duplicados:"
for renderer in "${DUPLICATE_RENDERERS[@]}"; do
    if [ -f "$renderer" ]; then
        echo "   ❌ $(basename "$renderer")"
        mkdir -p "backup/duplicate-renderers/$(dirname "$renderer")"
        cp "$renderer" "backup/duplicate-renderers/$renderer"
        rm "$renderer"
        echo "   ✅ Removido e backup criado"
    else
        echo "   ⚠️  $(basename "$renderer") - Já não existe"
    fi
done

echo ""
echo "📋 Removendo registries duplicados:"
for registry in "${DUPLICATE_REGISTRIES[@]}"; do
    if [ -f "$registry" ]; then
        echo "   ❌ $(basename "$registry")"
        mkdir -p "backup/duplicate-registries/$(dirname "$registry")"
        cp "$registry" "backup/duplicate-registries/$registry"
        rm "$registry"
        echo "   ✅ Removido e backup criado"
    else
        echo "   ⚠️  $(basename "$registry") - Já não existe"
    fi
done

echo ""
echo "✅ FASE 1.3 CONCLUÍDA - Renderers consolidados"
