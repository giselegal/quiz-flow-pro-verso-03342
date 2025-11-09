#!/bin/bash

# 🔄 SCRIPT DE MIGRAÇÃO AUTOMÁTICA - ANALYTICS
# Este script atualiza automaticamente os imports e chamadas dos sistemas antigos

echo "🚀 Iniciando migração automática dos sistemas de analytics..."

# ============================================================================
# FUNÇÃO: Backup dos arquivos antes da migração
# ============================================================================
create_backup() {
    echo "📋 Criando backup dos arquivos originais..."
    mkdir -p backup/analytics-migration-$(date +%Y%m%d_%H%M%S)
    
    # Backup dos arquivos que serão modificados
    find src/ -name "*.tsx" -o -name "*.ts" | xargs grep -l "from '@/utils/analytics'\|from '@/services/analyticsService'" | while read file; do
        cp "$file" "backup/analytics-migration-$(date +%Y%m%d_%H%M%S)/"
    done
    
    echo "✅ Backup criado"
}

# ============================================================================
# FUNÇÃO: Migrar imports do utils/analytics.ts
# ============================================================================
migrate_utils_analytics() {
    echo "🔄 Migrando imports de @/utils/analytics..."
    
    # Encontrar arquivos com imports antigos
    find src/ -name "*.tsx" -o -name "*.ts" | xargs grep -l "from '@/utils/analytics'" | while read file; do
        echo "  📝 Processando: $file"
        
        # Substituir imports
        sed -i.bak \
            -e "s/import { trackEvent } from '@\/utils\/analytics';/import { analyticsEngine } from '@\/services\/analyticsEngine';/" \
            -e "s/import { trackCustomEvent } from '@\/utils\/analytics';/import { analyticsEngine } from '@\/services\/analyticsEngine';/" \
            -e "s/import { trackPageView } from '@\/utils\/analytics';/import { analyticsEngine } from '@\/services\/analyticsEngine';/" \
            -e "s/import { trackButtonClick } from '@\/utils\/analytics';/import { analyticsEngine } from '@\/services\/analyticsEngine';/" \
            -e "s/import { trackSaleConversion } from '@\/utils\/analytics';/import { analyticsEngine } from '@\/services\/analyticsEngine';/" \
            -e "s/import { trackButtonClick, trackSaleConversion } from '@\/utils\/analytics';/import { analyticsEngine } from '@\/services\/analyticsEngine';/" \
            "$file"
        
        # Remover arquivos .bak
        rm -f "${file}.bak"
    done
    
    echo "✅ Migração de utils/analytics concluída"
}

# ============================================================================
# FUNÇÃO: Migrar chamadas de métodos
# ============================================================================
migrate_method_calls() {
    echo "🔄 Migrando chamadas de métodos..."
    
    find src/ -name "*.tsx" -o -name "*.ts" | while read file; do
        if grep -q "trackButtonClick\|trackSaleConversion\|trackPageView\|trackEvent\|trackCustomEvent" "$file"; then
            echo "  📝 Atualizando métodos em: $file"
            
            # Substituir chamadas de métodos
            sed -i.bak \
                -e "s/trackButtonClick(\([^)]*\))/analyticsEngine.trackGoogleAnalyticsEvent('button_click', { button: \1 })/g" \
                -e "s/trackSaleConversion(\([^)]*\))/analyticsEngine.trackGoogleAnalyticsEvent('sale_conversion', { conversion: \1 })/g" \
                -e "s/trackPageView(\([^)]*\))/analyticsEngine.trackPageView(\1)/g" \
                -e "s/trackEvent(\([^,]*\),\s*\([^)]*\))/analyticsEngine.trackGoogleAnalyticsEvent(\1, \2)/g" \
                -e "s/trackCustomEvent(\([^)]*\))/analyticsEngine.trackGoogleAnalyticsEvent('custom_event', { data: \1 })/g" \
                "$file"
            
            rm -f "${file}.bak"
        fi
    done
    
    echo "✅ Migração de chamadas de métodos concluída"
}

