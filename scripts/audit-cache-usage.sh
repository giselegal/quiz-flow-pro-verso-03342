#!/bin/bash

# 📊 AUDITORIA DE USO DE CACHE - FASE 2
# Verifica quantos arquivos ainda usam caches antigos vs unified

echo "📊 AUDITORIA DE USO DE CACHE"
echo "============================="

echo ""
echo "✅ UnifiedCacheService (RECOMENDADO):"
unified_count=$(grep -r "unifiedCacheService\|UnifiedCacheService" src --include="*.tsx" --include="*.ts" | grep -v "node_modules" | wc -l)
echo "   $unified_count ocorrências"

echo ""
echo "⚠️  UnifiedTemplateCache (DEPRECATED):"
template_cache_count=$(grep -r "UnifiedTemplateCache" src --include="*.tsx" --include="*.ts" | grep -v "node_modules" | grep -v "unifiedCacheService" | wc -l)
echo "   $template_cache_count ocorrências"

echo ""
echo "⚠️  IntelligentCacheSystem (DEPRECATED):"
intelligent_count=$(grep -r "IntelligentCacheSystem" src --include="*.tsx" --include="*.ts" | grep -v "node_modules" | wc -l)
echo "   $intelligent_count ocorrências"

echo ""
echo "⚠️  AdvancedCache (DEPRECATED):"
advanced_count=$(grep -r "AdvancedCache" src --include="*.tsx" --include="*.ts" | grep -v "node_modules" | wc -l)
echo "   $advanced_count ocorrências"

echo ""
echo "⚠️  HybridCacheStrategy (DEPRECATED):"
hybrid_count=$(grep -r "HybridCacheStrategy" src --include="*.tsx" --include="*.ts" | grep -v "node_modules" | wc -l)
echo "   $hybrid_count ocorrências"

echo ""
echo "============================="
total_deprecated=$((template_cache_count + intelligent_count + advanced_count + hybrid_count))
total=$((unified_count + total_deprecated))

if [ $total -gt 0 ]; then
    unified_percent=$(( unified_count * 100 / total ))
    echo "📈 Progresso de migração: $unified_percent% ($unified_count/$total)"
else
    echo "📈 Progresso de migração: 0% (0/0)"
fi

echo ""
if [ $total_deprecated -eq 0 ]; then
    echo "🎉 MIGRAÇÃO COMPLETA! Todos os arquivos usam UnifiedCacheService"
else
    echo "⚠️  Ainda há $total_deprecated ocorrências de caches antigos"
    echo ""
    echo "Para migrar automaticamente, execute:"
    echo "  bash scripts/migrate-to-unified-cache.sh"
fi
echo ""

# Lista arquivos com caches antigos
if [ $total_deprecated -gt 0 ]; then
    echo "📋 Arquivos com caches antigos:"
    echo ""
    grep -r "UnifiedTemplateCache\|IntelligentCacheSystem\|AdvancedCache\|HybridCacheStrategy" src \
        --include="*.tsx" --include="*.ts" \
        --files-with-matches | \
        grep -v "node_modules" | \
        grep -v "UnifiedCacheService" | \
        head -20
    echo ""
fi
