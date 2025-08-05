#!/bin/bash

# 🔧 FASE 1.2 - CONSOLIDAÇÃO DE EDITORES DE PROPRIEDADES
# Mantém apenas UniversalPropertiesPanel.tsx, remove duplicatas

echo "🔧 FASE 1.2 - CONSOLIDANDO EDITORES DE PROPRIEDADES"
echo "=================================================="

# Editores duplicados para remover
DUPLICATE_EDITORS=(
    "src/components/editor/PropertyPanel.tsx"
    "src/components/editor/ModernPropertyPanel.tsx"
    "src/components/editor/OptimizedPropertiesPanel.tsx"
    "src/components/editor/properties/PropertiesPanel.tsx"
    "src/components/editor/panels/PropertiesPanel.tsx"
    "src/components/editor/panels/ModernPropertiesPanel.tsx"
)

echo "📋 Mantendo: UniversalPropertiesPanel.tsx (PRINCIPAL)"
echo "📋 Removendo editores duplicados:"

for editor in "${DUPLICATE_EDITORS[@]}"; do
    if [ -f "$editor" ]; then
        echo "   ❌ $(basename "$editor")"
        # Backup antes de remover
        mkdir -p "backup/duplicate-editors/$(dirname "$editor")"
        cp "$editor" "backup/duplicate-editors/$editor"
        rm "$editor"
        echo "   ✅ Removido e backup criado"
    else
        echo "   ⚠️  $(basename "$editor") - Já não existe"
    fi
done

echo ""
echo "✅ FASE 1.2 CONCLUÍDA - Editores consolidados para UniversalPropertiesPanel.tsx"
