#!/bin/bash

# 🤖 SCRIPT DE LIMPEZA EM LOTE
# Automatiza tarefas repetitivas de limpeza do débito técnico

set -e  # Para em caso de erro

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                    🤖 LIMPEZA EM LOTE - INICIANDO                          ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
TOTAL_FILES=0
SUCCESS_COUNT=0
FAIL_COUNT=0
SKIP_COUNT=0

# ============================================================================
# FUNÇÃO 1: Remover @ts-nocheck de arquivos pequenos e simples
# ============================================================================
remove_ts_nocheck() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📝 TAREFA 1: Remover @ts-nocheck de arquivos simples (<50 linhas)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # Encontrar arquivos com @ts-nocheck e menos de 50 linhas
    while IFS= read -r file; do
        lines=$(wc -l < "$file")
        
        if [ "$lines" -lt 50 ]; then
            TOTAL_FILES=$((TOTAL_FILES + 1))
            echo -n "Processando: $file ($lines linhas)... "
            
            # Fazer backup
            cp "$file" "$file.backup"
            
            # Remover @ts-nocheck
            sed -i '/^\/\/ @ts-nocheck/d' "$file"
            sed -i '/^\/\/ @ts-ignore/d' "$file"
            
            # Verificar se ainda compila (rápido - apenas parse)
            if npx tsc --noEmit --skipLibCheck "$file" 2>/dev/null; then
                echo -e "${GREEN}✅ SUCESSO${NC}"
                rm "$file.backup"
                SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
            else
                echo -e "${RED}❌ ERRO - Revertendo${NC}"
                mv "$file.backup" "$file"
                FAIL_COUNT=$((FAIL_COUNT + 1))
            fi
        fi
    done < <(find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l "@ts-nocheck\|@ts-ignore" {} \;)
    
    echo ""
    echo "📊 Resultado: ✅ $SUCCESS_COUNT sucesso | ❌ $FAIL_COUNT falhas | Total: $TOTAL_FILES"
}

# ============================================================================
# FUNÇÃO 2: Adicionar @deprecated em serviços duplicados
# ============================================================================
add_deprecation_tags() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🏷️  TAREFA 2: Adicionar @deprecated em serviços duplicados"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Lista de serviços duplicados para marcar
    declare -a DUPLICATED_SERVICES=(
        "src/services/FunilUnificadoService.ts:FunnelService.ts"
        "src/services/EnhancedFunnelService.ts:FunnelService.ts"
        "src/services/AdvancedFunnelStorage.ts:FunnelService.ts"
        "src/services/SistemaDeFunilMelhorado.ts:FunnelService.ts"
        "src/services/contextualFunnelService.ts:FunnelService.ts"
    )
    
    for entry in "${DUPLICATED_SERVICES[@]}"; do
        IFS=':' read -r file canonical <<< "$entry"
        
        if [ -f "$file" ]; then
            echo -n "Marcando: $file → usar $canonical... "
            
            # Verificar se já tem @deprecated
            if grep -q "@deprecated" "$file"; then
                echo -e "${YELLOW}⏭️  JÁ MARCADO${NC}"
                SKIP_COUNT=$((SKIP_COUNT + 1))
            else
                # Adicionar comentário no início do arquivo
                cat > "$file.tmp" << EOF
/**
 * @deprecated
 * Este serviço está DEPRECATED e será removido na v4.0 (Janeiro 2026)
 * 
 * ✅ USE: src/services/$canonical
 * 
 * Motivo: Consolidação de serviços duplicados
 * Veja: DEPRECATED.md para mais detalhes
 */

EOF
                cat "$file" >> "$file.tmp"
                mv "$file.tmp" "$file"
                
                echo -e "${GREEN}✅ MARCADO${NC}"
                SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
            fi
        fi
    done
    
    echo ""
    echo "📊 Resultado: ✅ $SUCCESS_COUNT marcados | ⏭️  $SKIP_COUNT já tinham tag"
}