# ============================================================================
# FUNÇÃO: Migrar analyticsService
# ============================================================================
migrate_analytics_service() {
    echo "🔄 Migrando analyticsService..."
    
    find src/ -name "*.tsx" -o -name "*.ts" | xargs grep -l "from '@/services/analyticsService'" | while read file; do
        echo "  📝 Processando: $file"
        
        # Substituir import
        sed -i.bak \
            -e "s/import { analyticsService } from '@\/services\/analyticsService';/import { analyticsEngine } from '@\/services\/analyticsEngine';/" \
            -e "s/analyticsService\./analyticsEngine\./g" \
            "$file"
        
        rm -f "${file}.bak"
    done
    
    echo "✅ Migração de analyticsService concluída"
}

# ============================================================================
# FUNÇÃO: Validar migração
# ============================================================================
validate_migration() {
    echo "🔍 Validando migração..."
    
    # Verificar se ainda existem imports antigos
    OLD_IMPORTS=$(find src/ -name "*.tsx" -o -name "*.ts" | xargs grep -l "from '@/utils/analytics'\|from '@/services/analyticsService'" | wc -l)
    
    if [ $OLD_IMPORTS -eq 0 ]; then
        echo "✅ Migração validada - nenhum import antigo encontrado"
    else
        echo "⚠️  Atenção: $OLD_IMPORTS arquivos ainda possuem imports antigos"
        find src/ -name "*.tsx" -o -name "*.ts" | xargs grep -l "from '@/utils/analytics'\|from '@/services/analyticsService'"
    fi
    
    # Verificar se analyticsEngine está sendo importado
    NEW_IMPORTS=$(find src/ -name "*.tsx" -o -name "*.ts" | xargs grep -l "from '@/services/analyticsEngine'" | wc -l)
    echo "📊 $NEW_IMPORTS arquivos agora usam analyticsEngine"
}

# ============================================================================
# FUNÇÃO: Remover arquivos antigos (apenas após confirmação)
# ============================================================================
remove_old_files() {
    echo "🗑️  Deseja remover os arquivos antigos de analytics? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "🗑️  Removendo arquivos antigos..."
        
        # Mover para pasta de backup antes de deletar
        mkdir -p backup/removed-analytics-files
        
        if [ -f "src/services/analyticsService.ts" ]; then
            mv "src/services/analyticsService.ts" "backup/removed-analytics-files/"
            echo "  ✅ analyticsService.ts movido para backup"
        fi
        
        if [ -f "src/utils/analytics.js" ]; then
            mv "src/utils/analytics.js" "backup/removed-analytics-files/"
            echo "  ✅ analytics.js movido para backup"
        fi
        
        if [ -f "src/utils/analytics-simple.ts" ]; then
            mv "src/utils/analytics-simple.ts" "backup/removed-analytics-files/"
            echo "  ✅ analytics-simple.ts movido para backup"
        fi
        
        # Manter utils/analytics.ts comentado para referência por enquanto
        if [ -f "src/utils/analytics.ts" ]; then
            echo "⚠️  utils/analytics.ts mantido para referência (renomeie ou remova manualmente)"
        fi
        
        echo "✅ Arquivos antigos removidos (backups criados)"
    else
        echo "📝 Arquivos antigos mantidos (remova manualmente quando necessário)"
    fi
}

# ============================================================================
# EXECUÇÃO PRINCIPAL
# ============================================================================
main() {
    echo "🚀 MIGRAÇÃO AUTOMÁTICA DE ANALYTICS"
    echo "===================================="
    
    # Verificar se estamos no diretório correto
    if [ ! -d "src/" ]; then
        echo "❌ Erro: Execute este script na raiz do projeto (onde está a pasta src/)"
        exit 1
    fi
    
    # Executar funções de migração
    create_backup
    migrate_utils_analytics
    migrate_analytics_service
    migrate_method_calls
    validate_migration
    
    echo ""
    echo "🎉 MIGRAÇÃO CONCLUÍDA!"
    echo "====================="
    echo ""
    echo "📋 PRÓXIMOS PASSOS:"
    echo "1. Revisar arquivos modificados"
    echo "2. Executar testes: npm test"
    echo "3. Testar analytics no desenvolvimento"
    echo "4. Remover arquivos antigos quando confiante"
    echo ""
    echo "📚 Consulte MIGRATION_GUIDE_ANALYTICS.md para detalhes adicionais"
    
    # Opcional: Remover arquivos antigos
    remove_old_files
}

# Executar se chamado diretamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi