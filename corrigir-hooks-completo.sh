#!/bin/bash

echo "🔧 CORRIGINDO HOOKS COM IMPORTS COMPLETOS..."
echo "============================================="

# Função para corrigir imports em um arquivo
fix_hooks_in_file() {
    local file="$1"
    echo "🔧 Corrigindo: $file"
    
    # Backup
    cp "$file" "$file.backup-$(date +%Y%m%d-%H%M%S)"
    
    # Adicionar imports necessários no início do arquivo
    if ! grep -q "import.*useIsMobile" "$file"; then
        sed -i '1i import { useIsMobile } from "@/hooks/use-mobile";' "$file"
    fi
    
    if ! grep -q "import.*useContainerProperties" "$file"; then
        sed -i '2i import { useContainerProperties } from "@/hooks/useContainerProperties";' "$file"
    fi
    
    if ! grep -q "import.*useDebounce" "$file"; then
        sed -i '3i import { useDebounce } from "@/hooks/useDebounce";' "$file"
    fi
    
    if ! grep -q "import.*usePerformanceOptimization" "$file"; then
        sed -i '4i import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";' "$file"
    fi
    
    # Remover hooks duplicados em funções de template
    sed -i '/export const get.*Template = () => {/,/return \[/{
        /🚀 Hooks otimizados aplicados automaticamente/d
        /const isMobile = useIsMobile();/d
    }' "$file"
    
    # Remover duplicatas em componentes
    awk '
    /const isMobile = useIsMobile\(\);/ {
        if (!seen_isMobile) {
            print
            seen_isMobile = 1
        }
        next
    }
    { print }
    ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    
    echo "✅ Corrigido: $file"
}

# Corrigir todos os step templates
for file in src/components/steps/Step*Template.tsx; do
    if [[ -f "$file" && ! "$file" =~ \.backup ]]; then
        fix_hooks_in_file "$file"
    fi
done

echo ""
echo "🎉 CORREÇÃO COMPLETA!"
echo "====================="
echo "✅ Imports adicionados em todos os steps"
echo "✅ Hooks duplicados removidos"
echo "✅ Backups criados com timestamp"
echo ""
echo "📝 PRÓXIMO PASSO: Integrar no /editor-fixed"
