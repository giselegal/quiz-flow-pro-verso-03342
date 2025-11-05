#!/bin/bash

# 🔄 SCRIPT DE MIGRAÇÃO - FASE 2: UNIFIED CACHE
# Migra imports de caches antigos para UnifiedCacheService

echo "🚀 INICIANDO MIGRAÇÃO PARA UNIFIEDCACHESERVICE"
echo "==============================================="

count=0

# Função para processar arquivos
migrate_file() {
    local file="$1"
    local changed=false
    
    # Backup do arquivo original
    cp "$file" "$file.bak"
    
    # 1. Migrar UnifiedTemplateCache
    if grep -q "from '@/utils/UnifiedTemplateCache'" "$file"; then
        sed -i "s/from '@\/utils\/UnifiedTemplateCache'/from '@\/services\/unified\/UnifiedCacheService'/g" "$file"
        sed -i "s/unifiedCache\.get/unifiedCacheService.get/g" "$file"
        sed -i "s/unifiedCache\.set/unifiedCacheService.set/g" "$file"
        sed -i "s/unifiedCache\./unifiedCacheService./g" "$file"
        changed=true
        echo "  ✓ Migrado UnifiedTemplateCache → UnifiedCacheService"
    fi
    
    # 2. Migrar IntelligentCacheSystem
    if grep -q "from '@/cache/IntelligentCacheSystem'" "$file"; then
        sed -i "s/from '@\/cache\/IntelligentCacheSystem'/from '@\/services\/unified\/UnifiedCacheService'/g" "$file"
        sed -i "s/templateCache\.get/unifiedCacheService.get/g" "$file"
        sed -i "s/templateCache\.set/unifiedCacheService.set/g" "$file"
        changed=true
        echo "  ✓ Migrado IntelligentCacheSystem → UnifiedCacheService"
    fi
    
    # 3. Migrar AdvancedCache
    if grep -q "from '@/hooks/performance/useAdvancedCache'" "$file"; then
        sed -i "s/from '@\/hooks\/performance\/useAdvancedCache'/from '@\/hooks\/useUnifiedCache'/g" "$file"
        sed -i "s/useAdvancedCache/useUnifiedCache/g" "$file"
        changed=true
        echo "  ✓ Migrado useAdvancedCache → useUnifiedCache"
    fi
    
    if [ "$changed" = true ]; then
        ((count++))
        echo "✅ Migrado: $file"
    else
        rm "$file.bak"
    fi
}

echo ""
echo "🔍 Procurando arquivos para migrar..."
echo ""

# Processar arquivos
while IFS= read -r file; do
    if [ -f "$file" ]; then
        migrate_file "$file"
    fi
done < <(find src -name "*.tsx" -o -name "*.ts" | grep -v node_modules | grep -v dist | grep -v backup)

echo ""
echo "==============================================="
echo "✨ MIGRAÇÃO CONCLUÍDA"
echo "   Total de arquivos migrados: $count"
echo ""
echo "📋 Próximos passos:"
echo "   1. Revisar mudanças: git diff"
echo "   2. Testar aplicação: npm run dev"
echo "   3. Se OK: git add . && git commit -m 'migrate: UnifiedCacheService Fase 2'"
echo "   4. Se problemas: find src -name '*.bak' -exec bash -c 'mv \"\$0\" \"\${0%.bak}\"' {} \;"
echo ""
echo "🗑️  Remover backups: find src -name '*.bak' -delete"
echo ""
