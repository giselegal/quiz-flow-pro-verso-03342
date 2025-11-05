#!/bin/bash

# 📊 AUDITORIA DE USO DE PROVIDERS - FASE 1
# Verifica quantos arquivos ainda usam providers antigos vs canonical

echo "📊 AUDITORIA DE USO DE PROVIDERS"
echo "================================="

echo ""
echo "✅ EditorProviderCanonical (RECOMENDADO):"
canonical_count=$(grep -r "EditorProviderCanonical" src --include="*.tsx" --include="*.ts" | grep -v "node_modules" | wc -l)
echo "   $canonical_count ocorrências"

echo ""
echo "⚠️  EditorProviderUnified (DEPRECATED):"
unified_count=$(grep -r "EditorProviderUnified" src --include="*.tsx" --include="*.ts" | grep -v "node_modules" | grep -v "EditorProviderCanonical" | wc -l)
echo "   $unified_count ocorrências"

echo ""
echo "⚠️  EditorProviderAdapter (DEPRECATED):"
adapter_count=$(grep -r "EditorProviderAdapter" src --include="*.tsx" --include="*.ts" | grep -v "node_modules" | wc -l)
echo "   $adapter_count ocorrências"

echo ""
echo "⚠️  EditorProviderMigrationAdapter (DEPRECATED):"
migration_count=$(grep -r "EditorProviderMigrationAdapter" src --include="*.tsx" --include="*.ts" | grep -v "node_modules" | wc -l)
echo "   $migration_count ocorrências"

echo ""
echo "================================="
total_deprecated=$((unified_count + adapter_count + migration_count))
total=$((canonical_count + total_deprecated))

if [ $total -gt 0 ]; then
    canonical_percent=$(( canonical_count * 100 / total ))
    echo "📈 Progresso de migração: $canonical_percent% ($canonical_count/$total)"
else
    echo "📈 Progresso de migração: 0% (0/0)"
fi

echo ""
if [ $total_deprecated -eq 0 ]; then
    echo "🎉 MIGRAÇÃO COMPLETA! Todos os arquivos usam EditorProviderCanonical"
else
    echo "⚠️  Ainda há $total_deprecated ocorrências de providers antigos"
    echo ""
    echo "Para migrar automaticamente, execute:"
    echo "  bash scripts/migrate-to-canonical-provider.sh"
fi
echo ""
