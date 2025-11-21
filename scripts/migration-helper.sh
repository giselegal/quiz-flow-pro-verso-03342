#!/bin/bash
# 🚀 MIGRATION HELPER - Quick Win Automation
# 
# Automatiza passos de migração do plano de otimização
# 
# Usage:
#   ./scripts/migration-helper.sh verify    # Verifica estado atual
#   ./scripts/migration-helper.sh migrate   # Migra imports
#   ./scripts/migration-helper.sh cleanup   # Remove @ts-nocheck
#   ./scripts/migration-helper.sh all       # Executa tudo

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verify current state
verify_state() {
    print_header "📊 VERIFICANDO ESTADO ATUAL"
    
    echo "Verificando imports deprecated..."
    npx tsx scripts/verify-imports.ts
    
    echo -e "\nVerificando diretivas TypeScript..."
    npx tsx scripts/cleanup-ts-nocheck.ts --dry-run
    
    echo -e "\nContando arquivos por tipo:"
    echo "  • Total de arquivos .ts/.tsx: $(find src -name "*.ts" -o -name "*.tsx" | wc -l)"
    echo "  • Com @ts-nocheck: $(grep -r "@ts-nocheck" src --include="*.ts" --include="*.tsx" | wc -l)"
    echo "  • Com @ts-ignore: $(grep -r "@ts-ignore" src --include="*.ts" --include="*.tsx" | wc -l)"
    echo "  • Arquivos deprecated: $(find src -name "*.deprecated.*" | wc -l)"
    
    print_success "Verificação concluída!"
}

# Migrate imports
migrate_imports() {
    print_header "🔄 MIGRANDO IMPORTS PARA CANÔNICOS"
    
    print_warning "Esta operação modificará arquivos!"
    echo "Pressione ENTER para continuar ou Ctrl+C para cancelar..."
    read
    
    # Backup
    print_warning "Criando backup..."
    git stash push -m "backup-before-migration-$(date +%s)"
    
    # Executar migração
    npx tsx scripts/verify-imports.ts --fix
    
    print_success "Migração concluída!"
    print_warning "Execute 'npm run build' para verificar se tudo está OK"
}

# Cleanup TypeScript
cleanup_typescript() {
    print_header "🧹 LIMPANDO DIRETIVAS TYPESCRIPT"
    
    print_warning "Esta operação modificará arquivos!"
    echo "Pressione ENTER para continuar ou Ctrl+C para cancelar..."
    read
    
    # Backup
    print_warning "Criando backup..."
    git stash push -m "backup-before-cleanup-$(date +%s)"
    
    # Executar limpeza
    npx tsx scripts/cleanup-ts-nocheck.ts --clean
    
    print_success "Limpeza concluída!"
    print_warning "Execute 'npm run build' e 'npm test' para verificar"
}

# Archive deprecated files
archive_deprecated() {
    print_header "🗄️  ARQUIVANDO ARQUIVOS DEPRECATED"
    
    # Criar pasta archive se não existir
    mkdir -p archive/deprecated
    
    echo "Movendo arquivos .deprecated para archive/..."
    find src -name "*.deprecated.*" -type f | while read file; do
        echo "  Movendo: $file"
        git mv "$file" "archive/deprecated/" 2>/dev/null || mv "$file" "archive/deprecated/"
    done
    
    print_success "Arquivos deprecated movidos para archive/"
}

# Run all migrations
run_all() {
    print_header "🚀 EXECUTANDO MIGRAÇÃO COMPLETA"
    
    verify_state
    
    echo -e "\n${YELLOW}Iniciando migração em 5 segundos... (Ctrl+C para cancelar)${NC}"
    sleep 5
    
    migrate_imports
    cleanup_typescript
    archive_deprecated
    
    print_header "🎉 MIGRAÇÃO COMPLETA"
    print_success "Todas as etapas executadas!"
    
    echo -e "\n${YELLOW}PRÓXIMOS PASSOS:${NC}"
    echo "1. Execute: npm run build"
    echo "2. Execute: npm run test"
    echo "3. Teste manualmente a aplicação"
    echo "4. Se tudo OK: git add . && git commit -m 'refactor: Quick Wins implementation'"
    echo "5. Se algo quebrou: git stash pop (restaura backup)"
}

# Main
case "$1" in
    verify)
        verify_state
        ;;
    migrate)
        migrate_imports
        ;;
    cleanup)
        cleanup_typescript
        ;;
    archive)
        archive_deprecated
        ;;
    all)
        run_all
        ;;
    *)
        echo "Usage: $0 {verify|migrate|cleanup|archive|all}"
        echo ""
        echo "Commands:"
        echo "  verify   - Verifica estado atual (safe, não modifica nada)"
        echo "  migrate  - Migra imports para serviços canônicos"
        echo "  cleanup  - Remove @ts-nocheck/@ts-ignore quando possível"
        echo "  archive  - Move arquivos deprecated para archive/"
        echo "  all      - Executa todas as etapas"
        exit 1
esac