# ============================================================================
# FUNÇÃO 3: Mover arquivos stub incompletos para /archived
# ============================================================================
archive_stub_files() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📦 TAREFA 3: Arquivar arquivos stub incompletos"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Criar diretório de arquivos arquivados
    mkdir -p src/components/editor/blocks/archived
    
    # Lista de arquivos stub (apenas funções utilitárias, sem componentes React)
    declare -a STUB_FILES=(
        "src/components/editor/blocks/AdvancedGalleryBlock.tsx"
        "src/components/editor/blocks/HeroOfferBlock.tsx"
        "src/components/editor/blocks/AdvancedPricingTableBlock.tsx"
        "src/components/editor/blocks/AnimatedChartsBlock.tsx"
        "src/components/editor/blocks/InteractiveStatisticsBlock.tsx"
        "src/components/editor/blocks/PainPointsGridBlock.tsx"
        "src/components/editor/blocks/ProductFeaturesGridBlock.tsx"
    )
    
    for file in "${STUB_FILES[@]}"; do
        if [ -f "$file" ]; then
            basename=$(basename "$file")
            echo -n "Arquivando: $basename... "
            
            # Mover para archived/
            mv "$file" "src/components/editor/blocks/archived/$basename"
            echo -e "${GREEN}✅ ARQUIVADO${NC}"
            SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        fi
    done
    
    # Criar README no diretório archived
    cat > "src/components/editor/blocks/archived/README.md" << 'EOF'
# 📦 Arquivos Arquivados

Estes arquivos foram movidos para cá porque:
- São stubs incompletos (apenas funções utilitárias)
- Não implementam componentes React funcionais
- Causavam confusão durante desenvolvimento

## Funções Utilitárias

Se precisar das funções `getMarginClass()` destes arquivos:
- ✅ USE: `src/utils/tailwindHelpers.ts` (centralizado)

## Data de Arquivamento
13 de Outubro de 2025

## Remoção Planejada
Versão 4.0 (Janeiro 2026)
EOF
    
    echo ""
    echo "📊 Resultado: ✅ $SUCCESS_COUNT arquivos movidos"
}

# ============================================================================
# FUNÇÃO 4: Formatação automática com Prettier
# ============================================================================
format_code() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✨ TAREFA 4: Formatar código com Prettier"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    echo "Formatando arquivos TypeScript/React..."
    npx prettier --write "src/**/*.{ts,tsx}" --log-level silent && \
        echo -e "${GREEN}✅ Código formatado${NC}" || \
        echo -e "${YELLOW}⚠️  Prettier não disponível${NC}"
}

# ============================================================================
# MENU INTERATIVO
# ============================================================================
show_menu() {
    echo ""
    echo "Escolha as tarefas para executar:"
    echo ""
    echo "  1) Remover @ts-nocheck de arquivos simples"
    echo "  2) Adicionar @deprecated em serviços duplicados"
    echo "  3) Arquivar arquivos stub incompletos"
    echo "  4) Formatar código com Prettier"
    echo "  5) EXECUTAR TODAS"
    echo "  0) Sair"
    echo ""
    read -p "Opção: " choice
    
    case $choice in
        1)
            remove_ts_nocheck
            ;;
        2)
            add_deprecation_tags
            ;;
        3)
            archive_stub_files
            ;;
        4)
            format_code
            ;;
        5)
            remove_ts_nocheck
            add_deprecation_tags
            archive_stub_files
            format_code
            ;;
        0)
            echo "Saindo..."
            exit 0
            ;;
        *)
            echo -e "${RED}Opção inválida${NC}"
            show_menu
            ;;
    esac
}

# ============================================================================
# EXECUÇÃO PRINCIPAL
# ============================================================================

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script no diretório raiz do projeto${NC}"
    exit 1
fi

# Criar backup de segurança
echo "📦 Criando backup de segurança..."
git add -A
git stash push -m "Backup antes de limpeza em lote - $(date)"

# Mostrar menu
show_menu

# Resumo final
echo ""
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                         ✅ LIMPEZA CONCLUÍDA                                ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Estatísticas:"
echo "   ✅ Sucessos: $SUCCESS_COUNT"
echo "   ❌ Falhas: $FAIL_COUNT"
echo "   ⏭️  Ignorados: $SKIP_COUNT"
echo ""
echo "💡 Próximos passos:"
echo "   1. Revisar mudanças: git diff"
echo "   2. Testar aplicação: npm run dev"
echo "   3. Commit mudanças: git add -A && git commit -m 'chore: limpeza automática em lote'"
echo ""
echo "🔄 Para reverter: git stash pop"
echo ""
